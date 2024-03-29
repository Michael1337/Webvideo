let autoplay = false;
let autoplayTxt = '<span class="glyphicon glyphicon-play" aria-hidden="true"></span> Autoplay an';
let light = true;
let lightTxt = '<span class="glyphicon glyphicon-off" aria-hidden="true"></span> Licht aus';
let left = false;
let language = false;
let speed = 1.0;
let skip = 0;
const jsonData = JSON.parse(data);

$(document).ready(function () {
  prepareSeasonTabs(jsonData);
  prepareEpisodeButtons(jsonData);
  initializeTabs();
});

function prepareSeasonTabs(jsonData) {
  let tabsString = "";
  for (let season_id = 0; season_id < jsonData.length; season_id++) {
    //season_id < 9 ? tabsNumber = '0' + (season_id + 1) : tabsNumber = (season_id + 1);
    tabsString += '<li id="tab' + season_id + '" title="' + jsonData[season_id].name + '" class="tab-link" data-tab="tab-' + season_id + '">' + (season_id + 1) + '</li>';
  }
  $("#tabs").append(tabsString);
}

function prepareEpisodeButtons(jsonData) {
  const episodes_counts = [];
  for (let episode_id = 0; episode_id < jsonData.length; episode_id++) {
    episodes_counts.push([jsonData[episode_id].episoden.length]);
  }

  let episodesString = "";
  for (let i = 0; i < jsonData.length; i++) {
    episodesString += '<div id="tab-' + (i) + '" class="tab-content"><p class="tab-season-title">' + jsonData[i].name + '</p>';
    for (let j = 0; j < episodes_counts[i]; j++) {
      episodesString += '<button title="' + jsonData[i].episoden[j].title + '" id="' + (i + 1) + '-' + (j + 1) + '" class="btn-default episoden-btn" onclick="clickBtn(' + (i + 1) + ',' + (j + 1) + ')">' + (j + 1) + '</button>';
    }
    episodesString += '</div>';
  }
  $("#tabsEpisodes").append(episodesString);
}

function initializeTabs() {
  showVideo(1, 1);
  $('ul.tabs li').first().addClass("current");
  $('#tab-0').addClass("current");
  $('.episoden-btn').first().addClass("current");
}

function clickBtn(idS, idE) {
  // switch tab, highlight button, show video
  $('ul.tabs li').removeClass('current');
  $("#tab" + (idS - 1)).addClass('current');
  $('.tab-content').removeClass('current');
  $("#tab-" + (idS - 1)).addClass('current');
  $('.episoden-btn').removeClass('current');
  $('#' + idS + '-' + idE).addClass('current');
  showVideo(idS, idE);
}

function showVideo(idS, idE) {
  let srcString;
  let titleData;
  let title;
  let found = false;

  for (let i = 0; i < jsonData.length; i++) {
    for (let j = 0; j < jsonData[i].episoden.length; j++) {
      if (jsonData[i].id === idS && jsonData[i].episoden[j].id === idE) {
        srcString = rootPath + "/" + jsonData[i].name + "/" + jsonData[i].episoden[j].title + "." + jsonData[i].episoden[j].fileextension;
        titleData = "Staffel: " + jsonData[i].name + " | Episode: " + jsonData[i].episoden[j].id + " | " + jsonData[i].episoden[j].idb;
        title = jsonData[i].episoden[j].title;
        found = true;
        if (found) break;
      }
    }
    if (found) break;
  }
  if (!found) {
    if (idE === 0) {
      // instead of episode 0 of current season, show last episode of previous season
      if (idS > 1) {
        idS = idS - 1;
      }
      idE = jsonData[idS - 1].episoden.length;
      clickBtn(idS, idE);
      return;
    } else if (idS === 0) {
      // instead of season 0, show season 1
      idS = 1;
      clickBtn(idS, idE);
      return;
    } else if (idS > jsonData.length) {
      // if there are not more seasons, show episode 1 of last season
      idS = jsonData.length;
      idE = 1;
      clickBtn(idS, idE);
      return;
    } else {
      // if there are no more episodes in current season, show first episode of next season
      idS = idS + 1;
      idE = 1;
      clickBtn(idS, idE);
      return;
    }

  }

  $("#title").html(titleData + '<br>' + title);
  $("#video-container").html('<video id="video" class="ep-video" src="' + srcString + '" type="video/mp4" controls></video>');


  $("#controls").html('<div class="form-inline">' +
    '<button id="leftSwitch" onclick="toggleLeft()" class="pull-left btn btn-default btn-sm"><span class="glyphicon glyphicon-chevron-' + (left ? "right" : "left") + '" aria-hidden="true"></span></button>' +
    '<button id="switchLight" onclick="toggleLight()" class="btn btn-default btn-sm btn-switchLight">' + lightTxt + '</button>' +
    '<div class="btn-group"><button onclick="clickBtn(' + (idS - 1) + ',' + (1) + ')" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-fast-backward" aria-hidden="true"></span> Vorige Staffel</button>' +
    '<button onclick="clickBtn(' + idS + ',' + (idE - 1) + ')" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-step-backward" aria-hidden="true"></span> Voriges Video</button>' +
    '<button id="ne" onclick="clickBtn(' + idS + ',' + (idE + 1) + ')" class="btn btn-default btn-sm">Nächstes Video <span class="glyphicon glyphicon-step-forward" aria-hidden="true"></span></button>' +
    '<button onclick="clickBtn(' + (idS + 1) + ',' + (1) + ')" class="btn btn-default btn-sm">Nächste Staffel <span class="glyphicon glyphicon-fast-forward" aria-hidden="true"></span></button></div>' +
    '<button id="toggleAutoplayBtn" onclick="toggleAutoplay()" class="btn btn-default btn-sm btn-autoplay">' + autoplayTxt + '</button>' +
    '<div class="input-group"><span class="input-group-addon">Speed</span><select id="selectSpeed" onchange="changeSpeed(this.value)" class="form-control select">' +
    '<option value="3.0" ' + (speed === 3.0 ? 'selected="selected"' : '') + '>3.0</option>' +
    '<option value="2.0" ' + (speed === 3.0 ? 'selected="selected"' : '') + '>2.0</option>' +
    '<option value="1.5" ' + (speed === 1.5 ? 'selected="selected"' : '') + '>1.5</option>' +
    '<option value="1.25" ' + (speed === 1.25 ? 'selected="selected"' : '') + '>1.25</option>' +
    '<option value="1.0" ' + (speed === 1.0 ? 'selected="selected"' : '') + '>1.0</option>' +
    '<option value="0.5" ' + (speed === 0.5 ? 'selected="selected"' : '') + '>0.5</option>' +
    '</select></div>' +
    '<div class="input-group"><span class="input-group-addon">Speed</span><input class="form-control skip" type="number" id="skip" value="' + skip + '" onchange="changeSkipSeconds()"></div>' +
    '</div>'
  );

  const video = document.getElementById("video");

  video.addEventListener('loadeddata', function () {
    if (autoplay) video.play();
    //if (autoplay) skip a portion
    changeSpeed(speed);
    skipTime(video, skip);

    // TODO this only needs to be done once per page load I guess
    if (typeof video.audioTracks == 'undefined') {
      document.getElementById("note").innerHTML = 'Um zwischen verschiedenen Audiospuren wechseln zu können, muss im Google Chrome chrome://flags/#enable-experimental-web-platform-features enabled sein.';
      return;
    } else {
      document.getElementById("note").innerHTML = "";
    }
    if (video.audioTracks.length <= 1) return; // if 0, then no audio track can be played

    changeVideoLanguage(video, language);
    let changeLanguageControl = '<div class="input-group"><span class="input-group-addon">Sprache</span><select id="selectLanguage" onchange="changeLanguage(video, this.value)" class="form-control select">';
    for (let i = 0; i < video.audioTracks.length; i += 1) {
      changeLanguageControl += '<option value="' + video.audioTracks[i].id + '" ' + (video.audioTracks[i].id === language ? 'selected="selected"' : "") + '>' + video.audioTracks[i].language + '</option>'
    }
    changeLanguageControl += '</select></div>';
    insertAfter(createElementFromHTML(changeLanguageControl), document.getElementById("switchLight"));
  }, false);


  document.getElementById('video').addEventListener('ended', nextVideo, false);
}

function nextVideo(e) {
  if (autoplay) {
    $("#ne").click();
  }
}

function toggleAutoplay() {
  autoplay = !autoplay;
  autoplayTxt = autoplay
    ? '<span class="glyphicon glyphicon-pause" aria-hidden="true"></span> Autoplay aus'
    : '<span class="glyphicon glyphicon-play" aria-hidden="true"></span> Autoplay an';
  $("#toggleAutoplayBtn").html(autoplayTxt);
}

function toggleLight() {
  light = !light
  lightTxt = light
    ? '<span class="glyphicon glyphicon-off" aria-hidden="true"></span> Licht aus'
    : '<span class="glyphicon glyphicon-off" aria-hidden="true"></span> Licht an';
  $('#main-container').toggleClass("bright").toggleClass("dark");
  $('#tabsEpisodes').toggleClass("bright").toggleClass("dark");
  $("#switchLight").html(lightTxt);
}

function toggleLeft() {
  left = !left;
  $('#left-container').toggleClass("hide");
  $('#right-container').toggleClass("col-xs-offset-1");
  $('#leftSwitch > .glyphicon').toggleClass("glyphicon-chevron-left").toggleClass("glyphicon-chevron-right");
}

function changeSpeed(videoSpeed) {
  speed = videoSpeed;
  $("#video")[0].playbackRate = speed;
}

function changeLanguage(video, videoLanguage) {
  language = videoLanguage;
  changeVideoLanguage(video, videoLanguage);
}


function changeVideoLanguage(video, videoLanguage) {
  if (!videoLanguage) return;

  const wasPaused = video.paused;
  const time = video.currentTime;
  video.pause();
  for (let i = 0; i < video.audioTracks.length; i += 1) {
    video.audioTracks[i].enabled = video.audioTracks[i].id === videoLanguage;
  }

  video.currentTime = time - 1;
  if (!wasPaused) video.play();
}

function skipTime(video, seconds) {
  video.currentTime = video.currentTime + seconds;
}

function changeSkipSeconds() {
  skip = document.getElementById("skip").value;
}

function createElementFromHTML(htmlString) {
  let div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild;
}

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
