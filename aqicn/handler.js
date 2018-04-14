/**
 * Created by dhkim2 on 2018-04-13
 */

"use strict";

const RequestAqicn = require('./request.aqicn');

module.exports.requestAqicn = (event, context, callback) => {
    new RequestAqicn().do(callback);
};
