/**
 * Created by dhkim2 on 2017-12-04.
 */

'use strict';

const async = require('async');

const ControllerExternalApi = require('./controller.externalapi');

const config = require('./config');

class ControllerGoogle extends ControllerExternalApi {
    constructor(loc, lang) {
        super(loc, lang);
        this.keys = [config.keyString.google_key];
    }

    _getAddressInfoFromGoogleResult(result) {
        let sub_level2_types = [ "political", "sublocality", "sublocality_level_2" ];
        let sub_level1_types = [ "political", "sublocality", "sublocality_level_1" ];
        let local_types = [ "locality", "political" ];
        let info = {};
        info.address = result.formatted_address;

        for (let j=0; j < result.address_components.length; j++) {
            let address_component = result.address_components[j];
            if ( address_component.types[0] == sub_level2_types[0]
                && address_component.types[1] == sub_level2_types[1]
                && address_component.types[2] == sub_level2_types[2] ) {
                info.sub_level2_name = address_component.short_name;
            }

            if ( address_component.types[0] == sub_level1_types[0]
                && address_component.types[1] == sub_level1_types[1]
                && address_component.types[2] == sub_level1_types[2] ) {
                info.sub_level1_name = address_component.short_name;
            }

            if ( address_component.types[0] == local_types[0]
                && address_component.types[1] == local_types[1] ) {
                info.local_name = address_component.short_name;
            }
        }
        return info;
    }

    _getAddressInfoFromAddressComponents(results, countryShortName) {
        let sub_level2_types = [ "political", "sublocality", "sublocality_level_2" ];
        let sub_level1_types = [ "political", "sublocality", "sublocality_level_1" ];
        let local_types = [ "locality", "political" ];
        let country_types = ["country"];
        let sub_level2_name;
        let sub_level1_name;
        let local_name;
        let country_name;

        for (let i=0; i < results.length; i++) {
            let result = results[i];
            for (let j=0; j < result.address_components.length; j++) {
                let address_component = result.address_components[j];
                if ( address_component.types[0] == sub_level2_types[0]
                    && address_component.types[1] == sub_level2_types[1]
                    && address_component.types[2] == sub_level2_types[2] ) {
                    sub_level2_name = address_component.short_name;
                }

                if ( address_component.types[0] == sub_level1_types[0]
                    && address_component.types[1] == sub_level1_types[1]
                    && address_component.types[2] == sub_level1_types[2] ) {
                    sub_level1_name = address_component.short_name;
                }

                if ( address_component.types[0] == local_types[0]
                    && address_component.types[1] == local_types[1] ) {
                    local_name = address_component.short_name;
                }

                if ( address_component.types[0] == country_types[0] ) {
                    country_name = address_component.long_name;
                }

                if (sub_level2_name && sub_level1_name && local_name && country_name) {
                    break;
                }
            }

            if (sub_level2_name && sub_level1_name && local_name && country_name) {
                break;
            }
        }

        let label;
        let address = "";
        //국내는 동단위까지 표기해야 함.
        if (countryShortName === "KR") {
            if (sub_level2_name) {
                address += sub_level2_name;
                label = sub_level2_name;
            }
        }
        if (sub_level1_name) {
            address += " " + sub_level1_name;
            if (label == undefined) {
                label = sub_level1_name;
            }
        }
        if (local_name) {
            address += " " + local_name;
            if (label == undefined) {
                label = local_name;
            }
        }
        if (country_name) {
            address += " " + country_name;
            if (label == undefined) {
                label = country_name;
            }
        }

        return {label: label, address:address};
    }

    _coord2geoInfo(data) {
        if (data.status !== "OK") {
            //'ZERO_RESULTS', 'OVER_QUERY_LIMIT', 'REQUEST_DENIED',  'INVALID_REQUEST', 'UNKNOWN_ERROR'
            throw new Error(data.status);
        }

        let sub_level2_types = [ "political", "sublocality", "sublocality_level_2" ];
        let sub_level1_types = [ "political", "sublocality", "sublocality_level_1" ];
        let local_types = [ "locality", "political" ];
        let country_types = ["country"];
        let address_sublocality_level_2;
        let address_sublocality_level_1;
        let address_locality;
        let countryName;

        for (let i=0; i < data.results.length; i++) {
            let result = data.results[i];

            //get country_name
            for (let j=0; j < result.address_components.length; j++) {
                if (countryName) {
                    break;
                }
                let address_component = result.address_components[j];
                if ( address_component.types[0] == country_types[0] ) {
                    if (address_component.short_name.length <= 2) {
                        countryName = address_component.short_name;
                    }
                }
            }

            //postal_code
            switch (result.types.toString()) {
                case sub_level2_types.toString():
                    if (!address_sublocality_level_2) {
                        address_sublocality_level_2 = this._getAddressInfoFromGoogleResult(result);
                    }
                    break;
                case sub_level1_types.toString():
                    if (!address_sublocality_level_1) {
                        address_sublocality_level_1 = this._getAddressInfoFromGoogleResult(result);
                    }
                    break;
                case local_types.toString():
                    if (!address_locality) {
                        address_locality = this._getAddressInfoFromGoogleResult(result);
                    }
                    break;
                default:
                    break;
            }
        }

        if (countryName == undefined) {
            throw new Error('country_name null');
        }

        let geoInfo = {country: countryName};
        if (address_sublocality_level_2 && countryName == "KR") {
            geoInfo.address = address_sublocality_level_2.address;
            geoInfo.label = address_sublocality_level_2.sub_level2_name;
        }
        else if (address_sublocality_level_1) {
            geoInfo.address = address_sublocality_level_1.address;
            geoInfo.label = address_sublocality_level_1.sub_level1_name;
        }
        else if (address_locality) {
            geoInfo.address = address_locality.address;
            geoInfo.label = address_locality.local_name;
        }
        else {
            geoInfo = this._getAddressInfoFromAddressComponents(data.results, countryName);
            geoInfo.country = countryName;
        }

        if (geoInfo.label == undefined || geoInfo.address == undefined) {
            throw new Error('failToFindLocation');
        }

        return geoInfo;
    }

    getAddress(callback) {
        //retry with key
        let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + this.lat + "," + this.lng;
        if (this.lang) {
            url += "&language="+this.lang;
        }
        if (this.keys[0]) {
            url += "&key="+this.keys[0];
        }
        else {
            console.warn("google api key is not valid");
        }
        async.retry(3,
            (cb) => {
                this._request(url, (err, result) => {
                    if (err) {
                        return cb(err);
                    }
                    cb(null, result);
                });
            },
            (err, result) => {
                if (err) {
                    return callback(err);
                }

                let geoInfo;
                try {
                    geoInfo = this._coord2geoInfo(result);
                }
                catch(err) {
                    return callback(err);
                }
                callback(null, geoInfo);
            });

        return this;
    };

    getGeoCode(callback) {
    }
}

module.exports = ControllerGoogle;
