from fastapi import FastAPI, APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select, and_
from datetime import date

from models import (
    User,
    Content,
    Tags,
    Like,
    RemovedFavorite,
    UserCategoryPreference,
    SessionLocal,
)
from schemas import ContentSchema

app = FastAPI()
router = APIRouter(prefix="/api/v1", tags=["contents"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/contents_feed", response_model=list[ContentSchema])
def get_content_for_feed(
    username: str,
    date_start: date | None = None,
    date_end: date | None = None,
    db: Session = Depends(get_db),
):
    # Фильтрация по датам
    q_filter = []
    if date_start:
        q_filter.append(Content.date_start >= date_start)
    if date_end:
        q_filter.append(Content.date_start <= date_end)

    # Поиск пользователя
    current_user = db.query(User).filter(User.username == username).first()
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Предпочитаемые теги (subquery)
    preferred_tags_subquery = (
        db.query(UserCategoryPreference.tag_id)
        .filter(UserCategoryPreference.user_id == current_user.id)
        .subquery()
    )

    # Контент, который пользователь уже лайкнул или удалил (subquery)
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

    # Основной запрос для контента
    content_query = (
        db.query(Content)
        .filter(and_(*q_filter))
        .filter(~Content.id.in_(select(excluded_content_subquery)))
        .options(selectinload(Content.tags))
    )

    # Проверяем, есть ли предпочтения у пользователя
    if db.query(preferred_tags_subquery).count() > 0:
        content_query = content_query.filter(
            Content.tags.any(Tags.id.in_(select(preferred_tags_subquery)))
        )

    return content_query.all()


app.include_router(router)
