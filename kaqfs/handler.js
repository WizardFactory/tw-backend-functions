/**
 * Created by dhkim2 on 2018-03-11
 */

'use strict';

const ScrapeKaqfs = require('./scrape.kaqfs');

module.exports.copyKaqfsImagesToS3 = (event, context, callback) => {
    new ScrapeKaqfs().copyNewImagesToS3(callback);
};
