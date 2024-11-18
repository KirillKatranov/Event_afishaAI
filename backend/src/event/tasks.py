from celery import shared_task
from celery.utils.log import get_task_logger
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "event_afisha.settings")
os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"

from event.models import Content
from datetime import datetime

logger = get_task_logger(__name__)


@shared_task
def sample_task():
    """Task to delete old events."""
    datetime_now = datetime.now()
    content = Content.objects.filter(date__lt=datetime_now).all()
    for event in content:
        event.delete()
