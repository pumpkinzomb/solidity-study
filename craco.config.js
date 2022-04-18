const webpack = require('webpack');

module.exports = {
    webpack: {
        configure: {
            resolve: {
                fallback: {
                    process: require.resolve('process/browser'),
                    zlib: require.resolve('browserify-zlib'),
                    stream: require.resolve('stream-browserify'),
                    util: require.resolve('util'),
                    buffer: require.resolve('buffer'),
                    asset: require.resolve('assert'),
                    os: require.resolve('os-browserify'),
                    stream: require.resolve('stream-browserify'),
                    http: require.resolve('stream-http'),
                    https: require.resolve('https-browserify'),
                    crypto: require.resolve('crypto-browserify'),
                    url: require.resolve('url'),
                },
            },
            plugins: [
                new webpack.ProvidePlugin({
                    Buffer: ['buffer', 'Buffer'],
                    process: 'process/browser',
                }),
            ],
        },
    },
};
