from pydantic import BaseModel, validator
from typing import List, Optional, Dict
from datetime import date


# Схема для Tag
class TagSchema(BaseModel):
    id: int
    name: str
    description: str
    image: Optional[str] = None
    count: Optional[int] = None

    @validator("image", pre=True)
    def validate_x(cls, image: Optional[str]) -> Optional[str]:
        if image is None:
            return None
        # Если изображение присутствует, формируем полный URL
        return "https://afishabot.ru/afisha-files/" + image  # Отрезаем начало пути


# Ответ для списка тегов и предпочтений пользователя
class TagsResponseSchema(BaseModel):
    tags: List[TagSchema]
    preferences: Optional[List[int]] = None


# Схема для Content
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

    @validator("image", pre=True)
    def validate_x(cls, image: Optional[str]) -> Optional[str]:
        if image is None:
            return None
        # Если изображение присутствует, формируем полный URL
        return "https://afishabot.ru/afisha-files/" + image  # Отрезаем начало пути


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
