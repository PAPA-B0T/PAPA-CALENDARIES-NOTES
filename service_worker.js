chrome.sidePanel
  .setOptions({ path: 'sidepanel.html' })
  .then(() => console.log('Side panel path set'));

chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-side-panel') {
    chrome.sidePanel.setOptions({ path: 'sidepanel.html' })
      .then(() => {
        chrome.sidePanel.show();
      });
  }
});

chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.sidePanel.setOptions({ path: 'sidepanel.html' })
      .then(() => {
        chrome.sidePanel.show({ tabId: tab.id });
      });
  }
});