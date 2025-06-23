from pydantic import BaseModel, field_validator, EmailStr
from typing import List, Optional, Dict
from datetime import date, datetime
from enum import Enum


class EventType(str, Enum):
    ONLINE = "online"
    OFFLINE = "offline"


class PublisherType(str, Enum):
    USER = "user"
    ORGANISATION = "organisation"


# Схема для Tag
class TagSchema(BaseModel):
    id: int
    name: str
    description: str
    image: Optional[str] = None
    count: Optional[int] = None

    @field_validator("image", mode="before")
    @classmethod
    def validate_x(cls, image: Optional[str]) -> Optional[str]:
        if image is None:
            return None
        return "https://afishabot.ru/afisha-files/" + image

    model_config = {"from_attributes": True}


# Ответ для списка тегов и предпочтений пользователя
class TagsResponseSchema(BaseModel):
    tags: List[TagSchema]
    preferences: Optional[List[int]] = None


# Схема для Content
class ContentBase(BaseModel):
    name: str
    description: str
    contact: Dict = {}
    date_start: Optional[date] = None
    date_end: Optional[date] = None
    time: Optional[str] = None
    location: Optional[str] = None
    cost: Optional[int] = None
    city: str = "nn"
    event_type: EventType = EventType.OFFLINE
    tags: List[int]  # список ID тегов


class ContentCreate(ContentBase):
    publisher_type: PublisherType  # тип издателя (user/organisation)
    organisation_id: Optional[int] = (
        None  # ID организации, если контент создается от её имени
    )


class ContentUpdate(ContentBase):
    tags: Optional[List[int]] = None


class ContentSchema(BaseModel):
    id: int
    name: str
    description: str
    image: Optional[str] = None
    contact: Optional[List[Dict]] = None
    date_start: Optional[date] = None
    date_end: Optional[date] = None
    tags: List[TagSchema]
    time: Optional[str] = None
    cost: Optional[int] = None
    location: Optional[str] = None
    macro_category: Optional[str] = None
    event_type: EventType
    publisher_type: PublisherType
    publisher_id: int

    @field_validator("image", mode="before")
    @classmethod
    def validate_x(cls, image: Optional[str]) -> Optional[str]:
        if image is None:
            return None
        return "https://afishabot.ru/afisha-files/" + image

    model_config = {"from_attributes": True}


# Схема для Like (лайк контента)
class LikeSchema(BaseModel):
    user: str  # имя пользователя
    content: int  # ID контента
    value: bool  # значение лайка (True/False)


# Схема запроса на создание/удаление Like
class LikeRequestSchema(BaseModel):
    username: str  # имя пользователя
    content_id: int  # ID контента


# Схема запроса для Feedback
class FeedbackRequestSchema(BaseModel):
    message: str
    username: str


# Схема для User Preferences
class UserPreferencesResponseSchema(BaseModel):
    categories: List[str]


# Схема для User
class UserSchema(BaseModel):
    id: int | None = None
    city: str
    username: str

    class Config:
        orm_mode = True


# Схема для ответа с городами
class CitiesResponseSchema(BaseModel):
    cities: List[str]


class OrganisationCreate(BaseModel):
    name: str
    phone: str
    email: EmailStr
    password: str


class OrganisationResponse(BaseModel):
    id: int
    name: str
    phone: str
    email: str
    user_id: int
    image: Optional[str] = None

    @field_validator("image", mode="before")
    @classmethod
    def validate_image(cls, image: Optional[str]) -> Optional[str]:
        if image is None:
            return None
        return image

    model_config = {"from_attributes": True}


# Схема для User в ответе организации
class UserInOrganisationResponse(BaseModel):
    id: int
    username: str
    city: str

    model_config = {"from_attributes": True}


# Расширенная схема для организации со связанным пользователем
class OrganisationWithUserResponse(BaseModel):
    id: int
    name: str
    phone: str
    email: str
    created: datetime
    updated: datetime
    image: Optional[str] = None
    user: UserInOrganisationResponse

    @field_validator("image", mode="before")
    @classmethod
    def validate_image(cls, image: Optional[str]) -> Optional[str]:
        if image is None:
            return None
        return image

    model_config = {"from_attributes": True}


# Схема для списка организаций
class OrganisationListResponse(BaseModel):
    organisations: List[OrganisationWithUserResponse]
    total_count: int


# Схема для тега в ответе контента организации
class TagInContentResponse(BaseModel):
    id: int
    name: str
    description: str

    model_config = {"from_attributes": True}


# Схема для контента в ответе организации
class OrganisationContentResponse(BaseModel):
    id: int
    name: str
    description: str
    image: Optional[str] = None
    contact: list[dict] = [{}]
    date_start: Optional[date] = None
    date_end: Optional[date] = None
    time: Optional[str] = None
    location: Optional[str] = None
    cost: Optional[int] = None
    city: str
    event_type: EventType
    created: datetime
    updated: datetime
    tags: List[TagInContentResponse]

    model_config = {"from_attributes": True}


# Схема для списка контента организации
class OrganisationContentListResponse(BaseModel):
    organisation: OrganisationResponse
    contents: List[ContentSchema]
    total_count: int

    class Config:
        from_attributes = True


# Схемы для отзывов
class ReviewCreateSchema(BaseModel):
    username: str
    content_id: int
    text: str


class ReviewResponseSchema(BaseModel):
    id: int
    user_id: int
    content_id: int
    text: str
    created: datetime
    updated: datetime
    username: str  # Добавляем имя пользователя для удобства

    model_config = {"from_attributes": True}


class ReviewListResponseSchema(BaseModel):
    reviews: List[ReviewResponseSchema]
    total_count: int


# Схемы для оценок
class RatingCreateSchema(BaseModel):
    username: str
    content_id: int
    rating: int

    @field_validator("rating")
    @classmethod
    def validate_rating(cls, v):
        if not 0 <= v <= 5:
            raise ValueError("Оценка должна быть от 0 до 5")
        return v


class RatingResponseSchema(BaseModel):
    id: int
    user_id: int
    content_id: int
    rating: int
    created: datetime
    updated: datetime
    username: str  # Добавляем имя пользователя для удобства

    model_config = {"from_attributes": True}


class ContentRatingStatsSchema(BaseModel):
    content_id: int
    average_rating: float
    total_ratings: int
    ratings_distribution: Dict[int, int]  # {rating: count}


# Схема для ответа поиска
class SearchResponseSchema(BaseModel):
    contents: List[ContentSchema]
    total_count: int
    skip: int
    limit: int
    has_more: bool
    search_params: Dict


# Схема для подсказок поиска
class SearchSuggestionsSchema(BaseModel):
    suggestions: List[str]
    query: str


# Схема для популярных тегов
class PopularTagSchema(BaseModel):
    id: int
    name: str
    description: str
    content_count: int


class PopularTagsResponseSchema(BaseModel):
    popular_tags: List[PopularTagSchema]


# Схемы для макрокатегорий
class MacroCategorySchema(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    image: Optional[str] = None

    @field_validator("image", mode="before")
    @classmethod
    def validate_image(cls, image: Optional[str]) -> Optional[str]:
        if image is None:
            return None
        return "https://afishabot.ru/afisha-files/" + image

    model_config = {"from_attributes": True}


class MacroCategoriesResponseSchema(BaseModel):
    macro_categories: List[MacroCategorySchema]
    total_count: int


# Схема для тега с расширенной информацией
class TagWithDetailsSchema(BaseModel):
    id: int
    name: str
    description: str
    created: datetime
    updated: datetime

    model_config = {"from_attributes": True}


# Схема для макрокатегории в ответе тегов
class MacroCategoryInTagsResponseSchema(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    model_config = {"from_attributes": True}


# Схема для ответа API тегов по макрокатегории
class TagsByMacroCategoryResponseSchema(BaseModel):
    macro_category: MacroCategoryInTagsResponseSchema
    tags: List[TagWithDetailsSchema]
    total_count: int


# Схемы для маршрутов


class RoutePhotoSchema(BaseModel):
    id: int
    image: str
    description: Optional[str] = None
    order: int

    @field_validator("image", mode="before")
    @classmethod
    def validate_image(cls, image: Optional[str]) -> Optional[str]:
        if image is None:
            return None
        return "https://afishabot.ru/afisha-files/" + image

    model_config = {"from_attributes": True}


class PlaceInRouteSchema(BaseModel):
    id: int
    name: str
    description: str
    location: Optional[str] = None
    image: Optional[str] = None
    city: str

    @field_validator("image", mode="before")
    @classmethod
    def validate_image(cls, image: Optional[str]) -> Optional[str]:
        if image is None:
            return None
        return "https://afishabot.ru/afisha-files/" + image

    model_config = {"from_attributes": True}


class RouteSchema(BaseModel):
    id: int
    name: str
    description: str
    duration_km: str
    duration_hours: str
    map_link: str
    city: str
    created: datetime
    updated: datetime
    places: List[PlaceInRouteSchema]
    tags: List[TagSchema]
    photos: List[RoutePhotoSchema]

    model_config = {"from_attributes": True}


class RouteListSchema(BaseModel):
    id: int
    name: str
    description: str
    duration_km: str
    duration_hours: str
    city: str
    places_count: int
    places: List[PlaceInRouteSchema]
    tags: List[TagSchema]
    photos: List[RoutePhotoSchema]

    model_config = {"from_attributes": True}


class RouteListResponseSchema(BaseModel):
    routes: List[RouteListSchema]
    total_count: int


class RouteCreateSchema(BaseModel):
    name: str
    description: str
    duration_km: str
    duration_hours: str
    map_link: str
    city: str = "nn"
    places: List[int]  # список ID мест
    tags: List[int]  # список ID тегов


class RouteUpdateSchema(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    duration_km: Optional[str] = None
    duration_hours: Optional[str] = None
    map_link: Optional[str] = None
    places: Optional[List[int]] = None
    tags: Optional[List[int]] = None
