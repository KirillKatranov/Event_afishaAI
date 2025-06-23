from django.core.management.base import BaseCommand
from django.db import transaction
from event.models import Content


class Command(BaseCommand):
    help = "Исправляет названия мест (Content с тегами places), которые начинаются с маленькой буквы"

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Показать изменения без их применения",
        )
        parser.add_argument(
            "--force",
            action="store_true",
            help="Применить изменения без подтверждения",
        )

    def handle(self, *args, **options):
        dry_run = options["dry_run"]
        force = options["force"]

        # Получаем все места (Content с тегами из макрокатегории 'places')
        places = Content.objects.filter(tags__macro_category__name="places").distinct()

        # Находим места с названиями, начинающимися с маленькой буквы
        places_to_fix = []
        for place in places:
            if place.name and place.name[0].islower():
                places_to_fix.append(place)

        if not places_to_fix:
            self.stdout.write(
                self.style.SUCCESS(
                    "✅ Все названия мест уже начинаются с большой буквы!"
                )
            )
            return

        self.stdout.write(
            self.style.WARNING(
                f"🔍 Найдено {len(places_to_fix)} мест с названиями, начинающимися с маленькой буквы:"
            )
        )

        # Показываем изменения
        for place in places_to_fix:
            old_name = place.name
            new_name = place.name.capitalize()
            self.stdout.write(f'  📍 ID {place.id}: "{old_name}" → "{new_name}"')

        if dry_run:
            self.stdout.write(
                self.style.WARNING(
                    "🔧 Это был dry-run. Для применения изменений запустите команду без --dry-run"
                )
            )
            return

        # Подтверждение перед применением изменений
        if not force:
            confirm = input(
                f"\n❓ Исправить названия {len(places_to_fix)} мест? (y/N): "
            )
            if confirm.lower() != "y":
                self.stdout.write(self.style.ERROR("❌ Операция отменена"))
                return

        # Применяем изменения
        updated_count = 0
        with transaction.atomic():
            for place in places_to_fix:
                old_name = place.name
                place.name = place.name.capitalize()
                place.save()
                updated_count += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f'✅ Обновлено: ID {place.id} "{old_name}" → "{place.name}"'
                    )
                )

        self.stdout.write(
            self.style.SUCCESS(f"🎉 Успешно обновлено {updated_count} названий мест!")
        )
