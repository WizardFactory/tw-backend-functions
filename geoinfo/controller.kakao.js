/**
 * Created by JSSeo on 2019-01-23
 */


'use strict';

const async = require('async');
const ControllerExternalApi = require('./controller.externalapi');
const config = require('../config');
const axios = require('axios');

class ControllerKakao extends ControllerExternalApi {
    constructor() {
        super();
        this.keys = JSON.parse(config.keyString.kakao_keys);
        this.axios = axios; // wrapper for test by using Mocha
    }

    _coord2geoInfo(result, loc, lang) {
        loc = loc || this.loc;
        lang = lang || this.lang;

        let geoInfo = {};

        geoInfo.loc = loc;
        geoInfo.lang = lang;
        geoInfo.provider = 'kakao';

        if(result.meta.total_count < 2){
            console.log('It is not korea');
            return geoInfo;
        }
        // if(result.documents[0].address_name === "일본"){
        //     return geoInfo.country = "JP";
        // }

        if(result.documents[0].region_1depth_name === ""){
            console.log('It is not korea');
            return geoInfo;
        }
        let region = result.documents.filter(v=>{
            return v.region_type === "H"; // H === 행정동, B === 법정동
        });

        if(region.length > 0){
            geoInfo.country = "KR";
            geoInfo.address = region[0].address_name;
            if(region[0].region_4depth_name !== "") {
                geoInfo.label = region[0].region_4depth_name;
            }else if(region[0].region_3depth_name !== ""){
                geoInfo.label = region[0].region_3depth_name;
            }else if(region[0].region_2depth_name !== ""){
                geoInfo.label = region[0].region_2depth_name;
            }else if (region[0].region_1depth_name !== ""){
                geoInfo.label = region[0].region_1depth_name;
            }
            var name2 = region[0].region_2depth_name;
            if(name2){
                name2 = name2.replace(/ /g,"");
            }
            geoInfo.kmaAddress = {"name1": region[0].region_1depth_name, "name2": name2, "name3": region[0].region_3depth_name};
        }
        return geoInfo;
    }

    byGeoCode(loc, callback) {
        let index = 0;
        let lang = 'ko';
        let self = this;

        this._setGeoCode(loc, lang);

        async.retry(this.keys.length,
            (cb) => {
                let url = 'https://dapi.kakao.com/v2/local/geo/coord2regioncode.json';
                url += '?x='+this.loc[1];
                url += '&y='+this.loc[0];
                url += '&input_coord=WGS84';
                let header = {
                    Authorization: 'KakaoAK ' + this.keys[index]
                };
                index++;

                console.log(url);
                self.axios.get(url, {headers: header})
                .then(response=>{
                    // console.log('response : ', JSON.stringify(response.data));
                    return cb(null, response.data);
                })
                .catch(e=>{
                    return cb(e);
                });

            },
            (err, result) => {
                if (err) {
                    return callback(err);
                }
                let geoInfo;
                try {
                    geoInfo = this._coord2geoInfo(result, loc, lang);
                }
                catch (err) {
                    return callback(err);
                }
                callback(null, geoInfo);
            });

        return this;
    };

    _addr2geoInfo(result, addr) {
        let geoInfo;
        if (result.meta.total_count < 1) {
            throw new Error("Fail to find query="+addr);
        }

        if (result.meta.total_count > 1) {
            console.warn("too many result of query="+addr);
        }

        geoInfo = {};
        geoInfo.loc = [result.documents[0].y, result.documents[0].x];
        geoInfo.address = addr;
        geoInfo.country = 'KR';

        return geoInfo;
    }

    byAddress(addr, callback) {
        let index = 0;
        let self = this;

        async.retry(this.keys.length,
            (cb) => {
                let url = 'https://dapi.kakao.com/v2/local/search/address.json'+
                    '?query='+ encodeURIComponent(addr);
                let header = {
                    Authorization: 'KakaoAK ' + this.keys[index]
                };
                index++;

                console.log(url);
                self.axios.get(url, {headers:header})
                .then(response=>{
                    // console.log('response : ', JSON.stringify(response.data));
                    return cb(null, response.data);
                })
                .catch(e=>{
                    callback(e);
                });
            },
            (err, result) => {
                if (err) {
                    return callback(err);
                }
                let geoInfo;

                try {
                    // console.log(JSON.stringify(result));
                    geoInfo = this._addr2geoInfo(result, addr);
                }
                catch (err) {
                    return callback(err);
                }
                callback(null, geoInfo);
            });
        return this;
    }
}

module.exports = ControllerKakao;
