from django.contrib import admin
from event.models import (
    Content,
    Tags,
    Like,
    User,
    MacroCategory,
    UserCategoryPreference,
    Feedback,
)


@admin.register(Content)
class ContentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "description",
        "image",
        "contact",
        "date_start",
        "date_end",
        "time",
        "location",
        "cost",
        "city",
        "unique_id",
        "get_tags",
        "get_macro",
    )


@admin.register(Tags)
class TagsAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "description")


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    pass


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "message",
    )


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        "username",
        "city",
    )


@admin.register(MacroCategory)
class MacroCategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(UserCategoryPreference)
class UserCategoryPreferenceAdmin(admin.ModelAdmin):
    list_display = ("user", "tag")
