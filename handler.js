/**
 * Created by dhkim2 on 2017-12-04.
 */

'use strict';

const config = require('./config');
const GeoInfo = require('./function.geoinfo');
const Weather = require('./function.weather');

var dns = require('dns'),
    dnscache = require('dnscache')({
        "enable" : true,
        "ttl" : 300,
        "cachesize" : 1000
    });

var domain = config.serviceServer.url.replace('http://', '').replace('https://', '');
dnscache.lookup(domain, function(err, result) {
    if (err) {
        console.error(err);
    }
    else {
        console.info('cached domain:', domain, ' result:', result);
    }
});

function makeResponse(err, result, cacheTime) {
    if (err) {
        if (err.hasOwnProperty('statusCode')) {
            if (err.statusCode >= 500) {
                console.error(err);
            }
            else if (err.statusCode >= 400) {
                console.warn({Warning: err.message, statusCode: err.statusCode});
            }
        }
        else {
            console.error(err);
        }

        return {
            statusCode: err.statusCode || 501,
            headers: { 'Content-Type': 'text/plain' },
            body: err.toString(),
        };
    }
    else {
        return {
            statusCode: 200,
            headers: {'Content-Type': 'application/json; charset=UTF-8',
                'cache-control': 'max-age='+cacheTime,
                'Access-Control-Allow-Origin':'*'},
            body: JSON.stringify(result)};
    }
}

module.exports.geoinfobycoord = (event, context, callback) => {
    new GeoInfo().byCoord(event, (err, result) => {
        let response;
        try {
            response = makeResponse(err, result, 2592000); //1month
        }
        catch (err) {
            return callback(err);
        }
        callback(null, response);
    });
};

module.exports.geoinfobyaddr = (event, context, callback) => {
    new GeoInfo().byAddr(event, (err, result) => {
        let response;
        try {
            response = makeResponse(err, result, 2592000); //1month
        }
        catch (err) {
            return callback(err);
        }
        callback(null, response);
    });
};

module.exports.weatherbycoord = (event, context, callback) => {
    new Weather().byCoord(event, (err, result) => {
        let response;
        try {
            response = makeResponse(err, result, 300); //5mins
        }
        catch (err) {
            return callback(err);
        }
        callback(null, response);
    });
};

module.exports.weatherbyaddr = (event, context, callback) => {
    new Weather().byAddress(event, (err, result) => {
        let response;
        try {
            response = makeResponse(err, result, 300); //5mins
        }
        catch (err) {
            return callback(err);
        }
        callback(null, response);
    });
};

