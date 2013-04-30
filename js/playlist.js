var playlistCurrentIndex = -1;
var playlistSavedIndex = -1;
var currentPlaylistSelected = 0;


// Data Model for playlist
Ext.define('playlistMusic', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'location', type: 'string' },
        { name: 'currentlyPlaying'},
        { name: 'artist', type: 'string' },
        { name: 'album', type: 'string' },
        { name: 'duration', type: 'string' },
        { name: 'thumbnail', type: 'string' }
    ]
});

// create the data store
var storeMusicPlaylist = Ext.create('Ext.data.Store', {
    model: 'playlistMusic'
});


var gridMusicPlaylist = Ext.create('Ext.grid.Panel', {
    renderTo: Ext.getBody(),
    store: storeMusicPlaylist,
    viewConfig: {
        plugins: {
            ddGroup: 'mygroup',
            ptype: 'gridviewdragdrop',
            enableDrop: true,
            enableDrag: true
        },
        listeners: {
            drop: function(node, data, dropRec, dropPosition) {
                handlePlaylistDrop(data, dropPosition);
            },
            itemdblclick: function(view, index) {
                playSelectedSong(index);
            }
        }
    },
    columns: [
        { 
            header: '',
            width: 15, id: 'currentlyPlaying', 
            dataIndex: 'currentlyPlaying',
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                if (record.data.currentlyPlaying != "") {
                    return ("<img src='images/pointer.gif' ></img>");
                }
                return (value);
            }
        },
        {
            text: 'Name',
            //width: 100,
            sortable: false,
            hideable: false,
            dataIndex: 'name'
        },
        {
            xtype: 'actioncolumn',
            width: 25,
            items: [{
                icon: 'images/cross.png',  // Use a URL in the icon config
                iconCls: 'icon-remove',
                tooltip: 'Remove Song',
                handler: function(grid, rowIndex, colIndex) {
                    removeFromPlayList(rowIndex, grid);
                }
            }]
        }
    ],
    forceFit: true
});



function addToPlayListFailure(t) {
    alert('addToPlayListFailure t:' + t);
}

function xbmcAddFromDBCmdSuccess(t) {
    var response = Ext.decode(t.responseText);
    updatePlaylistTree();
}

function handlePlaylistDrop(data, dropPosition) {
    var obj = null;
    
    if (data.records[0].modelName == 'shareMusicInfo') {
        if (currentPlaylist == 'Music') {
            addDirectoryContent(data.records[0].raw, 'Music', true);
        } else {
            addDirectoryContent(data.records[0].raw, 'Video', true);
        }
    }
    if (data.records[0].modelName == 'genreInfo') {
        obj = {
            "jsonrpc": "2.0",
            "method": "Playlist.Add",
            "params": {
                "playlistid": 0,
                "item": {
                    "genreid": data.records[0].data.id
                }
            },
            "id": 1
        };
    }
    if (data.records[0].modelName == 'artistInfo' || data.records[0].modelName == 'artistSearchInfo') {
        obj = {
            "jsonrpc": "2.0",
            "method": "Playlist.Add",
            "params": {
                "playlistid": 0,
                "item": {
                    "artistid": data.records[0].data.id
                }
            },
            "id": 1
        };
    }
    if (data.records[0].modelName == 'albumInfo' || data.records[0].modelName == 'albumSearchInfo') {
        obj = {
            "jsonrpc": "2.0",
            "method": "Playlist.Add",
            "params": {
                "playlistid": 0,
                "item": {
                    "albumid": data.records[0].data.id
                }
            },
            "id": 1
        };
    }
    if (data.records[0].modelName == 'songInfo' || data.records[0].modelName == 'songSearchInfo') {
        var obj = {
            "jsonrpc": "2.0",
            "method": "Playlist.Add",
            "params": {
                "playlistid": 0,
                "item": {
                    "songid": data.records[0].data.songid
                }
            },
            "id": 1
        };
    }
    if (data.records[0].modelName == 'videoLibraryInfo') {
        var obj = {
            "jsonrpc": "2.0",
            "method": "Playlist.Add",
            "params": {
                "playlistid": 1,
                "item": {
                    "movieid": data.records[0].data.id
                }
            },
            "id": 1
        };
    }
    if (data.records[0].modelName == 'storeEpisodesInfo') {
        var obj = {
            "jsonrpc": "2.0",
            "method": "Playlist.Add",
            "params": {
                "playlistid": 1,
                "item": {
                    "episodeid": data.records[0].data.episodeid
                }
            },
            "id": 1
        };
    }
    if (data.records[0].modelName == 'shareVideoInfo') {
        var obj = {
            "jsonrpc": "2.0",
            "method": "Playlist.Add",
            "params": {
                "playlistid": 1,
                "item": {
                    "file": data.records[0].data.name
                }
            },
            "id": 1
        };
    }

    tempStr = Ext.encode(obj);
    Ext.Ajax.request({
        url: clientAddr + '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: xbmcAddFromDBCmdSuccess,
        failure: addToPlayListFailure,
        timeout: interfaceTimeout
    });
}


/********************* addDirectoryContent ***********************/

function addDirectoryContentFailure(t) {
    alert('addDirectoryContentFailure t:' + t);
}

function addDirectoryContent(folderPath, mask, recursive) {

    var tempPlaylist = 0;

    if (currentPlaylist != 'Music')
        tempPlaylist = 1;

    if (folderPath.type != "file") {
        var obj = {
            "jsonrpc": "2.0",
            "method": "Playlist.Add",
            "params": {
                "playlistid": tempPlaylist,
                "item": {
                    "directory": folderPath.name
                }
            },
            "id": 1
        };
    }
    else {
        var obj = {
            "jsonrpc": "2.0",
            "method": "Playlist.Add",
            "params": {
                "playlistid": tempPlaylist,
                "item": {
                    "file": folderPath.name
                }
            },
            "id": 1
        };
    }

    tempStr = Ext.encode(obj);

    Ext.Ajax.request({
        url: clientAddr + '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: updatePlaylistTree,
        failure: addDirectoryContentFailure,
        timeout: interfaceTimeout
    });
}


/********************* updatePlaylistTree ***********************/

function updatePlaylistTree() {

    if (currentPlaylist == "Music") {
        var obj = {
            "jsonrpc": "2.0",
            "method": "Playlist.GetItems",
            "params": { "playlistid": 0, "properties": ["title", "artist", "genre", "album", "file", "duration", "thumbnail"] },
            "id": 1
        };
    } else {
        var obj = {
            "jsonrpc": "2.0",
            "method": "Playlist.GetItems",
            "params": { "playlistid": 1, "properties": ["title", "artist", "genre", "album", "file", "runtime", "thumbnail"] },
            "id": 1
        };
    }

    tempStr = Ext.encode(obj);

    Ext.Ajax.request({
        url: clientAddr + '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: updatePlaylistSuccess,
        failure: updatePlaylistTreeFailure,
        timeout: interfaceTimeout
    });

}

function updatePlaylistSuccess(t) {

    var newNode = null;
    var tempIndex = 0;
    var tempPlaylist = [];
    var musicPlaylist = [];
    var tempPlaying = "";
    var tempCount = 0;
    var Artiststr = "";

    var responseArr = Ext.decode(t.responseText);

    tempCount = responseArr.result.limits.total;
    responsePlaylist = responseArr.result.items;

    //playlistCurrentIndex = -1;
    for (var i = 0; i < tempCount; i++) {
        tempPlaying = "";
		var tempName = responsePlaylist[i].title;
        if (tempName == "") {
            if (responsePlaylist[i].title != undefined)
                tempName = responsePlaylist[i].label;
        }
        if (tempName == "") {
            tempName = responsePlaylist[i].file.split('\\').pop().split('/').pop();
        }
        if (responsePlaylist[i].artist != "" && responsePlaylist[i].artist != "[]")
            Artiststr =( responsePlaylist[i].artist) ?  responsePlaylist[i].artist+' - ' : '';
			tempName = Artiststr + tempName;
        if (playlistCurrentIndex == i)
            if ((currentPlaylist == "Music" && currentPlayer == 0) || (currentPlaylist != "Music" && currentPlayer == 1))
            tempPlaying = "test";
            
        tempPlaylist[tempIndex] = new Array(tempIndex,
                                            tempName,
                                            responsePlaylist[i].file,
                                            tempPlaying,
                                            responsePlaylist[i].artist,
                                            responsePlaylist[i].album,
                                            responsePlaylist[i].duration,
                                            responsePlaylist[i].thumbnail);
        tempIndex++;

    }

    storeMusicPlaylist.loadData(tempPlaylist);
    Ext.getCmp('playlistStatus').setText(tempIndex + ' items');
}

function updatePlaylistTreeFailure(t) {
    alert('updatePlaylistTreeFailure t:' + t);
}


/************************** PlaySelectedSong ************************/

function playSelectedSong(branch) {

    if (branch == undefined)
        return;
        
    var currentSongIndex = branch.raw[0];

    var temp = 0;
    if (currentPlaylist == "Video" || currentPlaylist == "TV Shows")
        temp = 1;

    var obj = {
        "jsonrpc": "2.0",
        "method": "Player.Open",
        "params": {
            "item": {
                "playlistid": temp,
                "position": currentSongIndex
            }
        },
        "id": 1
    };

    tempStr = Ext.encode(obj);

    Ext.Ajax.request({
        url: clientAddr + '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: playSelectedSongSuccess,
        failure: playSelectedSongFailure,
        timeout: interfaceTimeout
    });
}

function playSelectedSongFailure(t) {
    var responseArr = Ext.decode(t.responseText);
    alert('playSelectedSongFailure failure t:' + t);
}

function playSelectedSongSuccess(t) {
    var responseArr = Ext.decode(t.responseText);
}

/************************** removeFromPlayList ************************/

function removeFromPlayList(selectIndex, record) {

    if (selectIndex == 0xFFFF)
        return;

    var temp = 0;
    if (currentPlaylist != "Music")
        temp = 1;

    var obj = {
        "jsonrpc": "2.0",
        "method": "Playlist.Remove",
        "params": {
            "playlistid": temp,
            "position": selectIndex
        },
        "id": 1
    };

    tempStr = Ext.encode(obj);

    Ext.Ajax.request({
        url: clientAddr + '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: xbmcRemoveFromDBCmdSuccess,
        failure: xbmcRemoveFromDBCmdFailure,
        timeout: interfaceTimeout
    });

    selectIndex = 0xFFFF;
}

function xbmcRemoveFromDBCmdSuccess(t) {
    var response = Ext.decode(t.responseText);

    updatePlaylistTree();
}

function xbmcRemoveFromDBCmdFailure(t) {
    alert('xbmcRemoveFromDBCmdFailure t:' + t);
}

/****************** buttonClearPlayList **************************/

function buttonClearPlayList() {
    var tempPlaylist = 0;

    if (currentPlaylist != 'Music')
        tempPlaylist = 1;

    var obj = {
        "jsonrpc": "2.0",
        "method": "Playlist.Clear",
        "params": {
            "playlistid": tempPlaylist
        },
        "id": 1
    };

    tempStr = Ext.encode(obj);

    Ext.Ajax.request({
        url: clientAddr + '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: buttonClearPlayListSuccess,
        failure: buttonClearPlayListFailure,
        timeout: interfaceTimeout
    });
}

function buttonClearPlayListFailure(t) {
    alert('buttonClearPlayListFailure failure t:' + t);
}

function buttonClearPlayListSuccess(t) {
    var responseArr = Ext.decode(t.responseText);
    setPlaylistType(currentPlaylist);
    updatePlaylistTree();
    xbmcCmds('Stop', xbmcCmdSuccess, buttonStopFailure);
}

function buttonStopFailure(t) {
    alert('buttonStopFailure failure t:' + t);
}

function setPlaylistType(type) {
    currentPlaylist = type;
    var listNumber = 0;
    if (currentPlaylist != 'Music')
        listNumber = 1;
    playlistSavedType = " ";

    updatePlaylistTree();

}


/****************** buttonLoadPlayList **************************/

function buttonLoadPlayList() {
    getPlaylists('music');
}

function buttonLoadPlayListFailure(t) {
    alert('buttonLoadPlayListFailure failure t:' + t);
}

function buttonLoadPlayListSuccess(t) {
}


/********************* getPlaylists ***********************/

/*
// create the data store
var storePlaylistDirectory = new Ext.data.SimpleStore({
    fields: [
        { name: 'type' },
        { name: 'filePath' },
        { name: 'playlistName' }
        ]
});
*/

// Data Model for playlist
Ext.define('playlistFiles', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'type', type: 'string' },
        { name: 'filePath', type: 'string' },
        { name: 'playlistName', type: 'string' }
    ]
});

// create the data store
var storePlaylistDirectory = Ext.create('Ext.data.Store', {
    model: 'playlistFiles'
});


// create the Grid
var gridPlaylistDirectory = new Ext.grid.GridPanel({
    //title: 'Genre',
    store: storePlaylistDirectory,
    columns: [
                { header: "Name", id: 'playlistName', sortable: true, dataIndex: 'playlistName' }
            ],
    autoExpandColumn: 'playlistName',
    enableDrag: true,
    ddGroup: 'mygroup',
    ddText: '{0} Selected playlist {1}',
    fitHeight: true,
    listeners: {
        itemclick: function(node, data, dropRec, dropPosition) {
            currentPlaylistSelected = data.raw[1];
        }
    }
});

function useSelectedPlaylist() {
    addDirectoryContent(currentPlaylistSelected, 'Music', true);
    playlistWindow.hide()
}

function getPlaylists(type) {
    var successFunction = (type == 'music') ? getMusicPlaylistsSuccess : getVideoPlaylistsSuccess;

 
    var obj = {
        "jsonrpc": "2.0",
        "method": "Files.GetDirectory",
        "params": { "directory": "special://profile/playlists/music/" },
        "id": 1
    };

    tempStr = Ext.encode(obj);

    Ext.Ajax.request({
        url: clientAddr + '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: successFunction,
        failure: getMediaPlaylistsFailure,
        timeout: interfaceTimeout
    });

}

function getMusicPlaylistsSuccess(t) {
    var playlistDirectoryListing = [];
    var tempCount = 0;

    var responseArr = Ext.decode(t.responseText);

    for (var i = 0; i < responseArr.result.limits.total; i++) {
        aContentPaths = responseArr.result.files[i].file;
        aContentNames = responseArr.result.files[i].label;
		
        var obj = {
            name: responseArr.result.files[i].file,
            type: "playlist"
        };

        if (aContentNames.indexOf(".m3u") != -1 ||
            aContentNames.indexOf(".pls") != -1 ||
            aContentNames.indexOf(".wpl") != -1 ||
            aContentNames.indexOf(".asx") != -1 ||
            aContentNames.indexOf(".xsp") != -1) {
            playlistDirectoryListing[tempCount] = new Array('playlistMusic', obj, aContentNames);
            tempCount++;
        }
    }
    storePlaylistDirectory.loadData(playlistDirectoryListing);
    playlistWindow.show();
}

function getVideoPlaylistsSuccess(t) {
    var responseArr = t.responseText.replace(/<html>/g, "");
    responseArr = responseArr.replace(/<\/html>/g, "");
    responseArr = responseArr.replace(/\n/g, '');
    responseArr = responseArr.split("<li>");
}


function getMediaPlaylistsFailure(t) {
    alert('getMediaPlaylistsFailure t:' + t);
}


/**************** Playlist window stuff *************/
var playlistPanel = new Ext.FormPanel({
    width: 600,
    region: 'center',
    layout: 'fit',
    id: 'playlistPanel',
    title: "<div align='center'>Playlists</div>",
    defaults: { hideLabels: true, border: false },
    buttons: [{
            text: 'Load',
            handler: function() { useSelectedPlaylist() }
        }, {
            text: 'Exit',
            handler: function() { playlistWindow.hide() }
        }],
        modal: true,
        items: [gridPlaylistDirectory]
    }
);

playlistWindow = new Ext.Window({
    id: 'playlistWindow-win',
    height: 300,
    width: 480,
    layout: 'fit',
    border: false,
    closeable: true,
    frame: true,
    //title: 'Testing',
    items: [playlistPanel],
    closeAction: 'hide'
});

