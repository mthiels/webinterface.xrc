
var interfaceTimeout = 30000;
var retrospect = null;
var nodeId = 1;
var currentPlaylist = 'Music';
var currentNodeSelected = 0;

/********************* Generic JSON function call *****************/
function xbmcComm(method, successComm, failureComm) {

    var obj = {
        "jsonrpc": "2.0",
        "method": method,
        "id": 1
    };

    var inputUrl = '/jsonrpc';
    var tempStr = Ext.encode(obj);

    Ext.Ajax.request({
        url: inputUrl,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: successComm,
        failure: failureComm,
        timeout: interfaceTimeout
    });
}

/********************* JSONRPC.Introspect **********************/
function GetIntroRetroSpec() {
    xbmcComm("JSONRPC.Introspect", successIntroSpec, failureIntroSpec);
}

function successIntroSpec(t) {
    retrospect = Ext.decode(t.responseText);
    connectToMediaServer();
}

function failureIntroSpec(t) {
    var response = Ext.decode(t.responseText);
}


/********************* connectToMediaServer ***********************/

// First set the response format for the API back to default.
function connectToMediaServer() {
  //  debugger;
    InitializeWidgets();
    getShares("music");
    getShares("video");
    currentlyPlayingTask.start();
    updatePlaylistTree();
    InitializeMusicLib();
    InitializeMovieLib();
    InitializeTVShowLib();     
    getVolume();
}

