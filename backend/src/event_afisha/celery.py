import os

from celery import Celery
from celery.schedules import crontab

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "event_afisha.settings")

app = Celery("celery_django")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
