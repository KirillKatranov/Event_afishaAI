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

router_reviews = APIRouter(prefix="/api/v1", tags=["reviews"])


@router_reviews.post("/reviews", response_model=ReviewResponseSchema, status_code=201)
def create_review(review_data: ReviewCreateSchema, db: Session = Depends(get_db)):
    """
    Создание нового отзыва к мероприятию
    """
    # Проверяем существование пользователя
    user = db.query(User).filter(User.username == review_data.username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Проверяем существование контента
    content = db.query(Content).filter(Content.id == review_data.content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    # Создаем отзыв
    review = Review(
        user_id=user.id, content_id=review_data.content_id, text=review_data.text
    )

    db.add(review)
    db.commit()
    db.refresh(review)

    # Формируем ответ с именем пользователя
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
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Ищем отзыв
    review = (
        db.query(Review)
        .filter(Review.id == review_id, Review.user_id == user.id)
        .first()
    )

    if not review:
        raise HTTPException(
            status_code=404,
            detail="Review not found or you don't have permission to delete it",
        )

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
    content = db.query(Content).filter(Content.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    # Получаем отзывы с информацией о пользователях
    reviews_query = (
        db.query(Review)
        .filter(Review.content_id == content_id)
        .options(joinedload(Review.user))
        .order_by(Review.created.desc())
    )

    # Подсчитываем общее количество
    total_count = reviews_query.count()

    # Применяем пагинацию
    reviews = reviews_query.offset(skip).limit(limit).all()

    # Формируем ответ
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
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Получаем отзывы пользователя с информацией о контенте
    reviews_query = (
        db.query(Review)
        .filter(Review.user_id == user.id)
        .options(joinedload(Review.content))
        .order_by(Review.created.desc())
    )

    # Подсчитываем общее количество
    total_count = reviews_query.count()

    # Применяем пагинацию
    reviews = reviews_query.offset(skip).limit(limit).all()

    # Формируем ответ
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
