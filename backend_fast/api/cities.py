from fastapi import (
    APIRouter,
)
from schemas import (
    CitiesResponseSchema,
)

router_cities = APIRouter(prefix="/api/v1", tags=["cities"])


CITY_CHOICES = [
    ("spb", "Санкт-Петербург"),
    ("msk", "Москва"),
    ("ekb", "Екатеринбург"),
    ("nsk", "Новосибирск"),
    ("nn", "Нижний Новгород"),
]


@router_cities.get("/cities", response_model=CitiesResponseSchema)
def get_cities():
    return CitiesResponseSchema(cities=[city[0] for city in CITY_CHOICES])
