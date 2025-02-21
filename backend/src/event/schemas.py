from ninja import Schema
from datetime import date
from pydantic import field_validator, Field


class TagSchema(Schema):
    id: int
    name: str
    description: str
    image: str | None = None
    count: int | None = None

    @field_validator('image')
    @classmethod
    def validate_x(cls, image: str) -> str:
        if image is None:
            return None
        image_not_addr = image[17:]
        return "https://afishabot.ru" + image_not_addr


class TagsResponseSchema(Schema):
    tags: list[TagSchema]
    preferences: list[int] | None = None


class ContentSchema(Schema):
    id: int
    name: str
    description: str
    image: str | None = None
    contact: list[dict] | None = None
    date: date = Field(alias='date_start')
    tags: list[TagSchema]
    time: str | None = None
    cost: int | None = None
    location: str | None = None
    macro_category: str | None = None

    @field_validator('image')
    @classmethod
    def validate_x(cls, image: str) -> str:
        if image is None:
            return None
        image_not_addr = image[17:]
        return "https://afishabot.ru" + image_not_addr


class LikeSchema(Schema):
    user: str
    content: int
    value: bool


class LikeRequestSchema(Schema):
    username: str
    content_id: int


class FeedbackRequestSchema(Schema):
    message: str
    username: str


class UserPreferencesResponseSchema(Schema):
    categories: list[str]
