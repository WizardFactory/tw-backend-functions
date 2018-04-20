/**
 * Created by dhkim2 on 2018-04-13
 */

"use strict";

const request = require('request');
const async = require('async');
const fs = require('fs');

let dns = require('dns'),
    dnscache = require('dnscache')({
        "enable" : true,
        "ttl" : 300,
        "cachesize" : 1000
    });

const ControllerS3 = require('../aws/controller.s3');

class RequestAqicn {
    constructor(bucket) {
        this.urlPrefix = 'https://api.waqi.info/api/feed/@';
        this.urlPostFix = '/obs.en.json';

        this.region = 'ap-northeast-2';
        this.bucket = bucket || 'tw-aqicn-stninfo';
        this.ctrlS3  = new ControllerS3(this.region, this.bucket);
    }

    _makeIndexList() {
        let indexList = [];
        for (let i = 0; i<=10148; i++) {
            indexList.push(i);
        }
        return indexList;
    }

    _makeUrlByIdx(idx) {
        return this.urlPrefix+idx+this.urlPostFix;
    }

    _getStnInfoListFromS3() {
        this.ctrlS3.allKeys = [];
        return new Promise((resolve, reject)=> {
            this.ctrlS3.lsAll(null, null, (err)=> {
                if (err) {
                    return reject(err);
                }
                resolve(this.ctrlS3.allKeys);
            });
        });
    }

    _request(url, callback) {
        // console.info({_request:{url:url}});
        let options = {json: true, timeout: 30000, gzip: true};
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

    _parseFeed(body, index, callback) {
        let fileName;
        let data;
        let idx;
        try {
            let engName;
            let v;
            data = body.rxs.obs[0].msg;
            if (data == undefined) {
                throw new Error('It need to retry');
            }
            if (data.status === 'error') {
                if (data.msg === 'Unknown ID') {
                    engName =  'UnknownID';
                    idx = index;
                }
                else {
                    throw new Error(data.msg);
                }
            }
            else if (data.time.s.en.time == 'Never updated!') {
                engName =  'NeverUpdated';
                idx = index;
            }
            else if (data.city.url.indexOf('?') < 0) {
                engName = data.city.url.replace('http://aqicn.org/city/', '');
                engName = engName.slice(0, engName.length-1);
                idx = data.city.idx;
            }
            else {
                engName = decodeURIComponent(data.city.id);
                engName = engName.slice(0, engName.length-1);
                idx = data.city.idx;
            }
            if (data.time) {
                v =  data.time.v;
            }
            else {
                v = '1970-01-01T09:00:00+09:00';
            }
            fileName = idx+'_'+engName+'_'+v+'.json';
            fileName = fileName.replace(/\//g,'-');
        }
        catch (err) {
            err.message += ' url=' +  this._makeUrlByIdx(index);
            return callback(err);
        }

        if (idx < 0) {
            return callback(new Error(`invalid idx index:${this._makeUrlByIdx(index)}`));
        }

        return callback(null, {fileName: fileName, city: data.city});
    }

    _upload2s3(obj, callback) {
        this.ctrlS3.uploadData(JSON.stringify(obj.city, null, 2), obj.fileName)
            .then(result => {
                callback(null, result);
            })
            .catch(err => {
                callback(err);
            });
    }

    _getStnInfoFromFeed(idx, callback) {
        async.waterfall([
                (callback) => {
                    this._request(this._makeUrlByIdx(idx), callback);
                },
                (result, callback) => {
                    this._parseFeed(result, idx, callback);
                },
                (stnInfo, callback) => {
                    this._upload2s3(stnInfo, callback);
                }
            ],
            callback);
    }

    _getStnInfoList(idxList, callback) {
        console.info(`idexList.length:${idxList.length}`);

        async.mapLimit(idxList, 100,
            (idx, callback) => {
                this._getStnInfoFromFeed(idx, (err, result)=> {
                    if (err) {
                        console.warn(err);
                    }
                    //ignore error of each request
                    callback(null, result);
                });
            },
            callback);
    }

    _filterIdxListByObjList(idxList, objList) {
        return idxList.filter(idx => {
            let objName = objList.find(obj=> {
                return obj.Key.indexOf(idx+'_') === 0;
            });
            return objName == undefined;
        });
    }

    /**
     * data from feed to s3
     */
    do(callback) {
        let idxList = this._makeIndexList();
        this._getStnInfoListFromS3()
            .then(objList => {
                console.info(`idxList:${idxList.length}, objList:${objList.length}`);
                return this._filterIdxListByObjList(idxList, objList);
            })
            .then(idxList => {
                this._getStnInfoList(idxList, (err, result)=> {
                    if (err) {
                        console.error(err);
                    }
                    callback(err, result);
                });
            })
            .catch(err => {
                console.error(err);
                callback(err);
            });
    }
}

module.exports = RequestAqicn;
