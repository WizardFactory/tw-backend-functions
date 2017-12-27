/**
 * Created by dhkim2 on 2017-12-27.
 */

'use strict';

const expect = require('chai').expect;
const request = require('request');

describe('e2e request', ()=> {

    it ('test korea on en-US', (done) => {
        let serverUrl = 'https://ry0b7u7o1b.execute-api.ap-northeast-2.amazonaws.com/dev';
        let endpoint = '/weather/coord/37.567,126.978';
        let language = 'en-US';

        let url = serverUrl+endpoint;
        let options = {json: true, timeout: 3000, headers: {'Accept-Language' : language}};
        request(url, options, (err, response, body) => {
            //console.log(body);

            expect(body.townName).to.equal("명동");
            done();
        });
    });
});
