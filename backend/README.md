# event_afisha

# Порядок разворачивания проекта локально

1) docker-compose -f docker-compose-common.yml build && docker-compose -f docker-compose-common.yml up -d
2) Создаем access token в minio http://127.0.0.1:9001/access-keys
3) Кладем значения в ACCESS_KEY и SECRET_KEY в файле environments/web.env
4) docker-compose -f docker-compose-common.yml build && docker-compose -f docker-compose-common.yml up -d
