console.log('Background script loaded');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);

  if (message.type === 'fetch') {
    fetch(message.url, message.options)
      .then(response => {
        console.log('Fetch response status:', response.status);
        return response.text();
      })
      .then(text => {
        console.log('Fetch response text:', text);
        sendResponse({ success: true, text: text });
      })
      .catch(error => {
        console.log('Fetch error:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
});