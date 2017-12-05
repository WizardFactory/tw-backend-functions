/**
 * Created by dhkim2 on 2017-12-05.
 */

'use strict';

const expect = require('chai').expect;

const ControllerDaum = require('../controller.daum');

const body = {"type":"H","code":"1124071","name":"잠실본동","fullName":"서울특별시 송파구 잠실본동","regionId":"I10171299","name0":"대한민국","code1":"11","name1":"서울특별시","code2":"11240","name2":"송파구","code3":"1124071","name3":"잠실본동","x":127.0843446217054,"y":37.506146070187526};

//lat, lng
const seoulLocation = [37.506,127.084];

describe('ctrl daum', ()=> {
    it ('test coord2geoInfo', () => {
        let ctrlDaum = new ControllerDaum(seoulLocation);
        let geoInfo = ctrlDaum._coord2geoInfo(body);
        expect(geoInfo.label).to.equal(body.name);
    });

    it('test getaddress', (done) => {
        let ctrlDaum = new ControllerDaum(seoulLocation);
        ctrlDaum._request = function(url, callback) {
            //console.log('test url : ',url);
            callback(null, body);
        };

        ctrlDaum.getAddress((err, geoInfo) => {
            expect(geoInfo.label).to.equal(body.name);
            done();
        });
    });
});
