/**
 * Created by dhkim2 on 2018-01-03.
 */

'use strict';

const expect = require('chai').expect;

const Weather = require('../../function.weather');

describe('test function weather', () => {
    let ip = "12.12.12.32";
    let geoInfo = {
        loc: [38.234, 126.123]
    };

    // it('test make doamin url', (done) => {
    //     let weather = new Weather();
    //     let urls = weather._makeUrls(geoInfo);
    //     weather._requests(urls, function (err, result) {
    //         if (err) {
    //             console.error(err);
    //         }
    //         else {
    //             console.info(result);
    //         }
    //         done();
    //     });
    // });

    it('test make ip and domain url', function(done) {
        this.timeout(10*1000);
        Weather.setServiceServerIp(ip);
        let weather = new Weather();
        let urls = weather._makeUrls(geoInfo);
        weather._requests(urls, function (err, result) {
            if (err) {
                console.error(err);
            }
            else {
                //console.info(result);
            }
            done();
        });
    });

    it('test make ip and domain url', function(done) {
        this.timeout(10*1000);
        ip = "34.195.193.177";
        Weather.setServiceServerIp(ip);
        let weather = new Weather();
        let urls = weather._makeUrls(geoInfo);
        weather._requests(urls, function (err, result) {
            if (err) {
                console.error(err);
            }
            else {
                //console.info(result);
            }
            done();
        });
    });
});

