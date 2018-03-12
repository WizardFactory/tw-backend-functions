/**
 * Created by dhkim2 on 2017-12-05.
 */

'use strict';

const expect = require('chai').expect;

const ControllerGoogle = require('../geoinfo/controller.google');

const geoCodeBody ={
    "results" : [
        {
            "address_components" : [
                {
                    "long_name" : "1",
                    "short_name" : "1",
                    "types" : [ "political", "sublocality", "sublocality_level_4" ]
                },
                {
                    "long_name" : "8",
                    "short_name" : "8",
                    "types" : [ "political", "sublocality", "sublocality_level_3" ]
                },
                {
                    "long_name" : "2 Chome",
                    "short_name" : "2 Chome",
                    "types" : [ "political", "sublocality", "sublocality_level_2" ]
                },
                {
                    "long_name" : "Nishishinjuku",
                    "short_name" : "Nishishinjuku",
                    "types" : [ "political", "sublocality", "sublocality_level_1" ]
                },
                {
                    "long_name" : "Shinjuku-ku",
                    "short_name" : "Shinjuku-ku",
                    "types" : [ "locality", "political" ]
                },
                {
                    "long_name" : "Tōkyō-to",
                    "short_name" : "Tōkyō-to",
                    "types" : [ "administrative_area_level_1", "political" ]
                },
                {
                    "long_name" : "Japan",
                    "short_name" : "JP",
                    "types" : [ "country", "political" ]
                },
                {
                    "long_name" : "160-0023",
                    "short_name" : "160-0023",
                    "types" : [ "postal_code" ]
                }
            ],
            "formatted_address" : "2 Chome-8-1 Nishishinjuku, Shinjuku-ku, Tōkyō-to 160-0023, Japan",
            "geometry" : {
                "geo" : {
                    "lat" : 35.6891848,
                    "lng" : 139.6916481
                },
                "geo_type" : "ROOFTOP",
                "viewport" : {
                    "northeast" : {
                        "lat" : 35.6905337802915,
                        "lng" : 139.6929970802915
                    },
                    "southwest" : {
                        "lat" : 35.6878358197085,
                        "lng" : 139.6902991197085
                    }
                }
            },
            "place_id" : "ChIJoTcat9SMGGARkxFLl7vMNy8",
            "types" : [ "political", "sublocality", "sublocality_level_4" ]
        },
        {
            "address_components" : [
                {
                    "long_name" : "11",
                    "short_name" : "11",
                    "types" : [ "political", "sublocality", "sublocality_level_3" ]
                },
                {
                    "long_name" : "2 Chome",
                    "short_name" : "2 Chome",
                    "types" : [ "political", "sublocality", "sublocality_level_2" ]
                },
                {
                    "long_name" : "Nishishinjuku",
                    "short_name" : "Nishishinjuku",
                    "types" : [ "political", "sublocality", "sublocality_level_1" ]
                },
                {
                    "long_name" : "Shinjuku-ku",
                    "short_name" : "Shinjuku-ku",
                    "types" : [ "locality", "political" ]
                },
                {
                    "long_name" : "Tōkyō-to",
                    "short_name" : "Tōkyō-to",
                    "types" : [ "administrative_area_level_1", "political" ]
                },
                {
                    "long_name" : "Japan",
                    "short_name" : "JP",
                    "types" : [ "country", "political" ]
                },
                {
                    "long_name" : "160-0023",
                    "short_name" : "160-0023",
                    "types" : [ "postal_code" ]
                }
            ],
            "formatted_address" : "2 Chome-11 Nishishinjuku, Shinjuku-ku, Tōkyō-to 160-0023, Japan",
            "geometry" : {
                "bounds" : {
                    "northeast" : {
                        "lat" : 35.69186639999999,
                        "lng" : 139.6911112
                    },
                    "southwest" : {
                        "lat" : 35.688237,
                        "lng" : 139.6872334
                    }
                },
                "geo" : {
                    "lat" : 35.6907928,
                    "lng" : 139.6874123
                },
                "geo_type" : "GEOMETRIC_CENTER",
                "viewport" : {
                    "northeast" : {
                        "lat" : 35.69186639999999,
                        "lng" : 139.6911112
                    },
                    "southwest" : {
                        "lat" : 35.688237,
                        "lng" : 139.6872334
                    }
                }
            },
            "place_id" : "ChIJi827-irzGGAROR56ODop3C0",
            "types" : [ "political", "sublocality", "sublocality_level_3" ]
        },
        {
            "address_components" : [
                {
                    "long_name" : "2 Chome",
                    "short_name" : "2 Chome",
                    "types" : [ "political", "sublocality", "sublocality_level_2" ]
                },
                {
                    "long_name" : "Nishishinjuku",
                    "short_name" : "Nishishinjuku",
                    "types" : [ "political", "sublocality", "sublocality_level_1" ]
                },
                {
                    "long_name" : "Shinjuku-ku",
                    "short_name" : "Shinjuku-ku",
                    "types" : [ "locality", "political" ]
                },
                {
                    "long_name" : "Tōkyō-to",
                    "short_name" : "Tōkyō-to",
                    "types" : [ "administrative_area_level_1", "political" ]
                },
                {
                    "long_name" : "Japan",
                    "short_name" : "JP",
                    "types" : [ "country", "political" ]
                },
                {
                    "long_name" : "160-0023",
                    "short_name" : "160-0023",
                    "types" : [ "postal_code" ]
                }
            ],
            "formatted_address" : "2 Chome Nishishinjuku, Shinjuku-ku, Tōkyō-to 160-0023, Japan",
            "geometry" : {
                "bounds" : {
                    "northeast" : {
                        "lat" : 35.6925029,
                        "lng" : 139.6956533
                    },
                    "southwest" : {
                        "lat" : 35.68610049999999,
                        "lng" : 139.6872334
                    }
                },
                "geo" : {
                    "lat" : 35.6913485,
                    "lng" : 139.6935867
                },
                "geo_type" : "APPROXIMATE",
                "viewport" : {
                    "northeast" : {
                        "lat" : 35.6925029,
                        "lng" : 139.6956533
                    },
                    "southwest" : {
                        "lat" : 35.68610049999999,
                        "lng" : 139.6872334
                    }
                }
            },
            "place_id" : "ChIJ8e4AytSMGGARkxl-OelsoYg",
            "types" : [ "political", "sublocality", "sublocality_level_2" ]
        },
        {
            "address_components" : [
                {
                    "long_name" : "Nishishinjuku",
                    "short_name" : "Nishishinjuku",
                    "types" : [ "political", "sublocality", "sublocality_level_1" ]
                },
                {
                    "long_name" : "Shinjuku",
                    "short_name" : "Shinjuku",
                    "types" : [ "locality", "political" ]
                },
                {
                    "long_name" : "Tokyo",
                    "short_name" : "Tokyo",
                    "types" : [ "administrative_area_level_1", "political" ]
                },
                {
                    "long_name" : "Japan",
                    "short_name" : "JP",
                    "types" : [ "country", "political" ]
                },
                {
                    "long_name" : "160-0023",
                    "short_name" : "160-0023",
                    "types" : [ "postal_code" ]
                }
            ],
            "formatted_address" : "Nishishinjuku, Shinjuku, Tokyo 160-0023, Japan",
            "geometry" : {
                "bounds" : {
                    "northeast" : {
                        "lat" : 35.6979653,
                        "lng" : 139.7001583
                    },
                    "southwest" : {
                        "lat" : 35.6817539,
                        "lng" : 139.6831713
                    }
                },
                "geo" : {
                    "lat" : 35.6921398,
                    "lng" : 139.6854735
                },
                "geo_type" : "APPROXIMATE",
                "viewport" : {
                    "northeast" : {
                        "lat" : 35.6979653,
                        "lng" : 139.7001583
                    },
                    "southwest" : {
                        "lat" : 35.6817539,
                        "lng" : 139.6831713
                    }
                }
            },
            "place_id" : "ChIJV_-6z9SMGGARPdOPQSpdOBI",
            "types" : [ "political", "sublocality", "sublocality_level_1" ]
        },
        {
            "address_components" : [
                {
                    "long_name" : "Shinjuku",
                    "short_name" : "Shinjuku",
                    "types" : [ "locality", "political" ]
                },
                {
                    "long_name" : "Tokyo",
                    "short_name" : "Tokyo",
                    "types" : [ "administrative_area_level_1", "political" ]
                },
                {
                    "long_name" : "Japan",
                    "short_name" : "JP",
                    "types" : [ "country", "political" ]
                }
            ],
            "formatted_address" : "Shinjuku, Tokyo, Japan",
            "geometry" : {
                "bounds" : {
                    "northeast" : {
                        "lat" : 35.7298963,
                        "lng" : 139.7451654
                    },
                    "southwest" : {
                        "lat" : 35.6731541,
                        "lng" : 139.6732488
                    }
                },
                "geo" : {
                    "lat" : 35.6938401,
                    "lng" : 139.7035494
                },
                "geo_type" : "APPROXIMATE",
                "viewport" : {
                    "northeast" : {
                        "lat" : 35.7298963,
                        "lng" : 139.7451654
                    },
                    "southwest" : {
                        "lat" : 35.6731541,
                        "lng" : 139.6732488
                    }
                }
            },
            "place_id" : "ChIJS_23WSCNGGAR0u8y4o_GYew",
            "types" : [ "locality", "political" ]
        },
        {
            "address_components" : [
                {
                    "long_name" : "Tokyo",
                    "short_name" : "Tokyo",
                    "types" : [ "colloquial_area", "locality", "political" ]
                },
                {
                    "long_name" : "Tokyo",
                    "short_name" : "Tokyo",
                    "types" : [ "administrative_area_level_1", "political" ]
                },
                {
                    "long_name" : "Japan",
                    "short_name" : "JP",
                    "types" : [ "country", "political" ]
                }
            ],
            "formatted_address" : "Tokyo, Japan",
            "geometry" : {
                "bounds" : {
                    "northeast" : {
                        "lat" : 35.8175167,
                        "lng" : 139.9198565
                    },
                    "southwest" : {
                        "lat" : 35.5208603,
                        "lng" : 139.5629048
                    }
                },
                "geo" : {
                    "lat" : 35.7090259,
                    "lng" : 139.7319925
                },
                "geo_type" : "APPROXIMATE",
                "viewport" : {
                    "northeast" : {
                        "lat" : 35.8175167,
                        "lng" : 139.9198565
                    },
                    "southwest" : {
                        "lat" : 35.5208603,
                        "lng" : 139.5629048
                    }
                }
            },
            "place_id" : "ChIJXSModoWLGGARILWiCfeu2M0",
            "types" : [ "colloquial_area", "locality", "political" ]
        },
        {
            "address_components" : [
                {
                    "long_name" : "160-0023",
                    "short_name" : "160-0023",
                    "types" : [ "postal_code" ]
                },
                {
                    "long_name" : "Nishishinjuku",
                    "short_name" : "Nishishinjuku",
                    "types" : [ "political", "sublocality", "sublocality_level_1" ]
                },
                {
                    "long_name" : "Shinjuku",
                    "short_name" : "Shinjuku",
                    "types" : [ "locality", "political" ]
                },
                {
                    "long_name" : "Tokyo",
                    "short_name" : "Tokyo",
                    "types" : [ "administrative_area_level_1", "political" ]
                },
                {
                    "long_name" : "Japan",
                    "short_name" : "JP",
                    "types" : [ "country", "political" ]
                }
            ],
            "formatted_address" : "160-0023, Japan",
            "geometry" : {
                "bounds" : {
                    "northeast" : {
                        "lat" : 35.69797,
                        "lng" : 139.7001613
                    },
                    "southwest" : {
                        "lat" : 35.6817539,
                        "lng" : 139.6831658
                    }
                },
                "geo" : {
                    "lat" : 35.6913457,
                    "lng" : 139.69369
                },
                "geo_type" : "APPROXIMATE",
                "viewport" : {
                    "northeast" : {
                        "lat" : 35.69797,
                        "lng" : 139.7001613
                    },
                    "southwest" : {
                        "lat" : 35.6817539,
                        "lng" : 139.6831658
                    }
                }
            },
            "place_id" : "ChIJd5R2e9byGGARys80SmZHhOw",
            "types" : [ "postal_code" ]
        },
        {
            "address_components" : [
                {
                    "long_name" : "Tokyo",
                    "short_name" : "Tokyo",
                    "types" : [ "administrative_area_level_1", "locality", "political" ]
                },
                {
                    "long_name" : "Japan",
                    "short_name" : "JP",
                    "types" : [ "country", "political" ]
                }
            ],
            "formatted_address" : "Tokyo, Japan",
            "geometry" : {
                "bounds" : {
                    "northeast" : {
                        "lat" : 35.8986468,
                        "lng" : 153.9876115
                    },
                    "southwest" : {
                        "lat" : 24.2242626,
                        "lng" : 138.942758
                    }
                },
                "geo" : {
                    "lat" : 35.6894875,
                    "lng" : 139.6917064
                },
                "geo_type" : "APPROXIMATE",
                "viewport" : {
                    "northeast" : {
                        "lat" : 35.817813,
                        "lng" : 139.910202
                    },
                    "southwest" : {
                        "lat" : 35.528873,
                        "lng" : 139.510574
                    }
                }
            },
            "place_id" : "ChIJ51cu8IcbXWARiRtXIothAS4",
            "types" : [ "administrative_area_level_1", "locality", "political" ]
        },
        {
            "address_components" : [
                {
                    "long_name" : "Tokyo Metropolitan Area",
                    "short_name" : "Tokyo Metropolitan Area",
                    "types" : [ "political" ]
                },
                {
                    "long_name" : "Japan",
                    "short_name" : "JP",
                    "types" : [ "country", "political" ]
                }
            ],
            "formatted_address" : "Tokyo Metropolitan Area, Japan",
            "geometry" : {
                "bounds" : {
                    "northeast" : {
                        "lat" : 36.1498139,
                        "lng" : 140.2267995
                    },
                    "southwest" : {
                        "lat" : 35.1713203,
                        "lng" : 139.0478511
                    }
                },
                "geo" : {
                    "lat" : 35.6635367,
                    "lng" : 139.5279996
                },
                "geo_type" : "APPROXIMATE",
                "viewport" : {
                    "northeast" : {
                        "lat" : 36.1498139,
                        "lng" : 140.2267995
                    },
                    "southwest" : {
                        "lat" : 35.1713203,
                        "lng" : 139.0478511
                    }
                }
            },
            "place_id" : "ChIJe5yXM7eSGGARAnhb-wORrgI",
            "types" : [ "political" ]
        },
        {
            "address_components" : [
                {
                    "long_name" : "Japan",
                    "short_name" : "JP",
                    "types" : [ "country", "political" ]
                }
            ],
            "formatted_address" : "Japan",
            "geometry" : {
                "bounds" : {
                    "northeast" : {
                        "lat" : 45.6412626,
                        "lng" : 154.0031455
                    },
                    "southwest" : {
                        "lat" : 20.3585295,
                        "lng" : 122.8554688
                    }
                },
                "location" : {
                    "lat" : 36.204824,
                    "lng" : 138.252924
                },
                "location_type" : "APPROXIMATE",
                "viewport" : {
                    "northeast" : {
                        "lat" : 45.6412626,
                        "lng" : 154.0031455
                    },
                    "southwest" : {
                        "lat" : 20.3585295,
                        "lng" : 122.8554688
                    }
                }
            },
            "place_id" : "ChIJLxl_1w9OZzQRRFJmfNR1QvU",
            "types" : [ "country", "political" ]
        }
    ],
    "status" : "OK"
};

const addressBody = {
    "results": [{
        "address_components": [{
            "long_name": "Jamsilbon-dong",
            "short_name": "Jamsilbon-dong",
            "types": ["political", "sublocality", "sublocality_level_2"]
        }, {
            "long_name": "Songpa-gu",
            "short_name": "Songpa-gu",
            "types": ["political", "sublocality", "sublocality_level_1"]
        }, {
            "long_name": "Seoul",
            "short_name": "Seoul",
            "types": ["administrative_area_level_1", "political"]
        }, {
            "long_name": "South Korea",
            "short_name": "KR",
            "types": ["country", "political"]
        }, {
            "long_name": "138-220",
            "short_name": "138-220",
            "types": ["postal_code"]
        }],
        "formatted_address": "Jamsilbon-dong, Songpa-gu, Seoul, South Korea",
        "geometry": {
            "bounds": {
                "northeast": {
                    "lat": 37.5130741,
                    "lng": 127.0907212
                },
                "southwest": {
                    "lat": 37.5004736,
                    "lng": 127.0734259
                }
            },
            "location": {
                "lat": 37.5061273,
                "lng": 127.0842945
            },
            "location_type": "APPROXIMATE",
            "viewport": {
                "northeast": {
                    "lat": 37.5130741,
                    "lng": 127.0907212
                },
                "southwest": {
                    "lat": 37.5004736,
                    "lng": 127.0734259
                }
            }
        },
        "place_id": "ChIJ7bllt0ykfDURonZm_i0K2Ns",
        "types": ["political", "sublocality", "sublocality_level_2"]
    }],
    "status": "OK"
};

const tokyoLocation = [35.689, 139.691];
const lang = 'en';

describe('ctrl google', ()=> {
    it ('test coord2geoInfo', () => {
        let ctrlGoogle = new ControllerGoogle();
        ctrlGoogle._setGeoCode(tokyoLocation, lang);
        let geoInfo = ctrlGoogle._coord2geoInfo(geoCodeBody, tokyoLocation, lang);
        expect(geoInfo.label).to.equal('Nishishinjuku');
        expect(geoInfo.lang).to.equal(lang);
    });

    it('test by geocode', (done) => {
        let ctrlGoogle = new ControllerGoogle();
        ctrlGoogle._request = function(url, callback) {
            //console.log('test url : ',url);
            callback(null, geoCodeBody);
        };

        ctrlGoogle.byGeoCode(tokyoLocation, lang, (err, geoInfo) => {
            expect(geoInfo.label).to.equal('Nishishinjuku');
            expect(geoInfo.lang).to.equal(lang);
            done();
        });
    });

    it('test by address', (done) => {
        let ctrlGoogle = new ControllerGoogle();
        ctrlGoogle._request = function(url, callback) {
            //console.log('test url : ',url);
            callback(null, addressBody);
        };

        let addr = "서울특별시 송파구 잠실본동";

        ctrlGoogle.byAddress(addr, (err, geoInfo) => {
            expect(geoInfo.country).to.equal('KR');
            expect(geoInfo.loc[0]).to.equal(addressBody.results[0].geometry.location.lat);
            expect(geoInfo.loc[1]).to.equal(addressBody.results[0].geometry.location.lng);
            done();
        });
    });
});
