/**
 * Created by dhkim2 on 2017-12-04.
 */

'use strict';

const async = require('async');

const ControllerGeoCodeDb = require('./controller.geocode.dynamodb');
const ControllerAddressDb = require('./controller.address.dynamodb');

const ControllerGeoApi = require('./controller.geoapi');

class GeoInfo {
    constructor() {
        this.ctrlGeoCodeDb = new ControllerGeoCodeDb();
        this.ctrlAddressDb = new ControllerAddressDb();
        this.ctrlGeoApi = new ControllerGeoApi();
    }

    _geoCodeNormalize (loc) {
        return [parseFloat(loc[0].toFixed(3)), parseFloat(loc[1].toFixed(3))];
    }

    _getFromGeoCodeDb(loc, lang, callback) {
        this.ctrlGeoCodeDb.get(loc, lang, (err, geoInfo) => {
            callback(err, geoInfo);
        });
    }

    _getFromGeoCodeApi(loc, lang, callback) {
        this.ctrlGeoApi.getGeoInfoByCoord(loc, lang, (err, geoInfo) => {
            callback(err, geoInfo);
        });
    }

    _updateGeoCodeDb(geoInfo, callback) {
        this.ctrlGeoCodeDb.update(geoInfo, (err, result) => {
            callback(err, result);
        });
    }

    _isExpired(geoInfo) {
        const timestamp = new Date().getTime();
        const MONTH = 2592000000; //1000*60*60*24*30

        if (!geoInfo.updatedAt) {
            console.error("geoInfo updatedAt is invalid");
            return true;
        }

        if (geoInfo.updatedAt < timestamp - MONTH) {
            return true;
        }
        return false;
    }

    _getLanguage(event) {
        if (!event.headers) {
            console.warn('Fain to find headers');
            return 'en';
        }
        if (event.headers.hasOwnProperty('Accept-Language')) {
            return event.headers['Accept-Language'].split('-')[0];
        }
        else if (event.headers.hasOwnProperty('accept-language')) {
            return event.headers['accept-language'].split('-')[0];
        }
        else {
            console.warn('Fain to find accept-language');
            return 'en';
        }
    }

    importGeoInfo(dest, source) {
        if (dest == undefined) {
            throw new Error("dest is undefined");
        }

        ['label', 'country', 'address', 'loc'].forEach((propertyName) => {
            if (source.hasOwnProperty(propertyName)) {
                if (propertyName === 'label') {
                    dest.name = source.label;
                }
                else if (propertyName === 'loc') {
                    dest.location = {lat: source.loc[0], long:source.loc[1]};
                }
                else {
                    dest[propertyName] = source[propertyName];
                }
            }
        });
    }

    /**
     * lambda는 응답을 전달해주면 instance가 종료되기 때문에, background processing(renewal db)을 하면 안됨.
     * @param event
     * @param callback
     * @returns {*}
     */
    coord2geoInfo(event, callback) {
        let loc;
        let lang;
        try {
            console.log(event);
            let eventLocation = decodeURIComponent(event.pathParameters.loc).split(',');
            loc = [Number(eventLocation[0]), Number(eventLocation[1])];
            loc = this._geoCodeNormalize(loc);
            lang = this._getLanguage(event);
            if (loc[0] === 0 && loc[1] === 0) {
                let err = new Error("Invalid path parameters");
                err.statusCode = 404;
                return callback(err);
            }
            console.info({coord2geoInfo:{loc: loc, lang: lang}});
        }
        catch(err) {
            return callback(err);
        }

        async.tryEach([
                (cb) => {
                    this._getFromGeoCodeDb(loc, lang, (err, geoInfo)=> {
                        if (err) {
                            return cb(err);
                        }
                        if (geoInfo.country === 'KR' && geoInfo.kmaAddress == undefined) {
                            err = new Error("this data is invalid geoInfo:"+JSON.stringify(geoInfo));
                            console.error(err);
                            return cb(err);
                        }
                        if (this._isExpired(geoInfo)) {
                            err = new Error("this data is expired geoInfo:"+JSON.stringify(geoInfo));
                            console.warn(err.message);
                            return cb(err);
                        }
                        cb(err, geoInfo);
                    });
                },
                (cb) => {
                    this._getFromGeoCodeApi(loc, lang, (err, geoInfo)=> {
                        if (err) {
                            return cb(err);
                        }
                        this._updateGeoCodeDb(geoInfo, (err)=> {
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

    byCoord(event, callback) {
        this.coord2geoInfo(event, (err, geoInfo) => {
            if (err) {
                return callback(err);
            }

            let geoInfoForClient = {};
            try {
                this.importGeoInfo(geoInfoForClient, geoInfo);
                if (geoInfo.kmaAddress) {
                    geoInfoForClient.kmaAddress = geoInfo.kmaAddress;
                }
            }
            catch(err) {
                return callback(err);
            }

            callback(err, geoInfoForClient);
        });
    }

    _getFromAddressDb(addr, callback) {
        this.ctrlAddressDb.get(addr, (err, geoInfo) => {
            callback(err, geoInfo);
        });
    }

    _getFromAddressApi(addr, callback) {
        this.ctrlGeoApi.getGeoInfoByAddr(addr, (err, geoInfo) => {
            callback(err, geoInfo);
        });
    }

    _updateAddressDb(geoInfo, callback) {
        this.ctrlAddressDb.update(geoInfo, (err, result) => {
            callback(err, result);
        });
    }

    addr2geoInfo(event, callback) {
        let addr;
        try {
            console.log(event);
            if (event.pathParameters.address) {
                addr = decodeURIComponent(event.pathParameters.address);
            }
            else {
                throw new Error("Invalid address parameter");
            }
            console.info({byAddr:{addr:addr}});
        }
        catch(err) {
            return callback(err);
        }

        async.tryEach([
                (cb) => {
                    this._getFromAddressDb(addr, (err, geoInfo)=> {
                        if (err) {
                            return cb(err);
                        }
                        cb(err, geoInfo);
                    });
                },
                (cb) => {
                    this._getFromAddressApi(addr, (err, geoInfo)=> {
                        if (err) {
                            return cb(err);
                        }

                        geoInfo.loc = this._geoCodeNormalize(geoInfo.loc);

                        this._updateAddressDb(geoInfo, (err)=> {
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

    byAddr(event, callback) {
        this.addr2geoInfo(event, (err, geoInfo) => {
            if (err) {
                return callback(err);
            }

            let geoInfoForClient = {};
            try {
                this.importGeoInfo(geoInfoForClient, geoInfo);
            }
            catch (err) {
                return callback(err);
            }

            callback(err, geoInfoForClient);
        });
    }
}

module.exports = GeoInfo;
