from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from models import get_db, User, Content, Rating
from schemas import RatingCreateSchema, RatingResponseSchema, ContentRatingStatsSchema
from loguru import logger

# logger.add("logs/ratings.log", rotation="500 MB", level="INFO", compression="zip")

router_ratings = APIRouter(prefix="/api/v1", tags=["ratings"])


@router_ratings.post("/ratings", response_model=RatingResponseSchema)
def create_or_update_rating(
    rating_data: RatingCreateSchema, db: Session = Depends(get_db)
):
    """
    Создать или обновить оценку мероприятия пользователем.
    Если пользователь уже оценивал это мероприятие, оценка обновляется.
    """
    # Проверяем существование пользователя
    logger.info("Checking if user exists")
    user = db.query(User).filter(User.username == rating_data.username).first()
    if not user:
        logger.info("User not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден"
        )

    # Проверяем существование контента
    logger.info("Checking if content exists")
    content = db.query(Content).filter(Content.id == rating_data.content_id).first()
    if not content:
        logger.info("Content not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Мероприятие не найдено"
        )

    # Проверяем, есть ли уже оценка от этого пользователя для этого контента
    logger.info("Checking if rating already exists")
    existing_rating = (
        db.query(Rating)
        .filter(Rating.user_id == user.id, Rating.content_id == rating_data.content_id)
        .first()
    )

    if existing_rating:
        # Обновляем существующую оценку
        logger.info("Updating existing rating")
        existing_rating.rating = rating_data.rating
        db.commit()
        db.refresh(existing_rating)

        # Создаем ответ с именем пользователя
        logger.info("Creating response with username")
        return RatingResponseSchema(
            id=existing_rating.id,
            user_id=existing_rating.user_id,
            content_id=existing_rating.content_id,
            rating=existing_rating.rating,
            created=existing_rating.created,
            updated=existing_rating.updated,
            username=user.username,
        )
    else:
        # Создаем новую оценку
        logger.info("Creating new rating")
        new_rating = Rating(
            user_id=user.id,
            content_id=rating_data.content_id,
            rating=rating_data.rating,
        )
        db.add(new_rating)
        db.commit()
        db.refresh(new_rating)

        # Создаем ответ с именем пользователя
        logger.info("Creating response with username")
        return RatingResponseSchema(
            id=new_rating.id,
            user_id=new_rating.user_id,
            content_id=new_rating.content_id,
            rating=new_rating.rating,
            created=new_rating.created,
            updated=new_rating.updated,
            username=user.username,
        )


@router_ratings.get(
    "/ratings/stats/{content_id}", response_model=ContentRatingStatsSchema
)
def get_content_rating_stats(content_id: int, db: Session = Depends(get_db)):
    """
    Получить статистику оценок для конкретного мероприятия:
    - Средняя оценка
    - Общее количество оценок
    - Распределение оценок (сколько раз поставили каждую оценку)
    """
    # Проверяем существование контента
    logger.info("Checking if content exists")
    content = db.query(Content).filter(Content.id == content_id).first()
    if not content:
        logger.info("Content not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Мероприятие не найдено"
        )

    # Получаем все оценки для этого контента
    logger.info("Getting all ratings for content")
    ratings_query = db.query(Rating).filter(Rating.content_id == content_id)

    # Считаем среднюю оценку и общее количество
    logger.info("Calculating average rating and total ratings")
    avg_rating_result = (
        db.query(func.avg(Rating.rating))
        .filter(Rating.content_id == content_id)
        .scalar()
    )
    total_ratings = ratings_query.count()

    # Если нет оценок, возвращаем нули
    if total_ratings == 0:
        logger.info("No ratings found, returning zero values")
        return ContentRatingStatsSchema(
            content_id=content_id,
            average_rating=0.0,
            total_ratings=0,
            ratings_distribution={},
        )

    # Получаем распределение оценок
    logger.info("Getting rating distribution")
    ratings_distribution_query = (
        db.query(Rating.rating, func.count(Rating.rating).label("count"))
        .filter(Rating.content_id == content_id)
        .group_by(Rating.rating)
        .all()
    )

    logger.info("Setting rating distribution")
    ratings_distribution = {
        rating: count for rating, count in ratings_distribution_query
    }

    return ContentRatingStatsSchema(
        content_id=content_id,
        average_rating=round(float(avg_rating_result), 2),
        total_ratings=total_ratings,
        ratings_distribution=ratings_distribution,
    )


@router_ratings.delete("/ratings/{content_id}")
def delete_rating(content_id: int, username: str, db: Session = Depends(get_db)):
    """
    Удалить оценку пользователя для мероприятия
    """
    # Проверяем существование пользователя
    logger.info("Checking if user exists")
    user = db.query(User).filter(User.username == username).first()
    if not user:
        logger.info("User not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден"
        )

    # Ищем оценку
    logger.info("Searching for rating")
    rating = (
        db.query(Rating)
        .filter(Rating.user_id == user.id, Rating.content_id == content_id)
        .first()
    )

    if not rating:
        logger.info("Rating not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Оценка не найдена"
        )

    # Удаляем оценку
    logger.info("Deleting rating")
    db.delete(rating)
    db.commit()

    return {"message": "Оценка успешно удалена"}


@router_ratings.get("/users/{username}/ratings")
def get_user_ratings(
    username: str, skip: int = 0, limit: int = 20, db: Session = Depends(get_db)
):
    """
    Получить все оценки пользователя с пагинацией
    """
    # Проверяем существование пользователя
    logger.info("Checking if user exists")
    user = db.query(User).filter(User.username == username).first()
    if not user:
        logger.info("User not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден"
        )

    # Получаем оценки пользователя с пагинацией
    logger.info("Getting user ratings with pagination")
    ratings_query = db.query(Rating).filter(Rating.user_id == user.id)
    total_count = ratings_query.count()
    ratings = (
        ratings_query.order_by(Rating.created.desc()).offset(skip).limit(limit).all()
    )

    # Формируем ответ с именем пользователя
    logger.info("Formatting response with username")
    ratings_response = []
    for rating in ratings:
        rating_response = RatingResponseSchema(
            id=rating.id,
            user_id=rating.user_id,
            content_id=rating.content_id,
            rating=rating.rating,
            created=rating.created,
            updated=rating.updated,
            username=user.username,
        )
        ratings_response.append(rating_response)

    return {"ratings": ratings_response, "total_count": total_count}
