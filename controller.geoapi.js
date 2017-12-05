/**
 * Created by dhkim2 on 2017-12-04.
 */

'use strict';

const async = require('async');
const ControllerDaum = require('./controller.daum');
const ControllerGoogle = require('./controller.google');

class GeoApi {
    constructor(loc, lang) {
        this.loc = loc;
        this.lang = lang;
    }

    /**
     * it has partial area of japan
     * @param loc
     * @returns {boolean}
     * @private
     */
    _isKoreaArea(loc) {
        let lat = loc[0];
        let lng = loc[1];
        return 39.3769 >= lat && lat >=32.6942 &&
            130.6741 >= lng && lng >= 123.9523;
    }

    _getAddressFromDaum(loc, lang, callback) {
        //console.log({_getAddressFromDaum:{loc: loc, lang: lang}});
        let ctrl = new ControllerDaum(loc);
        ctrl.getAddress((err, result) => {
            callback(err, result);
        });
        return this;
    };

    _getAddressFromGoogle(loc, lang, callback) {
        //console.log({_getAddressFromGoogle: {loc: loc, lang: lang}});
        let ctrl = new ControllerGoogle(loc, lang);
        ctrl.getAddress((err, result) => {
            callback(err, result);
        });
        return this;
    };

    getGeoInfo(loc, lang, callback)  {
        loc = loc?loc:this.loc;
        lang = lang?lang:this.lang;

        //console.log({getGeoInfo:{loc: loc, lang: lang}});

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
                        this._getAddressFromDaum(loc, lang, (err, geoInfo) => {
                            if (lang !== 'ko') {
                                geoInfo.address = undefined;
                                geoInfo.label = undefined;
                                //fill from google api
                            }
                            callback(err, geoInfo);
                        });
                    }
                    else {
                        this._getAddressFromGoogle(loc, lang, (err, geoInfo) => {
                            callback(err, geoInfo);
                        });
                    }
                },
                (geoInfo, callback) => {
                    //get address from google for jp in IsKoreaArea
                    if (geoInfo.address && geoInfo.label) {
                        return callback(null, geoInfo);
                    }

                    this._getAddressFromGoogle(loc, lang, (err, newGeoInfo) => {
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
                geoInfo.loc = loc;
                geoInfo.lang = lang;
                callback(err, geoInfo);
            });

        return this;
    }
}

module.exports = GeoApi;
