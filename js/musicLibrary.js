var musicGenre = [];
var musicGenreCount = 0;
var musicArtistAll = [];
var musicArtistAllCount = 0;

Ext.define('genreInfo', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'type', type: 'string' },
        { name: 'index', type: 'string' },
        { name: 'id', type: 'int' },
        { name: 'genre', type: 'string' }
    ]
});

var storeGenre = Ext.create('Ext.data.Store', {
    model: 'genreInfo',
    folderSort: true,
    sorters: [{
        property: 'text',
        direction: 'ASC'
    }]
});


Ext.define('artistInfo', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'type', type: 'string' },
        { name: 'index', type: 'string' },
        { name: 'id', type: 'int' },
        { name: 'artist', type: 'string' }
    ]
});

var storeArtist = Ext.create('Ext.data.Store', {
    model: 'artistInfo',
    folderSort: true,
    sorters: [{
        property: 'text',
        direction: 'ASC'
    }]
});


Ext.define('albumInfo', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'type', type: 'string' },
        { name: 'index', type: 'string' },
        { name: 'id', type: 'int' },
        { name: 'album', type: 'string' }
    ]
});

var storeAlbum = Ext.create('Ext.data.Store', {
    model: 'albumInfo',
    folderSort: true,
    sorters: [{
        property: 'text',
        direction: 'ASC'
    }]
});

Ext.define('songInfo', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'artist', type: 'string' },
        { name: 'album', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'songid', type: 'int' }
    ]
});

var storeSongs = Ext.create('Ext.data.Store', {
    model: 'songInfo',
    folderSort: true,
    sorters: [{
        property: 'text',
        direction: 'ASC'
    }]
});

var gridGenre = Ext.create('Ext.grid.Panel', {
    //renderTo: Ext.getBody(),
    store: storeGenre,
    viewConfig: {
        copy: true,
        plugins: {
            ddGroup: 'mygroup',
            ptype: 'gridviewdragdrop',
            enableDrag: true
        },
        listeners: {
            itemclick: function(node, data, dropRec, dropPosition) {
                handleGenreRowClick(node, data, dropRec, dropPosition);
            }
        }
    },
    columns: [
        {
            text: 'Genre',
            width: 100,
            sortable: true,
            hideable: false,
            dataIndex: 'genre'
        }
    ],
    forceFit: true
});

var gridArtist = Ext.create('Ext.grid.Panel', {
    store: storeArtist,
    viewConfig: {
        copy: true,
        plugins: {
            ddGroup: 'mygroup',
            ptype: 'gridviewdragdrop',
            enableDrag: true
        },
        listeners: {
            itemclick: function(node, data, dropRec, dropPosition) {
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

var gridAlbum = Ext.create('Ext.grid.Panel', {
    store: storeAlbum,
    viewConfig: {
        copy: true,
        plugins: {
            ddGroup: 'mygroup',
            ptype: 'gridviewdragdrop',
            enableDrag: true
        },
        listeners: {
            itemclick: function(node, data, dropRec, dropPosition) {
                handleAlbumRowClick(node, data, dropRec, dropPosition);
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

var gridSongs = Ext.create('Ext.grid.Panel', {
    store: storeSongs,
    viewConfig: {
        copy: true,
        plugins: {
            ddGroup: 'mygroup',
            ptype: 'gridviewdragdrop',
            enableDrag: true
        }
    },
    columns: [
                { id: 'song', header: 'Title', sortable: true, dataIndex: 'title' },
                { id: 'artist', header: 'Artist', sortable: true, dataIndex: 'artist' },
                { id: 'album', header: 'Album', sortable: true, dataIndex: 'album' }
    ],
    forceFit: true
});

/********************* Initialize Music Lists **********************/

function InitializeMusicLib() {
    var obj = {
        "jsonrpc": "2.0",
        "method": "AudioLibrary.GetGenres",
        "id": 1
    };

    tempStr = Ext.encode(obj);
    Ext.Ajax.request({
        url: '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: getMusicLibGenreSuccess,
        failure: getMusicLibGenreFailure,
        timeout: interfaceTimeout
    });

    musicLibaryMessageBox.show({
        msg: 'Loading Artists...',
        wait: true,
        waitConfig: { interval: 200 },
        icon: 'ext-mb-download' //custom class in msg-box.html
    });

}

function getMusicLibGenreFailure(t) {
    musicLibaryMessageBox.hide();
    alert('getMusicLibGenreFailure t:' + t);
}

function getMusicLibGenreSuccess(t) {
    var response = Ext.decode(t.responseText);
    var responseCount = 0;

    if (response.result != null)
        responseCount = response.result.limits.total;

    musicGenreCount = 0;
    musicGenre[musicGenreCount] = new Array('genre', musicGenreCount, -1, 'All');
    musicGenreCount++;

    for (i = 1; i <= responseCount; i++) {

        tempNum = response.result.genres[i - 1].genreid;

        musicGenre[musicGenreCount] = new Array('genre', musicGenreCount, tempNum, response.result.genres[i - 1].label);
        musicGenreCount++;
    }

    musicLibraryGenreTotalCount = musicGenreCount;

    var obj = {
        "jsonrpc": "2.0",
        "method": "AudioLibrary.GetArtists",
        "id": 1
    };

    tempStr = Ext.encode(obj);
    Ext.Ajax.request({
        url: '/jsonrpc',
        method: 'POST',
        params: tempStr,
        headers: { 'Content-Type': 'application/json' },
        success: getMusicLibSuccess,
        failure: getMusicLibFailure,
        timeout: interfaceTimeout
    });

}

function getMusicLibFailure(t) {
    musicLibaryMessageBox.hide();
    alert('getMusicLibFailure t:' + t);
}

function entryInList(entry, list) {
    var i = 0;
    var found = false;

    while (!found && i < list.length) {
        if (list[i][2] == entry)
            return true;
        else
            i++;
    }

    return false;
}

function getMusicLibSuccess(t) {
    var i = 0;
    var index = 0;
    var tempIndexNumber = 0;
    var tempIndexCount = 0;

    var response = Ext.decode(t.responseText);
    var responseCount = 0;

    musicLibaryMessageBox.hide();

    if (response.result != null)
        responseCount = response.result.limits.total;

    musicArtistAllCount = 0;
    musicArtistAll[musicArtistAllCount] = new Array('artist', musicArtistAllCount, -1, 'All');
    musicArtistAllCount++;

    for (i = 0; i < responseCount; i++) {

        musicArtistAll[musicArtistAllCount] = new Array('artist', musicArtistAllCount, response.result.artists[i].artistid, response.result.artists[i].label);
        musicArtistAllCount++;
    }

    storeGenre.loadData(musicGenre, false);
}



function handleGenreRowClick(node, data, dropRec, dropPosition) {

    genreSelected = data.data.genre; //OK, we have our record
    genreIDSelected = data.data.id;

    if (genreSelected == 'All') {
        storeArtist.loadData(musicArtistAll);
    } else {

        var obj = {
            "jsonrpc": "2.0",
            "method": "AudioLibrary.GetArtists",
            "params": { "filter":{"genreid": genreIDSelected} },
            "id": 1
        };

        tempStr = Ext.encode(obj);
        Ext.Ajax.request({
            url: '/jsonrpc',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            params: tempStr,
            success: fillstoreArtist,
            failure: getMusicLibFailure,
            timeout: interfaceTimeout
        });
    }

    musicLibaryMessageBox.show({
        msg: 'Loading Artists...',
        wait: true,
        waitConfig: { interval: 200 },
        icon: 'ext-mb-download' //custom class in msg-box.html
    });

}

function entryInArtistList(entry) {
    var i = 0;
    var found = false;

    while (!found && i < musicArtist.length) {
        if (musicArtist[i][2] == entry)
            return true;
        else
            i++;
    }

    return false;
}

function fillstoreArtist(t) {
    var i = 0;

    var response = Ext.decode(t.responseText);

    storeArtist.removeAll();
    musicArtist = [];

    var previousEntry = "XXXXXXXX";
    var musicArtistCount = 0;
    musicArtist[musicArtistCount] = new Array('artist', musicArtistCount,-1, 'All');
    musicArtistCount++;

    musicLibaryMessageBox.hide();

    if (response.result != null) {
        for (i = 0; i < response.result.limits.total; i++) {

            if (response.result.artists[i].label != previousEntry) {
                // Check to see if entry is already in the genre list.
                if (!entryInArtistList(response.result.artists[i].label) && response.result.artists[i].label != "") {
                    musicArtist[musicArtistCount] = new Array('artist', musicArtistCount, response.result.artists[i].artistid, response.result.artists[i].label);
                    musicArtistCount++;
                }
            }

            previousEntry = response.result.artists[i].label;
        }

        storeArtist.loadData(musicArtist);
    }
    storeAlbum.removeAll();
    storeSongs.removeAll();
}


function entryInAlbumList(entry) {
    var i = 0;
    var found = false;

    while (!found && i < musicAlbum.length) {
        if (musicAlbum[i][2] == entry)
            return true;
        else
            i++;
    }

    return false;
}

function fillstoreSongs(songSelection) {

    var tempMusicLibrary = [];
    var musicSongCount = 0;

    storeSongs.removeAll();

    for (var i = 0; i < musicLibrary.length; i++) {
        if (musicLibrary[i][1] == songSelection || songSelection == "All") {
            tempMusicLibrary[musicSongCount] = musicLibrary[i];
            musicSongCount++;
        }
    }
    storeSongs.loadData(tempMusicLibrary);

}

function gatherSongs(t) {
    var i = 0;
    var tempMusicLibrary = [];
    var temp = [];
    var index = 0;

    musicLibaryMessageBox.hide();

    var response = Ext.decode(t.responseText);

    musicLibrary = [];

    for (i = 0; i < response.result.limits.total; i++) {
        musicLibrary[i] = new Array(response.result.songs[i].artist,
                                    response.result.songs[i].album,
                                    response.result.songs[i].title,
                                    response.result.songs[i].songid
        );
    }
    if (genreIDSelected != -1 && artistIDSelected == -1)
        storeSongs.loadData(musicLibrary);
}

function fillstoreAlbum(t) {
    var i = 0;
    var tempStart = 0;
    var tempSongCount = 0;

    musicAlbum = [];
    musicLibrary = [];

    var response = Ext.decode(t.responseText);

    var previousAlbumEntry = "XXXXXXXX";
    var musicAlbumCount = 0;

    musicAlbum[musicAlbumCount] = new Array('album', musicAlbumCount, -1, 'All');
    musicAlbumCount++;
    for (i = 0; i < response.result.limits.total; i++) {

        if (response.result.albums[i].label != previousAlbumEntry) {
            // Check to see if entry is already in the genre list.
            if (!entryInAlbumList(response.result.albums[i].label)) {
                musicAlbum[musicAlbumCount] = new Array('album', musicAlbumCount, response.result.albums[i].albumid, response.result.albums[i].label);
                musicAlbumCount++;
            }
        }
        previousAlbumEntry = response.result.albums[i].label;

    }

    storeAlbum.loadData(musicAlbum);

    var paramsObj = {};

    if (genreIDSelected == -1)
        if (artistIDSelected == -1)
            paramsObj = { "properties": ["genre", "artist", "album", "file", "title", "duration"] };
        else
            paramsObj = { "filter": { "artistid": artistIDSelected }, "properties": ["genre", "artist", "album", "file", "title", "duration"] };
    else
        paramsObj = { "filter": { "artistid": artistIDSelected }, "properties": ["genre", "artist", "album", "file", "title", "duration"] };

    var obj = {
        "jsonrpc": "2.0",
        "method": "AudioLibrary.GetSongs",
        "params": paramsObj,
        "id": 1
    };

    tempStr = Ext.encode(obj);
    Ext.Ajax.request({
        url: '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: gatherSongs,
        failure: getMusicLibFailure,
        timeout: interfaceTimeout
    });

}

function handleArtistRowClick(node, data, dropRec, dropPosition) {

    artistSelected = data.data.artist; //OK, we have our record
    artistIDSelected = data.data.id;

    var paramsObj = {};

    if (genreIDSelected == -1)
        if (artistIDSelected == -1)
        paramsObj = {};
    else
        paramsObj = { "filter": { "artistid": artistIDSelected} };
    else
        if (artistIDSelected == -1)
        paramsObj = { "filter": { "genreid": genreIDSelected} };
    else
        paramsObj = { "filter": { "artistid": artistIDSelected} };

    var obj = {
        "jsonrpc": "2.0",
        "method": "AudioLibrary.GetAlbums",
        "params": paramsObj,
        "id": 1
    };

    tempStr = Ext.encode(obj);
    Ext.Ajax.request({
        url: '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: fillstoreAlbum,
        failure: getMusicLibFailure,
        timeout: interfaceTimeout
    });

    musicLibaryMessageBox.show({
        msg: 'Loading Albums...',
        wait: true,
        waitConfig: { interval: 200 },
        closable: true,
        closeAction: 'hide',
        icon: 'ext-mb-download' //custom class in msg-box.html
    });
}


function handleAlbumRowClick(node, data, dropRec, dropPosition) {

    albumSelected = data.data.album; //OK, we have our record
    albumIDSelected = data.data.id;

    fillstoreSongs(albumSelected);
}

var musicLibaryMessageBox = Ext.create('Ext.window.MessageBox', {
    width: 300,
    height: 100
});
