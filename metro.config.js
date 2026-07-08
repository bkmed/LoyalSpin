const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

const { exclusionList } = require('metro-config');

const config = {
  resolver: {
    // html5-qrcode is web-only — prevent Metro from bundling it for native
    blockList: exclusionList([/node_modules\/html5-qrcode\/.*/]),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

