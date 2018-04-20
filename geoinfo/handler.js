/**
 * Created by dhkim2 on 2017-12-04.
 */

"use strict";

if (!process.env.IS_OFFLINE) {
    const AWSXRay = require('aws-xray-sdk-core');
    AWSXRay.captureAWS(require('aws-sdk'));
    AWSXRay.captureHTTPsGlobal(require('http'));
}

var dns = require('dns'),
    dnscache = require('dnscache')({
        "enable" : true,
        "ttl" : 300,
        "cachesize" : 1000
    });

const GeoInfo = require('./function.geoinfo');

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
