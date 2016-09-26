#!/usr/bin/env node

'use strict';

var lerna = require('lerna');
var GitUtilities = require('lerna/lib/GitUtilities');

GitUtilities.isInitialized = function() { return true; };
GitUtilities.getTopLevelDirectory = function() { return process.cwd(); };

var bootstrap = new lerna.__commands__.bootstrap('', {concurrency:1});
bootstrap.run();
