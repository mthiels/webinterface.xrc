var musicStoresType = "";
var musicSearchGenre = [];
var musicSearchGenreCount = 0;
var musicSearchArtistAll = [];
var musicSearchArtistAllCount = 0;

Ext.define('artistSearchInfo', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'int' },
        { name: 'artist', type: 'string' }
    ]
});

var storeSearchArtist = Ext.create('Ext.data.Store', {
    model: 'artistSearchInfo',
    folderSort: true,
    sorters: [{
        property: 'text',
        direction: 'ASC'
    }]
});


Ext.define('albumSearchInfo', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'int' },
        { name: 'album', type: 'string' }
    ]
});

var storeSearchAlbum = Ext.create('Ext.data.Store', {
    model: 'albumSearchInfo',
    folderSort: true,
    sorters: [{
        property: 'text',
        direction: 'ASC'
    }]
});

Ext.define('songSearchInfo', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'artist', type: 'string' },
        { name: 'album', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'songid', type: 'int' }
    ]
});

var storeSearchSongs = Ext.create('Ext.data.Store', {
    model: 'songSearchInfo',
    folderSort: true,
    sorters: [{
        property: 'text',
        direction: 'ASC'
    }]
});

var gridSearchArtist = Ext.create('Ext.grid.Panel', {
    store: storeSearchArtist,
    viewConfig: {
        copy: true,
        plugins: {
            ddGroup: 'mygroup',
            ptype: 'gridviewdragdrop',
            enableDrag: true,
            enableDrop: false,
            dragText: '{0} Artist{1} selected'
        },
        listeners: {
            itemclick: function (node, data, dropRec, dropPosition) {
                handleArtistRowClick(node, data, dropRec, dropPosition);
            }
        }
    },
    columns: [
        {
            text: 'Artist',
            width: 100,
            sortable: true,
            hideable: false,
            dataIndex: 'artist'
        }
    ],
    forceFit: true
});

var gridSearchAlbum = Ext.create('Ext.grid.Panel', {
    store: storeSearchAlbum,
    viewConfig: {
        copy: true,
        plugins: {
            ddGroup: 'mygroup',
            ptype: 'gridviewdragdrop',
            enableDrag: true,
            enableDrop: false,
            dragText: '{0} Album{1} selected'
        },
        listeners: {
            itemclick: function (node, data, dropRec, dropPosition) {
                handleSearchAlbumRowClick(node, data, dropRec, dropPosition);
            }
        }
    },
    columns: [
        {
            text: 'Album',
            width: 100,
            sortable: true,
            hideable: false,
            dataIndex: 'album'
        }
    ],
    forceFit: true
});

var gridSearchSongs = Ext.create('Ext.grid.Panel', {
    store: storeSearchSongs,
    viewConfig: {
        copy: true,
        plugins: {
            ddGroup: 'mygroup',
            ptype: 'gridviewdragdrop',
            enableDrag: true,
            enableDrop: false,
            dragText: '{0} Song{1} selected'
        }
    },
    columns: [
                { id: 'song', header: 'Title', sortable: true, dataIndex: 'title' },
                { id: 'artist', header: 'Artist', sortable: true, dataIndex: 'artist' },
                { id: 'album', header: 'Album', sortable: true, dataIndex: 'album' }
    ],
    forceFit: true
});


function setStoresType(type) {

    if (currentPlaylist == 'Music') {
        genreIDSelected = -1;
        musicStoresType = type;
    }
}
/****************** buttonSearchMusicLibrary **************************/

function buttonSearchMusicLibrary() {
    var paramsObj = {};
    var artistName = Ext.getCmp('artistname').getValue();
    var albumName = Ext.getCmp('albumname').getValue();
    var songName = Ext.getCmp('songname').getValue();
    var methodString = "";
    var successFuntion = null;

    musicLibaryMessageBox.show({
        msg: 'Searching...',
        wait: true,
        waitConfig: { interval: 200 },
        icon: 'ext-mb-download' //custom class in msg-box.html
    });

    if (songName != "") {
        successFunction = buttonSearchSongSuccess;
        methodString = "GetSongs";
        paramsObj = { "properties": ["genre", "artist", "album", "file", "title", "duration"], "filter": { "and": [{ "field": "artist", "operator": "contains", "value": artistName }, { "field": "album", "operator": "contains", "value": albumName }, { "field": "title", "operator": "contains", "value": songName }] } };
    } else if (albumName != "") {
        successFunction = buttonSearchAlbumSuccess;
        methodString = "GetAlbums";
        paramsObj = { "properties": ["artist", "genre", "rating", "thumbnail", "year", "mood", "style"], "filter": { "and": [{ "field": "artist", "operator": "contains", "value": artistName }, { "field": "album", "operator": "contains", "value": albumName }] } };
    } else if (artistName != "") {
        methodString = "GetArtists";
        successFunction = buttonSearchArtistSuccess;
        paramsObj = { "properties": ["thumbnail", "fanart", "born", "formed", "died", "disbanded", "yearsactive", "mood", "style", "genre"], "filter": { "field": "artist", "operator": "contains", "value": artistName } };
    } else return;

    var obj = {
        "jsonrpc": "2.0",
        "method": "AudioLibrary."+ methodString,
        "params": paramsObj,
        "id": 1
    };

    tempStr = Ext.encode(obj);
    Ext.Ajax.request({
        url: clientAddr + '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: successFunction,
        failure: buttonSearchMusicFailure,
        timeout: interfaceTimeout
    });
}

function buttonSearchMusicFailure(t) {
    alert('buttonClearPlayListFailure failure t:' + t);
}

function buttonSearchSongSuccess(t) {
    var response = Ext.decode(t.responseText);

    musicLibaryMessageBox.hide();

    musicSearchLibrary = [];
    storeSearchSongs.removeAll();
    storeSearchAlbum.removeAll();
    storeSearchArtist.removeAll();

    for (i = 0; i < response.result.limits.total; i++) {
        musicSearchLibrary[i] = new Array(response.result.songs[i].artist,
                                    response.result.songs[i].album,
                                    response.result.songs[i].title,
                                    response.result.songs[i].songid
        );
    }
    storeSearchSongs.loadData(musicSearchLibrary);
}

function buttonSearchAlbumSuccess(t) {
    var response = Ext.decode(t.responseText);

    musicLibaryMessageBox.hide();

    albumSearchLibrary = [];
    storeSearchAlbum.removeAll();
    storeSearchSongs.removeAll();
    storeSearchArtist.removeAll();

    for (i = 0; i < response.result.limits.total; i++) {

        albumSearchLibrary[i] = new Array(      response.result.albums[i].albumid,
                                                response.result.albums[i].label);

    }

    storeSearchAlbum.loadData(albumSearchLibrary);

}

function buttonSearchArtistSuccess(t) {
    var response = Ext.decode(t.responseText);

    musicLibaryMessageBox.hide();

    artistSearchLibrary = [];
    storeSearchAlbum.removeAll();
    storeSearchSongs.removeAll();
    storeSearchArtist.removeAll();

    for (i = 0; i < response.result.limits.total; i++) {

        artistSearchLibrary[i] = new Array(     response.result.artists[i].artistid,
                                                response.result.artists[i].label);

    }

    storeSearchArtist.loadData(artistSearchLibrary);

}

function handleSearchAlbumRowClick(node, data, dropRec, dropPosition) {

    albumSelected = data.data.album; //OK, we have our record
    albumIDSelected = data.data.id;

    var paramsObj = {};

    paramsObj = { "filter": { "albumid": albumIDSelected }, "properties": ["genre", "artist", "album", "file", "title", "duration"] };

    var obj = {
        "jsonrpc": "2.0",
        "method": "AudioLibrary.GetSongs",
        "params": paramsObj,
        "id": 1
    };

    tempStr = Ext.encode(obj);
    Ext.Ajax.request({
        url: clientAddr + '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: gatherSongs,
        failure: getMusicLibFailure,
        timeout: interfaceTimeout
    });

    musicLibaryMessageBox.show({
        msg: 'Loading Album...',
        wait: true,
        waitConfig: { interval: 200 },
        closable: true,
        closeAction: 'hide',
        icon: 'ext-mb-download' //custom class in msg-box.html
    });
}


