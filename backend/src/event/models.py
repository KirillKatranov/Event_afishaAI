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
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class User(GenericModel):
    username = models.CharField(max_length=250, db_index=True)
    city = models.CharField(max_length=50, choices=CITY_CHOICES, default="nn")

    def __str__(self):
        return f"{self.username}"


class MacroCategory(models.Model):
    name = models.CharField(max_length=250, db_index=True)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(
        upload_to="images_macrocategory", max_length=300, blank=True, null=True
    )

    def __str__(self):
        return self.name


class Tags(GenericModel):
    name = models.CharField(max_length=250, db_index=True)
    description = models.TextField()
    macro_category = models.ForeignKey(
        MacroCategory,
        on_delete=models.SET_NULL,
        related_name="tags",
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"{self.name}"


class Content(GenericModel):
    name = models.CharField(max_length=250)
    description = models.TextField()
    tags = models.ManyToManyField(Tags, related_name="contents")
    image = models.ImageField(upload_to="images", max_length=300, null=True, blank=True)
    contact = models.JSONField(default=dict, null=True, blank=True)
    date_start = models.DateField(null=True, blank=True, db_index=True)
    date_end = models.DateField(null=True, blank=True, db_index=True)
    time = models.CharField(max_length=250, null=True, blank=True, default=None)
    location = models.CharField(max_length=250, null=True, blank=True, default=None)
    cost = models.IntegerField(null=True, blank=True, default=None)
    city = models.CharField(max_length=50, choices=CITY_CHOICES, default="nn")
    unique_id = models.CharField(max_length=250, unique=True, editable=False)

    event_type = models.CharField(
        max_length=10, choices=EventType.choices, default=EventType.OFFLINE
    )
    publisher_type = models.CharField(
        max_length=20, choices=PublisherType.choices, default=PublisherType.USER
    )
    publisher_id = models.IntegerField(default=1_000_000)

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
        ordering = ["date_start"]
        indexes = [
            models.Index(fields=["date_start"]),
            models.Index(fields=["date_end"]),
            models.Index(fields=["publisher_type", "publisher_id"]),
        ]


class Organisation(GenericModel):
    name = models.CharField(max_length=250)
    phone = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=250)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="organisations"
    )
    image = models.ImageField(
        upload_to="organisation_images",
        max_length=300,
        null=True,
        blank=True,
        storage=MinioMediaStorage(),
    )

    def __str__(self):
        return self.name


class Like(GenericModel):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="likes", db_index=True
    )
    content = models.ForeignKey(
        Content, on_delete=models.CASCADE, related_name="likes", db_index=True
    )
    value = models.BooleanField()

    class Meta:
        unique_together = ("user", "content")
        indexes = [models.Index(fields=["user", "content"])]

    def __str__(self):
        return f"{self.user.username} - {self.content.name} - {self.value} - {self.created}"


class Feedback(GenericModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="feedback")
    message = models.TextField()


class RemovedFavorite(models.Model):
    """Эта таблица будет фиксировать, что пользователь исключил конкретный контент из избранного."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, db_index=True)
    content = models.ForeignKey(Content, on_delete=models.CASCADE, db_index=True)
    removed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "content")
        indexes = [models.Index(fields=["user", "content"])]


class UserCategoryPreference(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="category_preferences"
    )
    tag = models.ForeignKey(
        Tags, on_delete=models.CASCADE, related_name="user_preferences"
    )

    class Meta:
        unique_together = ("user", "tag")

    def __str__(self):
        return f"{self.user.username} - {self.tag.name}"
