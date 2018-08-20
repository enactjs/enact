/*
 * UTF8.js - Implement Unicode Transformation Format 8-bit mappings
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

// !depends Charmap.js IString.js

// !data charset/UTF-8

var Charset = require("./Charset.js");
var Charmap = require("./Charmap.js");
var IString = require("./IString.js");

/**
 * @class
 * Create a new UTF-8 mapping instance
 * @constructor
 * @extends Charmap
 */
var UTF8 = function (options) {
    options = options || {sync: true};
    if (typeof(options.charset) === "object" && options.charset instanceof Charset) {
        this.charset = options.charset;
        this._init(options);
    } else {
        new Charset({
            name: "UTF-8",
            sync: options.sync,
            loadParams: options.loadParams,
            onLoad: ilib.bind(this, function(cs) {
                this.charset = cs;
                this._init(options);
            })
        });
    }
};

UTF8.prototype = new Charmap({noinstance: true});
UTF8.prototype.parent = Charmap;
UTF8.prototype.constructor = UTF8;

/**
 * @private
 * Initialize the charmap instance
 */
UTF8.prototype._init = function(options) {
    this._calcExpansionFactor();

    if (typeof(options.onLoad) === "function") {
        options.onLoad(this);
    }
};

UTF8.prototype.validate = function(bytes) {
	var i = 0;
	while (i < bytes.length) {
		if ((bytes[i] & 0x80) === 0) {
			i++;
		} else {
			var len;
			if ((bytes[i] & 0xC0) === 0xC0) {
				len = 2;
			} else if ((bytes[i] & 0xE0) === 0xE0) {
				len = 3;
			} else if ((bytes[i] & 0xF0) === 0xF0) {
				len = 4;
			} else {
				// invalid lead byte
				return false;
			}
			if (i + len > bytes.length) {
				// not enough trailing bytes
				return false;
			}
			for (var j = 1; j < len; j++) {
				// check each trailing byte to see if it has the correct form
				if ((bytes[i+j] & 0x80) !== 0x80) {
					return false;
				}
			}
			i += len;
		}
	}
	
	return true;
};
	
UTF8.prototype.mapToUnicode = function (bytes) {
	if (typeof(Buffer) !== "undefined") {
		// nodejs can convert it quickly in native code
		var b = new Buffer(bytes);
		return b.toString("utf8");
	}
	// otherwise we have to implement it in pure JS
	var ret = "";
	var i = 0;
	while (i < bytes.length) {
		if (bytes[i] === 0) {
			// null-terminator
			i = bytes.length;
		} else if ((bytes[i] & 0x80) === 0) {
			// 1 byte char
			ret += String.fromCharCode(bytes[i++]);
		} else if ((bytes[i] & 0xE0) === 0xC0) {
			// 2 byte char
			if (i + 1 >= bytes.length || (bytes[i+1] & 0x80) !== 0x80) {
				throw "invalid utf-8 bytes";
			}
			// xxx xxyyyyyy
			ret += String.fromCharCode((bytes[i] & 0x1F) << 6 | (bytes[i+1] & 0x3F));
			i += 2;
		} else if ((bytes[i] & 0xF0) === 0xE0) {
			// 3 byte char
			if (i + 2 >= bytes.length || (bytes[i+1] & 0x80) !== 0x80 || (bytes[i+2] & 0x80) !== 0x80) {
				throw "invalid utf-8 bytes";
			}
			// xxxxyyyy yyzzzzzz
			ret += String.fromCharCode((bytes[i] & 0xF) << 12 | (bytes[i+1] & 0x3F) << 6 | (bytes[i+2] & 0x3F));
			i += 3;
		} else if ((bytes[i] & 0xF8) === 0xF0) {
			// 4 byte char
			if (i + 3 >= bytes.length || (bytes[i+1] & 0x80) !== 0x80 || (bytes[i+2] & 0x80) !== 0x80 || (bytes[i+3] & 0x80) !== 0x80) {
				throw "invalid utf-8 bytes";
			}
			// wwwxx xxxxyyyy yyzzzzzz
			ret += IString.fromCodePoint((bytes[i] & 0x7) << 18 | (bytes[i+1] & 0x3F) << 12 | (bytes[i+2] & 0x3F) << 6 | (bytes[i+3] & 0x3F));
			i += 4;
		} else {
			throw "invalid utf-8 bytes";
		}
	}
	
	return ret;
};
	
UTF8.prototype.mapToNative = function(str) {
	if (typeof(Buffer) !== "undefined") {
		// nodejs can convert it quickly in native code
		var b = new Buffer(str, "utf8");
		return new Uint8Array(b);
	}
	// otherwise we have to implement it in pure JS
	var istr = (str instanceof IString) ? str : new IString(str);
	
	// step through the surrogate pairs as single code points by using
	// IString's iterator 
	var it = istr.iterator();
	
	// multiply by 4 because the max size of a UTF-8 char is 4 bytes, so
	// this will at least get us enough room to encode everything. Add 1
	// for the null terminator
	var ret = new Uint8Array(istr.length * 4 + 1);
	var i = 0;
	
	while (it.hasNext()) {
		var c = it.next();
		if (c > 0x7F) {
			if (c > 0x7FF) {
				if (c > 0xFFFF) {
					// astral planes char
					ret[i]   = 0xF0 | ((c >> 18) & 0x3);
					ret[i+1] = 0x80 | ((c >> 12) & 0x3F);
					ret[i+2] = 0x80 | ((c >> 6) & 0x3F);
					ret[i+3] = 0x80 | (c & 0x3F);
					
					i += 4;
				} else {
					ret[i]   = 0xE0 | ((c >> 12) & 0xF);
					ret[i+1] = 0x80 | ((c >> 6) & 0x3F);
					ret[i+2] = 0x80 | (c & 0x3F);
					
					i += 3;
				}
			} else {
				ret[i]   = 0xC0 | ((c >> 6) & 0x1F);
				ret[i+1] = 0x80 | (c & 0x3F);
				
				i += 2;
			}
		} else {
			ret[i++] = (c & 0x7F);
		}
	}
	ret[i] = 0; // null-terminate it
	
	return ret;
};

Charmap._algorithms["UTF-8"] = UTF8;

module.exports = UTF8;