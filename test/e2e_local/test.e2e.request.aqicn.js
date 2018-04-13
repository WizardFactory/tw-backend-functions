/**
 * Created by dhkim2 on 2018-04-13.
 */

"use strict";

const expect = require('chai').expect;

const RequestAqicn = require('../../aqicn/request.aqicn');

describe('test function request aqicn ', () => {
    let requestAqicn = new RequestAqicn();

    it('test get data from s3', function(done) {
        this.timeout(10*1000);
        requestAqicn._getStnInfoListFromS3()
            .then(list=> {
                console.info(`s3 list length:${list.length}`);
                done();
            });
    });

    it('test filter idx list by obj list', function() {
        let s3objList = [
            { Key: '10001_Finland-Helsinki-Mechelininkat_2018-02-19T22:00:00+09:00.json',
                StorageClass: 'STANDARD' },
            { Key: '10002_Finland-Nastola-Rakokiventiesiirrettäv_2018-02-20T00:00:00+09:00.json',
                StorageClass: 'STANDARD' },
            { Key: '10003_Finland-Pieksämäki-Savonti_2018-02-21T08:00:00+09:00.json',
                StorageClass: 'STANDARD' }
        ];

        let idxList = [10001, 10003, 10004, 5];
        let result = requestAqicn._filterIdxListByObjList(idxList, s3objList);
        console.info(result);
    });

    it('test get city from feed', function(done) {

        let idxList = [10001, 5];

        requestAqicn._upload2s3 = function (stnInfo, callback) {
            callback(null, stnInfo);
        };

        requestAqicn._getStnInfoList(idxList, (err, result)=> {
            if (err) {
                console.error(err);
            }
            console.info(result);
            done();
        });
    });

    it('test get city from feed to s3', function(done) {

        let idxList = [9999, 10003, 10004, 5];

        requestAqicn = new RequestAqicn('tw-aqicn-stninfo-dev');

        requestAqicn._getStnInfoList(idxList, (err, result)=> {
            if (err) {
                console.error(err);
            }
            console.info(result);
            done();
        });
    });
});

