/**
 * Created by dhkim2 on 2018-03-10.
 */

'use strict';

const async = require('async');
const Vision = require('@google-cloud/vision');

const ControllerS3 = require('../aws/controller.s3');
const config = require('../config');

class ScrapeKaqfs {
    constructor(bucket) {
        //this.imgPathPrefix = 'http://www.webairwatch.com/kaq/modelimg_CASE2';
        //this.imgPathPrefix = 'http://www.webairwatch.com/kaq/modelimg_CASE4';
        //this.imgPathPrefix = 'http://www.webairwatch.com/kaq/modelimg_CASE5';
        this.imgPathUrl = 'http://www.webairwatch.com/kaq';
        // this.imgPathPrefixs = ['modelimg', 'modelimg_CASE2', 'modelimg_CASE4', 'modelimg_CASE5'];
        this.imgPathPrefixs = ['modelimg', 'modelimg_CASE4'];
        this.jpegPostfix = '000.gif';
        this.animationPostfix = 'animation.gif';
        // this.areaList = ['09KM', '03KM', '27KM'];
        this.areaList = ['09KM'];
        this.pollutantList = ['PM10', 'PM2_5', 'O3', 'NO2', 'SO2'];

        let options = {
            projectId: 'admob-app-id-6159460161',
            credentials: config.gcsCredentials
        };

        this.region = config.image.kaq_korea_image.region;
        this.bucket = bucket || config.image.kaq_korea_image.bucketName;

        this.vision = new Vision.ImageAnnotatorClient(options);
        this.ctrlS3  = new ControllerS3(this.region, this.bucket);
        this.backupFolder = 'dateBackup';
    }

    /**
     *
     * @param url
     * @returns {Promise}
     * @private
     */
    _textDetection(url) {
        console.info({imgUrl: url});
        return this.vision.textDetection(url);
    }

    /**
     *
     * @param {[{}]} detections
     * @returns {String}
     * @private
     */
    _getDate(detections) {
        let strDate;
        try {
            let aDesc = detections[0].description.split('\n');
            strDate = aDesc[aDesc.length-2];
            strDate = strDate.slice(0, 19);
            console.info({date:strDate});
        }
        catch (err) {
            console.error(JSON.stringify(detections));
            throw err;
        }
        return strDate;
    }

    _getDateOfKaqfsImage(imgPathPrefix, pollutant) {
        imgPathPrefix = imgPathPrefix || this.imgPathPrefixs[0];
        pollutant = pollutant ||  this.pollutantList[0];

        let url = this.imgPathUrl + '/'+ imgPathPrefix + '/' + pollutant + '.'+
            this.areaList[0] + '.' + this.jpegPostfix;
        return this._textDetection(url)
            .then(results => {
                const detections = results[0].textAnnotations;
                //console.log({detections: detections});
                if (results[0].error) {
                    console.error(results[0].error);
                }
                return detections;
            })
            .then((detections)=> {
                return this._getDate(detections);
            })
    }

    _getGifImageList(prefix, pollutant) {
        let list = [];
        this.areaList.forEach(area => {
            if (pollutant) {
                let url = this.imgPathUrl + '/' + prefix + '/' + pollutant + '.' + area + '.' + this.animationPostfix;
                list.push({url:url, s3Path: prefix +'.'+ pollutant + '.' + area + '.' + this.animationPostfix});
                return;
            }
            else {
                //make all pollutant list;
                this.pollutantList.forEach(pollutant=> {
                    let url = this.imgPathUrl + '/' + prefix + '/' + pollutant + '.' + area + '.' + this.animationPostfix;
                    list.push({url:url, s3Path: prefix +'.'+ pollutant + '.' + area + '.' + this.animationPostfix});
                });
            }
        });
        return list;
    }

    _uploadListToS3(list) {
        return new Promise((resolve, reject) => {
            async.mapLimit(list, 3,
                (obj, callback) => {
                    this.ctrlS3.upload(obj.url, obj.s3Path)
                        .then(result => {
                            callback(null, result);
                        })
                        .catch(err => {
                            callback(err);
                        });
                },
                (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                });
        });
    }

    /**
     *
     * @param [{Location: String, Bucket: String, Key: String, ETag: String}], list
     * @param prefix
     * @returns {Promise<any>}
     * @private
     */
    _copyS3ListToDest(list, prefix) {
        return new Promise((resolve, reject) => {
            async.mapLimit(list, 3,
                (obj, callback) => {
                    //2018-03-24 09:00:00(KST)/PM2_5.09km.animation.gif
                    let strArray = obj.Key.split('/');
                    let src = this.bucket+'/' + obj.Key;
                    let dest = prefix+strArray[1]+'_'+new Date().toISOString()+'_'+strArray[0];
                    console.info({dest:dest, src: src});
                    this.ctrlS3.copy(dest, src)
                        .then(result => {
                            callback(null, result);
                        })
                        .catch(err => {
                            callback(err);
                        });
                },
                (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(result);
                });
        });
    }

    _copyNewImagesToS3EachModel(imgPathPrefix, callback) {
        async.retry(3,
            (callback)=> {
                this._getDateOfKaqfsImage(imgPathPrefix)
                    .then(strDate=> {
                        let imageUrlList = this._getGifImageList(imgPathPrefix);
                        return imageUrlList.map(obj => {
                            obj.s3Path = strDate + '/' + obj.s3Path;
                            return obj;
                        });
                    })
                    .then(list => {
                        return this._uploadListToS3(list);
                    })
                    .then(s3list => {
                        callback(null, s3list);
                    })
                    .catch(err => {
                        console.error(err);
                        callback(err);
                    });
            },
            (err, s3list) => {
                if(err) {
                    return callback(err)
                }
                callback(null, s3list);
                // let prefix = this.backupFolder + '/';
                // this._copyS3ListToDest(s3list, prefix)
                //     .then(result => {
                //         callback(null, result);
                //     })
                //     .catch(err => {
                //         callback(err);
                //     });
            });
    }

    _copyNewImagesToS3EachArea(imgPathPrefix, pollutant, callback) {
        async.retry(3,
            (callback)=> {
                this._getDateOfKaqfsImage(imgPathPrefix, pollutant)
                    .then(strDate=> {
                        let imageUrlList = this._getGifImageList(imgPathPrefix, pollutant);
                        return imageUrlList.map(obj => {
                            obj.s3Path = strDate + '/' + obj.s3Path;
                            return obj;
                        });
                    })
                    .then(list => {
                        return this._uploadListToS3(list);
                    })
                    .then(s3list => {
                        callback(null, s3list);
                    })
                    .catch(err => {
                        console.error(err);
                        callback(err);
                    });
            },
            (err, s3list) => {
                callback(err, s3list);
            });
    }

    _copyNewImagesToS3EachPollutant(imgPathPrefix, callback) {
        async.mapSeries(this.pollutantList,
            (pollutant, callback) => {
                this._copyNewImagesToS3EachArea(imgPathPrefix, pollutant, callback);
            },
            (err, results)=> {
                callback(err, results);
            });
    }

    copyNewImagesToS3(callback) {
        async.mapSeries(this.imgPathPrefixs,
            (imgPathPrefix, callback)=> {
                this._copyNewImagesToS3EachPollutant(imgPathPrefix, callback);
            },
            (err, results)=> {
                if (err) {
                    console.error(err);
                    return callback(err)
                }
                return callback(err, results);
            });
    }
}

module.exports = ScrapeKaqfs;
