from django.core.management.base import BaseCommand
from django.utils import timezone
from event.models import User, Content, Like
from datetime import datetime, timedelta
import uuid

class Command(BaseCommand):
    help = 'Sets up test data for event notifications'

    def handle(self, *args, **kwargs):
        # Create test user
        user, created = User.objects.get_or_create(
            username='WetsGrow',
            defaults={'city': 'nn'}
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created test user: {user.username}'))
        else:
            self.stdout.write(self.style.SUCCESS(f'Using existing user: {user.username}'))

        # Create single-day event for today (10.06.2025)
        today_event = Content.objects.create(
            name='Концерт "Летний джаз"',
            description='Великолепный джазовый концерт под открытым небом. Живая музыка, прекрасная атмосфера и незабываемые впечатления!',
            date_start=datetime(2025, 6, 17).date(),
            date_end=datetime(2025, 6, 17).date(),  # тот же день
            time='19:30',
            location='Парк "Швейцария", Главная сцена',
            city='nn',
            unique_id=str(uuid.uuid4()),
            cost=1500,
            contact={
                "phone": "+7 (999) 123-45-67",
                "email": "jazz@example.com"
            }
        )
        self.stdout.write(self.style.SUCCESS(f'Created single-day event: {today_event.name} (ID: {today_event.id})'))

        # Create multi-day event that started yesterday but is still active today
        multiday_event = Content.objects.create(
            name='Фестиваль современного искусства "АртПространство"',
            description='Масштабный фестиваль современного искусства. Выставки, инсталляции, перформансы, лекции и мастер-классы.',
            date_start=datetime(2025, 6, 9).date(),  # вчера
            date_end=datetime(2025, 6, 18).date(),   # через 2 дня
            time='10:00-22:00',
            location='Арсенал, Кремль, 6',
            city='nn',
            unique_id=str(uuid.uuid4()),
            cost=800,
            contact={
                "phone": "+7 (999) 765-43-21",
                "email": "art@example.com"
            }
        )
        self.stdout.write(self.style.SUCCESS(f'Created multi-day event: {multiday_event.name} (ID: {multiday_event.id})'))

        # Create another multi-day event that starts today and continues tomorrow
        another_multiday_event = Content.objects.create(
            name='Гастрономический фестиваль "Вкусный город"',
            description='Два дня кулинарного искусства! Дегустации от лучших ресторанов города, мастер-классы от шеф-поваров, развлекательная программа.',
            date_start=datetime(2025, 6, 17).date(),  # сегодня
            date_end=datetime(2025, 6, 18).date(),    # завтра
            time='12:00-23:00',
            location='Площадь Минина и Пожарского',
            city='nn',
            unique_id=str(uuid.uuid4()),
            cost=500,
            contact={
                "phone": "+7 (999) 999-99-99",
                "email": "food@example.com"
            }
        )
        self.stdout.write(self.style.SUCCESS(f'Created another multi-day event: {another_multiday_event.name} (ID: {another_multiday_event.id})'))

        # Create future multi-day event (should not appear in notifications)
        future_event = Content.objects.create(
            name='Книжная ярмарка "Читающий Нижний"',
            description='Большая книжная ярмарка с участием издательств со всей России. Встречи с авторами, презентации книг, детская программа.',
            date_start=(datetime(2025, 6, 20).date()),  # через 5 дней
            date_end=(datetime(2025, 6, 21).date()),    # через 7 дней
            time='10:00-20:00',
            location='Нижегородская ярмарка',
            city='nn',
            unique_id=str(uuid.uuid4()),
            cost=0,  # бесплатно
            contact={
                "phone": "+7 (999) 888-77-66",
                "email": "books@example.com"
            }
        )
        self.stdout.write(self.style.SUCCESS(f'Created future event: {future_event.name} (ID: {future_event.id})'))

        # Add today's events to user's favorites
        for event in [today_event, multiday_event, another_multiday_event]:
            like, created = Like.objects.get_or_create(
                user=user,
                content=event,
                defaults={'value': True}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Added event "{event.name}" to {user.username}\'s favorites'))
            else:
                self.stdout.write(self.style.SUCCESS(f'Event "{event.name}" was already in {user.username}\'s favorites'))

        self.stdout.write(self.style.SUCCESS('Test data setup completed successfully')) 