let limits = {};
chrome.runtime.onInstalled.addListener(function() {
   chrome.storage.sync.get('limits', function(data) {
     limits = data;
     console.log("limits are " + JSON.stringify(limits));
   });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      chrome.storage.sync.set({limits: request}, function() {
        console.log("request is " + JSON.stringify(request));
        limits = request;
        console.log("limits are " + JSON.stringify(request));
      });
      sendResponse({messageReceived: "limits saved"});
  }
);
