/**
 * Created by dhkim2 on 2017-12-04.
 */

'use strict';

const async = require('async');

const ControllerExternalApi = require('./controller.externalapi');

const config = require('./config');

class ControllerDaum extends ControllerExternalApi {
    constructor(loc) {
        super(loc);
        this.keys = JSON.parse(config.keyString.daum_keys);
    }

    _coord2geoInfo(result) {
        let geoInfo = {};
        if (result.name0 === "대한민국") {
            geoInfo.country = "KR";
            geoInfo.address = result.fullName;
            if (result.name3 && result.name3 != "") {
                geoInfo.label = result.name3;
            }
            else if (result.name2 && result.name2 != "") {
                geoInfo.label = result.name2;
            }
            else if (result.name1 && result.name1 != "") {
                geoInfo.label = result.name1;
            }
            else if (result.name0 && result.name0 != "") {
                geoInfo.label = result.name0;
            }
            //remove space in "성남시 분당구"
            let name2 = result.name2;
            if (name2) {
                name2 = name2.replace(/ /g,"");
            }
            geoInfo.kmaAddress = {"name1": result.name1, "name2": name2, "name3": result.name3};
        }
        else if (result.name0 === "일본") {
            geoInfo.country = "JP";
        }
        else {
            throw new Error("It is not korea");
        }

        return geoInfo;
    }

    getAddress(callback) {
        let index = 0;

        async.retry(this.keys.length,
            (cb) => {
                let url = 'https://apis.daum.net/local/geo/coord2addr' +
                    '?apikey=' + this.keys[index] +
                    '&longitude=' + this.lng +
                    '&latitude=' + this.lat +
                    '&inputCoordSystem=WGS84' +
                    '&output=json';
                index++;

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
                   geoInfo = this._coord2geoInfo(result);
                }
                catch (err) {
                    return callback(err);
                }
                callback(null, geoInfo);
            });

        return this;
    };

    getGeoCode(callback) {
    }
}

module.exports = ControllerDaum;
