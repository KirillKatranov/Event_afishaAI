from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
)
from sqlalchemy.orm import Session

from models import User, Tags, UserCategoryPreference, get_db
from schemas import (
    UserPreferencesResponseSchema,
)

router_preferences = APIRouter(prefix="/api/v1", tags=["preferences"])


@router_preferences.post("/preferences/categories", response_model=dict)
def set_category_preference(
    username: str = Query(...),
    tag_id: int = Query(...),
    db: Session = Depends(get_db),
):
    """
    Устанавливает предпочтение пользователя для указанной категории (тега).
    """
    user = db.query(User).filter(User.username == username).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    tag = db.query(Tags).filter(Tags.id == tag_id).first()
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")

    preference = (
        db.query(UserCategoryPreference)
        .filter(
            UserCategoryPreference.user_id == user.id,
            UserCategoryPreference.tag_id == tag_id,
        )
        .first()
    )
    if not preference:
        preference = UserCategoryPreference(user_id=user.id, tag_id=tag_id)
        db.add(preference)
        db.commit()

    return {"message": f"Preference for tag_id {tag_id} added successfully"}


@router_preferences.delete("/preferences/categories", response_model=dict)
def delete_category_preference(
    username: str = Query(...),
    tag_id: int = Query(...),
    db: Session = Depends(get_db),
):
    """
    Удаляет предпочтение пользователя по категории (тегу).
    """
    user = db.query(User).filter(User.username == username).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    preference = (
        db.query(UserCategoryPreference)
        .filter(
            UserCategoryPreference.user_id == user.id,
            UserCategoryPreference.tag_id == tag_id,
        )
        .first()
    )
    if not preference:
        raise HTTPException(
            status_code=404, detail="Preference not found for the specified tag"
        )

    db.delete(preference)
    db.commit()
    return {"message": f"Preference for tag_id {tag_id} deleted successfully"}


@router_preferences.get(
    "/preferences/categories", response_model=UserPreferencesResponseSchema
)
def get_user_preferences(
    username: str = Query(...),
    db: Session = Depends(get_db),
):
    """
    Возвращает список всех предпочтений пользователя по категориям (тегам).
    """
    user = db.query(User).filter(User.username == username).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    preferences = (
        db.query(UserCategoryPreference)
        .filter(UserCategoryPreference.user_id == user.id)
        .join(Tags, UserCategoryPreference.tag_id == Tags.id)
        .all()
    )
    categories = [pref.tag.name for pref in preferences]
    return UserPreferencesResponseSchema(categories=categories)
