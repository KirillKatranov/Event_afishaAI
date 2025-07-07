from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    File,
    UploadFile,
    Form,
)
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, exists
from datetime import date, datetime
from sqlalchemy.sql import select
from typing import Optional, List
import json
from io import BytesIO

from models import (
    User,
    Content,
    Tags,
    Like,
    RemovedFavorite,
    UserCategoryPreference,
    get_db,
    Organisation,
    EventType,
    PublisherType,
)
from utils.minio_utils import minio_client, bucket_name
from schemas import (
    ContentSchema,
    UserSchema,
)
from loguru import logger

router_contents = APIRouter(prefix="/api/v1", tags=["contents"])


def create_date_filter(date_start: date, date_end: date):
    q_filter = []

    if date_start and date_end:
        q_filter.append(Content.date_start <= date_end)
        q_filter.append(Content.date_end >= date_start)
    elif date_start:
        q_filter.append(Content.date_start == date_start)
    elif date_end:
        q_filter.append(Content.date_end <= date_end)

    return q_filter


def create_filter_excluded_contend(db, current_user):
    excluded_content_subquery = (
        db.query(Like.content_id)
        .filter(Like.user_id == current_user.id)
        .union(
            db.query(RemovedFavorite.content_id).filter(
                RemovedFavorite.user_id == current_user.id
            )
        )
        .subquery()
    )
    return excluded_content_subquery


@router_contents.get("/contents_feed", response_model=list[ContentSchema])
def get_content_for_feed(
    username: str,
    date_start: date | None = None,
    date_end: date | None = None,
    db: Session = Depends(get_db),
):
    logger.info(f"Fetching content for feed for user: {username}")

    q_filter = create_date_filter(date_start, date_end)
    current_user = db.query(User).filter(User.username == username).first()

    if not current_user:
        logger.warning(f"User {username} not found")
        raise HTTPException(status_code=404, detail="User not found")

    logger.info(f"User {username} found, applying filters for content feed")

    preferred_tags_subquery = (
        db.query(UserCategoryPreference.tag_id)
        .filter(UserCategoryPreference.user_id == current_user.id)
        .subquery()
    )
    excluded_content_subquery = create_filter_excluded_contend(db, current_user)
    content_query = (
        db.query(Content)
        .filter(and_(*q_filter))
        .filter(Content.city == current_user.city)
        .filter(~Content.id.in_(select(excluded_content_subquery)))
        .options(joinedload(Content.tags).joinedload(Tags.macro_category))
    )

    if db.query(preferred_tags_subquery).count() > 0:
        content_query = content_query.filter(
            Content.tags.any(Tags.id.in_(select(preferred_tags_subquery)))
        )

    contents = content_query.all()

    # Добавляем macro_category для каждого контента
    for content in contents:
        if content.tags and content.tags[0].macro_category:
            content.macro_category = content.tags[0].macro_category.name
        else:
            content.macro_category = None

    logger.info(f"Returning {len(contents)} contents for feed for user: {username}")

    return contents


@router_contents.get("/contents", response_model=List[ContentSchema])
def get_content(
    username: str,
    tag: Optional[str] = None,
    date_start: Optional[date] = None,
    date_end: Optional[date] = None,
    db: Session = Depends(get_db),
) -> List[ContentSchema]:
    logger.info(f"Fetching content for user: {username} with tag: {tag}")

    q_filter = create_date_filter(date_start, date_end)
    q_filter.append(Content.tags.any(Tags.name == tag))
    current_user = db.query(User).filter(User.username == username).first()

    if not current_user:
        logger.warning(f"User {username} not found")
        raise HTTPException(status_code=404, detail="User not found")

    if current_user.city:
        q_filter.append(Content.city == current_user.city)

    excluded_content_subquery = create_filter_excluded_contend(db, current_user)
    content_query = (
        db.query(Content)
        .filter(and_(*q_filter))
        .filter(~Content.id.in_(select(excluded_content_subquery)))
        .options(joinedload(Content.tags).joinedload(Tags.macro_category))
    )

    contents = content_query.all()

    # Добавляем macro_category для каждого контента
    for content in contents:
        if content.tags and content.tags[0].macro_category:
            content.macro_category = content.tags[0].macro_category.name
        else:
            content.macro_category = None

    logger.info(
        f"Returning {len(contents)} contents for user: {username} with tag: {tag}"
    )

    return contents


@router_contents.get("/contents/liked", response_model=list[ContentSchema])
def get_liked_content(
    username: str,
    date_start: date | None = None,
    date_end: date | None = None,
    value: bool = True,
    db: Session = Depends(get_db),
) -> list[ContentSchema]:
    logger.info(f"Fetching liked content for user: {username}")

    user_id = db.query(User.id).filter(User.username == username).scalar()

    if not user_id:
        logger.warning(f"User {username} not found")
        raise HTTPException(status_code=404, detail="User not found")

    likes_subquery = (
        db.query(Like.content_id, Like.created)
        .filter(
            Like.user_id == user_id,
            Like.value.is_(value),
            Like.content_id == Content.id,
        )
        .subquery()
    )
    likes_exists = (
        exists().where(likes_subquery.c.content_id == Content.id).correlate(Content)
    )
    date_filters = create_date_filter(date_start, date_end)
    filters = [likes_exists] + date_filters if date_filters else [likes_exists]
    content_query = (
        db.query(Content)
        .filter(*filters)
        .options(joinedload(Content.tags).joinedload(Tags.macro_category))
        .options(joinedload(Content.tags).joinedload(Tags.macro_category))
        .join(likes_subquery, Content.id == likes_subquery.c.content_id)
        .order_by(likes_subquery.c.created.desc())
    )
    content = content_query.all()

    for item in content:
        if item.tags and item.tags[0].macro_category:
            macro_category = item.tags[0].macro_category.name
        else:
            macro_category = None
        item.macro_category = macro_category

    logger.info(f"Returning {len(content)} liked contents for user: {username}")
    return content


async def upload_file_to_minio(file: UploadFile, object_name: str) -> str:
    """
    Upload a file to MinIO and return the object name
    """
    logger.info(f"Uploading file to MinIO: {object_name}")
    try:
        # Read the file into memory
        file_data = await file.read()
        # Get the file's content type
        content_type = file.content_type or "application/octet-stream"

        # Upload the file to MinIO using BytesIO to create a file-like object
        file_data_io = BytesIO(file_data)

        # Upload the file to MinIO
        minio_client.put_object(
            bucket_name,
            object_name,
            file_data_io,
            length=len(file_data),
            content_type=content_type,
        )

        logger.info(f"File uploaded to MinIO: {object_name}")
        return object_name
    except Exception as e:
        print(f"Error uploading file to MinIO: {e}")
        logger.error(f"Error uploading file to MinIO: {e}")
        raise HTTPException(status_code=500, detail="Error uploading file")
    finally:
        # Reset file pointer for potential future use
        await file.seek(0)


@router_contents.post("/contents", response_model=ContentSchema, status_code=201)
async def create_content(
    username: str,
    name: str = Form(...),
    description: str = Form(...),
    contact: str = Form("[{}]"),  # JSON строка
    date_start: Optional[str] = Form(None),
    date_end: Optional[str] = Form(None),
    time: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    cost: Optional[int] = Form(None),
    city: str = Form("nn"),
    event_type: EventType = Form(EventType.OFFLINE),
    tags: str = Form(...),  # список ID через запятую или одно значение
    publisher_type: PublisherType = Form(...),
    organisation_id: Optional[int] = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
):
    logger.info(f"Creating content for user {username}")

    # Парсим JSON поля
    try:
        contact_dict = json.loads(contact)
        # Преобразуем contact в список словарей, если это не список
        if not isinstance(contact_dict, list):
            contact_dict = [contact_dict] if contact_dict else []
        # Парсим теги
        try:
            # Пробуем распарсить как JSON
            tags_list = json.loads(tags)
            logger.info(f"Tags parsed as JSON: {tags_list}")
            if not isinstance(tags_list, list):
                tags_list = [tags_list]
                logger.info(f"Tags parsed as list: {tags_list}")
        except json.JSONDecodeError:
            # Если не JSON, разбиваем по запятой
            logger.info(f"Tags not JSON, splitting by comma: {tags}")
            tags_list = [int(tag.strip()) for tag in tags.split(",") if tag.strip()]
        except ValueError:
            # Если одиночное значение
            logger.info(f"Tags parsed as single value: {tags}")
            tags_list = [int(tags)]

    except (json.JSONDecodeError, ValueError) as e:
        logger.error(f"Error parsing JSON: {e}")
        raise HTTPException(status_code=400, detail=f"Invalid JSON format: {str(e)}")

    # Преобразуем даты если они предоставлены
    try:
        logger.info(f"Date start: {date_start}, Date end: {date_end}")
        date_start_obj = date.fromisoformat(date_start) if date_start else None
        date_end_obj = date.fromisoformat(date_end) if date_end else None
    except ValueError as e:
        logger.error(f"Error parsing date: {e}")
        raise HTTPException(status_code=400, detail=f"Invalid date format: {str(e)}")

    # Определяем тип публикации и проверяем права
    if publisher_type == "organisation":
        if not organisation_id:
            logger.error("organisation_id is required when publishing as organisation")
            raise HTTPException(
                status_code=400,
                detail="organisation_id is required when publishing as organisation",
            )

        # Проверяем существование пользователя и его права на организацию
        logger.info(
            f"Checking user {username} and his organisation {organisation_id} permissions"
        )
        user = db.query(User).filter(User.username == username).first()
        if not user:
            logger.warning(f"User {username} not found")
            raise HTTPException(status_code=404, detail="User not found")

        organisation = (
            db.query(Organisation)
            .filter(Organisation.id == organisation_id, Organisation.user_id == user.id)
            .first()
        )
        if not organisation:
            logger.warning(
                f"User {username} doesn't have permission to publish content for organisation {organisation_id}"
            )
            raise HTTPException(
                status_code=403,
                detail="You don't have permission to publish content for this organisation",
            )
        publisher_id = organisation_id
    else:  # publisher_type == "user"
        if organisation_id is not None:
            logger.error("organisation_id should not be set when publishing as user")
            raise HTTPException(
                status_code=400,
                detail="organisation_id should not be set when publishing as user",
            )

        # Проверяем существование пользователя
        logger.info(f"Checking user {username}")
        user = db.query(User).filter(User.username == username).first()
        if not user:
            logger.warning(f"User {username} not found")
            raise HTTPException(status_code=404, detail="User not found")
        publisher_id = user.id

    # Проверяем существование всех тегов
    logger.info(f"Checking tags: {tags_list}")
    tags = db.query(Tags).filter(Tags.id.in_(tags_list)).all()
    if len(tags) != len(tags_list):
        logger.warning(f"Some tags not found: {tags_list}")
        raise HTTPException(status_code=400, detail="Some tags not found")

    # Создаем уникальный идентификатор
    unique_id = f"{name}_{publisher_type}_{publisher_id}_{datetime.now().timestamp()}"

    # Обрабатываем загрузку изображения
    logger.info(f"Uploading image: {image}")
    image_path = None
    if image:
        # Проверяем тип файла
        if not image.content_type.startswith("image/"):
            logger.error("File must be an image")
            raise HTTPException(status_code=400, detail="File must be an image")

        # Создаем имя файла и загружаем в MinIO
        file_extension = image.filename.split(".")[-1]
        image_filename = f"{unique_id}.{file_extension}"

        # Загружаем файл в MinIO
        image_path = await upload_file_to_minio(image, image_filename)
        logger.info(f"Image uploaded to MinIO: {image_path}")

    # Создаем новый контент
    db_content = Content(
        name=name,
        description=description,
        contact=contact_dict,
        date_start=date_start_obj,
        date_end=date_end_obj,
        time=time,
        location=location,
        cost=cost,
        city=city,
        event_type=event_type,
        unique_id=unique_id,
        image=image_path,
        publisher_type=publisher_type,
        publisher_id=publisher_id,
        tags=tags,
    )
    logger.info(f"Creating new content: {db_content}")

    db.add(db_content)
    db.commit()
    db.refresh(db_content)

    # Получаем макро-категорию для ответа
    macro_category = None
    if db_content.tags and db_content.tags[0].macro_category:
        macro_category = db_content.tags[0].macro_category.name

    logger.info(f"Content created: {db_content}")
    return ContentSchema.model_validate(
        {
            **db_content.__dict__,
            "tags": tags,
            "macro_category": macro_category,
        }
    )


@router_contents.get("/users/{username}/contents", response_model=List[ContentSchema])
def get_user_contents(
    username: str,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    date_start: Optional[date] = None,
    date_end: Optional[date] = None,
    event_type: Optional[EventType] = None,
    db: Session = Depends(get_db),
):
    # Проверяем существование пользователя
    logger.info(f"Checking user {username}")
    user = db.query(User).filter(User.username == username).first()
    if not user:
        logger.warning(f"User {username} not found")
        raise HTTPException(status_code=404, detail="User not found")

    # Базовый запрос для контента
    query = (
        db.query(Content)
        .options(joinedload(Content.tags).joinedload(Tags.macro_category))
        .filter(
            Content.publisher_type == "user",
            Content.publisher_id == user.id,
        )
    )

    # Применяем фильтры по датам
    logger.info(f"Applying date filters: date_start={date_start}, date_end={date_end}")
    if date_start or date_end:
        date_filters = create_date_filter(date_start, date_end)
        query = query.filter(and_(*date_filters))

    # Фильтр по типу мероприятия
    logger.info(f"Applying event type filter: event_type={event_type}")
    if event_type:
        query = query.filter(Content.event_type == event_type)

    # Применяем пагинацию и сортировку
    logger.info(f"Applying pagination: skip={skip}, limit={limit}")
    contents = (
        query.order_by(Content.date_start.asc().nullslast(), Content.created.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    # Добавляем macro_category для каждого контента
    logger.info("Adding macro_category for each content")
    for content in contents:
        if content.tags and content.tags[0].macro_category:
            content.macro_category = content.tags[0].macro_category.name
        else:
            content.macro_category = None

    logger.info(f"Returning contents: {contents}")
    return contents


@router_contents.delete("/contents/{content_id}", status_code=204)
async def delete_content(content_id: int, username: str, db: Session = Depends(get_db)):
    """
    Удаляет мероприятие.

    Args:
        content_id: ID мероприятия для удаления
        username: имя пользователя, который пытается удалить мероприятие

    Returns:
        204 No Content при успешном удалении

    Raises:
        404: Мероприятие или пользователь не найдены
        403: Нет прав на удаление мероприятия
    """
    # Проверяем существование пользователя
    logger.info(f"Checking user {username}")
    user = db.query(User).filter(User.username == username).first()
    if not user:
        logger.warning(f"User {username} not found")
        raise HTTPException(status_code=404, detail="User not found")

    # Получаем мероприятие с информацией о владельце
    logger.info(f"Fetching content {content_id}")
    content = db.query(Content).filter(Content.id == content_id).first()
    if not content:
        logger.warning(f"Content {content_id} not found")
        raise HTTPException(status_code=404, detail="Content not found")

    # Проверяем права на удаление
    logger.info(
        f"Checking permissions for user {username} to delete content {content_id}"
    )
    if content.publisher_type == PublisherType.USER:
        # Для контента, опубликованного пользователем
        if content.publisher_id != user.id:
            logger.warning(
                f"User {username} doesn't have permission to delete content {content_id}"
            )
            raise HTTPException(
                status_code=403,
                detail="You don't have permission to delete this content",
            )
    else:
        # Для контента, опубликованного организацией
        logger.info(f"Fetching organisation for content {content_id}")
        organisation = (
            db.query(Organisation)
            .filter(
                Organisation.id == content.publisher_id, Organisation.user_id == user.id
            )
            .first()
        )
        if not organisation:
            logger.warning(
                f"User {username} doesn't have permission to delete content {content_id}"
            )
            raise HTTPException(
                status_code=403,
                detail="You don't have permission to delete this content",
            )

    try:
        # Если есть изображение, удаляем его из MinIO
        if content.image:
            logger.info(f"Deleting image from MinIO: {content.image}")
            try:
                # Получаем путь к файлу из полного URL
                image_path = content.image.split(f"{bucket_name}/")[-1]
                minio_client.remove_object(bucket_name, image_path)
                logger.info(f"Image deleted from MinIO: {content.image}")
            except Exception as e:
                # Логируем ошибку, но продолжаем удаление контента
                print(f"Error deleting image from MinIO: {e}")
                logger.error(f"Error deleting image from MinIO: {e}")

        # Удаляем мероприятие из базы данных
        db.delete(content)
        db.commit()
        logger.info(f"Content {content_id} deleted successfully")

        return None  # 204 No Content

    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting content: {e}")
        raise HTTPException(status_code=500, detail=f"Error deleting content: {str(e)}")


@router_contents.get(
    "/content/{content_id}/likes/social", response_model=List[UserSchema]
)
def get_users_who_liked_content(content_id: int, db: Session = Depends(get_db)):
    content = db.query(Content).filter(Content.id == content_id).first()
    if not content:
        logger.warning(f"Content {content_id} not found")
        raise HTTPException(status_code=404, detail="Content not found")

    likes = (
        db.query(User)
        .join(Like, Like.user_id == User.id)
        .filter(Like.content_id == content_id, Like.value == True)  # noqa: E712
        .all()
    )
    logger.info(f"Users who liked content {content_id}: {likes}")
    return likes


@router_contents.get("/contents/{content_id}", response_model=ContentSchema)
def get_content_by_id(content_id: int, db: Session = Depends(get_db)) -> ContentSchema:
    logger.info(f"Получение события с ID {content_id}")

    content = (
        db.query(Content)
        .options(joinedload(Content.tags).joinedload(Tags.macro_category))
        .filter(Content.id == content_id)
        .first()
    )
    if not content:
        logger.warning(f"Событие с ID {content_id} не найдено")
        raise HTTPException(
            status_code=404, detail=f"Событие с ID {content_id} не найдено"
        )

    # Добавляем macro_category
    if content.tags and content.tags[0].macro_category:
        content.macro_category = content.tags[0].macro_category.name
    else:
        content.macro_category = None

    logger.info(f"Событие с ID {content_id} успешно получено")
    return content
