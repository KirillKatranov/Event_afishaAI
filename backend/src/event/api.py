from ninja_extra import NinjaExtraAPI

from http import HTTPStatus
from ninja_extra import api_controller, route
from event.models import Tags, Content, User, Like, Feedback
from event.schemas import TagSchema, ContentSchema, LikeSchema, LikeRequestSchema, FeedbackRequestSchema
from django.db.models import Q
from datetime import date
from ninja.errors import HttpError


@api_controller(
    prefix_or_class="/health",
)
class HealthController:
    @route.get(
        path="",
        response={
            200: None,
        },
    )
    def health_check(self):
        return HTTPStatus.OK


@api_controller(
    prefix_or_class="/api/v1",
)
class TagsController:
    @route.get(
        path="/tags",
        response={
            200: list[TagSchema],
        },
    )
    def get_tags(self):
        tags = Tags.objects.all()
        result = [tag for tag in tags if tag.contents.count() > 0]
        for res in result:
            res.count = res.contents.count()
        return result


@api_controller(
    prefix_or_class="/api/v1",
)
class ContentController:
    @route.get(
        path="/contents",
        response={
            200: list[ContentSchema],
        },
    )
    def get_content(self, tag: str | None = None, date_start: date | None = None, date_end: date | None = None) ->\
            list[ContentSchema]:
        q_filter = Q(tags__name=tag) if tag else Q()
        if date_start and date_end:
            q_filter &= Q(date__gte=date_start) & Q(date__lte=date_end)
        if date_start and not date_end:
            q_filter &= Q(date=date_start)
        content = Content.objects.filter(q_filter)
        return content

    @route.get(
        path="/contents/liked",
        response={
            200: list[ContentSchema],
        },
    )
    def get_liked_content(self, username: str, date_start: date | None = None, date_end: date | None = None) -> \
            list[ContentSchema]:
        current_user = User.objects.filter(username=username).first()
        if not current_user:
            current_user = User.objects.create(username=username)
        likes = Like.objects.filter(user=current_user, value=True)
        q_filter = Q()
        if date_start and date_end:
            q_filter &= Q(date__gte=date_start) & Q(date__lte=date_end)
        if date_start and not date_end:
            q_filter &= Q(date=date_start)
        q_filter &= Q(likes__in=likes)
        content = Content.objects.filter(q_filter)
        return content

    @route.get(
        path="/contents/{content_id:int}",
        response={
            200: ContentSchema,
        },
    )
    def get_content_by_id(self, content_id: int) -> ContentSchema:
        content = Content.objects.filter(id=content_id).first()
        if not content:
            raise HttpError(404, f"Событие с ID {content_id} не найдено")
        return content


@api_controller(
    prefix_or_class="/api/v1",
)
class LikeController:
    @route.post(
        path="/like",
        response={
            200: LikeSchema,
        },
    )
    def set_like(self, request_data: LikeRequestSchema):
        user = User.objects.filter(username=request_data.username).first()
        if not user:
            user = User.objects.create(username=request_data.username)
        # todo: создавать пользователя если такого нет.
        content = Content.objects.filter(id=request_data.content_id).first()
        Like.objects.update_or_create(user=user, content=content, defaults={"value": True})
        return {'user': request_data.username, 'content': request_data.content_id, 'value': True}

    @route.post(
        path="/dislike",
        response={
            200: LikeSchema,
        },
    )
    def set_dislike(self, request_data: LikeRequestSchema):
        user = User.objects.filter(username=request_data.username).first()
        if not user:
            user = User.objects.create(username=request_data.username)
        content = Content.objects.filter(id=request_data.content_id).first()
        Like.objects.update_or_create(user=user, content=content, defaults={"value": False})
        return {'user': request_data.username, 'content': request_data.content_id, 'value': False}


@api_controller(
    prefix_or_class="/api/v1",
)
class FeedbackController:
    @route.post(
        path="/feedback",
        response={
            200: dict,
        },
    )
    def create_feedback(self, request_data: FeedbackRequestSchema) -> dict:
        user = User.objects.filter(username=request_data.username).first()
        if not user:
            user = User.objects.create(username=request_data.username)
        Feedback.objects.create(user=user, message=request_data.message)
        return {"status": "ok"}


api = NinjaExtraAPI(title="afisha", version="0.0.1")
api.register_controllers(
    HealthController,
    TagsController,
    ContentController,
    LikeController,
    FeedbackController
)
