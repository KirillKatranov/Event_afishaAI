import time

from celery import shared_task
from celery.utils.log import get_task_logger
import os
from django.utils import timezone

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "event_afisha.settings")
os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"

from event.models import Content, User, Like
from datetime import date, timedelta
import requests
from pyrogram.errors import FloodWait
from django.db.models import Q, F

logger = get_task_logger(__name__)

from aiogram import Bot  # noqa: E402

# Укажите токен вашего бота
API_TOKEN = "7517129777:AAFyHsU_fM15AqXQHdBt-e9ytG3JQJXOIqg"

# Список пользователей
USERS = ["adbogatov"]

# todo: 1) Реализовать класс который умеет делать рассылку
# todo: 2) Реализвовать периодическую задачу которая осматривает избранное у всех пользователей и делает рассылку (напоминания)


from pyrogram import Client  # noqa: E402
from pyrogram.raw.functions.contacts import ResolveUsername  # noqa: E402

BOT_TOKEN = "7517129777:AAFyHsU_fM15AqXQHdBt-e9ytG3JQJXOIqg"
bot = Bot(token=API_TOKEN)

pyrogram_client = Client(
    "bot",
    api_id=6,
    api_hash="eb06d4abfb49dc3eeb1aeb98ae0f581e",
    bot_token=BOT_TOKEN,
    app_version="7.7.2",
    device_model="Lenovo Z6 Lite",
    system_version="11 R",
)


def resolve_username_to_user_id(username: str) -> int | None:
    with pyrogram_client:
        try:
            r = pyrogram_client.invoke(ResolveUsername(username=username))
            if r.users:
                return r.users[0].id
            return None
        except:  # noqa: E722
            return None


@shared_task(bind=True, max_retries=3)
def delete_outdated_events(self):
    """Task to delete old events based on date conditions."""
    try:
        logger.info("Starting deletion of outdated events")

        # Используем текущую дату в UTC
        today = timezone.now().date()
        yesterday = today - timedelta(days=1)

        logger.info(f"Checking events before {yesterday} (UTC)")

        # 1. События с указанными датами начала и окончания
        multi_day_events = Content.objects.filter(
            Q(date_start__isnull=False)
            & Q(date_end__isnull=False)
            & ~Q(date_start=F("date_end"))  # Исключаем однодневные события
            & Q(date_end__lt=yesterday)
        )

        # 2. Однодневные события без даты окончания
        single_day_no_end = Content.objects.filter(
            Q(date_start__isnull=False)
            & Q(date_end__isnull=True)
            & Q(date_start__lt=yesterday)
        )

        # 3. Однодневные события с одинаковыми датами начала и окончания
        single_day_same_dates = Content.objects.filter(
            Q(date_start__isnull=False)
            & Q(date_end__isnull=False)
            & Q(date_start=F("date_end"))
            & Q(date_start__lt=yesterday)
        )

        # Логируем каждый тип событий отдельно
        multi_day_list = list(
            multi_day_events.values("id", "name", "date_start", "date_end")
        )
        single_no_end_list = list(single_day_no_end.values("id", "name", "date_start"))
        single_same_dates_list = list(
            single_day_same_dates.values("id", "name", "date_start", "date_end")
        )

        logger.info(
            f"Found {len(multi_day_list)} multi-day events to delete: {multi_day_list}"
        )
        logger.info(
            f"Found {len(single_no_end_list)} single-day events (no end date) to delete: {single_no_end_list}"
        )
        logger.info(
            f"Found {len(single_same_dates_list)} single-day events (same dates) to delete: {single_same_dates_list}"
        )

        # Объединяем все запросы
        all_events = multi_day_events | single_day_no_end | single_day_same_dates

        # Удаляем события
        deleted_count, details = all_events.delete()

        logger.info(f"Successfully deleted {deleted_count} events with outdated dates")
        return {
            "status": "success",
            "deleted_count": deleted_count,
            "details": {
                "multi_day_events": len(multi_day_list),
                "single_day_no_end": len(single_no_end_list),
                "single_day_same_dates": len(single_same_dates_list),
            },
        }

    except Exception as exc:
        logger.error(f"Error in delete_outdated_events: {exc}", exc_info=True)
        self.retry(exc=exc, countdown=3600)


@shared_task
def notification_task():
    users = User.objects.all()
    today = date.today()
    for user in users:
        # todo: проверить что по датам все корректно отрабатывает
        # likes = user.likes
        likes = Like.objects.filter(user=user, value=True, content__date__lte=today)
        print(f"{likes}")
        if likes:
            for like in likes:
                link = f"https://t.me/EventAfishaBot/strelka?startapp={like.content.id}"
                message = (
                    f"🎉 Привет!\nНе забывай, что у тебя сегодня запланировано мероприятие!\n🔗 "
                    f"[Перейти к подробностям]({link})\n"
                    f"Пусть это будет отличное время и море впечатлений! Наслаждайся! 😊✨"
                )
                try:
                    chat_id = resolve_username_to_user_id(user.username)
                    payload = {
                        "chat_id": chat_id,
                        "text": message,
                        "parse_mode": "Markdown",
                    }
                    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage?chat_id={chat_id}&text={message}"
                    response = requests.post(url, json=payload)
                    print(f"Response: {response.status_code}, {response.text}")
                    time.sleep(1)
                except FloodWait as e:
                    print(f"FloodWait: жду {e.value} секунд...")
                    time.sleep(e.value)  # Ждем указанное количество секунд
                except Exception as ex:
                    print(f"Ошибка: {ex}")
