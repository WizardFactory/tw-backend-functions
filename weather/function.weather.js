/**
 * Created by dhkim2 on 2017-12-05.
 */

'use strict';

const async = require('async');
const request = require('request');

const GeoCode = require('../geoinfo/function.geoinfo');
const config = require('../config');

// let serviceServerIp;

class Weather {

    // static setServiceServerIp(ip) {
    //     serviceServerIp = 'http://'+ip;
    // }

    constructor() {
        this.geoCode = new GeoCode();
        this.lang = 'en';
        this.url = config.serviceServer.url;
        this.version = config.serviceServer.version;
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

    _requestRetry(url, callback) {
        async.retry(3,
            (callback)=> {
                this._request(url, (err, result)=> {
                    if (err) {
                        console.warn(err.message, url);
                        return callback(err);
                    }
                    callback(null, result);
                });
            },
            (err, result)=> {
                if (err) {
                    return callback(err);
                }
                callback(null, result);
            })
    }

    _requests(urls, callback) {
        let requestResult;
        async.someSeries(urls, (url, callback) => {
            let startTime = new Date();
            this._request(url, function (err, result) {
                if (err) {
                    console.warn(err.message, url);
                    return callback(null, !err);
                }
                console.info({twServiceResponseTime: new Date().getTime() - startTime.getTime()});
                requestResult = result;
                callback(null, !err);
            });
        }, (err, result) => {
            if (err) {
                return callback(err);
            }
            if (result === false) {
                err =  new Error("Fail to get weather data");
            }
            callback(err, requestResult);
        });
    };

    _geoinfo2url(server, version, geoInfo) {
        let url = server + '/' + version;
        if (geoInfo.country === 'KR') {
            url += '/kma/addr';
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
            url += '/dsf/coord';
            url += '/' + geoInfo.loc[0] + ','+geoInfo.loc[1];
            return url;
        }
    }

    _appendQueryParameters(url, event) {
        let querys;
        let count = 0;
        if (!event || !event.hasOwnProperty('queryStringParameters')) {
            return url;
        }
        querys = event.queryStringParameters;
        for (let key in querys) {
            url += count === 0? '?':'&';
            url += key+'='+querys[key];
            count ++;
        }
        return url;
    }

    _getLanguage(event) {
        if (!event.headers) {
            console.error('Fail to find headers');
            return 'en';
        }
        if (event.headers.hasOwnProperty('Accept-Language')) {
            return event.headers['Accept-Language'].split('-')[0];
        }
        else if (event.headers.hasOwnProperty('accept-language')) {
            return event.headers['accept-language'].split('-')[0];
        }
        else {
            console.error('Fail to find accept-language');
            return 'en';
        }
    }

    _makeUrls(geoInfo, event) {
        let urls =[];
        let domainUrl;
        let ipUrl;
        let version;

        if (event && event.pathParameters) {
            version = event.pathParameters.version || this.version;
        }
        else {
            version = this.version;
        }

        // if (serviceServerIp) {
        //     ipUrl = this._geoinfo2url(serviceServerIp, version, geoInfo);
        //     ipUrl = this._appendQueryParameters(ipUrl, event);
        //     urls.push(ipUrl);
        // }
        domainUrl = this._geoinfo2url(this.url, version, geoInfo);
        domainUrl = this._appendQueryParameters(domainUrl, event);
        urls.push(domainUrl);
        return urls;
    }

    _coord2geoInfo (event, callback) {
        this.geoCode.coord2geoInfo(event, callback);
    }

    _importGeoInfo (dest, src) {
        this.geoCode.importGeoInfo(dest, src);
    }

    byCoord (event, callback) {
        try{
            this.lang = this._getLanguage(event);
        }
        catch (err) {
            console.error(err);
        }

        async.waterfall([
            (callback) => {
                this._coord2geoInfo(event, (err, result) => {
                    callback(err, result);
                });
            },
            (geoInfo, callback) => {
                let urls;
                try {
                   console.info({geoInfo: geoInfo});
                   urls = this._makeUrls(geoInfo, event) ;
                   if (!urls) {
                       throw new Error("Fail to make urls");
                   }
                }
                catch (err) {
                    return callback(err);
                }

                //this._requests(urls, (err, result)=> {
                this._requestRetry(urls[0], (err, result)=> {
                    if (err) {
                        return callback(err);
                    }
                    try {
                        this._importGeoInfo(result, geoInfo);
                    }
                    catch (err) {
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
