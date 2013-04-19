
function getAddons() {
    var obj = {
        "jsonrpc": "2.0",
        "method": "Addons.GetAddons",
        "params": {
//            "type": "movie"
        },
        "id": 1
    };

    tempStr = Ext.encode(obj);
    Ext.Ajax.request({
        url: '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: getAddOnSuccess,
        failure: getAddOnFailure,
        timeout: interfaceTimeout
    });
}

function getAddOnSuccess(t) {
    var response = Ext.decode(t.responseText);

}


function getAddOnFailure(t) {
    addOnMessageBox.hide();
    alert('getVideoLibFailure t:' + t);
}


var addOnMessageBox = Ext.create('Ext.window.MessageBox', {
    width: 300,
    height: 100
});


//"plugin.audio.radio_de"

//{ "jsonrpc": "2.0", "method": "Addons.ExecuteAddon", "params": { "wait": false, "addonid": "plugin.video.plexbmc", "params": { "url": "http://192.168.1.100:32400/library/metadata/1", "mode": "5", "id": "1"} }, "id": 2 }