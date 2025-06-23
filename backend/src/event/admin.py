from django.contrib import admin
from event.models import (
    Content,
    Event,
    Place,
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


class EventTagsFilter(admin.SimpleListFilter):
    """Фильтр тегов только для событий (исключая places)"""

    title = "Теги событий"
    parameter_name = "event_tags"

    def lookups(self, request, model_admin):
        # Получаем теги, исключая категорию 'places'
        tags = Tags.objects.exclude(macro_category__name="places").distinct()
        return [
            (
                tag.id,
                f"{tag.name} ({tag.macro_category.name if tag.macro_category else 'Без категории'})",
            )
            for tag in tags
        ]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(tags__id=self.value()).distinct()
        return queryset


class PlaceTagsFilter(admin.SimpleListFilter):
    """Фильтр тегов только для мест (категория places)"""

    title = "Теги мест"
    parameter_name = "place_tags"

    def lookups(self, request, model_admin):
        # Получаем теги только из категории 'places'
        tags = Tags.objects.filter(macro_category__name="places").distinct()
        return [(tag.id, tag.name) for tag in tags]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(tags__id=self.value()).distinct()
        return queryset


class PlaceImageFilter(admin.SimpleListFilter):
    """Фильтр мест по наличию изображения"""

    title = "Наличие изображения"
    parameter_name = "has_image"

    def lookups(self, request, model_admin):
        return [
            ("no_image", "Без изображения"),
            ("has_image", "С изображением"),
        ]

    def queryset(self, request, queryset):
        if self.value() == "no_image":
            # Места без изображения (поле пустое или None)
            return queryset.filter(image__isnull=True) | queryset.filter(image="")
        elif self.value() == "has_image":
            # Места с изображением
            return queryset.filter(image__isnull=False).exclude(image="")
        return queryset


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    """Админка для событий/мероприятий"""

    list_display = (
        "id",
        "name",
        "city",
        "date_start",
        "date_end",
        "event_type",
        "publisher_type",
        "get_tags",
        "created",
    )
    list_filter = (
        "city",
        "event_type",
        "publisher_type",
        "date_start",
        "created",
        EventTagsFilter,
    )
    search_fields = (
        "name",
        "description",
        "location",
        "unique_id",
    )
    readonly_fields = ("created", "updated")
    date_hierarchy = "date_start"
    list_per_page = 25
    filter_horizontal = ("tags",)

    fieldsets = (
        (
            "Основная информация",
            {"fields": ("name", "description", "image", "unique_id")},
        ),
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
        ("Теги", {"fields": ("tags",)}),
        ("Контакты", {"fields": ("contact",)}),
        ("Публикация", {"fields": ("publisher_type", "publisher_id")}),
        (
            "Системная информация",
            {"fields": ("created", "updated"), "classes": ("collapse",)},
        ),
    )

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        """Ограничиваем теги только для событий (исключая places)"""
        if db_field.name == "tags":
            kwargs["queryset"] = Tags.objects.exclude(macro_category__name="places")
        return super().formfield_for_manytomany(db_field, request, **kwargs)


@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    """Админка для мест"""

    list_display = (
        "id",
        "name",
        "city",
        "location",
        "get_tags",
        "has_image",
        "created",
    )
    list_filter = (
        "city",
        "created",
        PlaceTagsFilter,
        PlaceImageFilter,
    )
    search_fields = (
        "name",
        "description",
        "location",
        "unique_id",
    )
    readonly_fields = ("created", "updated")
    list_per_page = 25
    filter_horizontal = ("tags",)

    fieldsets = (
        (
            "Основная информация",
            {"fields": ("name", "description", "image", "unique_id")},
        ),
        ("Местоположение", {"fields": ("location", "city")}),
        ("Теги", {"fields": ("tags",)}),
        ("Контакты", {"fields": ("contact",)}),
        ("Публикация", {"fields": ("publisher_type", "publisher_id")}),
        (
            "Системная информация",
            {"fields": ("created", "updated"), "classes": ("collapse",)},
        ),
    )

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        """Ограничиваем теги только для мест (категория places)"""
        if db_field.name == "tags":
            kwargs["queryset"] = Tags.objects.filter(macro_category__name="places")
        return super().formfield_for_manytomany(db_field, request, **kwargs)

    def get_form(self, request, obj=None, **kwargs):
        """Переопределяем форму для принудительного обновления queryset"""
        form = super().get_form(request, obj, **kwargs)
        # Принудительно обновляем queryset для поля tags
        if "tags" in form.base_fields:
            form.base_fields["tags"].queryset = Tags.objects.filter(
                macro_category__name="places"
            )
        return form

    def has_image(self, obj):
        """Показывает есть ли изображение у места"""
        if obj.image:
            return "✅ Есть"
        return "❌ Нет"

    has_image.short_description = "Изображение"


@admin.register(Content)
class ContentAdmin(admin.ModelAdmin):
    """Админка для просмотра всего контента (только для чтения)"""

    list_display = (
        "id",
        "name",
        "city",
        "date_start",
        "date_end",
        "location",
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
        MacroCategoryFilter,
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

    # Делаем админку только для чтения
    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


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
    extra = 10
    can_delete = True
    fields = ("image", "description", "order")


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
