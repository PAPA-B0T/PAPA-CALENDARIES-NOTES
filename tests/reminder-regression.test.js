const fs = require('fs');
const assert = require('assert');

const script = fs.readFileSync('script.js', 'utf8');
const popup = fs.readFileSync('popup.html', 'utf8');
const worker = fs.readFileSync('workers/reminder-worker.js', 'utf8');
const logger = fs.readFileSync('logger.js', 'utf8');
const wrangler = fs.readFileSync('workers/wrangler.toml', 'utf8');
const setupScript = fs.readFileSync('setup/setup-reminders.ps1', 'utf8');
const setupEnvExample = fs.readFileSync('setup/setup.env.example', 'utf8');
const setupReadmeRu = fs.readFileSync('setup/README_SETUP_RU.md', 'utf8');

assert(
  !script.includes("window.open(requestUrl, '_blank')"),
  'Reminder creation must POST JSON instead of opening /add-reminder as a GET page'
);

assert(
  script.includes('sendReminderRequest') && script.includes("method: 'POST'"),
  'Popup must use a POST helper for reminder API calls'
);

assert(
  script.includes("'/send-test'") && !script.includes("const addResult = await sendReminderRequest(workerUrl, '/add-reminder'"),
  'Test notification must send directly through /send-test instead of relying on immediate KV list consistency'
);

assert(
  script.includes("'https://' + trimmed") && script.includes('normalizeWorkerUrl(document.getElementById'),
  'Worker URL must be normalized before saving and before fetch calls'
);

assert(
  script.includes('function applyI18n') && script.includes("reminderMessageLabel: 'Сообщение'"),
  'Reminder UI must be covered by RU/EN localization'
);

assert(
  script.includes("chrome.storage.local.get(['telegramWorkerUrl', 'telegramChatId']"),
  'Saving reminders must not require bot token in extension settings because Worker uses BOT_TOKEN secret'
);

assert(
  script.includes("document.addEventListener('click', handleReminderButtonClick, true)"),
  'Reminder button clicks must be handled in capture phase before note cards open'
);

assert(
  popup.includes('savedRemindersList'),
  'Settings must include a visible list for managing saved reminders'
);

assert(
  worker.includes("path === '/send-test'"),
  'Worker must expose a direct send-test endpoint for Telegram checks'
);

assert(
  worker.includes('async scheduled(') && worker.includes('checkDueReminders(env'),
  'Worker must use Cloudflare scheduled handler for automatic reminder checks'
);

assert(
  wrangler.includes('[triggers]') && wrangler.includes('crons = [ "* * * * *" ]'),
  'Wrangler config must enable Cloudflare Cron Trigger every minute'
);

assert(
  setupScript.includes('"deploy", "--name", $workerName') && setupScript.includes('wrangler secret put BOT_TOKEN'),
  'Setup script must deploy Worker and upload BOT_TOKEN secret'
);

assert(
  setupScript.includes('Attempt $attempt of $Attempts') && setupScript.includes('Wrangler could not connect to Cloudflare or npm registry.'),
  'Setup script must retry transient Wrangler fetch failures and explain network causes'
);

assert(
  setupScript.includes("$accountId -notmatch '^[a-fA-F0-9]{32}$'") &&
  setupScript.includes('not an email and not Telegram Chat ID'),
  'Setup script must reject email or Telegram Chat ID in CLOUDFLARE_ACCOUNT_ID'
);

assert(
  setupEnvExample.includes('CLOUDFLARE_API_TOKEN=') &&
  setupEnvExample.includes('CLOUDFLARE_ACCOUNT_ID=') &&
  setupEnvExample.includes('TELEGRAM_BOT_TOKEN=') &&
  setupEnvExample.includes('Cloudflare Account ID is NOT your Telegram Chat ID'),
  'Setup env example must list required values and distinguish Cloudflare Account ID from Telegram Chat ID'
);

assert(
  setupReadmeRu.includes('`Account` -> `Workers Scripts` -> `Edit`') &&
  setupReadmeRu.includes('`Account` -> `Workers KV Storage` -> `Edit`') &&
  setupReadmeRu.includes('`User` -> `Memberships` -> `Read`') &&
  setupReadmeRu.includes('https://dash.cloudflare.com/sign-up') &&
  setupReadmeRu.includes('Это не `Chat ID` из Telegram') &&
  setupReadmeRu.includes('Не вставляйте email') &&
  setupReadmeRu.includes('Worker URL') &&
  setupReadmeRu.includes('Chat ID'),
  'Russian setup guide must explain API token permissions, Worker URL, and Chat ID'
);

assert(
  !popup.includes('cron-job.org') &&
  !script.includes("step4Desc: '1. Go to <a href=\"https://cron-job.org") &&
  !script.includes("step4Desc: '1. Перейдите на <a href=\"https://cron-job.org"),
  'Extension setup UI must not instruct users to configure cron-job.org'
);

assert(
  setupReadmeRu.includes('cron-job.org больше не нужен'),
  'Setup guide must explicitly tell users cron-job.org is no longer required'
);

assert(
  popup.includes('id="remindersButton"') &&
  popup.includes('id="remindersModal"') &&
  !popup.includes('reminders-management'),
  'Reminder management must live in a dedicated toolbar bell modal, not inside settings'
);

assert(
  !script.includes('🔔📱') && script.includes('reminder-note-btn') && script.includes('>🔔</button>'),
  'Reminder action buttons must use a single bell icon'
);

assert(
  script.includes('function buildReminderMessage') &&
  script.includes('plainTextFromHtml') &&
  script.includes('Подзадачи:') &&
  script.includes('✅') &&
  script.includes('⬜') &&
  script.includes('message: buildReminderMessage(reminderItemId, reminderItemType, title)'),
  'Reminder messages must include note content and task subtasks with completion status'
);

assert(
  script.includes('function extractReminderImagesFromHtml') &&
  script.includes('images.length > 10') &&
  script.includes('images: images'),
  'Popup must extract and limit note images for Telegram reminders'
);

assert(
  worker.includes('function sendTelegramPhoto') &&
  worker.includes('/sendPhoto') &&
  worker.includes('sendTelegramReminder(env.BOT_TOKEN, reminder.chat_id, reminder.message, reminder.images || [])') &&
  worker.includes('images: Array.isArray(images) ? images.slice(0, 10) : []'),
  'Worker must send reminder images through Telegram sendPhoto and cap stored images at 10'
);

assert(
  popup.includes('id="reminderRepeatType"') &&
  popup.includes('id="reminderRepeatCount"') &&
  popup.includes('id="reminderRepeatIntervalValue"') &&
  popup.includes('id="reminderWeekdayOptions"'),
  'Reminder modal must expose repeat type, one-time repeat count, interval, and weekday controls'
);

assert(
  script.includes('function updateReminderRepeatControls') &&
  script.includes('function buildReminderRepeatConfig') &&
  script.includes('repeat: repeat'),
  'Popup must build and send repeat reminder settings to the Worker'
);

assert(
  worker.includes('function calculateNextDueTime') &&
  worker.includes("repeat.type === 'once'") &&
  worker.includes("repeat.type === 'weekdays'") &&
  worker.includes('reminder.due_time = nextDueTime') &&
  worker.includes('reminder.sent && !reminder.status'),
  'Worker must reschedule recurring reminders after successful sends'
);

assert(
  worker.includes("path === '/delete-reminder'"),
  'Worker must expose a delete-reminder endpoint so removed reminders stop firing'
);

assert(
  worker.includes('sent_keys') && worker.includes('failed_keys'),
  'Worker check endpoint must report exact sent and failed reminder keys'
);

assert(
  worker.includes('BOT_TOKEN secret is missing in Cloudflare Worker') && worker.includes('failed_reasons'),
  'Worker must report missing BOT_TOKEN and exact Telegram failure reasons'
);

assert(
  script.includes("logger.warn('Test reminder failed'"),
  'Expected test notification failures must not be printed as console.error'
);

assert(
  logger.includes('const writer = console.log') && !logger.includes('LogLevel[type]'),
  'Logger console output must be defensive and must not mask the original reminder error'
);

console.log('Reminder regression checks passed');
