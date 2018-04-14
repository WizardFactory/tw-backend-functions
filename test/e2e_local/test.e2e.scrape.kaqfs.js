/**
 * Created by dhkim2 on 2018-01-03.
 */

'use strict';

const expect = require('chai').expect;

const ScrapeKaqfs = require('../../kaqfs/scrape.kaqfs');

describe('test function scrape kaqfs ', () => {

    it('test get date of kaqfs image', function(done) {
        this.timeout(60 * 1000);
        let scrape = new ScrapeKaqfs();
        scrape._getDateOfKaqfsImage()
            .then(strDate => {
                console.info(strDate);
                done();
            })
            .catch(err=> {
                expect(err).to.null;
                console.error(err);
                done();
            });
    });

    it('test copy new images to s3', function(done) {
        this.timeout(60 * 1000);
        let scrape = new ScrapeKaqfs('tw-kaqfs-images-dev');
        scrape.copyNewImagesToS3((err, result) => {
            expect(err).to.null;
            if (err) {
                console.error(err);
            }
            else {
                console.info(JSON.stringify(result));
            }
            done();
        });
    });

});

