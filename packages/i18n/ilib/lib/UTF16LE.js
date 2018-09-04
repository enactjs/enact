/*
 * UTF16LE.js - Implement Unicode Transformation Format 16 bit, 
 * Little Endian mappings
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

// !data charset/UTF-16 charset/UTF-16LE

var Charset = require("./Charset.js");
var Charmap = require("./Charmap.js");

/**
 * @class
 * Create a new UTF-16LE mapping instance
 * @constructor
 * @extends Charmap
 */
var UTF16LE = function (options) {
    options = options || {sync: true};
    if (typeof(options.charset) === "object" && options.charset instanceof Charset) {
        this.charset = options.charset;
        this._init(options);
    } else {
        new Charset({
            name: "UTF-16LE",
            sync: options.sync,
            loadParams: options.loadParams,
            onLoad: ilib.bind(this, function(cs) {
                this.charset = cs;
                this._init(options);
            })
        });
    }
};

UTF16LE.prototype = new Charmap({noinstance: true});
UTF16LE.prototype.parent = Charmap;
UTF16LE.prototype.constructor = UTF16LE;

/**
 * @private
 * Initialize the charmap instance
 */
UTF16LE.prototype._init = function(options) {
    this._calcExpansionFactor();

    if (typeof(options.onLoad) === "function") {
        options.onLoad(this);
    }
};

UTF16LE.prototype.mapToUnicode = function (bytes) {
	if (typeof(Buffer) !== "undefined") {
		// nodejs can convert it quickly in native code
		var b = new Buffer(bytes);
		return b.toString("utf16le");
	}
	// otherwise we have to implement it in pure JS
	var ret = "";
	for (var i = 0; i < bytes.length; i += 2) {
		ret += String.fromCharCode(bytes[i+1] << 8 | bytes[i]);
	}
	
	return ret;
};
	
UTF16LE.prototype.mapToNative =  function(str) {
	if (typeof(Buffer) !== "undefined") {
		// nodejs can convert it quickly in native code
		var b = new Buffer(str, "utf16le");
		return new Uint8Array(b);
	}
	// otherwise we have to implement it in pure JS
	var ret = new Uint8Array(str.length * 2 + 2);
	var c;
	for (var i = 0; i < str.length; i++) {
		c = str.charCodeAt(i);
		ret[i*2] = c & 0xFF;
		ret[i*2+1] = (c >> 8) & 0xFF;
	}
	// double null terminate it, just in case
	ret[i*2+1] = 0;
	ret[i*2+2] = 0;
	
	return ret;
};

Charmap._algorithms["UTF-16"] = UTF16LE;
Charmap._algorithms["UTF-16LE"] = UTF16LE;

module.exports = UTF16LE;