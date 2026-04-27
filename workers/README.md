# Telegram Reminder Worker Setup

## Шаг 1: Создание Telegram бота

1. Открой @BotFather в Telegram
2. Отправь `/newbot`
3. Введи имя бота (например: "PAPA Reminders")
4. Введи username бота (например: "papa_reminder_bot")
5. Скопируй токен бота (пример: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

## Шаг 2: Настройка Cloudflare Worker

1. Зарегистрируйся на cloudflare.com
2. Перейди в Workers & Pages → Create application → Create Worker
3. Назови Worker (например: `papa-reminder`)
4. В редакторе замени код на содержимое `reminder-worker.js`
5. Нажми Deploy

### Добавление KV Storage

1. В Workers → твой Worker → Settings → Variables
2. Добавь переменную `BOT_TOKEN` с токеном бота из шага 1
3. Перейди в Workers & Pages → KV → Create namespace
4. Назови `REMINDERS`
5. В Settings → твой Worker → KV Namespace Bindings
6. Добавь binding: Name: `REMINDERS`, Namespace: `REMINDERS`

### Установка webhook

Открой в браузере (замени токен):
```
https://api.telegram.org/bot<ТОКЕН>/setWebhook?url=https://твой-воркер.workers.dev/webhook
```

## Шаг 3: Настройка Cron (cron-job.org)

1. Зарегистрируйся на cron-job.org
2. Нажми Create Cronjob
3. URL: `https://твой-воркер.workers.dev/check`
4. Schedule: Every minute
5. Сохрани

## Шаг 4: Настройка расширения

1. Открой расширение → Settings
2. Введи токен бота
3. Введи chat_id (напиши боту /start чтобы получить chat_id)
4. Включи уведомления

## Тестирование

1. Напиши боту /start — получишь chat_id
2. В расширении: создай задачу с напоминанием
3. Проверь в cron-job.org что запросы выполняются