/**
 * Created by dhkim2 on 2018-03-10.
 */

'use strict';

const async = require('async');
const Vision = require('@google-cloud/vision');

const ControllerS3 = require('./controller.s3');
const config = require('../config');

class ScrapeKaqfs {
    constructor() {
        this.imgPathPrefix = 'http://www.webairwatch.com/kaq/modelimg_CASE4';
        this.jpegPostfix = '000.gif';
        this.animationPostfix = 'animation.gif';
        this.areaList = ['09km', '03km', '27km'];
        this.pollutantList = ['PM10', 'PM2_5', 'O3', 'NO2', 'SO2'];

        let options = {
            projectId: 'admob-app-id-6159460161',
            credentials: config.gcsCredentials
        };

        this.vision = new Vision.ImageAnnotatorClient(options);
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
            console.info({date:strDate});
        }
        catch (err) {
            console.error(JSON.stringify(detections));
            throw err;
        }
        return strDate;
    }

    _getDateOfKaqfsImage() {
        let url = this.imgPathPrefix + '/' +this.pollutantList[0] + '.'+ this.areaList[0] + '.' + this.jpegPostfix;
        return this._textDetection(url)
            .then(results => {
                const detections = results[0].textAnnotations;
                //console.log({detections: detections});
                return detections;
            })
            .then((detections)=> {
                return this._getDate(detections);
            })
    }

    _getGifImageList() {
        let list = [];
        this.areaList.forEach(area => {
            this.pollutantList.forEach(pollutatnt=> {
                let url = this.imgPathPrefix + '/' + pollutatnt + '.' + area + '.' + this.animationPostfix;
                list.push({url:url, s3Path: pollutatnt + '.' + area + '.' + this.animationPostfix});
            });
        });
        return list;
    }

    _uploadListToS3(list, callback) {
        let ctrlS3  = new ControllerS3('ap-northeast-2', 'tw-kaqfs-images');
        async.mapLimit(list, 3,
            (obj, callback)=> {
                ctrlS3.upload(obj.url, obj.s3Path)
                    .then(result => {
                        callback(null, result);
                    })
                    .catch(err => {
                        callback(err);
                    });
            },
            (err, results) => {
                callback(err, results);
            });
    }

    copyNewImagesToS3(callback) {
        async.retry(3,
            (callback)=> {
                this._getDateOfKaqfsImage()
                    .then(strDate=> {
                        let imageUrlList = this._getGifImageList();
                        return imageUrlList.map(obj => {
                            obj.s3Path = strDate + '/' + obj.s3Path;
                            return obj;
                        });
                    })
                    .then(list => {
                        this._uploadListToS3(list, callback);
                    })
                    .catch(err => {
                        console.error(err);
                        callback(err);
                    });
            },
            (err, result) => {
                if(err) {
                    console.error(err);
                }
                callback(err, result);
            });
    }
}

module.exports = ScrapeKaqfs;
