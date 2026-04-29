# Telegram Reminder Worker

This Worker powers Telegram reminders for PAPA CALENDARIES NOTES.
It stores repeat settings in KV and reschedules reminders after successful delivery.
Note reminder images are sent through Telegram `sendPhoto`; the extension limits reminders to 10 images.

## Runtime

- Cloudflare Workers
- Workers KV binding: `REMINDERS`
- Secret: `BOT_TOKEN`
- Cloudflare Cron Trigger: `* * * * *`

The Worker no longer needs cron-job.org. Cloudflare calls the `scheduled()` handler every minute.

## Endpoints

- `POST /add-reminder` - store a reminder in KV.
- `POST /delete-reminder` - delete a reminder from KV.
- `POST /send-test` - send a direct Telegram test message.
- `GET /check` - manually process due reminders and return diagnostics.
- `POST /webhook` - reply to Telegram `/start`.
- `GET /` - health check.

## Repeat schedules

- `once` - send at the selected date/time, then repeat up to `count` total sends using the minute/hour interval.
- `daily` - send every day at the selected time.
- `weekly` - send every week on the selected weekday/time.
- `monthly` - send every month at the selected day/time.
- `weekdays` - send on the selected weekdays at the selected time.

## Setup

Use the files in `setup/`:

1. Copy `setup/setup.env.example` to `setup/setup.env`.
2. Fill Cloudflare and Telegram values.
3. Run `setup/setup-reminders.ps1`.
4. Copy the Worker URL printed by Wrangler into the extension settings.

See `setup/README_SETUP_RU.md` for the full Russian user guide.
