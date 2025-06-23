from django.db import models
from .storage import MinioMediaStorage

CITY_CHOICES = [
    ("spb", "Санкт-Петербург"),
    ("msk", "Москва"),
    ("ekb", "Екатеринбург"),
    ("nsk", "Новосибирск"),
    ("nn", "Нижний Новгород"),
]


class EventType(models.TextChoices):
    ONLINE = "online", "Онлайн"
    OFFLINE = "offline", "Оффлайн"


class PublisherType(models.TextChoices):
    USER = "user", "Пользователь"
    ORGANISATION = "organisation", "Организация"


class GenericModel(models.Model):
    created = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        abstract = True


class User(GenericModel):
    username = models.CharField(
        max_length=250, db_index=True, verbose_name="Имя пользователя"
    )
    city = models.CharField(
        max_length=50, choices=CITY_CHOICES, default="nn", verbose_name="Город"
    )

    def __str__(self):
        return f"{self.username}"

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"


class MacroCategory(models.Model):
    name = models.CharField(max_length=250, db_index=True, verbose_name="Название")
    description = models.TextField(blank=True, null=True, verbose_name="Описание")
    image = models.ImageField(
        upload_to="images_macrocategory",
        max_length=300,
        blank=True,
        null=True,
        verbose_name="Изображение",
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Макрокатегория"
        verbose_name_plural = "Макрокатегории"


class Tags(GenericModel):
    name = models.CharField(max_length=250, db_index=True, verbose_name="Название")
    description = models.TextField(verbose_name="Описание")
    macro_category = models.ForeignKey(
        MacroCategory,
        on_delete=models.SET_NULL,
        related_name="tags",
        null=True,
        blank=True,
        verbose_name="Макрокатегория",
    )

    def __str__(self):
        return f"{self.name}"

    class Meta:
        verbose_name = "Тег"
        verbose_name_plural = "Теги"


class Content(GenericModel):
    name = models.CharField(max_length=250, verbose_name="Название")
    description = models.TextField(verbose_name="Описание")
    tags = models.ManyToManyField(Tags, related_name="contents", verbose_name="Теги")
    image = models.ImageField(
        upload_to="images",
        max_length=300,
        null=True,
        blank=True,
        verbose_name="Изображение",
    )
    contact = models.JSONField(
        default=lambda: [{}], null=True, blank=True, verbose_name="Контакты"
    )
    date_start = models.DateField(
        null=True, blank=True, db_index=True, verbose_name="Дата начала"
    )
    date_end = models.DateField(
        null=True, blank=True, db_index=True, verbose_name="Дата окончания"
    )
    time = models.CharField(
        max_length=250, null=True, blank=True, default=None, verbose_name="Время"
    )
    location = models.CharField(
        max_length=250,
        null=True,
        blank=True,
        default=None,
        verbose_name="Место проведения",
    )
    cost = models.IntegerField(
        null=True, blank=True, default=None, verbose_name="Стоимость"
    )
    city = models.CharField(
        max_length=50, choices=CITY_CHOICES, default="nn", verbose_name="Город"
    )
    unique_id = models.CharField(
        max_length=250, unique=True, verbose_name="Уникальный ID"
    )

    event_type = models.CharField(
        max_length=10,
        choices=EventType.choices,
        default=EventType.OFFLINE,
        verbose_name="Тип мероприятия",
    )
    publisher_type = models.CharField(
        max_length=20,
        choices=PublisherType.choices,
        default=PublisherType.USER,
        verbose_name="Тип издателя",
    )
    publisher_id = models.IntegerField(default=1_000_000, verbose_name="ID издателя")

    def get_tags(self):
        tags = self.tags.all()
        if tags.exists():
            return "\n".join([t.name for t in tags])
        return "Без тегов"

    get_tags.short_description = "Теги"

    def get_macro(self) -> str:
        tags = self.tags.all()
        if tags.exists():
            first_tag = tags[0]
            if first_tag.macro_category:
                return str(first_tag.macro_category.name)
            else:
                return "Без категории"
        return "Без тегов"

    get_macro.short_description = "Категория"

    def __str__(self):
        return f"{self.name}"

    class Meta:
        verbose_name = "Мероприятие"
        verbose_name_plural = "Мероприятия"
        ordering = ["date_start"]
        indexes = [
            models.Index(fields=["date_start"]),
            models.Index(fields=["date_end"]),
            models.Index(fields=["publisher_type", "publisher_id"]),
        ]


class EventManager(models.Manager):
    """Менеджер для событий - фильтрует контент с тегами из категорий кроме 'places'"""

    def get_queryset(self):
        # Показываем только контент, который имеет теги НЕ из категории 'places'
        # Исключаем контент без тегов и контент только с тегами из 'places'
        return (
            super()
            .get_queryset()
            .filter(tags__isnull=False)  # Только с тегами
            .exclude(tags__macro_category__name="places")  # Исключаем places
            .distinct()
        )


class PlaceManager(models.Manager):
    """Менеджер для мест - фильтрует контент с тегами из категории 'places'"""

    def get_queryset(self):
        return (
            super()
            .get_queryset()
            .filter(tags__macro_category__name="places")
            .distinct()
        )


class Event(Content):
    """Прокси-модель для событий/мероприятий"""

    objects = EventManager()

    class Meta:
        proxy = True
        verbose_name = "Событие"
        verbose_name_plural = "События"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)


class Place(Content):
    """Прокси-модель для мест"""

    objects = PlaceManager()

    class Meta:
        proxy = True
        verbose_name = "Место"
        verbose_name_plural = "Места"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)


class Organisation(GenericModel):
    name = models.CharField(max_length=250, verbose_name="Название")
    phone = models.CharField(max_length=20, verbose_name="Телефон")
    email = models.EmailField(unique=True, verbose_name="Email")
    password = models.CharField(max_length=250, verbose_name="Пароль")
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="organisations",
        verbose_name="Пользователь",
    )
    image = models.ImageField(
        upload_to="organisation_images",
        max_length=300,
        null=True,
        blank=True,
        storage=MinioMediaStorage(),
        verbose_name="Изображение",
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Организация"
        verbose_name_plural = "Организации"


class Like(GenericModel):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="likes",
        db_index=True,
        verbose_name="Пользователь",
    )
    content = models.ForeignKey(
        Content,
        on_delete=models.CASCADE,
        related_name="likes",
        db_index=True,
        verbose_name="Мероприятие",
    )
    value = models.BooleanField(verbose_name="Значение лайка")

    class Meta:
        verbose_name = "Лайк"
        verbose_name_plural = "Лайки"
        unique_together = ("user", "content")
        indexes = [models.Index(fields=["user", "content"])]

    def __str__(self):
        return f"{self.user.username} - {self.content.name} - {self.value} - {self.created}"


class Review(GenericModel):
    """Модель отзывов пользователей к мероприятиям"""

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="reviews",
        verbose_name="Пользователь",
        db_index=True,
    )
    content = models.ForeignKey(
        Content,
        on_delete=models.CASCADE,
        related_name="reviews",
        verbose_name="Мероприятие",
        db_index=True,
    )
    text = models.TextField(verbose_name="Текст отзыва")

    class Meta:
        verbose_name = "Отзыв"
        verbose_name_plural = "Отзывы"
        ordering = ["-created"]
        indexes = [
            models.Index(fields=["content"]),
            models.Index(fields=["user"]),
            models.Index(fields=["user", "content"]),
            models.Index(fields=["-created"]),
        ]

    def __str__(self):
        return f"Отзыв от {self.user.username} к {self.content.name}"

    def get_short_text(self):
        """Возвращает сокращенный текст отзыва для админки"""
        if len(self.text) > 100:
            return self.text[:100] + "..."
        return self.text

    get_short_text.short_description = "Текст отзыва"


class Rating(GenericModel):
    """Модель оценок пользователей к мероприятиям"""

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="ratings",
        verbose_name="Пользователь",
        db_index=True,
    )
    content = models.ForeignKey(
        Content,
        on_delete=models.CASCADE,
        related_name="ratings",
        verbose_name="Мероприятие",
        db_index=True,
    )
    rating = models.PositiveSmallIntegerField(
        verbose_name="Оценка", help_text="Оценка от 0 до 5"
    )

    class Meta:
        verbose_name = "Оценка"
        verbose_name_plural = "Оценки"
        ordering = ["-created"]
        unique_together = (
            "user",
            "content",
        )  # Один пользователь может поставить только одну оценку мероприятию
        indexes = [
            models.Index(fields=["content"]),
            models.Index(fields=["user"]),
            models.Index(fields=["user", "content"]),
            models.Index(fields=["-created"]),
            models.Index(fields=["rating"]),
        ]

    def __str__(self):
        return f"Оценка {self.rating} от {self.user.username} к {self.content.name}"

    def clean(self):
        """Валидация оценки"""
        from django.core.exceptions import ValidationError

        if self.rating < 0 or self.rating > 5:
            raise ValidationError("Оценка должна быть от 0 до 5")


class Feedback(GenericModel):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="feedback",
        verbose_name="Пользователь",
    )
    message = models.TextField(verbose_name="Сообщение")

    class Meta:
        verbose_name = "Обратная связь"
        verbose_name_plural = "Обратная связь"

    def __str__(self):
        return f"Обратная связь от {self.user.username}"


class RemovedFavorite(models.Model):
    """Эта таблица будет фиксировать, что пользователь исключил конкретный контент из избранного."""

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, db_index=True, verbose_name="Пользователь"
    )
    content = models.ForeignKey(
        Content, on_delete=models.CASCADE, db_index=True, verbose_name="Мероприятие"
    )
    removed_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата удаления")

    class Meta:
        verbose_name = "Удаленное из избранного"
        verbose_name_plural = "Удаленное из избранного"
        unique_together = ("user", "content")
        indexes = [models.Index(fields=["user", "content"])]

    def __str__(self):
        return f"{self.user.username} - {self.content.name}"


class UserCategoryPreference(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="category_preferences",
        verbose_name="Пользователь",
    )
    tag = models.ForeignKey(
        Tags,
        on_delete=models.CASCADE,
        related_name="user_preferences",
        verbose_name="Тег",
    )

    class Meta:
        verbose_name = "Предпочтение пользователя"
        verbose_name_plural = "Предпочтения пользователей"
        unique_together = ("user", "tag")

    def __str__(self):
        return f"{self.user.username} - {self.tag.name}"


class Route(GenericModel):
    """Модель маршрутов"""

    name = models.CharField(max_length=250, verbose_name="Название маршрута")
    description = models.TextField(verbose_name="Описание")
    places = models.ManyToManyField(
        Content,
        related_name="routes",
        verbose_name="Места",
        limit_choices_to={"tags__macro_category__name": "places"},
    )
    duration_km = models.CharField(max_length=50, verbose_name="Протяжённость (км)")
    duration_hours = models.CharField(max_length=50, verbose_name="Время (часы)")
    tags = models.ManyToManyField(
        Tags,
        related_name="routes",
        verbose_name="Теги",
        limit_choices_to={"macro_category__name": "маршрут"},
    )
    map_link = models.URLField(verbose_name="Ссылка на карты")
    city = models.CharField(
        max_length=50, choices=CITY_CHOICES, default="nn", verbose_name="Город"
    )

    class Meta:
        verbose_name = "Маршрут"
        verbose_name_plural = "Маршруты"
        ordering = ["name"]

    def __str__(self):
        return self.name

    def get_places_list(self):
        """Возвращает список мест маршрута через запятую"""
        return " / ".join([place.name for place in self.places.all()])

    def get_tags_list(self):
        """Возвращает список тегов маршрута через запятую"""
        return " / ".join([tag.name for tag in self.tags.all()])


class RoutePhoto(GenericModel):
    """Модель фотографий маршрутов"""

    route = models.ForeignKey(
        Route, on_delete=models.CASCADE, related_name="photos", verbose_name="Маршрут"
    )
    image = models.ImageField(
        upload_to="route_images",
        max_length=300,
        storage=MinioMediaStorage(),
        verbose_name="Фотография",
    )
    description = models.CharField(
        max_length=250, blank=True, null=True, verbose_name="Описание фото"
    )
    order = models.PositiveIntegerField(default=0, verbose_name="Порядок")

    class Meta:
        verbose_name = "Фотография маршрута"
        verbose_name_plural = "Фотографии маршрутов"
        ordering = ["order", "created"]

    def __str__(self):
        return f"Фото маршрута {self.route.name}"
