from django.contrib import admin
from event.models import (
    Content,
    Tags,
    Like,
    User,
    MacroCategory,
    Review,
)


class MacroCategoryFilter(admin.SimpleListFilter):
    title = "макрокатегория"
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


@admin.register(Tags)
class TagsAdmin(admin.ModelAdmin):
    list_display = ("name", "description")


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    pass


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("username", "city", "created")
    list_filter = ("city", "created")
    search_fields = ("username",)  # Добавляем для поддержки автозаполнения
    readonly_fields = ("created", "updated")


@admin.register(MacroCategory)
class MacroCategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)


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
