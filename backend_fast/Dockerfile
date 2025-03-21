# Базовый образ
FROM python:3.10-slim-buster AS base

WORKDIR /app

ENV PYTHONPATH=/app
ENV PIP_DISABLE_PIP_VERSION_CHECK=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# ---- Release ----
FROM base AS release

RUN apt update && \
    apt install --no-install-recommends -y software-properties-common gcc git \
      libffi-dev python3-dev libc-dev libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Копируем зависимости
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Создание директорий для статических файлов (если нужно)
RUN mkdir -p static && chown 33:33 static

# Копируем исходный код приложения
COPY . /app/

EXPOSE 8000

# Запуск FastAPI с Uvicorn
CMD ["uvicorn", "app.fast:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
