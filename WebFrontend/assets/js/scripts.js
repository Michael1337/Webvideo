$(document).ready(function () {
    autoplay = "";
    autoplayStatus = false;
    autoplayTxt = '<span class="glyphicon glyphicon-play" aria-hidden="true"></span> Autoplay an';
    lightStatus = true;
    lightTxt = '<span class="glyphicon glyphicon-off" aria-hidden="true"></span> Licht aus';

    // Tabs vorbereiten
    var mydata = JSON.parse(data);

    var staffel_count = mydata.length;
    var tabsString = "";
    for (var i = 0; i < staffel_count; i++) {
        //i < 9 ? tabsNumber = '0' + (i + 1) : tabsNumber = (i + 1);
        tabsString += '<li id="tab' + i + '" title="' + mydata[i].name + '" class="tab-link" data-tab="tab-' + i + '">' + (i + 1) + '</li>';
    }
    $("#tabs").append(tabsString);

    // Buttons vorbereiten
    var episoden_count = [];
    for (var i = 0; i < mydata.length; i++) {
        episoden_count.push([mydata[i].episoden.length]);
    }
    var episodenString = "";
    var counter = 1;
    for (var i = 0; i < staffel_count; i++) {
        episodenString += '<div id="tab-' + (i) + '" class="tab-content"><p class="tab-season-title">'+ mydata[i].name +'</p>';
        for (var j = 0; j < episoden_count[i]; j++) {
            episodenString += '<button title="' + mydata[i].episoden[j].title + '" id="' + (i + 1) + '-' + (j + 1) + '" class="btn-default episoden-btn" onclick="clickBtn(' + (i + 1) + ',' + (j + 1) + ')">' + (j + 1) + '</button>';
            counter++;
        }
        episodenString += '</div>';
    }
    $("#tabsEpisodes").append(episodenString);

    // initialisieren
    showVideo(1, 1);
    $('ul.tabs li').first().addClass("current");
    $('#tab-0').addClass("current");
    $('.episoden-btn').first().addClass("current");
});

function clickBtn(idS, idE) {
    // Tab umschalten, Button hervorheben und Video anzeigen
    $('ul.tabs li').removeClass('current');
    $("#tab" + (idS - 1)).addClass('current');
    $('.tab-content').removeClass('current');
    $("#tab-" + (idS - 1)).addClass('current');
    $('.episoden-btn').removeClass('current');
    $('#' + idS + '-' + idE).addClass('current');
    showVideo(idS, idE);
}

function showVideo(idS, idE) {
    var srcString;
    var titleData;
    var title;
    var found = false;
    var mydata = JSON.parse(data);
    for (var i = 0; i < mydata.length; i++) {
        for (var j = 0; j < mydata[i].episoden.length; j++) {
            if (mydata[i].id === idS && mydata[i].episoden[j].id === idE) {
                srcString = rootPath + "/" + mydata[i].name + "/" + mydata[i].episoden[j].title + "." + mydata[i].episoden[j].fileextension;
                titleData = "Staffel: " + mydata[i].name + " | Episode: " + mydata[i].episoden[j].id + " | " + mydata[i].episoden[j].idb;
                title = mydata[i].episoden[j].title;
                found = true;
                if (found) break;
            }
        }
        if (found) break;
    }
    if (!found) {
        if (idE === 0) {
            if (idS > 1) {
                idS = idS - 1;
            }
            idE = mydata[idS - 1].episoden.length;
            clickBtn(idS, idE);
            return;
        } else if (idS === 0) {
            idS = 1;
            clickBtn(idS, idE);
            return;
        } else if (idS > mydata.length) {
            idS = mydata.length;
            idE = 1;
            clickBtn(idS, idE);
            return;
        } else {
            idS = idS + 1;
            idE = 1;
            clickBtn(idS, idE);
            return;
        }

    }

    $("#title").html(titleData + '<br>' + title);
    $("#video-container").html('<video id="video" class="ep-video" src="' + srcString + '" type="video/mp4" controls '+autoplay+'></video>');
    $("#controls").html('<div class="form-inline">' +
        '<button id="leftSwitch" onclick="toggleLeft()" class="pull-left btn btn-default btn-sm"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></button>' +
        '<button id="switchLight" onclick="switchLight()" class="btn btn-default btn-sm btn-switchLight">' + lightTxt + '</button>' +
        '<div class="btn-group"><button onclick="clickBtn(' + (idS - 1) + ',' + (1) + ')" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-fast-backward" aria-hidden="true"></span> Vorige Staffel</button>' +
        '<button onclick="clickBtn(' + idS + ',' + (idE - 1) + ')" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-step-backward" aria-hidden="true"></span> Voriges Video</button>' +
        '<button id="ne" onclick="clickBtn(' + idS + ',' + (idE + 1) + ')" class="btn btn-default btn-sm">Nächstes Video <span class="glyphicon glyphicon-step-forward" aria-hidden="true"></span></button>' +
        '<button onclick="clickBtn(' + (idS + 1) + ',' + (1) + ')" class="btn btn-default btn-sm">Nächste Staffel <span class="glyphicon glyphicon-fast-forward" aria-hidden="true"></span></button></div>' +
        '<button id="toggleAutoplayBtn" onclick="toggleAutoplay()" class="btn btn-default btn-sm btn-autoplay">' + autoplayTxt + '</button>' +
        '<div class="input-group"><span class="input-group-addon">Speed</span><select id="selectSpeed" onchange="changeSpeed(this.value)" class="form-control selectSpeed">' +
            '<option value="3.0">3.0</option>' +
            '<option value="2.0">2.0</option>' +
            '<option value="1.5">1.5</option>' +
            '<option value="1.25">1.25</option>' +
            '<option value="1.0" selected="selected">1.0</option>' +
            '<option value="0.5">0.5</option>' +
        '</select></div>' +
        '</div>'
    );

    if (autoplayStatus === true) {
        autoplayF();
    }
}

function autoplayF() {
    document.getElementById('video').addEventListener('ended',nextVideo,false);
    function nextVideo(e) {
        if(autoplayStatus === true) {
            $("#ne").click();
        }
    }
}

function toggleAutoplay() {
    if (autoplayStatus === true) {
        autoplayStatus = false;
        autoplay = "";
        autoplayTxt = '<span class="glyphicon glyphicon-play" aria-hidden="true"></span> Autoplay an';
    } else {
        autoplayStatus = true;
        autoplay = "autoplay";
        autoplayTxt = '<span class="glyphicon glyphicon-pause" aria-hidden="true"></span> Autoplay aus';
    }
    $("#toggleAutoplayBtn").html(autoplayTxt);
    autoplayF();
}

function switchLight() {
    if (lightStatus === true) {
        lightStatus = false;
        lightTxt = '<span class="glyphicon glyphicon-off" aria-hidden="true"></span> Licht an';
    } else {
        lightStatus = true;
        lightTxt = '<span class="glyphicon glyphicon-off" aria-hidden="true"></span> Licht aus';
    }
    $('#main-container').toggleClass("bright").toggleClass("dark");
    $("#switchLight").html(lightTxt);
}

function toggleLeft() {
    $('#left-container').toggleClass("hide");
    $('#right-container').toggleClass("col-xs-offset-1");
    $('#leftSwitch > .glyphicon').toggleClass("glyphicon-chevron-left").toggleClass("glyphicon-chevron-right");
}

function changeSpeed(speed) {
    $("#video")[0].playbackRate = speed;
}