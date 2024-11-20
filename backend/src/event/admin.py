from django.contrib import admin
from event.models import Content, Tags, Like, User, Feedback


@admin.register(Content)
class ContentAdmin(admin.ModelAdmin):
    list_display = ('name', 'image', 'contact', 'get_tags', 'date', 'time', 'cost', 'location')


@admin.register(Tags)
class TagsAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'content', 'value', 'created')


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'created')


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('user', 'message', 'created')
