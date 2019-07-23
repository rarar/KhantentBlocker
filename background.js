const facebookRegex = new RegExp("(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/?");
const twitterRegex = new RegExp("(?:(?:http|https):\/\/)?(?:www.)?twitter.com\/?");
const instagramRegex = new RegExp("(?:(?:http|https):\/\/)?(?:www.)?instagram.com\/?");
const youtubeRegex = new RegExp("(?:(?:http|https):\/\/)?(?:www.)?youtube.com\/?");
const linkedinRegex = new RegExp("(?:(?:http|https):\/\/)?(?:www.)?linkedin.com\/?");
const redditRegex = new RegExp("(?:(?:http|https):\/\/)?(?:www.)?reddit.com\/?");

let facebookOff = false;
let twitterOff = false;
let instagramOff = false;
let youtubeOff = false;
let linkedinOff = false;
let redditOff = false;

let isFacebookURL = false;
let isTwitterURL = false;
let isInstagramURL = false;
let isYoutubeURL = false;
let isLinkedinURL = false;
let isRedditURL = false;

let facebookTimeInterval, facebookCountdown;

// let timeIntervals = {
//   facebook: facebookTimeInterval,
//   twitter: twitterTimeInterval,
//   instagram: instagramTimeInterval,
//   youtube: youtubeTimeInterval,
//   linkedin: linkedinTimeInterval,
//   reddit: redditTimeInterval
// };
//
// let countdowns = {
//   facebook: facebookCountdown,
//   twitter: twitterCountdown,
//   instagram: instagramCountdown,
//   youtube: youtubeCountdown,
//   linkedin: linkedinCountdown,
//   reddit: redditCountdown
// };

let limits, editMode = false;

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
      limits = request;
      //console.log("limits are " + JSON.stringify(request));
      setTimers(limits);
    });
    sendResponse({
      messageReceived: "limits saved"
    });
  }
);

// Set up timers here
function setTimers(limits) {
  // UPDATE THIS!
  // for (let limit in limits) {
  //   if (limits[limit]==null) retun;
  // }


  console.log("setTimers:: " + limits["facebook"]);
  if (limits["facebook"]==null) return;
  clearInterval(facebookTimeInterval);
  facebookCountdown = ()=>{
    if (isFacebookURL) {
      limits["facebook"] -= 1000;
      if (limits["facebook"] <= 0) {
        clearInterval(facebookTimeInterval);
        limits["facebook"] = -1;
        facebookOff = true;
      }
    }
    chrome.storage.sync.set({limits: limits}, ()=>{
      console.log("facebook time remaining = " + limits["facebook"]);
    })
  };
}

// Every time the user switches tabs
chrome.tabs.onSelectionChanged.addListener(function() {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tab) {
    console.log("onSelectionChanged:: " + tab[0].url);
    isFacebookURL = checkUrl(tab[0].url, 0, "facebook");
    startAndStopTimers();
    if (isFacebookURL && facebookOff) {
      console.log("You're on facebook and your time is up!");;
      chrome.tabs.update(tab[0].id, {
        url: getRandomContent()
      });
    }
  });
})

chrome.tabs.onUpdated.addListener(function() {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tab) {
    console.log("onUpdated:: " + tab[0].url);
    isFacebookURL = checkUrl(tab[0].url, 0, "facebook");
    if (isFacebookURL && facebookOff) {
      console.log("You're on facebook and your time is up!");;
      chrome.tabs.update(tab[0].id, {
        url: getRandomContent()
      });
    } else {
        startAndStopTimers();
    }
  });
});

function startAndStopTimers() {
  clearInterval(facebookTimeInterval);
  if (isFacebookURL && !facebookOff) {
    facebookTimeInterval = setInterval(facebookCountdown, 1000);
  }
}

// Check the current URL against the set up limits
function checkUrl(url, limit, socialNetwork) {
  let reachedLimit = false;
  switch (socialNetwork) {
    case "facebook":
      reachedLimit = ((facebookRegex.test(url) == true) && (limit <= 0)) ? true : false;
      console.log("limit reached = " + reachedLimit);
      break;
    default:
      reachedLimit = false;
  }
  return reachedLimit;
}

function getRandomContent() {
  return "http://khanacademy.org";
}
