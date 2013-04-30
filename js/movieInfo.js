var record = null;

function showMovieInfo(record) {
    var obj = {
        "jsonrpc": "2.0",
        "method": "VideoLibrary.GetMovieDetails",
        "params": { 
            "movieid": record.data.id,
            "properties": [
                "title",
                "year",
                "genre",
                "plot",
                "tagline",
                "runtime",
                "file",
                "studio",
                "director",
                "rating",
                "streamdetails",
                "mpaa",
                "votes",
                "lastplayed",
                "art",
                "dateadded"
            ]
        },
        "id": record.data.id
    };

    tempStr = Ext.encode(obj);
    Ext.Ajax.request({
        url: clientAddr + '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: showMovieDetails,
        failure: getMusicLibFailure,
        timeout: interfaceTimeout
    });

}

function showMovieDetails(t) {
    var response = Ext.decode(t.responseText);

    record = response.result.moviedetails;
    var videoCodecPic = "default.png";
    var videoAspect = "default.png";
    var videoResolution = "defaultscreen.png";
    var audioChannels = "defaultsound.png";
    var audioCodec = "defaultsource.png";

    Ext.getCmp('movieTitle').setValue(record.title);
    Ext.getCmp('movieYear').setValue(record.year);
    Ext.getCmp('movieGenre').setValue(record.genre);
    Ext.getCmp('movieDescription').setValue(record.plot);
    Ext.getCmp('movieOutline').setValue(record.outline);
    Ext.getCmp('movieTagline').setValue(record.tagline);
    Ext.getCmp('movieDuration').setValue(record.runtime);
    Ext.getCmp('movieDirectory').setValue(record.filePath);
    Ext.getCmp('movieViewers').setValue(record.title);
    Ext.getCmp('movieStudio').setValue(record.studio);
    Ext.getCmp('movieFilename').setValue(record.fileName);
    Ext.getCmp('movieDirector').setValue(record.director);
    Ext.getCmp('cover').setValue(record.art.poster);
    Ext.getCmp('rating').autoEl.src = jpgrating(record.rating);

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

    var tempPic = Ext.getCmp('videocodec');
    tempPic.autoEl.src = "images/flags/" + videoCodecPic;
    if (tempPic.getEl() != undefined)
        tempPic.getEl().dom.src = "images/flags/" + videoCodecPic;

    tempPic = Ext.getCmp('resolution');
    Ext.getCmp('resolution').autoEl.src = "images/flags/" + videoResolution;
    if (tempPic.getEl() != undefined)
        tempPic.getEl().dom.src = "images/flags/" + videoResolution;

    tempPic = Ext.getCmp('aspect');
    Ext.getCmp('aspect').autoEl.src = "images/flags/" + videoAspect;
    if (tempPic.getEl() != undefined)
        tempPic.getEl().dom.src = "images/flags/" + videoAspect;

    tempPic = Ext.getCmp('audiocodec');
    Ext.getCmp('audiocodec').autoEl.src = "images/flags/" + audioCodec;
    if (tempPic.getEl() != undefined)
        tempPic.getEl().dom.src = "images/flags/" + audioCodec;

    tempPic = Ext.getCmp('audiochannels');
    Ext.getCmp('audiochannels').autoEl.src = "images/flags/" + audioChannels;
    if (tempPic.getEl() != undefined)
        tempPic.getEl().dom.src = "images/flags/" + audioChannels;

    var mycover = Ext.getCmp('coverart');
    var tempString = encodeURIComponent(record.art.poster);
    mycover.autoEl.src = "http://" + hostAddress + "/image/" + tempString;
    if (mycover.getEl() != undefined)
        mycover.getEl().dom.src = "http://" + hostAddress + "/image/" + tempString;


    movieInfoWindow.show();
}

function saveMovieInfo() {

//    xbmcJsonRPC('{"jsonrpc": "2.0", "method": "VideoLibrary.SetMovieDetails", "params": {"movieid": ' + idMedia + ', "playcount": 1}, "id": 1}');

    var coverValue = Ext.getCmp('cover').getValue();
    var obj = {
        "jsonrpc": "2.0",
        "method": "VideoLibrary.SetMovieDetails",
        "params": {
            "movieid": record.movieid,
//        {"art":{"fanart":"image:/.jpg/","poster":"image:/.jpg/"}
            "art": { "poster": coverValue },
        },
        "id": record.movieid
    };

    tempStr = Ext.encode(obj);
    Ext.Ajax.request({
        url: clientAddr + '/jsonrpc',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: tempStr,
        success: setMovieSuccess,
        failure: getMusicLibFailure,
        timeout: interfaceTimeout
    });

    movieInfoWindow.hide();

}

function setMovieSuccess(t) {
    var response = Ext.decode(t.responseText);
}
/***************************************************/

var FlagsPanel = new Ext.Panel({
    border: false,
    defaults: { xtype: 'container', width: 64, height: 44 },
    bodyStyle: { "background-color": "#4E78B1" },
    items: [{
        id: 'videocodec',
        autoEl: { tag: 'img', src: "images/flags/default.png" }
    }, {
        id: 'resolution',
        autoEl: { tag: 'img', src: "images/flags/defaultscreen.png" }
    }, {
        id: 'aspect',
        width: 48,
        height: 31,
        autoEl: { tag: 'img', src: "images/flags/default.png" }
    }, {
        id: 'audiocodec',
        autoEl: { tag: 'img', src: "images/flags/defaultsound.png" }
    }, {
        id: 'audiochannels',
        width: 38,
        height: 29,
        autoEl: { tag: 'img', src: "images/flags/0c.png" }
    }]
});

var MoviedetailPanel = new Ext.FormPanel({
    width: 600,
    region: 'center',
    id: 'MoviedetailPanel',
    title: "<div align='center'>Movie details</div>",
    defaults: { hideLabels: true, border: false },
    buttons: [{
        text: 'Save',
        handler: function () { saveMovieInfo() }
    }, {
        text: 'Exit',
        handler: function () { movieInfoWindow.hide() }
    }],
    modal: true,
    items: [{
        layout: 'column',
        frame: true,
        labelWidth: 50,
        bodyStyle: 'padding:5px',
        items: [{
            columnWidth: 0.56,
            id: 'details',
            layout: 'form',
            labelWidth: 65,
            defaults: { xtype: 'textfield',
                width: 300
            },
            items: [{
                fieldLabel: 'Title',
                name: 'title',
                id: 'movieTitle',
                allowBlank: false
            }, {
                fieldLabel: 'Release',
                name: 'year',
                id: 'movieYear'
                //readOnly: true
            }, {
                fieldLabel: 'Genres',
                name: 'genre',
                readOnly: true,
                id: 'movieGenre'
            }, {
                xtype: 'textarea',
                height: 150,
                name: 'plot',
                id: 'movieDescription',
                fieldLabel: 'Description'
            }, {
                xtype: 'textarea',
                height: 60,
                name: 'outline',
                id: 'movieOutline',
                fieldLabel: 'Abstract'
            }, {
                xtype: 'textarea',
                name: 'tagline',
                fieldLabel: 'Tag Line',
                id: 'movieTagline',
                height: 22
            }, {
                fieldLabel: 'Duration',
                id: 'movieDuration',
                name: 'runtime'
            }, {
                fieldLabel: 'Director',
                name: 'director',
                id: 'movieDirector'
            }, {
                fieldLabel: 'Viewers',
                name: 'MovieViewers',
                id: 'movieViewers'
            }, {
                fieldLabel: 'Studio',
                name: 'studio',
                id: 'movieStudio'
            }, {
                fieldLabel: 'Cover',
                name: 'coverImage',
                id: 'cover'
            }, {
                fieldLabel: 'File name',
                name: 'fileName',
                id: 'movieFilename',
                readOnly: true
            }, {
                fieldLabel: 'Directory',
                name: 'filePath',
                id: 'movieDirectory',
                readOnly: true
            }]
        }, {
            columnWidth: 0.44,
            defaults: { xtype: 'container' },
            items: [{
                        id: 'rating',
                        fieldLabel: 'IMDB rating',
                        border: 0,
                        width: 96,
                        height: 27,
                        autoEl: { tag: 'img', src: "images/stars/0stars.png" }
                    }, {
                        cls: 'center-align',
                        id: 'coverart',
                        //fieldLabel: 'Movie Cover',
                        width: 300,
                        height: 400,
                        autoEl: { tag: 'img', src: "images/defaultMovieCover.jpg" }
                    },
			        FlagsPanel
			]
        }]
    }]
})

/***********************************************/

movieInfoWindow = new Ext.Window({
    id: 'imginform-win',
    height: 600,
    width: 740,
    layout: 'fit',
    border: false,
    closeable: true,
    frame: true,
    items: [MoviedetailPanel],
    closeAction: 'hide'
});


// function to create the star rating
var jpgrating = function(value) {

    if (value > 9) {
        return 'images/stars/5stars.png';
    }
    else {
        if (value > 8) {
            return 'images/stars/4dot5stars.png';
        }
        else {
            if (value > 7) {
                return 'images/stars/4stars.png';
            }
            else {
                if (value > 6) {
                    return 'images/stars/3dot5stars.png';
                }
                else {
                    if (value > 5) {
                        return 'images/stars/3stars.png';
                    }
                    else {
                        if (value > 4) {
                            return 'images/stars/2dot5stars.png';
                        }
                        else {
                            if (value > 3) {
                                return 'images/stars/2stars.png';
                            }
                            else {
                                if (value > 2) {
                                    return 'images/stars/1dot5stars.png';
                                }
                                else {
                                    if (value > 1) {
                                        return 'images/stars/1stars.png';
                                    }
                                    else {
                                        return 'images/stars/0stars.png';
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function findResolution(iWidth) {

    if (iWidth == 0)
        return "defaultscreen";
    else if (iWidth < 721)
        return "480p";
    // 960x540
    else if (iWidth < 961)
        return "540p";
    // 1280x720
    else if (iWidth < 1281)
        return "720p";
    // 1920x1080
    else
        return "1080p";

}

function findAspect(vAspect) {
    if (vAspect == 0)
        return "default";
    if (vAspect < 1.4)
        return "1.33";
    else if (vAspect < 1.7)
        return "1.66";
    else if (vAspect < 1.8)
        return "1.78";
    else if (vAspect < 1.9)
        return "1.85";
    else if (vAspect < 2.36)
        return "2.35";
    else
        return "2.39";
}
