from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
)
from sqlalchemy.orm import Session, joinedload

from models import (
    User,
    Content,
    Review,
    get_db,
)
from schemas import (
    ReviewCreateSchema,
    ReviewResponseSchema,
    ReviewListResponseSchema,
)
from loguru import logger

# logger.add("logs/reviews.log", rotation="500 MB", level="INFO", compression="zip")

router_reviews = APIRouter(prefix="/api/v1", tags=["reviews"])


@router_reviews.post("/reviews", response_model=ReviewResponseSchema, status_code=201)
def create_review(review_data: ReviewCreateSchema, db: Session = Depends(get_db)):
    """
    Создание нового отзыва к мероприятию
    """
    # Проверяем существование пользователя
    logger.info("Checking if user exists")
    user = db.query(User).filter(User.username == review_data.username).first()
    if not user:
        logger.info("User not found")
        raise HTTPException(status_code=404, detail="User not found")

    # Проверяем существование контента
    logger.info("Checking if content exists")
    content = db.query(Content).filter(Content.id == review_data.content_id).first()
    if not content:
        logger.info("Content not found")
        raise HTTPException(status_code=404, detail="Content not found")

    # Создаем отзыв
    logger.info("Creating review")
    review = Review(
        user_id=user.id, content_id=review_data.content_id, text=review_data.text
    )

    db.add(review)
    db.commit()
    db.refresh(review)

    # Формируем ответ с именем пользователя
    logger.info("Forming response with username")
    response = ReviewResponseSchema(
        id=review.id,
        user_id=review.user_id,
        content_id=review.content_id,
        text=review.text,
        created=review.created,
        updated=review.updated,
        username=user.username,
    )

    return response


@router_reviews.delete("/reviews/{review_id}", status_code=204)
def delete_review(
    review_id: int,
    username: str = Query(..., description="Username of the review author"),
    db: Session = Depends(get_db),
):
    """
    Удаление отзыва (только автор может удалить свой отзыв)
    """
    # Проверяем существование пользователя
    logger.info("Checking if user exists")
    user = db.query(User).filter(User.username == username).first()
    if not user:
        logger.info("User not found")
        raise HTTPException(status_code=404, detail="User not found")

    # Ищем отзыв
    logger.info("Searching for review")
    review = (
        db.query(Review)
        .filter(Review.id == review_id, Review.user_id == user.id)
        .first()
    )

    if not review:
        logger.info("Review not found or you don't have permission to delete it")
        raise HTTPException(
            status_code=404,
            detail="Review not found or you don't have permission to delete it",
        )

    logger.info("Deleting review")
    db.delete(review)
    db.commit()

    return {"message": "Review deleted successfully"}


@router_reviews.get("/reviews", response_model=ReviewListResponseSchema)
def get_reviews_for_content(
    content_id: int = Query(..., description="ID of the content to get reviews for"),
    skip: int = Query(default=0, ge=0, description="Number of reviews to skip"),
    limit: int = Query(
        default=10, ge=1, le=100, description="Number of reviews to return"
    ),
    db: Session = Depends(get_db),
):
    """
    Получение всех отзывов для конкретного мероприятия
    """
    # Проверяем существование контента
    logger.info("Checking if content exists")
    content = db.query(Content).filter(Content.id == content_id).first()
    if not content:
        logger.info("Content not found")
        raise HTTPException(status_code=404, detail="Content not found")

    # Получаем отзывы с информацией о пользователях
    logger.info("Getting reviews for content")
    reviews_query = (
        db.query(Review)
        .filter(Review.content_id == content_id)
        .options(joinedload(Review.user))
        .order_by(Review.created.desc())
    )

    # Подсчитываем общее количество
    logger.info("Counting total count")
    total_count = reviews_query.count()

    # Применяем пагинацию
    logger.info("Applying pagination")
    reviews = reviews_query.offset(skip).limit(limit).all()

    # Формируем ответ
    logger.info("Forming response")
    review_responses = []
    for review in reviews:
        review_responses.append(
            ReviewResponseSchema(
                id=review.id,
                user_id=review.user_id,
                content_id=review.content_id,
                text=review.text,
                created=review.created,
                updated=review.updated,
                username=review.user.username,
            )
        )

    return ReviewListResponseSchema(reviews=review_responses, total_count=total_count)


@router_reviews.get(
    "/users/{username}/reviews", response_model=ReviewListResponseSchema
)
def get_user_reviews(
    username: str,
    skip: int = Query(default=0, ge=0, description="Number of reviews to skip"),
    limit: int = Query(
        default=10, ge=1, le=100, description="Number of reviews to return"
    ),
    db: Session = Depends(get_db),
):
    """
    Получение всех отзывов конкретного пользователя
    """
    # Проверяем существование пользователя
    logger.info("Checking if user exists")
    user = db.query(User).filter(User.username == username).first()
    if not user:
        logger.warning("User not found")
        raise HTTPException(status_code=404, detail="User not found")

    # Получаем отзывы пользователя с информацией о контенте
    logger.info("Getting reviews for user")
    reviews_query = (
        db.query(Review)
        .filter(Review.user_id == user.id)
        .options(joinedload(Review.content))
        .order_by(Review.created.desc())
    )

    # Подсчитываем общее количество
    logger.info("Counting total count")
    total_count = reviews_query.count()

    # Применяем пагинацию
    logger.info("Applying pagination")
    reviews = reviews_query.offset(skip).limit(limit).all()

    # Формируем ответ
    logger.info("Forming response")
    review_responses = []
    for review in reviews:
        review_responses.append(
            ReviewResponseSchema(
                id=review.id,
                user_id=review.user_id,
                content_id=review.content_id,
                text=review.text,
                created=review.created,
                updated=review.updated,
                username=username,
            )
        )

    return ReviewListResponseSchema(reviews=review_responses, total_count=total_count)
