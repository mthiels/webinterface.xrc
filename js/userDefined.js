/***********************************************/
Ext.define('userDefined', {
    extend: 'Ext.data.Model',
    fields: ['id', 'ipAddress', 'portAddress', 'userCmd']
});

var userDefinedCmds = Ext.create('Ext.data.Store', {
    model: 'userDefined',
    autoLoad: 'true',
    proxy: {
        type: 'ajax',
        url: '/js/settings.json',
        reader: {
            type: 'json'
        }
    }
});


var userDefinedPanel = new Ext.FormPanel({
    width: 600,
    region: 'center',
    id: 'userDefinedPanel',
    title: "<div align='center'>User Defined</div>",
    defaults: { hideLabels: true, border: false },
    buttons: [{
        text: 'Exit',
        handler: function () { userDefinedWindow.hide() }
    }],
    modal: true,
    items: [{
        layout: 'column',
        frame: true,
        bodyStyle: 'padding:5px',
        items: [{
            columnWidth: 0.13,
            defaults: { xtype: 'container' },
            items: [{
                xtype: 'button',
                width: 72,
                height: 75,
                padding: '0 0 0 0',
                scale: 'large',
                handler: function () {
                    var ipAddress = Ext.getCmp('ipAddress').getValue();
                    var portAddress = Ext.getCmp('portAddress').getValue();
                    var userCmd = Ext.getCmp('userCmd').getValue();
                    simpleHttpRequest("http://"+ipAddress+":"+portAddress+userCmd, xbmcRemoteSuccess, remoteFailure);
                },
                //iconCls: 'userDefined-send'
                text: 'Send'
            }]
        }, {
            columnWidth: 0.87,
            id: 'details',
            layout: 'form',
            labelWidth: 65,
            defaults: { xtype: 'textfield'
            //    width: 200
            },
            items: [{
                fieldLabel: 'IP Address',
                name: 'ipAddress',
                id: 'ipAddress'
                //readOnly: true
            }, {
                fieldLabel: 'Port',
                name: 'portAddress',
                //readOnly: true,
                id: 'portAddress'
            }, {
                fieldLabel: 'Command',
                name: 'userCmd',
                //readOnly: true,
                id: 'userCmd'
            }]
        }]
    }]
})

var userDefinedWindow = new Ext.Window({
    id: 'imginform-user',
    height: 180,
    width: 600,
    layout: 'fit',
    border: false,
    closeable: true,
    frame: true,
    items: [userDefinedPanel],
    closeAction: 'hide'
});

function populateUserDefinedWindow() {
    temp = userDefinedCmds.data.items[0].data;
    Ext.getCmp('ipAddress').setValue(temp.ipAddress)
    Ext.getCmp('portAddress').setValue(temp.portAddress)
    Ext.getCmp('userCmd').setValue(temp.userCmd)
}

function makeHttpObject() {
    try { return new XMLHttpRequest(); }
    catch (error) { }
    try { return new ActiveXObject("Msxml2.XMLHTTP"); }
    catch (error) { }
    try { return new ActiveXObject("Microsoft.XMLHTTP"); }
    catch (error) { }

    throw new Error("Could not create HTTP request object.");
}


function simpleHttpRequest(url, success, failure) {

    var request = makeHttpObject();
    request.open("GET", url, true);
    request.setRequestHeader("Cache-Control", "no-cache", "must-revalidate", "max-age=0")
    request.setRequestHeader("Pragma", "no-cache");
    request.setRequestHeader("If-None-Match", "\"doesnt-match-anything\"");

    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            if (request.status == 200)
                success(request.responseText);
            else if (failure)
                failure(request.status, request.statusText);
        }
    };
}
