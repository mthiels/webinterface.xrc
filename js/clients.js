
/***********************************************/
Ext.define('userDefined', {
    extend: 'Ext.data.Model',
    fields: ['id', 'ipAddress', 'portAddress', 'name']
});

var userClients = Ext.create('Ext.data.Store', {
    model: 'userDefined',
    autoLoad: 'true',
    proxy: {
        type: 'ajax',
        url: '/js/clients.json',
        reader: {
            type: 'json'
        }
    }
});

function populateClientMenu() {
    numberOfClients = userClients.data.length;

    var clientButton = Ext.getCmp('statusBar');

    var menu = Ext.create('Ext.menu.Menu');

    for (tempCount = 0; tempCount < numberOfClients; tempCount++) {
        temp = userClients.data.items[tempCount].data;
        menu.add({
            text: temp.name,
            id: "http://" + temp.ipAddress + ":" + temp.portAddress,
            handler: function (index, rowIndex) {
                var clientButton = Ext.getCmp('clientButton');
                var tempString = 'Client: ' + index.text;
                clientButton.setText(tempString);
                if (index.text != 'Default') {
                    clientAddr = this.id;
                } else {
                    clientAddr = "";
                }

                while (sharesMusicRoot.firstChild) {
                    sharesMusicRoot.removeChild(sharesMusicRoot.firstChild);
                }
                while (sharesVideoRoot.firstChild) {
                    sharesVideoRoot.removeChild(sharesVideoRoot.firstChild);
                }

                storeSongs.removeAll();
                storeAlbum.removeAll();
                storeArtist.removeAll();
                storeSeason.removeAll();
                storeEpisodes.removeAll();
                storeVideoLibrary.removeAll();
                videoLibrary = [];

                getShares("music");
                getShares("video");
                updatePlaylistTree();
                InitializeMusicLib();
                InitializeMovieLib();
                InitializeTVShowLib();
                getVolume();
            }
        })
    }

    mediaLibraryStatusbar.add({
        id: 'clientButton',
        xtype: 'button',
        text: 'Client: Default',
        menu: menu,
    });
}