let limits = {};
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      chrome.storage.sync.set({limits: request}, function() {
      });
      sendResponse({messageReceived: "limits saved"});
  }
);
