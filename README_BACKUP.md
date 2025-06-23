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
