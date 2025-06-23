# 💾 Бэкап и восстановление базы данных

## 📥 Создание полного дампа базы данных

```bash
docker exec -t backend-db-1 pg_dump -U afisha -d afisha > backup_$(date +%Y%m%d_%H%M%S).sql
```

Эта команда создаст файл с именем вида: `backup_20241223_143052.sql`

## 📤 Восстановление базы данных одной командой

```bash
cat backup_YYYYMMDD_HHMMSS.sql | docker exec -i backend-db-1 psql -U afisha -d afisha
```

**Замените** `backup_YYYYMMDD_HHMMSS.sql` на имя вашего файла бэкапа.

### Пример:
```bash
cat backup_20241223_143052.sql | docker exec -i backend-db-1 psql -U afisha -d afisha
```

## 📁 Бэкап MinIO хранилища (файлы изображений)

### Создание бэкапа MinIO:
```bash
# Создать архив всех файлов
docker exec backend-minio-1 tar -czf /tmp/minio_backup_$(date +%Y%m%d_%H%M%S).tar.gz /data

# Скопировать архив на хост
docker cp backend-minio-1:/tmp/minio_backup_$(date +%Y%m%d_%H%M%S).tar.gz ./

# Удалить временный файл из контейнера
docker exec backend-minio-1 rm /tmp/minio_backup_$(date +%Y%m%d_%H%M%S).tar.gz
```

### Восстановление MinIO:
```bash
# Остановить MinIO
docker-compose stop minio

# Скопировать архив в контейнер
docker cp minio_backup_YYYYMMDD_HHMMSS.tar.gz backend-minio-1:/tmp/

# Восстановить файлы
docker exec backend-minio-1 tar -xzf /tmp/minio_backup_YYYYMMDD_HHMMSS.tar.gz -C /

# Запустить MinIO
docker-compose start minio
```

## 🚀 Полный бэкап системы

### Автоматический скрипт:
```bash
# Сделать скрипт исполняемым
chmod +x backup_full_system.sh

# Запустить полный бэкап
./backup_full_system.sh
```

Этот скрипт создаст папку с бэкапом базы данных и MinIO хранилища.

## ⚠️ ВАЖНО!

**Перед восстановлением обязательно остановите приложения:**

```bash
# Остановить приложения
docker-compose stop web bot celery celery-beat

# Восстановить дамп
cat backup_YYYYMMDD_HHMMSS.sql | docker exec -i backend-db-1 psql -U afisha -d afisha

# Запустить приложения обратно
docker-compose start web bot celery celery-beat
```

## 🚀 Быстрые команды

### Создать бэкап прямо сейчас:
```bash
docker exec -t backend-db-1 pg_dump -U afisha -d afisha > backup_current_$(date +%Y%m%d_%H%M%S).sql
```

### Проверить размер созданного бэкапа:
```bash
ls -lh backup_*.sql
```

## 📋 Примечания

- Файлы бэкапа создаются в текущей директории
- Рекомендуется создавать бэкапы перед важными изменениями
- Храните бэкапы в безопасном месте
- Регулярно проверяйте возможность восстановления из бэкапов
- Учетные данные: пользователь `afisha`, база данных `afisha`
- MinIO хранилище содержит все изображения событий, мест и маршрутов
