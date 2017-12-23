/**
 * Created by dhkim2 on 2017-12-04.
 */

'use strict';

const async = require('async');
const ControllerDaum = require('./controller.daum');
const ControllerGoogle = require('./controller.google');

class GeoApi {
    constructor() {
    }

    /**
     * it has partial area of japan
     * 130.6741 -> 131.88 for dokdo
     * @param loc
     * @returns {boolean}
     * @private
     */
    _isKoreaArea(loc) {
        let lat = loc[0];
        let lng = loc[1];
        return 39.3769 >= lat && lat >=32.6942 &&
            131.88 >= lng && lng >= 123.9523;
    }

    _getGeoInfoFromDaumGeoCode(loc, callback) {
        //console.log({_getGeoInfoFromDaumGeoCode:{loc: loc, lang: lang}});
        let ctrl = new ControllerDaum();
        ctrl.byGeoCode(loc, (err, result) => {
            callback(err, result);
        });
        return this;
    };

    _getGeoInfoFromGoogleGeoCode(loc, lang, callback) {
        //console.log({_getGeoInfoFromGoogleGeoCode: {loc: loc, lang: lang}});
        let ctrl = new ControllerGoogle();
        ctrl.byGeoCode(loc, lang, (err, result) => {
            callback(err, result);
        });
        return this;
    };

    getGeoInfoByCoord(loc, lang, callback)  {
        loc = loc?loc:this.loc;
        lang = lang?lang:this.lang;

        //console.log({getGeoInfoByCoord:{loc: loc, lang: lang}});

        let isKoreaArea;
        try {
            isKoreaArea = this._isKoreaArea(loc);
        }
        catch (err) {
            return callback(err);
        }

        async.waterfall([
                (callback) => {
                    if (isKoreaArea) {
                        this._getGeoInfoFromDaumGeoCode(loc, (err, geoInfo) => {
                            if (err) {
                                return callback(err);
                            }
                            if (lang !== 'ko') {
                                geoInfo.address = undefined;
                                geoInfo.label = undefined;
                                //fill from google api
                            }
                            callback(err, geoInfo);
                        });
                    }
                    else {
                        this._getGeoInfoFromGoogleGeoCode(loc, lang, (err, geoInfo) => {
                            if (err) {
                                return callback(err);
                            }
                            callback(err, geoInfo);
                        });
                    }
                },
                (geoInfo, callback) => {
                    //get address from google for jp in IsKoreaArea
                    if (geoInfo.address && geoInfo.label) {
                        return callback(null, geoInfo);
                    }

                    this._getGeoInfoFromGoogleGeoCode(loc, lang, (err, newGeoInfo) => {
                        if (err) {
                            return callback(err);
                        }
                        try {
                            for(let key in newGeoInfo) {
                                geoInfo[key] = geoInfo[key]?geoInfo[key]:newGeoInfo[key];
                            }
                        }
                        catch(err) {
                            return callback(err);
                        }
                        callback(err, geoInfo);
                    });
                }
            ],
            (err, geoInfo) => {
                if (err) {
                    return callback(err);
                }
                callback(err, geoInfo);
            });

        return this;
    }

    _getGeoInfoFromDaumAddress(addr, callback) {
        let ctrl = new ControllerDaum();
        ctrl.byAddress(addr, (err, result) => {
            callback(err, result);
        });
    }

    _getGeoInfoFromGoogleAddress(addr, callback) {
        let ctrl = new ControllerGoogle();
        ctrl.byAddress(addr, (err, result) => {
            callback(err, result);
        });
    }

    getGeoInfoByAddr(addr, callback) {
        async.tryEach(
            [
                (callback) => {
                    this._getGeoInfoFromGoogleAddress(addr, (err, result)=> {
                        if (err) {
                            return callback(err);
                        }
                        callback(null, result);
                    });
                },
                (callback) => {
                    this._getGeoInfoFromDaumAddress(addr, (err, result)=> {
                        if (err) {
                            return callback(err);
                        }
                        callback(null, result);
                    });
                }
            ],
            (err, geoInfo) => {
                if (err)   {
                    return callback(err);
                }
                callback(err, geoInfo);
            });
    }
}

module.exports = GeoApi;
