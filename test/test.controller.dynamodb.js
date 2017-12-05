/**
 * Created by dhkim2 on 2017-12-05.
 */

'use strict';

const expect = require('chai').expect;

const ControllerDynamodb = require('../controller.dynamodb');

const updateResult = { Attributes:
        { country: 'KR',
            loc: [37.506,127.084],
            kmaAddress: {"name2":"송파구","name1":"서울특별시","name3":"잠실본동"},
            address: '서울특별시 송파구 잠실본동',
            label: '잠실본동',
            lang: 'ko',
            updatedAt: 1512447818839 } };

const geoInfo = { country: 'KR',
    address: '서울특별시 송파구 잠실본동',
    label: '잠실본동',
    kmaAddress: { name1: '서울특별시', name2: '송파구', name3: '잠실본동' },
    loc: [ 37.506, 127.084 ],
    lang: 'ko' };

describe('test controller dynamodb', () => {
    it('test update db', (done)=> {
        let ctrlDynamodb = new ControllerDynamodb();
        ctrlDynamodb._updateDb = (params, callback) => {
            callback(null, updateResult);
        };

        ctrlDynamodb.update(geoInfo, (err, result)=>{
            expect(err).to.be.null;
            if (err) {
                return console.error(err);
            }
            expect(result.label).to.equal(geoInfo.label);
            done();
        });
    });
});
