from django.contrib import admin
from django.urls import path

# Русификация заголовков админки
admin.site.site_header = "Администрирование Афиши мероприятий"
admin.site.site_title = "Афиша мероприятий"
admin.site.index_title = "Панель управления"

urlpatterns = [
    path("admin/", admin.site.urls),
]
