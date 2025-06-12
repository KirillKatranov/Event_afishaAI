from django.conf import settings
from storages.backends.s3boto3 import S3Boto3Storage


class MinioMediaStorage(S3Boto3Storage):
    """
    Кастомный класс для хранения медиафайлов в MinIO
    """

    bucket_name = settings.MINIO_BUCKET_NAME
    default_acl = "public-read"
    file_overwrite = False
    custom_domain = (
        f"{settings.MINIO_ENDPOINT.split('://')[1]}/{settings.MINIO_BUCKET_NAME}"
    )
