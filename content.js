let onward = document.getElementById('onward');

onward.onclick = function(element) {
  let facebook = document.getElementById('facebook').value;
  console.log("facebook time limit = " + facebook);
  let twitter = document.getElementById('twitter').value;
  console.log("twitter time limit = " + twitter);
  let instagram = document.getElementById('instagram').value;
  console.log("instagram time limit = " + instagram);
  let youtube = document.getElementById('youtube').value;
  console.log("youtube time limit = " + youtube);
  let linkedin = document.getElementById('linkedin').value;
  console.log("linkedin time limit = " + linkedin);
  let reddit = document.getElementById('reddit').value;
  console.log("reddit time limit = " + reddit);
  // send message to background script
  chrome.runtime.sendMessage({
    facebook_limit: facebook
  }, function(response) {
    console.log(response.farewell);
  });
};
