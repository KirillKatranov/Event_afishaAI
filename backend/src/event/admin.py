from django.contrib import admin
from event.models import Content, Tags, Like, User, Feedback, RemovedFavorite, MacroCategory, UserCategoryPreference


@admin.register(Content)
class ContentAdmin(admin.ModelAdmin):
    list_display = ('name', 'image', 'contact', 'get_tags', 'date', 'time', 'cost', 'location', 'city')


@admin.register(Tags)
class TagsAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'macro_category')


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'content', 'value', 'created')


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'created')


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('user', 'message', 'created')


@admin.register(RemovedFavorite)
class RemovedFavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'content', 'removed_at')


@admin.register(MacroCategory)
class MacroCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')


@admin.register(UserCategoryPreference)
class UserCategoryPreferenceAdmin(admin.ModelAdmin):
    list_display = ('user', 'tag')
