#!/usr/bin/env node

/**
* npm-bootstrap.js
* This script is designed to be run during the NPM postinstall phase.
* It will use Lerna to bootstrap the Enact packages' dependencies and symlink
* interconnected packages as needed.  This is needed during the postinstall
* phase if the Enact monorepo itself is being used as a dependency.
*
* Once public stable releases of Enact packages are pushed to NPM, it is advised
* that using those packages as dependencies is the norm. The Enact monorepo as
* a dependency is only recommended during development phases internally.
*/

'use strict';

var
	cp = require('child_process'),
	path = require('path'),
	lObj = require(path.join(__dirname, '..', 'lerna.json'));

// install lerna if not installed/available
cp.exec('npm install lerna@' + lObj.lerna, {env:process.env, cwd:__dirname}, function(err, stdout, stderr) {
	var lerna = require('lerna');

	// override certain git-utilities functions to prevent Lerna
	// from initializing enact npm module as a new git repo
	var GitUtilities = require('lerna/lib/GitUtilities');
	GitUtilities.isInitialized = function() { return true; };
	GitUtilities.getTopLevelDirectory = function() { return process.cwd(); };

	// run the lerna bootstrap process
	var bootstrap = new lerna.__commands__.bootstrap('', {concurrency:1});
	bootstrap.run();

	// if enact is being directly used as a dependency (ideally only during dev) cleanup and remove lerna
	if(path.basename(path.dirname(path.dirname(path.dirname(__dirname))))==='node_modules') {
		cp.exec('npm remove lerna', {env:process.env, cwd:__dirname});
	}
	
});
