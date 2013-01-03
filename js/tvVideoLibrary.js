var videoTVLibraryCount = 0;
var videoTVLibrary = [];
var videoTVSeason = [];
var videoTVEpisode = [];

Ext.define('TVShowLibraryInfo', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'showtitle', type: 'string' },
        { name: 'year', type: 'string' },
        { name: 'tvshowid', type: 'int' },
        { name: 'type', type: 'string' }
    ]
});

var storeTVShowLibrary = Ext.create('Ext.data.Store', {
    model: 'TVShowLibraryInfo',
    folderSort: true,
    sorters: [{
        property: 'text',
        direction: 'ASC'
    }]
});

var gridTVVideo = Ext.create('Ext.grid.Panel', {
    //renderTo: Ext.getBody(),
    store: storeTVShowLibrary,
    viewConfig: {
        copy: true,
        plugins: {
            ddGroup: 'mygroup',
            ptype: 'gridviewdragdrop',
            enableDrag: true
        },
        listeners: {
            itemclick: function(node, data, dropRec, dropPosition) {
                handleShowRowClick(node, data, dropRec, dropPosition);
            }
        }
    },
    columns: [
        {
            text: 'Title',
            sortable: true,
            hideable: false,
            dataIndex: 'showtitle'
        },
        {
            text: 'Year',
            sortable: true,
            hideable: false,
            dataIndex: 'year'
        }
    ],
    forceFit: true
});

Ext.define('storeSeasonInfo', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'tvshowid', type: 'int' },
        { name: 'season', type: 'int' },
        { name: 'label', type: 'string' },
        { name: 'type', type: 'string' }
    ]
});

var storeSeason = Ext.create('Ext.data.Store', {
    model: 'storeSeasonInfo',
    folderSort: true,
    sorters: [{
        property: 'text',
        direction: 'ASC'
    }]
});

var gridTVVideoSeason = Ext.create('Ext.grid.Panel', {
    store: storeSeason,
    viewConfig: {
        copy: true,
        plugins: {
            ddGroup: 'mygroup',
            ptype: 'gridviewdragdrop',
            enableDrag: true
        },
        listeners: {
            itemclick: function(node, data, dropRec, dropPosition) {
                handleSeasonRowClick(node, data, dropRec, dropPosition);
            }
        }
    },
    columns: [
        { 
            header: 'Season', 
            sortable: true, 
            dataIndex: 'label' 
        }
    ],
    forceFit: true
});


Ext.define('storeEpisodesInfo', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'tvshowid', type: 'int' },
        { name: 'season', type: 'string' },
        { name: 'label', type: 'string' },
        { name: 'episode', type: 'int' },
        { name: 'episodeid', type: 'int'},
        { name: 'watched', type: 'string' },
        { name: 'idFile', type: 'string' },
        { name: 'type', type: 'string' }
    ]
});

var storeEpisodes = Ext.create('Ext.data.Store', {
    model: 'storeEpisodesInfo',
    folderSort: true,
    sorters: [{
        property: 'text',
        direction: 'ASC'
    }]
});


var gridTVVideoEpisodes = Ext.create('Ext.grid.Panel', {
    store: storeEpisodes,
    viewConfig: {
        copy: true,
        plugins: {
            ddGroup: 'mygroup',
            ptype: 'gridviewdragdrop',
            enableDrag: true
        },
        listeners: {
            itemclick: function(node, data, dropRec, dropPosition) {
                //handleShowRowClick(node, data, dropRec, dropPosition);
            }
        }
    },
    columns: [
        { header: 'E #', width: 30, dataIndex: 'episode' },
        { header: 'P #', width: 30, dataIndex: 'watched' },
        { header: 'Title', sortable: true, dataIndex: 'label' },
        {
            xtype: 'actioncolumn',
            width: 25,
            items: [{
                icon: 'images/information.png',  // Use a URL in the icon config
                //iconCls: 'icon-remove',
                tooltip: 'Remove Song',
                handler: function(grid, rowIndex, colIndex) {
                    showEpisodeInfo(storeEpisodes.getAt(rowIndex));
                }
            }]
        }
    ],
    forceFit: true
});

/********************* Fill in TV Show Library *****************/

function InitializeTVShowLib() {
    var obj = {
        "jsonrpc": "2.0",
        "method": "VideoLibrary.GetTVShows",
        "params": { "properties": [
                "year"
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
        success: getTVShowSuccess,
        failure: getTVShowFailure,
        timeout: interfaceTimeout
    });

    tvvideoMessageBox.show({
        msg: 'Loading TV Videos...',
        wait: true,
        waitConfig: { interval: 200 },
        icon: 'ext-mb-download' //custom class in msg-box.html
    });
}

function getTVShowFailure(t) {
    tvvideoMessageBox.hide();
    alert('getVideoLibFailure t:' + t);
}


function getTVShowSuccess(t) {
    var response = Ext.decode(t.responseText);
    var videoTVLibraryCount = 0;

    tvvideoMessageBox.hide();

    if (response.result != null)
        videoTVLibraryCount = response.result.limits.total;

    for (i = 0; i < videoTVLibraryCount; i++) {
        videoTVLibrary[i] = new Array(
                response.result.tvshows[i].label,      // showtitle
                response.result.tvshows[i].year,       // season
                response.result.tvshows[i].tvshowid,   // tvshowid
				"tvshow"
                );
    }

    storeTVShowLibrary.loadData(videoTVLibrary);
    //gridTVVideo.addListener("rowclick", handleShowRowClick);

}


function handleShowRowClick(node, data, dropRec, dropPosition) {

    tvshowid = data.data.tvshowid; //OK, we have our record

    var obj = {
        "jsonrpc": "2.0",
        "method": "VideoLibrary.GetSeasons",
        "params": { "tvshowid": tvshowid, "properties": ["season"] },
        "id": tvshowid
    };

    tempStr = Ext.encode(obj);
    Ext.Ajax.request({
        url: '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: fillstoreSeason,
        failure: getMusicLibFailure,
        timeout: interfaceTimeout
    });

}

function fillstoreSeason(t) {
    var i = 0;

    var response = Ext.decode(t.responseText);

    storeSeason.removeAll();
    videoTVSeason = [];

    var videoTVSeasonCount = 0;
    //videoTVSeason[videoTVSeasonCount] = new Array('Season', -1, 'All');
    //videoTVSeasonCount++;
    if (response.result != null) {
        for (i = 0; i < response.result.limits.total; i++) {
            videoTVSeason[videoTVSeasonCount] = new Array(
                response.id,        //tvshowid
                response.result.seasons[i].season,
                response.result.seasons[i].label,
				"tvseason"
                );
            videoTVSeasonCount++;

        }
        storeSeason.loadData(videoTVSeason);
    }

    //gridTVVideoSeason.addListener("rowclick", handleSeasonRowClick);

    storeEpisodes.removeAll();

}

function handleSeasonRowClick(node, data, dropRec, dropPosition) {

    tvshowid = data.data.tvshowid; //OK, we have our record
    season = data.data.season; //OK, we have our record

    var obj = {
        "jsonrpc": "2.0",
        "method": "VideoLibrary.GetEpisodes",
        "params": { "tvshowid": tvshowid, "season": season, "properties": ["season", "file", "episode", "playcount"], "sort": { "method": "episode"} },
        "id": tvshowid
    };

    tempStr = Ext.encode(obj);
    Ext.Ajax.request({
        url: '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: fillstoreEpisodes,
        failure: getMusicLibFailure,
        timeout: interfaceTimeout
    });

}

function fillstoreEpisodes(t) {
    var i = 0;

    var response = Ext.decode(t.responseText);

    storeEpisodes.removeAll();
    videoTVEpisodes = [];

    for (i = 0; i < response.result.limits.total; i++) {
        videoTVEpisodes[i] = new Array(
            response.id,        //tvshowid
            response.result.episodes[i].season,
            response.result.episodes[i].label,
            response.result.episodes[i].episode,
            response.result.episodes[i].episodeid,
            response.result.episodes[i].playcount,
            response.result.episodes[i].file,
			"tvepisode"
            );
    }
    storeEpisodes.loadData(videoTVEpisodes);
}

var tvvideoMessageBox = Ext.create('Ext.window.MessageBox', {
    width: 300,
    height: 100
});
