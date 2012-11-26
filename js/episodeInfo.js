function showEpisodeInfo(record) {

    var obj = {
        "jsonrpc": "2.0",
        "method": "VideoLibrary.GetEpisodeDetails",
        "params": {
            "episodeid": record.data.episodeid,
            "properties": [
                "showtitle",
                "season",
                "episode",
                "firstaired",
                "director",
                "writer",
                "runtime",
                "rating",
                "plot",
                "streamdetails",
                "originaltitle",
                "votes",
                "lastplayed",
                "dateadded",
                "file",
                "thumbnail"]
        },
        "id": record.data.id
    };

    tempStr = Ext.encode(obj);
    Ext.Ajax.request({
        url: '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: showEpisodeDetails,
        failure: getMusicLibFailure,
        timeout: interfaceTimeout
    });

}

function showEpisodeDetails(t) {

    var response = Ext.decode(t.responseText);

    record = response.result.episodedetails;

    var videoCodecPic = "default.png";
    var videoAspect = "default.png";
    var videoResolution = "defaultscreen.png";
    var audioChannels = "defaultsound.png";
    var audioCodec = "defaultsource.png";
    Ext.getCmp('showTitle').setValue(record.showtitle);
    Ext.getCmp('episodeSeason').setValue(record.season);
    Ext.getCmp('episode').setValue(record.episode);
    Ext.getCmp('episodeTitle').setValue(record.label);
    Ext.getCmp('episodeFirstAired').setValue(record.firstaired);
    Ext.getCmp('episodePlot').setValue(record.plot);
    Ext.getCmp('episodeDuration').setValue(record.runtime);
    Ext.getCmp('episodeDirector').setValue(record.director);
    Ext.getCmp('episodeWriter').setValue(record.writer);
    Ext.getCmp('episodeFilename').setValue(record.file);

    if (record.streamdetails != null) {
        if (record.streamdetails.video[0] != null)
        {
            if (record.streamdetails.video[0].codec != null) {
                videoCodecPic = record.streamdetails.video[0].codec + ".png";
            }
            if (record.streamdetails.video[0].aspect != null)
                videoAspect = findAspect(record.streamdetails.video[0].aspect) + ".png";

            if (record.streamdetails.video[0].width != null)
                videoResolution = findResolution(record.streamdetails.video[0].width) + ".png";
        }
        if (record.streamdetails.audio[0] != null)
        {
            if (record.streamdetails.audio[0].channels != null)
                audioChannels = record.streamdetails.audio[0].channels + "c.png";

            if (record.streamdetails.audio[0].codec != null)
                audioCodec = record.streamdetails.audio[0].codec + ".png";
        }
    }

    var tempPic = Ext.getCmp('episodevideocodec');
    tempPic.autoEl.src = "images/flags/" + videoCodecPic;
    if (tempPic.getEl() != undefined)
        tempPic.getEl().dom.src = "images/flags/" + videoCodecPic;

    tempPic = Ext.getCmp('episoderesolution');
    tempPic.autoEl.src = "images/flags/" + videoResolution;
    if (tempPic.getEl() != undefined)
        tempPic.getEl().dom.src = "images/flags/" + videoResolution;

    tempPic = Ext.getCmp('episodeaspect');
    tempPic.autoEl.src = "images/flags/" + videoAspect;
    if (tempPic.getEl() != undefined)
        tempPic.getEl().dom.src = "images/flags/" + videoAspect;

    tempPic = Ext.getCmp('episodeaudiocodec');
    tempPic.autoEl.src = "images/flags/" + audioCodec;
    if (tempPic.getEl() != undefined)
        tempPic.getEl().dom.src = "images/flags/" + audioCodec;

    tempPic = Ext.getCmp('episodeaudiochannels');
    tempPic.autoEl.src = "images/flags/" + audioChannels;
    if (tempPic.getEl() != undefined)
        tempPic.getEl().dom.src = "images/flags/" + audioChannels;

    var mycover = Ext.getCmp('episodecoverart');
    var tempString = encodeURIComponent(record.thumbnail);
    mycover.autoEl.src = "http://" + hostAddress + "/image/" + tempString;
    if (mycover.getEl() != undefined)
    mycover.getEl().dom.src = "http://" + hostAddress + "/image/" + tempString;

    episodeInfoWindow.show();
}

/***************************************************/

var episodeFlagsPanel = new Ext.Panel({
    border: false,
    defaults: { xtype: 'container', width: 64, height: 44 },
    bodyStyle: { "background-color": "#4E78B1" },
    items: [{
        id: 'episodevideocodec',
        autoEl: { tag: 'img', src: "images/flags/default.png" }
    }, {
        id: 'episoderesolution',
        autoEl: { tag: 'img', src: "images/flags/defaultscreen.png" }
    }, {
        id: 'episodeaspect',
        width: 48,
        height: 31,
        autoEl: { tag: 'img', src: "images/flags/default.png" }
    }, {
        id: 'episodeaudiocodec',
        autoEl: { tag: 'img', src: "images/flags/defaultsound.png" }
    }, {
        id: 'episodeaudiochannels',
        width: 38,
        height: 29,
        autoEl: { tag: 'img', src: "images/flags/0c.png" }
    }]
});

/***************************************************/


var episodeDetailPanel = new Ext.FormPanel({
    width: 700,
    region: 'center',
    id: 'episodeDetailPanel',
    title: "<div align='center'>Episode details</div>",
    defaults: { hideLabels: true, border: false },
    buttons: [{
        text: 'Exit',
        handler: function() { episodeInfoWindow.hide() }
    }],
    modal: true,
    items: [{
        layout: 'column',
        frame: true,
        labelWidth: 50,
        bodyStyle: 'padding:5px',
        items: [{
            columnWidth: 0.56,
            id: 'episodedetails',
            layout: 'form',
            labelWidth: 65,
            defaults: { xtype: 'textfield',
                width: 300
            },
            items: [{
                fieldLabel: 'Show Title',
                name: 'title',
                id: 'showTitle',
                allowBlank: false
            }, {
                fieldLabel: 'Season',
                name: 'season',
                id: 'episodeSeason'
            }, {
                fieldLabel: 'Episode',
                name: 'episode',
                readOnly: true,
                id: 'episode'
            }, {
                fieldLabel: 'Episode Title',
                name: 'episodeTitle',
                readOnly: true,
                id: 'episodeTitle'
            }, {
                name: 'firstaired',
                id: 'episodeFirstAired',
                fieldLabel: 'First aired'
            }, {
                xtype: 'textarea',
                height: 150,
                name: 'plot',
                id: 'episodePlot',
                fieldLabel: 'Plot'
            }, {
                fieldLabel: 'Duration',
                id: 'episodeDuration',
                name: 'runtime'
            }, {
                fieldLabel: 'Director',
                name: 'director',
                id: 'episodeDirector'
            }, {
                fieldLabel: 'Writer',
                name: 'episodeWriter',
                id: 'episodeWriter'
            }, {
                fieldLabel: 'File name',
                name: 'episodeFileName',
                id: 'episodeFilename'
            }]
        }, {
                columnWidth: 0.44,
                defaults: { xtype: 'container' },
                items: [{
                    id: 'episoderating',
                    fieldLabel: 'IMDB rating',
                    border: 0,
                    width: 96,
                    height: 27,
                    autoEl: { tag: 'img', src: "images/stars/0stars.png" }
                }, {
                    cls: 'center-align',
                    id: 'episodecoverart',
                    //fieldLabel: 'Movie Cover',
                    width: 300,
                    height: 400,
                    autoEl: { tag: 'img', src: "images/defaultMovieCover.jpg" }
         },
	     episodeFlagsPanel
	     ]
        }]
    }]
})

/***********************************************/

episodeInfoWindow = new Ext.Window({
    id: 'imgvideoinform-win',
    height: 575,
    width: 740,
    layout: 'fit',
    border: false,
    closeable: true,
    frame: true,
    items: [episodeDetailPanel],
    closeAction: 'hide'
});

