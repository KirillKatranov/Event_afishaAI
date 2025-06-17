import os
from minio import Minio

# MinIO client initialization
minio_client = Minio(
    os.getenv("MINIO_ENDPOINT", "minio:9000").replace("http://", ""),
    access_key=os.getenv("MINIO_ROOT_USER", "minioadmin"),
    secret_key=os.getenv("MINIO_ROOT_PASSWORD", "minioadmin"),
    secure=False,
)

# Ensure bucket exists
bucket_name = os.getenv("MINIO_BUCKET_NAME", "afisha-files")


def create_bucket_if_not_exists():
    """Create a bucket if it does not exist."""
    bucket_policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {"AWS": "*"},
                "Action": ["s3:GetObject"],
                "Resource": [f"arn:aws:s3:::{bucket_name}/*"],
            }
        ],
    }

    try:
        if not minio_client.bucket_exists(bucket_name):
            minio_client.make_bucket(bucket_name)
            minio_client.set_bucket_policy(
                bucket_name,
                bucket_policy,
            )
    except Exception as e:
        print(f"Error initializing MinIO bucket: {e}")


create_bucket_if_not_exists()
