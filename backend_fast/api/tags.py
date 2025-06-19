from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)
from sqlalchemy.orm import Session
from sqlalchemy.sql import func, case


from models import (
    User,
    Content,
    Tags,
    Like,
    RemovedFavorite,
    UserCategoryPreference,
    MacroCategory,
    get_db,
)
from schemas import (
    TagsResponseSchema,
    TagSchema,
    TagsByMacroCategoryResponseSchema,
    TagWithDetailsSchema,
    MacroCategoryInTagsResponseSchema,
)
from loguru import logger

router_tags = APIRouter(prefix="/api/v1", tags=["tags"])


@router_tags.get("/tags", response_model=TagsResponseSchema)
def get_tags(username: str, macro_category: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()

    if not user:
        logger.warning(f"User {username} not found")
        raise HTTPException(status_code=404, detail="User not found")

    logger.info(f"Getting macro category {macro_category} for user {user.username}")
    macro_category_obj = (
        db.query(MacroCategory).filter(MacroCategory.name == macro_category).first()
    )

    if not macro_category_obj:
        logger.warning(f"Macro category {macro_category} not found")
        return TagsResponseSchema(tags=[], preferences=[])

    logger.info("Getting liked and removed content for user")
    liked_content_ids = (
        db.query(Like.content_id).filter(Like.user_id == user.id).subquery()
    )
    removed_content_ids = (
        db.query(RemovedFavorite.content_id)
        .filter(RemovedFavorite.user_id == user.id)
        .subquery()
    )

    logger.info("Getting tags for user")
    tags_query = (
        db.query(
            Tags.id,
            Tags.name,
            Tags.description,
            func.coalesce(
                func.count(case((Content.city == user.city, Content.id)))
                - func.count(case((Content.id.in_(liked_content_ids), Content.id)))
                - func.count(case((Content.id.in_(removed_content_ids), Content.id))),
                0,
            ).label("content_count"),
        )
        .outerjoin(Tags.contents)
        .filter(Tags.macro_category_id == macro_category_obj.id)
        .filter(Content.city == user.city)
        .group_by(Tags.id, Tags.name, Tags.description)
    )
    tags = tags_query.all()

    logger.info("Getting preferences for user")
    preferences = (
        db.query(UserCategoryPreference.tag_id)
        .filter(UserCategoryPreference.user_id == user.id)
        .all()
    )

    logger.info("Returning tags and preferences")
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


@router_tags.get(
    "/tags/by-macro-category/{macro_category_name}",
    response_model=TagsByMacroCategoryResponseSchema,
)
def get_tags_by_macro_category(macro_category_name: str, db: Session = Depends(get_db)):
    """
    Получить все теги, связанные с конкретной макрокатегорией

    - **macro_category_name**: название макрокатегории (например, "events")
    """
    # Ищем макрокатегорию по имени
    macro_category_obj = (
        db.query(MacroCategory)
        .filter(MacroCategory.name == macro_category_name)
        .first()
    )

    if not macro_category_obj:
        raise HTTPException(
            status_code=404, detail=f"Macro category '{macro_category_name}' not found"
        )

    # Получаем все теги, связанные с этой макрокатегорией
    tags = (
        db.query(Tags)
        .filter(Tags.macro_category_id == macro_category_obj.id)
        .order_by(Tags.name.asc())
        .all()
    )

    # Формируем ответ
    return TagsByMacroCategoryResponseSchema(
        macro_category=MacroCategoryInTagsResponseSchema(
            id=macro_category_obj.id,
            name=macro_category_obj.name,
            description=macro_category_obj.description,
        ),
        tags=[
            TagWithDetailsSchema(
                id=tag.id,
                name=tag.name,
                description=tag.description,
                created=tag.created,
                updated=tag.updated,
            )
            for tag in tags
        ],
        total_count=len(tags),
    )
