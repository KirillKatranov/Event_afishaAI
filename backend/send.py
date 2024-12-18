import asyncio
from aiogram import Bot

# Укажите токен вашего бота
API_TOKEN = '7517129777:AAFyHsU_fM15AqXQHdBt-e9ytG3JQJXOIqg'

# Список пользователей
USERS = [
    "adbogatov"
]

#todo: 1) Реализовать класс который умеет делать рассылку
#todo: 2) Реализвовать периодическую задачу которая осматривает избранное у всех пользователей и делает рассылку (напоминания)


from pyrogram import Client
from pyrogram.raw.functions.contacts import ResolveUsername

BOT_TOKEN = "7517129777:AAFyHsU_fM15AqXQHdBt-e9ytG3JQJXOIqg"

pyrogram_client = Client(
    "bot",
    api_id=6,
    api_hash="eb06d4abfb49dc3eeb1aeb98ae0f581e",
    bot_token=BOT_TOKEN,
    app_version="7.7.2",
    device_model="Lenovo Z6 Lite",
    system_version="11 R"
)


def resolve_username_to_user_id(username: str) -> int | None:
    with pyrogram_client:
        try:
            r = pyrogram_client.invoke(ResolveUsername(username=username))
            if r.users:
                return r.users[0].id
            return None
        except:
            return None


USERS_IDS = [resolve_username_to_user_id(item) for item in USERS]


async def send_broadcast(bot, user_ids, message_text):
    for user_id in user_ids:
        try:
            await bot.send_photo(chat_id=user_id, caption=message_text, photo="https://afishabot.ru/afisha-files/2024-12-02 20.24.48.jpg")
            print(f"Сообщение отправлено пользователю {user_id}")
        except Exception as e:
            print(f"Ошибка при отправке пользователю {user_id}: {e}")


async def main():
    bot = Bot(token=API_TOKEN)
    message_text = """Привет, мы вернулись с обновлениями! 
    
Теперь Стрелка - это настоящее приложение внутри тг 📱

Для того чтобы открыть Стрелку нужно нажать в левом углу кнопку Open app 📲 

Сейчас можно выбирать мероприятия по категориям, добавлять их в избранное и планировать свои выходные через календарь! 📆

Мы постоянно работаем над Стрелкой и хотим делать ее лучше и лучше!

Ждем тебя у нас! ↗️"""
    await send_broadcast(bot, USERS_IDS, message_text)
    await bot.close()

if __name__ == "__main__":
    asyncio.run(main())
