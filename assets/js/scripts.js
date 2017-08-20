$(document).ready(function () {
    // Tabs vorbereiten
    var mydata = JSON.parse(data);

    var staffel_count = mydata.length;
    var tabsString = "";
    for (var i = 0; i < staffel_count; i++) {
        tabsString += '<li title="' + mydata[i].name + '" class="tab-link" data-tab="tab-' + i + '">' + (i + 1) + '</li>';
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
        episodenString += '<div id="tab-' + (i) + '" class="tab-content">';
        for (var j = 0; j < episoden_count[i]; j++) {
            episodenString += '<button title="' + mydata[i].episoden[j].title + '" class="btn-default episoden-btn" onclick="showVideo(' + (i+1) + ',' + (j+1) + ')">' + (j+1) + '</button>';
            counter++;
        }
        episodenString += '</div>';
    }
    $("#tabsEpisodes").append(episodenString);
});

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
                titleData = "Staffel: " + mydata[i].id + " | Episode: " + mydata[i].episoden[j].id + " | " + mydata[i].episoden[j].idb;
                title = mydata[i].episoden[j].title;
                found = true;
                if (found) break;
            }
        }
        if (found) break;
    }
    if (!found) {
        if (idE < 1) {
            idS = idS - 1;
            idE = mydata[idS-1].episoden.length;
            var lastLast = mydata[idS-1].episoden[idE - 1];
            srcString = "assets/videos/" + mydata[idS-1].name + "/" + lastLast.title + "." + lastLast.fileextension;
            titleData = mydata[idS - 1].episoden[idE - 1].idb;
            title = mydata[idS - 1].episoden[idE - 1].title;
        } else {
            idS = idS+1;
            idE = 1;
            srcString = "assets/videos/" + mydata[idS-1].name + "/" + mydata[idS-1].episoden[0].title + "." + mydata[idS-1].episoden[0].fileextension;
            titleData = mydata[idS-1].episoden[0].idb;
            title = mydata[idS-1].episoden[0].title;
        }

    }

    $("#title").html(titleData + '<br>' + title);
    $("#video").html('<video id="video" src="' + srcString + '" type="video/mp2" controls width="100%" height="100%"></video>');
    $("#controls").html('' +
        '<button onclick="showVideo(' +(idS-1)+','+ (1) + ')">Vorige Staffel</button>' +
        '<button onclick="showVideo(' +idS+','+ (idE - 1) + ')">Voriges Video</button>' +
        '<button onclick="showVideo(' +idS+','+ (idE + 1) + ')">Nächstes Video</button>'+
        '<button onclick="showVideo(' +(idS+1)+','+ (1) + ')">Nächste Staffel</button>'
    );
}