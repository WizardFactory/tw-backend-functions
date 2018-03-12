/**
 * Created by dhkim2 on 2017-12-19.
 */

'use strict';

const expect = require('chai').expect;

const FunctionGeoInfo = require('../../geoinfo/function.geoinfo');

let event = {
    pathParameters: {
        addr: encodeURIComponent('서울특별시 송파구 잠실본동')
    }
};

describe('test function geo info', () => {
    it('test addr 2 geo info', function (done) {
        this.timeout(10*1000);

        let geoInfo = new FunctionGeoInfo();
        geoInfo.addr2geoInfo(event, function (err, geoInfo) {
            if (err) {
                console.error(err);
                done();
                return;
            }
            expect(geoInfo.loc[0]).to.equal(37.506);
            expect(geoInfo.loc[1]).to.equal(127.084);
            done();
        });
    });
});
