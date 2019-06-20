/* global __dirname */

const webpack = require('../src/webpack');

module.exports = async opts => webpack(opts, __dirname);
