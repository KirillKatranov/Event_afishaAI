import os
from minio import Minio
from fastapi import UploadFile
import uuid

# Получаем настройки MinIO из переменных окружения
MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "minio:9000")
if MINIO_ENDPOINT.startswith("http://"):
    MINIO_ENDPOINT = MINIO_ENDPOINT[7:]
elif MINIO_ENDPOINT.startswith("https://"):
    MINIO_ENDPOINT = MINIO_ENDPOINT[8:]

MINIO_ACCESS_KEY = os.getenv("MINIO_ROOT_USER", "minioadmin")
MINIO_SECRET_KEY = os.getenv("MINIO_ROOT_PASSWORD", "minioadmin")
MINIO_BUCKET_NAME = os.getenv("MINIO_BUCKET_NAME", "afisha")

# Инициализируем клиент MinIO
minio_client = Minio(
    MINIO_ENDPOINT,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False,
)

# Создаем бакет, если он не существует
if not minio_client.bucket_exists(MINIO_BUCKET_NAME):
    minio_client.make_bucket(MINIO_BUCKET_NAME)
    # Устанавливаем политику публичного доступа для бакета
    policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {"AWS": "*"},
                "Action": ["s3:GetObject"],
                "Resource": [f"arn:aws:s3:::{MINIO_BUCKET_NAME}/*"],
            }
        ],
    }
    minio_client.set_bucket_policy(MINIO_BUCKET_NAME, policy)


async def upload_file(file: UploadFile, folder: str = "organisation_images") -> str:
    """
    Загружает файл в MinIO и возвращает URL для доступа к файлу

    Args:
        file (UploadFile): Загружаемый файл
        folder (str): Папка в бакете для сохранения файла

    Returns:
        str: URL для доступа к файлу
    """
    # Генерируем уникальное имя файла
    file_ext = os.path.splitext(file.filename)[1]
    file_name = f"{folder}/{str(uuid.uuid4())}{file_ext}"

    # Читаем содержимое файла
    file_content = await file.read()

    # Загружаем файл в MinIO
    minio_client.put_object(
        bucket_name=MINIO_BUCKET_NAME,
        object_name=file_name,
        data=file_content,
        length=len(file_content),
        content_type=file.content_type,
    )

    # Возвращаем URL для доступа к файлу
    return f"http://{MINIO_ENDPOINT}/{MINIO_BUCKET_NAME}/{file_name}"
