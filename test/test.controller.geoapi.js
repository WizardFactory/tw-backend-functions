/**
 * Created by dhkim2 on 2017-12-05.
 */

'use strict';

const expect = require('chai').expect;

const ControllerGeoApi = require('../controller.geoapi');

const tokyoLocation = [35.689, 139.691];
const seoulLocation = [37.506, 127.084];
const queryKoSeoul = {locaiton: seoulLocation, lang:'ko'};
const queryEnSeoul = {locaiton: seoulLocation, lang:'en'};
const queryTokyo = {locaiton: tokyoLocation, lang:'jp'};

const resultDaumOfSeoul = { country: 'KR',
    address: '서울특별시 송파구 잠실본동',
    label: '잠실본동',
    kmaAddress: { name1: '서울특별시', name2: '송파구', name3: '잠실본동' } };

const resultGoogleOfSeoul = { country: 'KR',
    address: 'Jamsilbon-dong, Songpa-gu, Seoul, South Korea',
    label: 'Jamsilbon-dong' };

const resultGoogleOfTokyo = { country: 'JP',
    address: 'Nishishinjuku, Shinjuku, Tokyo 160-0023, Japan',
    label: 'Nishishinjuku' };

describe('test controller geoapi', () => {
    it('test isKoreaArea', () => {
        let ctrlGeoApi = new ControllerGeoApi();
        expect(ctrlGeoApi._isKoreaArea(tokyoLocation)).to.be.false;
        expect(ctrlGeoApi._isKoreaArea(seoulLocation)).to.be.true;
    });

    it('test geo info query seoul in korea', (done) => {
        let ctrlGeoApi = new ControllerGeoApi();
        ctrlGeoApi._getGeoInfoFromDaumGeoCode = (location, callback) => {
            callback(null, resultDaumOfSeoul);
        };

        ctrlGeoApi.getGeoInfoByCoord(queryKoSeoul.locaiton, queryKoSeoul.lang, (err, geoInfo)=> {
            expect(err).to.be.null;
            if (err) {
                console.error(err);
            }
            else {
                expect(geoInfo.label).to.be.equal(resultDaumOfSeoul.label);
                expect(geoInfo.kmaAddress.town).to.equal(resultDaumOfSeoul.kmaAddress.town);
                //console.log(geoInfo);
            }
            done();
        });
    });

    it('test geo info query seoul in english', (done) => {
        let ctrlGeoApi = new ControllerGeoApi();
        ctrlGeoApi._getGeoInfoFromDaumGeoCode = (location, callback) => {
            callback(null, resultDaumOfSeoul);
        };

        ctrlGeoApi._getGeoInfoFromGoogleGeoCode = (location, language, callback) => {
            callback(null, resultGoogleOfSeoul);
        };

        ctrlGeoApi.getGeoInfoByCoord(queryEnSeoul.locaiton, queryEnSeoul.lang, (err, geoInfo)=> {
            expect(err).to.be.null;
            if (err) {
                console.error(err);
            }
            else {
                expect(geoInfo.label).to.be.equal(resultGoogleOfSeoul.label);
                expect(geoInfo.kmaAddress.town).to.equal(resultDaumOfSeoul.kmaAddress.town);
                //console.log(geoInfo);
            }
            done();
        });
    });

    it('test geo info query tokyo', (done) => {
        let ctrlGeoApi = new ControllerGeoApi();

        ctrlGeoApi._getGeoInfoFromGoogleGeoCode = (location, language, callback) => {
            callback(null, resultGoogleOfTokyo);
        };

        ctrlGeoApi.getGeoInfoByCoord(queryTokyo.locaiton, queryTokyo.lang, (err, geoInfo)=> {
            expect(err).to.be.null;
            if (err) {
                console.error(err);
            }
            else {
                expect(geoInfo.label).to.be.equal(resultGoogleOfTokyo.label);
                //console.log(geoInfo);
            }
            done();
        });
    });
});
