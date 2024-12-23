from ninja_extra import NinjaExtraAPI

from http import HTTPStatus
from ninja_extra import api_controller, route
from event.models import Tags, Content, User, Like, Feedback, RemovedFavorite, UserCategoryPreference
from event.schemas import TagSchema, ContentSchema, LikeSchema, LikeRequestSchema, FeedbackRequestSchema, \
    UserPreferencesResponseSchema
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
    def get_content(self, username: str, tag: str | None = None, date_start: date | None = None,
                    date_end: date | None = None) -> list[ContentSchema]:
        q_filter = Q(tags__name=tag) if tag else Q()
        if date_start and date_end:
            q_filter &= Q(date__gte=date_start) & Q(date__lte=date_end)
        if date_start and not date_end:
            q_filter &= Q(date=date_start)
        contents = Content.objects.filter(q_filter)
        current_user = User.objects.filter(username=username).first()
        if not current_user:
            current_user = User.objects.create(username=username)
        likes = current_user.likes
        content_ids = [like.content.id for like in likes.all()]
        contents_not_mark = contents.filter(~Q(id__in=content_ids))
        removed_contents = RemovedFavorite.objects.filter(user=current_user).values_list('content_id', flat=True)
        return contents_not_mark.exclude(id__in=removed_contents)

    @route.get(
        path="/contents/liked",
        response={
            200: list[ContentSchema],
        },
    )
    def get_liked_content(self, username: str, value: bool = True,
                          date_start: date | None = None, date_end: date | None = None) -> list[ContentSchema]:
        current_user = User.objects.filter(username=username).first()
        if not current_user:
            current_user = User.objects.create(username=username)

        likes = Like.objects.filter(user=current_user, value=value).order_by('created')
        liked_content_ids = likes.values_list('content_id', flat=True)

        content_filter = Q(id__in=liked_content_ids)
        if date_start and date_end:
            content_filter &= Q(date__gte=date_start) & Q(date__lte=date_end)
        if date_start and not date_end:
            content_filter &= Q(date=date_start)

        content = Content.objects.filter(content_filter).distinct()
        content_sorted_by_likes = sorted(
            content,
            key=lambda c: next(like.created for like in likes if like.content_id == c.id),
            reverse=True
        )
        return content_sorted_by_likes

    @route.get(
        path="/contents/{content_id}",
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

    @route.post(
        path="/delete_mark",
    )
    def delete_mark(self, request_data: LikeRequestSchema):
        user = User.objects.filter(username=request_data.username).first()
        if not user:
            user = User.objects.create(username=request_data.username)
        content = Content.objects.filter(id=request_data.content_id).first()
        like = Like.objects.filter(user=user, content=content).first()
        if not like:
            raise HttpError(404, "Like not found")
        like.delete()

        # Если пользователь удалил мероприятие из избранного, то оно не должно показываться у него в ленте
        RemovedFavorite.objects.get_or_create(user=user, content=content)
        return 200


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


@api_controller(
    prefix_or_class="/api/v1",
)
class PreferencesController:
    @route.post(
        path="/preferences/categories",
        response={200: dict},
    )
    def set_category_preferences(self, username: str, tag_id: int):
        user = User.objects.filter(username=username).first()
        if not user:
            user = User.objects.create(username=username)

        tag = Tags.objects.filter(id=tag_id).first()
        if tag:
            UserCategoryPreference.objects.create(user=user, tag=tag)

        return {"message": "Preferences updated successfully"}

    @route.post(
        path="/preferences/categories",
        response={200: dict},
    )
    def set_category_preferences(self, username: str, tag_id: int):
        """
        Устанавливает предпочтение пользователя для указанной категории (тег).
        """
        user, _ = User.objects.get_or_create(username=username)
        tag = Tags.objects.filter(id=tag_id).first()

        if not tag:
            raise HttpError(404, "Tag not found")

        UserCategoryPreference.objects.get_or_create(user=user, tag=tag)
        return {"message": f"Preference for tag_id {tag_id} added successfully"}

    @route.delete(
        path="/preferences/categories",
        response={200: dict},
    )
    def delete_category_preference(self, username: str, tag_id: int):
        """
        Удаляет конкретное предпочтение пользователя по категории (тегу).
        """
        user, _ = User.objects.get_or_create(username=username)
        preference = UserCategoryPreference.objects.filter(user=user, tag_id=tag_id).first()

        if not preference:
            raise HttpError(404, "Preference not found for the specified tag")

        preference.delete()
        return {"message": f"Preference for tag_id {tag_id} deleted successfully"}

    @route.get(
        path="/preferences/categories",
        response={200: UserPreferencesResponseSchema},
    )
    def get_user_preferences(self, username: str) -> UserPreferencesResponseSchema:
        """
        Возвращает список всех предпочтений пользователя по категориям (тегам).
        """
        user, _ = User.objects.get_or_create(username=username)
        preferences = UserCategoryPreference.objects.filter(user=user).select_related("tag")
        categories = [pref.tag.name for pref in preferences]
        return UserPreferencesResponseSchema(categories=categories)


api = NinjaExtraAPI(title="afisha", version="0.0.1")
api.register_controllers(
    HealthController,
    TagsController,
    ContentController,
    LikeController,
    FeedbackController
)
