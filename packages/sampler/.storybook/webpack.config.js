/* global __dirname */

const webpack = require('@enact/storybook-utils/configs/webpack');

module.exports = async ({config, mode}) => webpack(config, mode, __dirname);
