/*
 * Loader.js - shared loader implementation
 * 
 * Copyright © 2015, 2018, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* !depends ilib.js Path.js */

var Path = require("./Path.js");
var ilib = require("./ilib.js");

/** 
 * @class
 * Superclass of the loader classes that contains shared functionality.
 * 
 * @private
 * @constructor
 */
var Loader = function() {
	// console.log("new Loader instance");

	this.protocol = "file://";
	this.includePath = [];
};

Loader.prototype = new ilib.Loader();
Loader.prototype.parent = ilib.Loader;
Loader.prototype.constructor = Loader;

Loader.prototype._loadFile = function (pathname, sync, cb) {};

Loader.prototype._exists = function(dir, file) {
	var fullpath = Path.normalize(Path.join(dir, file));
	if (this.protocol !== "http://") {
		var text = this._loadFile(fullpath, true);
		if (text) {
			this.includePath.push(dir);
		}
	} else {
		// put the dir on the list now assuming it exists, and check for its availability 
		// later so we can avoid the 404 errors eventually
		this.includePath.push(dir);
		this._loadFile(fullpath, false, ilib.bind(this, function(text) {
			if (!text) {
				//console.log("Loader._exists: removing " + dir + " from the include path because it doesn't exist.");
				this.includePath = this.includePath.slice(-1);
			}
		}));
	}
};

Loader.prototype._loadFileAlongIncludePath = function(includePath, pathname) {
	for (var i = 0; i < includePath.length; i++) {
		var manifest = this.manifest[includePath[i]];
		if (!manifest || Loader.indexOf(manifest, pathname) > -1) {
			var filepath = Path.join(includePath[i], pathname);
			//console.log("Loader._loadFileAlongIncludePath: attempting sync load " + filepath);
			var text = this._loadFile(filepath, true);
			if (text) {
				//console.log("Loader._loadFileAlongIncludePath: succeeded");
				return text;
			} 
			//else {
				//console.log("Loader._loadFileAlongIncludePath: failed");
			//} 
		} 
		//else {
			//console.log("Loader._loadFileAlongIncludePath: " + pathname + " not in manifest for " + this.includePath[i]);
		//}
	}
	
	//console.log("Loader._loadFileAlongIncludePath: file not found anywhere along the path.");
	return undefined;
};

Loader.prototype.loadFiles = function(paths, sync, params, callback) {
	var includePath = params && params.base ? [params.base].concat(this.includePath) : this.includePath;

	//console.log("Loader loadFiles called");
	// make sure we know what we can load
	if (!paths) {
		// nothing to load
		//console.log("nothing to load");
		return;
	}
	
	if (params && params.returnOne) {
		// Only return the most locale-specific data. Do this by searching backwards
		// in the list of paths.
		var pathname;
		var tmp = [];
		while ((pathname = paths.pop()) !== undefined) {
			tmp.push(pathname);
		}
		paths = tmp;
	}
	
	//console.log("generic loader: attempting to load these files: " + JSON.stringify(paths) + "\n");
	if (sync) {
		var ret = [];
		
		// synchronous
		this._loadManifests(true);
		
		for (var i = 0; i < paths.length; i++) {
			var text = this._loadFileAlongIncludePath(includePath, Path.normalize(paths[i]));
			ret.push(typeof(text) === "string" ? JSON.parse(text) : text);
			if (params && params.returnOne && text) {
				break;
			}
		};

		// only call the callback at the end of the chain of files
		if (typeof(callback) === 'function') {
			callback(ret);
		}

		return ret;
	}

	// asynchronous
	this._loadManifests(false, ilib.bind(this, function() {
		//console.log("Loader.loadFiles: now loading files asynchronously");
		var results = [];
		this._loadFilesAsync(includePath, paths, results, callback);
	}));
};

Loader.prototype._loadFilesAsyncAlongIncludePath = function (includes, filename, cb) {
	var text = undefined;
	
	if (includes.length > 0) {
		var root = includes[0];
		includes = includes.slice(1);
		
		var manifest = this.manifest[root];
		if (!manifest || Loader.indexOf(manifest, filename) > -1) {
			var filepath = Path.join(root, filename);
			this._loadFile(filepath, false, ilib.bind(this, function(t) {
				//console.log("Loader._loadFilesAsyncAlongIncludePath: loading " + (t ? " success" : " failed"));
			    if (t) {
					cb(t);
				} else {
					this._loadFilesAsyncAlongIncludePath(includes, filename, cb);
				}
			}));
		} else {
			//console.log("Loader._loadFilesAsyncAlongIncludePath: " + filepath + " not in manifest for " + root);
			this._loadFilesAsyncAlongIncludePath(includes, filename, cb);
		}
	} else {
	    // file not found in any of the include paths
		cb();
	}
};

Loader.prototype._loadFilesAsync = function (includePath, paths, results, callback) {
	if (paths.length > 0) {
		var filename = paths[0];
		paths = paths.slice(1);
		
		//console.log("Loader._loadFilesAsync: attempting to load " + filename + " along the include path.");
		this._loadFilesAsyncAlongIncludePath(includePath, filename, ilib.bind(this, function (json) {
		    results.push(typeof(json) === "string" ? JSON.parse(json) : json);
			this._loadFilesAsync(includePath, paths, results, callback);
		}));
	} else {
		// only call the callback at the end of the chain of files
		if (typeof(callback) === 'function') {
			callback(results);
		}
	}
};

Loader.prototype._loadManifestFile = function(i, sync, cb) {
    //console.log("Loader._loadManifestFile: Checking include path " + i + " " + this.includePath[i]);
    if (i < this.includePath.length) {
        var filepath = Path.join(this.includePath[i], "ilibmanifest.json");
        //console.log("Loader._loadManifestFile: Loading manifest file " + filepath);
        var text = this._loadFile(filepath, sync, ilib.bind(this, function(text) {
            if (text) {
                //console.log("Loader._loadManifestFile: success!");
                this.manifest[this.includePath[i]] = (typeof(text) === "string" ? JSON.parse(text) : text).files;
            }
            //else console.log("Loader._loadManifestFile: failed...");
            this._loadManifestFile(i+1, sync, cb);
        }));
    } else {
        if (typeof(cb) === 'function') {
            //console.log("Loader._loadManifestFile: now calling callback function");
            cb();
        }
    }
};

Loader.prototype._loadManifests = function(sync, cb) {
	//console.log("Loader._loadManifests: called " + (sync ? "synchronously" : "asychronously."));
	if (!this.manifest) {
		//console.log("Loader._loadManifests: attempting to find manifests");
		this.manifest = {};
		if (typeof(sync) !== 'boolean') {
			sync = true;
		}
			
		this._loadManifestFile(0, sync, cb);
	} else {
		//console.log("Loader._loadManifests: already loaded");
		if (typeof(cb) === 'function') {
			//console.log("Loader._loadManifests: now calling callback function");
			cb();
		}
	}
};

Loader.prototype.listAvailableFiles = function(sync, cb) {
	//console.log("generic loader: list available files called");
	this._loadManifests(sync, ilib.bind(this, function () {
		if (typeof(cb) === 'function') {
			//console.log("generic loader: now calling caller's callback function");
			cb(this.manifest);
		}
	}));
	return this.manifest;
};

Loader.indexOf = function(array, obj) {
	if (!array || !obj) {
		return -1;
	}
	if (typeof(array.indexOf) === 'function') {
		return array.indexOf(obj);
	} else {
		for (var i = 0; i < array.length; i++) {
	        if (array[i] === obj) {
	            return i;
	        }
	    }
	    return -1;
	}
};

Loader.prototype.checkAvailability = function(file) {
	for (var dir in this.manifest) {
		if (Loader.indexOf(this.manifest[dir], file) !== -1) {
			return true;
		}
	}
	
	return false;
};

Loader.prototype.isAvailable = function(file, sync, cb) {
	//console.log("Loader.isAvailable: called");
	if (typeof(sync) !== 'boolean') {
		sync = true;
	}
	if (sync) {
		this._loadManifests(sync);
		return this.checkAvailability(file);
	}
	
	this._loadManifests(false, ilib.bind(this, function () {
		// console.log("generic loader: isAvailable " + path + "? ");
		if (typeof(cb) === 'function') {
			cb(this.checkAvailability(file));
		}
	}));
};

module.exports = Loader;
