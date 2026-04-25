// Logger System
class Logger {
  constructor(storageKey = 'extension_logs') {
    this.storageKey = storageKey;
    this.maxLogs = 500;
  }

  log(message, type = 'info', data = null) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: type,
      message: message,
      data: data
    };

    chrome.storage.local.get(this.storageKey, (result) => {
      let logs = result[this.storageKey] || [];
      logs.unshift(logEntry);
      if (logs.length > this.maxLogs) {
        logs = logs.slice(0, this.maxLogs);
      }
      chrome.storage.local.set({ [this.storageKey]: logs }, () => {
        if (chrome.runtime.lastError) {
          console.error('[Logger] Failed to save log:', chrome.runtime.lastError);
        }
      });
    });

    const consoleMsg = `[${type.toUpperCase()}] ${message}`;
    if (data) {
      console[LogLevel[type] === 'error' ? 'error' : 'log'](consoleMsg, data);
    } else {
      console[LogLevel[type] === 'error' ? 'error' : 'log'](consoleMsg);
    }
  }

  info(message, data) { this.log(message, 'info', data); }
  warn(message, data) { this.log(message, 'warn', data); }
  error(message, data) { this.log(message, 'error', data); }
  debug(message, data) { this.log(message, 'debug', data); }

  getLogs(callback) {
    chrome.storage.local.get(this.storageKey, (result) => {
      callback(result[this.storageKey] || []);
    });
  }

  clearLogs(callback) {
    chrome.storage.local.remove(this.storageKey, () => {
      this.log('Logs cleared', 'info');
      if (callback) callback();
    });
  }

  archiveLogs(callback) {
    this.getLogs((logs) => {
      if (logs.length === 0) {
        if (callback) callback(null);
        return;
      }

      const archiveName = `papa_calendaries_notes_logs_${formatArchiveDate(new Date())}.json`;
      const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = archiveName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.log(`Logs archived: ${archiveName}`, 'info', { count: logs.length });
      if (callback) callback(archiveName);
    });
  }
}

const LogLevel = { info: 'info', warn: 'warn', error: 'error', debug: 'debug' };
const logger = new Logger();

// Format date for archive filename
function formatArchiveDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const mins = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}_${hours}-${mins}`;
}

// Backup System
class BackupSystem {
  constructor() {
    this.backupPrefix = 'backup_';
  }

  createBackup(callback) {
    chrome.storage.local.get(null, (data) => {
      const backup = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        type: 'full_backup',
        data: data
      };

      const backupKey = this.backupPrefix + formatArchiveDate(new Date());
      chrome.storage.local.set({ [backupKey]: backup }, () => {
        logger.info('Backup created', { key: backupKey });
        if (callback) callback(backupKey);
      });
    });
  }

  restoreBackup(backupKey, callback) {
    chrome.storage.local.get(backupKey, (result) => {
      if (result[backupKey]) {
        const backup = result[backupKey];
        chrome.storage.local.set(backup.data, () => {
          logger.info('Backup restored', { key: backupKey });
          if (callback) callback(true);
        });
      } else {
        logger.error('Backup not found', { key: backupKey });
        if (callback) callback(false);
      }
    });
  }

  listBackups(callback) {
    chrome.storage.local.get(null, (data) => {
      const backups = Object.keys(data)
        .filter(key => key.startsWith(this.backupPrefix))
        .map(key => ({
          key: key,
          timestamp: data[key].timestamp,
          entryCount: Object.keys(data[key].data).filter(k => k.match(/^\d{4}-\d{2}-\d{2}$/)).length
        }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      if (callback) callback(backups);
    });
  }
}

const backupSystem = new BackupSystem();