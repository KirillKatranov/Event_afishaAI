from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from models import get_db, MacroCategory
from schemas import MacroCategorySchema, MacroCategoriesResponseSchema

router_macro_categories = APIRouter(prefix="/api/v1", tags=["macro-categories"])


@router_macro_categories.get(
    "/macro-categories", response_model=MacroCategoriesResponseSchema
)
def get_macro_categories(
    skip: int = Query(default=0, ge=0, description="Количество пропускаемых записей"),
    limit: int = Query(
        default=50, ge=1, le=100, description="Количество возвращаемых записей"
    ),
    db: Session = Depends(get_db),
):
    """
    Получить список всех макрокатегорий

    - **skip**: количество записей для пропуска (для пагинации)
    - **limit**: максимальное количество возвращаемых записей
    """
    # Получаем общее количество макрокатегорий
    total_count = db.query(MacroCategory).count()

    # Получаем макрокатегории с пагинацией
    macro_categories = (
        db.query(MacroCategory)
        .order_by(MacroCategory.name.asc())  # Сортируем по имени
        .offset(skip)
        .limit(limit)
        .all()
    )

    return MacroCategoriesResponseSchema(
        macro_categories=macro_categories, total_count=total_count
    )


@router_macro_categories.get(
    "/macro-categories/{category_id}", response_model=MacroCategorySchema
)
def get_macro_category(
    category_id: int,
    db: Session = Depends(get_db),
):
    """
    Получить конкретную макрокатегорию по ID

    - **category_id**: ID макрокатегории
    """
    from fastapi import HTTPException

    macro_category = (
        db.query(MacroCategory).filter(MacroCategory.id == category_id).first()
    )

    if not macro_category:
        raise HTTPException(status_code=404, detail="Macro category not found")

    return macro_category
