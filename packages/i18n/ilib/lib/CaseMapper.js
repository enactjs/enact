/*
 * caseMapper.js - define upper- and lower-case mapper
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

// !depends Locale.js IString.js

var ilib = require("./ilib.js");

var Locale = require("./Locale.js");
var IString = require("./IString.js");

/**
 * @class
 * Create a new string mapper instance that maps strings to upper or
 * lower case. This mapping will work for any string as characters 
 * that have no case will be returned unchanged.<p>
 * 
 * The options may contain any of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> - locale to use when loading the mapper. Some maps are 
 * locale-dependent, and this locale selects the right one. Default if this is
 * not specified is the current locale.
 * 
 * <li><i>direction</i> - "toupper" for upper-casing, or "tolower" for lower-casing.
 * Default if not specified is "toupper".
 * </ul>
 * 
 * 
 * @constructor
 * @param {Object=} options options to initialize this mapper 
 */
var CaseMapper = function (options) {
	this.up = true;
	this.locale = new Locale();
	
	if (options) {
		if (typeof(options.locale) !== 'undefined') {
			this.locale = (typeof(options.locale) === 'string') ? new Locale(options.locale) : options.locale;
		}
		
		this.up = (!options.direction || options.direction === "toupper");
	}

	this.mapData = this.up ? {
		"ß": "SS",		// German
		'ΐ': 'Ι',		// Greek
		'ά': 'Α',
		'έ': 'Ε',
		'ή': 'Η',
		'ί': 'Ι',
		'ΰ': 'Υ',
		'ϊ': 'Ι',
		'ϋ': 'Υ',
		'ό': 'Ο',
		'ύ': 'Υ',
		'ώ': 'Ω',
		'Ӏ': 'Ӏ',		// Russian and slavic languages
		'ӏ': 'Ӏ'
	} : {
		'Ӏ': 'Ӏ'		// Russian and slavic languages
	};

	switch (this.locale.getLanguage()) {
		case "az":
		case "tr":
		case "crh":
		case "kk":
		case "krc":
		case "tt":
			var lower = "iı";
			var upper = "İI";
			this._setUpMap(lower, upper);
			break;
	}
	
	if (ilib._getBrowser() === "ie" || ilib._getBrowser() === "Edge") {
		// IE is missing these mappings for some reason
		if (this.up) {
			this.mapData['ς'] = 'Σ';
		}
		this._setUpMap("ⲁⲃⲅⲇⲉⲋⲍⲏⲑⲓⲕⲗⲙⲛⲝⲟⲡⲣⲥⲧⲩⲫⲭⲯⲱⳁⳉⳋ", "ⲀⲂⲄⲆⲈⲊⲌⲎⲐⲒⲔⲖⲘⲚⲜⲞⲠⲢⲤⲦⲨⲪⲬⲮⲰⳀⳈⳊ"); // Coptic
		// Georgian Nuskhuri <-> Asomtavruli
		this._setUpMap("ⴀⴁⴂⴃⴄⴅⴆⴇⴈⴉⴊⴋⴌⴍⴎⴏⴐⴑⴒⴓⴔⴕⴖⴗⴘⴙⴚⴛⴜⴝⴞⴟⴠⴡⴢⴣⴤⴥ", "ႠႡႢႣႤႥႦႧႨႩႪႫႬႭႮႯႰႱႲႳႴႵႶႷႸႹႺႻႼႽႾႿჀჁჂჃჄჅ");	
	}
};

CaseMapper.prototype = {
	/** 
	 * @private 
	 */
	_charMapper: function(string) {
		if (!string) {
			return string;
		}
		var input = (typeof(string) === 'string') ? new IString(string) : string.toString();
		var ret = "";
		var it = input.charIterator();
		var c;
		
		while (it.hasNext()) {
			c = it.next();
			if (!this.up && c === 'Σ') {
				if (it.hasNext()) {
					c = it.next();
					var code = c.charCodeAt(0);
					// if the next char is not a greek letter, this is the end of the word so use the
					// final form of sigma. Otherwise, use the mid-word form.
					ret += ((code < 0x0388 && code !== 0x0386) || code > 0x03CE) ? 'ς' : 'σ';
					ret += c.toLowerCase();
				} else {
					// no next char means this is the end of the word, so use the final form of sigma
					ret += 'ς';
				}
			} else {
				if (this.mapData[c]) {
					ret += this.mapData[c];
				} else {
					ret += this.up ? c.toUpperCase() : c.toLowerCase();
				}
			}
		}
		
		return ret;
	},

	/** @private */
	_setUpMap: function(lower, upper) {
		var from, to;
		if (this.up) {
			from = lower;
			to = upper;
		} else {
			from = upper;
			to = lower;
		}
		for (var i = 0; i < upper.length; i++) {
			this.mapData[from[i]] = to[i];
		}
	},

	/**
	 * Return the locale that this mapper was constructed with. 
	 * @returns {Locale} the locale that this mapper was constructed with
	 */
	getLocale: function () {
		return this.locale;
	},
		
	/**
	 * Map a string to lower case in a locale-sensitive manner.
	 * 
	 * @param {string|undefined} string
	 * @return {string|undefined}
	 */
	map: function (string) {
		return this._charMapper(string);
	}
};

module.exports = CaseMapper;
