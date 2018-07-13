/*
 * Charmap.js - A character set mapping class
 * 
 * Copyright © 2014-2015,2018, JEDLSoft
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

// !depends ilib.js Utils.js Charset.js JSUtils.js IString.js

// !data charset/US-ASCII charset/ISO-10646-UCS-2 charset/ISO-10646-UCS-4 charset/ISO-10646-Unicode-Latin1

var ilib = require("./ilib.js");
var Utils = require("./Utils.js");
var Charset = require("./Charset.js");
var JSUtils = require("./JSUtils.js");
var IString = require("./IString.js");

/**
 * @class
 * Create a new default character set mapping instance. This class is the parent
 * class of all of the charmapping subclasses, and only implements basic US-ASCII
 * mapping. The subclasses implement all other charsets, some algorithmically, and
 * some in a table-based way. Use {@link CharmapFactory} to create the correct
 * subclass instance for the desired charmap.<p>
 * 
 * All mappings are done to or from Unicode in the UTF-16 encoding, which is the base
 * character set and encoding used by Javascript itself. In order to convert 
 * between two non-Unicode character sets, you must chain two charmap instances together 
 * to first map to Unicode and then back to the second charset. <p>
 * 
 * The options parameter controls which mapping is constructed and its behaviours. The 
 * current list of supported options are:
 * 
 * <ul>
 * <li><i>missing</i> - specify what to do if a mapping is missing for a particular
 * character. For example, if you are mapping Unicode characters to a particular native
 * character set that does not support particular Unicode characters, the mapper will
 * follow the behaviour specified in this property. Valid values are:
 * <ul>
 * <li><i>skip</i> - skip any characters that do not exist in the target charset
 * <li><i>placeholder</i> - put a static placeholder character in the output string 
 * wherever there is an unknown character in the input string. Use the <i>placeholder</i> 
 * parameter to specify which character to use in this case
 * <li><i>escape</i> - use an escape sequence to represent the unknown character 
 * </ul>
 * The default value for the missing property if not otherwise specified is "escape"
 * so that information is not lost.
 * 
 * <li><i>placeholder</i> - specify the placeholder character to use when the 
 * mapper cannot map a particular input character to the output string. If this
 * option is not specified, then the '?' (question mark) character is used where 
 * possible.
 * 
 * <li><i>escapeStyle</i> - what style of escape sequences should be used to
 * escape unknown characters in the input when mapping to native, and what
 * style of espcae sequences should be parsed when mapping to Unicode. Valid 
 * values are:
 * <ul>
 * <li><i>html</i> - Escape the characters as HTML entities. This would use
 * the standard HTML 5.0 (or later) entity names where possible, and numeric
 * entities in all other cases. Eg. an "e" with an acute accent would be 
 * "&#x00E9;"
 * <li><i>js</i> - Use the Javascript escape style. Eg. an "e" with an acute
 * accent would be "\u00E9". This can also be specified as "c#" as
 * it uses a similar escape syntax.
 * <li><i>c</i> - Use the C/C++ escape style, which is similar to the the
 * Javascript style, but uses an "x" in place of the "u". Eg. an "e" with an 
 * acute accent would be "\x00E9". This can also be specified as "c++".
 * <li><i>java</i> - Use the Java escape style. This is very similar to the
 * the Javascript style, but the backslash has to be escaped twice. Eg. an
 * "e" with an acute accent would be "\\u00E9". This can also be specified
 * as "ruby", as Ruby uses a similar escape syntax with double backslashes.
 * <li><i>perl</i> - Use the Perl escape style. Eg. an "e" with an acute
 * accent would be "\N{U+00E9}"
 * </ul>
 * The default if this style is not specified is "js" for Javascript.
 * </ul>
 * 
 * If this copy of ilib is pre-assembled and all the data is already available, 
 * or if the data was already previously loaded, then this constructor will call
 * the onLoad callback immediately when the initialization is done. 
 * If the onLoad option is not given, this class will only attempt to load any
 * missing data synchronously.
 * 
 * @constructor
 * @param {Object=} options options which govern the construction of this instance
 */
var Charmap = function(options) {
	var sync = true,
	    loadParams = undefined;
	
	if (options && options.noinstance) {
	    return;
	}
	
	this.missing = "placeholder";
	this.placeholder = "?";
	this.escapeStyle = "js";
	this.expansionFactor = 1;
	
	if (options) {
		if (typeof(options.placeholder) !== 'undefined') {
			this.placeholder = options.placeholder;
		}

		var escapes = {
			"html": "html",
			"js": "js",
			"c#": "js",
			"c": "c",
			"c++": "c",
			"java": "java",
			"ruby": "java",
			"perl": "perl"
		};
		
		if (typeof(options.escapeStyle) !== 'undefined') {
			if (typeof(escapes[options.escapeStyle]) !== 'undefined') {
				this.escapeStyle = escapes[options.escapeStyle];
			}
		}

		if (typeof(options.missing) !== 'undefined') {
			if (options.missing === "skip" || options.missing === "placeholder" || options.missing === "escape") {
				this.missing = options.missing;
			}
		}
	}
};

/**
 * A place for the algorithmic conversions to register themselves as 
 * they are defined.
 * 
 * @static
 * @private
 */
Charmap._algorithms = {};

Charmap.prototype = {
    /**
     * Return the standard name of this charmap. All charmaps map from
     * Unicode to the native charset, so the name returned from this
     * function corresponds to the native charset.
     * 
     * @returns {string} the name of the locale's language in English
     */
    getName: function () {
    	return this.charset.getName();	
    },
    
    /**
     * @private
     */
    writeNative: function (array, start, value) {
    	// console.log("Charmap.writeNative: start " + start + " adding " + JSON.stringify(value));
    	if (ilib.isArray(value)) { 
	    	for (var i = 0; i < value.length; i++) {
	    		array[start+i] = value[i];
	    	}
	    	
	    	return value.length;
    	} else {
    		array[start] = value;
    		return 1;
    	}
    },
    
    /**
     * @private
     */
    writeNativeString: function (array, start, string) {
    	// console.log("Charmap.writeNativeString: start " + start + " adding " + JSON.stringify(string));
    	for (var i = 0; i < string.length; i++) {
    		array[start+i] = string.charCodeAt(i);
    	}
    	return string.length;
    },
    
    /**
     * @private
     */
    _calcExpansionFactor: function() {
    	var factor = 1;
    	factor = Math.max(factor, this.charset.getMaxCharWidth());
    	switch (this.missing) {
    	case "placeholder":
    		if (this.placeholder) {
    			factor = Math.max(factor, this.placeholder.length);
    		}
    		break;
    	case "escape":
    		switch (this.escapeStyle) {
			case "html":
				factor = Math.max(factor, 8); // &#xHHHH;
				break;
			case "c":
				factor = Math.max(factor, 6); // \xHHHH
				break;
			case "perl":
				factor = Math.max(factor, 10); // \N{U+HHHH}
				break;
				
			default:
				factor = Math.max(factor, 6); // \uHHHH
				break;
    		}
    		break;
		default:
			break;
    	}
    	
    	this.expansionFactor = factor;
    },
    
    /**
     * @private
     */
    dealWithMissingChar: function(c) {
    	var seq = "";
    	
		switch (this.missing) {
			case "skip":
				// do nothing
				break;
				
			case "escape":
				var num = (typeof(c) === 'string') ? c.charCodeAt(0) : c;
				var bigc = JSUtils.pad(num.toString(16), 4).toUpperCase();
				switch (this.escapeStyle) {
					case "html":
						seq = "&#x" + bigc + ";";
						break;
					case "c":
						seq = "\\x" + bigc;
						break;
					case "java":
						seq = "\\\\u" + bigc;
						break;
					case "perl":
						seq = "\\N{U+" + bigc + "}";
						break;
						
					default:
					case "js":
						seq = "\\u" + bigc;
						break;
				}
				break;
				
			default:
			case "placeholder":
				seq = this.placeholder;
				break;
		}
		
		return seq;
    },
    
    /**
     * Map a string to the native character set. This string may be 
     * given as an intrinsic Javascript string object or an IString 
     * object.
     * 
     * @param {string|IString} string string to map to a different 
     * character set. 
     * @return {Uint8Array} An array of bytes representing the string 
     * in the native character set
     */
    mapToNative: function(string) {
    	if (!string) {
    		return new Uint8Array(0);
    	}
    	
    	if (this.algorithm) {
    		return this.algorithm.mapToNative(string);
    	}
    	
    	// the default algorithm is plain old ASCII
    	var str = (string instanceof IString) ? string : new IString(string);
    	
    	// use IString's iterator so that we take care of walking through
    	// the code points correctly, including the surrogate pairs
    	var c, i = 0, j = 0, it = str.iterator();
    	var ret = new Uint8Array(str.length * this.expansionFactor);
    	
    	while (it.hasNext() && i < ret.length) {
    		c = it.next();
    		if (c < 127) {
    			ret[i++] = c;
    		} else {
    			i += this.writeNativeString(ret, i, this.dealWithMissingChar(c));
    		}
    	}

    	return ret;
    },
    
    /**
     * Map a native string to the standard Javascript charset of UTF-16. 
     * This string may be given as an array of numbers where each number 
     * represents a code point in the "from" charset, or as a Uint8Array 
     * array of bytes representing the bytes of the string in order.
     * 
     * @param {Array.<number>|Uint8Array} bytes bytes to map to 
     * a Unicode string
     * @return {string} A string in the standard Javascript charset UTF-16
     */
    mapToUnicode: function(bytes) {
    	var ret = "";
    	var c, i = 0;
    	
    	while (i < bytes.length) {
    		c = bytes[i];
    		
    		// the default algorithm is plain old ASCII
        	if (c < 128) {
    			ret += String.fromCharCode(c);
    		} else {
    			// The byte at "i" wasn't ASCII
				ret += this.dealWithMissingChar(bytes[i++]);
    		}
    	}

    	return ret;
    }
};

module.exports = Charmap;