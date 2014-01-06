var songProgressBar = null;
var songPositionSelected = false;
var navButtonPrevious = null;
var playerShuffle = false;
var playerRepeat = 'off';
var isMuted = false;


function InitializeWidgets() {

    songProgressBar = Ext.create('Ext.slider.Single', {
        minValue: 0,
        maxValue: 100,
        useTips: true,
        width: 200,
        tipText: function(thumb){
            return Ext.String.format('<b>{0}% complete</b>', thumb.value);
        },
        renderTo: 'songProgressBar',
        listeners: {
            change: function(slider, thumb, newValue, oldValue) {
                //SendLighting(newValue, dragging);
            },
            drag: function() {
                songPositionSelected = true;
            },
            dragend: function(slider, thumb, value) {
                songPositionSelected = false;
                var tempVal = slider.getValues();
                setSongPosition(tempVal[0]);
            }
        }

    });

    soundSlider = Ext.create('Ext.slider.Single', {
        minValue: 0,
        maxValue: 100,
        useTips: true,
        width: 190,
        renderTo: 'sound-slider',
        listeners: {
            dragend: function(slider, thumb, value) {
                var tempVal = slider.getValues();
                buttonSetVolume(tempVal[0]);
                currentVolume = tempVal[0];
            }
        }
    });

    navButtonPlay = Ext.create('Ext.Button', {
        renderTo: 'buttonPlay',
        icon: 'images/navigator_play.png',
        scale: 'large',
        handler: function() {
            var myPlayingText = document.getElementById('currentlyPlayingText');

            if (myPlayingText.innerHTML == "Nothing Playing") {
                var songToPlay = storeMusicPlaylist.getAt(0);
                playSelectedSong(songToPlay);
            }
            else {
                xbmcCmds('PlayPause', xbmcCmdSuccess, buttonFailure);
            }
        }
    });

    navButtonPause = Ext.create('Ext.Button', {
        renderTo: 'buttonPause',
        icon: 'images/navigator_pause.png',
        scale: 'large',
        handler: function() {
            xbmcCmds('PlayPause', xbmcCmdSuccess, buttonFailure);
        }
    });

    navButtonStop = Ext.create('Ext.Button', {
        renderTo: 'buttonStop',
        icon: 'images/navigator_stop.png',
        scale: 'large',
        handler: function() {
        xbmcCmds('Stop', xbmcCmdSuccess, buttonFailure);
        }
    });

    navButtonNext = Ext.create('Ext.Button', {
        renderTo: 'buttonNext',
        icon: 'images/navigator_next.png',
        scale: 'large',
        handler: function() {
            buttonPrevNext('next');
        }
    });

    navButtonPrevious = Ext.create('Ext.Button', {
        renderTo: 'buttonPrevious',
        icon: 'images/navigator_previous.png',
        scale: 'large',
        handler: function () {
            buttonPrevNext('previous');
        }
    });

    function buttonPrevNext(action) {
        if (connectStatus != 'Connected')
            return;

        var obj = {
            "jsonrpc": "2.0",
            "method": "Player.GoTo",
            "params": { "playerid": currentPlayer, "to": action },
            "id": 1
        };

        tempStr = Ext.encode(obj);

        Ext.Ajax.request({
            url: clientAddr + '/jsonrpc',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            params: tempStr,
            success: prevNextSuccess,
            failure: prevNextFailure,
            timeout: interfaceTimeout
        });
    }

    function prevNextFailure(t) {
        alert('prevNextFailure failure t:' + t);
    }

    function prevNextSuccess(t) {
        var responseArr = Ext.decode(t.responseText);
        updatePlaylistTree();
    }

    navButtonGUI = Ext.create('Ext.Button', {
        renderTo: 'buttonGUI',
        icon: 'images/gui_control.png',
        scale: 'large',
        handler: function () {
            remoteControlWindow.show();
        }
    });
/*
    navButtonUser = Ext.create('Ext.Button', {
        renderTo: 'buttonUser',
        icon: 'images/userDefined.png',
        scale: 'large',
        handler: function () {
            userDefinedWindow.show();
        }
    });
*/
    navButtonShuffle = Ext.create('Ext.Button', {
        renderTo: 'buttonShuffle',
        icon: 'images/navigator_shuffle.png',
        scale: 'large',
        handler: function() {
            if (playerShuffle == true) {
                playerShuffle = false;
                tempString = false;
            }
            else {
                tempString = true;
                playerShuffle = true;
            }
           
            var obj = {
                "jsonrpc": "2.0",
                "method": "Player.SetShuffle",
                "params": { "playerid": currentPlayer, "shuffle": tempString },
                "id": 1
            };

            tempStr = Ext.encode(obj);

            Ext.Ajax.request({
                url: clientAddr + '/jsonrpc',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                params: tempStr,
                success: buttonShuffleSuccess,
                failure: buttonShuffleFailure,
                timeout: interfaceTimeout
            });

        }
    });

    function buttonShuffleFailure(t) {
        alert('buttonShuffleFailure failure t:' + t);
    }

    function buttonShuffleSuccess(t) {
        var responseArr = Ext.decode(t.responseText);
        updatePlaylistTree();
    }

    navButtonRepeat = Ext.create('Ext.Button', {
        renderTo: 'buttonRepeat',
        icon: 'images/navigator_repeat.png',
        scale: 'large',
        handler: function() {
            var tempString = 'off';

            if (playerRepeat == 'off')
                tempString = 'all';
            else if (playerRepeat == 'all')
                tempString = 'one';
            else
                tempString = 'off';

            var obj = {
                "jsonrpc": "2.0",
                "method": "Player.SetRepeat",
                "params": { "playerid": currentPlayer, "repeat": tempString },
                "id": 1
            };

            tempStr = Ext.encode(obj);

            Ext.Ajax.request({
                url: clientAddr + '/jsonrpc',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                params: tempStr,
                success: buttonRepeatSuccess,
                failure: buttonRepeatFailure,
                timeout: interfaceTimeout
            });
        }
    });
    
    function buttonRepeatFailure(t) {
        alert('buttonRepeatFailure failure t:' + t);
    }

    function buttonRepeatSuccess(t) {
        var responseArr = Ext.decode(t.responseText);
        updatePlaylistTree();
    }

    navButtonMute = Ext.create('Ext.Button', {
        renderTo: 'buttonMute',
        icon: 'images/navigator_sound.png',
        scale: 'small',
        handler: function() {
            if (isMuted)
                buttonSetMute(false);
            else
                buttonSetMute(true);
        }
    });
    

}

/********************* Misc commands ***********************/

function xbmcCmdsFailure(t) {
    alert('xbmcCmds failure t:' + t);
}

function xbmcCmdSuccess(t) {
    var responseArr = Ext.decode(t.responseText);
}

function xbmcCmds(command, callbackFunctionSuccess, callbackFunctionFailure) {
    if (connectStatus != 'Connected')
        return;

    var obj = {
        "jsonrpc": "2.0",
        "method": "Player." + command,
        "params": { "playerid": currentPlayer },
        "id": 1
    };

    tempStr = Ext.encode(obj);

    Ext.Ajax.request({
        url: clientAddr + '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: callbackFunctionSuccess,
        failure: callbackFunctionFailure,
        timeout: interfaceTimeout
    });
}

function buttonFailure(t) {
    alert('buttonPlayFailure failure t:' + t);
}

/****************** buttonSetVolume **************************/
function buttonSetVolume(volumeLevel) {

    var obj = {
        "jsonrpc": "2.0",
        "method": "Application.SetVolume",
        "params": {
            "volume": volumeLevel
        },
        "id": 1
    };

    tempStr = Ext.encode(obj);

    Ext.Ajax.request({
        url: clientAddr + '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: xbmcCmdSuccess,
        failure: buttonSetVolumeFailure,
        timeout: interfaceTimeout
    });
}

function buttonSetVolumeFailure(t) {
    alert('buttonSetVolumeFailure failure t:' + t);
}

/****************** buttonSetMute **************************/
function buttonSetMute(muteSetting) {

    var obj = {
        "jsonrpc": "2.0",
        "method": "Application.SetMute",
        "params": {
            "mute": muteSetting
        },
        "id": 1
    };

    tempStr = Ext.encode(obj);

    Ext.Ajax.request({
        url: clientAddr + '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: buttonSetMuteSuccess,
        failure: buttonSetMuteFailure,
        timeout: interfaceTimeout
    });
}

function buttonSetMuteFailure(t) {
    alert('buttonSetMuteFailure failure t:' + t);
}

function buttonSetMuteSuccess(t) {
    getVolume();
}

/********************* getVolume ***********************/

function getVolume() {

    var obj = {
        "jsonrpc": "2.0",
        "method": "Application.GetProperties",
        "params": {
            "properties": ["volume", "muted"]
        },
        "id": 1
    };

    tempStr = Ext.encode(obj);

    Ext.Ajax.request({
        url: clientAddr + '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: getVolumeSuccess,
        failure: getVolumeFailure,
        timeout: interfaceTimeout
    });
}

function getVolumeSuccess(t) {
    var responseArr = Ext.decode(t.responseText);
    currentVolume = responseArr.result.volume;
    isMuted = responseArr.result.muted;
    soundSlider.setValue(currentVolume, false);
    if (isMuted)
    {
        navButtonMute.setIcon('images/navigator_mute.png');
    }
    else
    {
        navButtonMute.setIcon('images/navigator_sound.png');
    }
}

function getVolumeFailure(t) {
    alert('getVolumeFailure t:' + t);
}

/************************** SetSongPosition ************************/

function setSongPosition(input) {

    if (currentPlayer == undefined || currentPlayer == null) {
        return;
    }
    var obj = {
        "jsonrpc": "2.0",
        "method": "Player.Seek",
        "params": { "playerid": currentPlayer, "value": input },
        "id": 1
    };

    tempStr = Ext.encode(obj);

    Ext.Ajax.request({
        url: clientAddr + '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: setSongPositionSuccess,
        failure: setSongPositionFailure,
        timeout: interfaceTimeout
    });

}

function setSongPositionFailure(t) {
    alert('buttonClearPlayListFailure failure t:' + t);
}

function setSongPositionSuccess(t) {
    var responseArr = Ext.decode(t.responseText);
}
