/********** Music Shares ********************************************/

Ext.define('shareMusicInfo', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'label', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'type', type: 'string' }
    ]
});

var storeMusicTree = Ext.create('Ext.data.TreeStore', {
    model: 'shareMusicInfo',
    root: {
        label: 'Music Shares',
        type: 'sharesMusicRoot',
        name: 'Music Shares'
    },
    folderSort: true,
    sorters: [{
        property: 'text',
        direction: 'ASC'
    }]
});

var sharesMusicTree = Ext.create('Ext.tree.Panel', {
    id: 'treeMusic',
    store: storeMusicTree,
    width: 250,
    height: 300,
    viewConfig: {
        copy: true,
        plugins: {
            ptype: 'treeviewdragdrop',
            appendOnly: true,
            enableDrag: true,
            ddGroup: 'mygroup'
        }
    },
    columns: [
        { xtype: 'treecolumn', dataIndex: 'label', flex: 1 }
    ],
    renderTo: document.body,
    listeners: {
        itemclick: function(view, rec, item, index, eventObj) {
            if (rec.raw.type != "sharesMusicRoot") {
                getDirectoryInfo(rec);
            }
        }
    }

});

var sharesMusicRoot = sharesMusicTree.getRootNode();

/********** Video Shares ********************************************/


Ext.define('shareVideoInfo', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'label', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'type', type: 'string' }
    ]
});

var storeVideoTree = Ext.create('Ext.data.TreeStore', {
    model: 'shareVideoInfo',
    root: {
        label: 'Video Shares',
        type: 'sharesVideoRoot',
        name: 'Video Shares'
    },
    folderSort: true,
    sorters: [{
        property: 'text',
        direction: 'ASC'
    }]
});

var sharesVideoTree = Ext.create('Ext.tree.Panel', {
    id: 'treeVideo',
    store: storeVideoTree,
    width: 250,
    height: 300,
    viewConfig: {
        copy: true,
        plugins: {
            ptype: 'treeviewdragdrop',
            appendOnly: true,
            enableDrag: true,
            ddGroup: 'mygroup'
        }
    },
    columns: [
        { xtype: 'treecolumn', dataIndex: 'label', flex: 1 }
    ],
    renderTo: document.body,
    listeners: {
        itemdblclick:function(node, rec, item, index, e){ 
            if (rec.raw.type == "file") {
                getFileInfo(rec);
            }
        },
        itemclick: function(view, rec, item, index, eventObj) {
            if (rec.raw.type != "sharesVideoRoot") {
                getDirectoryInfo(rec);
            }
        }
    } 
});

var sharesVideoRoot = sharesVideoTree.getRootNode();

/********** getShares ********************************************/

function getShares(type) {

    var obj = {
        "jsonrpc": "2.0",
        "method": "Files.GetSources",
        "params": {
            "media": type
        },
        "id": 1
    };

    if (type == 'music') {
        successFunction = getMusicSharesSuccess;
        obj.params.media = "music";
    }
    else {
        successFunction = getVideoSharesSuccess;
        obj.params.media = "video";
    }

    var tempStr = Ext.encode(obj);
    Ext.Ajax.request({
        url: '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: successFunction,
        failure: getSharesFailure,
        timeout: interfaceTimeout
    });
}

/********************* getSharesSuccess ***********************/

function getMusicSharesSuccess(t) {

    var responseArr = Ext.decode(t.responseText);

    for (var i = 0; i < responseArr.result.limits.total; i++) {

        var newNode = Ext.create('shareMusicInfo', {
            label: responseArr.result.sources[i].label,
            name: responseArr.result.sources[i].file,
            type: "share",
            expandable: false,
            expandable: true,
            leaf: false,
            children: [],
            id: nodeId
        });

        storeMusicTree.getRootNode().appendChild(newNode);
        nodeId++;
    }
}

function getVideoSharesSuccess(t) {

    var responseArr = Ext.decode(t.responseText);

    for (var i = 0; i < responseArr.result.limits.total; i++) {

        var newNode = Ext.create('shareVideoInfo', {
            label: responseArr.result.sources[i].label,
            name: responseArr.result.sources[i].file,
            type: "share",
            expandable: false,
            expandable: true,
            leaf: false,
            children: [],
            id: nodeId
        });

        storeVideoTree.getRootNode().appendChild(newNode);
        nodeId++;
    }
}

function getSharesFailure(t) {
    alert('getSharesFailure failure t:' + t);
}


/********************* getDirectoryInfo ***********************/

function getDirectoryInfo(branch) {
    currentNodeSelected = branch.data.id;
    if (branch.raw != undefined) {
        if (branch.raw.type != "file") {
            getDirectoryPaths(branch.raw.name);
        }
    }
}

function getDirectoryPaths(url) {
    var obj = {
        "jsonrpc": "2.0",
        "method": "Files.GetDirectory",
        "params": {
            "directory": url,
            "sort": { "method": "label" },
            "properties": ["playcount"]
        },
        "id": 1
    };

    var tempStr = Ext.encode(obj);
    Ext.Ajax.request({
        url: '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: getDirectorySuccess,
        failure: getDirectoryFailure,
        timeout: interfaceTimeout
    });

    sharesMessageBox.show({
        msg: 'Loading Directory...',
        wait: true,
        waitConfig: { interval: 200 },
        icon: 'ext-mb-download' //custom class in msg-box.html
    });
}

function getDirectorySuccess(t) {
    var struct1;
    var newBranch;
    var branch;
    var testBranch;
    var newNode = null;
    var branchRoot = null;
    var shareInfo = '';
    var storeTree = null;

    sharesMessageBox.hide();

    var response = Ext.decode(t.responseText);

    var responseDirectory = response.result.directories;
    var responseFiles = response.result.files;

    if (currentPlaylist == 'Music') {
        branchRoot = storeMusicTree.getNodeById(currentNodeSelected);
        shareInfo = 'shareMusicInfo';
        storeTree = storeMusicTree;
    }
    else {
        branchRoot = storeVideoTree.getNodeById(currentNodeSelected);
        shareInfo = 'shareVideoInfo';
        storeTree = storeVideoTree;
    }


    if (branchRoot == undefined || branchRoot == null) {
        alert('failure t:' + t.responseText);
    }

    if (branchRoot.hasChildNodes())
        return;

    for (var i = 0; i < response.result.limits.total; i++) {

        var obj = {
            label: response.result.files[i].file,
            type: response.result.files[i].filetype
        };

        if (responseFiles[i].filetype == "directory") {

            var newNode = Ext.create(shareInfo, {
                label: responseFiles[i].label,
                name: responseFiles[i].file,
                draggable: true, // disable root node dragging
                type: "directory",
                id: nodeId,
                expandable: true,
                leaf: false,
                children: [],
                icon: "images/folder.gif"
            });

                            
            treeNode = storeTree.getNodeById(branchRoot.data.id);
            treeNode.appendChild(newNode);
            

        } else {

            var newNode = Ext.create(shareInfo, {
                    label: responseFiles[i].label,
                    name: responseFiles[i].file,
                    draggable: true, // disable root node dragging
                    type: "file",
                    leaf: true,
                    id: nodeId
            });

            storeTree.getNodeById(branchRoot.data.id).appendChild(newNode);
        }

        nodeId++;
        //branchRoot.expand(false, false);
    }

    branchRoot.expand();
}

function getDirectoryFailure(t) {
    sharesMessageBox.hide();
    alert('getDirectoryFailure t:' + t);
}

var sharesMessageBox = Ext.create('Ext.window.MessageBox', {
    width: 300,
    height: 100
});


function getFileInfo(branch) {
    currentNodeSelected = branch.data.id;
    var obj = {
        "jsonrpc": "2.0",
        "method": "Files.GetFileDetails",
        "params": {
            "file": branch.data.name
        },
        "id": 1
    };

    var tempStr = Ext.encode(obj);
    Ext.Ajax.request({
        url: '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: getFileSuccess,
        failure: getDirectoryFailure,
        timeout: interfaceTimeout
    });
}

function getFileSuccess(t) {
    var response = Ext.decode(t.responseText);
}
