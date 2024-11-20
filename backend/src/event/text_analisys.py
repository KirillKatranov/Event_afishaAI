from yandexgptlite import YandexGPTLite
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "event_afisha.settings")
os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"
django.setup()

from event.models import Tags


class LLMTextAnalysis:
    def __init__(self) -> None:
        self.account = YandexGPTLite("b1gas0roisoqujc22qnc", "y0_AgAAAAA85yPjAATuwQAAAAEU6JN6AACgNyQ_6wtCa7zQ-JXuXG27vZvncQ")

    def extract_date(self, text: str) -> str:
        extract_datetime_query = "Выдели одну дату в формате YYYY-MM.DD учти что сейчас 2024 год в ответе дай только дату, если дат несколько выбери самую позднюю. Ответ дать в виде одного слова без пояснений и без обрамлений."
        task_extract_datetime = extract_datetime_query + text
        return self.account.create_completion(task_extract_datetime, temperature='0', system_prompt='Отвечай на русском')

    def extract_category(self, text: str) -> str:
        tags = [tag.name for tag in list(Tags.objects.only('name'))]
        categories = ",".join(tags)
        extract_datetime_query = f"К какой категории больше всего относится это мероприятие {categories}. Ответ дать в виде одного слова без пояснений и без точки в конце"
        task_extract_datetime = extract_datetime_query + text
        return self.account.create_completion(task_extract_datetime, temperature='0', system_prompt='Отвечай на русском')

    def shorten_text(self, text: str) -> str:
        extract_datetime_query = "Оформи текст по структуре дата, место, время, адрес, краткое описание. Выровни текст по левому краю.  Убери из текста все ссылки. Если нет данных для одного из полей, то пропусти это поле. Между полями оставь пустые строки."
        task_extract_datetime = extract_datetime_query + text
        return self.account.create_completion(task_extract_datetime, temperature="0", system_prompt='Отвечай на русском')

    def get_time(self, text: str) -> str:
        extract_datetime_query = "Выдели из текста время начало мероприятия. В ответе укажите только время."
        task_extract_datetime = extract_datetime_query + text
        return self.account.create_completion(task_extract_datetime, temperature="0", system_prompt='Отвечай на русском')

    def get_location(self, text: str) -> str:
        extract_datetime_query = "Выдели из текста адрес местоположения мероприятия."
        task_extract_datetime = extract_datetime_query + text
        return self.account.create_completion(task_extract_datetime, temperature="0", system_prompt='Отвечай на русском')

    def get_cost(self, text: str) -> str:
        extract_datetime_query = "Выдели из текста стомость мероприятия. Если стоимость не указана верни число 0. Ответь дай в виде числа и больше ничего."
        task_extract_datetime = extract_datetime_query + text
        return self.account.create_completion(task_extract_datetime, temperature="0", system_prompt='Отвечай на русском')

    def shorten_text_second(self, text: str) -> str:
        extract_datetime_query = "Сформулируй из этого текста короткий текст для объялвения в афише"
        task_extract_datetime = extract_datetime_query + text
        return self.account.create_completion(task_extract_datetime, temperature="0", system_prompt='Отвечай на русском')

    def is_location(self, text: str) -> str:
        extract_datetime_query = "Это адрес или название места? дай односложный ответ да или нет:"
        task_extract_datetime = extract_datetime_query + text
        return self.account.create_completion(task_extract_datetime, temperature="0", system_prompt='Отвечай на русском')

    def is_time(self, text: str) -> str:
        extract_datetime_query = "Это часы и минуты? дай односложный ответ да или нет "
        task_extract_datetime = extract_datetime_query + text
        return self.account.create_completion(task_extract_datetime, temperature="0", system_prompt='Отвечай на русском')

    def extract_name_event(self, text: str) -> str:
        extract_datetime_query = "Составь название мероприятия, в ответе дать только название без пояснений в формате 'Название'. Ответ дать без пояснений и без обрамлений"
        task_extract_datetime = extract_datetime_query + text
        return self.account.create_completion(task_extract_datetime, temperature="0", system_prompt='Отвечай на русском')

    def create_name_for_link(self, text: str) -> str:
        extract_datetime_query = "Придумай имя для ссылки. В ответе дай только имя."
        task_extract_datetime = extract_datetime_query + text
        return self.account.create_completion(task_extract_datetime, temperature="0",
                                              system_prompt='Отвечай на русском')