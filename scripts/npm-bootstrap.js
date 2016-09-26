#!/usr/bin/env node

'use strict';

var
	cp = require('child_process'),
	path = require('path'),
	lObj = require(path.join(__dirname, '..', 'lerna.json'));

cp.exec('npm install lerna@' + lObj.lerna, {env:process.env, cwd:__dirname}, function(err, stdout, stderr) {
	var lerna = require('lerna');
	var GitUtilities = require('lerna/lib/GitUtilities');

	GitUtilities.isInitialized = function() { return true; };
	GitUtilities.getTopLevelDirectory = function() { return process.cwd(); };

	var bootstrap = new lerna.__commands__.bootstrap('', {concurrency:1});
	bootstrap.run();

	if(path.basename(path.dirname(path.dirname(path.dirname(__dirname))))==='node_modules') {
		cp.exec('npm remove lerna', {env:process.env, cwd:__dirname});
	}
	
});
