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

# Создаем папку для MinIO файлов
mkdir -p "minio_data_$TIMESTAMP"

# Копируем все данные из MinIO контейнера
echo "   📋 Копируем файлы из MinIO контейнера..."
docker cp backend-minio-1:/data/. "./minio_data_$TIMESTAMP/"

# Проверяем, есть ли файлы (исключая скрытые папки . и ..)
FILE_COUNT=$(find "./minio_data_$TIMESTAMP" -type f | wc -l)

if [ "$FILE_COUNT" -gt 0 ]; then
    # Создаем архив из скопированных файлов
    echo "   🗜️  Создаем архив из $FILE_COUNT файлов..."
    tar -czf "minio_$TIMESTAMP.tar.gz" "minio_data_$TIMESTAMP"

    # Удаляем временную папку
    rm -rf "minio_data_$TIMESTAMP"

    echo "✅ MinIO сохранено: minio_$TIMESTAMP.tar.gz ($(du -h minio_$TIMESTAMP.tar.gz | cut -f1))"
else
    # Удаляем пустую папку
    rm -rf "minio_data_$TIMESTAMP"
    echo "ℹ️  MinIO хранилище пустое - нет файлов для архивирования"
fi

cd ..

echo ""
echo "🎉 Полный бэкап завершен!"
echo "📂 Папка бэкапа: $BACKUP_DIR"
echo "📊 Содержимое:"
ls -lh "$BACKUP_DIR"

echo ""
echo "💡 Для восстановления используйте команды из README_BACKUP.md"
