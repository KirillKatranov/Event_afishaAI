from aiogram import Bot, Dispatcher, types
import asyncio

from minio import Minio
import os
from aiogram.filters import Command
from aiogram.types.input_file import BufferedInputFile

bot = Bot(os.getenv("BOT_TOKEN"))
dp = Dispatcher()
client: Minio = Minio(
        os.getenv("MINIO_URL", "afishabot.ru"),
        access_key=os.getenv("ACCESS_KEY"),
        secret_key=os.getenv("SECRET_KEY"),
        secure=False,
    )


@dp.message(Command("start"))
async def start_command_handler(message: types.Message):
    name = "strelka.jpg"
    data = client.get_object(bucket_name="afisha-files", object_name=name).data
    await bot.send_photo(
        chat_id=message.chat.id,
        photo=BufferedInputFile(data, filename=name),
        caption="Привет!\n\nСтрелка укажет путь к новому! Здесь ты найдёшь как расширить сферу своих интересов, круг общения и мировоззрение\n\n"
                "Давай вместе посмотрим, что ждёт нас в ближайшем будущем 🎉\n\n"
                "Нажимай open app слева и поехали!!"
    )


async def main():
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
