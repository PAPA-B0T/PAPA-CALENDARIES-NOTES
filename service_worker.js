chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-side-panel') {
    chrome.sidePanel.show();
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.show({ tabId: tab.id });
});