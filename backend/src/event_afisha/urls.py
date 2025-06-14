from django.contrib import admin
from django.urls import path

urlpatterns = [
    path("backend/", admin.site.urls),
]
