/**
 * Created by dhkim2 on 2017-12-04.
 */

'use strict';

const AWS = require('aws-sdk');
const async = require('async');

let options = {};

if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:'+process.env.DYNAMODB_OFFLINE_PORT,
    };
}

const dynamoDb = new AWS.DynamoDB.DocumentClient(options);

class ControllerDynamdb {
    constructor() {

    }

    _getDb(params, callback) {
        // console.info(JSON.stringify({_getDb:{params: params}}));
        dynamoDb.get(params, (err, result) => {
            if (err) {
                return callback(err);
            }
            callback(err, result);
        });
    }

    _getDbTimeout(params, timeout, callback) {
        let wrapped = async.timeout(this._getDb, timeout);
        wrapped(params, callback);
    }

    _updateDb(params, callback) {
        console.info(JSON.stringify({_updateDb:{params: params}}));
        dynamoDb.update(params, (err, result) => {
            // handle potential errors
            if (err) {
                return callback(err);
            }

            callback(null, result);
        });

    }
}

module.exports = ControllerDynamdb;
