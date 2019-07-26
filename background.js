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

let facebookTimeInterval, facebookCountdown, twitterTimeInterval, twitterCountdown, instagramTimeInterval, instagramCountdown, youtubeTimeInterval, youtubeCountdown, linkedinTimeInterval, linkedinCountdown, redditTimeInterval, redditCountdown;

let regexes = {
  facebook: facebookRegex,
  twitter: twitterRegex,
  instagram: instagramRegex,
  youtube: youtubeRegex,
  linkedin: linkedinRegex,
  reddit: redditRegex
}

let timers = {
  facebook: facebookTimeInterval,
  twitter: twitterTimeInterval,
  instagram: instagramTimeInterval,
  youtube: youtubeTimeInterval,
  linkedin: linkedinTimeInterval,
  reddit: redditTimeInterval
}

let countdowns = {
  facebook: facebookCountdown,
  twitter: twitterCountdown,
  instagram: instagramCountdown,
  youtube: youtubeCountdown,
  linkedin: linkedinCountdown,
  reddit: redditCountdown
}

let urlChecks = {
  facebook: isFacebookURL,
  twitter: isTwitterURL,
  instagram: isInstagramURL,
  youtube: isYoutubeURL,
  linkedin: isLinkedinURL,
  reddit: isRedditURL
}

let limitChecks = {
  facebook: facebookOff,
  twitter: twitterOff,
  instagram: instagramOff,
  youtube: youtubeOff,
  linkedin: linkedinOff,
  reddit: redditOff
}

let limits, editMode = false;

// When the extension is installed do this
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.get('limits', function(data) {
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
    chrome.storage.local.set({
      limits: request
    }, function() {
      limits = request;
      setTimers(limits);
    });
    sendResponse({
      messageReceived: "limits saved"
    });
  }
);

// Set up timers here
function setTimers(limits) {
  console.log("setting timers");
  for (let limit in limits) {
    if (limits[limit] == null) continue;
    clearInterval(timers[limit]);
    countdowns[limit] = () => {
      if (urlChecks[limit]) {
        limits[limit] -= 1000;
        console.log("remaining time on " + limit + " = " + limits[limit]);
        if (limits[limit] <= 0) {
          clearInterval(timers[limit]);
          limits[limit] = -1;
          limitChecks[limit] = true;
        }
      }
      chrome.storage.local.set({
        limits: limits
      }, () => {
        console.log(limit + " time remaining = " + limits[limit]);
      })
    }
  }


};

// Every time the user switches tabs
chrome.tabs.onActivated.addListener(function() {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tab) {
    console.log("onActivated:: " + tab[0].url);
    for (let limit in limits) {
      urlChecks[limit] = regexes[limit].test(tab[0].url);
      clearInterval(timers[limit]);
      if (urlChecks[limit] && !limitChecks[limit]) {
        console.log("setting interval for " + limit);
        timers[limit] = setInterval(countdowns[limit], 1000);
      }
    }

  });
})

// Every time a tab updates
chrome.tabs.onUpdated.addListener(function() {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tab) {
    console.log("onUpdated:: " + tab[0].url);
    for (let limit in limits) {
      //urlChecks[limit] = checkUrl(tab[0].url, limits[limit], limit);
      urlChecks[limit] = regexes[limit].test(tab[0].url);
      if (urlChecks[limit] && limitChecks[limit]) {
        console.log("You're on " + limit + " and your time is up!");
        chrome.tabs.update(tab[0].id, {
          url: getRandomContent()
        });
      } else {
        clearInterval(timers[limit]);
        if (urlChecks[limit] && !limitChecks[limit]) {
          console.log("we're setting the timer for " + limit);
          timers[limit] = setInterval(countdowns[limit], 1000);
        }
      }
    }
  });
});

function getRandomContent() {
  return "http://khanacademy.org";
}
