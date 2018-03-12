/**
 * Created by dhkim2 on 2017-12-04.
 */

'use strict';

const request = require('request');

class ControllerExternalApi {
    constructor() {
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
    }

    _coord2geoInfo(result) {
        return {};
    }

    _setGeoCode(loc, lang) {
        this.loc = loc;
        this.lang = lang;
    }

    byGeoCode(loc, lang, callback) {
        this._setGeoCode(loc, lang);
        let err;
        let geoInfo = {};
        return callback(err, geoInfo);
    }

    byAddress(addr, callback) {
        this.addr = addr;
        let err;
        let geoInfo = {};
        return callback(err, geoInfo);
    }
}

module.exports = ControllerExternalApi;
