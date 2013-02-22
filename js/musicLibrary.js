var musicGenre = [];
var musicGenreCount = 0;

Ext.define('genreInfo', {
    extend: 'Ext.data.Model',
    fields: [
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
    musicLibaryMessageBox.show({
        msg: 'Loading Genres...',
        wait: true,
        waitConfig: { interval: 200 },
        icon: 'ext-mb-download' //custom class in msg-box.html
    });

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


}

function getMusicLibGenreFailure(t) {
    musicLibaryMessageBox.hide();
    alert('getMusicLibGenreFailure t:' + t);
}

function getMusicLibGenreSuccess(t) {
    var response = Ext.decode(t.responseText);
    var responseCount = 0;

    musicLibaryMessageBox.hide();

    if (response.result != null)
        responseCount = response.result.limits.total;

    musicGenreCount = 0;
    musicGenre[musicGenreCount] = new Array(-1, 'All');
    musicGenreCount++;

    for (i = 1; i <= responseCount; i++) {

        musicGenre[musicGenreCount] = new Array(response.result.genres[i - 1].genreid, response.result.genres[i - 1].label);
        musicGenreCount++;
    }

    musicLibraryGenreTotalCount = musicGenreCount;

    storeGenre.loadData(musicGenre, false);

}

function getMusicLibFailure(t) {
    musicLibaryMessageBox.hide();
    alert('getMusicLibFailure t:' + t);
}

function handleGenreRowClick(node, data, dropRec, dropPosition) {

    genreSelected = data.data.genre; //OK, we have our record
    genreIDSelected = data.data.id;

    musicLibaryMessageBox.show({
        msg: 'Loading Artists...',
        wait: true,
        waitConfig: { interval: 200 },
        icon: 'ext-mb-download' //custom class in msg-box.html
    });

    if (musicStoresType == "Search") {
        storeSearchArtist.removeAll();
    } else {
        storeArtist.removeAll();
    }

    if (genreSelected == 'All') {
        var obj = {
            "jsonrpc": "2.0",
            "method": "AudioLibrary.GetArtists",
            "params": { "limits": { "end": entryMaxAmmount, "start": 0 } },
            "id": 1
        };
    } else {
        var obj = {
            "jsonrpc": "2.0",
            "method": "AudioLibrary.GetArtists",
            "params": { "filter": { "genreid": genreIDSelected }, "limits": { "end": entryMaxAmmount, "start": 0 } },
            "id": 1
        };

    }

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

function fillstoreArtist(t) {
    var i = 0;

    var response = Ext.decode(t.responseText);

    musicArtist = [];

    var musicArtistCount = response.result.limits.end - response.result.limits.start;
   
    if (response.result != null) {
        for (i = 0; i < musicArtistCount; i++) {

             musicArtist[i] = new Array(response.result.artists[i].artistid, response.result.artists[i].label);
        }

        if (musicStoresType == "Search") {
            storeSearchArtist.add(musicArtist);
        } else {
            storeArtist.add(musicArtist);
        }
    }

    if (response.result.limits.end >= response.result.limits.total) {
        musicLibaryMessageBox.hide();

        if (musicStoresType == "Search") {
            storeSearchAlbum.removeAll();
            storeSearchSongs.removeAll();
        } else {
            storeAlbum.removeAll();
            storeSongs.removeAll();
        }
    } else {
        var tempNum = response.result.limits.total - response.result.limits.end;
        if (tempNum > entryMaxAmmount)
            tempNum = entryMaxAmmount;
        var tempStart = response.result.limits.end;
        var tempEnd = response.result.limits.end + tempNum;

        if (genreIDSelected == -1) {
            var obj = {
                "jsonrpc": "2.0",
                "method": "AudioLibrary.GetArtists",
                "params": { "limits": { "end": tempEnd, "start": tempStart } },
                "id": 1
            };
        } else {
            var obj = {
                "jsonrpc": "2.0",
                "method": "AudioLibrary.GetArtists",
                "params": { "filter": { "genreid": genreIDSelected }, "limits": { "end": tempEnd, "start": tempStart } },
                "id": 1
            };

        }

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

    for (var i = 0; i < musicLibrary.length; i++) {
        if (musicLibrary[i][1] == songSelection || songSelection == "All") {
            tempMusicLibrary[musicSongCount] = musicLibrary[i];
            musicSongCount++;
        }
    }
    if (musicStoresType == "Search") {
        storeSearchSongs.removeAll();
        storeSearchSongs.loadData(tempMusicLibrary);
    } else {
        storeSongs.removeAll();
        storeSongs.loadData(tempMusicLibrary);
    }

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
    if (genreIDSelected != -1 && artistIDSelected == -1) {
            storeSongs.loadData(musicLibrary);
    }
    if (musicStoresType == "Search") {
        //storeSearchSongs.loadData(musicLibrary);
        storeSearchSongs.removeAll();
    }
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

    for (i = 0; i < response.result.limits.total; i++) {

        if (response.result.albums[i].label != previousAlbumEntry) {
            // Check to see if entry is already in the genre list.
            if (!entryInAlbumList(response.result.albums[i].label)) {
                musicAlbum[musicAlbumCount] = new Array(response.result.albums[i].albumid, response.result.albums[i].label);
                musicAlbumCount++;
            }
        }
        previousAlbumEntry = response.result.albums[i].label;

    }

    if (musicStoresType == "Search") {
        storeSearchAlbum.loadData(musicAlbum);
    } else {
        storeAlbum.loadData(musicAlbum);
    }

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
