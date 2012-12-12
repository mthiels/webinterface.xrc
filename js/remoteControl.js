/***********************************************/
var RemoteControlPanel = new Ext.FormPanel({
    width: 600,
    height: 600,
    region: 'center',
    id: 'RemoteControlPanel',
    title: "<div align='center'>Remote Control</div>",
    defaults: { xtype: 'container' },
    buttons: [{
        text: 'Exit',
        handler: function() { remoteControlWindow.hide() } 
    }],
    layout: 'absolute',
    modal: true,
    items: [
        {
            cls: 'center-align',
            defaults: { xtype: 'container' },
            id: 'RemoveControl',
            width: 300,
            height: 435,
            x: 0,
            y: 0,
            autoEl: { tag: 'img', src: "images/XBMControl%20Device%20Layout.png" }
        },
        {
            xtype: 'button',
            x: 34,
            y: 4,
            width: 72,
            height: 72,
            padding: '0 0 0 0',
            scale: 'large',
            handler: function() {
                remoteCmds('Home', xbmcRemoteSuccess, remoteFailure);
            },
            iconCls: 'remote-home'
        },
        {
            xtype: 'button',
            x: 113,
            y: 4,
            width: 72,
            height: 72,
            padding: '0 0 0 0',
            scale: 'large',
            handler: function () {
                remoteCmds('Info', xbmcRemoteSuccess, remoteFailure);
            },
            iconCls: 'remote-settings'
        },
        {
            xtype: 'button',
            x: 193,
            y: 4,
            width: 72,
            height: 72,
            padding: '0 0 0 0',
            scale: 'large',
            handler: function () {
                remoteCmds('Back', xbmcRemoteSuccess, remoteFailure);
            },
            iconCls: 'remote-return'
        },
        {
            xtype: 'button',
            x: 113,
            y: 85,
            width: 72,
            height: 72,
            padding: '0 0 0 0',
            scale: 'large',
            handler: function () {
                remoteCmds('Up', xbmcRemoteSuccess, remoteFailure);
            },
            iconCls: 'remote-arrow-up'
        },
        {
            xtype: 'button',
            x: 33,
            y: 161,
            width: 72,
            height: 72,
            padding: '0 0 0 0',
            scale: 'large',
            handler: function () {
                remoteCmds('Left', xbmcRemoteSuccess, remoteFailure);
            },
            iconCls: 'remote-arrow-left'
        },
        {
            xtype: 'button',
            x: 113,
            y: 161,
            width: 72,
            height: 72,
            padding: '0 0 0 0',
            scale: 'large',
            handler: function () {
                remoteCmds('Select', xbmcRemoteSuccess, remoteFailure);
            },
            iconCls: 'remote-select'
        },
        {
            xtype: 'button',
            x: 192,
            y: 161,
            width: 72,
            height: 72,
            padding: '0 0 0 0',
            scale: 'large',
            handler: function () {
                remoteCmds('Right', xbmcRemoteSuccess, remoteFailure);
            },
            iconCls: 'remote-arrow-right'
        },
        {
            xtype: 'button',
            x: 113,
            y: 240,
            width: 72,
            height: 72,
            padding: '0 0 0 0',
            scale: 'large',
            handler: function () {
                remoteCmds('Down', xbmcRemoteSuccess, remoteFailure);
            },
            iconCls: 'remote-arrow-down'
        },
        {
            xtype: 'button',
            x: 2,
            y: 281,
            width: 72,
            height: 72,
            padding: '0 0 0 0',
            scale: 'large',
            handler: function () {
                remoteVolumeAdjust("decrement");
            },
            iconCls: 'remote-volume-down'
        },
        {
            xtype: 'button',
            x: 224,
            y: 281,
            width: 72,
            height: 72,
            padding: '0 0 0 0',
            scale: 'large',
            handler: function () {
                remoteVolumeAdjust("increment");
            },
            iconCls: 'remote-volume-up'
        },
        {
            xtype: 'button',
            x: 4,
            y: 360,
            width: 72,
            height: 72,
            padding: '0 0 0 0',
            scale: 'large',
            handler: function () {
                remotePrevNext('previous');
            },
            iconCls: 'remote-skip-back'
        },
        {
            xtype: 'button',
            x: 76,
            y: 360,
            width: 72,
            height: 72,
            padding: '0 0 0 0',
            scale: 'large',
            handler: function () {
                xbmcCmds('Stop', xbmcCmdSuccess, remoteFailure);
            },
            iconCls: 'remote-stop'
        },
        {
            xtype: 'button',
            x: 151,
            y: 360,
            width: 72,
            height: 72,
            padding: '0 0 0 0',
            scale: 'large',
            handler: function () {
                xbmcCmds('PlayPause', xbmcCmdSuccess, remoteFailure);
            },
            iconCls: 'remote-play-pause'
        },
        {
            xtype: 'button',
            x: 225,
            y: 360,
            width: 72,
            height: 72,
            padding: '0 0 0 0',
            scale: 'large',
            handler: function () {
                remotePrevNext('next');
            },
            iconCls: 'remote-skip-forward'
        }

    ]
})

var remoteControlWindow = new Ext.Window({
    id: 'imginform-remote',
    height: 520,
    width: 310,
    layout: 'fit',
    border: false,
    closeable: true,
    frame: true,
    items: [RemoteControlPanel],
    closeAction: 'hide'
});

function remoteFailure(t) {
    alert('remoteFailure failure t:' + t);
}

function xbmcRemoteSuccess(t) {
    var responseArr = Ext.decode(t.responseText);
}

function remoteCmds(command, callbackFunctionSuccess, callbackFunctionFailure) {
    if (connectStatus != 'Connected')
        return;

    var obj = {
        "jsonrpc": "2.0",
        "method": "Input." + command,
        "id": 1
    };

    tempStr = Ext.encode(obj);

    Ext.Ajax.request({
        url: '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: callbackFunctionSuccess,
        failure: callbackFunctionFailure,
        timeout: interfaceTimeout
    });
}

function remotePrevNext(action) {
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
        url: '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: remoteprevNextSuccess,
        failure: remoteprevNextFailure,
        timeout: interfaceTimeout
    });
}

function remoteprevNextFailure(t) {
    alert('prevNextFailure failure t:' + t);
}

function remoteprevNextSuccess(t) {
    var responseArr = Ext.decode(t.responseText);
    updatePlaylistTree();
}

function remoteVolumeAdjust(action) {
    if (connectStatus != 'Connected')
        return;

    tempVolume = currentVolume;

    if (action == "decrement") {
        if (tempVolume <= 10)
            tempVolume = 0;
        else
            tempVolume -= 10;
    } else {
        if (tempVolume >= 90)
            tempVolume = 100;
        else
            tempVolume += 10;
    }

    
    var obj = {
        "jsonrpc": "2.0",
        "method": "Application.SetVolume",
        "params": {
            "volume": tempVolume
        },
        "id": 1
    };

    tempStr = Ext.encode(obj);

    Ext.Ajax.request({
        url: '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: remoteVolumeAdjustSuccess,
        failure: remoteVolumeAdjustFailure,
        timeout: interfaceTimeout
    });
}

function remoteVolumeAdjustFailure(t) {
    alert('remoteVolumeAdjustFailure failure t:' + t);
}

function remoteVolumeAdjustSuccess(t) {
    getVolume();
}

//<area href="javascript:SendInput('Home')" shape="rect" coords="34, 4, 105, 75">
//<area href="javascript:SendInput('Home')" shape="rect" coords="113, 4, 184, 75">
//<area href="javascript:SendInput('Back')" shape="rect" coords="193, 4, 263, 75">
//<area href="javascript:hideGuiControl()" shape="rect" coords="273, 4, 297, 28" >
//<area href="javascript:SendInput('Up')" shape="rect" coords="113, 85, 184, 154">
//<area href="javascript:SendInput('Left')" shape="rect" coords="33, 161, 105, 233">
//<area href="javascript:SendInput('Select')" shape="rect" coords="113, 161, 184, 233">
//<area href="javascript:SendInput('Right')" shape="rect" coords="192, 161, 263, 233">
//<area href="javascript:SendInput('Down')" shape="rect" coords="113, 240, 184, 313">
//<area href="javascript:adjustVolume(-10)" shape="rect" coords="2, 281, 71, 352">
//<area href="javascript:adjustVolume(10)" shape="rect" coords="224, 281, 297, 352">
//<area href="javascript:buttonPrevious()" shape="rect" coords="4, 360, 71, 430">
//<area href="javascript:buttonStop()" shape="rect" coords="76, 360, 146, 430">
//<area href="javascript:buttonPlay()" shape="rect" coords="151, 360, 222, 430">
//<area href="javascript:buttonNext()" shape="rect" coords="225, 360, 296, 430">
