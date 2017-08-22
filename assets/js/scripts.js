$(document).ready(function () {
    autoplay = "";
    autoplayStatus = "Autoplay einschalten";

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
                srcString = "assets/videos/" + mydata[i].name + "/" + mydata[i].episoden[j].title + "." + mydata[i].episoden[j].fileextension;
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
    $("#video-container").html('<video id="video" class="ep-video" src="' + srcString + '" type="video/mp2" controls '+autoplay+'></video>');
    $("#controls").html('' +
        '<button onclick="clickBtn(' + (idS - 1) + ',' + (1) + ')">Vorige Staffel</button>' +
        '<button onclick="clickBtn(' + idS + ',' + (idE - 1) + ')">Voriges Video</button>' +
        '<button id="toggleAutoplayBtn" onclick="toggleAutoplay()">' + autoplayStatus + '</button>' +
        '<button id="ne" onclick="clickBtn(' + idS + ',' + (idE + 1) + ')">Nächstes Video</button>' +
        '<button onclick="clickBtn(' + (idS + 1) + ',' + (1) + ')">Nächste Staffel</button>' +
        '<select id="selectSpeed" onchange="changeSpeed(this.value)">' +
            '<option value="2.0">2.0</option>' +
            '<option value="1.5">1.5</option>' +
            '<option value="1.0" selected="selected">1.0</option>' +
            '<option value="0.5">0.5</option>' +
        '</select>'
    );

    if (autoplay === "autoplay") {
        autoplayF();
    }
}

function autoplayF() {
    document.getElementById('video').addEventListener('ended',nextVideo,false);
    function nextVideo(e) {
        if(autoplay === "autoplay") {
            $("#ne").click();
        }
    }
}

function toggleAutoplay() {
    if (autoplay === "autoplay") {
        autoplay = "";
        autoplayStatus = "Autoplay einschalten";
    } else {
        autoplay = "autoplay";
        autoplayStatus = "Autoplay ausschalten";
    }
    $("#toggleAutoplayBtn").text(autoplayStatus);
    autoplayF();
}

function changeSpeed(speed) {
    $("#video")[0].playbackRate = speed;
}