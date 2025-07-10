from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, func, case
from typing import Optional, List
from datetime import date
from models import get_db, Content, Tags, User
from schemas import (
    ContentSchema,
    EventType,
    SearchResponseSchema,
    SearchSuggestionsSchema,
    PopularTagsResponseSchema,
    PopularTagSchema,
)
from loguru import logger

router_search = APIRouter(prefix="/api/v1", tags=["search"])


def build_text_search_filter(search_query: str):
    """
    Создает фильтр для поиска по отдельным словам
    """
    # Разбиваем запрос на отдельные слова и очищаем их
    logger.info("Splitting search query into words and cleaning them")
    words = [word.strip().lower() for word in search_query.split() if word.strip()]

    if not words:
        logger.info("No words found in search query")
        return None

    # Создаем условия для каждого слова
    logger.info("Creating conditions for each word")
    word_conditions = []
    for word in words:
        word_pattern = f"%{word}%"
        word_condition = or_(
            func.lower(Content.name).like(word_pattern),
            func.lower(Content.description).like(word_pattern),
            func.lower(Content.location).like(word_pattern),
        )
        word_conditions.append(word_condition)

    # Все слова должны быть найдены (AND между словами)
    return and_(*word_conditions)


def build_relevance_order(search_query: str):
    """
    Создает сортировку по релевантности на основе поискового запроса
    """
    logger.info("Splitting search query into words and cleaning them")
    words = [word.strip().lower() for word in search_query.split() if word.strip()]

    if not words:
        return Content.date_start.asc().nullslast()

    # Считаем релевантность:
    # - Совпадение в названии = 10 баллов за слово
    # - Совпадение в описании = 3 балла за слово
    # - Совпадение в локации = 5 баллов за слово
    logger.info("Calculating relevance score")
    relevance_score = 0

    for word in words:
        word_pattern = f"%{word}%"
        relevance_score += case(
            (func.lower(Content.name).like(word_pattern), 10), else_=0
        )
        relevance_score += case(
            (func.lower(Content.description).like(word_pattern), 3), else_=0
        )
        relevance_score += case(
            (func.lower(Content.location).like(word_pattern), 5), else_=0
        )

    # Сортируем по релевантности (убывание), потом по дате (возрастание)
    logger.info("Sorting by relevance score and date")
    return [relevance_score.desc(), Content.date_start.asc().nullslast()]


@router_search.get("/search", response_model=SearchResponseSchema)
def search_content(
    q: Optional[str] = Query(None, description="Поисковый запрос"),
    city: Optional[str] = Query(None, description="Город"),
    event_type: Optional[EventType] = Query(None, description="Тип мероприятия"),
    date_from: Optional[date] = Query(None, description="Дата начала (от)"),
    date_to: Optional[date] = Query(None, description="Дата окончания (до)"),
    tags: Optional[List[int]] = Query(None, description="ID тегов"),
    skip: int = Query(0, ge=0, description="Пропустить записей"),
    limit: int = Query(20, ge=1, le=100, description="Количество записей"),
    username: Optional[str] = Query(
        None, description="Имя пользователя для фильтрации по городу"
    ),
    db: Session = Depends(get_db),
):
    """
    Поиск контента по различным критериям:
    - q: поиск по отдельным словам в названии, описании и локации
    - city: фильтр по городу
    - event_type: фильтр по типу мероприятия (online/offline)
    - date_from/date_to: фильтр по датам
    - tags: фильтр по тегам
    - skip/limit: пагинация
    - username: для фильтрации по городу пользователя

    Поиск работает по принципу "И" между словами:
    "джаз концерт" найдет события, где есть И "джаз" И "концерт"
    """

    # Определяем город для фильтрации
    filter_city = city

    if username:
        logger.info(f"Getting user city for username: {username}")
        user = db.query(User).filter(User.username == username).first()
        if user:
            filter_city = user.city
            logger.info(f"User {username} city: {filter_city}")
        else:
            logger.warning(f"User {username} not found")

    # Базовый запрос
    logger.info("Building base query")
    query = db.query(Content)

    # Поиск по тексту (улучшенный поиск по словам)
    logger.info("Building text search filter")
    if q and q.strip():
        text_filter = build_text_search_filter(q.strip())
        if text_filter is not None:
            query = query.filter(text_filter)

    # Фильтр по городу (явно указанный или город пользователя)
    if filter_city:
        logger.info(f"Filtering by city: {filter_city}")
        query = query.filter(Content.city == filter_city)

    # Фильтр по типу мероприятия
    if event_type:
        logger.info(f"Filtering by event type: {event_type}")
        query = query.filter(Content.event_type == event_type.value)

    # Фильтр по датам
    if date_from:
        logger.info(f"Filtering by date from: {date_from}")
        query = query.filter(
            or_(
                Content.date_start >= date_from,
                and_(Content.date_start.is_(None), Content.date_end >= date_from),
            )
        )

    if date_to:
        logger.info(f"Filtering by date to: {date_to}")
        query = query.filter(
            or_(
                Content.date_start <= date_to,
                Content.date_end <= date_to,
                and_(Content.date_start.is_(None), Content.date_end.is_(None)),
            )
        )

    # Фильтр по тегам
    if tags:
        logger.info(f"Filtering by tags: {tags}")
        query = query.join(Content.tags).filter(Tags.id.in_(tags))

    # Сортировка по релевантности и дате
    if q and q.strip():
        # При поиске сортируем по релевантности
        logger.info("Sorting by relevance score and date")
        order_clauses = build_relevance_order(q.strip())
        query = query.order_by(*order_clauses)
    else:
        # Без поиска сортируем по дате
        logger.info("Sorting by date")
        query = query.order_by(Content.date_start.asc().nullslast())

    # Подсчет общего количества
    logger.info("Counting total count")
    total_count = query.count()

    # Применяем пагинацию
    logger.info("Applying pagination")
    contents = query.offset(skip).limit(limit).all()

    # Преобразуем в схемы
    content_schemas = []
    for content in contents:
        # Получаем макрокатегорию для контента
        logger.info("Getting macro category for content")
        macro_category = None
        if content.tags:
            first_tag = content.tags[0]
            if first_tag.macro_category:
                macro_category = first_tag.macro_category.name

        content_schema = ContentSchema.model_validate(content)
        content_schema.macro_category = macro_category
        content_schemas.append(content_schema)

    logger.info("Returning search response")
    return SearchResponseSchema(
        contents=content_schemas,
        total_count=total_count,
        skip=skip,
        limit=limit,
        has_more=(skip + limit) < total_count,
        search_params={
            "q": q,
            "city": city,
            "event_type": event_type,
            "date_from": date_from,
            "date_to": date_to,
            "tags": tags,
        },
    )


@router_search.get("/search/suggestions", response_model=SearchSuggestionsSchema)
def get_search_suggestions(
    q: str = Query(
        ..., min_length=2, description="Поисковый запрос (минимум 2 символа)"
    ),
    limit: int = Query(10, ge=1, le=20, description="Количество подсказок"),
    username: Optional[str] = Query(
        None, description="Имя пользователя для фильтрации по городу"
    ),
    db: Session = Depends(get_db),
):
    """
    Получить подсказки для поиска на основе названий мероприятий
    с учетом города пользователя (если передан username)
    """

    filter_city = None

    if username:
        logger.info(f"Getting user city for username: {username}")
        user = db.query(User).filter(User.username == username).first()
        if user:
            filter_city = user.city
            logger.info(f"User {username} city: {filter_city}")
        else:
            logger.warning(f"User {username} not found")

    # Берем последнее слово для подсказок (как в Google)
    logger.info("Getting last word for suggestions")
    words = q.strip().split()
    if not words:
        logger.info("No words found in search query")
        return SearchSuggestionsSchema(suggestions=[], query=q)

    last_word = words[-1].lower()
    search_term = f"%{last_word}%"

    # Ищем совпадения в названиях
    logger.info("Searching for suggestions")
    suggestions_query = db.query(Content.name).filter(
        func.lower(Content.name).like(search_term)
    )

    # Фильтруем по городу пользователя, если он определен
    if filter_city:
        logger.info(f"Filtering suggestions by city: {filter_city}")
        suggestions_query = suggestions_query.filter(Content.city == filter_city)

    suggestions = suggestions_query.distinct().limit(limit).all()

    return SearchSuggestionsSchema(
        suggestions=[suggestion[0] for suggestion in suggestions], query=q
    )


@router_search.get("/search/popular-tags", response_model=PopularTagsResponseSchema)
def get_popular_search_tags(
    limit: int = Query(10, ge=1, le=50, description="Количество популярных тегов"),
    db: Session = Depends(get_db),
):
    """
    Получить популярные теги для поиска (по количеству связанного контента)
    """
    logger.info("Getting popular search tags")
    popular_tags = (
        db.query(Tags, func.count(Content.id).label("content_count"))
        .join(Tags.contents)
        .group_by(Tags.id)
        .order_by(func.count(Content.id).desc())
        .limit(limit)
        .all()
    )

    popular_tags_list = [
        PopularTagSchema(
            id=tag.id, name=tag.name, description=tag.description, content_count=count
        )
        for tag, count in popular_tags
    ]

    return PopularTagsResponseSchema(popular_tags=popular_tags_list)
