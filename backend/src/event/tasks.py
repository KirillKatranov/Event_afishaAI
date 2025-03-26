import time

from celery import shared_task
from celery.utils.log import get_task_logger
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "event_afisha.settings")
os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"

from event.models import Content, User, Like
from datetime import date
from django.utils.timezone import now
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


@shared_task
def sample_task():
    """Task to delete old events based on date conditions."""
    today = now().date()

    # Удаляем события, у которых:
    # 1. date_start и date_end заданы, но текущая дата уже вышла за диапазон
    # 2. date_end = NULL (однодневное событие) и текущая дата > date_start
    # 3. date_end = date_start (однодневное событие) и текущая дата > date_start
    deleted_count, _ = Content.objects.filter(
        # События с указанными датами начала и окончания, которые уже завершились
        (
            Q(date_start__isnull=False)
            & Q(date_end__isnull=False)
            & Q(date_end__lt=today)
        )
        |
        # Однодневные события без date_end, но уже прошедшие
        (
            Q(date_start__isnull=False)
            & Q(date_end__isnull=True)
            & Q(date_start__lt=today)
        )
        |
        # Однодневные события, где date_start = date_end, и они уже прошли
        (
            Q(date_start__isnull=False)
            & Q(date_end__isnull=False)
            & Q(date_start=F("date_end"))
            & Q(date_start__lt=today)
        )
    ).delete()

    print(f"Deleted {deleted_count} events with outdated dates")


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
