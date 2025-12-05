#!/bin/bash
# Скрипт запуска API для каталога товаров

echo "Запуск API для cozyrenovations.ru..."

# Загружаем переменные окружения
if [ -f .env ]; then
    echo "Загрузка переменных окружения из .env файла..."
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "⚠️  Файл .env не найден! Используются значения по умолчанию."
fi

# Активация виртуального окружения
source venv/bin/activate

# Проверка подключения к БД
echo "Проверка подключения к PostgreSQL..."
python3 -c "
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()
try:
    conn = psycopg2.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        database=os.getenv('DB_DATABASE', 'cozyrenovations'),
        user=os.getenv('DB_USER', 'stepanivanov'),
        password=os.getenv('DB_PASSWORD')
    )
    print('✓ Подключение к БД успешно')
    conn.close()
except Exception as e:
    print(f'✗ Ошибка подключения к БД: {e}')
    exit(1)
"

# Запуск API
echo "Запуск FastAPI сервера на порту 8000..."
uvicorn api:app --host 0.0.0.0 --port 8000 --reload
