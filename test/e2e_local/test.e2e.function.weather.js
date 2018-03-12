/**
 * Created by dhkim2 on 2018-01-03.
 */

'use strict';

const expect = require('chai').expect;

const Weather = require('../../weather/function.weather');

describe('test function weather', () => {
    let ip = "12.12.12.32";
    let geoInfo = {
        loc: [38.234, 126.123]
    };

    // it('test make doamin url', (done) => {
    //     let weather = new Weather();
    //     let urls = weather._makeUrls(geoInfo);
    //     weather._requests(urls, function (err, result) {
    //         if (err) {
    //             console.error(err);
    //         }
    //         else {
    //             console.info(result);
    //         }
    //         done();
    //     });
    // });

    it('test make ip and domain url', function(done) {
        this.timeout(10*1000);
        Weather.setServiceServerIp(ip);
        let weather = new Weather();
        let urls = weather._makeUrls(geoInfo);
        weather._requests(urls, function (err, result) {
            if (err) {
                console.error(err);
            }
            else {
                //console.info(result);
            }
            done();
        });
    });

    it('test make ip and domain url', function(done) {
        this.timeout(10*1000);
        ip = "34.195.193.177";
        Weather.setServiceServerIp(ip);
        let weather = new Weather();
        let urls = weather._makeUrls(geoInfo);
        weather._requests(urls, function (err, result) {
            if (err) {
                console.error(err);
            }
            else {
                //console.info(result);
            }
            done();
        });
    });

    it('test bycoord', function(done) {
        this.timeout(10*1000);
        let weather = new Weather();
        let event = {
            resource: '/weather/coord/{loc}',
            path: '/weather/coord/35.900,128.630',
            httpMethod: 'GET',
            headers: {
                'Accept-Encoding': 'gzip',
                'Accept-Language': 'ko-kr',
                Host: '5hktkqusyb.execute-api.ap-northeast-2.amazonaws.com',
                'User-Agent': 'Amazon CloudFront',
                Via: '2.0 e92bdeb52ede20e86a2f04b2316c228a.cloudfront.net (CloudFront)',
                'X-Amz-Cf-Id': 'r4DdoizhHJ0ctTzArDxoUZxdEj7B3ZCRJogwRN0t5qVfkssN6dLYVQ==',
                'X-Amzn-Trace-Id': 'Root=1-5a4eb1fa-5d336c1b1f92702f1e41397b',
                'X-Forwarded-For': '124.111.4.88, 52.78.247.134',
                'X-Forwarded-Port': '443',
                'X-Forwarded-Proto': 'https'
            },
            queryStringParameters: {
                distanceUnit: 'km',
                temperatureUnit: 'C',
                airUnit: 'airkorea',
                windSpeedUnit: 'm/s',
                precipitationUnit: 'mm',
                pressureUnit: 'hPa'
            },
            pathParameters: {
                loc: '35.900,128.630'
            },
            stageVariables: null,
            requestContext: {
                requestTime: '04/Jan/2018:23:00:10 +0000',
                path: '/production/weather/coord/35.900,128.630',
                accountId: '141248341265',
                protocol: 'HTTP/1.1',
                resourceId: '2jxz5b',
                stage: 'production',
                requestTimeEpoch: 1515106810132,
                requestId: '03a6ddb7-f1a3-11e7-9843-b13e8719d234',
                identity: {
                    cognitoIdentityPoolId: null,
                    accountId: null,
                    cognitoIdentityId: null,
                    caller: null,
                    sourceIp: '124.111.4.88',
                    accessKey: null,
                    cognitoAuthenticationType: null,
                    cognitoAuthenticationProvider: null,
                    userArn: null,
                    userAgent: 'Amazon CloudFront',
                    user: null
                },
                resourcePath: '/weather/coord/{loc}',
                httpMethod: 'GET',
                apiId: '5hktkqusyb'
            },
            body: null,
            isBase64Encoded: false
        };

        weather.byCoord(event, function (err, result) {
            expect(err).to.null;
            expect(result.regionName).to.equal('대구광역시');
            done();
        });
    });
});

