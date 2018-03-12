/**
 * Created by dhkim2 on 2017-12-05.
 */

'use strict';

const expect = require('chai').expect;

const ControllerDaum = require('../geoinfo/controller.daum');

const body = {"type":"H","code":"1124071","name":"잠실본동","fullName":"서울특별시 송파구 잠실본동","regionId":"I10171299","name0":"대한민국","code1":"11","name1":"서울특별시","code2":"11240","name2":"송파구","code3":"1124071","name3":"잠실본동","x":127.0843446217054,"y":37.506146070187526};

const addressBody = {
    "channel": {
        "totalCount": "1",
        "link": "http://developers.daum.net/services",
        "result": "1",
        "generator": "Daum Open API",
        "pageCount": "1",
        "lastBuildDate": "",
        "item": [{
            "mountain": "",
            "mainAddress": "0",
            "point_wx": "518640",
            "point_wy": "1112976",
            "isNewAddress": "N",
            "buildingAddress": "",
            "title": "서울 송파구 잠실본동",
            "placeName": "Not avaliable",
            "zipcode": "",
            "newAddress": "",
            "localName_2": "송파구",
            "localName_3": "잠실본동",
            "localName_1": "서울",
            "lat": 37.5061532911,
            "point_x": 127.084326534,
            "lng": 127.084326534,
            "zone_no": "",
            "subAddress": "0",
            "id": "RI10171299",
            "point_y": 37.5061532911
        }],
        "title": "Search Daum Open API",
        "descrtion": "Daum Open API search result"
    }
};

//lat, lng
const seoulLocation = [37.506,127.084];
const addr = "서울특별시 송파구 잠실본동";

describe('ctrl daum', ()=> {
    it ('test coord2geoInfo', () => {
        let ctrlDaum = new ControllerDaum();
        ctrlDaum._setGeoCode(seoulLocation, 'ko');
        let geoInfo = ctrlDaum._coord2geoInfo(body);
        expect(geoInfo.label).to.equal(body.name);
        expect(geoInfo.lang).to.equal('ko');
    });

    it('test by geocode', (done) => {
        let ctrlDaum = new ControllerDaum();
        ctrlDaum._request = function(url, callback) {
            //console.log('test url : ',url);
            callback(null, body);
        };

        ctrlDaum.byGeoCode(seoulLocation, (err, geoInfo) => {
            expect(geoInfo.label).to.equal(body.name);
            expect(geoInfo.loc).to.equal(seoulLocation);
            done();
        });
    });

    it('test by address', (done) => {
        let ctrlDaum = new ControllerDaum();
        ctrlDaum._request = function(url, callback) {
            //console.log('test url : ',url);
            callback(null, addressBody);
        };

        ctrlDaum.byAddress(addr, (err, geoInfo) => {
            if (err) {
                console.error(err);
            }

            let location = [addressBody.channel.item[0].lat, addressBody.channel.item[0].lng];
            expect(geoInfo.loc[0]).to.equal(location[0]);
            expect(geoInfo.loc[1]).to.equal(location[1]);
            done();
        });
    });
});
