# Настройка Telegram-напоминаний через Cloudflare

Эта инструкция нужна, чтобы включить Telegram-напоминания без cron-job.org. После настройки Cloudflare Worker сам будет проверять напоминания каждую минуту через Cloudflare Cron Trigger.

## Что понадобится

- Аккаунт Telegram.
- Аккаунт Cloudflare: https://dash.cloudflare.com/sign-up
- Установленный Node.js: https://nodejs.org/
- Расширение PAPA CALENDARIES NOTES, загруженное в Chrome.

## Шаг 1. Создайте Telegram-бота

1. Откройте Telegram.
2. Найдите бота `@BotFather`.
3. Нажмите `Start`.
4. Отправьте команду `/newbot`.
5. Введите имя бота, например `PAPA Reminders`.
6. Введите username бота. Он должен заканчиваться на `bot`, например `papa_reminders_123_bot`.
7. BotFather пришлет токен вида `123456789:ABCDEF...`.
8. Скопируйте этот токен. Он понадобится как `TELEGRAM_BOT_TOKEN`.

## Шаг 2. Получите Chat ID

Вариант A, самый простой:

1. Откройте Telegram.
2. Найдите бота `@fetch_id_bot`.
3. Нажмите `Start`.
4. Бот покажет ваш ID.
5. Скопируйте число. Это ваш `Chat ID`.

Вариант B, через вашего бота:

1. Откройте своего нового бота в Telegram.
2. Нажмите `Start` или отправьте `/start`.
3. Откройте в браузере ссылку:
   `https://api.telegram.org/botTELEGRAM_BOT_TOKEN/getUpdates`
4. Замените `TELEGRAM_BOT_TOKEN` на токен из BotFather.
5. Найдите блок `"chat":{"id":...}`.
6. Скопируйте число после `"id"`. Это ваш `Chat ID`.

## Шаг 3. Найдите Cloudflare Account ID

`CLOUDFLARE_ACCOUNT_ID` - это ID аккаунта Cloudflare. Это не `Chat ID` из Telegram.

1. Откройте https://dash.cloudflare.com/
2. Войдите в аккаунт Cloudflare.
3. На главной странице Cloudflare посмотрите правую колонку или блок Account.
4. Найдите `Account ID`.
5. Скопируйте его. Он понадобится как `CLOUDFLARE_ACCOUNT_ID`.
6. Правильный `CLOUDFLARE_ACCOUNT_ID` выглядит как длинная строка из 32 символов, например `0123456789abcdef0123456789abcdef`.
7. Не вставляйте email, название аккаунта Cloudflare или Telegram Chat ID в `CLOUDFLARE_ACCOUNT_ID`.

Если Account ID не видно:

1. Нажмите на любой сайт или раздел Workers & Pages.
2. В правой колонке Cloudflare обычно показывает `Account ID`.
3. Также Account ID часто виден в URL панели Cloudflare после `/accounts/`.

## Шаг 4. Создайте Cloudflare API Token

Если у вас еще нет аккаунта Cloudflare:

1. Откройте https://dash.cloudflare.com/sign-up
2. Зарегистрируйтесь.
3. Подтвердите email, если Cloudflare попросит.
4. Вернитесь к этой инструкции.

Не используйте Global API Key. Нужен ограниченный API Token.

1. Откройте https://dash.cloudflare.com/profile/api-tokens
2. Если вы не вошли в Cloudflare, войдите.
3. Нажмите кнопку `Create Token`.
4. Найдите вариант `Custom token`.
5. Нажмите `Get started`.
6. В поле `Token name` напишите:
   `PAPA Calendaries Notes Setup`
7. В блоке `Permissions` добавьте права:
   - `Account` -> `Workers Scripts` -> `Edit`
   - `Account` -> `Workers KV Storage` -> `Edit`
   - `User` -> `Memberships` -> `Read`
8. В блоке `Account Resources` выберите:
   - `Include`
   - `Specific account`
   - ваш аккаунт Cloudflare
9. В блоке `Zone Resources`, если он есть, оставьте:
   - `Include`
   - `All zones`
   Это не должно давать доступ к зонам без zone permissions.
10. Нажмите `Continue to summary`.
11. Проверьте, что в summary есть три права из пункта 7.
12. Нажмите `Create Token`.
13. Cloudflare покажет токен только один раз.
14. Скопируйте токен. Он понадобится как `CLOUDFLARE_API_TOKEN`.

## Шаг 5. Подготовьте setup.env

1. Откройте папку проекта расширения.
2. Перейдите в папку `setup`.
3. Скопируйте файл `setup.env.example`.
4. Назовите копию `setup.env`.
5. Откройте `setup.env` в текстовом редакторе.
6. Заполните значения:

```env
CLOUDFLARE_API_TOKEN=сюда_вставьте_cloudflare_api_token
CLOUDFLARE_ACCOUNT_ID=сюда_вставьте_cloudflare_account_id
TELEGRAM_BOT_TOKEN=сюда_вставьте_telegram_bot_token
WORKER_NAME=papa-calendaries-reminder
```

`WORKER_NAME` можно оставить как есть. Если Cloudflare скажет, что имя занято, поменяйте его на уникальное, например `papa-calendaries-reminder-ivan`.

Не путайте значения:

- `CLOUDFLARE_ACCOUNT_ID` берется в Cloudflare Dashboard.
- `Chat ID` берется в Telegram и вставляется только в настройки расширения после деплоя.
- `TELEGRAM_BOT_TOKEN` берется у `@BotFather`.

## Шаг 6. Запустите настройку

1. Зайдите в директорию `setup` расширения.
2. Откройте PowerShell:
   - нажмите `Win + R`;
   - введите `cmd`;
   - нажмите `OK`.
3. Узнайте директорию расположения папки `setup`, которая находится в файлах папки с расширением.
   Например:

```text
C:\PROJECT\PAPA CALENDARIES NOTES\setup
```

4. Зайдите в директорию, введя в PowerShell команду:

```powershell
cd "C:\PROJECT\PAPA CALENDARIES NOTES\setup"
```

5. Введите команду:

```powershell
powershell -ExecutionPolicy Bypass -File .\setup-reminders.ps1
```

6. Подождите окончания настройки и скопируйте Worker URL, который напечатает Wrangler.

Скрипт сделает все автоматически:

- проверит доступ к Cloudflare;
- подготовит `workers/wrangler.toml`;
- создаст или подключит KV namespace `REMINDERS`;
- задеплоит Cloudflare Worker;
- установит Telegram token как секрет `BOT_TOKEN`;
- включит Cloudflare Cron Trigger каждую минуту.

## Шаг 7. Где взять Worker URL

После деплоя setup-скрипт напечатает реальный Worker URL отдельным блоком:

```text
Setup completed.

Copy the Worker URL:

https://papa-calendaries-reminder.YOUR-WORKERS-SUBDOMAIN.workers.dev
```

Скопируйте именно этот URL и вставьте его в настройки расширения.

Если вы закрыли PowerShell и потеряли URL:

1. Откройте https://dash.cloudflare.com/
2. Перейдите в `Workers & Pages`.
3. Откройте Worker с именем из `WORKER_NAME`.
4. В верхней части страницы или во вкладке Overview найдите workers.dev URL.
5. Скопируйте URL.

## Шаг 8. Вставьте данные в расширение

1. Откройте расширение PAPA CALENDARIES NOTES.
2. Нажмите кнопку настроек.
3. В поле `Worker URL` вставьте URL из шага 7.
4. В поле `Chat ID` вставьте число из шага 2.
5. Поле `Bot Token` можно оставить пустым: токен уже хранится в Cloudflare Worker как секрет `BOT_TOKEN`.
6. Включите `Enable notifications`, если хотите видеть, что уведомления включены.
7. Нажмите `Save`.
8. Снова откройте настройки.
9. Нажмите `Test notification`.

Если все настроено правильно, в Telegram придет тестовое сообщение.

## Если тест не пришел

1. Проверьте, что вы написали `/start` своему Telegram-боту.
2. Проверьте, что `Chat ID` скопирован без пробелов.
3. Проверьте, что в Cloudflare Worker есть secret `BOT_TOKEN`:
   - Cloudflare Dashboard -> Workers & Pages -> ваш Worker -> Settings -> Variables and Secrets.
4. Проверьте, что Worker URL открывается в браузере.
5. Откройте настройки расширения и нажмите `Test notification` еще раз.

## Что больше не нужно

cron-job.org больше не нужен. Расписание запускается внутри Cloudflare через Cron Trigger.
