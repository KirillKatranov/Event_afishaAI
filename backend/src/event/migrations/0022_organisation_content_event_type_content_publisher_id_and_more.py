# Generated by Django 4.2 on 2025-05-28 20:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("event", "0021_alter_content_date_end_alter_content_date_start_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="Organisation",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created", models.DateTimeField(auto_now_add=True)),
                ("updated", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=250)),
                ("phone", models.CharField(max_length=20)),
                ("email", models.EmailField(max_length=254, unique=True)),
                ("password", models.CharField(max_length=250)),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.AddField(
            model_name="content",
            name="event_type",
            field=models.CharField(
                choices=[("online", "Онлайн"), ("offline", "Оффлайн")],
                default="offline",
                max_length=10,
            ),
        ),
        migrations.AddField(
            model_name="content",
            name="publisher_id",
            field=models.IntegerField(default=1000000),
        ),
        migrations.AddField(
            model_name="content",
            name="publisher_type",
            field=models.CharField(
                choices=[("user", "Пользователь"), ("organisation", "Организация")],
                default="user",
                max_length=20,
            ),
        ),
        migrations.AlterField(
            model_name="content",
            name="contact",
            field=models.JSONField(blank=True, default=dict, null=True),
        ),
        migrations.AlterField(
            model_name="user",
            name="username",
            field=models.CharField(db_index=True, max_length=250),
        ),
        migrations.AddIndex(
            model_name="content",
            index=models.Index(
                fields=["date_start"], name="event_conte_date_st_1c95b0_idx"
            ),
        ),
        migrations.AddIndex(
            model_name="content",
            index=models.Index(
                fields=["date_end"], name="event_conte_date_en_b727dc_idx"
            ),
        ),
        migrations.AddIndex(
            model_name="content",
            index=models.Index(
                fields=["publisher_type", "publisher_id"],
                name="event_conte_publish_edeecd_idx",
            ),
        ),
        migrations.AddIndex(
            model_name="like",
            index=models.Index(
                fields=["user", "content"], name="event_like_user_id_7c6271_idx"
            ),
        ),
        migrations.AddIndex(
            model_name="removedfavorite",
            index=models.Index(
                fields=["user", "content"], name="event_remov_user_id_736c8b_idx"
            ),
        ),
        migrations.AddField(
            model_name="organisation",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="organisations",
                to="event.user",
            ),
        ),
    ]
