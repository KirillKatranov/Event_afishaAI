from fastapi import (
    APIRouter,
)
from schemas import (
    CitiesResponseSchema,
)
from loguru import logger

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
    logger.info("Query to get cities")

    cities = [city[0] for city in CITY_CHOICES]
    logger.debug(f"List of cities: {cities}")

    logger.info(f"Sent list of cities: {cities}")

    return CitiesResponseSchema(cities=[city[0] for city in CITY_CHOICES])
