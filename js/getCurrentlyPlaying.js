var playlistSavedThumb = null;
var hostAddress = top.location.host;
var currentPlayer = 0;

// Start a simple clock task that updates currently playing info every 1.5 seconds
var runner = new Ext.util.TaskRunner();
var currentlyPlayingTask = runner.newTask({
    run: GetCurrentlyPlaying,
    interval: 1500
});
 
/********************* GetCurrentlyPlaying ***********************/
function GetCurrentlyPlaying() {

    var obj = {
        "jsonrpc": "2.0",
        "method": "Player.GetActivePlayers",
        "id": 1
    };

    tempStr = Ext.encode(obj);

    Ext.Ajax.request({
        url: '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: GetCurrentlyPlaying_1,
        
        failure: getCurrentlyPlayingFailure,
        timeout: interfaceTimeout
    });
}

function GetCurrentlyPlaying_1(t) {
    var responseArr = Ext.decode(t.responseText);
    var obj = null;

    var myPlayingText = document.getElementById('currentlyPlayingText');
    var myAlbumArt = document.getElementById('albumArt');
    var myConnectionStatus = document.getElementById('connectionStatus');
    var myRepeatStatus = document.getElementById('repeatStatus');

    if (responseArr.result[0] == undefined) {
        myPlayingText.innerHTML = "Nothing Playing";
        myAlbumArt.src = "images/defaultAlbumCover.png"

        connectStatus = 'Connected';
        myConnectionStatus.innerHTML = connectStatus;
        myRepeatStatus.innerHTML = 'Off';
        return;
    }

    var temp = responseArr.result[0].playerid;

    currentPlayer = temp;
    obj = {
        "jsonrpc": "2.0",
        "method": "Player.GetItem",
        "params": { "playerid": currentPlayer, "properties": ["title", "artist", "genre", "album", "duration", "file", "thumbnail"] },
        "id": 1

    }
    if (temp == 1) {
        obj = {
            "jsonrpc": "2.0",
            "method": "Player.GetItem",
            "params": { "playerid": currentPlayer, "properties": ["title", "year", "thumbnail", "runtime", "duration", "season", "episode", "showtitle", "premiered"] },
            "id": 1
        };
    }

    tempStr = Ext.encode(obj);

    Ext.Ajax.request({
        url: '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: getCurrentlyPlayingSuccess,
        failure: getCurrentlyPlayingFailure,
        timeout: interfaceTimeout
    });
}

function getCurrentlyPlayingSuccess(t) {
    var responseArr = Ext.decode(t.responseText);
    var imgSrc;

    var myPlayingText = document.getElementById('currentlyPlayingText');
    var myAlbumArt = document.getElementById('albumArt');
    var myConnectionStatus = document.getElementById('connectionStatus');
    var myRepeatStatus = document.getElementById('repeatStatus');

    if (responseArr.result.item == undefined || responseArr.error != null) {
        myPlayingText.innerHTML = "Nothing Playing";
        myAlbumArt.src = "images/defaultAlbumCover.png"

        connectStatus = 'Connected';
        myConnectionStatus.innerHTML = connectStatus;
        myRepeatStatus.innerHTML = 'Off';
        return;
    }

    Ext.getCmp('playlistIndex').setText('Index: ' + playlistCurrentIndex);
    if (playlistCurrentIndex != undefined) {

        if (responseArr.result.item.title == "")
            currentlyPlayingString = "<b>" + responseArr.result.item.label + "<br></b>";
        else
            currentlyPlayingString = "<b>" + responseArr.result.item.title + "<br></b>";

        if (responseArr.result.item.type == 'song' ||	 responseArr.result.item.type == 'unknown') {
				currentlyPlayingString += (responseArr.result.item.artist) ? responseArr.result.item.album + "</b><br>" + responseArr.result.item.artist : '';
        }

        if (responseArr.result.item.type == 'episode') {
            if (responseArr.result.item.showtitle != "") {
                currentlyPlayingString += responseArr.result.item.showtitle + "</b><br>" +
		        	"Season: " + responseArr.result.item.season + " Episode: " + responseArr.result.item.episode;
            }
        }

        if (responseArr.result.item.type == 'movie') {
            if (responseArr.result.item.title != "") {
                currentlyPlayingString += responseArr.result.item.year + "</b><br>";
            }
        }

        if (playlistSavedThumb != responseArr.result.item.thumbnail) {
            if (responseArr.result.item.thumbnail == "" || responseArr.result.item.thumbnail == "image://DefaultAlbumCover.png/")
                imgSrc = "images/defaultAlbumCover.png"
            else {
                var tempString = encodeURIComponent(responseArr.result.item.thumbnail);
                imgSrc = "http://" + hostAddress + "/image/" + tempString;
            }

            myAlbumArt.src = imgSrc;
            playlistSavedThumb = myAlbumArt.src;
        }

        if ((playlistCurrentIndex != playlistSavedIndex) && (playlistCurrentIndex != undefined)) {
            updatePlaylistTree();
            playlistSavedIndex = playlistCurrentIndex;
            playlistSavedType = currentPlaylist;
        }
    } else {
        myPlayingText.innerHTML = "Nothing Playing";
        myAlbumArt.src = "images/defaultAlbumCover.png"
    }

    connectStatus = 'Connected';
    myConnectionStatus.innerHTML = connectStatus;


    getCurrentlyPlayingTime();
}

function getCurrentlyPlayingFailure(t) {
    connectStatus = t.statusText;
    connectionStatus.innerHTML = connectStatus;
}

function getCurrentlyPlayingTime() {

    var obj = {
        "jsonrpc": "2.0",
        "method": "Player.GetProperties",
        "params": { "playerid": currentPlayer, "properties": ["time", "totaltime", "position", "shuffled", "repeat", "percentage"] },
        "id": 1
    };

    tempStr = Ext.encode(obj);

    Ext.Ajax.request({
        url: '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: getCurrentlyPlayingTimeSuccess,
        failure: getCurrentlyPlayingTimeFailure,
        timeout: interfaceTimeout
    });
}

function hms(secs) {
    time = [0, 0, secs];
    for (var i = 2; i > 0; i--) {
        time[i - 1] = Math.floor(time[i] / 60);
        time[i] = time[i] % /**/60;
        if (time[i] < 10)
            time[i] = '0' + time[i];
    };
    return time.join(':')
}

function getCurrentlyPlayingTimeSuccess(t) {
    var responseArr = Ext.decode(t.responseText);
    var myPlayingText = document.getElementById('currentlyPlayingText');
    var myAlbumArt = document.getElementById('albumArt');
    var myConnectionStatus = document.getElementById('connectionStatus');
    var myShuffleStatus = document.getElementById('shuffleStatus');
    var myRepeatStatus = document.getElementById('repeatStatus');

    if (responseArr.error == undefined) {
        var currentTime = parseInt(responseArr.result.time.seconds) + (parseInt(responseArr.result.time.minutes * 60)) + (parseInt(responseArr.result.time.hours) * 3600);
		var totalTime = parseInt(responseArr.result.totaltime.seconds) + (parseInt(responseArr.result.totaltime.minutes * 60)) + (parseInt(responseArr.result.totaltime.hours) * 3600);
        var percentage = (parseInt(responseArr.result.percentage));
        if (!songPositionSelected) {
            songProgressBar.setValue(percentage);
            myPlayingText.innerHTML = currentlyPlayingString + "<br>" + hms(currentTime) +' / '+ hms(totalTime);
        }
        playlistCurrentIndex = responseArr.result.position;

        playerShuffle = responseArr.result.shuffled
        playerRepeat = responseArr.result.repeat;

        myShuffleStatus.innerHTML = (responseArr.result.shuffled) ? 'On' : 'Off' ;;
        myRepeatStatus.innerHTML = playerRepeat;
    }
}

function getCurrentlyPlayingTimeFailure(t) {
}


