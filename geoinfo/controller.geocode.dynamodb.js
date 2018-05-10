/**
 * Created by dhkim2 on 2017-12-04.
 */

'use strict';

const ControllerDynamodb = require('./controller.dynamodb');
const async = require('async');

class ControllerGeoCodeDynamdb extends ControllerDynamodb {
    constructor() {
        super();
    }

    _makePrimaryKey(loc, lang) {
        return loc.toString()+','+lang;
    }

    get(loc, lang, callback) {
        let params;
        let id;
        try {
            //console.log({db_get:{loc: loc, lang: lang}});
            id = this._makePrimaryKey(loc, lang);
            params = {
                TableName: process.env.DYNAMODB_GEOCODE_TABLE,
                Key: {
                    id: id
                }
            };
        }
        catch (err) {
            callback(err);
        }

        console.info(JSON.stringify({getDb:{params: params}}));

        async.retry(3,
            (callback)=>{
                let startTime = new Date();
                this._getDbTimeout(params, 200, (err, result)=> {
                    if (err) {
                        console.warn(err.message);
                    }
                    else {
                        console.info({dynamoResponseTime: new Date().getTime() - startTime.getTime()});
                    }
                    callback(err, result);
                })
            },
            (err, result)=> {
                if (err) {
                    return callback(err);
                }
                if (!result || !result.Item) {
                    err = new Error("Fail to find item params : "+params);
                }
                callback(err, result.Item);
            });

        return this;
    }

    update(geoInfo, callback) {
        const timestamp = new Date().getTime();
        let isInvalid;
        try {
            //console.log({db_update:{geoInfo:geoInfo}});
            geoInfo.id = this._makePrimaryKey(geoInfo.loc, geoInfo.lang);
            isInvalid = (typeof geoInfo.lang !== 'string' || !Array.isArray(geoInfo.loc));
        }
        catch (err) {
            callback(err);
            return this;
        }

        if (isInvalid) {
            let err = new Error('Validation Failed');
            callback(err);
            return this;
        }

        let updateExpression = 'SET loc = :loc, lang = :lang' +
            ', label = :label, updatedAt = :updatedAt, provider = :provider';

        let expressionAttributeValues = {
            ':loc': geoInfo.loc,
            ':lang': geoInfo.lang,
            ':label': geoInfo.label,
            ':updatedAt': timestamp,
            ':provider': geoInfo.provider
        };

        ['country', 'address', 'kmaAddress'].forEach(function (name) {
            if (geoInfo[name]) {
                updateExpression += ', '+name+' = :'+name;
                expressionAttributeValues[':'+name] = geoInfo[name];
            }
        });

        const params = {
            TableName: process.env.DYNAMODB_GEOCODE_TABLE,
            Key: {
                id: geoInfo.id,
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'UPDATED_NEW'
        };

        this._updateDb(params, (err, result) => {
            if (err) {
                return callback(err);
            }
            //refer test.controller.dynamodb.js
            callback(err, result.Attributes);
        });
        return this;
    }
}

module.exports = ControllerGeoCodeDynamdb;
