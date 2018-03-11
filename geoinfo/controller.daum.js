/**
 * Created by dhkim2 on 2017-12-04.
 */

'use strict';

const async = require('async');

const ControllerExternalApi = require('./controller.externalapi');

const config = require('../config');

class ControllerDaum extends ControllerExternalApi {
    constructor() {
        super();
        this.keys = JSON.parse(config.keyString.daum_keys);
        this.endpoint = 'https://apis.daum.net/local/geo';
    }

    _coord2geoInfo(result, loc, lang) {
        loc = loc || this.loc;
        lang = lang || this.lang;

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
            geoInfo.kmaAddress = {"name1": result.name1};
            if (name2 && name2.length > 0) {
                geoInfo.kmaAddress.name2 = name2;
            }
            if (result.name3 && result.name3.length > 0) {
                geoInfo.kmaAddress.name3 = result.name3;
            }
        }
        //일본 뿐만 아니라, 남해인경우에도 일본지역인 경우가 있음. #2012
        // else if (result.name0 === "일본") {
        //     geoInfo.country = "JP";
        // }
        // else {
        //     throw new Error("It is not korea");
        // }

        geoInfo.loc = loc;
        geoInfo.lang = lang;
        geoInfo.provider = 'daum';

        return geoInfo;
    }

    byGeoCode(loc, callback) {
        let index = 0;
        let lang = 'ko';

        this._setGeoCode(loc, lang);

        async.retry(this.keys.length,
            (cb) => {
                let url = this.endpoint;
                    url += '/coord2addr' +
                    '?apikey=' + this.keys[index] +
                    '&latitude=' + this.loc[0] +
                    '&longitude=' + this.loc[1] +
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
                   geoInfo = this._coord2geoInfo(result, loc, lang);
                }
                catch (err) {
                    return callback(err);
                }
                callback(null, geoInfo);
            });

        return this;
    };

    _addr2geoInfo(result, addr) {
        let geoInfo;
        if (result.channel.totalCount <= 0) {
            throw new Error("Fail to find query="+addr);
        }
        if (result.channel.totalCount > 1) {
            console.warn("too many result of query="+addr);
        }

        let item = result.channel.item[0];
        geoInfo = {};
        geoInfo.loc = [item.lat, item.lng];
        geoInfo.address = addr;
        geoInfo.country = 'KR';

        return geoInfo;
    }

    byAddress(addr, callback) {
        let index = 0;

        async.retry(this.keys.length,
            (cb) => {
                let url = this.endpoint;
                url += '/addr2coord?apikey=' + this.keys[index] +
                    '&q='+ encodeURIComponent(addr) +
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
                    // console.log(JSON.stringify(result));
                    geoInfo = this._addr2geoInfo(result, addr);
                }
                catch (err) {
                    return callback(err);
                }
                callback(null, geoInfo);
            });
        return this;
    }
}

module.exports = ControllerDaum;
