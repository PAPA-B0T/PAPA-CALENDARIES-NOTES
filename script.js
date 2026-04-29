const editorView = document.getElementById('editorView');
const calendarView = document.getElementById('calendarView');
const tasksView = document.getElementById('tasksView');
const logView = document.getElementById('logView');
const calendarButton = document.getElementById('calendarButton');
const themeToggle = document.getElementById('themeToggle');
const calendarDays = document.getElementById('calendarDays');
const currentMonthElement = document.getElementById('currentMonth');
const currentYearElement = document.getElementById('currentYear');
const prevYearButton = document.getElementById('prevYear');
const nextYearButton = document.getElementById('nextYear');
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');
const logContainer = document.getElementById('logContainer');
const archiveLogsBtn = document.getElementById('archiveLogs');
const clearLogsBtn = document.getElementById('clearLogs');
const closeLogViewBtn = document.getElementById('closeLogView');
const donationButton = document.getElementById('donationButton');
const donationModal = document.getElementById('donationModal');
const closeDonationBtn = document.getElementById('closeDonationBtn');
const exportButton = document.getElementById('exportButton');
const importButton = document.getElementById('importButton');
const importInput = document.getElementById('importInput');
const remindersButton = document.getElementById('remindersButton');
const remindersModal = document.getElementById('remindersModal');
const closeRemindersBtn = document.getElementById('closeRemindersBtn');
const infoButton = document.getElementById('infoButton');
const infoModal = document.getElementById('infoModal');
const closeInfoBtn = document.getElementById('closeInfoBtn');
const versionHistory = document.getElementById('versionHistory');

const tabNotes = document.getElementById('tabNotes');
const tabTasks = document.getElementById('tabTasks');
const addTaskBtn = document.getElementById('addTaskBtn');
const tasksList = document.getElementById('tasksList');
const taskModal = document.getElementById('taskModal');
const taskTitleInput = document.getElementById('taskTitle');
const closeTaskBtn = document.getElementById('closeTaskModal');
const subtasksList = document.getElementById('subtasksList');
const subtaskInput = document.getElementById('subtaskInput');
const addSubtaskBtn = document.getElementById('addSubtaskBtn');
const deleteTaskBtn = document.getElementById('deleteTaskBtn');
const cancelTaskBtn = document.getElementById('cancelTaskBtn');
const saveTaskBtn = document.getElementById('saveTaskBtn');

let currentTasks = {};
let editingTaskId = null;
let currentTaskSubtasks = [];
let currentTaskPriority = 'white';
let currentTaskTitleColor = 'default';

const APP_VERSION = '1.4.1';
const VERSION_HISTORY = {
  en: [
    {
      version: '1.4.1',
      date: '2026-04-29',
      features: [
        'Note reminder images are sent to Telegram, up to 10 images per reminder',
        'Worker deployment is required for recurring reminder rescheduling'
      ]
    },
    {
      version: '1.4.0',
      date: '2026-04-29',
      features: [
        'Added recurring Telegram reminders: daily, weekly, monthly, selected weekdays, and repeated one-time reminders'
      ]
    },
    {
      version: '1.3.4',
      date: '2026-04-29',
      features: [
        'Reminder setup instructions now explain webhook confirmation and test notification checks'
      ]
    },
    {
      version: '1.3.3',
      date: '2026-04-29',
      features: [
        'Setup instructions now explain how to open PowerShell in the setup folder',
        'Setup script prints the real Worker URL after deployment'
      ]
    },
    {
      version: '1.3.2',
      date: '2026-04-29',
      features: [
        'Reminder Telegram messages now include note content and task subtasks with completion status',
        'Setup script validates Cloudflare Account ID before running Wrangler',
        'Setup instructions clarify that Account ID is a 32-character Cloudflare ID, not an email or Telegram Chat ID'
      ]
    },
    {
      version: '1.3.1',
      date: '2026-04-29',
      features: [
        'Moved reminder management to a dedicated bell button in the main toolbar',
        'Simplified reminder icons to a single bell',
        'Improved setup script retry diagnostics and clarified Cloudflare Account ID versus Telegram Chat ID'
      ]
    },
    {
      version: '1.3.0',
      date: '2026-04-29',
      features: [
        'Removed cron-job.org from Telegram reminder setup',
        'Added Cloudflare Cron Trigger support for automatic reminder checks',
        'Added setup files for one-command Cloudflare Worker deployment',
        'Expanded settings instructions for Cloudflare API token, Worker URL, and Chat ID'
      ]
    },
    {
      version: '1.2.6',
      date: '2026-04-29',
      features: [
        'Worker URL is normalized automatically for Telegram reminders',
        'Telegram reminder dialogs and settings are localized through the shared translation system',
        'Fetch failures now show a clearer Worker URL/network message'
      ]
    },
    {
      version: '1.2.5',
      date: '2026-04-29',
      features: [
        'Test notification now sends directly through the Worker without creating a KV reminder',
        'Avoided Cloudflare KV list delay during immediate Telegram tests'
      ]
    },
    {
      version: '1.2.4',
      date: '2026-04-29',
      features: [
        'Telegram test notification now reports the exact Worker or Telegram API failure reason',
        'Logger no longer prints app-level errors with console.error during expected test failures',
        'Worker detects missing BOT_TOKEN secret explicitly'
      ]
    },
    {
      version: '1.2.3',
      date: '2026-04-29',
      features: [
        'Improved Telegram test notification diagnostics',
        'Test reminders are removed from the Worker queue if Telegram delivery fails',
        'Logger console output is now defensive and no longer masks the real reminder error'
      ]
    },
    {
      version: '1.2.2',
      date: '2026-04-29',
      features: [
        'Fixed Telegram reminder buttons opening the note instead of the reminder dialog',
        'Fixed reminder test and save requests to send POST JSON to the Worker',
        'Added saved reminders list with delete management',
        'Added Worker endpoint for deleting scheduled reminders'
      ]
    },
    {
      version: '1.2.1',
      date: '2026-04-28',
      features: [
        'Added host permissions for Telegram API and Workers in manifest.json'
      ]
    },
    {
      version: '1.2.0',
      date: '2026-04-27',
      features: [
        'Fixed: Test notification and Set connection buttons now work',
        'Added Delete connection button for webhook',
        'Added error handling and logging for Telegram notifications'
      ]
    },
    {
      version: '1.1.1',
      date: '2026-04-27',
      features: [
        'Fixed: date/time in subtasks no longer strikethrough',
        'Added: auto-add subtask from input when saving task without clicking "+ Add subtask"',
        'Date in tasks/subtasks now light red (#ff6b6b), time is green (#27ae60)',
        'Notes indicator now shows tooltip "Notes"/"Notes" on hover',
        'Edit note button now blue color'
      ]
    },
    {
      version: '1.1.2',
      date: '2026-04-27',
      features: [
        'Added Telegram notifications settings with step-by-step instructions',
        'Fixed: settings now open in full-screen modal',
        'All settings text translated to EN/RU',
        'Added Set connection and Delete connection buttons for webhook',
        'Fixed links in instructions to be clickable'
      ]
    },
    {
      version: '1.1.0',
      date: '2026-04-27',
      features: [
        'Task calendar indicators update on task CRUD (add/delete/edit)',
        'Extension opens to calendar view by default',
        'Edit/Delete task buttons have EN/RU tooltips',
        'Editing task loads title, priority, color, subtasks correctly',
        'Delete/Cancel/Save buttons localized in task modal',
        'Window width 430px, calendar gap 3px',
        'Completion timestamp (dd.mm.yy-hh:mm:ss) right-aligned on done tasks/subtasks',
        'Import/export: duplicates by ID are replaced, new ID on every task edit'
      ]
    },
    {
      version: '1.0.9',
      date: '2026-04-27',
      features: [
        'Tasks now bound to dates like notes',
        'Added task count indicator on calendar (green)',
        'Notes and tasks tabs in date view',
        'Fixed localization for tasks',
        'Orange color for calendar numbers in dark theme'
      ]
    },
    {
      version: '1.0.8',
      date: '2026-04-27',
      features: [
        'Added Tasks feature with separate tab',
        'Tasks can have priority and color',
        'Subtasks within tasks',
        'Checkbox for task/subtask completion status',
        'Task auto-completes when all subtasks done'
      ]
    },
    {
      version: '1.0.7',
      date: '2026-04-27',
      features: [
        'On save: edited note gets new unique ID',
        'Each edit creates new note instance - no more duplicates confusion',
        'Delete now only removes one note per click'
      ]
    },
    {
      version: '1.0.6',
      date: '2026-04-27',
      features: [
        'Notes with same title but different priority are now treated as different notes',
        'Priority symbol (🔘🟢🟠🔴) shown in note title',
        'Fixed: edit/delete now only affects one note by id, not all notes with same title'
      ]
    },
    {
      version: '1.0.5',
      date: '2026-04-27',
      features: [
        'Added move note up/down buttons (⬆️/⬇️) for each note',
        'Added move note to date button (🔁) - allows moving note to any date',
        'New date picker modal for selecting destination date'
      ]
    },
    {
      version: '1.0.4',
      date: '2026-04-25',
      features: [
        'Increased popup height by 40px to prevent scroll',
        'Updated README installation instructions'
      ]
    },
    {
      version: '1.0.3',
      date: '2026-04-25',
      features: [
        'Redesigned calendar header: separate year and month selectors',
        'Fixed calendar grid overflow - now fits properly'
      ]
    },
    {
      version: '1.0.2',
      date: '2026-04-25',
      features: [
        'Fixed import: priority always replaced from imported data',
        'Fixed import: notes with same title get new unique ID (no duplicates prevented)',
        'Added version update to history on every change'
      ]
    },
    {
      version: '1.0.1',
      date: '2026-04-25',
      features: [
        'Added Export/Import functionality with data merge',
        'Added Donation window (TON, TRC20, ERC20, SOL)',
        'Added About window with version history',
        'Redesigned button layout: export/import on left, calendar center, $/info on right',
        'Golden highlight for calendar button',
        'Gray color for 🔘 priority (was white)',
        'Fixed all translation issues',
        'Hidden backup and logs buttons'
      ]
    },
    {
      version: '1.0.0',
      date: '2026-04-25',
      features: [
        'Calendar with date notes display',
        'Multiple notes per date with title',
        'Image insertion via Ctrl+V or button',
        'Full-size image preview with zoom',
        '4 priority levels (🔘🟢🟠🔴)',
        'Note title color selection',
        'Full RU/EN language support',
        'Dark and light themes',
        'Extension versioning'
      ]
    }
  ],
  ru: [
    {
      version: '1.4.1',
      date: '2026-04-29',
      features: [
        'Картинки из заметок отправляются в Telegram-напоминаниях, до 10 картинок на напоминание',
        'Для повторяющихся напоминаний требуется деплой обновленного Worker'
      ]
    },
    {
      version: '1.4.0',
      date: '2026-04-29',
      features: [
        'Добавлена периодичность Telegram-напоминаний: ежедневно, еженедельно, ежемесячно, по дням недели и разово несколько раз'
      ]
    },
    {
      version: '1.3.4',
      date: '2026-04-29',
      features: [
        'Инструкция настройки напоминаний теперь объясняет проверку webhook и тестового уведомления'
      ]
    },
    {
      version: '1.3.3',
      date: '2026-04-29',
      features: [
        'Инструкция настройки теперь подробно объясняет, как открыть PowerShell в папке setup',
        'Setup-скрипт печатает реальный Worker URL после деплоя'
      ]
    },
    {
      version: '1.3.2',
      date: '2026-04-29',
      features: [
        'Telegram-сообщения напоминаний теперь включают текст заметки и подзадачи со статусом выполнения',
        'Setup-скрипт проверяет Cloudflare Account ID до запуска Wrangler',
        'Инструкция уточняет, что Account ID - это 32-символьный Cloudflare ID, а не email и не Telegram Chat ID'
      ]
    },
    {
      version: '1.3.1',
      date: '2026-04-29',
      features: [
        'Управление напоминаниями вынесено в отдельную кнопку-колокольчик на главной панели',
        'Иконки напоминаний упрощены до одного колокольчика',
        'Улучшены повторы setup-скрипта и пояснение разницы между Cloudflare Account ID и Telegram Chat ID'
      ]
    },
    {
      version: '1.3.0',
      date: '2026-04-29',
      features: [
        'cron-job.org удален из настройки Telegram-напоминаний',
        'Добавлена поддержка Cloudflare Cron Trigger для автоматической проверки напоминаний',
        'Добавлены setup-файлы для деплоя Cloudflare Worker одной командой',
        'Расширены инструкции в настройках для Cloudflare API token, Worker URL и Chat ID'
      ]
    },
    {
      version: '1.2.6',
      date: '2026-04-29',
      features: [
        'URL Worker автоматически нормализуется для Telegram-напоминаний',
        'Окна и настройки Telegram-напоминаний локализованы через общую систему переводов',
        'Ошибки fetch теперь показывают более понятное сообщение про URL Worker или сеть'
      ]
    },
    {
      version: '1.2.5',
      date: '2026-04-29',
      features: [
        'Тест уведомления теперь отправляется напрямую через Worker без создания KV-напоминания',
        'Устранена задержка Cloudflare KV list при мгновенной проверке Telegram'
      ]
    },
    {
      version: '1.2.4',
      date: '2026-04-29',
      features: [
        'Тест Telegram-уведомления теперь показывает точную причину ошибки Worker или Telegram API',
        'Логгер больше не выводит ожидаемые ошибки теста через console.error',
        'Worker явно определяет отсутствие секрета BOT_TOKEN'
      ]
    },
    {
      version: '1.2.3',
      date: '2026-04-29',
      features: [
        'Улучшена диагностика тестового Telegram-уведомления',
        'Тестовые напоминания удаляются из очереди Worker, если отправка в Telegram не прошла',
        'Вывод логгера в консоль стал устойчивым и больше не маскирует настоящую ошибку напоминаний'
      ]
    },
    {
      version: '1.2.2',
      date: '2026-04-29',
      features: [
        'Исправлены кнопки Telegram-напоминаний: теперь открывается окно напоминания, а не заметка',
        'Исправлены тест и сохранение напоминаний: теперь отправляется POST JSON в Worker',
        'Добавлен список созданных напоминаний с удалением',
        'Добавлен endpoint Worker для удаления запланированных напоминаний'
      ]
    },
    {
      version: '1.2.1',
      date: '2026-04-28',
      features: [
        'Добавлены права доступа для Telegram API и Workers в manifest.json'
      ]
    },
    {
      version: '1.2.0',
      date: '2026-04-27',
      features: [
        'Исправлено: кнопки "Тест уведомления" и "Установить связь" теперь работают',
        'Добавлена кнопка "Удалить связь" для webhook',
        'Добавлена обработка ошибок и логирование для Telegram уведомлений'
      ]
    },
    {
      version: '1.1.1',
      date: '2026-04-27',
      features: [
        'Исправлено: дата/время в подзадачах больше не зачёркнуты',
        'Добавлено: автоматическое добавление подзадачи из поля ввода при сохранении задачи',
        'Дата в задачах/подзадачах теперь светло-красная (#ff6b6b), время зелёное (#27ae60)',
        'Индикатор заметок теперь показывает подсказку "Заметки" при наведении',
        'Кнопка редактирования заметки теперь синего цвета'
      ]
    },
    {
      version: '1.1.0',
      date: '2026-04-27',
      features: [
        'Индикаторы задач на календаре обновляются при CRUD (добавить/удалить/редактировать)',
        'Расширение открывается на представлении календаря по умолчанию',
        'Кнопки редактирования/удаления задач имеют подсказки EN/RU',
        'Редактирование задачи загружает название, приоритет, цвет, подзадачи',
        'Кнопки Удалить/Отмена/Сохранить локализованы в модалке задач',
        'Ширина окна 430px, gap между днями 3px',
        'Время выполнения (dd.mm.yy-hh:mm:ss) справа от выполненных задач/подзадач',
        'Import/export: дубликаты по ID заменяются, новый ID при каждом редактировании задачи'
      ]
    },
    {
      version: '1.0.9',
      date: '2026-04-27',
      features: [
        'Задачи теперь привязаны к датам как заметки',
        'Добавлен индикатор количества задач на календаре (зеленый)',
        'Вкладки Заметки и Задачи в представлении даты',
        'Исправлена локализация для задач',
        'Оранжевый цвет для цифр календаря в темной теме'
      ]
    },
    {
      version: '1.0.8',
      date: '2026-04-27',
      features: [
        'Добавлена функция Задачи с отдельной вкладкой',
        'Задачи могут иметь приоритет и цвет',
        'Подзадачи внутри задач',
        'Чекбокс для статуса выполнения задачи/подзадачи',
        'Задача автоматически выполняется когда все подзадачи выполнены'
      ]
    },
    {
      version: '1.0.7',
      date: '2026-04-27',
      features: [
        'При сохранении редактируемой заметки ей присваивается новый уникальный ID',
        'Каждое редактирование создаёт новый экземпляр заметки - больше путаницы с дубликатами',
        'Удаление теперь удаляет только одну заметку за клик'
      ]
    },
    {
      version: '1.0.6',
      date: '2026-04-27',
      features: [
        'Заметки с одинаковым названием но разным приоритетом теперь разные заметки',
        'Символ приоритета (🔘🟢🟠🔴) показывается в заголовке заметки',
        'Исправлено: редактирование/удаление теперь только для одной заметки по id'
      ]
    },
    {
      version: '1.0.5',
      date: '2026-04-27',
      features: [
        'Добавлены кнопки перемещения заметки вверх/вниз (⬆️/⬇️) для каждой заметки',
        'Добавлена кнопка переноса заметки на дату (🔁) - позволяет перенести заметку на любую дату',
        'Новое модальное окно выбора даты для выбора целевой даты'
      ]
    },
    {
      version: '1.0.4',
      date: '2026-04-25',
      features: [
        'Увеличена высота popup на 40px для предотвращения скролла',
        'Обновлена инструкция по установке в README'
      ]
    },
    {
      version: '1.0.3',
      date: '2026-04-25',
      features: [
        'Переработан заголовок календаря: отдельные селекторы года и месяца',
        'Исправлено переполнение сетки календаря - теперь помещается правильно'
      ]
    },
    {
      version: '1.0.2',
      date: '2026-04-25',
      features: [
        'Исправлен импорт: приоритет всегда заменяется из импортированных данных',
        'Исправлен импорт: заметки с одинаковым названием получают новый уникальный ID (дубликаты не предотвращаются)',
        'Добавлено обновление версии в историю при каждом изменении'
      ]
    },
    {
      version: '1.0.1',
      date: '2026-04-25',
      features: [
        'Добавлен функционал Экспорт/Импорт с объединением данных',
        'Добавлено окно Пожертвований (TON, TRC20, ERC20, SOL)',
        'Добавлено окно О расширении с историей версий',
        'Переработан layout кнопок: экспорт/импорт слева, календарь по центру, $/инфо справа',
        'Золотое выделение для кнопки календаря',
        'Серый цвет для приоритета 🔘 (был белый)',
        'Исправлены все проблемы с переводами',
        'Скрыты кнопки бекапа и логов'
      ]
    },
    {
      version: '1.0.0',
      date: '2026-04-25',
      features: [
        'Календарь с отображением дат и заметок',
        'Множественные заметки на одну дату с заголовком',
        'Вставка картинок в заметки через Ctrl+V или кнопку',
        'Просмотр картинок в полном размере в новом окне с зумом',
        '4 уровня важности заметок и дат (🔘🟢🟠🔴)',
        'Выбор цвета заголовка заметки',
        'Полная поддержка русского и английского языков',
        'Тёмная и светлая темы',
        'Версионирование расширения'
      ]
    }
  ]
};
const selectedDateDisplay = document.getElementById('selectedDateDisplay');
const backToCalendarBtn = document.getElementById('backToCalendar');
const notesList = document.getElementById('notesList');
const addNoteBtn = document.getElementById('addNoteBtn');
const noteModal = document.getElementById('noteModal');
const modalTitle = document.getElementById('modalTitle');
const closeModalBtn = document.getElementById('closeModal');
const noteTitleInput = document.getElementById('noteTitle');
const noteContentInput = document.getElementById('noteContent');
const addImageBtn = document.getElementById('addImageBtn');
const imageInput = document.getElementById('imageInput');
const imagePreviewModal = document.getElementById('imagePreviewModal');
const previewImage = document.getElementById('previewImage');
const closePreviewBtn = document.getElementById('closePreviewBtn');
const deleteNoteBtn = document.getElementById('deleteNoteBtn');
const editNoteBtn = document.getElementById('editNoteBtn');
const cancelNoteBtn = document.getElementById('cancelNoteBtn');
const saveNoteBtn = document.getElementById('saveNoteBtn');

let currentDate = new Date();
let selectedDate = new Date();
let currentNotes = {};
let editingNoteId = null;
let currentNoteImages = [];
let isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
let currentLang = 'en';

const translations = {
  en: {
    appTitle: 'CALENDAR & NOTES',
    activityLogs: 'Activity Logs',
    archiveLogs: 'Archive Logs',
    clearLogs: 'Clear Logs',
    noLogsYet: 'No logs yet',
    logsArchived: 'Logs archived',
    noLogsToArchive: 'No logs to archive',
    logsCleared: 'Logs cleared',
    backupCreated: 'Backup created',
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    titleCalendar: 'Calendar View',
    titleDonation: 'Donate for development',
    titleTheme: 'Toggle Theme',
    titleClose: 'Close',
    addNote: 'Add Note',
    editNote: 'Edit Note',
    viewNote: 'View Note',
    noteTitlePlaceholder: 'Note title...',
    taskTitlePlaceholder: 'Task title...',
    noteContentPlaceholder: 'Write your note...\n(Ctrl+V to paste image)',
    noteContentPlaceholderRu: 'Напишите заметку...\n(Ctrl+V для вставки картинки)',
    addImage: 'Add Image',
    delete: 'Delete',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    noNotes: 'No notes for this date',
    clickToAdd: 'Click + to add a note',
    notes: 'notes',
    note: 'note',
    confirmDelete: 'Delete this note?',
    noteSaved: 'Note saved',
    noteSavedAsNew: 'Note saved as new',
    noteDeleted: 'Note deleted',
    backToCalendar: 'Back to calendar',
    priorityWhite: 'not important',
    priorityGreen: 'normal',
    priorityOrange: 'important',
    priorityRed: 'very important',
    network: 'network',
    currency: 'currency',
    wallet: 'wallet',
    donationTitle: 'Donation for development',
    titleExport: 'Export',
    titleImport: 'Import',
    titleReminders: 'Reminders',
    titleInfo: 'About',
    titleSettings: 'Settings',
    aboutTitle: 'About Extension ' + APP_VERSION,
    versionLabel: 'Version',
    imported: 'Data imported and merged',
    versionDate: 'Release date',
    featuresLabel: 'Features',
    moveUp: 'Move up',
    moveDown: 'Move down',
    moveToDate: 'Move to date',
    setReminder: 'Set reminder',
    selectDate: 'Select date',
    noteMoved: 'Note moved',
    noteMovedUp: 'Note moved up',
    noteMovedDown: 'Note moved down',
    cannotMoveUp: 'Cannot move up',
    cannotMoveDown: 'Cannot move down',
    cancelDate: 'Cancel',
    reminderTitle: 'Set Reminder',
    reminderMessageLabel: 'Message',
    reminderTime: 'Reminder time',
    reminderDate: 'Reminder date',
    reminderRepeat: 'Repeat',
    reminderRepeatTypeLabel: 'Periodicity',
    reminderRepeatOnce: 'Once',
    reminderRepeatCountLabel: 'Number of times',
    reminderRepeatIntervalLabel: 'Interval',
    reminderRepeatIntervalUnitLabel: 'Unit',
    reminderWeekdays: 'Selected weekdays',
    reminderWeekdayLabel: 'Days of week',
    reminderNone: 'No repeat',
    reminderDaily: 'Daily',
    reminderWeekly: 'Weekly',
    reminderMonthly: 'Monthly',
    reminderHours: 'hours',
    reminderMinutes: 'minutes',
    remindersList: 'Reminders',
    noReminders: 'No reminders',
    deleteReminder: 'Delete reminder',
    reminderSaved: 'Reminder saved',
    reminderDeleted: 'Reminder deleted',
    reminderTypeNote: 'Note',
    reminderTypeTask: 'Task',
    reminderRepeatEvery: 'Repeats',
    weekdayMon: 'Mon',
    weekdayTue: 'Tue',
    weekdayWed: 'Wed',
    weekdayThu: 'Thu',
    weekdayFri: 'Fri',
    weekdaySat: 'Sat',
    weekdaySun: 'Sun',
    fillAllFields: 'Please fill all fields',
    configureTelegram: 'Configure Telegram in settings',
    workerFetchFailed: 'Could not reach Worker. Check Worker URL and internet access.',
    testNotificationSent: 'Test notification sent',
    reminderTooManyImages: 'A reminder can include up to 10 images',
    reminderImageTooLarge: 'One of the images is too large for Telegram reminder',
    reminderImagesTooLarge: 'Reminder images are too large to store in Cloudflare KV',
    telegramNotifications: 'Telegram Notifications',
    telegramSetupInfo: 'Cloudflare runs reminder checks automatically. Follow the steps below once, then paste Worker URL and Chat ID here.',
    step1Title: 'Step 1: Create Telegram bot',
    step1Desc: '1. Open <a href="https://t.me/BotFather" target="_blank">@BotFather</a> in Telegram<br>2. Click Start and send /newbot<br>3. Enter bot name and username ending with bot<br>4. Copy the token from BotFather - this is TELEGRAM_BOT_TOKEN<br>&nbsp;&nbsp;* Paste TELEGRAM_BOT_TOKEN below in "Bot Token: ..."<br>5. Open your new bot and send /start',
    step2Title: 'Step 2: Get Chat ID',
    step2Desc: '1. Open <a href="https://t.me/fetch_id_bot" target="_blank">@fetch_id_bot</a><br>2. Click Start<br>3. Copy the number/value shown by the bot - this is your Chat ID<br>&nbsp;&nbsp;* Paste Chat ID below in "Chat ID: ..."',
    step3Title: 'Step 3: Create Cloudflare API Token',
    step3Desc: '1. If you do not have a Cloudflare account, open <a href="https://dash.cloudflare.com/sign-up" target="_blank">Cloudflare Sign Up</a> and create one<br>2. Open <a href="https://dash.cloudflare.com/" target="_blank">Cloudflare Dashboard</a> and click Account home on the left<br>3. Look at the browser address bar. It will look like https://dash.cloudflare.com/ACCOUNT_ID/home/overview<br>4. Copy the part between dash.cloudflare.com/ and /home/overview. This is CLOUDFLARE_ACCOUNT_ID: a 32-character ID, not your email and not Telegram Chat ID<br>5. Open <a href="https://dash.cloudflare.com/profile/api-tokens" target="_blank">Cloudflare API Tokens</a><br>6. Click Create Token<br>7. Choose Custom token -> Get started<br>8. Token name: PAPA Calendaries Notes Setup<br>9. Add 3 Permissions for API:<br>&nbsp;&nbsp;* Account -> Workers Scripts -> Edit<br>&nbsp;&nbsp;* Account -> Workers KV Storage -> Edit<br>&nbsp;&nbsp;* User -> Memberships -> Read<br>10. In Account Resources select:<br>&nbsp;&nbsp;* Include -> Specific account -> your account (or All accounts)<br>11. Click Continue to summary -> Create Token<br>12. Copy the token once - this is CLOUDFLARE_API_TOKEN',
    step4Title: 'Step 4: Run setup script',
    step4Desc: '1. Open the "setup.env.example" file in the "**:\\**\\PAPA CALENDARIES NOTES\\setup\\" folder and save a copy of this file as "setup.env" in the same "**:\\**\\PAPA CALENDARIES NOTES\\setup\\" folder<br>2. Fill all received values in "setup.env":<br>&nbsp;&nbsp;&nbsp;&nbsp;CLOUDFLARE_API_TOKEN= ...<br>&nbsp;&nbsp;&nbsp;&nbsp;CLOUDFLARE_ACCOUNT_ID= ...<br>&nbsp;&nbsp;&nbsp;&nbsp;TELEGRAM_BOT_TOKEN= ...<br>&nbsp;&nbsp;&nbsp;&nbsp;WORKER_NAME= (leave as is, or write your own)<br>3. Go to the extension setup folder:<br>&nbsp;&nbsp;* Open PowerShell: press Win + R, type cmd, click OK<br>&nbsp;&nbsp;* Find the setup folder inside the extension files, for example C:\\PROJECT\\PAPA CALENDARIES NOTES\\setup<br>&nbsp;&nbsp;* Enter the folder with this command:<br>&nbsp;&nbsp;&nbsp;&nbsp;cd "C:\\PROJECT\\PAPA CALENDARIES NOTES\\setup"<br>4. Enter the command:<br>&nbsp;&nbsp;&nbsp;&nbsp;powershell -ExecutionPolicy Bypass -File .\\setup-reminders.ps1<br>5. Wait for setup to finish and copy the Worker URL printed by Wrangler<br>6. Paste Worker URL and Chat ID below, click Save<br>&nbsp;&nbsp;* Then click Set connection. A page should open with this text: {"ok":true,"result":true,"description":"Webhook was set"}. If it does not open, turn on VPN and click Set connection again. It is important that the page with this text opens: {"ok":true,"result":true,"description":"Webhook was set"}<br>&nbsp;&nbsp;* Then click Test notification. If the bot writes to you within 1-2 minutes, setup is successful.<br>PS: If the bot does not send a message, something was configured incorrectly. Review the setup steps and try again.',
    workerUrlLabel: 'Worker URL:',
    botTokenLabel: 'Bot Token:',
    chatIdLabel: 'Chat ID:',
    enableNotifications: 'Enable notifications',
    testNotification: 'Test notification',
    setWebhook: 'Set connection',
    deleteWebhook: 'Delete connection',
    addTask: 'Add Task',
    addTaskBtn: 'Add Task',
    tabNotes: 'Notes',
    tabTasks: 'Tasks',
    noTasks: 'No tasks yet',
    clickToAddTask: 'Click + to add a task',
    taskSaved: 'Task saved',
    taskDeleted: 'Task deleted',
    editTask: 'Edit Task',
    addSubtask: 'Add subtask',
    taskTitlePlaceholder: 'Task title...',
    addSubtaskPlaceholder: 'Add subtask...',
    editTooltip: 'Edit task',
    deleteTooltip: 'Delete task'
  },
  ru: {
    appTitle: 'КАЛЕНДАРЬ И ЗАМЕТКИ',
    activityLogs: 'Журнал активности',
    archiveLogs: 'Архивировать',
    clearLogs: 'Очистить',
    noLogsYet: 'Логов пока нет',
    logsArchived: 'Логи архивированы',
    noLogsToArchive: 'Нечего архивировать',
    logsCleared: 'Логи очищены',
    backupCreated: 'Бекап создан',
    days: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    titleCalendar: 'Вид календаря',
    titleDonation: 'Пожертвование на развитие',
    titleTheme: 'Сменить тему',
    titleClose: 'Закрыть',
    addNote: 'Добавить заметку',
    editNote: 'Редактировать',
    viewNote: 'Просмотр заметки',
    noteTitlePlaceholder: 'Заголовок заметки...',
    taskTitlePlaceholder: 'Название задачи...',
    noteContentPlaceholder: 'Напишите заметку...\n(Ctrl+V для вставки картинки)',
    addImage: 'Добавить картинку',
    delete: 'Удалить',
    cancel: 'Отмена',
    save: 'Сохранить',
    edit: 'Редактировать',
    noNotes: 'Нет заметок за эту дату',
    clickToAdd: 'Нажмите + чтобы добавить заметку',
    notes: 'заметок',
    note: 'заметка',
    confirmDelete: 'Удалить эту заметку?',
    noteSaved: 'Заметка сохранена',
    noteSavedAsNew: 'Заметка сохранена как новая',
    noteDeleted: 'Заметка удалена',
    backToCalendar: 'Назад к календарю',
    priorityWhite: 'не важно',
    priorityGreen: 'обычно',
    priorityOrange: 'важно',
    priorityRed: 'очень важно',
    network: 'сеть',
    currency: 'валюта',
    wallet: 'кошелёк',
    donationTitle: 'Пожертвование на развитие',
    titleExport: 'Экспорт',
    titleImport: 'Импорт',
    titleReminders: 'Напоминания',
    titleInfo: 'О расширении',
    titleSettings: 'Настройки',
    aboutTitle: 'О расширении ' + APP_VERSION,
    versionLabel: 'Версия',
    imported: 'Данные импортированы и объединены',
    versionDate: 'Дата выпуска',
    featuresLabel: 'Возможности',
    moveUp: 'Переместить вверх',
    moveDown: 'Переместить вниз',
    moveToDate: 'Перенести на дату',
    setReminder: 'Установить напоминание',
    selectDate: 'Выберите дату',
    noteMoved: 'Заметка перенесена',
    noteMovedUp: 'Заметка перемещена вверх',
    noteMovedDown: 'Заметка перемещена вниз',
    cannotMoveUp: 'Нельзя переместить вверх',
    cannotMoveDown: 'Нельзя переместить вниз',
    cancelDate: 'Отмена',
    reminderTitle: 'Установить напоминание',
    reminderMessageLabel: 'Сообщение',
    reminderTime: 'Время напоминания',
    reminderDate: 'Дата напоминания',
    reminderRepeat: 'Повторять',
    reminderRepeatTypeLabel: 'Периодичность',
    reminderRepeatOnce: 'Разово',
    reminderRepeatCountLabel: 'Количество раз',
    reminderRepeatIntervalLabel: 'Интервал',
    reminderRepeatIntervalUnitLabel: 'Единица',
    reminderWeekdays: 'Каждый день недели',
    reminderWeekdayLabel: 'Дни недели',
    reminderNone: 'Без повтора',
    reminderDaily: 'Каждый день',
    reminderWeekly: 'Каждую неделю',
    reminderMonthly: 'Каждый месяц',
    reminderHours: 'часов',
    reminderMinutes: 'минут',
    remindersList: 'Напоминания',
    noReminders: 'Нет напоминаний',
    deleteReminder: 'Удалить напоминание',
    reminderSaved: 'Напоминание сохранено',
    reminderDeleted: 'Напоминание удалено',
    reminderTypeNote: 'Заметка',
    reminderTypeTask: 'Задача',
    reminderRepeatEvery: 'Повтор',
    weekdayMon: 'Пн',
    weekdayTue: 'Вт',
    weekdayWed: 'Ср',
    weekdayThu: 'Чт',
    weekdayFri: 'Пт',
    weekdaySat: 'Сб',
    weekdaySun: 'Вс',
    fillAllFields: 'Заполните все поля',
    configureTelegram: 'Настройте Telegram в настройках',
    workerFetchFailed: 'Не удалось подключиться к Worker. Проверьте URL Worker и интернет.',
    testNotificationSent: 'Тестовое уведомление отправлено',
    reminderTooManyImages: 'В одно напоминание можно добавить не более 10 картинок',
    reminderImageTooLarge: 'Одна из картинок слишком большая для Telegram-напоминания',
    reminderImagesTooLarge: 'Картинки напоминания слишком большие для хранения в Cloudflare KV',
    telegramNotifications: 'Telegram уведомления',
    telegramSetupInfo: 'Cloudflare будет сам проверять напоминания каждую минуту. Один раз пройдите шаги ниже, затем вставьте Worker URL и Chat ID в поля настроек.',
    step1Title: 'Шаг 1: Создайте Telegram-бота',
    step1Desc: '1. Откройте <a href="https://t.me/BotFather" target="_blank">@BotFather</a> в Telegram<br>2. Нажмите Start и отправьте /newbot<br>3. Введите имя бота и username, который заканчивается на bot<br>4. Скопируйте токен от BotFather - это TELEGRAM_BOT_TOKEN<br>&nbsp;&nbsp;* вставьте TELEGRAM_BOT_TOKEN ниже в настройках в "Токен бота: ..."<br>5. Откройте своего нового бота и отправьте /start',
    step2Title: 'Шаг 2: Получите Chat ID',
    step2Desc: '1. Откройте <a href="https://t.me/fetch_id_bot" target="_blank">@fetch_id_bot</a><br>2. Нажмите Start<br>3. Скопируйте число (значение), которое покажет бот - это ваш Chat ID<br>&nbsp;&nbsp;* вставьте значение Chat ID ниже в настройках в "Chat ID: ..."',
    step3Title: 'Шаг 3: Создайте Cloudflare API Token',
    step3Desc: '1. Если у вас нет аккаунта Cloudflare, откройте <a href="https://dash.cloudflare.com/sign-up" target="_blank">Cloudflare Sign Up</a> и зарегистрируйтесь<br>2. Откройте <a href="https://dash.cloudflare.com/" target="_blank">Cloudflare Dashboard</a> и нажмите слева Account home<br>3. Посмотрите на адресную строку браузера. Адрес будет похож на https://dash.cloudflare.com/ACCOUNT_ID/home/overview<br>4. Скопируйте часть между dash.cloudflare.com/ и /home/overview. Это CLOUDFLARE_ACCOUNT_ID: 32-символьный ID, не email и не Telegram Chat ID<br>5. Откройте <a href="https://dash.cloudflare.com/profile/api-tokens" target="_blank">Cloudflare API Tokens</a><br>6. Нажмите Create Token<br>7. Выберите Custom token -> Get started<br>8. Token name: PAPA Calendaries Notes Setup<br>9. Добавьте "Permissions" 3 разрешения для API:<br>&nbsp;&nbsp;* Account -> Workers Scripts -> Edit<br>&nbsp;&nbsp;* Account -> Workers KV Storage -> Edit<br>&nbsp;&nbsp;* User -> Memberships -> Read<br>10. В "Account Resources" выберите:<br>&nbsp;&nbsp;* Include -> Specific account -> ваш аккаунт (или "All accounts")<br>11. Нажмите Continue to summary -> Create Token<br>12. Скопируйте токен сразу - это CLOUDFLARE_API_TOKEN',
    step4Title: 'Шаг 4: Запустите setup-скрипт',
    step4Desc: '1. Откройте файл "setup.env.example" в папке "**:\\**\\PAPA CALENDARIES NOTES\\setup\\" и сохраните копию этого файла как "setup.env" в этой же папке "**:\\**\\PAPA CALENDARIES NOTES\\setup\\"<br>2. Заполните в файле "setup.env" все полученные данные:<br>&nbsp;&nbsp;&nbsp;&nbsp;CLOUDFLARE_API_TOKEN= ...<br>&nbsp;&nbsp;&nbsp;&nbsp;CLOUDFLARE_ACCOUNT_ID= ...<br>&nbsp;&nbsp;&nbsp;&nbsp;TELEGRAM_BOT_TOKEN= ...<br>&nbsp;&nbsp;&nbsp;&nbsp;WORKER_NAME= (оставьте как есть, или напишите своё)<br>3. Зайдите в директорию setup расширения, для этого:<br>&nbsp;&nbsp;* Откройте PowerShell: нажмите Win + R, введите cmd, нажмите OK<br>&nbsp;&nbsp;* Узнайте директорию расположения папки setup, которая находится в файлах папки с расширением, например C:\\PROJECT\\PAPA CALENDARIES NOTES\\setup<br>&nbsp;&nbsp;* Зайдите в директорию командой:<br>&nbsp;&nbsp;&nbsp;&nbsp;cd "C:\\PROJECT\\PAPA CALENDARIES NOTES\\setup"<br>4. Введите команду:<br>&nbsp;&nbsp;&nbsp;&nbsp;powershell -ExecutionPolicy Bypass -File .\\setup-reminders.ps1<br>5. Подождите окончания настройки и скопируйте Worker URL, который напечатает Wrangler<br>6. Вставьте Worker URL и Chat ID ниже, нажмите "Сохранить"<br>&nbsp;&nbsp;* затем "Установить связь" - должна открыться страница с текстом: {"ok":true,"result":true,"description":"Webhook was set"} - если не открылась, включите ВПН и попробуйте снова нажать на "Установить связь" - важно чтобы открылась страница с: {"ok":true,"result":true,"description":"Webhook was set"}<br>&nbsp;&nbsp;* затем нажмите "Тест уведомления" - если вам бот напишет в течение 1-2 минут, то вы успешно все настроили - Поздравляю!<br>PS: а если бот не прислал сообщение, то вы что-то сделали не так, и попробуйте снова просмотреть весь алгоритм настройки...',
    workerUrlLabel: 'URL Worker:',
    botTokenLabel: 'Токен бота:',
    chatIdLabel: 'Chat ID:',
    enableNotifications: 'Включить уведомления',
    testNotification: 'Тест уведомления',
    setWebhook: 'Установить связь',
    deleteWebhook: 'Удалить связь',
    addTask: 'Добавить задачу',
    addTaskBtn: 'Добавить задачу',
    tabNotes: 'Заметки',
    tabTasks: 'Задачи',
    noTasks: 'Задач пока нет',
    clickToAddTask: 'Нажмите + чтобы добавить задачу',
    taskSaved: 'Задача сохранена',
    taskDeleted: 'Задача удалена',
    editTask: 'Редактировать задачу',
    addSubtask: 'Добавить подзадачу',
    taskTitlePlaceholder: 'Название задачи...',
    addSubtaskPlaceholder: 'Добавить подзадачу...',
    editTooltip: 'Редактировать задачу',
    deleteTooltip: 'Удалить задачу'
  }
};

const PRIORITY_COLORS = {
  white: '#ffffff',
  green: '#22c55e',
  orange: '#f97316',
  red: '#ef4444'
};

let currentDatePriority = 'white';
let currentNotePriority = 'white';

function t(key) {
  return translations[currentLang][key] || translations.en[key] || key;
}

function applyI18n(root = document) {
  root.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key && t(key)) el.innerHTML = t(key);
  });

  root.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key && t(key)) el.placeholder = t(key);
  });
}

function setLanguage(lang) {
  currentLang = lang;
  document.getElementById('langEN').classList.toggle('active', lang === 'en');
  document.getElementById('langRU').classList.toggle('active', lang === 'ru');
  applyI18n(document);

  document.querySelector('h1').textContent = t('appTitle');
  document.title = t('appTitle');

  const logTitle = logView.querySelector('h2');
  if (logTitle) logTitle.textContent = t('activityLogs');
  archiveLogsBtn.textContent = t('archiveLogs');
  clearLogsBtn.textContent = t('clearLogs');

  const dayHeaders = document.querySelectorAll('.day-header');
  dayHeaders.forEach((header, i) => {
    header.textContent = t('days')[i];
  });

  document.getElementById('calendarButton').title = t('titleCalendar');
  document.getElementById('donationButton').title = t('titleDonation');
  document.getElementById('exportButton').title = t('titleExport');
  document.getElementById('importButton').title = t('titleImport');
  if (remindersButton) remindersButton.title = t('titleReminders');
  document.getElementById('infoButton').title = t('titleInfo');
  const settingsBtn = document.getElementById('settingsButton');
  if (settingsBtn) settingsBtn.title = t('titleSettings');
  document.getElementById('donationTitle').textContent = t('donationTitle');
  document.getElementById('infoTitle').textContent = t('aboutTitle');
  document.getElementById('settingsTitle').textContent = t('titleSettings');
  
  const tabNotesEl = document.getElementById('tabNotes');
  const tabTasksEl = document.getElementById('tabTasks');
  if (tabNotesEl) tabNotesEl.textContent = t('tabNotes');
  if (tabTasksEl) tabTasksEl.textContent = t('tabTasks');

  document.querySelectorAll('.donation-network').forEach(el => {
    const network = el.textContent.split(' - ')[1];
    el.textContent = t('network') + ' - ' + network;
  });

  document.querySelectorAll('.donation-currency').forEach(el => {
    const currency = el.textContent.split(' - ')[1];
    el.textContent = t('currency') + ' - ' + currency;
  });

  document.getElementById('modalTitleText').textContent = t('addNote');
  document.getElementById('noteTitle').placeholder = t('noteTitlePlaceholder');
  
  const taskTitleInputEl = document.getElementById('taskTitle');
  if (taskTitleInputEl) taskTitleInputEl.placeholder = t('taskTitlePlaceholder');
  
  const subtaskInputEl = document.getElementById('subtaskInput');
  if (subtaskInputEl) subtaskInputEl.placeholder = t('addSubtaskPlaceholder');
  
  addImageBtn.querySelector('span').textContent = t('addImage');
  deleteNoteBtn.textContent = t('delete');
  cancelNoteBtn.textContent = t('cancel');
  saveNoteBtn.textContent = t('save');
  addNoteBtn.querySelector('span').textContent = t('addNote');
  
  const addTaskBtnNotesEl = document.getElementById('addTaskBtnNotes');
  if (addTaskBtnNotesEl) {
    addTaskBtnNotesEl.querySelector('span').textContent = t('addTaskBtn');
  }
  
  const taskModalTitle = document.getElementById('taskModalTitle');
  if (taskModalTitle) taskModalTitle.textContent = t('addTask');
  
  const addSubtaskBtnEl = document.getElementById('addSubtaskBtn');
  if (addSubtaskBtnEl) addSubtaskBtnEl.textContent = '+ ' + t('addSubtask');
  
  if (subtaskInputEl) subtaskInputEl.placeholder = t('addSubtaskPlaceholder');
  
  if (deleteTaskBtn) deleteTaskBtn.textContent = t('delete');
  if (cancelTaskBtn) cancelTaskBtn.textContent = t('cancel');
  if (saveTaskBtn) saveTaskBtn.textContent = t('save');
  
  const placeholder = currentLang === 'ru' ? t('noteContentPlaceholderRu') : t('noteContentPlaceholder');
  noteContentInput.setAttribute('data-placeholder', placeholder);

  updateNotesListDisplay();
  loadTasks();
  updateSelectedDateDisplay();
  updateCalendar();

  chrome.storage.local.set({ appLanguage: lang });
  logger.info('Language changed', { lang });
}

function init() {
  logger.info('Extension initialized');

  chrome.storage.local.get('appLanguage', (data) => {
    const savedLang = data.appLanguage || 'en';
    setLanguage(savedLang);
  });

  const placeholder = currentLang === 'ru' ? t('noteContentPlaceholderRu') : t('noteContentPlaceholder');
  noteContentInput.setAttribute('data-placeholder', placeholder);

  updateTheme();
  switchToCalendar();

  chrome.storage.local.get(null, (data) => {
    currentNotes = data;
    updateCalendar();
    logger.info('Notes loaded from storage', { count: Object.keys(data).filter(k => k.match(/^\d{4}-\d{2}-\d{2}$/)).length });
  });

  setupEventListeners();
  logger.info('Extension ready');
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDoneAt(isoString) {
  const d = new Date(isoString);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `<span class="done-date">${dd}.${mm}.${yy}</span>-<span class="done-time">${hh}:${min}:${ss}</span>`;
}

function formatDisplayDate(date) {
  const locale = currentLang === 'ru' ? 'ru-RU' : 'en-US';
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
  return date.toLocaleDateString(locale, options);
}

function updateSelectedDateDisplay() {
  selectedDateDisplay.textContent = formatDisplayDate(selectedDate);
}

function loadNotesForDate(dateKey) {
  chrome.storage.local.get(dateKey, (result) => {
    const notesData = result[dateKey];
    if (notesData && notesData.notes) {
      currentNotes[dateKey] = notesData;
      currentDatePriority = notesData.priority || 'white';
    } else {
      currentNotes[dateKey] = { notes: [], priority: 'white' };
      currentDatePriority = 'white';
    }
    renderNotesList();
    updateDatePriorityButtons();
    updateCalendar();
  });
}

function updateDatePriorityButtons() {
  document.querySelectorAll('.date-priority .priority-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.priority === currentDatePriority);
  });
}

function setDatePriority(priority) {
  currentDatePriority = priority;
  const dateKey = formatDate(selectedDate);
  
  if (!currentNotes[dateKey]) {
    currentNotes[dateKey] = { notes: [] };
  }
  currentNotes[dateKey].priority = priority;
  
  chrome.storage.local.set({ [dateKey]: currentNotes[dateKey] }, () => {
    updateDatePriorityButtons();
    updateCalendar();
    logger.info('Date priority updated', { date: dateKey, priority });
  });
}

function setNotePriority(priority) {
  currentNotePriority = priority;
  document.querySelectorAll('.note-priority .priority-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.priority === priority);
  });
}

function renderNotesList() {
  const dateKey = formatDate(selectedDate);
  const notesData = currentNotes[dateKey];
  const notes = notesData ? notesData.notes : [];

  notesList.innerHTML = '';

  if (notes.length === 0) {
    notesList.innerHTML = `
      <div class="no-notes">
        <p>${t('noNotes')}</p>
        <p class="sub-text">${t('clickToAdd')}</p>
      </div>
    `;
    return;
  }

  notes.forEach((note, index) => {
    const noteEl = document.createElement('div');
    noteEl.className = 'note-item';
    noteEl.dataset.priority = note.priority || 'white';
    
    const previewText = note.text ? note.text.substring(0, 80) + (note.text.length > 80 ? '...' : '') : '';
    const hasImages = note.html && note.html.includes('<img');
    const date = new Date(note.timestamp);
    const timeStr = date.toLocaleTimeString(currentLang === 'ru' ? 'ru-RU' : 'en-US', { hour: '2-digit', minute: '2-digit' });
    const titleColor = note.titleColor || 'default';
    const titleColorStyle = titleColor !== 'default' ? `color: ${TITLE_COLORS[titleColor]}` : '';
    const prioritySymbol = PRIORITY_SYMBOLS[note.priority] || PRIORITY_SYMBOLS.white;

    noteEl.innerHTML = `
      <div class="note-title" style="${titleColorStyle}">${prioritySymbol} ${escapeHtml(note.title || t('addNote'))}</div>
      <div class="note-preview">${escapeHtml(previewText)}</div>
      <div class="note-meta">
        <span class="note-time">${timeStr}</span>
        ${hasImages ? `<span class="note-images-count">🖼️</span>` : ''}
      </div>
      <div class="note-actions">
        <button class="reminder-note-btn" data-id="${note.id}" title="${t('setReminder')}">🔔</button>
        <button class="move-note-btn move-up" data-id="${note.id}" title="${t('moveUp')}">⬆️</button>
        <button class="move-note-btn move-date" data-id="${note.id}" title="${t('moveToDate')}">🔁</button>
        <button class="move-note-btn move-down" data-id="${note.id}" title="${t('moveDown')}">⬇️</button>
      </div>
    `;

    noteEl.querySelector('.move-up').addEventListener('click', (e) => { e.stopPropagation(); moveNoteUp(note.id); });
    noteEl.querySelector('.move-date').addEventListener('click', (e) => { e.stopPropagation(); showDatePickerModal(note.id); });
    noteEl.querySelector('.move-down').addEventListener('click', (e) => { e.stopPropagation(); moveNoteDown(note.id); });
    noteEl.addEventListener('click', () => openNoteModal(note.id, true));
    notesList.appendChild(noteEl);
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function updateNotesListDisplay() {
  renderNotesList();
}

let currentTitleColor = 'default';

const PRIORITY_SYMBOLS = {
  white: '⚪️',
  green: '🟢',
  orange: '🟠',
  red: '🔴'
};

const TITLE_COLORS = {
  default: '#1e40af',
  red: '#ef4444',
  green: '#22c55e',
  orange: '#f97316',
  purple: '#8b5cf6',
  pink: '#ec4899'
};

function openNoteModal(noteId = null, isViewMode = false) {
  editingNoteId = noteId;
  const titleTextEl = document.getElementById('modalTitleText');
  if (!titleTextEl) {
    console.error('modalTitleText element not found');
    return;
  }

  if (noteId) {
    const dateKey = formatDate(selectedDate);
    const notesData = currentNotes[dateKey];
    const note = notesData.notes.find(n => n.id === noteId);

    if (note) {
      noteTitleInput.value = note.title || '';
      noteContentInput.innerHTML = note.html || '';
      currentNotePriority = note.priority || 'white';
      currentTitleColor = note.titleColor || 'default';
      titleTextEl.textContent = isViewMode ? t('viewNote') : t('editNote');
      deleteNoteBtn.style.display = isViewMode ? 'block' : 'none';
      editNoteBtn.style.display = isViewMode ? 'block' : 'none';
    }
  } else {
    noteTitleInput.value = '';
    noteContentInput.innerHTML = '';
    currentNotePriority = 'white';
    currentTitleColor = 'default';
    titleTextEl.textContent = t('addNote');
    deleteNoteBtn.style.display = 'none';
    editNoteBtn.style.display = 'none';
  }

  updateNotePriorityButtons();
  updateAddNoteButtonText();
  updateTitleColorButtons();
  noteTitleInput.style.color = TITLE_COLORS[currentTitleColor];

  if (isViewMode) {
    noteContentInput.contentEditable = 'false';
    noteTitleInput.readOnly = true;
    const editTextEl = editNoteBtn.querySelector('.edit-note-text');
    if (editTextEl) editTextEl.textContent = t('editNote');
    saveNoteBtn.style.display = 'none';
  } else {
    noteContentInput.contentEditable = 'true';
    noteTitleInput.readOnly = false;
    saveNoteBtn.style.display = 'block';
  }

  noteModal.classList.add('active');
}

function updateTitleColorButtons() {
  document.querySelectorAll('.title-color-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.color === currentTitleColor);
  });
}

function updateAddNoteButtonText() {
  const addNoteText = addNoteBtn.querySelector('.add-note-text');
  if (addNoteText) {
    addNoteText.textContent = t('addNote');
  }
}

function updateNotePriorityButtons() {
  document.querySelectorAll('.note-priority .priority-btn, .modal-priority .priority-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.priority === currentNotePriority);
  });
}

function closeNoteModal() {
  noteModal.classList.remove('active');
  editingNoteId = null;
  currentNotePriority = 'white';
  currentTitleColor = 'default';
  noteTitleInput.style.color = '';
  updateNotePriorityButtons();
  updateTitleColorButtons();
}

function handlePaste(e) {
  const items = e.clipboardData.items;
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      e.preventDefault();
      const file = items[i].getAsFile();
      addImageFromFile(file);
    }
  }
}

function addImageFromFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const imgHtml = `<img src="${e.target.result}" class="note-inline-image" data-full="${e.target.result}" />`;
    noteContentInput.focus();
    document.execCommand('insertHTML', false, imgHtml + '<br>');
  };
  reader.readAsDataURL(file);
}

function showImagePreview(src) {
  const img = new Image();
  img.onload = function() {
    const width = Math.min(this.naturalWidth + 50, screen.width * 0.9);
    const height = Math.min(this.naturalHeight + 100, screen.height * 0.9);
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Image Preview</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            background: #000; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            min-height: 100vh;
            overflow: auto;
          }
          img { 
            max-width: 100%; 
            max-height: 100vh; 
            object-fit: contain;
            cursor: grab;
          }
          .controls {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
            background: rgba(255,255,255,0.2);
            padding: 10px 20px;
            border-radius: 30px;
          }
          .controls button {
            background: rgba(255,255,255,0.3);
            border: none;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 14px;
          }
          .controls button:hover { background: rgba(255,255,255,0.4); }
        </style>
      </head>
      <body>
        <img id="img" src="${src}" style="transform: scale(1)">
        <div class="controls">
          <button onclick="zoomIn()">+</button>
          <button onclick="zoomOut()">-</button>
          <button onclick="resetZoom()">1:1</button>
        </div>
        <script>
          let zoom = 1;
          const img = document.getElementById('img');
          function zoomIn() { zoom = Math.min(zoom + 0.25, 3); img.style.transform = 'scale(' + zoom + ')'; }
          function zoomOut() { zoom = Math.max(zoom - 0.25, 0.25); img.style.transform = 'scale(' + zoom + ')'; }
          function resetZoom() { zoom = 1; img.style.transform = 'scale(1)'; }
          document.addEventListener('keydown', e => {
            if (e.key === '+' || e.key === '=') zoomIn();
            if (e.key === '-') zoomOut();
            if (e.key === '0') resetZoom();
          });
        <\/script>
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank', `width=${width},height=${height},left=${left},top=${top}`);
  };
  img.src = src;
}

function hideImagePreview() {
  imagePreviewModal.classList.remove('active');
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function switchTab(tab) {
  if (tab === 'notes') {
    tabNotes.classList.add('active');
    tabTasks.classList.remove('active');
    editorView.classList.add('active');
    tasksView.classList.remove('active');
    calendarView.classList.remove('active');
  } else {
    tabTasks.classList.add('active');
    tabNotes.classList.remove('active');
    tasksView.classList.add('active');
    editorView.classList.remove('active');
    calendarView.classList.remove('active');
    loadTasks();
  }
}

function loadTasks() {
  const dateKey = formatDate(selectedDate);
  chrome.storage.local.get(dateKey, (result) => {
    const dateData = result[dateKey] || {};
    currentTasks = dateData.tasks || [];
    renderTasksList();
  });
}

function renderTasksList() {
  const dateKey = formatDate(selectedDate);
  logger.info('renderTasksList called', { dateKey, taskCount: (currentTasks || []).length });
  
  const tasksListEl = document.getElementById('tasksList');
  if (!tasksListEl) {
    logger.warn('renderTasksList: tasksList element not found');
    return;
  }
  
  tasksListEl.innerHTML = '';
  const tasks = currentTasks || [];
  
  if (tasks.length === 0) {
    tasksListEl.innerHTML = `
      <div class="no-items">
        <p>${t('noTasks')}</p>
        <p class="sub-text">${t('clickToAddTask')}</p>
      </div>
    `;
    logger.info('renderTasksList: no tasks to render');
    return;
  }
  
  tasks.forEach(task => {
    logger.debug('renderTasksList: rendering task', { taskId: task.id, done: task.done, subtaskCount: (task.subtasks || []).length });
    const taskEl = document.createElement('div');
    taskEl.className = 'task-item';
    taskEl.dataset.priority = task.priority || 'white';
    taskEl.dataset.done = task.done || false;
    
    const titleColor = task.titleColor || 'default';
    const titleColorStyle = titleColor !== 'default' ? `color: ${TITLE_COLORS[titleColor]}` : '';
    const prioritySymbol = PRIORITY_SYMBOLS[task.priority] || PRIORITY_SYMBOLS.white;
    const doneSymbol = task.done ? '✅' : '⬜';
    
    const subtasksHtml = task.subtasks ? task.subtasks.map(st => {
      const stDoneAt = st.doneAt ? formatDoneAt(st.doneAt) : '';
      return `<div class="subtask-item ${st.done ? 'done' : ''}" data-id="${st.id}">
        <input type="checkbox" class="subtask-checkbox" ${st.done ? 'checked' : ''}>
        <span class="subtask-text">${escapeHtml(st.text)}</span>
        ${stDoneAt ? `<span class="done-at">${stDoneAt}</span>` : ''}
      </div>`;
    }).join('') : '';
    
    const doneAtStr = task.doneAt ? formatDoneAt(task.doneAt) : '';
    
    taskEl.innerHTML = `
      <div class="task-header">
        <input type="checkbox" class="task-checkbox" ${task.done ? 'checked' : ''}>
        <div class="task-title" style="${titleColorStyle}">${prioritySymbol} ${escapeHtml(task.title)}</div>
        ${doneAtStr ? `<span class="done-at">${doneAtStr}</span>` : ''}
      </div>
      <div class="task-subtasks">${subtasksHtml}</div>
      <div class="task-actions">
        <button class="reminder-task-btn" data-id="${task.id}" title="${t('setReminder')}">🔔</button>
        <button class="edit-task-btn" data-id="${task.id}" title="${t('editTooltip')}">✏️</button>
        <button class="delete-task-btn" data-id="${task.id}" title="${t('deleteTooltip')}">🗑️</button>
      </div>
    `;
    
    taskEl.querySelector('.task-checkbox').addEventListener('change', (e) => toggleTaskDone(task.id, e.target.checked));
    taskEl.querySelectorAll('.subtask-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => toggleSubtaskDone(task.id, cb.closest('.subtask-item').dataset.id, e.target.checked));
    });
    taskEl.querySelector('.edit-task-btn').addEventListener('click', () => openTaskModal(task.id));
    taskEl.querySelector('.delete-task-btn').addEventListener('click', () => deleteTask(task.id));
    
    tasksList.appendChild(taskEl);
  });
}

function openTaskModal(taskId = null) {
  editingTaskId = taskId;
  currentTaskSubtasks = [];
  currentTaskPriority = 'white';
  currentTaskTitleColor = 'default';
  
  taskTitleInput.value = '';
  subtaskInput.value = '';
  subtasksList.innerHTML = '';
  
  if (taskId) {
    const dateKey = formatDate(selectedDate);
    const dateData = currentNotes[dateKey];
    if (dateData && dateData.tasks) {
      const task = dateData.tasks.find(t => t.id === taskId);
      if (task) {
        taskTitleInput.value = task.title || '';
        currentTaskPriority = task.priority || 'white';
        currentTaskTitleColor = task.titleColor || 'default';
        currentTaskSubtasks = task.subtasks ? [...task.subtasks] : [];
        renderSubtasksList();
        document.getElementById('taskModalTitle').textContent = t('editTask');
      }
    }
  } else {
    document.getElementById('taskModalTitle').textContent = t('addTask');
  }
  
  deleteTaskBtn.style.display = taskId ? 'block' : 'none';
  
  updateTaskPriorityButtons();
  updateTaskTitleColorButtons();
  
  taskModal.classList.add('active');
}

function closeTaskModalWindow() {
  taskModal.classList.remove('active');
  editingTaskId = null;
  currentTaskSubtasks = [];
}

function updateTaskPriorityButtons() {
  document.querySelectorAll('.task-priority .priority-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.priority === currentTaskPriority);
  });
}

function updateTaskTitleColorButtons() {
  document.querySelectorAll('.task-title-row .title-color-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.color === currentTaskTitleColor);
  });
  taskTitleInput.style.color = TITLE_COLORS[currentTaskTitleColor];
}

function addSubtask() {
  const text = subtaskInput.value.trim();
  if (!text) return;
  
  currentTaskSubtasks.push({
    id: generateId(),
    text: text,
    done: false
  });
  
  subtaskInput.value = '';
  renderSubtasksList();
}

function renderSubtasksList() {
  subtasksList.innerHTML = currentTaskSubtasks.map(st => `
    <div class="subtask-item" data-id="${st.id}">
      <span>${escapeHtml(st.text)}</span>
      <button class="remove-subtask-btn" data-id="${st.id}">×</button>
    </div>
  `).join('');
  
  subtasksList.querySelectorAll('.remove-subtask-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentTaskSubtasks = currentTaskSubtasks.filter(st => st.id !== btn.dataset.id);
      renderSubtasksList();
    });
  });
}

function saveTask() {
  const dateKey = formatDate(selectedDate);
  const title = taskTitleInput.value.trim();
  
  if (!title) {
    closeTaskModalWindow();
    return;
  }
  
  const subtaskText = subtaskInput.value.trim();
  if (subtaskText) {
    currentTaskSubtasks.push({
      id: generateId(),
      text: subtaskText,
      done: false
    });
    logger.info('Auto-added subtask from input', { text: subtaskText });
  }
  
  chrome.storage.local.get(dateKey, (result) => {
    const dateData = result[dateKey] || { notes: [], priority: 'white', tasks: [] };
    let tasks = dateData.tasks || [];
    
    const newTask = {
      id: generateId(),
      title: title,
      priority: currentTaskPriority,
      titleColor: currentTaskTitleColor,
      subtasks: currentTaskSubtasks,
      done: false,
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    };
    
    if (editingTaskId) {
      const taskIndex = tasks.findIndex(t => t.id === editingTaskId);
      if (taskIndex !== -1) {
        newTask.created = tasks[taskIndex].created;
        newTask.done = tasks[taskIndex].done;
        newTask.doneAt = tasks[taskIndex].doneAt || null;
        tasks.splice(taskIndex, 1);
      }
    }
    
    tasks.push(newTask);
    dateData.tasks = tasks;
    
    chrome.storage.local.set({ [dateKey]: dateData }, () => {
      currentTasks = tasks;
      currentNotes[dateKey] = dateData;
      renderTasksList();
      updateCalendar();
      closeTaskModalWindow();
      showNotification(t('taskSaved'));
      logger.info('Task saved', { taskId: newTask.id, date: dateKey });
    });
  });
}

function toggleTaskDone(taskId, done) {
  const dateKey = formatDate(selectedDate);
  
  chrome.storage.local.get(dateKey, (result) => {
    const dateData = result[dateKey] || { notes: [], priority: 'white', tasks: [] };
    let tasks = dateData.tasks || [];
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    task.done = done;
    task.modified = new Date().toISOString();
    if (done) task.doneAt = new Date().toISOString();
    else task.doneAt = null;
    
    if (done && task.subtasks && task.subtasks.length > 0) {
      task.subtasks.forEach(st => { st.done = true; st.doneAt = new Date().toISOString(); });
    }
    
    dateData.tasks = tasks;
    
    chrome.storage.local.set({ [dateKey]: dateData }, () => {
      currentTasks = tasks;
      currentNotes[dateKey] = dateData;
      renderTasksList();
      updateCalendar();
      logger.info('Task toggled', { taskId, done, date: dateKey });
    });
  });
}

function toggleSubtaskDone(taskId, subtaskId, done) {
  const dateKey = formatDate(selectedDate);
  logger.info('toggleSubtaskDone called', { taskId, subtaskId, done, dateKey });
  
  chrome.storage.local.get(dateKey, (result) => {
    const dateData = result[dateKey] || { notes: [], priority: 'white', tasks: [] };
    let tasks = dateData.tasks || [];
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.subtasks) {
      logger.warn('toggleSubtaskDone: task or subtasks not found', { taskId, subtaskId });
      return;
    }
  
  const subtask = task.subtasks.find(st => st.id === subtaskId);
  if (subtask) {
    const oldDone = subtask.done;
    subtask.done = done;
    subtask.doneAt = done ? new Date().toISOString() : null;
    task.modified = new Date().toISOString();
    
    logger.info('subtask toggled', { subtaskId, oldDone, newDone: done, doneAt: subtask.doneAt });
    
    if (task.subtasks.length > 0 && task.subtasks.every(st => st.done)) {
      task.done = true;
      task.doneAt = new Date().toISOString();
      logger.info('task auto-completed due to all subtasks done', { taskId });
    }
    
    dateData.tasks = tasks;
    
    chrome.storage.local.set({ [dateKey]: dateData }, () => {
      currentTasks = tasks;
      currentNotes[dateKey] = dateData;
      renderTasksList();
      updateCalendar();
      logger.info('toggleSubtaskDone: saved to storage', { dateKey });
    });
  }
});
}

function deleteTask(taskId) {
  if (!taskId) return;
  
  const dateKey = formatDate(selectedDate);
  
  chrome.storage.local.get(dateKey, (result) => {
    const dateData = result[dateKey] || { notes: [], priority: 'white', tasks: [] };
    let tasks = dateData.tasks || [];
    
    tasks = tasks.filter(t => t.id !== taskId);
    dateData.tasks = tasks;
    
    chrome.storage.local.set({ [dateKey]: dateData }, () => {
      currentTasks = tasks;
      currentNotes[dateKey] = dateData;
      renderTasksList();
      updateCalendar();
      showNotification(t('taskDeleted'));
      logger.info('Task deleted', { taskId, date: dateKey });
    });
  });
}

function saveNote() {
  const dateKey = formatDate(selectedDate);
  const title = noteTitleInput.value.trim();
  const html = noteContentInput.innerHTML.trim();
  const text = noteContentInput.innerText.trim();

  if (!title && !text && html === '<br>') {
    closeNoteModal();
    return;
  }

  const notesData = currentNotes[dateKey] || { notes: [], priority: 'white' };

  if (editingNoteId) {
    const noteIndex = notesData.notes.findIndex(n => n.id === editingNoteId);
    if (noteIndex !== -1) {
      const oldNote = notesData.notes[noteIndex];
      notesData.notes.splice(noteIndex, 1);
      const newNote = {
        id: generateId(),
        title: title || t('addNote'),
        html,
        text,
        priority: currentNotePriority,
        titleColor: currentTitleColor,
        created: oldNote.created || new Date().toISOString(),
        modified: new Date().toISOString()
      };
      notesData.notes.push(newNote);
    }
  } else {
    const newNote = {
      id: generateId(),
      title: title || t('addNote'),
      html,
      text,
      priority: currentNotePriority,
      titleColor: currentTitleColor,
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    };
    notesData.notes.push(newNote);
  }

  chrome.storage.local.set({ [dateKey]: notesData }, () => {
    currentNotes[dateKey] = notesData;
    renderNotesList();
    updateCalendar();
    closeNoteModal();
    showNotification(editingNoteId ? t('noteSavedAsNew') : t('noteSaved'));
    logger.info('Note saved', { date: dateKey, noteId: editingNoteId, newId: editingNoteId ? notesData.notes[notesData.notes.length - 1].id : null });
  });
}

function deleteNote() {
  if (!editingNoteId) return;

  const dateKey = formatDate(selectedDate);
  const notesData = currentNotes[dateKey];

  notesData.notes = notesData.notes.filter(n => n.id !== editingNoteId);

  chrome.storage.local.set({ [dateKey]: notesData }, () => {
    currentNotes[dateKey] = notesData;
    renderNotesList();
    updateCalendar();
    closeNoteModal();
    showNotification(t('noteDeleted'));
    logger.info('Note deleted', { date: dateKey, noteId: editingNoteId });
  });
}

let datePickerNoteId = null;
let datePickerModal = null;

function showDatePickerModal(noteId) {
  datePickerNoteId = noteId;
  if (!datePickerModal) {
    datePickerModal = document.createElement('div');
    datePickerModal.className = 'modal date-picker-modal';
    datePickerModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="datePickerTitle">${t('selectDate')}</h3>
          <button id="closeDatePickerBtn" class="icon-button small">×</button>
        </div>
        <div class="modal-body">
          <input type="date" id="datePickerInput">
        </div>
        <div class="modal-footer">
          <button id="cancelDatePickerBtn" class="secondary-btn">${t('cancelDate')}</button>
          <button id="confirmDatePickerBtn" class="primary-btn">${t('save')}</button>
        </div>
      </div>
    `;
    document.body.appendChild(datePickerModal);
    
    datePickerModal.querySelector('#closeDatePickerBtn').addEventListener('click', closeDatePicker);
    datePickerModal.querySelector('#cancelDatePickerBtn').addEventListener('click', closeDatePicker);
    datePickerModal.querySelector('#confirmDatePickerBtn').addEventListener('click', () => moveNoteToDate(datePickerModal.querySelector('#datePickerInput').value));
  }
  
  datePickerModal.querySelector('#datePickerTitle').textContent = t('selectDate');
  datePickerModal.querySelector('#cancelDatePickerBtn').textContent = t('cancelDate');
  datePickerModal.querySelector('#confirmDatePickerBtn').textContent = t('save');
  datePickerModal.classList.add('active');
  const today = new Date().toISOString().split('T')[0];
  datePickerModal.querySelector('#datePickerInput').value = today;
  datePickerModal.querySelector('#datePickerInput').min = '2020-01-01';
  datePickerModal.querySelector('#datePickerInput').max = '2030-12-31';
}

function closeDatePicker() {
  if (datePickerModal) {
    datePickerModal.classList.remove('active');
    datePickerNoteId = null;
  }
}

function moveNoteToDate(newDateKey) {
  if (!datePickerNoteId || !newDateKey) return;
  
  const oldDateKey = formatDate(selectedDate);
  const oldNotesData = currentNotes[oldDateKey];
  const noteIndex = oldNotesData.notes.findIndex(n => n.id === datePickerNoteId);
  
  if (noteIndex === -1) return;
  
  const note = oldNotesData.notes.splice(noteIndex, 1)[0];
  
  if (!currentNotes[newDateKey]) {
    currentNotes[newDateKey] = { notes: [], priority: 'white' };
  }
  
  note.created = new Date().toISOString();
  note.modified = new Date().toISOString();
  currentNotes[newDateKey].notes.push(note);
  
  chrome.storage.local.set({
    [oldDateKey]: oldNotesData,
    [newDateKey]: currentNotes[newDateKey]
  }, () => {
    renderNotesList();
    updateCalendar();
    closeDatePicker();
    showNotification(t('noteMoved'));
    logger.info('Note moved to date', { noteId: datePickerNoteId, fromDate: oldDateKey, toDate: newDateKey });
  });
}

function moveNoteUp(noteId) {
  const dateKey = formatDate(selectedDate);
  const notesData = currentNotes[dateKey];
  const noteIndex = notesData.notes.findIndex(n => n.id === noteId);
  
  if (noteIndex <= 0) {
    showNotification(t('cannotMoveUp'), 'error');
    return;
  }
  
  const note = notesData.notes.splice(noteIndex, 1)[0];
  notesData.notes.splice(noteIndex - 1, 0, note);
  
  chrome.storage.local.set({ [dateKey]: notesData }, () => {
    currentNotes[dateKey] = notesData;
    renderNotesList();
    showNotification(t('noteMovedUp'));
    logger.info('Note moved up', { date: dateKey, noteId });
  });
}

function moveNoteDown(noteId) {
  const dateKey = formatDate(selectedDate);
  const notesData = currentNotes[dateKey];
  const noteIndex = notesData.notes.findIndex(n => n.id === noteId);
  
  if (noteIndex === -1 || noteIndex >= notesData.notes.length - 1) {
    showNotification(t('cannotMoveDown'), 'error');
    return;
  }
  
  const note = notesData.notes.splice(noteIndex, 1)[0];
  notesData.notes.splice(noteIndex + 1, 0, note);
  
  chrome.storage.local.set({ [dateKey]: notesData }, () => {
    currentNotes[dateKey] = notesData;
    renderNotesList();
    showNotification(t('noteMovedDown'));
    logger.info('Note moved down', { date: dateKey, noteId });
  });
}

function generateId() {
  return 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function updateCalendar() {
  calendarDays.innerHTML = '';

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  currentYearElement.textContent = year;
  
  const monthNames = currentLang === 'ru' 
    ? ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  currentMonthElement.textContent = monthNames[month];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'calendar-day empty';
    calendarDays.appendChild(emptyDay);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = day;

    const dateObj = new Date(year, month, day);
    const dateKey = formatDate(dateObj);

    if (currentNotes[dateKey] && currentNotes[dateKey].notes && currentNotes[dateKey].notes.length > 0) {
      dayElement.classList.add('has-notes');
      const priority = currentNotes[dateKey].priority || 'white';
      dayElement.dataset.priority = priority;
      const noteCount = currentNotes[dateKey].notes.length;
      
      const noteIndicator = document.createElement('span');
      noteIndicator.className = 'note-indicator';
      noteIndicator.textContent = noteCount;
      noteIndicator.title = t('tabNotes');
      dayElement.appendChild(noteIndicator);
    }

    if (currentNotes[dateKey] && currentNotes[dateKey].tasks && currentNotes[dateKey].tasks.length > 0) {
      const taskCount = currentNotes[dateKey].tasks.length;
      
      const taskIndicator = document.createElement('span');
      taskIndicator.className = 'task-indicator';
      taskIndicator.textContent = taskCount;
      taskIndicator.title = t('tabTasks');
      dayElement.appendChild(taskIndicator);
    }

    if (dateObj.getDate() === new Date().getDate() &&
        dateObj.getMonth() === new Date().getMonth() &&
        dateObj.getFullYear() === new Date().getFullYear()) {
      dayElement.classList.add('today');
    }

    if (dateObj.getDate() === selectedDate.getDate() &&
        dateObj.getMonth() === selectedDate.getMonth() &&
        dateObj.getFullYear() === selectedDate.getFullYear()) {
      dayElement.classList.add('selected');
    }

    dayElement.addEventListener('click', () => {
      document.querySelectorAll('.calendar-day').forEach(el => {
        el.classList.remove('selected');
      });

      dayElement.classList.add('selected');
      selectedDate = new Date(year, month, day);

      logger.debug('Date selected in calendar', { date: dateKey });

      dayElement.style.transform = 'scale(1.1)';
      setTimeout(() => {
        dayElement.style.transform = '';
        switchToEditor();
        loadNotesForDate(dateKey);
      }, 300);
    });

    calendarDays.appendChild(dayElement);
  }
}

function switchToEditor() {
  logView.classList.remove('active');
  calendarView.classList.remove('active');
  tasksView.classList.remove('active');
  
  const notesListEl = document.getElementById('notesList');
  const tasksListEl = document.getElementById('tasksList');
  const addNoteBtnEl = document.getElementById('addNoteBtn');
  const addTaskBtnEl = document.getElementById('addTaskBtnNotes');
  const tabNotesEl = document.getElementById('tabNotes');
  const tabTasksEl = document.getElementById('tabTasks');
  
  if (tabNotesEl) tabNotesEl.classList.add('active');
  if (tabTasksEl) tabTasksEl.classList.remove('active');
  if (notesListEl) notesListEl.style.display = 'block';
  if (tasksListEl) tasksListEl.style.display = 'none';
  if (addNoteBtnEl) addNoteBtnEl.style.display = 'flex';
  if (addTaskBtnEl) addTaskBtnEl.style.display = 'none';
  
  setTimeout(() => {
    editorView.classList.add('active');
    updateSelectedDateDisplay();
    renderNotesList();
    loadTasks();
  }, 50);
}

function switchToCalendar() {
  logView.classList.remove('active');
  editorView.classList.remove('active');
  tasksView.classList.remove('active');
  setTimeout(() => {
    calendarView.classList.add('active');
    updateCalendar();
  }, 50);
}

function switchToLogView() {
  editorView.classList.remove('active');
  calendarView.classList.remove('active');
  setTimeout(() => {
    logView.classList.add('active');
    loadLogs();
  }, 50);
}

function loadLogs() {
  logger.getLogs((logs) => {
    logContainer.innerHTML = '';
    if (logs.length === 0) {
      logContainer.innerHTML = `<div class="log-empty">${t('noLogsYet')}</div>`;
      return;
    }

    logs.forEach(log => {
      const logItem = document.createElement('div');
      logItem.className = `log-item log-${log.type}`;

      const time = new Date(log.timestamp).toLocaleTimeString();
      const date = new Date(log.timestamp).toLocaleDateString();

      logItem.innerHTML = `
        <div class="log-time">${date} ${time}</div>
        <div class="log-message">[${log.type.toUpperCase()}] ${log.message}</div>
      `;
      logContainer.appendChild(logItem);
    });

    logger.info('Logs displayed', { count: logs.length });
  });
}

function setupEventListeners() {
  document.getElementById('langEN').addEventListener('click', () => setLanguage('en'));
  document.getElementById('langRU').addEventListener('click', () => setLanguage('ru'));

  const addTaskBtnNotes = document.getElementById('addTaskBtnNotes');
  
  if (addTaskBtnNotes) {
    addTaskBtnNotes.addEventListener('click', () => openTaskModal());
  }

  if (tabNotes && tabTasks) {
    tabNotes.addEventListener('click', () => {
      tabNotes.classList.add('active');
      tabTasks.classList.remove('active');
      
      const notesListEl = document.getElementById('notesList');
      const tasksListEl = document.getElementById('tasksList');
      const addNoteBtnEl = document.getElementById('addNoteBtn');
      const addTaskBtnEl = document.getElementById('addTaskBtnNotes');
      
      if (notesListEl) notesListEl.style.display = 'block';
      if (tasksListEl) tasksListEl.style.display = 'none';
      if (addNoteBtnEl) addNoteBtnEl.style.display = 'flex';
      if (addTaskBtnEl) addTaskBtnEl.style.display = 'none';
      
      renderNotesList();
    });
    
    tabTasks.addEventListener('click', () => {
      tabTasks.classList.add('active');
      tabNotes.classList.remove('active');
      
      const notesListEl = document.getElementById('notesList');
      const tasksListEl = document.getElementById('tasksList');
      const addNoteBtnEl = document.getElementById('addNoteBtn');
      const addTaskBtnEl = document.getElementById('addTaskBtnNotes');
      
      if (notesListEl) notesListEl.style.display = 'none';
      if (tasksListEl) tasksListEl.style.display = 'block';
      if (addNoteBtnEl) addNoteBtnEl.style.display = 'none';
      if (addTaskBtnEl) addTaskBtnEl.style.display = 'flex';
      
      loadTasks();
    });
  }

  if (addTaskBtn) {
    addTaskBtn.addEventListener('click', () => openTaskModal());
  }
  closeTaskBtn.addEventListener('click', closeTaskModalWindow);
  cancelTaskBtn.addEventListener('click', closeTaskModalWindow);
  saveTaskBtn.addEventListener('click', saveTask);
  deleteTaskBtn.addEventListener('click', () => deleteTask(editingTaskId));
  addSubtaskBtn.addEventListener('click', addSubtask);
  subtaskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addSubtask(); });

  document.querySelectorAll('.task-priority .priority-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentTaskPriority = e.target.dataset.priority;
      updateTaskPriorityButtons();
    });
  });

  document.querySelectorAll('.task-title-row .title-color-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentTaskTitleColor = e.target.dataset.color;
      updateTaskTitleColorButtons();
    });
  });

  calendarButton.addEventListener('click', () => {
    logger.debug('Calendar button clicked');
    if (calendarView.classList.contains('active')) {
      switchToEditor();
    } else {
      switchToCalendar();
    }
  });

  backToCalendarBtn.addEventListener('click', switchToCalendar);

  themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    logger.debug('Theme toggled', { isDarkMode });

    themeToggle.style.transition = 'transform 0.5s ease';
    themeToggle.style.transform = 'rotate(360deg)';

    setTimeout(() => {
      themeToggle.style.transform = '';
      updateTheme();
    }, 300);
  });

  prevMonthButton.addEventListener('click', () => {
    calendarDays.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    calendarDays.style.transform = 'translateX(20px)';
    calendarDays.style.opacity = '0';

    setTimeout(() => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      updateCalendar();
      logger.debug('Calendar previous month', { month: currentDate.getMonth() });

      calendarDays.style.transform = 'translateX(-20px)';

      requestAnimationFrame(() => {
        calendarDays.style.transform = 'translateX(0)';
        calendarDays.style.opacity = '1';
      });
    }, 300);
  });

  nextMonthButton.addEventListener('click', () => {
    calendarDays.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    calendarDays.style.transform = 'translateX(-20px)';
    calendarDays.style.opacity = '0';

    setTimeout(() => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      updateCalendar();
      logger.debug('Calendar next month', { month: currentDate.getMonth() });

      calendarDays.style.transform = 'translateX(20px)';

      requestAnimationFrame(() => {
        calendarDays.style.transform = 'translateX(0)';
        calendarDays.style.opacity = '1';
      });
    }, 300);
  });

  prevYearButton.addEventListener('click', () => {
    calendarDays.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    calendarDays.style.transform = 'translateX(20px)';
    calendarDays.style.opacity = '0';

    setTimeout(() => {
      currentDate.setFullYear(currentDate.getFullYear() - 1);
      updateCalendar();
      logger.debug('Calendar previous year', { year: currentDate.getFullYear() });

      calendarDays.style.transform = 'translateX(-20px)';

      requestAnimationFrame(() => {
        calendarDays.style.transform = 'translateX(0)';
        calendarDays.style.opacity = '1';
      });
    }, 300);
  });

  nextYearButton.addEventListener('click', () => {
    calendarDays.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    calendarDays.style.transform = 'translateX(-20px)';
    calendarDays.style.opacity = '0';

    setTimeout(() => {
      currentDate.setFullYear(currentDate.getFullYear() + 1);
      updateCalendar();
      logger.debug('Calendar next year', { year: currentDate.getFullYear() });

      calendarDays.style.transform = 'translateX(20px)';

      requestAnimationFrame(() => {
        calendarDays.style.transform = 'translateX(0)';
        calendarDays.style.opacity = '1';
      });
    }, 300);
  });

  closeLogViewBtn.addEventListener('click', () => {
    logger.debug('Log view closed');
    switchToEditor();
  });

  archiveLogsBtn.addEventListener('click', () => {
    logger.info('Archive logs requested');
    logger.archiveLogs((filename) => {
      if (filename) {
        showNotification(`${t('logsArchived')}: ${filename}`);
      } else {
        showNotification(t('noLogsToArchive'), 'warn');
      }
    });
  });

  clearLogsBtn.addEventListener('click', () => {
    logger.info('Clear logs requested');
    logger.clearLogs(() => {
      loadLogs();
      showNotification(t('logsCleared'));
    });
  });

  donationButton.addEventListener('click', () => {
    donationModal.classList.add('active');
  });

  closeDonationBtn.addEventListener('click', () => {
    donationModal.classList.remove('active');
  });

  donationModal.addEventListener('click', (e) => {
    if (e.target === donationModal) {
      donationModal.classList.remove('active');
    }
  });

  exportButton.addEventListener('click', () => {
    chrome.storage.local.get(null, (data) => {
      const exportData = {
        version: APP_VERSION,
        exportDate: new Date().toISOString(),
        data: data
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `calendar_notes_backup_${formatDate(new Date())}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showNotification(t('backupCreated'));
    });
  });

  importButton.addEventListener('click', () => {
    importInput.click();
  });

  if (remindersButton) {
    remindersButton.addEventListener('click', () => {
      applyI18n(remindersModal);
      renderSavedReminders();
      remindersModal.classList.add('active');
    });
  }

  if (closeRemindersBtn) {
    closeRemindersBtn.addEventListener('click', () => remindersModal.classList.remove('active'));
  }

  if (remindersModal) {
    remindersModal.addEventListener('click', (e) => {
      if (e.target === remindersModal) remindersModal.classList.remove('active');
    });
  }

  importInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importData = JSON.parse(event.target.result);
        if (importData.data) {
          chrome.storage.local.get(null, (existingData) => {
            const mergedData = { ...existingData };
            
            for (const [dateKey, importedValue] of Object.entries(importData.data)) {
              if (!dateKey.match(/^\d{4}-\d{2}-\d{2}$/)) {
                mergedData[dateKey] = importedValue;
                continue;
              }
              
              if (!mergedData[dateKey]) {
                mergedData[dateKey] = importedValue;
                continue;
              }
              
              if (importedValue.notes && importedValue.notes.length > 0) {
                if (!mergedData[dateKey].notes) {
                  mergedData[dateKey].notes = [];
                }
                
                for (const importedNote of importedValue.notes) {
                  const existingIndex = mergedData[dateKey].notes.findIndex(n => n.id === importedNote.id);
                  if (existingIndex !== -1) {
                    mergedData[dateKey].notes[existingIndex] = { ...importedNote };
                  } else {
                    mergedData[dateKey].notes.push({ ...importedNote });
                  }
                }
              }
              
              if (importedValue.priority) {
                mergedData[dateKey].priority = importedValue.priority;
              }
              
              if (importedValue.tasks && importedValue.tasks.length > 0) {
                if (!mergedData[dateKey].tasks) {
                  mergedData[dateKey].tasks = [];
                }
                
                for (const importedTask of importedValue.tasks) {
                  const existingIndex = mergedData[dateKey].tasks.findIndex(t => t.id === importedTask.id);
                  if (existingIndex !== -1) {
                    mergedData[dateKey].tasks[existingIndex] = { ...importedTask };
                  } else {
                    mergedData[dateKey].tasks.push({ ...importedTask });
                  }
                }
              }
            }
            
            chrome.storage.local.set(mergedData, () => {
              currentNotes = mergedData;
              updateCalendar();
              loadNotesForDate(formatDate(selectedDate));
              loadTasks();
              showNotification(t('imported'));
              logger.info('Data imported and merged', { version: importData.version });
            });
          });
        }
      } catch (err) {
        showNotification('Invalid import file', 'error');
      }
    };
    reader.readAsText(file);
    importInput.value = '';
  });

  infoButton.addEventListener('click', () => {
    renderVersionHistory();
    infoModal.classList.add('active');
  });

  const settingsButton = document.getElementById('settingsButton');
  const settingsModal = document.getElementById('settingsModal');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');

  if (settingsButton) {
    logger.info('settingsButton clicked');
    settingsButton.addEventListener('click', () => {
      logger.info('Opening settings modal', { settingsModalExists: !!settingsModal });
      loadSettings();
      if (settingsModal) {
        settingsModal.classList.add('active');
        logger.info('Added active class to settingsModal');
      } else {
        logger.error('settingsModal is null!');
      }
    });
  }

  if (closeSettingsBtn) {
    closeSettingsBtn.addEventListener('click', () => settingsModal.classList.remove('active'));
  }

  if (cancelSettingsBtn) {
    cancelSettingsBtn.addEventListener('click', () => settingsModal.classList.remove('active'));
  }

  if (settingsModal) {
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) settingsModal.classList.remove('active');
    });
  }

  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', saveSettings);
  }

  const testTelegramBtn = document.getElementById('testTelegramBtn');
  if (testTelegramBtn) {
    testTelegramBtn.addEventListener('click', async () => {
      const workerUrl = document.getElementById('workerUrlInput').value.trim();
      const chatId = document.getElementById('chatIdInput').value.trim();

      if (!workerUrl || !chatId) {
        showNotification(t('fillAllFields'), 'error');
        return;
      }

      try {
        await sendReminderRequest(workerUrl, '/send-test', {
          chat_id: chatId,
          message: currentLang === 'ru' ? '🔔 Тестовая проверка! Напоминания работают!' : '🔔 Test check! Reminders are working!'
        });
        showNotification(t('testNotificationSent'), 'success');
      } catch (error) {
        logger.warn('Test reminder failed', { error: error.message });
        showNotification(error.message, 'error');
      }
    });
  }

  const setWebhookBtn = document.getElementById('setWebhookBtn');
  if (setWebhookBtn) {
    setWebhookBtn.addEventListener('click', () => {
      const workerUrl = document.getElementById('workerUrlInput').value.trim();
      const botToken = document.getElementById('botTokenInput').value.trim();

      if (!workerUrl || !botToken) {
        showNotification(currentLang === 'ru' ? 'Заполните URL Worker и токен бота' : 'Fill Worker URL and bot token', 'error');
        return;
      }

      const webhookUrl = workerUrl.replace(/\/$/, '') + '/webhook';
      const telegramUrl = 'https://api.telegram.org/bot' + botToken + '/setWebhook?url=' + encodeURIComponent(webhookUrl);

      showNotification(currentLang === 'ru' ? 'Откройте ссылку в новой вкладке и скопируйте результат' : 'Open link in new tab and copy result', 'success');

      chrome.tabs.create({ url: telegramUrl });
    });
  }

  const deleteWebhookBtn = document.getElementById('deleteWebhookBtn');
  if (deleteWebhookBtn) {
    deleteWebhookBtn.addEventListener('click', async () => {
      const botToken = document.getElementById('botTokenInput').value.trim();

      if (!botToken) {
        showNotification(currentLang === 'ru' ? 'Введите токен бота' : 'Enter bot token', 'error');
        return;
      }

      try {
        const response = await fetch('https://api.telegram.org/bot' + botToken + '/deleteWebhook');
        const result = await response.json();

        if (result.ok) {
          showNotification(currentLang === 'ru' ? 'Связь удалена!' : 'Connection deleted!', 'success');
        } else {
          showNotification(currentLang === 'ru' ? 'Ошибка: ' + result.description : 'Error: ' + result.description, 'error');
        }
      } catch (error) {
        showNotification(currentLang === 'ru' ? 'Ошибка: ' + error.message : 'Error: ' + error.message, 'error');
      }
    });
  }

  function loadSettings() {
    logger.info('loadSettings called');
    const settingsModal = document.getElementById('settingsModal');
    logger.info('loadSettings: settingsModal found', { exists: !!settingsModal });
    if (settingsModal) {
      applyI18n(settingsModal);
    }
    chrome.storage.local.get(['telegramWorkerUrl', 'telegramBotToken', 'telegramChatId', 'telegramEnabled'], (data) => {
      document.getElementById('workerUrlInput').value = data.telegramWorkerUrl || '';
      document.getElementById('botTokenInput').value = data.telegramBotToken || '';
      document.getElementById('chatIdInput').value = data.telegramChatId || '';
      document.getElementById('telegramEnabled').checked = data.telegramEnabled || false;
      renderSavedReminders();
    });
  }

  function saveSettings() {
    const workerUrl = normalizeWorkerUrl(document.getElementById('workerUrlInput').value);
    const botToken = document.getElementById('botTokenInput').value.trim();
    const chatId = document.getElementById('chatIdInput').value.trim();
    const enabled = document.getElementById('telegramEnabled').checked;
    
    chrome.storage.local.set({
      telegramWorkerUrl: workerUrl,
      telegramBotToken: botToken,
      telegramChatId: chatId,
      telegramEnabled: enabled
    }, () => {
      settingsModal.classList.remove('active');
      document.getElementById('workerUrlInput').value = workerUrl;
      showNotification(currentLang === 'ru' ? 'Настройки сохранены' : 'Settings saved');
      logger.info('Settings saved', { telegramEnabled: enabled });
    });
  }

  closeInfoBtn.addEventListener('click', () => {
    infoModal.classList.remove('active');
  });

  infoModal.addEventListener('click', (e) => {
    if (e.target === infoModal) {
      infoModal.classList.remove('active');
    }
  });

  addNoteBtn.onclick = function() {
    openNoteModal(null, false);
  };
  addNoteBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    openNoteModal(null, false);
  });
  closeModalBtn.addEventListener('click', closeNoteModal);
  cancelNoteBtn.addEventListener('click', closeNoteModal);
  saveNoteBtn.addEventListener('click', saveNote);
  deleteNoteBtn.addEventListener('click', deleteNote);
  editNoteBtn.addEventListener('click', (e) => {
    if (e.target.closest('.priority-btn')) return;
    if (editingNoteId) {
      openNoteModal(editingNoteId, false);
    }
  });

  document.querySelectorAll('.date-priority .priority-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      setDatePriority(btn.dataset.priority);
    });
  });

  document.querySelectorAll('.note-priority .priority-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      setNotePriority(btn.dataset.priority);
      addNoteBtn.click();
    });
  });

  document.querySelectorAll('.modal-priority .priority-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentNotePriority = btn.dataset.priority;
      updateNotePriorityButtons();
    });
  });

  document.querySelectorAll('.title-color-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentTitleColor = btn.dataset.color;
      noteTitleInput.style.color = TITLE_COLORS[currentTitleColor];
      updateTitleColorButtons();
    });
  });

  noteContentInput.addEventListener('paste', handlePaste);

  noteContentInput.addEventListener('click', (e) => {
    if (e.target.classList.contains('note-inline-image')) {
      const fullSrc = e.target.dataset.full || e.target.src;
      showImagePreview(fullSrc);
    }
  });

  addImageBtn.addEventListener('click', () => imageInput.click());
  imageInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      addImageFromFile(e.target.files[0]);
      imageInput.value = '';
    }
  });

closePreviewBtn.addEventListener('click', hideImagePreview);
  
  noteModal.addEventListener('click', (e) => {
    if (e.target === noteModal) {
      closeNoteModal();
    }
  });
}

function updateTheme() {
  document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';

  if (isDarkMode) {
    document.body.setAttribute('data-theme', 'dark');

    const themeIcon = themeToggle.querySelector('svg path');
    if (themeIcon) {
      themeIcon.setAttribute('d', 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z');
    }
  } else {
    document.body.removeAttribute('data-theme');

    const themeIcon = themeToggle.querySelector('svg path');
    if (themeIcon) {
      themeIcon.setAttribute('d', 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z');
    }
  }
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  isDarkMode = e.matches;
  updateTheme();
});

function renderVersionHistory() {
  const history = VERSION_HISTORY[currentLang] || VERSION_HISTORY.en;
  versionHistory.innerHTML = history.map(v => `
    <div class="version-block">
      <div class="version-number">${t('versionLabel')} ${v.version}</div>
      <div class="version-date">${t('versionDate')}: ${v.date}</div>
      <div class="version-features-label">${t('featuresLabel')}:</div>
      <ul class="version-features">
        ${v.features.map(f => `<li>${f}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.transform = 'translateY(0)';
    notification.style.opacity = '1';
  }, 10);

  setTimeout(() => {
    notification.style.transform = 'translateY(-20px)';
    notification.style.opacity = '0';

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 2000);
}

document.addEventListener('DOMContentLoaded', init);

let reminderItemId = null;
let reminderItemType = null;

function normalizeWorkerUrl(workerUrl) {
  const trimmed = workerUrl.trim();
  if (!trimmed) return '';

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : 'https://' + trimmed;
  return withProtocol.replace(/\/+$/, '');
}

async function sendReminderRequest(workerUrl, path, payload) {
  const requestUrl = normalizeWorkerUrl(workerUrl) + path;
  logger.info('Reminder API request started', { path });

  let response;
  try {
    response = await fetch(requestUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    throw new Error(t('workerFetchFailed'));
  }

  const text = await response.text();
  let result = {};
  try {
    result = text ? JSON.parse(text) : {};
  } catch (error) {
    throw new Error(text || response.statusText);
  }

  if (!response.ok || result.error) {
    throw new Error(result.error || response.statusText);
  }

  logger.info('Reminder API request completed', { path, result });
  return result;
}

async function checkRemindersNow(workerUrl) {
  const requestUrl = normalizeWorkerUrl(workerUrl) + '/check';
  logger.info('Reminder check request started');

  let response;
  try {
    response = await fetch(requestUrl);
  } catch (error) {
    throw new Error(t('workerFetchFailed'));
  }
  const text = await response.text();
  let result = {};
  try {
    result = text ? JSON.parse(text) : {};
  } catch (error) {
    throw new Error(text || response.statusText);
  }

  if (!response.ok || result.error) {
    throw new Error(result.error || response.statusText);
  }

  logger.info('Reminder check request completed', result);
  return result;
}

function getStoredReminders(callback) {
  chrome.storage.local.get('telegramReminders', (data) => {
    callback(data.telegramReminders || []);
  });
}

function saveStoredReminders(reminders, callback) {
  chrome.storage.local.set({ telegramReminders: reminders }, () => {
    logger.info('Stored reminders updated', { count: reminders.length });
    if (callback) callback();
  });
}

function addStoredReminder(reminder, callback) {
  getStoredReminders((reminders) => {
    reminders.unshift(reminder);
    saveStoredReminders(reminders, callback);
  });
}

function formatReminderDateTime(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  return date.toLocaleString(currentLang === 'ru' ? 'ru-RU' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getReminderRepeatLabel(repeat) {
  if (!repeat || !repeat.type) return '';

  const typeLabels = {
    once: t('reminderRepeatOnce'),
    daily: t('reminderDaily'),
    weekly: t('reminderWeekly'),
    monthly: t('reminderMonthly'),
    weekdays: t('reminderWeekdays')
  };

  if (repeat.type === 'once') {
    const count = Number(repeat.count || 1);
    const intervalValue = Number(repeat.interval_value || 0);
    const intervalUnit = repeat.interval_unit === 'hours' ? t('reminderHours') : t('reminderMinutes');
    if (count <= 1) return typeLabels.once;
    return `${typeLabels.once}: ${count} x ${intervalValue} ${intervalUnit}`;
  }

  if (repeat.type === 'weekdays' && Array.isArray(repeat.weekdays)) {
    const names = {
      0: t('weekdaySun'),
      1: t('weekdayMon'),
      2: t('weekdayTue'),
      3: t('weekdayWed'),
      4: t('weekdayThu'),
      5: t('weekdayFri'),
      6: t('weekdaySat')
    };
    return `${typeLabels.weekdays}: ${repeat.weekdays.map(day => names[day]).filter(Boolean).join(', ')}`;
  }

  return typeLabels[repeat.type] || repeat.type;
}

function updateReminderRepeatControls() {
  const typeEl = document.getElementById('reminderRepeatType');
  const onceOptions = document.getElementById('reminderOnceOptions');
  const weekdayOptions = document.getElementById('reminderWeekdayOptions');
  if (!typeEl || !onceOptions || !weekdayOptions) return;

  onceOptions.classList.toggle('hidden', typeEl.value !== 'once');
  weekdayOptions.classList.toggle('hidden', typeEl.value !== 'weekdays');
}

function buildReminderRepeatConfig() {
  const type = document.getElementById('reminderRepeatType')?.value || 'once';

  if (type === 'once') {
    return {
      type,
      count: Math.max(1, Number(document.getElementById('reminderRepeatCount')?.value || 1)),
      interval_value: Math.max(1, Number(document.getElementById('reminderRepeatIntervalValue')?.value || 1)),
      interval_unit: document.getElementById('reminderRepeatIntervalUnit')?.value === 'hours' ? 'hours' : 'minutes'
    };
  }

  if (type === 'weekdays') {
    const weekdays = Array.from(document.querySelectorAll('#reminderWeekdayOptions input[type="checkbox"]:checked'))
      .map(input => Number(input.value))
      .filter(day => Number.isInteger(day) && day >= 0 && day <= 6);

    return { type, weekdays };
  }

  return { type };
}

function findItemTitle(itemId, itemType, data) {
  for (const [key, value] of Object.entries(data)) {
    if (!key.match(/^\d{4}-\d{2}-\d{2}$/) || !value) continue;

    if (itemType === 'note' && Array.isArray(value.notes)) {
      const note = value.notes.find(n => n.id === itemId);
      if (note) return note.title || itemId;
    }

    if (itemType === 'task' && Array.isArray(value.tasks)) {
      const task = value.tasks.find(t => t.id === itemId);
      if (task) return task.title || itemId;
    }
  }

  return (itemType === 'note' ? t('reminderTypeNote') : t('reminderTypeTask')) + ' ' + itemId;
}

function findReminderItem(itemId, itemType, data) {
  for (const [key, value] of Object.entries(data)) {
    if (!key.match(/^\d{4}-\d{2}-\d{2}$/) || !value) continue;

    if (itemType === 'note' && Array.isArray(value.notes)) {
      const note = value.notes.find(n => n.id === itemId);
      if (note) return { item: note, dateKey: key };
    }

    if (itemType === 'task' && Array.isArray(value.tasks)) {
      const task = value.tasks.find(t => t.id === itemId);
      if (task) return { item: task, dateKey: key };
    }
  }

  return { item: null, dateKey: formatDate(selectedDate) };
}

function plainTextFromHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html || '';
  div.querySelectorAll('img').forEach(img => {
    img.replaceWith(document.createTextNode('[image]'));
  });
  return div.innerText.trim();
}

function getDataUrlByteSize(dataUrl) {
  const base64 = String(dataUrl || '').split(',')[1] || '';
  return Math.ceil(base64.length * 3 / 4);
}

function extractReminderImagesFromHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html || '';
  const images = Array.from(div.querySelectorAll('img'))
    .map((img, index) => ({
      data_url: img.dataset.full || img.src,
      filename: `note-image-${index + 1}.png`
    }))
    .filter(image => image.data_url && image.data_url.startsWith('data:image/'));

  if (images.length > 10) {
    throw new Error(t('reminderTooManyImages'));
  }

  const maxImageBytes = 8 * 1024 * 1024;
  const maxTotalBytes = 20 * 1024 * 1024;
  const totalBytes = images.reduce((sum, image) => {
    const size = getDataUrlByteSize(image.data_url);
    if (size > maxImageBytes) {
      throw new Error(t('reminderImageTooLarge'));
    }
    return sum + size;
  }, 0);

  if (totalBytes > maxTotalBytes) {
    throw new Error(t('reminderImagesTooLarge'));
  }

  return images;
}

function buildReminderImages(itemId, itemType) {
  if (itemType !== 'note') return [];

  const dateKey = formatDate(selectedDate);
  const dateData = currentNotes[dateKey] || {};
  const { item } = findReminderItem(itemId, itemType, { [dateKey]: dateData });
  return item ? extractReminderImagesFromHtml(item.html) : [];
}

function buildReminderMessage(itemId, itemType, fallbackTitle) {
  const dateKey = formatDate(selectedDate);
  const dateData = currentNotes[dateKey] || {};
  const { item, dateKey: itemDateKey } = findReminderItem(itemId, itemType, { [dateKey]: dateData });
  const lines = [];

  if (itemType === 'note') {
    lines.push('🔔 ' + (currentLang === 'ru' ? 'Напоминание о заметке' : 'Note reminder'));
    lines.push((currentLang === 'ru' ? 'Дата: ' : 'Date: ') + itemDateKey);
    lines.push((currentLang === 'ru' ? 'Заголовок: ' : 'Title: ') + (item ? item.title : fallbackTitle));

    const noteText = item ? (item.text || plainTextFromHtml(item.html)) : '';
    if (noteText) {
      lines.push('');
      lines.push(currentLang === 'ru' ? 'Текст:' : 'Content:');
      lines.push(noteText);
    }
  } else {
    lines.push('🔔 ' + (currentLang === 'ru' ? 'Напоминание о задаче' : 'Task reminder'));
    lines.push((currentLang === 'ru' ? 'Дата: ' : 'Date: ') + itemDateKey);
    lines.push((currentLang === 'ru' ? 'Задача: ' : 'Task: ') + (item ? item.title : fallbackTitle));
    if (item) {
      lines.push((currentLang === 'ru' ? 'Статус: ' : 'Status: ') + (item.done ? (currentLang === 'ru' ? 'выполнена' : 'done') : (currentLang === 'ru' ? 'не выполнена' : 'not done')));

      if (Array.isArray(item.subtasks) && item.subtasks.length > 0) {
        lines.push('');
        lines.push(currentLang === 'ru' ? 'Подзадачи:' : 'Subtasks:');
        item.subtasks.forEach(st => {
          const mark = st.done ? '✅' : '⬜';
          lines.push(`${mark} ${st.text}`);
        });
      }
    }
  }

  return lines.join('\n');
}

function renderSavedReminders() {
  const listEl = document.getElementById('savedRemindersList');
  if (!listEl) return;

  getStoredReminders((reminders) => {
    listEl.innerHTML = '';

    if (reminders.length === 0) {
      listEl.innerHTML = `<div class="no-items"><p>${t('noReminders')}</p></div>`;
      return;
    }

    reminders.forEach((reminder) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'saved-reminder-item';
      const repeatLabel = getReminderRepeatLabel(reminder.repeat);
      itemEl.innerHTML = `
        <div>
          <div class="saved-reminder-title">${escapeHtml(reminder.message || reminder.title || '')}</div>
          <div class="saved-reminder-meta">${formatReminderDateTime(reminder.due_time)} · ${escapeHtml(reminder.item_type === 'note' ? t('reminderTypeNote') : reminder.item_type === 'task' ? t('reminderTypeTask') : reminder.item_type || '')}${repeatLabel ? ' · ' + escapeHtml(repeatLabel) : ''}</div>
        </div>
        <button class="delete-reminder-btn" data-id="${reminder.id}">${t('deleteReminder')}</button>
      `;

      itemEl.querySelector('.delete-reminder-btn').addEventListener('click', () => deleteStoredReminder(reminder.id));
      listEl.appendChild(itemEl);
    });
  });
}

function deleteStoredReminder(reminderId) {
  getStoredReminders((reminders) => {
    const reminder = reminders.find(item => item.id === reminderId);
    if (!reminder) return;

    chrome.storage.local.get('telegramWorkerUrl', async (data) => {
      try {
        if (reminder.workerKey && data.telegramWorkerUrl) {
          await sendReminderRequest(data.telegramWorkerUrl, '/delete-reminder', { key: reminder.workerKey });
        }

        const nextReminders = reminders.filter(item => item.id !== reminderId);
        saveStoredReminders(nextReminders, () => {
          renderSavedReminders();
          showNotification(t('reminderDeleted'));
        });
      } catch (error) {
        logger.error('Reminder delete failed', { error: error.message, reminderId });
        showNotification(error.message, 'error');
      }
    });
  });
}

function openReminderModal(itemId, itemType) {
  reminderItemId = itemId;
  reminderItemType = itemType;

  const reminderTime = new Date();
  reminderTime.setMinutes(reminderTime.getMinutes() + 30);

  chrome.storage.local.get(null, (data) => {
    const itemTitle = findItemTitle(itemId, itemType, data);

    applyI18n(document.getElementById('reminderModal'));
    document.getElementById('reminderTitle').value = currentLang === 'ru' ? '🔔 Напоминание: ' + itemTitle : '🔔 Reminder: ' + itemTitle;
    document.getElementById('reminderDate').value = reminderTime.toISOString().split('T')[0];
    document.getElementById('reminderTime').value = reminderTime.toTimeString().slice(0, 5);
    document.getElementById('reminderRepeatType').value = 'once';
    document.getElementById('reminderRepeatCount').value = '1';
    document.getElementById('reminderRepeatIntervalValue').value = '5';
    document.getElementById('reminderRepeatIntervalUnit').value = 'minutes';
    document.querySelectorAll('#reminderWeekdayOptions input[type="checkbox"]').forEach(input => {
      input.checked = input.value === String(reminderTime.getDay());
    });
    updateReminderRepeatControls();
    document.getElementById('reminderModal').classList.add('active');
  });
}

function closeReminderModal() {
  document.getElementById('reminderModal').classList.remove('active');
  reminderItemId = null;
  reminderItemType = null;
}

function saveReminder() {
  const title = document.getElementById('reminderTitle').value;
  const date = document.getElementById('reminderDate').value;
  const time = document.getElementById('reminderTime').value;
  const repeat = buildReminderRepeatConfig();
  let images = [];

  if (!title || !date || !time || (repeat.type === 'weekdays' && repeat.weekdays.length === 0)) {
    showNotification(t('fillAllFields'), 'error');
    return;
  }

  const dueTime = new Date(date + 'T' + time).toISOString();
  try {
    images = buildReminderImages(reminderItemId, reminderItemType);
  } catch (error) {
    showNotification(error.message, 'error');
    return;
  }

  chrome.storage.local.get(['telegramWorkerUrl', 'telegramChatId'], async (data) => {
    if (!data.telegramWorkerUrl || !data.telegramChatId) {
      showNotification(t('configureTelegram'), 'error');
      return;
    }

    const reminder = {
      id: generateId(),
      chat_id: data.telegramChatId,
      message: buildReminderMessage(reminderItemId, reminderItemType, title),
      title: title,
      due_time: dueTime,
      item_id: reminderItemId,
      item_type: reminderItemType,
      repeat: repeat,
      images: images
    };

    try {
      const result = await sendReminderRequest(data.telegramWorkerUrl, '/add-reminder', reminder);
      reminder.workerKey = result.key;
      addStoredReminder(reminder, () => {
        renderSavedReminders();
        showNotification(t('reminderSaved'), 'success');
        closeReminderModal();
      });
    } catch (error) {
      logger.error('Reminder save failed', { error: error.message });
      showNotification(error.message, 'error');
    }
  });
}

function handleReminderButtonClick(e) {
  const noteBtn = e.target.closest('.reminder-note-btn');
  const taskBtn = e.target.closest('.reminder-task-btn');

  if (noteBtn) {
    e.stopPropagation();
    e.preventDefault();
    openReminderModal(noteBtn.dataset.id, 'note');
    return;
  }

  if (taskBtn) {
    e.stopPropagation();
    e.preventDefault();
    openReminderModal(taskBtn.dataset.id, 'task');
  }
}

document.addEventListener('click', handleReminderButtonClick, true);

const closeReminderBtn = document.getElementById('closeReminderBtn');
if (closeReminderBtn) closeReminderBtn.addEventListener('click', closeReminderModal);

const cancelReminderBtn = document.getElementById('cancelReminderBtn');
if (cancelReminderBtn) cancelReminderBtn.addEventListener('click', closeReminderModal);

const saveReminderBtn = document.getElementById('saveReminderBtn');
if (saveReminderBtn) saveReminderBtn.addEventListener('click', saveReminder);

const reminderRepeatType = document.getElementById('reminderRepeatType');
if (reminderRepeatType) reminderRepeatType.addEventListener('change', updateReminderRepeatControls);
