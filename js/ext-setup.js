Ext.onReady(function() {

    var viewport = Ext.create('Ext.Viewport', {
        layout: {
            type: 'border',
            padding: 5
        },
        defaults: {
            split: true
        },
        items: [
        {
            region: 'east',
            collapsible: true,
            floatable: true,
            split: true,
            width: '25%',
            tbar: playlistControlbar,
            bbar: playlistStatusbar,
            title: 'Playlist',
            layout: 'fit',          
            items: [
                gridMusicPlaylist
            ]
        },
        {
            region: 'center',
            minHeight: 80,
            layout: 'border',
            items: [
                {
                    region: 'north',
                    split: true,
                    title: 'XBMControl Web v1.1.0',
                    height: 170,
                    contentEl: 'tester'
                },{ 
                    region: 'center',
                    margins: '0 0 0 0',
                    autoScroll: true,
                    layout: 'fit',
               		tbar: mediaLibraryStatusbar,
               		items:
                    [{
                        xtype: 'grouptabpanel',
                        tabWidth: 50,
                        activeGroup: 0,
                        margins: '0 0 0 0',
                        listeners: {
                            'beforegroupchange': function( grouptabPanelTemp, newGroup, oldGroup, comp, tab) {
                                setPlaylistType(newGroup.initialConfig.title);
                            },
                            'beforetabchange': function (grouptabPanelTemp, newGroup, oldGroup, comp, tab) {
                                setStoresType(newGroup.initialConfig.title);
                            },
                            scope: this
                        },
                        items: [{
                                mainitem: 1,
    		                    title: 'Music',
    		                    items: [{    			                    
    				                        title: 'Music',
    				                        items: []
    			                        }, {
    				                        title: 'Files',
    				                        iconCls: 'icon-look-folders',
    				                        layout: 'border',
    				                        split: 'true',
    				                        items: [{
    				                            region: 'center',
    				                            split: true,
    				                            layout: 'fit',
    				                            margins: '0 0 0 0',
    				                            items: sharesMusicTree
                                            }]	
    			                        }, {
    				                        title: 'Library',
    				                        iconCls: 'icon-look-library',
    				                        layout: 'border',
    				                        frame: 'true',
    				                        split: 'true',
    				                        items: [{
     				                            region: 'west',
     				                            width: '25%',
     				                            layout: 'fit',
     				                            split: true,
     				                            margins: '0 0 0 0',
     				                            items: gridGenre
     				                        },
                                            {
                                                region: 'center',
                                                layout: 'fit',
                                                split: true,
                                                margins: '0 0 0 0',
                                                items: gridArtist
                                            },
                                            {
                                                region: 'east',
                                                width: '33%',
                                                layout: 'fit',
                                                split: true,
                                                margins: '0 0 0 0',
                                                items: gridAlbum
                                            }, {
                                                region: 'south',
                                                split: true,
                                                autoScroll: true,
                                                height: 300,
                                                //title: 'Media List',
                                                layout: 'fit',
                                                collapsible: true,
                                                items: gridSongs
                                            }]
    			                        }, {
    			                            title: 'Search',
    			                            iconCls: 'icon-information',
    			                            layout: 'border',
    			                            frame: 'true',
    			                            split: 'true',
    			                            items: [{
    			                                region: 'west',
    			                                width: '33%',
    			                                //layout: 'fit',
    			                                split: true,
    			                                margins: '0 0 0 0',
    			                                items: [{  
    			                                    xtype: 'textfield',
    			                                    fieldLabel: 'Artist',
    			                                    id: 'artistname',
    			                                    listeners: {
    			                                        scope: this,
    			                                        specialkey: function (f, e) {
    			                                            if (e.getKey() == e.ENTER) {
    			                                                buttonSearchMusicLibrary();
    			                                            }
    			                                        }
    			                                    }
    			                                }, {
                                                    xtype: 'textfield',
    			                                    fieldLabel: 'Album',
    			                                    id: 'albumname',
    			                                    listeners: {
    			                                        scope: this,
    			                                        specialkey: function (f, e) {
    			                                            if (e.getKey() == e.ENTER) {
    			                                                buttonSearchMusicLibrary();
    			                                            }
    			                                        }
    			                                    }
    			                                }, {
    			                                    xtype: 'textfield',
    			                                    fieldLabel: 'Song',
    			                                    id: 'songname',
    			                                    listeners: {
    			                                        scope: this,
    			                                        specialkey: function (f, e) {
    			                                            if (e.getKey() == e.ENTER) {
    			                                                buttonSearchMusicLibrary();
    			                                            }
    			                                        }
    			                                    }
    			                                },
    			                                navButtonSearch]
    			                            },
                                            {
                                                region: 'center',
                                                layout: 'fit',
                                                split: true,
                                                margins: '0 0 0 0',
                                                items: gridSearchArtist
                                            },
                                            {
                                                region: 'east',
                                                width: '33%',
                                                layout: 'fit',
                                                split: true,
                                                margins: '0 0 0 0',
                                                items: gridSearchAlbum
                                            }, {
                                                region: 'south',
                                                split: true,
                                                autoScroll: true,
                                                height: 300,
                                                //title: 'Media List',
                                                layout: 'fit',
                                                collapsible: true,
                                                items: gridSearchSongs
                                            }]
    			                        }]
                                }, {
                                title: 'Video',
                                items: [{
                                            title: 'Video',
                                            items: []
                                        }, {
                                            title: 'Files',
                                            iconCls: 'icon-look-folders',
                                            layout: 'border',
                                            split: 'true',
                                            layout: 'border',
                                            split: 'true',
                                            items: [{
                                                region: 'center',
                                                split: true,
                                                layout: 'fit',
                                                margins: '0 0 0 0',
                                                items: sharesVideoTree
                                            }]
                                        }, {
                                            title: 'Library',
                                            iconCls: 'icon-look-library',
                                            layout: 'border',
                                            frame: 'true',
                                            split: 'true',
                                            items: [
    				                        {
    				                            region: 'west',
    				                            width: '25%',
    				                            layout: 'fit',
    				                            split: true,
    				                            margins: '0 0 0 0',
    				                            items: gridVideoGenre
    				                        },
                                    		{
                                    		    region: 'center',
                                    		    layout: 'fit',
                                    		    split: true,
                                    		    margins: '0 0 0 0',
                                    		    items: gridVideo
                                            }]
                                        }]
                                }, {
                                items: [{
                                            title: 'TV Shows',
                                            items: []
                                        }, {
                                            title: 'Library',
                                            iconCls: 'icon-look-library',
                                            layout: 'border',
                                            frame: 'true',
                                            split: 'true',
                                            items: [
    				                            {
    				                                region: 'west',
    				                                width: '40%',
    				                                layout: 'fit',
    				                                split: true,
    				                                margins: '0 0 0 0',
    				                                items: gridTVVideo
    				                            },
                                                {
                                                    region: 'center',
                                                    layout: 'fit',
                                                    split: true,
                                                    margins: '0 0 0 0',
                                                    items: gridTVVideoSeason
                                                },
                                                {
                                                    region: 'east',
                                                    width: '33%',
                                                    layout: 'fit',
                                                    split: true,
                                                    margins: '0 0 0 0',
                                                    items: gridTVVideoEpisodes
                                                }                                            
                                            ]
                                        }]
                        }]
		            }]
            }]
            
            
        }]
    });

    GetIntroRetroSpec();
});

var playStatusWindow;
/*
var playStatusWindow = Ext.create('Ext.Window', {
    title: 'Right Header, plain: true',
    width: '100%',
    height: '100%',
//    x: 450,
//    y: 200,
    headerPosition: 'right',
    layout: 'fit',
    items: {
        border: false
    }
});
*/

var navButtonSearch = Ext.create('Ext.Button', {
    text: 'Search',
    handler: function () {
        buttonSearchMusicLibrary();
    }
});


var navButtonClearPlaylistVideo = Ext.create('Ext.Button', {
    text: 'Clear Playlist',
    handler: function() {
        buttonClearPlayList();
    }
});

var navButtonReloadPlaylistMusic = Ext.create('Ext.Button', {
    text: 'Refresh Playlist',
    handler: function() {
        updatePlaylistTree();
    }
});

var navButtonSetFullScreen = Ext.create('Ext.Button', {
    text: 'FullScreen',
    handler: function () {
        buttonFullScreen();
    }
});

var navButtonScreen = Ext.create('Ext.Button', {
    text: 'Select Screen',
    qtip: 'Choose screen',
    menu: [ {text: 'Home', handler: function() {buttonScreen('home')}},
	        {text: 'Weather', handler: function() {buttonScreen('weather')} },
	        { text: 'Music', handler: function() {buttonScreen('music') } }]
});

function refreshXBMCMusicLibraries(t) {
    var obj = {
        "jsonrpc": "2.0",
        "method": "AudioLibrary.Scan",
        "id": 1
    };

    tempStr = Ext.encode(obj);
    Ext.Ajax.request({
        url: clientAddr + '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: refreshMusicLibrarySuccess,
        failure: refreshMusicLibraryFailure,
        timeout: interfaceTimeout
    });
}


function refreshMusicLibraryFailure(t) {
    alert('refreshLibraryFailure t:' + t);
}

function refreshMusicLibrarySuccess(t) {
}

function refreshXBMCVideoLibraries(t) {
    var obj = {
        "jsonrpc": "2.0",
        "method": "VideoLibrary.Scan",
        "id": 1
    };

    tempStr = Ext.encode(obj);
    Ext.Ajax.request({
        url: clientAddr + '/jsonrpc',
        method: 'POST',
        params: tempStr,
        headers: { 'Content-Type': 'application/json' },
        success: refreshVideoLibrarySuccess,
        failure: refreshVideoLibraryFailure,
        timeout: interfaceTimeout
    });
}

function refreshVideoLibraryFailure(t) {
    alert('refreshLibraryFailure t:' + t);
}

function refreshVideoLibrarySuccess(t) {
}

function refreshMediaLibraries(t) {
    InitializeMusicLib();
    InitializeMovieLib();
    InitializeTVShowLib();
    updatePlaylistTree();
}

var navButtonReloadLibraries = new Ext.Button({
    text: 'Refresh Libraries',
    qtip: 'Refresh the Music, Video Libraries',
	menu: [ {text: 'Refesh XBMControl', handler: refreshMediaLibraries},
	        {text: 'Refresh XBMC Music', handler: refreshXBMCMusicLibraries},
	        {text: 'Refresh XBMC Video', handler: refreshXBMCVideoLibraries} ] 
});

var playlistStatusbar = Ext.create('Ext.toolbar.Toolbar', {
    items: [
        {
            id: 'playlistStatus',
            text: '0 items' 
        },
        '-',
        { 
            id: 'playlistIndex',
            text: 'Index: 0' 
        },
        '-',
        navButtonClearPlaylistVideo,
        '-',
        navButtonReloadPlaylistMusic
    ]
});


var navButtonLoadPlaylistMusic = Ext.create('Ext.Button', {
    text: 'Load Playlist',
    //scope   : this,
    handler: function() {
        buttonLoadPlayList();
    }
});

var playlistControlbar = Ext.create('Ext.toolbar.Toolbar', {
    items: [
        navButtonLoadPlaylistMusic,
    ]
});


var mediaLibraryStatusbar = Ext.create('Ext.toolbar.Toolbar', {
    id: 'statusBar',
    items: [
        navButtonSetFullScreen,
        '->',
        navButtonScreen,
        navButtonReloadLibraries
    ]
});

/****************** buttonFullScreen **************************/

function buttonFullScreen() {
    var obj = {
        "jsonrpc": "2.0",
        "method": "GUI.SetFullscreen",
        "params": {
            "fullscreen": "toggle"
        },
        "id": 1
    };

    tempStr = Ext.encode(obj);

    Ext.Ajax.request({
        url: clientAddr + '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: buttonFullscreenSuccess,
        failure: buttonFullscreenFailure,
        timeout: interfaceTimeout
    });
}

function buttonFullscreenFailure(t) {
    alert('buttonClearPlayListFailure failure t:' + t);
}

function buttonFullscreenSuccess(t) {
    var response = Ext.decode(t.responseText);
}


/****************** buttonScreenWeather **************************/

function buttonScreen(inputScreen) {

    var obj = {
        "jsonrpc": "2.0",
        "method": "GUI.ActivateWindow",
        "params": {
            "window": inputScreen
        },
        "id": 1
    };

    tempStr = Ext.encode(obj);

    Ext.Ajax.request({
        url: clientAddr + '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: buttonScreenSuccess,
        failure: buttonScreenFailure,
        timeout: interfaceTimeout
    });
}

function buttonScreenFailure(t) {
    alert('buttonScreenFailure failure t:' + t);
}

function buttonScreenSuccess(t) {
    var response = Ext.decode(t.responseText);
}

