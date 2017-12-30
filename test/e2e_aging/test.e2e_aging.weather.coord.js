/**
 * Created by aleckim on 2017. 12. 27..
 */

'use strict';

var assert = require('assert');
var should = require('should');
var request = require('supertest');

var fs = require('fs');
var targetName = './test/data/base.csv';
var baseList = [];
baseList = fs.readFileSync(targetName).toString().split('\n');
baseList.shift();
baseList = baseList.slice(0, baseList.length-1);

describe('Routing kma', function() {
    //let url = 'https://ry0b7u7o1b.execute-api.ap-northeast-2.amazonaws.com/dev';
    let url = 'https://todayweather.wizardfactory.net';
    let endPoint = '/weather/coord';
    let language = 'ko-KR';
    before(function (done) {
        //add new town
        done();
    });

    baseList.forEach(function (townInfo) {
        var town = townInfo.split(",");
        it('test weather/coord' + townInfo, function () {
            this.timeout(20 * 1000);
            var path = endPoint+'/' + parseFloat(town[3]).toFixed(3) + ',' + parseFloat(town[4]).toFixed(3);

            console.log({url: url+path});

            return request(url)
                .get(encodeURI(path))
                .set('Accept', 'application/json')
                .set('Accept-Language', language)
                .expect(200)
                .then(function (res) {
                    var body = res.body;
                    assert(body.hasOwnProperty('regionName'));
                    assert(body.hasOwnProperty('cityName'));
                    assert(body.hasOwnProperty('townName'));
                    assert(body.hasOwnProperty('short'));
                    assert(body.hasOwnProperty('current'));
                    assert(body.hasOwnProperty('midData'));
                    assert(body.hasOwnProperty('units'));
                    assert(body.hasOwnProperty('source'));
                    assert(body.hasOwnProperty('air_forecast'));

                    var current = body.current;
                    current.should.have.property('arpltn');
                    current.should.have.property('summary');
                    current.should.have.property('yesterday');
                    current.should.have.property('dateObj');
                    current.t1h.should.not.be.exactly(-50);
                    current.reh.should.not.be.exactly(-1);
                    current.rn1.should.not.be.exactly(-1);
                    current.sky.should.not.be.exactly(-1);
                    current.pty.should.not.be.exactly(-1);
                    current.lgt.should.not.be.exactly(-1);

                    current.yesterday.should.have.property('t1h');
                    current.yesterday.t1h.should.not.be.exactly(-50);

                    var arpltn = current.arpltn;
                    arpltn.should.have.property('pm10Grade');
                    arpltn.should.have.property('pm25Grade');
                    arpltn.should.have.property('khaiGrade');
                    arpltn.pm10Grade.should.not.be.exactly(-1);
                    arpltn.pm25Grade.should.not.be.exactly(-1);
                    arpltn.khaiGrade.should.not.be.exactly(-1);

                    arpltn.should.have.property('pm10Value');
                    arpltn.should.have.property('pm25Value');
                    arpltn.should.have.property('khaiValue');
                    arpltn.pm10Value.should.not.be.exactly(-1);
                    arpltn.pm25Value.should.not.be.exactly(-1);
                    arpltn.khaiValue.should.not.be.exactly(-1);

                    res.body.short.forEach(function(sh) {
                        sh.should.have.property('dateObj');
                        sh.should.have.property('t3h');
                        sh.should.have.property('fromToday');

                        sh.t3h.should.not.be.exactly(-50);
                        //신규로 들어온 지역이 아직 short가 모이지 않아 pop에러 발생함.
                        //sh.pop.should.not.be.exactly(-1);
                        sh.pty.should.not.be.exactly(-1);
                        sh.sky.should.not.be.exactly(-1);
                    });

                    var midData = body.midData;
                    midData.should.have.property('dailyData');
                    midData.dailyData.forEach(function (daily) {
                        daily.should.have.property('dateObj');
                        daily.should.have.property('tmn');
                        daily.should.have.property('tmx');
                        daily.should.have.property('skyAm');
                        daily.should.have.property('skyPm');
                        daily.should.have.property('fromToday');
                        daily.should.have.property('dayOfWeek');
                        if (daily.dustForecast) {
                            daily.dustForecast.should.have.property('pm10Grade');
                            daily.dustForecast.should.have.property('pm10Str');
                            daily.dustForecast.should.have.property('pm25Grade');
                            daily.dustForecast.should.have.property('pm25Str');
                        }

                        daily.should.have.property('wfAm');
                        daily.should.have.property('wfPm');
                    });
                });
        });
    });
});
