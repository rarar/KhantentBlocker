chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({
    color: '#3aa757'
  }, function() {
    console.log('The color is green.');
  });
});

chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {
      "message": "clicked_browser_action"
    });
  });
});

// This block is new!
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "open_new_tab") {
      chrome.tabs.create({
        "url": request.url
      });
    }
  }
);
