let onward = document.getElementById('onward');
let limits = {};

window.onload = () => {
  chrome.storage.sync.get('limits', function(data) {
    limits = data.limits;
    for (let limit in limits) {
      console.log("limit " + limit + " and limits[limit] " + limits[limit]);
      document.getElementById(limit).value = limits[limit];
    }
  });
}




onward.onclick = function(element) {
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
  });
};
