#!/bin/bash

# Полный бэкап системы: база данных + MinIO хранилище
# Использование: ./backup_full_system.sh

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backup_$TIMESTAMP"

echo "🚀 Начинаем полный бэкап системы..."
echo "📅 Время: $TIMESTAMP"

# Создаем директорию для бэкапа
mkdir -p "$BACKUP_DIR"
cd "$BACKUP_DIR"

echo ""
echo "💾 1. Создаем дамп базы данных..."
docker exec -t backend-db-1 pg_dump -U afisha -d afisha > "database_$TIMESTAMP.sql"

if [ -s "database_$TIMESTAMP.sql" ]; then
    echo "✅ База данных сохранена: database_$TIMESTAMP.sql ($(du -h database_$TIMESTAMP.sql | cut -f1))"
else
    echo "❌ Ошибка создания дампа базы данных!"
    exit 1
fi

echo ""
echo "📁 2. Создаем бэкап MinIO хранилища..."
docker exec backend-minio-1 tar -czf "/tmp/minio_$TIMESTAMP.tar.gz" /data

# Копируем архив из контейнера
docker cp "backend-minio-1:/tmp/minio_$TIMESTAMP.tar.gz" "./minio_$TIMESTAMP.tar.gz"

if [ -f "minio_$TIMESTAMP.tar.gz" ]; then
    echo "✅ MinIO сохранено: minio_$TIMESTAMP.tar.gz ($(du -h minio_$TIMESTAMP.tar.gz | cut -f1))"
    # Удаляем временный файл из контейнера
    docker exec backend-minio-1 rm "/tmp/minio_$TIMESTAMP.tar.gz"
else
    echo "❌ Ошибка создания бэкапа MinIO!"
    exit 1
fi

cd ..

echo ""
echo "🎉 Полный бэкап завершен!"
echo "📂 Папка бэкапа: $BACKUP_DIR"
echo "📊 Содержимое:"
ls -lh "$BACKUP_DIR"

echo ""
echo "💡 Для восстановления используйте команды из README_BACKUP.md"
