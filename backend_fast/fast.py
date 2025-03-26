from fastapi import FastAPI, APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload, joinedload
from sqlalchemy import and_, exists
from datetime import date
from sqlalchemy.sql import func, select, case
from typing import Optional, List

from models import (
    User,
    Content,
    Tags,
    Like,
    RemovedFavorite,
    UserCategoryPreference,
    SessionLocal,
    MacroCategory,
)
from schemas import ContentSchema, TagsResponseSchema, TagSchema

app = FastAPI()
router = APIRouter(prefix="/api/v1", tags=["contents"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_date_filter(date_start: date, date_end: date):
    q_filter = []

    if date_start and date_end:
        q_filter.append(Content.date_start <= date_end)
        q_filter.append(Content.date_end >= date_start)
    elif date_start:
        q_filter.append(Content.date_start >= date_start)
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


@router.get("/contents_feed", response_model=list[ContentSchema])
def get_content_for_feed(
    username: str,
    date_start: date | None = None,
    date_end: date | None = None,
    db: Session = Depends(get_db),
):
    q_filter = create_date_filter(date_start, date_end)
    current_user = db.query(User).filter(User.username == username).first()

    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")

    preferred_tags_subquery = (
        db.query(UserCategoryPreference.tag_id)
        .filter(UserCategoryPreference.user_id == current_user.id)
        .subquery()
    )
    excluded_content_subquery = create_filter_excluded_contend(db, current_user)
    content_query = (
        db.query(Content)
        .filter(and_(*q_filter))
        .filter(~Content.id.in_(select(excluded_content_subquery)))
        .options(selectinload(Content.tags))
    )

    if db.query(preferred_tags_subquery).count() > 0:
        content_query = content_query.filter(
            Content.tags.any(Tags.id.in_(select(preferred_tags_subquery)))
        )

    return content_query.all()


@app.get("/api/v1/tags", response_model=TagsResponseSchema)
def get_tags(username: str, macro_category: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()

    if not user:
        return TagsResponseSchema(tags=[], preferences=[])

    macro_category_obj = (
        db.query(MacroCategory).filter(MacroCategory.name == macro_category).first()
    )

    if not macro_category_obj:
        return TagsResponseSchema(tags=[], preferences=[])

    liked_content_ids = (
        db.query(Like.content_id).filter(Like.user_id == user.id).subquery()
    )
    removed_content_ids = (
        db.query(RemovedFavorite.content_id)
        .filter(RemovedFavorite.user_id == user.id)
        .subquery()
    )
    tags_query = (
        db.query(
            Tags.id,
            Tags.name,
            Tags.description,
            func.coalesce(
                func.count(Content.id)
                - func.count(case((Content.id.in_(liked_content_ids), Content.id)))
                - func.count(case((Content.id.in_(removed_content_ids), Content.id))),
                0,
            ).label("content_count"),
        )
        .outerjoin(Tags.contents)
        .filter(Tags.macro_category_id == macro_category_obj.id)
        .group_by(Tags.id, Tags.name, Tags.description)
    )
    tags = tags_query.all()
    preferences = (
        db.query(UserCategoryPreference.tag_id)
        .filter(UserCategoryPreference.user_id == user.id)
        .all()
    )

    return TagsResponseSchema(
        tags=[
            TagSchema(
                id=tag.id,
                name=tag.name,
                description=tag.description,
                count=tag.content_count,
            )
            for tag in tags
        ],
        preferences=[p.tag_id for p in preferences],
    )


@app.get("/api/v1/contents", response_model=List[ContentSchema])
def get_content(
    username: str,
    tag: Optional[str] = None,
    date_start: Optional[date] = None,
    date_end: Optional[date] = None,
    db: Session = Depends(get_db),
) -> List[ContentSchema]:
    q_filter = create_date_filter(date_start, date_end)
    q_filter.append(Content.tags.any(Tags.name == tag))
    current_user = db.query(User).filter(User.username == username).first()

    if not current_user:
        user = User(username=username)
        db.add(user)
        db.commit()
        db.refresh(user)

    excluded_content_subquery = create_filter_excluded_contend(db, current_user)
    content_query = (
        db.query(Content)
        .filter(and_(*q_filter))
        .filter(~Content.id.in_(select(excluded_content_subquery)))
        .options(selectinload(Content.tags))
    )

    return content_query.all()


@router.get("/contents/liked", response_model=list[ContentSchema])
def get_liked_content(
    username: str,
    date_start: date | None = None,
    date_end: date | None = None,
    value: bool = True,
    db: Session = Depends(get_db),
) -> list[ContentSchema]:
    user_id = db.query(User.id).filter(User.username == username).scalar()

    if not user_id:
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
        macro_category = item.tags[0].macro_category.name if item.tags else None
        item.macro_category = macro_category

    return content


app.include_router(router)
