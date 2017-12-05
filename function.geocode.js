/**
 * Created by dhkim2 on 2017-12-04.
 */

'use strict';

const async = require('async');

const ControllerDynamdb = require('./controller.dynamodb');
const ControllerGeoApi = require('./controller.geoapi');

class GeoCode {
    constructor() {
        this.ctrlDynamodb = new ControllerDynamdb();
        this.ctrlGeoApi = new ControllerGeoApi();
    }

    _getFromDb(loc, lang, callback) {
        this.ctrlDynamodb.get(loc, lang, (err, geoInfo) => {
            callback(err, geoInfo);
        });
    }

    _getFromGeoApi(loc, lang, callback) {
        this.ctrlGeoApi.getGeoInfo(loc, lang, (err, geoInfo) => {
            callback(err, geoInfo);
        });
    }

    _updateDb(geoInfo, callback) {
        this.ctrlDynamodb.update(geoInfo, (err, result) => {
            callback(err, result);
        });
    }

    _renewData(geoInfo) {
        const timestamp = new Date().getTime();
        const MONTH = 2592000000; //1000*60*60*24*30

        if (!geoInfo.updatedAt) {
            console.error("geoInfo updatedAt is invalid");
            return;
        }

        if (geoInfo.updatedAt < timestamp - MONTH) {
            this._updateDb(geoInfo, (err)=> {
                if (err) { console.error(err);}
            });
        }
    }

    _getLanguage(event) {
        if (!event.headers.hasOwnProperty('Accept-Language')) {
            return 'en';
        }
        return event.headers['Accept-Language'].split('-')[0];
    }

    coord2geoInfo(event, callback) {
        let loc;
        let lang;
        try {
            console.log(event);
            loc = [Number(event.pathParameters.lat), Number(event.pathParameters.lng)];
            lang = this._getLanguage(event);
            console.info({coord2geoInfo:{loc: loc, lang: lang}});
        }
        catch(err) {
            return callback(err);
        }

        async.tryEach([
                (cb) => {
                    this._getFromDb(loc, lang, (err, geoInfo)=> {
                        if (err) {
                            return cb(err);
                        }
                        this._renewData(geoInfo);
                        cb(err, geoInfo);
                    });
                },
                (cb) => {
                    this._getFromGeoApi(loc, lang, (err, geoInfo)=> {
                        if (err) {
                            return cb(err);
                        }
                        this._updateDb(geoInfo, (err)=> {
                            if (err) { console.error(err);}
                        });
                        cb(err, geoInfo);
                    });
                }],
            (err, geoInfo) => {
                if (err) {
                    return callback(err);
                }
                callback(err, geoInfo);
            });
    }

    addr2geoInfo(event, callback) {
        console.error(event);
        return callback(new Error("This event is not supported yet!"));
    }
}

module.exports = GeoCode;
