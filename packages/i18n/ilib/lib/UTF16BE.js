/*
 * UTF16BE.js - Implement Unicode Transformation Format 16-bit,
 * Big Endian mappings
 * 
 * Copyright © 2014-2015, 2018, JEDLSoft
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

// !depends Charmap.js

// !data charset/UTF-16 charset/UTF-16BE

var Charset = require("./Charset.js");
var Charmap = require("./Charmap.js");

/**
 * @class
 * Create a new UTF-16BE mapping instance
 * @constructor
 * @extends Charmap
 */
var UTF16BE = function (options) {
    options = options || {sync: true};
    if (typeof(options.charset) === "object" && options.charset instanceof Charset) {
        this.charset = options.charset;
        this._init(options);
    } else {
        new Charset({
            name: "UTF-16BE",
            sync: options.sync,
            loadParams: options.loadParams,
            onLoad: ilib.bind(this, function(cs) {
                this.charset = cs;
                this._init(options);
            })
        });
    }
};

UTF16BE.prototype = new Charmap({noinstance: true});
UTF16BE.prototype.parent = Charmap;
UTF16BE.prototype.constructor = UTF16BE;

/**
 * @private
 * Initialize the charmap instance
 */
UTF16BE.prototype._init = function(options) {
    this._calcExpansionFactor();

    if (typeof(options.onLoad) === "function") {
        options.onLoad(this);
    }
};

UTF16BE.prototype.mapToUnicode = function (bytes) {
	// nodejs can't convert big-endian in native code,
	// so we would have to flip each Uint16 ourselves.
	// At that point, it's just quicker to convert 
	// in JS code anyways
	var ret = "";
	for (var i = 0; i < bytes.length; i += 2) {
		ret += String.fromCharCode(bytes[i] << 8 | bytes[i+1]);
	}
	
	return ret;
};
	
UTF16BE.prototype.mapToNative = function(str) {
	// nodejs can't convert big-endian in native code,
	// so we would have to flip each Uint16 ourselves.
	// At that point, it's just quicker to convert 
	// in JS code anyways
	var ret = new Uint8Array(str.length * 2 + 2);
	var c;
	for (var i = 0; i < str.length; i++) {
		c = str.charCodeAt(i);
		ret[i*2] = (c >> 8) & 0xFF;
		ret[i*2+1] = c & 0xFF;
	}
	// double null terminate it, just in case
	ret[i*2+1] = 0;
	ret[i*2+2] = 0;
	
	return ret;
};

Charmap._algorithms["UTF-16BE"] = UTF16BE;

module.exports = UTF16BE;