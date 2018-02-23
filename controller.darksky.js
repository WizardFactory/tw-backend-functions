/**
 * Created by alecKim on 2018-02-23.
 */

'use strict';

const async = require('async');

const ControllerExternalApi = require('./controller.externalapi');

const config = require('./config');

class ControllerDarksky extends ControllerExternalApi {
    constructor() {
        super();
        this.endpoint = "https://darksky.net/rgeo";
    }

    _coord2geoInfo(data, loc, lang) {
        loc = loc?loc:this.loc;
        lang = lang?lang:this.lang;

        let geoInfo = {loc: loc, lang: lang, provider: 'darksky'};

        console.info(data);

        if (data.street) {
            geoInfo.address = "";
            geoInfo.address += data.street;
        }
        if (data.name) {
            if (geoInfo.address == undefined) {
                geoInfo.address = "";
            }
            if (geoInfo.address.length > 0)  {
                geoInfo.address += ', ';
            }
            geoInfo.address += data.name;

            var nameArray = data.name.split(',');
            geoInfo.label = nameArray[0];
        }

        if (geoInfo.label == undefined || geoInfo.address == undefined) {
            throw new Error('failToFindLocation');
        }

        return geoInfo;
    }

    byGeoCode(loc, lang, callback) {
        this._setGeoCode(loc, lang);

        let url = this.endpoint + '?hires=1&lat='+this.loc[0]+'&lon='+this.loc[1];

        async.retry(3,
            (cb) => {
                this._request(url, (err, result) => {
                    if (err) {
                        return cb(err);
                    }
                    cb(null, result);
                });
            },
            (err, result) => {
                if (err) {
                    return callback(err);
                }

                let geoInfo;
                try {
                    geoInfo = this._coord2geoInfo(result, loc, lang);
                }
                catch(err) {
                    return callback(err);
                }
                callback(null, geoInfo);
            });

        return this;
    }
}

module.exports = ControllerDarksky;

