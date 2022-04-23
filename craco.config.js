const webpack = require('webpack');
const CracoAlias = require('craco-alias');
const path = require('path');

module.exports = {
    plugins: [
        {
            plugin: CracoAlias,
            options: {
                source: 'jsconfig',
                jsConfigPath: 'jsconfig.paths.json',
            },
        },
    ],
    webpack: {
        configure: (webpackConfig) => {
            const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
                ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin',
            );
            webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);

            webpackConfig.resolve = {
                ...webpackConfig.resolve,
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
                alias: {
                    '@/hardhat': path.resolve(__dirname, '../../../hardhat/'),
                },
            };
            webpackConfig.plugins = [
                ...webpackConfig.plugins,
                new webpack.ProvidePlugin({
                    Buffer: ['buffer', 'Buffer'],
                    process: 'process/browser',
                }),
            ];
            return webpackConfig;
        },
    },
};
