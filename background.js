
// Listen for button click
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      console.log(request.facebook_limit);
      //sendResponse({farewell: "goodbye"});
  }
);
