/**
 * Created by dhkim2 on 2017-12-04.
 */

'use strict';

const request = require('request');

class ControllerExternalApi {
    constructor(loc, lang) {
        this.lat = loc[0];
        this.lng = loc[1];
        this.lang = lang;
    }

    _request(url, callback) {
        console.info({_request:{url:url}});
        request(url, {json: true, timeout: 3000}, (err, response, body) => {
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

    _coord2geoInfo(result) {
        let geoInfo = {};
        return geoInfo;
    }

    getAddress(callback) {
    };

    getGeoCode(callback) {
    }
}

module.exports = ControllerExternalApi;
