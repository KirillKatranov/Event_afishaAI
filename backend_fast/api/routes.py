from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import Optional

from models import get_db, Route, Content, Tags
from schemas import (
    RouteSchema,
    RouteListSchema,
    RouteListResponseSchema,
    RouteCreateSchema,
    RouteUpdateSchema,
)

router = APIRouter()


@router.get("/routes", response_model=RouteListResponseSchema)
def get_routes(
    skip: int = Query(0, ge=0, description="Количество пропускаемых записей"),
    limit: int = Query(20, ge=1, le=100, description="Максимальное количество записей"),
    city: Optional[str] = Query(None, description="Фильтр по городу"),
    tag_id: Optional[int] = Query(None, description="Фильтр по тегу"),
    db: Session = Depends(get_db),
):
    """Получить список маршрутов с пагинацией и фильтрами"""

    query = db.query(Route).options(
        joinedload(Route.tags), joinedload(Route.places), joinedload(Route.photos)
    )

    # Применяем фильтры
    if city:
        query = query.filter(Route.city == city)

    if tag_id:
        query = query.join(Route.tags).filter(Tags.id == tag_id)

    # Получаем общее количество
    total_count = query.count()

    # Применяем пагинацию и сортировку
    routes = query.order_by(Route.created.desc()).offset(skip).limit(limit).all()

    # Форматируем данные для ответа
    route_list = []
    for route in routes:
        route_data = {
            "id": route.id,
            "name": route.name,
            "description": route.description,
            "duration_km": route.duration_km,
            "duration_hours": route.duration_hours,
            "city": route.city,
            "places_count": len(route.places),
            "tags": route.tags,
            "photos": route.photos,
        }
        route_list.append(RouteListSchema(**route_data))

    return RouteListResponseSchema(routes=route_list, total_count=total_count)


@router.get("/routes/{route_id}", response_model=RouteSchema)
def get_route(route_id: int, db: Session = Depends(get_db)):
    """Получить детальную информацию о маршруте"""

    route = (
        db.query(Route)
        .options(
            joinedload(Route.tags), joinedload(Route.places), joinedload(Route.photos)
        )
        .filter(Route.id == route_id)
        .first()
    )

    if not route:
        raise HTTPException(status_code=404, detail="Маршрут не найден")

    return route


@router.post("/routes", response_model=RouteSchema)
def create_route(route_data: RouteCreateSchema, db: Session = Depends(get_db)):
    """Создать новый маршрут"""

    # Проверяем существование мест
    places = db.query(Content).filter(Content.id.in_(route_data.places)).all()
    if len(places) != len(route_data.places):
        raise HTTPException(status_code=400, detail="Некоторые места не найдены")

    # Проверяем существование тегов
    tags = db.query(Tags).filter(Tags.id.in_(route_data.tags)).all()
    if len(tags) != len(route_data.tags):
        raise HTTPException(status_code=400, detail="Некоторые теги не найдены")

    # Создаем маршрут
    route = Route(
        name=route_data.name,
        description=route_data.description,
        duration_km=route_data.duration_km,
        duration_hours=route_data.duration_hours,
        map_link=route_data.map_link,
        city=route_data.city,
    )

    # Добавляем связи
    route.places = places
    route.tags = tags

    db.add(route)
    db.commit()
    db.refresh(route)

    return route


@router.put("/routes/{route_id}", response_model=RouteSchema)
def update_route(
    route_id: int, route_data: RouteUpdateSchema, db: Session = Depends(get_db)
):
    """Обновить маршрут"""

    route = db.query(Route).filter(Route.id == route_id).first()
    if not route:
        raise HTTPException(status_code=404, detail="Маршрут не найден")

    # Обновляем поля
    for field, value in route_data.model_dump(exclude_unset=True).items():
        if field == "places" and value is not None:
            places = db.query(Content).filter(Content.id.in_(value)).all()
            if len(places) != len(value):
                raise HTTPException(
                    status_code=400, detail="Некоторые места не найдены"
                )
            route.places = places
        elif field == "tags" and value is not None:
            tags = db.query(Tags).filter(Tags.id.in_(value)).all()
            if len(tags) != len(value):
                raise HTTPException(status_code=400, detail="Некоторые теги не найдены")
            route.tags = tags
        else:
            setattr(route, field, value)

    db.commit()
    db.refresh(route)

    return route


@router.delete("/routes/{route_id}")
def delete_route(route_id: int, db: Session = Depends(get_db)):
    """Удалить маршрут"""

    route = db.query(Route).filter(Route.id == route_id).first()
    if not route:
        raise HTTPException(status_code=404, detail="Маршрут не найден")

    db.delete(route)
    db.commit()

    return {"message": "Маршрут успешно удален"}
