/**
 * Created by dhkim2 on 2017-12-05.
 */

'use strict';

const async = require('async');
const request = require('request');

const GeoCode = require('./function.geocode');

class Weather {
    constructor() {
        this.geoCode = new GeoCode();
        this.lang = 'en';
    }

    _request(url, callback) {
        console.info({_request:{url:url}});
        let options = {json: true, timeout: 3000, headers: {'Accept-Language' : this.lang}};
        request(url, options, (err, response, body) => {
            if (err) {
                return callback(err);
            }
            if (response.statusCode >= 400) {
                err = new Error("url=" + url + " statusCode=" + response.statusCode);
                return callback(err);
            }
            callback(err, body);
        });
    };

    _geoinfo2url(geoInfo) {
        let url = 'https://todayweather.wizardfactory.net';
        if (geoInfo.country === 'KR') {
            url += '/v000803/town';
            if (geoInfo.kmaAddress.name1 && geoInfo.kmaAddress.name1.length > 0)  {
                url += '/'+ encodeURIComponent(geoInfo.kmaAddress.name1);
            }
            if (geoInfo.kmaAddress.name2 && geoInfo.kmaAddress.name1.length > 0)  {
                url += '/'+ encodeURIComponent(geoInfo.kmaAddress.name2);
            }
            if (geoInfo.kmaAddress.name3 && geoInfo.kmaAddress.name1.length > 0)  {
                url += '/'+ encodeURIComponent(geoInfo.kmaAddress.name3);
            }
            return url;
        }
        else {
            url += '/ww/010000/current/2';
            url += "?gcode=" + geoInfo.loc.lat + ','+geoInfo.loc.lng;
            return url;
        }
    }

    byCoord(event, callback) {
        try{
            this.lang = event.headers['Accept-Language'];
        }
        catch (err) {
            console.error(err);
        }

        async.waterfall([
            (callback) => {
                this.geoCode.coord2geoInfo(event, (err, result) => {
                    callback(err, result);
                });
            },
            (geoInfo, callback) => {
                let url;
                try {
                    url = this._geoinfo2url(geoInfo);
                }
                catch (err) {
                    callback(err);
                }
                this._request(url, (err, result)=> {
                    if (err) {
                        return callback(err);
                    }
                    callback(null, result);
                });
            }
        ], (err, result) => {
            if (err) {
                return callback(err);
            }
            callback(null, result);
        });
    }

    byAddress(event, callback) {
        console.error(event);
        return callback(new Error("This event is not supported yet!"));
    }
}

module.exports = Weather;
