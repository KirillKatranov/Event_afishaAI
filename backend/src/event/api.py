from ninja_extra import NinjaExtraAPI

from http import HTTPStatus
from ninja_extra import api_controller, route
from event.models import (
    Tags,
    Content,
    User,
    Like,
    Feedback,
    RemovedFavorite,
    UserCategoryPreference,
    CITY_CHOICES,
)
from event.schemas import (
    TagSchema,
    ContentSchema,
    LikeSchema,
    LikeRequestSchema,
    FeedbackRequestSchema,
    UserPreferencesResponseSchema,
    TagsResponseSchema,
    UserSchema,
    CitiesResponseSchema,
)
from django.db.models import Q, Prefetch
from datetime import date
from ninja.errors import HttpError
from django.db import connection


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
            200: TagsResponseSchema,
        },
    )
    def get_tags(
        self,
        username: str,
        macro_category: str,
        date_start: date = None,
        date_end: date = None,
    ):
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    t.id,
                    t.name,
                    t.description,
                    COUNT(
                        CASE
                            WHEN l.id IS NULL AND rf.id IS NULL THEN c.id
                            WHEN l.id IS NOT NULL AND rf.id IS NULL THEN NULL
                            ELSE NULL
                        END
                    ) AS content_count
                FROM event_tags t
                LEFT JOIN event_content_tags ct ON t.id = ct.tags_id
                LEFT JOIN event_content c ON ct.content_id = c.id
                LEFT JOIN event_like l ON c.id = l.content_id
                    AND l.user_id = (SELECT id FROM event_user WHERE username = %s)
                LEFT JOIN event_removedfavorite rf ON c.id = rf.content_id
                    AND rf.user_id = (SELECT id FROM event_user WHERE username = %s)
                WHERE
                    t.macro_category_id = (SELECT id FROM event_macrocategory WHERE name = %s LIMIT 1)
                    AND (
                        (%s IS NOT NULL AND %s IS NOT NULL AND c.date_start >= %s AND c.date_end <= %s) OR
                        (%s IS NOT NULL AND %s IS NULL AND c.date_start >= %s)
                    )
                GROUP BY t.id, t.name, t.description;
                """,
                [
                    username,
                    username,
                    macro_category,
                    date_start,
                    date_end,
                    date_start,
                    date_end,
                    date_start,
                    date_end,
                    date_start,
                ],
            )

        tags = cursor.fetchall()
        return TagsResponseSchema(
            tags=[
                TagSchema(id=row[0], name=row[1], description=row[2], count=row[3])
                for row in tags
            ],
            preferences=[
                pref.tag.id
                for pref in UserCategoryPreference.objects.filter(
                    user__username=username
                ).select_related("tag")
            ],
        )


@api_controller(
    prefix_or_class="/api/v1",
)
class ContentController:
    @route.get(
        path="/contents_feed",
        response={
            200: list[ContentSchema],
        },
    )
    def get_content_for_feed(
        self,
        username: str,
        date_start: date | None = None,
        date_end: date | None = None,
    ) -> list[ContentSchema]:
        q_filter = Q()
        if date_start:
            q_filter &= Q(date_start__gte=date_start)
        if date_end:
            q_filter &= Q(date_start__lte=date_end)

        try:
            current_user = User.objects.prefetch_related(
                "category_preferences", "likes"
            ).get(username=username)
        except User.DoesNotExist:
            return []

        preferred_tags = list(
            current_user.category_preferences.values_list("tag_id", flat=True)
        )
        content_query = Content.objects.filter(q_filter)

        if preferred_tags:
            content_query = content_query.filter(tags__id__in=preferred_tags)

        content_query = content_query.prefetch_related(
            "tags",
            Prefetch(
                "likes",
                queryset=Like.objects.filter(user=current_user),
                to_attr="user_likes",
            ),
        ).distinct()
        excluded_content_ids = set(
            current_user.likes.values_list("content_id", flat=True)
        ) | set(
            RemovedFavorite.objects.filter(user=current_user).values_list(
                "content_id", flat=True
            )
        )
        content_query = content_query.exclude(id__in=excluded_content_ids)

        result = list(content_query)
        return result

    @route.get(
        path="/contents",
        response={
            200: list[ContentSchema],
        },
    )
    def get_content(
        self,
        username: str,
        tag: str | None = None,
        date_start: date | None = None,
        date_end: date | None = None,
    ) -> list[ContentSchema]:
        q_filter = Q(tags__name=tag) if tag else Q()
        if date_start and date_end:
            q_filter &= Q(date_start__gte=date_start) & Q(date_start__lte=date_end)
        if date_start and not date_end:
            q_filter &= Q(date_start=date_start)
        contents = Content.objects.filter(q_filter)
        current_user = User.objects.filter(username=username).first()
        if not current_user:
            # todo: при таком раскладе пользователь никогда не увидит приветственных экранов,
            #  тут я должен генерить исключение для редиректа.
            current_user = User.objects.create(username=username)
        likes = current_user.likes
        content_ids = [like.content.id for like in likes.all()]
        contents_not_mark = contents.filter(~Q(id__in=content_ids))
        removed_contents = RemovedFavorite.objects.filter(
            user=current_user
        ).values_list("content_id", flat=True)
        return contents_not_mark.exclude(id__in=removed_contents)

    # todo: сделать кэширование ленты! + сделать пагинацию для снижения нагрузки на БД.
    @route.get(
        path="/contents/liked",
        response={
            200: list[ContentSchema],
        },
    )
    def get_liked_content(
        self,
        username: str,
        value: bool = True,
        date_start: date | None = None,
        date_end: date | None = None,
    ) -> list[ContentSchema]:
        current_user = User.objects.filter(username=username).first()
        if not current_user:
            current_user = User.objects.create(username=username)

        likes = Like.objects.filter(user=current_user, value=value).order_by("created")
        liked_content_ids = likes.values_list("content_id", flat=True)

        content_filter = Q(id__in=liked_content_ids)
        if date_start and date_end:
            content_filter &= Q(date_start__gte=date_start) & Q(
                date_start__lte=date_end
            )
        if date_start and not date_end:
            content_filter &= Q(date_start=date_start)

        content = Content.objects.filter(content_filter).distinct()

        # Предзагрузка макрокатегорий через связь тегов
        content = content.prefetch_related(
            Prefetch("tags", queryset=Tags.objects.select_related("macro_category"))
        )

        content_sorted_by_likes = sorted(
            content,
            key=lambda c: next(
                like.created for like in likes if like.content_id == c.id
            ),
            reverse=True,
        )

        for item in content_sorted_by_likes:
            macro_categories = [
                tag.macro_category.name for tag in item.tags.all() if tag.macro_category
            ]
            item.macro_category = (
                macro_categories[0] if macro_categories else None
            )  # Берем первую найденную

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
        Like.objects.update_or_create(
            user=user, content=content, defaults={"value": True}
        )
        return {
            "user": request_data.username,
            "content": request_data.content_id,
            "value": True,
        }

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
        Like.objects.update_or_create(
            user=user, content=content, defaults={"value": False}
        )
        return {
            "user": request_data.username,
            "content": request_data.content_id,
            "value": False,
        }

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
        preference = UserCategoryPreference.objects.filter(
            user=user, tag_id=tag_id
        ).first()

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
        preferences = UserCategoryPreference.objects.filter(user=user).select_related(
            "tag"
        )
        categories = [pref.tag.name for pref in preferences]
        return UserPreferencesResponseSchema(categories=categories)


@api_controller(
    prefix_or_class="/api/v1",
)
class UserController:
    @route.patch(
        path="/users",
        response={
            200: dict,
        },
    )
    def change_city(self, request_data: UserSchema) -> dict:
        user = User.objects.filter(username=request_data.username).first()
        if not user:
            raise HttpError(404, "User not found")
        if request_data.city not in [item[0] for item in CITY_CHOICES]:
            raise HttpError(400, "Invalid city")
        user.city = request_data.city
        user.save()
        return {"status": "ok"}

    @route.get(
        path="/users",
        response={
            200: UserSchema,
        },
    )
    def get_users(self, username: str) -> UserSchema:
        user = User.objects.filter(username=username).first()
        if not user:
            raise HttpError(404, "User not found")
        return UserSchema(city=user.city, username=user.username)


@api_controller(
    prefix_or_class="/api/v1",
)
class CityController:
    @route.get(
        path="/cities",
        response={
            200: CitiesResponseSchema,
        },
    )
    def get_cities(self) -> CitiesResponseSchema:
        return CitiesResponseSchema(cities=[city[0] for city in CITY_CHOICES])


api = NinjaExtraAPI(title="afisha", version="0.0.1")
api.register_controllers(
    HealthController,
    TagsController,
    ContentController,
    LikeController,
    FeedbackController,
    PreferencesController,
    UserController,
    CityController,
)

# SELECT
#     t.id,
#     t.name,
#     t.description,
#     COUNT(c.id) AS content_count
# FROM event_tags t
# LEFT JOIN event_content_tags ct ON t.id = ct.tags_id
# LEFT JOIN event_content c ON ct.content_id = c.id
# LEFT JOIN event_like l ON c.id = l.content_id
#     AND l.user_id = (SELECT id FROM event_user WHERE username = 'adbogatov')
# LEFT JOIN event_removedfavorite rf ON c.id = rf.content_id
#     AND rf.user_id = (SELECT id FROM event_user WHERE username = 'adbogatov')
# WHERE
#     t.macro_category_id = (SELECT id FROM event_macrocategory WHERE name = 'events' LIMIT 1)
#     AND l.id IS NULL  -- Исключаем лайкнутый контент
#     AND rf.id IS NULL -- Исключаем удалённый контент
# GROUP BY t.id, t.name, t.description;
