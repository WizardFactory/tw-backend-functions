/**
 * Created by Peter on 2015. 7. 19..
 */
'use strict';

module.exports = {
    keyString: {
        daum_keys : (process.env.DAUM_SECRET_KEYS || '["key1","key2"]'),
        google_key : (process.env.GOOGLE_SECRET_KEY || 'key1'),
        kakao_keys : (process.env.KAKAO_SECRET_KEYS || '["key1","key2"]'),
        google_keys : (process.env.KAKAO_SECRET_KEYS || '["key1","key2", "key3"]')
    },
    serviceServer: {
        url: (process.env.SERVICE_SERVER || 'http://localhost'),
        version:  (process.env.SERVICE_VERSION || 'v000901')
    },
    apiServer: {
        url: (process.env.API_SERVER || 'http://localhost')
    }
};
