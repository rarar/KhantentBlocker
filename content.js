let onward;
let limits = {};
let fbcb, fbTextLimit, twcb, twTextLimit, igcb, igTextLimit, ytcb, ytTextLimit, licb, liTextLimit, redcb, redTextLimit;
let displayTimerInterval;
let editMode = false;

window.addEventListener('load', () => {
  chrome.storage.sync.get('limits', (data) => {
    limits = data.limits;

    for (let limit in limits) {
      console.log("limit " + limit + " and limits[limit] " + limits[limit]);
      document.getElementById(limit).value = limits[limit];
    }

    let isEmpty = Object.values(limits).every(x => (x === null || x === ''));
    console.log("is limits empty? " + isEmpty);
    onward = document.getElementById('onward');
    onward.addEventListener("click", sendLimitsToBackground);

    if (isEmpty) {
      // Object is empty (Would return true in this example)
      editMode = false;
      console.log("edit mode should be OFF!");
    } else {
      // Object is NOT empty
      editMode = true;
      console.log("edit mode should be ON!");
      showLimitsSetMode();
    }
  });

});

function sendLimitsToBackground() {
  let facebook_limit = document.getElementById('facebook').value;
  console.log("facebook time limit = " + facebook_limit);
  let twitter_limit = document.getElementById('twitter').value;
  console.log("twitter time limit = " + twitter_limit);
  let instagram_limit = document.getElementById('instagram').value;
  console.log("instagram time limit = " + instagram_limit);
  let youtube_limit = document.getElementById('youtube').value;
  console.log("youtube time limit = " + youtube_limit);
  let linkedin_limit = document.getElementById('linkedin').value;
  console.log("linkedin time limit = " + linkedin_limit);
  let reddit_limit = document.getElementById('reddit').value;
  console.log("reddit time limit = " + reddit_limit);
  // send message to background script
  chrome.runtime.sendMessage({
    facebook: facebook_limit,
    twitter: twitter_limit,
    instagram: instagram_limit,
    youtube: youtube_limit,
    linkedin: linkedin_limit,
    reddit: reddit_limit
  }, function(response) {
    console.log(response);
    showLimitsSetMode();
  });
};

function showLimitsSetMode() {
  onward.removeEventListener("click", sendLimitsToBackground);
  // Swap facebook combobox
  fbcb = document.getElementById('facebook');
  fbTextLimit = document.createElement('span');
  // fbTextLimit.innerHTML = cleanValue(fbcb.value);
  fbcb.parentNode.replaceChild(fbTextLimit, fbcb);
  // Swap twitter combobox
  twcb = document.getElementById('twitter');
  twTextLimit = document.createElement('span');
  twTextLimit.innerHTML = cleanValue(twcb.value);
  twcb.parentNode.replaceChild(twTextLimit, twcb);
  // Swap instagram combobox
  igcb = document.getElementById('instagram');
  igTextLimit = document.createElement('span');
  igTextLimit.innerHTML = cleanValue(igcb.value);
  igcb.parentNode.replaceChild(igTextLimit, igcb);
  // Swap youtube combobox
  ytcb = document.getElementById('youtube');
  ytTextLimit = document.createElement('span');
  ytTextLimit.innerHTML = cleanValue(ytcb.value);
  ytcb.parentNode.replaceChild(ytTextLimit, ytcb);
  // Swap linkedin combobox
  licb = document.getElementById('linkedin');
  liTextLimit = document.createElement('span');
  liTextLimit.innerHTML = cleanValue(licb.value);
  licb.parentNode.replaceChild(liTextLimit, licb);
  // Swap reddit combobox
  redcb = document.getElementById('reddit');
  redTextLimit = document.createElement('span');
  redTextLimit.innerHTML = cleanValue(redcb.value);
  redcb.parentNode.replaceChild(redTextLimit, redcb);

  // Update button
  onward.innerHTML = "Edit my limits";
  onward.addEventListener("click", editLimits);

  // Display countdown
  // TO DO GET MOST RECENT TIME
  displayTimerInterval = setInterval(() => {
    console.log(cleanValue(limits["facebook"]));
    chrome.storage.sync.get('limits', function(data) {
      limits = data.limits;
      console.log("limits['facebook'] = " + limits["facebook"]);
      fbTextLimit.innerHTML = cleanValue(limits["facebook"]);
    });
  }, 1000);
}

function editLimits() {
  onward.removeEventListener("click", editLimits);
  fbTextLimit.parentNode.replaceChild(fbcb, fbTextLimit);
  fbcb.value = "";

  twTextLimit.parentNode.replaceChild(twcb, twTextLimit);
  twcb.value = "";

  igTextLimit.parentNode.replaceChild(igcb, igTextLimit);
  igcb.value = "";

  ytTextLimit.parentNode.replaceChild(ytcb, ytTextLimit);
  ytcb.value = "";

  liTextLimit.parentNode.replaceChild(licb, liTextLimit);
  licb.value = "";

  redTextLimit.parentNode.replaceChild(redcb, redTextLimit);
  redcb.value = "";

  // Update button
  onward.innerHTML = "Onward!";
  onward.addEventListener("click", sendLimitsToBackground);

}

/* ============================================================
 *  ============================================================
 *  ===================== Helper Functions =====================
 *  ============================================================
 *  ============================================================
 */

function cleanValue(duration) {
  let milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + " left";
}
// This makes the text look all nice
function altCleanValue(textToClean) {
  console.log("textToClean = " + textToClean);
  let prettyText = "";

  switch (true) {
    case (textToClean === 0):
      prettyText = '<span style="color:#1865F2;">Khantent only!</span>';
      break;
    case (textToClean < 3600000 && textToClean > 0):
      prettyText += textToClean + " min";
      break;
    case (textToClean >= 3600000 && textToClean < 7200000):
      prettyText = "1 hr";
      break;
    case (textToClean >= 7200000 && textToClean < 10800000):
      prettyText = "2 hrs";
      break;
    case (textToClean >= 10800000):
      prettyText = "3 hrs";
      break;
    default:
      prettyText = '<span style="color:rgba(33, 36, 44, 0.64);font-style:italic;font-weight:400;">No limit set</span>';
      break;
  }

  if (textToClean % 60 > 0 && textToClean > 60) {
    prettyText += " and " + (textToClean % 60) + " min";
  }

  if (prettyText != '<span style="color:rgba(33, 36, 44, 0.64);font-style:italic;font-weight:400;">No limit set</span>') {
    prettyText += " left";
  }

  return prettyText;
}
