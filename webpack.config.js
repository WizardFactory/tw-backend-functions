const nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

/**
 * grpc modules을 사용하는 copyKaqfsImagesToS3 외 다른 function은 node-v48-linux-x64-glibc가 복사되지 않음
 */
module.exports = {
    entry: slsw.lib.entries,
    plugins: [
        new CopyWebpackPlugin([
            {from:'node_modules/grpc/src/node/extension_binary/node-v48-linux-x64-glibc',
                to: 'node_modules/grpc/src/node/extension_binary/node-v48-linux-x64-glibc'}
        ]),
    ],
    // we use webpack-node-externals to excludes all node deps.
    // You can manually set the externals too.
    externals: [nodeExternals()],
    mode: slsw.lib.webpack.isLocal ? "development" : "production"
};
