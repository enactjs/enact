/*
 * Charset.js - Return information about a particular character set
 * 
 * Copyright © 2014-2015, JEDLSoft
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

// !depends ilib.js Utils.js
// !data charsetaliases charset/ISO-8859-1 charset/ISO-8859-15 charset/UTF-8

var ilib = require("./ilib.js");
var Utils = require("./Utils.js");

/**
 * @class
 * Create a new character set info instance. Charset instances give information about
 * a particular character set, such as whether or not it is single byte or multibyte,
 * and which languages commonly use that charset.<p>
 * 
 * The optional options object holds extra parameters if they are necessary. The
 * current list of supported options are:
 * 
 * <ul>
 * <li><i>name</i> - the name of the charset. This can be given as any commonly
 * used name for the character set, which is normalized to a standard IANA name 
 * before its info is loaded. If a name is not given,
 * this class will return information about the base character set of Javascript,
 * which is currently Unicode as encoded in UTF-16.
 * 
 * <li><i>onLoad</i> - a callback function to call when this object is fully 
 * loaded. When the onLoad option is given, this class will attempt to
 * load any missing data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the 
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two.
 * 
 * <li><i>sync</i> - tell whether to load any missing data synchronously or 
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, because the instance returned from this constructor will
 * not be usable for a while.
 *
 * <li><i>loadParams</i> - an object containing parameters to pass to the 
 * loader callback function when data is missing. The parameters are not
 * interpretted or modified in any way. They are simply passed along. The object 
 * may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
 * </ul>
 * 
 * If this copy of ilib is pre-assembled and all the data is already available, 
 * or if the data was already previously loaded, then this constructor will call
 * the onLoad callback immediately when the initialization is done. 
 * If the onLoad option is not given, this class will only attempt to load any
 * missing data synchronously.
 * 
 * Depends directive: !depends charset.js
 * 
 * @constructor
 * @see {ilib.setLoaderCallback} for information about registering a loader callback instance
 * @param {Object=} options options which govern the construction of this instance
 */
var Charset = function(options) {
	var sync = true,
	    loadParams = undefined;
	this.originalName = "UTF-8";
	
	if (options) {
		if (typeof(options.name) !== 'undefined') {
			this.originalName = options.name;
		}
		
		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync == true);
		}
		
		if (typeof(options.loadParams) !== 'undefined') {
			loadParams = options.loadParams;
		}
	}

	// default data. A majority of charsets use this info
	this.info = {
		description: "default",
		min: 1,
		max: 1,
		bigendian: true,
		scripts: ["Latn"],
		locales: ["*"]
	};

	Utils.loadData({
		object: "Charset", 
		locale: "-",
		nonlocale: true,
		name: "charsetaliases.json", 
		sync: sync,
		loadParams: loadParams, 
		callback: ilib.bind(this, function (info) {
			// first map the given original name to one of the standardized IANA names
			if (info) {
				// recognize better by getting rid of extraneous crap and upper-casing
				// it so that the match is case-insensitive
				var n = this.originalName.replace(/[-_,:\+\.\(\)]/g, '').toUpperCase();
				this.name = info[n];
			}
			if (!this.name) {
				this.name = this.originalName;
			}
			Utils.loadData({
				object: "Charset", 
				locale: "-",
				nonlocale: true,
				name: "charset/" + this.name + ".json", 
				sync: sync, 
				loadParams: loadParams, 
				callback: ilib.bind(this, function (info) {
					if (info) {
						ilib.extend(this.info, info);	
					}
					if (options && typeof(options.onLoad) === 'function') {
						options.onLoad(this);
					}
				})
			});
		})
	});
};

Charset.prototype = {
    /**
     * Return the standard normalized name of this charset.  The list of standard names 
     * comes from the IANA registry of character set names at 
     * <a href="http://www.iana.org/assignments/character-sets/character-sets.xhtml">http://www.iana.org/assignments/character-sets/character-sets.xhtml</a>.
     * 
     * @returns {string} the name of the charset
     */
    getName: function () {
    	return this.name;	
    },
    
    /**
     * Return the original name that this instance was constructed with before it was
     * normalized to the standard name returned by {@link #getName}.
     * 
     * @returns {String} the original name that this instance was constructed with
     */
    getOriginalName: function() {
    	return this.originalName;
    },
    
    /**
     * Return a short description of the character set.
     * 
     * @returns {string} a description of the character set
     */
    getDescription: function() {
    	return this.info.description || this.getName();
    },
    
    /**
     * Return the smallest number of bytes that a single character in this charset
     * could use. For most charsets, this is 1, but for some charsets such as Unicode
     * encoded in UTF-16, this may be 2 or more.
     * @returns {number} the smallest number of bytes that a single character in
     * this charset uses
     */
    getMinCharWidth: function () {
    	return this.info.min;
    },
    
    /**
     * Return the largest number of bytes that a single character in this charset
     * could use.
     * @returns {number} the largest number of bytes that a single character in
     * this charset uses
     */
    getMaxCharWidth: function () {
    	return this.info.max;
    },
    
    /**
     * Return true if this is a multibyte character set, or false for a fixed
     * width character set. A multibyte character set is one in which the characters
     * have a variable width. That is, one character may use 1 byte and a different
     * character might use 2 or 3 bytes.
     * 
     * @returns {boolean} true if this is a multibyte charset, or false otherwise
     */
    isMultibyte: function() {
    	return this.getMaxCharWidth() > this.getMinCharWidth();
    },
    
    /**
     * Return whether or not characters larger than 1 byte use the big endian order
     * or little endian.
     * 
     * @returns {boolean} true if this character set uses big endian order, or false
     * otherwise
     */
    isBigEndian: function() {
    	return this.info.bigendian;
    },
    
    /**
     * Return an array of ISO script codes whose characters can be encoded with this 
     * character set.
     * 
     * @returns {Array.<string>} an array of ISO script codes supported by this charset
     */
    getScripts: function() {
    	return this.info.scripts;
    }
};

module.exports = Charset;