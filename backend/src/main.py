from aiogram import Bot, Dispatcher, types
import asyncio

from minio import Minio
import django
import os
from aiogram import F
import aioredis
from event.text_analisys import LLMTextAnalysis
from datetime import datetime
from django.core.files import File
import time
import uuid
import string

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "event_afisha.settings")
os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"
django.setup()

from event.models import Content, Tags, Like, User


bot = Bot(os.getenv("BOT_TOKEN"))
dp = Dispatcher()
client: Minio = Minio(
        os.getenv("MINIO_URL", "minio:9000"),
        access_key=os.getenv("ACCESS_KEY"),
        secret_key=os.getenv("SECRET_KEY"),
        secure=False,
    )
redis = aioredis.from_url("redis://redis")


class DjangoObject:
    def __init__(self):
        self.user = User.objects
        self.content = Content.objects
        self.tags = Tags.objects
        self.like = Like.objects


django_object = DjangoObject()


@dp.message(F.photo)
async def any_message(message: types.Message):
    llm_text_analysis = LLMTextAnalysis()
    file = message.photo[-1]
    caption_entities = message.caption_entities
    links = []

    if caption_entities:
        for entity in caption_entities:
            if entity.type == 'text_link':
                link_name = llm_text_analysis.create_name_for_link(entity.url)
                links.append({link_name: entity.url})
                time.sleep(1)

    print(f'{links=}')
    file_tg = await bot.get_file(file.file_id)
    download_file = await bot.download_file(file_tg.file_path)
    date = llm_text_analysis.extract_date(message.caption).replace(".", "-")
    date = date.replace("Ответ: ", "")
    print(f'{date=}')
    date_datetime = datetime.fromisoformat(date)
    time.sleep(1)
    category = llm_text_analysis.extract_category(message.caption).replace(" ", "")

    for p in string.punctuation:
        if p in category:
            category = category.replace(p, '')

    print(f'{category=}')
    tag = Tags.objects.filter(name=category).first()
    print(f'{tag=}')
    time.sleep(1)
    description = llm_text_analysis.shorten_text(message.caption).replace("*", "")
    print(f'{description=}')
    time.sleep(1)
    name = llm_text_analysis.extract_name_event(message.caption).replace('"', "").replace("*", "")
    print(f'{name=}')
    content = Content(
        name=name,
        description=description,
        contact=links,
        date=date_datetime
    )
    print(f'{content=}')
    content.image.save(name=f'autopost{uuid.uuid4()}', content=File(download_file))
    content.save()
    content.tags.add(tag)
    print('save tags and send answer')
    await message.answer(
        f"Post created successfully! Category is {category}",
    )


async def main():
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
