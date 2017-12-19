/**
 * Created by dhkim2 on 2017-12-04.
 */

'use strict';

const ControllerDynamodb = require('./controller.dynamodb');

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

        this._getDb(params, (err, result) => {
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

        let updateExpression = 'SET loc = :loc, lang = :lang, country = :country, address = :address' +
            ', label = :label, updatedAt = :updatedAt';

        let expressionAttributeValues = {
            ':loc': geoInfo.loc,
            ':lang': geoInfo.lang,
            ':country': geoInfo.country,
            ':address': geoInfo.address,
            ':label': geoInfo.label,
            ':updatedAt': timestamp
        };

        if (geoInfo.kmaAddress) {
            updateExpression += ', kmaAddress = :kmaAddress';
            expressionAttributeValues[':kmaAddress'] = geoInfo.kmaAddress;
        }

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
