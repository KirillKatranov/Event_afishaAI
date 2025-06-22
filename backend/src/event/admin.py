from django.contrib import admin
from event.models import (
    Content,
    Tags,
    Like,
    User,
    MacroCategory,
    Review,
    Rating,
    Organisation,
    Feedback,
    RemovedFavorite,
    UserCategoryPreference,
    Route,
    RoutePhoto,
)


class MacroCategoryFilter(admin.SimpleListFilter):
    title = "Макрокатегория"
    parameter_name = "macro_category"

    def lookups(self, request, model_admin):
        # Получаем все макрокатегории
        categories = MacroCategory.objects.all()
        return [(cat.id, cat.name) for cat in categories]

    def queryset(self, request, queryset):
        if self.value():
            # Получаем ID контента через подзапрос, чтобы избежать .distinct()
            content_ids = (
                Content.objects.filter(tags__macro_category__id=self.value())
                .values_list("id", flat=True)
                .distinct()
            )
            return queryset.filter(id__in=content_ids)
        return queryset


@admin.register(Content)
class ContentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "city",
        "date_start",
        "date_end",
        "event_type",
        "publisher_type",
        "get_tags",
        "get_macro",
        "created",
    )
    list_filter = (
        "city",
        "event_type",
        "publisher_type",
        "date_start",
        "created",
        MacroCategoryFilter,  # Добавляем наш кастомный фильтр
    )
    search_fields = (
        "name",
        "description",
        "location",
        "unique_id",
    )
    readonly_fields = ("unique_id", "created", "updated")
    date_hierarchy = "date_start"
    list_per_page = 25
    filter_horizontal = ("tags",)

    fieldsets = (
        ("Основная информация", {"fields": ("name", "description", "image", "tags")}),
        (
            "Детали мероприятия",
            {
                "fields": (
                    "date_start",
                    "date_end",
                    "time",
                    "location",
                    "cost",
                    "city",
                    "event_type",
                )
            },
        ),
        ("Контакты", {"fields": ("contact",)}),
        ("Публикация", {"fields": ("publisher_type", "publisher_id")}),
        (
            "Системная информация",
            {"fields": ("unique_id", "created", "updated"), "classes": ("collapse",)},
        ),
    )


@admin.register(Tags)
class TagsAdmin(admin.ModelAdmin):
    list_display = ("name", "description", "macro_category", "created", "updated")
    list_filter = ("macro_category", "created")
    search_fields = ("name", "description")
    readonly_fields = ("created", "updated")


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ("user", "content", "value", "created")
    list_filter = ("value", "created", "content__city")
    search_fields = ("user__username", "content__name")
    readonly_fields = ("created", "updated")
    autocomplete_fields = ["user", "content"]


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("username", "city", "created")
    list_filter = ("city", "created")
    search_fields = ("username",)  # Добавляем для поддержки автозаполнения
    readonly_fields = ("created", "updated")


@admin.register(MacroCategory)
class MacroCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "description")
    search_fields = ("name", "description")


@admin.register(Organisation)
class OrganisationAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone", "user", "created")
    list_filter = ("created", "user__city")
    search_fields = ("name", "email", "phone", "user__username")
    readonly_fields = ("created", "updated")
    autocomplete_fields = ["user"]

    fieldsets = (
        ("Основная информация", {"fields": ("name", "email", "phone", "image")}),
        ("Связь с пользователем", {"fields": ("user",)}),
        ("Безопасность", {"fields": ("password",)}),
        (
            "Системная информация",
            {"fields": ("created", "updated"), "classes": ("collapse",)},
        ),
    )


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ("user", "message_short", "created")
    list_filter = ("created", "user__city")
    search_fields = ("user__username", "message")
    readonly_fields = ("created", "updated")
    autocomplete_fields = ["user"]

    def message_short(self, obj):
        if len(obj.message) > 50:
            return obj.message[:50] + "..."
        return obj.message

    message_short.short_description = "Сообщение"


@admin.register(RemovedFavorite)
class RemovedFavoriteAdmin(admin.ModelAdmin):
    list_display = ("user", "content", "removed_at")
    list_filter = ("removed_at", "content__city")
    search_fields = ("user__username", "content__name")
    readonly_fields = ("removed_at",)
    autocomplete_fields = ["user", "content"]


@admin.register(UserCategoryPreference)
class UserCategoryPreferenceAdmin(admin.ModelAdmin):
    list_display = ("user", "tag")
    list_filter = ("tag__macro_category",)
    search_fields = ("user__username", "tag__name")
    autocomplete_fields = ["user", "tag"]


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "content",
        "get_short_text",
        "created",
        "updated",
    )
    list_filter = (
        "created",
        "updated",
        "content__city",
        "content__event_type",
    )
    search_fields = (
        "user__username",
        "content__name",
        "text",
    )
    readonly_fields = ("created", "updated")
    date_hierarchy = "created"
    list_per_page = 25

    # Настройка отображения полей в форме редактирования
    fieldsets = (
        (None, {"fields": ("user", "content", "text")}),
        (
            "Информация о времени",
            {
                "fields": ("created", "updated"),
                "classes": ("collapse",),
            },
        ),
    )

    # Автозаполнение для связанных полей
    autocomplete_fields = ["user", "content"]

    def get_queryset(self, request):
        """Оптимизируем запросы, подгружая связанные объекты"""
        return super().get_queryset(request).select_related("user", "content")


@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "content",
        "rating",
        "created",
        "updated",
    )
    list_filter = (
        "rating",
        "created",
        "updated",
        "content__city",
        "content__event_type",
    )
    search_fields = (
        "user__username",
        "content__name",
    )
    readonly_fields = ("created", "updated")
    date_hierarchy = "created"
    list_per_page = 25

    # Настройка отображения полей в форме редактирования
    fieldsets = (
        (None, {"fields": ("user", "content", "rating")}),
        (
            "Информация о времени",
            {
                "fields": ("created", "updated"),
                "classes": ("collapse",),
            },
        ),
    )

    # Автозаполнение для связанных полей
    autocomplete_fields = ["user", "content"]

    def get_queryset(self, request):
        """Оптимизация запросов для избежания N+1 проблемы"""
        qs = super().get_queryset(request)
        return qs.select_related("user", "content")


class RoutePhotoInline(admin.TabularInline):
    model = RoutePhoto
    extra = 1
    can_delete = True
    fields = ("image", "description", "order")

    def get_extra(self, request, obj=None, **kwargs):
        """Динамически определяем количество дополнительных форм"""
        if obj:
            return 1
        return 3


@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "city",
        "duration_km",
        "duration_hours",
        "get_places_count",
        "get_tags_list",
        "created",
    )
    list_filter = (
        "city",
        "created",
        "tags__macro_category",
    )
    search_fields = (
        "name",
        "description",
        "places__name",
        "tags__name",
    )
    readonly_fields = ("created", "updated")
    date_hierarchy = "created"
    list_per_page = 25
    filter_horizontal = ("places", "tags")
    inlines = [RoutePhotoInline]

    fieldsets = (
        ("Основная информация", {"fields": ("name", "description", "city")}),
        (
            "Характеристики маршрута",
            {"fields": ("duration_km", "duration_hours", "map_link")},
        ),
        ("Связи", {"fields": ("places", "tags")}),
        (
            "Системная информация",
            {"fields": ("created", "updated"), "classes": ("collapse",)},
        ),
    )

    def get_places_count(self, obj):
        """Возвращает количество мест в маршруте"""
        return obj.places.count()

    get_places_count.short_description = "Количество мест"

    def get_queryset(self, request):
        """Оптимизация запросов для избежания N+1 проблемы"""
        qs = super().get_queryset(request)
        return qs.prefetch_related("places", "tags", "photos")


@admin.register(RoutePhoto)
class RoutePhotoAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "route",
        "description",
        "order",
        "created",
    )
    list_filter = (
        "route__city",
        "created",
    )
    search_fields = (
        "route__name",
        "description",
    )
    readonly_fields = ("created", "updated")
    list_editable = ("order",)

    fieldsets = (
        ("Основная информация", {"fields": ("route", "image", "description", "order")}),
        (
            "Системная информация",
            {"fields": ("created", "updated"), "classes": ("collapse",)},
        ),
    )
