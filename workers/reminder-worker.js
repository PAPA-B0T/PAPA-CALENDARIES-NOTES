export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'POST' && path === '/add-reminder') {
      return await this.handleAddReminder(request, env);
    }

    if (request.method === 'GET' && path === '/check') {
      return await this.handleCheckReminders(env);
    }

    if (request.method === 'POST' && path === '/webhook') {
      return await this.handleTelegramWebhook(request, env);
    }

    if (request.method === 'GET' && path === '/') {
      return new Response('PAPA Calendaries Notes Reminder Worker is running!', { 
        headers: { 'Content-Type': 'text/plain' } 
      });
    }

    return new Response('Not Found', { status: 404 });
  },

  async handleAddReminder(request, env) {
    try {
      const { chat_id, message, due_time, task_id } = await request.json();

      if (!chat_id || !message || !due_time) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const reminder = {
        task_id,
        chat_id,
        message,
        due_time,
        created: new Date().toISOString()
      };

      const key = `reminder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await env.REMINDERS.put(key, JSON.stringify(reminder));

      return new Response(JSON.stringify({ success: true, key }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  },

  async handleCheckReminders(env) {
    const now = new Date().toISOString();
    const list = await env.REMINDERS.list();
    let sentCount = 0;

    for (const key of list.keys) {
      if (!key.name.startsWith('reminder_')) continue;

      const data = await env.REMINDERS.get(key.name);
      if (!data) continue;

      const reminder = JSON.parse(data);

      if (reminder.due_time <= now && !reminder.sent) {
        const success = await this.sendTelegramMessage(env.BOT_TOKEN, reminder.chat_id, reminder.message);

        if (success) {
          reminder.sent = true;
          reminder.sent_at = new Date().toISOString();
          await env.REMINDERS.put(key.name, JSON.stringify(reminder));
          sentCount++;
        }
      }
    }

    return new Response(JSON.stringify({ checked: list.keys.length, sent: sentCount }), {
      headers: { 'Content-Type': 'application/json' }
    });
  },

  async handleTelegramWebhook(request, env) {
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
  },

  async sendTelegramMessage(botToken, chatId, text) {
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

      return response.ok;
    } catch (e) {
      console.error('Telegram send error:', e);
      return false;
    }
  }
};