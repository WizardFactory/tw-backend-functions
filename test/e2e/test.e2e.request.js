/**
 * Created by dhkim2 on 2017-12-27.
 */

'use strict';

const expect = require('chai').expect;
const request = require('request');

const config = require('../../config');

let testCoordList = [
    { loc: '37.567,126.978', lang: 'en-US', name: 'Taepyeongno 1(il)-ga'},
    { loc: '36.65,138.19', lang: 'ja', name: '鶴賀'},
];

const WeatherCoordApi = '/weather/coord';
const GeoCodeAddrdApi = '/geocode/addr';

describe('e2e '+WeatherCoordApi, ()=> {
    testCoordList.forEach(function (testCase) {
        it ('test '+JSON.stringify(testCase), function (done) {
            this.timeout(10*1000);
            let serverUrl = config.apiServer.url;
            let endpoint = WeatherCoordApi+'/'+testCase.loc;
            let url = serverUrl+endpoint;
            let options = {json: true, timeout: 3000, headers: {'Accept-Language' : testCase.lang}};
            console.log(url);
            request(url, options, (err, response, body) => {
                expect(err).to.null;
                expect(body.name).to.equal(testCase.name);
                done();
            });
        });
    });
});

let testAddrList = [
    {addr: '서울특별시 송파구 잠실본동', lang: 'ko', location: { lat: 37.506, long: 127.084 }}
];

describe('e2e '+GeoCodeAddrdApi, ()=> {
    testAddrList.forEach(function (testCase) {
        it ('test '+JSON.stringify(testCase), function (done) {
            this.timeout(10*1000);
            let serverUrl = config.apiServer.url;
            let endpoint = GeoCodeAddrdApi + '/' + encodeURIComponent(testCase.addr);
            let url = serverUrl+endpoint;
            let options = {json: true, timeout: 3000, headers: {'Accept-Language' : testCase.lang}};
            console.log(url);
            request(url, options, (err, response, body) => {
                expect(err).to.null;
                console.log(body);
                expect(body.location.lat).to.equal(testCase.location.lat);
                done();
            });
        });
    });
});
