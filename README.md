# 📅 PAPA CALENDARIES NOTES

**PAPA CALENDARIES NOTES** is a Chrome/Chromium browser extension for taking notes in a calendar with multiple notes per date, image support, priorities, and full localization in Russian and English.

> ✨ No registration. No cloud. Just you and your notes.

---

## 🚀 Features

### 📅 Calendar
- Beautiful and minimalist calendar interface.
- Display days with notes.
- Color-coded priority dates (🔘🟢🟠🔴).

### 📝 Multiple Notes
- Several notes per date.
- Each note has a title and text.
- Insert images via Ctrl+V or button.
- Choose note title color.
- 4 priority levels (🔘🟢🟠🔴).
- **Move note up/down** in list (⬆️/⬇️ buttons).
- **Move note to any date** (🔁 button with date picker).

### ✅ Tasks
- Tasks bound to dates like notes.
- Task title color selection.
- 4 priority levels (🔘🟢🟠🔴).
- Subtasks within tasks.
- Task/subtask completion with timestamp (dd.mm.yy-hh:mm:ss).
- Tasks auto-complete when all subtasks are done.
- Edit/Delete task buttons with EN/RU tooltips.
- Telegram reminder button for notes and tasks.

### Telegram Reminders
- Settings for Worker URL, bot token, chat ID, and notification toggle.
- Worker URL is normalized automatically, so the protocol can be omitted.
- Test notification sends a direct POST request to the configured Worker without creating a queued reminder.
- Test notification verifies the exact Worker reminder key and reports Telegram delivery errors.
- Worker reports missing `BOT_TOKEN` secret and Telegram API errors during tests.
- Created reminders are stored locally and shown in Settings.
- Reminders can be deleted from the Settings list and removed from the Worker queue.
- Telegram reminder messages include note content and task subtasks with completion status.
- Note reminders send up to 10 inline note images to Telegram.
- Reminders support one-time repeated sends, daily, weekly, monthly, and selected-weekday schedules.
- Cloudflare Worker integration with `/add-reminder`, `/delete-reminder`, `/send-test`, `/check`, `/webhook`, and Cloudflare Cron Triggers.
- Setup helpers in `setup/` deploy the Worker, configure KV, upload `BOT_TOKEN`, and enable the schedule without cron-job.org.
- Reminder management opens from the main toolbar bell button.

### 🖼 Images
- Insert images from clipboard.
- View image in full size with zoom.

### 🌗 Dark/Light Theme
- Automatic system theme detection.
- Manual toggle.

### 💰 Donations
- Support development via TON, TRC20, ERC20, SOL (USDT).

### 📤 Export/Import
- Export all data (notes + tasks) to JSON file.
- Import with merge — duplicates by ID are replaced (notes and tasks).

### 📚 Versioning
- Automatic version history.
- Change history in "About" window.

---

## 📦 Installation

1. Clone or download the repository ( green "Code" button -> Download ZIP).
2. Unzip the archive to a convenient location.
3. Open Chrome browser and type "chrome://extensions" in the address bar.
4. Enable "Developer mode" (top right).
5. Click "Load unpacked" and select the contents of the folder "PAPA-CALENDARIES-NOTES-master".
6. Open "Extensions" in your browser (top right) and Pin the extension icon to the toolbar.

---

## 🛠 Technologies

- HTML5
- CSS3 (dark/light theme with `prefers-color-scheme`)
- JavaScript (Vanilla)
- Chrome Storage API (`chrome.storage.local`)

---

## 📸 Preview

### 🎥 Full Video Instruction
![Video Instruction](INSTRYCTION-GIF.gif)
![Video Instruction 2](INSTRYCTION-GIF2.gif)

Full video instruction on extension installation and functionality.

<!-- ![Demo](doc/preview.gif) -->

---

## 🔐 Privacy

- All data is stored locally in your browser.
- No cloud synchronization.
- Your notes are only for you.

---

## 📁 Project Structure

```
PAPA-CALENDARIES-NOTES/
├── popup.html          # Extension interface
├── script.js           # Working logic
├── styles.css          # Styles (dark/light theme)
├── logger.js           # Logging system
├── manifest.json       # Extension configuration
├── icon.png            # Extension icon
├── calendar_icon_1.png # Calendar icon
├── .env                # Configuration (not in repository)
├── RULES.md            # Project rules
├── doc/                # Documentation and images
│   ├── TON - USDT.png
│   ├── TRC20 - USDT.png
│   ├── ERC20 - USDT.png
│   └── SOL - USDT.png
├── README.md           # This file
└── LICENSE             # License
```

---

## 🧠 Made with Love

For convenient note-taking 🧘‍♂️💻

---

## 💰 Support the Project

USDT (TRC20): `TFtKizr6WwHccsLSJCYuYAsLbiLyCGj17p`

![Donation QR](doc/TRC20%20-%20USDT.png)

### Additional Project Files
- `background.js` - background fetch bridge.
- `request.html` - request helper page.
- `workers/` - Cloudflare Worker code for Telegram reminders.
- `tests/reminder-regression.test.js` - reminder regression checks.
- `setup/` - Cloudflare-only reminder setup scripts and Russian setup guide.
