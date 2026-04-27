# 📋 Project Rules

## 🔄 Versioning Rules

### Version Format
- Format: `MAJOR.MINOR.PATCH` (e.g., `1.0.4`)
- **MAJOR** - breaking changes
- **MINOR** - new features (backward compatible)
- **PATCH** - bug fixes

### Version Update Triggers
Version must be updated when:
1. Adding new features
2. Fixing bugs
3. Changing UI/UX
4. Modifying functionality
5. Updating dependencies
6. Any code change that affects users

### Version History Update
Before any code change:
1. Create backup in `backups/backup_YYYY-MM-DD_HH-MM/`
2. Update `VERSION_HISTORY` in script.js (do NOT delete old entries)
3. Update `APP_VERSION` variable
4. Add new version entry with:
   - New version number
   - Current date (YYYY-MM-DD)
   - List of changes

### Version Display
- Pressing "i" button shows full version history
- History is stored in `VERSION_HISTORY` object (script.js)
- Supported languages: EN/RU

### README Update
- ALWAYS update README.md when adding/removing features
- Keep Features section up to date with current functionality
- Update installation instructions if changed
- Update project structure if files change

## ⬆️ GitHub Push Rules

### Push to GitHub
- **NEVER push to GitHub automatically**
- **Only push when explicitly requested** by user
- Wait for explicit command like "запуш", "push", "залей на гитхаб"

### Release Checklist
- [ ] Update APP_VERSION
- [ ] Add entry to VERSION_HISTORY.en
- [ ] Add entry to VERSION_HISTORY.ru
- [ ] Update manifest.json version
- [ ] Test functionality
- [ ] Create backup before push

## 📝 Logging Rules

### Required Logging
- **ALL new features MUST have logging** using the `logger` object
- Use `logger.info()`, `logger.warn()`, `logger.error()`, `logger.debug()`
- Log: function entry, important actions, data changes, errors

### Log Example
```javascript
function myFunction(param) {
  logger.info('myFunction called', { param });
  // ... code ...
  logger.info('myFunction completed', { result });
}
```

### Log Export
- Logs are stored in Chrome Storage
- Export via: Settings → Export Logs (archiveLogs)
- Logs saved as JSON file for debugging