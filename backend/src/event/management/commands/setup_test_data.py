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

        # Create test event for today (10.06.2025)
        today_event = Content.objects.create(
            name='Концерт "Летний джаз"',
            description='Великолепный джазовый концерт под открытым небом. Живая музыка, прекрасная атмосфера и незабываемые впечатления!',
            date_start=datetime(2025, 6, 10).date(),
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
        self.stdout.write(self.style.SUCCESS(f'Created today\'s event: {today_event.name} (ID: {today_event.id})'))

        # Create another test event for today
        another_today_event = Content.objects.create(
            name='Мастер-класс по живописи',
            description='Профессиональный художник научит вас основам живописи маслом. Все материалы включены в стоимость.',
            date_start=datetime(2025, 6, 10).date(),
            time='15:00',
            location='Творческая студия "Палитра", ул. Минина, 24',
            city='nn',
            unique_id=str(uuid.uuid4()),
            cost=2000,
            contact={
                "phone": "+7 (999) 765-43-21",
                "email": "art@example.com"
            }
        )
        self.stdout.write(self.style.SUCCESS(f'Created another today\'s event: {another_today_event.name} (ID: {another_today_event.id})'))

        # Create test event for another date
        future_event = Content.objects.create(
            name='Фестиваль уличной еды',
            description='Большой гастрономический фестиваль с участием лучших шеф-поваров города. Дегустации, мастер-классы, развлекательная программа.',
            date_start=(datetime(2025, 6, 10) + timedelta(days=7)).date(),
            time='12:00',
            location='Площадь Минина и Пожарского',
            city='nn',
            unique_id=str(uuid.uuid4()),
            cost=500,
            contact={
                "phone": "+7 (999) 999-99-99",
                "email": "food@example.com"
            }
        )
        self.stdout.write(self.style.SUCCESS(f'Created future event: {future_event.name} (ID: {future_event.id})'))

        # Add today's events to user's favorites
        for event in [today_event, another_today_event]:
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