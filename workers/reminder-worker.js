const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function corsResponse(body, status = 200) {
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
  });
}

function addMonths(date, count) {
  const next = new Date(date);
  const day = next.getUTCDate();
  next.setUTCDate(1);
  next.setUTCMonth(next.getUTCMonth() + count);
  const lastDay = new Date(Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + 1, 0)).getUTCDate();
  next.setUTCDate(Math.min(day, lastDay));
  return next;
}

function advanceUntilFuture(startDate, referenceDate, advance) {
  let next = advance(new Date(startDate));
  while (next <= referenceDate) {
    next = advance(next);
  }
  return next.toISOString();
}

function calculateNextWeekdayDueTime(previousDueDate, referenceDate, weekdays) {
  if (!Array.isArray(weekdays) || weekdays.length === 0) return null;

  const selectedDays = [...new Set(weekdays.map(Number))]
    .filter(day => Number.isInteger(day) && day >= 0 && day <= 6);
  if (selectedDays.length === 0) return null;

  const candidate = new Date(previousDueDate);
  for (let i = 1; i <= 14; i++) {
    candidate.setUTCDate(candidate.getUTCDate() + 1);
    if (selectedDays.includes(candidate.getUTCDay()) && candidate > referenceDate) {
      return candidate.toISOString();
    }
  }

  return null;
}

function calculateNextDueTime(reminder, sentAtIso) {
  const repeat = reminder.repeat || { type: 'once', count: 1 };
  const sentAt = new Date(sentAtIso);
  const previousDue = new Date(reminder.due_time);

  if (Number.isNaN(sentAt.getTime()) || Number.isNaN(previousDue.getTime())) return null;

  if (repeat.type === 'once') {
    const count = Math.max(1, Number(repeat.count || 1));
    const sentCount = Number(reminder.sent_count || 0);
    if (sentCount >= count) return null;

    const intervalValue = Math.max(1, Number(repeat.interval_value || 1));
    const intervalMs = repeat.interval_unit === 'hours'
      ? intervalValue * 60 * 60 * 1000
      : intervalValue * 60 * 1000;
    return new Date(sentAt.getTime() + intervalMs).toISOString();
  }

  if (repeat.type === 'daily') {
    return advanceUntilFuture(previousDue, sentAt, date => {
      date.setUTCDate(date.getUTCDate() + 1);
      return date;
    });
  }

  if (repeat.type === 'weekly') {
    return advanceUntilFuture(previousDue, sentAt, date => {
      date.setUTCDate(date.getUTCDate() + 7);
      return date;
    });
  }

  if (repeat.type === 'monthly') {
    return advanceUntilFuture(previousDue, sentAt, date => addMonths(date, 1));
  }

  if (repeat.type === 'weekdays') {
    return calculateNextWeekdayDueTime(previousDue, sentAt, repeat.weekdays);
  }

  return null;
}

function dataUrlToBlob(dataUrl) {
  const match = String(dataUrl || '').match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    throw new Error('Invalid reminder image data URL');
  }

  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Blob([bytes], { type: match[1] });
}

async function sendTelegramMessage(botToken, chatId, text) {
  if (!botToken) {
    return { success: false, error: 'BOT_TOKEN secret is missing in Cloudflare Worker' };
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
      })
    });

    if (response.ok) {
      return { success: true };
    }

    let errorText = `Telegram API returned HTTP ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.description) {
        errorText = errorData.description;
      }
    } catch (error) {}

    return { success: false, error: errorText };
  } catch (e) {
    console.error('Telegram send error:', e);
    return { success: false, error: e.message };
  }
}

async function sendTelegramPhoto(botToken, chatId, image) {
  if (!botToken) {
    return { success: false, error: 'BOT_TOKEN secret is missing in Cloudflare Worker' };
  }

  try {
    const form = new FormData();
    form.append('chat_id', chatId);
    form.append('photo', dataUrlToBlob(image.data_url), image.filename || 'reminder-image.png');

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
      method: 'POST',
      body: form
    });

    if (response.ok) {
      return { success: true };
    }

    let errorText = `Telegram photo API returned HTTP ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.description) {
        errorText = errorData.description;
      }
    } catch (error) {}

    return { success: false, error: errorText };
  } catch (e) {
    console.error('Telegram photo send error:', e);
    return { success: false, error: e.message };
  }
}

async function sendTelegramReminder(botToken, chatId, text, images = []) {
  const textResult = await sendTelegramMessage(botToken, chatId, text);
  if (!textResult.success) {
    return textResult;
  }

  for (const image of images.slice(0, 10)) {
    const photoResult = await sendTelegramPhoto(botToken, chatId, image);
    if (!photoResult.success) {
      return photoResult;
    }
  }

  return { success: true };
}

async function checkDueReminders(env, sendTelegramMessage) {
  const now = new Date().toISOString();
  const list = await env.REMINDERS.list();
  let sentCount = 0;
  let failedCount = 0;
  const sentKeys = [];
  const failedKeys = [];
  const failedReasons = {};

  for (const key of list.keys) {
    if (!key.name.startsWith('reminder_')) continue;
    const data = await env.REMINDERS.get(key.name);
    if (!data) continue;

    const reminder = JSON.parse(data);
    if (reminder.sent && !reminder.status) {
      const repeat = reminder.repeat || { type: 'once', count: 1 };
      const count = Math.max(1, Number(repeat.count || 1));
      reminder.sent_count = Number(reminder.sent_count || 1);
      const nextDueTime = count > reminder.sent_count
        ? calculateNextDueTime(reminder, reminder.sent_at || now)
        : null;

      if (nextDueTime) {
        reminder.due_time = nextDueTime;
        reminder.sent = false;
        reminder.status = 'scheduled';
      } else {
        reminder.status = 'completed';
      }

      await env.REMINDERS.put(key.name, JSON.stringify(reminder));
      continue;
    }

    if (reminder.due_time <= now && reminder.status !== 'completed') {
      const sendResult = await sendTelegramReminder(env.BOT_TOKEN, reminder.chat_id, reminder.message, reminder.images || []);
      if (sendResult.success) {
        const sentAt = new Date().toISOString();
        reminder.sent_count = Number(reminder.sent_count || 0) + 1;
        reminder.sent_at = sentAt;
        const nextDueTime = calculateNextDueTime(reminder, sentAt);
        if (nextDueTime) {
          reminder.due_time = nextDueTime;
          reminder.sent = false;
          reminder.status = 'scheduled';
        } else {
          reminder.sent = true;
          reminder.status = 'completed';
        }
        await env.REMINDERS.put(key.name, JSON.stringify(reminder));
        sentCount++;
        sentKeys.push(key.name);
      } else {
        failedCount++;
        failedKeys.push(key.name);
        failedReasons[key.name] = sendResult.error;
      }
    }
  }

  return {
    checked: list.keys.length,
    sent: sentCount,
    failed: failedCount,
    sent_keys: sentKeys,
    failed_keys: failedKeys,
    failed_reasons: failedReasons
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (request.method === 'POST' && path === '/add-reminder') {
      try {
        const { chat_id, message, due_time, task_id, item_id, item_type, id, repeat, images } = await request.json();

        if (!chat_id || !message || !due_time) {
          return corsResponse(JSON.stringify({ error: 'Missing required fields' }), 400);
        }

        const dueDate = new Date(due_time);
        if (Number.isNaN(dueDate.getTime())) {
          return corsResponse(JSON.stringify({ error: 'Invalid due_time' }), 400);
        }

        const reminder = {
          id,
          task_id,
          item_id,
          item_type,
          chat_id,
          message,
          due_time: dueDate.toISOString(),
          images: Array.isArray(images) ? images.slice(0, 10) : [],
          repeat: repeat || { type: 'once', count: 1 },
          sent_count: 0,
          status: 'scheduled',
          created: new Date().toISOString()
        };

        const key = `reminder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await env.REMINDERS.put(key, JSON.stringify(reminder));

        return corsResponse(JSON.stringify({ success: true, key }));
      } catch (e) {
        return corsResponse(JSON.stringify({ error: e.message }), 500);
      }
    }

    if (request.method === 'POST' && path === '/send-test') {
      try {
        const { chat_id, message } = await request.json();

        if (!chat_id || !message) {
          return corsResponse(JSON.stringify({ error: 'Missing required fields' }), 400);
        }

        const sendResult = await sendTelegramReminder(env.BOT_TOKEN, chat_id, message, []);
        if (!sendResult.success) {
          return corsResponse(JSON.stringify({ error: sendResult.error }), 502);
        }

        return corsResponse(JSON.stringify({ success: true }));
      } catch (e) {
        return corsResponse(JSON.stringify({ error: e.message }), 500);
      }
    }

    if (request.method === 'POST' && path === '/delete-reminder') {
      try {
        const { key } = await request.json();

        if (!key || !key.startsWith('reminder_')) {
          return corsResponse(JSON.stringify({ error: 'Invalid reminder key' }), 400);
        }

        await env.REMINDERS.delete(key);
        return corsResponse(JSON.stringify({ success: true, key }));
      } catch (e) {
        return corsResponse(JSON.stringify({ error: e.message }), 500);
      }
    }

    if (request.method === 'GET' && path === '/check') {
      const result = await checkDueReminders(env, this.sendTelegramMessage);
      return corsResponse(JSON.stringify(result));
    }

    if (request.method === 'POST' && path === '/webhook') {
      try {
        const update = await request.json();
        if (update.message && update.message.text === '/start') {
          const chat_id = update.message.chat.id;
          const welcomeText = `👋 Привет! Твой chat_id: ${chat_id}\n\nСкопируй этот номер и вставь в настройках расширения PAPA Calendaries Notes.`;
          await this.sendTelegramMessage(env.BOT_TOKEN, chat_id, welcomeText);
        }
        return new Response('OK');
      } catch (e) {
        return new Response('Error: ' + e.message, { status: 500 });
      }
    }

    if (request.method === 'GET' && path === '/') {
      return new Response('PAPA Calendaries Notes Reminder Worker is running!', {
        headers: { 'Content-Type': 'text/plain', ...CORS_HEADERS }
      });
    }

    return new Response('Not Found', { status: 404 });
  },

  async scheduled(controller, env, ctx) {
    ctx.waitUntil(checkDueReminders(env));
  },

  async sendTelegramMessage(botToken, chatId, text) {
    return sendTelegramMessage(botToken, chatId, text);
  }
};
