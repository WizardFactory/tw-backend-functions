/**
 * Created by dhkim2 on 2017-12-04.
 */

'use strict';

const GeoCode = require('./function.geocode');

function makeResponse(err, result) {
    if (err) {
        console.error(err);
        return {
            statusCode: err.statusCode || 501,
            headers: { 'Content-Type': 'text/plain' },
            body: err.toString(),
        };
    }
    else {
        return {
            statusCode: 200,
            headers: {'Content-Type': 'application/json; charset=UTF-8'},
            body: result};
    }
}

module.exports.coord2addr = (event, context, callback) => {
    new GeoCode().coord2geoInfo(event, (err, result) => {
        let response;
        try {
            response = makeResponse(err, result);
        }
        catch (err) {
            return callback(err);
        }
        callback(null, response);
    });
};

module.exports.addr2coord = (event, context, callback) => {
    new GeoCode().addr2geoInfo(event, (err, result) => {
        let response;
        try {
            response = makeResponse(err, result);
        }
        catch (err) {
            return callback(err);
        }
        callback(null, response);
    });
};
