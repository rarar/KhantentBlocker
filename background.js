const facebookRegex = new RegExp("(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/?");

// When the extension is installed do this
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.get('limits', function(data) {
    limits = data;
    console.log("limits are " + JSON.stringify(limits));
  });

  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tab) {
    console.log(tab[0].url);
  });
});

// Every time the user updates limits or takes action on the popup
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    chrome.storage.sync.set({
      limits: request
    }, function() {
      console.log("request is " + JSON.stringify(request));
      limits = request;
      console.log("limits are " + JSON.stringify(request));
    });
    sendResponse({
      messageReceived: "limits saved"
    });
  }
);

// Every time the user switches tabs
chrome.tabs.onSelectionChanged.addListener(function() {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tab) {
    console.log("onSelectionChanged:: " + tab[0].url);
    let redirect = checkUrl(tab[0].url, 0)
  });
})

chrome.tabs.onUpdated.addListener(function() {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tab) {
    console.log("onUpdated:: " + tab[0].url);
    let limitReached = checkUrl(tab[0].url, 0, "facebook");
    console.log("limitReached = " + limitReached);
    if (limitReached) {
      console.log("LIMIT REACHED!");;
      chrome.tabs.update(tab[0].id, {
        url: getRandomContent()
      });
    }
  });
})

// Check the current URL against the set up limits
function checkUrl(url, limit, socialNetwork) {
  let reachedLimit = false;
  switch (socialNetwork) {
    case "facebook":
      reachedLimit = ((facebookRegex.test(url) == true) && (limit <= 0)) ? true : false;
      break;
    default:
      reachedLimit = false;
  }
  return reachedLimit;
}

function getRandomContent() {
  return "http://khanacademy.org";
}
