from pydantic import BaseModel, field_validator, EmailStr
from typing import List, Optional, Dict
from datetime import date, datetime
from models import EventType, PublisherType


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
    city: str
    username: str


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
