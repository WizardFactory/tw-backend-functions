/**
 * Created by dhkim2 on 2018-01-03.
 */

'use strict';

const expect = require('chai').expect;

const Weather = require('../weather/function.weather');

describe('test function weather', () => {
    let ip = "12.12.12.32";
    let geoInfo = {
        loc: [38.234, 126.123]
    };

    it('test make doamin url', () => {
        let weather = new Weather();
        let urls = weather._makeUrls(geoInfo);
        expect(urls.length).to.equal(1);
        expect(urls[0].indexOf(ip)).to.equal(-1);
    });

    it('test make ip and domain url', () => {
        Weather.setServiceServerIp(ip);
        let weather = new Weather();
        let urls = weather._makeUrls(geoInfo);
        expect(urls.length).to.equal(2);
        expect(urls[0].indexOf(ip)).to.not.equal(-1);
    });

    it('test fail to get request', (done) => {
        let weather = new Weather();
        weather._request = function (url, callback ) {
            callback(new Error("Fail to request"));
        };

        weather._coord2geoInfo = function (event, callback) {
            callback(null, { updatedAt: 1514627593387,
                label: '鶴賀',
                address: '日本、〒381-0000 長野県長野市鶴賀',
                id: '36.65,138.19,ja',
                country: 'JP',
                loc: [ 36.65, 138.19 ],
                lang: 'ja' });
        };

        weather.byCoord({}, function (err) {
            expect(err).to.not.null;
            done();
        });
    });
});


