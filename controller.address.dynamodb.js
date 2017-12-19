/**
 * Created by dhkim2 on 2017-12-18.
 */

'use strict';

const ControllerDynamodb = require('./controller.dynamodb');

class ControllerAddressDynamdb extends ControllerDynamodb {
    constructor() {
        super();
    }

    get(addr, callback) {
        let params;
        try {
            console.log({db_get:{id:addr}});
            params = {
                TableName: process.env.DYNAMODB_ADDRESS_TABLE,
                Key: {
                    id: addr
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
            geoInfo.id = geoInfo.address;
            isInvalid = (typeof geoInfo.address !== 'string');
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

        let updateExpression = 'SET loc = :loc, country = :country, address = :address' +
            ', updatedAt = :updatedAt';

        let expressionAttributeValues = {
            ':loc': geoInfo.loc,
            ':country': geoInfo.country,
            ':address': geoInfo.address,
            ':updatedAt': timestamp
        };

        if (geoInfo.kmaAddress) {
            updateExpression += ', kmaAddress = :kmaAddress';
            expressionAttributeValues[':kmaAddress'] = geoInfo.kmaAddress;
        }

        const params = {
            TableName: process.env.DYNAMODB_ADDRESS_TABLE,
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

module.exports = ControllerAddressDynamdb;
