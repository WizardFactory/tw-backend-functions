/**
 * Created by JSSeo on 2019-01-23
 */
'use strict';

const expect = require('chai').expect;

const ControllerKakao = require('../geoinfo/controller.kakao');
const body = {
    "meta":{
        "total_count":2
    },
    "documents":[
        {
        "region_type":"B",
        "code":"1171010100",
        "address_name":"서울특별시 송파구 잠실동",
        "region_1depth_name":"서울특별시",
        "region_2depth_name":"송파구",
        "region_3depth_name":"잠실동",
        "region_4depth_name":"",
        "x":127.08850894896224,
        "y":37.51191665996842
        },
        {
            "region_type":"H",
            "code":"1171065000",
            "address_name":"서울특별시 송파구 잠실본동",
            "region_1depth_name":"서울특별시",
            "region_2depth_name":"송파구",
            "region_3depth_name":"잠실본동",
            "region_4depth_name":"",
            "x":127.0843446217054,
            "y":37.506146070187526
        }
        ]
};

const addressBody = {
    "meta":{
        "is_end":true,
        "total_count":1,
        "pageable_count":1
    },
    "documents":[{
        "road_address":null,
        "address_name":"서울 송파구 잠실본동",
        "address": {
            "b_code":"",
            "region_3depth_h_name":"잠실본동",
            "main_address_no":"",
            "h_code":"1171065000",
            "region_2depth_name":"송파구",
            "main_adderss_no":"",
            "sub_address_no":"",
            "region_3depth_name":"",
            "address_name":"서울 송파구 잠실본동",
            "y":"37.506153291140606",
            "x":"127.08432653401003",
            "mountain_yn":"N",
            "zip_code":"",
            "region_1depth_name":"서울",
            "sub_adderss_no":""
        },
        "y":"37.506153291140606",
        "x":"127.08432653401003",
        "address_type":"REGION"
    }]
};

//lat, lng
const seoulLocation = [37.506,127.084];
const addr = "서울특별시 송파구 잠실본동";


describe('ctrl Kakao', ()=> {
    it ('test coord2geoInfo', () => {
        let ctrlKakao = new ControllerKakao();
        ctrlKakao._setGeoCode(seoulLocation, 'ko');
        let geoInfo = ctrlKakao._coord2geoInfo(body);
        expect(geoInfo.label).to.equal(body.name);
        expect(geoInfo.lang).to.equal('ko');
    });

    it('test by geocode', (done) => {
        let ctrlKakao = new ControllerKakao();
        ctrlKakao.axios ={
            get: function(){
                return new Promise((resolve)=>{
                    resolve({data: body});
                });
            }
        };


        ctrlKakao.byGeoCode(seoulLocation, (err, geoInfo) => {
            console.log(JSON.stringify(geoInfo));
            expect(geoInfo.label).to.equal(body.name);
            expect(geoInfo.loc).to.equal(seoulLocation);
            done();
        });
    });

    it('test by address', (done) => {
        let ctrlKakao = new ControllerKakao();
        ctrlKakao.axios ={
            get: function(){
                return new Promise((resolve)=>{
                    resolve({data: addressBody});
                });
            }
        };

        ctrlKakao.byAddress(addr, (err, geoInfo) => {
            if (err) {
                console.error(err);
            }
            console.log(JSON.stringify(geoInfo));
            let location = [addressBody.documents[0].y, addressBody.documents[0].x];
            expect(geoInfo.loc[0]).to.equal(location[0]);
            expect(geoInfo.loc[1]).to.equal(location[1]);
            done();
        });
    });
});
