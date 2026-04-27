const editorView = document.getElementById('editorView');
const calendarView = document.getElementById('calendarView');
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
const infoButton = document.getElementById('infoButton');
const infoModal = document.getElementById('infoModal');
const closeInfoBtn = document.getElementById('closeInfoBtn');
const versionHistory = document.getElementById('versionHistory');

const APP_VERSION = '1.0.5';
const VERSION_HISTORY = {
  en: [
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
    titleInfo: 'About',
    aboutTitle: 'About Extension ' + APP_VERSION,
    versionLabel: 'Version',
    imported: 'Data imported and merged',
    versionDate: 'Release date',
    featuresLabel: 'Features',
    moveUp: 'Move up',
    moveDown: 'Move down',
    moveToDate: 'Move to date',
    selectDate: 'Select date',
    noteMoved: 'Note moved',
    noteMovedUp: 'Note moved up',
    noteMovedDown: 'Note moved down',
    cannotMoveUp: 'Cannot move up',
    cannotMoveDown: 'Cannot move down',
    cancelDate: 'Cancel'
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
    titleInfo: 'О расширении',
    aboutTitle: 'О расширении ' + APP_VERSION,
    versionLabel: 'Версия',
    imported: 'Данные импортированы и объединены',
    versionDate: 'Дата выпуска',
    featuresLabel: 'Возможности',
    moveUp: 'Переместить вверх',
    moveDown: 'Переместить вниз',
    moveToDate: 'Перенести на дату',
    selectDate: 'Выберите дату',
    noteMoved: 'Заметка перенесена',
    noteMovedUp: 'Заметка перемещена вверх',
    noteMovedDown: 'Заметка перемещена вниз',
    cannotMoveUp: 'Нельзя переместить вверх',
    cannotMoveDown: 'Нельзя переместить вниз',
    cancelDate: 'Отмена'
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

function setLanguage(lang) {
  currentLang = lang;
  document.getElementById('langEN').classList.toggle('active', lang === 'en');
  document.getElementById('langRU').classList.toggle('active', lang === 'ru');

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
  document.getElementById('infoButton').title = t('titleInfo');
  document.getElementById('donationTitle').textContent = t('donationTitle');
  document.getElementById('infoTitle').textContent = t('aboutTitle');

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
  addImageBtn.querySelector('span').textContent = t('addImage');
  deleteNoteBtn.textContent = t('delete');
  cancelNoteBtn.textContent = t('cancel');
  saveNoteBtn.textContent = t('save');
  addNoteBtn.querySelector('span').textContent = t('addNote');

  const placeholder = currentLang === 'ru' ? t('noteContentPlaceholderRu') : t('noteContentPlaceholder');
  noteContentInput.setAttribute('data-placeholder', placeholder);

  updateNotesListDisplay();
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
  loadNotesForDate(formatDate(selectedDate));
  updateCalendar();

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

    noteEl.innerHTML = `
      <div class="note-title" style="${titleColorStyle}">${escapeHtml(note.title || t('addNote'))}</div>
      <div class="note-preview">${escapeHtml(previewText)}</div>
      <div class="note-meta">
        <span class="note-time">${timeStr}</span>
        ${hasImages ? `<span class="note-images-count">🖼️</span>` : ''}
      </div>
      <div class="note-actions">
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
      notesData.notes[noteIndex] = {
        ...notesData.notes[noteIndex],
        title,
        html,
        text,
        priority: currentNotePriority,
        titleColor: currentTitleColor,
        modified: new Date().toISOString()
      };
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
    showNotification(t('noteSaved'));
    logger.info('Note saved', { date: dateKey, noteId: editingNoteId });
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
      dayElement.appendChild(noteIndicator);
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
  setTimeout(() => {
    editorView.classList.add('active');
    updateSelectedDateDisplay();
  }, 50);
}

function switchToCalendar() {
  logView.classList.remove('active');
  editorView.classList.remove('active');
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
                  const newNote = { ...importedNote };
                  if (!newNote.id) {
                    newNote.id = generateId();
                  }
                  mergedData[dateKey].notes.push(newNote);
                }
              }
              
              if (importedValue.priority) {
                mergedData[dateKey].priority = importedValue.priority;
              }
            }
            
            chrome.storage.local.set(mergedData, () => {
              currentNotes = mergedData;
              updateCalendar();
              loadNotesForDate(formatDate(selectedDate));
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