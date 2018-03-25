/**
 * Created by dhkim2 on 2018-01-03.
 */

'use strict';

const expect = require('chai').expect;
const ControllerS3 = require('../../kaqfs/controller.s3');

describe('test function controller s3 ', () => {

    it('test ls root on s3', function(done) {
        this.timeout(60 * 1000);
        let ctrlS3  = new ControllerS3('ap-northeast-2', 'tw-kaqfs-images');
        ctrlS3.ls()
            .then(results => {
                console.info(results);
                done();
            })
            .catch(err => {
                console.error(err);
                expect(err).to.null;
                done();
            });
    });

    it('test ls in folder on s3', function(done) {
        this.timeout(60 * 1000);
        let ctrlS3  = new ControllerS3('ap-northeast-2', 'tw-kaqfs-images');
        ctrlS3.ls('2018-03-10 09:00:00(KST)/')
            .then(results => {
                console.info(results);
                done();
            })
            .catch(err => {
                console.error(err);
                expect(err).to.null;
                done();
            });
    });

    it('test get object on s3', function(done) {
        this.timeout(60 * 1000);

        let ctrlS3  = new ControllerS3('ap-northeast-2', 'tw-kaqfs-images');
        ctrlS3.get('2018-03-10 09:00:00(KST)/SO2.09km.animation.gif')
            .then(result => {
                done();
            })
            .catch(err => {
                console.error(err);
                expect(err).to.null;
                done();
            });
    });

    it('test copy object to new prefix', function(done) {
        this.timeout(60 * 1000);

        let ctrlS3  = new ControllerS3('ap-northeast-2', 'tw-kaqfs-images');
        ctrlS3.copy('dateBackup/SO2.09km.animation.gif',
            'tw-kaqfs-images/2018-03-10 09:00:00(KST)/SO2.09km.animation.gif')
            .then(result => {
                console.info(result);
                done();
            })
            .catch(err => {
                console.error(err);
                expect(err).to.null;
                done();
            });
    });
});

