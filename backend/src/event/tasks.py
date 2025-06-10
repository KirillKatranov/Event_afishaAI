import time
from celery import shared_task
from celery.utils.log import get_task_logger
import os
from datetime import date, datetime
from django.utils import timezone

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "event_afisha.settings")
os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"

from event.models import User, Like, Content
import requests
from pyrogram.errors import FloodWait
from pyrogram import Client
from pyrogram.raw.functions.contacts import ResolveUsername

logger = get_task_logger(__name__)

# Telegram Bot Configuration
BOT_TOKEN = "7877571254:AAElhiFd_H8Z8rk6i6hTVR-Q71hrAFpvHyY" #Токен тестового бота
API_ID = "24966956"
API_HASH = "de5018b0f9dcd93012624bf4cfed1b58"


pyrogram_client = Client(
    "bot",
    api_id=API_ID,
    api_hash=API_HASH,
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

def send_telegram_message(chat_id: int, message: str) -> bool:
    """Helper function to send a Telegram message using HTTP API"""
    try:
        url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
        payload = {
            "chat_id": chat_id,
            "text": message,
            "parse_mode": "HTML"
        }
        response = requests.post(url, json=payload)
        return response.status_code == 200
    except Exception as e:
        logger.error(f"Error sending telegram message: {str(e)}")
        return False

@shared_task
def send_event_notifications():
    """
    Send notifications to users about their events scheduled for today.
    This task is scheduled to run once daily at 9:00 AM.
    """
    logger.info("Starting event notifications task")
    
    try:
        # Get today's date
        today = timezone.now().date()
        
        # Get all likes (favorites) where the content's date_start is today
        today_likes = Like.objects.select_related('user', 'content').filter(
            content__date_start=today,
            value=True  # Only get positive likes (favorites)
        )
        
        # Group events by user
        user_events = {}
        for like in today_likes:
            if like.user not in user_events:
                user_events[like.user] = []
            user_events[like.user].append(like.content)
        
        # Send notifications to each user
        for user, events in user_events.items():
            try:
                # Get Telegram user ID
                telegram_id = resolve_username_to_user_id(user.username)
                if not telegram_id:
                    logger.warning(f"Could not resolve Telegram ID for user {user.username}")
                    continue
                
                # Prepare message text
                message = f"🎉 Привет! У вас сегодня запланированы мероприятия:\n\n"
                for event in events:
                    message += f"📅 {event.name}\n"
                    if event.time:
                        message += f"⏰ Время: {event.time}\n"
                    if event.location:
                        message += f"📍 Место: {event.location}\n"
                    message += "\n"
                
                # Send message
                if send_telegram_message(telegram_id, message):
                    logger.info(f"Successfully sent notification to user {user.username}")
                else:
                    logger.error(f"Failed to send notification to user {user.username}")
                
            except Exception as e:
                logger.error(f"Error processing user {user.username}: {str(e)}")
                continue
        
        logger.info("Completed event notifications task")
        return "Task completed successfully"
        
    except Exception as e:
        logger.error(f"Error in send_event_notifications task: {str(e)}")
        raise  # Re-raise the exception to mark the task as failed
