/**
 * Created by dhkim2 on 2018-01-03.
 */

'use strict';

const expect = require('chai').expect;

const Weather = require('../function.weather');

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
});


