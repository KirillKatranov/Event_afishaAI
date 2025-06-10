from django.core.management.base import BaseCommand
from django.utils import timezone
from event.models import User, Content, Like
from datetime import datetime, timedelta

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
            name='Test Event Today',
            description='This is a test event for today',
            date_start=datetime(2025, 6, 10).date(),
            time='14:00',
            location='Test Location',
            city='nn',
            unique_id='test_event_today_001'
        )
        self.stdout.write(self.style.SUCCESS(f'Created today\'s event: {today_event.name}'))

        # Create test event for another date
        future_event = Content.objects.create(
            name='Test Event Future',
            description='This is a test event for the future',
            date_start=(datetime(2025, 6, 10) + timedelta(days=7)).date(),
            time='15:00',
            location='Test Location',
            city='nn',
            unique_id='test_event_future_001'
        )
        self.stdout.write(self.style.SUCCESS(f'Created future event: {future_event.name}'))

        # Add today's event to user's favorites
        like, created = Like.objects.get_or_create(
            user=user,
            content=today_event,
            defaults={'value': True}
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Added today\'s event to {user.username}\'s favorites'))
        else:
            self.stdout.write(self.style.SUCCESS(f'Today\'s event was already in {user.username}\'s favorites'))

        self.stdout.write(self.style.SUCCESS('Test data setup completed successfully')) 