var videoGenre = [];
var videoGenreCount = 0;
var videoLibraryCount = 0;
var videoLibrary = [];


Ext.define('genreVideoInfo', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'type', type: 'string' },
        { name: 'index', type: 'string' },
        { name: 'id', type: 'int' },
        { name: 'genre', type: 'string' }
    ]
});

var storeVideoGenre = Ext.create('Ext.data.Store', {
    model: 'genreVideoInfo',
    folderSort: true,
    sorters: [{
        property: 'text',
        direction: 'ASC'
    }]
});

var gridVideoGenre = Ext.create('Ext.grid.Panel', {
    //renderTo: Ext.getBody(),
    store: storeVideoGenre,
    viewConfig: {
        copy: true,
        plugins: {
            ddGroup: 'mygroup',
            ptype: 'gridviewdragdrop',
            enableDrag: true
        },
        listeners: {
            itemclick: function(node, data, dropRec, dropPosition) {
                handleVideoGenreRowClick(node, data, dropRec, dropPosition);
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

Ext.define('videoLibraryInfo', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'index' },
        { name: 'id' },
        { name: 'title' },
        { name: 'year' },
        { name: 'genre' },
        { name: 'file' },
        { name: 'type' }
    ]
});

var storeVideoLibrary = Ext.create('Ext.data.Store', {
    model: 'videoLibraryInfo',
    folderSort: true,
    sorters: [{
        property: 'text',
        direction: 'ASC'
    }]
});

/*
var gridVideo = new Ext.grid.GridPanel({
    store: storeVideoLibrary,
    columns: [
                { header: 'Title', id: 'title', sortable: true, dataIndex: 'title' },
                { header: 'Year', id: 'year', sortable: true, dataIndex: 'year' },
                gridVideoAction
            ],
    plugins: [gridVideoAction],
    autoExpandColumn: 'title',
    enableDrag: true,
    ddGroup: 'mygroup',
    fitHeight: true
});
*/

var gridVideo = Ext.create('Ext.grid.Panel', {
    //renderTo: Ext.getBody(),
    store: storeVideoLibrary,
    viewConfig: {
        copy: true,
        plugins: {
            ddGroup: 'mygroup',
            ptype: 'gridviewdragdrop',
            enableDrag: true
        },
        listeners: {
            itemclick: function(node, data, dropRec, dropPosition) {
                //handleVideoGenreRowClick(node, data, dropRec, dropPosition);
            }
        }
    },
    columns: [
        {
            text: 'Title',
            id: 'title',
            //width: 100,
            sortable: true,
            hideable: false,
            dataIndex: 'title'
        },
        {
            text: 'Year',
            id: 'year',
            //width: 100,
            sortable: true,
            hideable: false,
            dataIndex: 'year'
        },
        {
            xtype: 'actioncolumn',
            width: 25,
            items: [{
                icon: 'images/information.png',  // Use a URL in the icon config
                //iconCls: 'icon-remove',
                tooltip: 'Remove Song',
                handler: function(grid, rowIndex, colIndex) {
                    showMovieInfo(storeVideoLibrary.getAt(rowIndex));
                }
            }]
        }
    ],
    forceFit: true
});

/********************* Fill in Movie Library *****************/

function InitializeMovieLib() {
    var obj = {
        "jsonrpc": "2.0",
        "method": "VideoLibrary.GetGenres",
        "params": {
            "type": "movie"
        },
        "id": 1
    };

    tempStr = Ext.encode(obj);
    Ext.Ajax.request({
        url: '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: getVideoLibGenreSuccess,
        failure: getVideoLibFailure,
        timeout: interfaceTimeout
    });
}

function getVideoLibGenreSuccess(t) {
    var response = Ext.decode(t.responseText);
    var responseCount = 0;

    if (response.result != null)
        responseCount = response.result.limits.total;

    videoGenreCount = 0;
    videoGenre[videoGenreCount] = new Array('genre', videoGenreCount, -1, 'All');
    videoGenreCount++;

    for (i = 1; i <= responseCount; i++) {

        tempNum = response.result.genres[i - 1].genreid;
        //tempNum = parseInt(tempStr);
        videoGenre[videoGenreCount] = new Array('genre', videoGenreCount, tempNum, response.result.genres[i - 1].label);
        videoGenreCount++;
    }

    var obj = {
        "jsonrpc": "2.0",
        "method": "VideoLibrary.GetMovies",
        "params": { "properties": [                
                "title",
                "genre",
                "year",
                "file"
            ]
        },
        "id": 1
    };

    tempStr = Ext.encode(obj);
    Ext.Ajax.request({
        url: '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: GetMovieLibSuccess,
        failure: getVideoLibFailure,
        timeout: interfaceTimeout
    });

}


function getVideoLibFailure(t) {
    alert('getVideoLibFailure t:' + t);
}


function GetMovieLibSuccess(t) {
    var response = Ext.decode(t.responseText);
    var videoLibraryCount = 0;

    if (response.result != null)
        videoLibraryCount = response.result.limits.total;

    for (i = 0; i < videoLibraryCount; i++) {

        videoLibrary[i] = new Array(i,
                                    response.result.movies[i].movieid,      // idMovie
                                    response.result.movies[i].title,        // title
                                    response.result.movies[i].year,         // Year
                                    response.result.movies[i].genre,        // Genre
                                    response.result.movies[i].file,         // strPath
                                    "video"									// Type
                                    );
    }

    storeVideoLibrary.loadData(videoLibrary);
    storeVideoGenre.loadData(videoGenre);
}


function handleVideoGenreRowClick(node, data, dropRec, dropPosition) {

    var tempMovieList = [];
    var tempMovieCount = 0;

    storeVideoLibrary.removeAll();

    genreSelected = data.data.genre; //OK, we have our record
    genreIDSelected = data.data.id;

    if (genreSelected == 'All') {
        storeVideoLibrary.loadData(videoLibrary);
        return;
    } else {

        for (i = 0; i < videoLibrary.length; i++) {

            for (j = 0; j < videoLibrary[i][4].length; j++) {
                if (videoLibrary[i][4][j] == genreSelected) {
                    tempMovieList[tempMovieCount] = videoLibrary[i];
                    tempMovieCount++;
                }
            }
        }

    }
    storeVideoLibrary.loadData(tempMovieList);
}


