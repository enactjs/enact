/*
 * Address.js - Represent a mailing address
 * 
 * Copyright © 2013-2015, JEDLSoft
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

/*globals console RegExp */

/* !depends 
ilib.js
Utils.js
JSUtils.js
Locale.js 
isIdeo.js 
isAscii.js
isDigit.js
IString.js
*/

// !data address countries nativecountries ctrynames

var ilib = require("./ilib.js");
var Utils = require("./Utils.js");
var JSUtils = require("./JSUtils.js");
var Locale = require("./Locale.js");
var CType = require("./CType.js");
var isIdeo = require("./isIdeo.js");
var isAscii = require("./isAscii.js");
var isDigit = require("./isDigit.js");
var IString = require("./IString.js");

/**
 * @class
 * Create a new Address instance and parse a physical address.<p>
 * 
 * This function parses a physical address written in a free-form string. 
 * It returns an object with a number of properties from the list below 
 * that it may have extracted from that address.<p>
 * 
 * The following is a list of properties that the algorithm will return:<p>
 * 
 * <ul>
 * <li><i>streetAddress</i>: The street address, including house numbers and all.
 * <li><i>locality</i>: The locality of this address (usually a city or town). 
 * <li><i>region</i>: The region where the locality is located. In the US, this
 * corresponds to states. In other countries, this may be provinces,
 * cantons, prefectures, etc. In some smaller countries, there are no
 * such divisions.
 * <li><i>postalCode</i>: Country-specific code for expediting mail. In the US, 
 * this is the zip code.
 * <li><i>country</i>: The country of the address.
 * <li><i>countryCode</i>: The ISO 3166 2-letter region code for the destination
 * country in this address.
 * </ul> 
 * 
 * The above properties will not necessarily appear in the instance. For 
 * any individual property, if the free-form address does not contain 
 * that property or it cannot be parsed out, the it is left out.<p>
 * 
 * The options parameter may contain any of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> - locale or localeSpec to use to parse the address. If not 
 * specified, this function will use the current ilib locale
 * 
 * <li><i>onLoad</i> - a callback function to call when the address info for the
 * locale is fully loaded and the address has been parsed. When the onLoad 
 * option is given, the address object 
 * will attempt to load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the 
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two. 
 * 
 * <li><i>sync</i> - tell whether to load any missing locale data synchronously or 
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while. 
 *
 * <li><i>loadParams</i> - an object containing parameters to pass to the 
 * loader callback function when locale data is missing. The parameters are not
 * interpretted or modified in any way. They are simply passed along. The object 
 * may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
 * </ul>
 * 
 * When an address cannot be parsed properly, the entire address will be placed
 * into the streetAddress property.<p>
 * 
 * When the freeformAddress is another Address, this will act like a copy
 * constructor.<p>
 * 
 * 
 * @constructor
 * @param {string|Address} freeformAddress free-form address to parse, or a
 * javascript object containing the fields
 * @param {Object} options options to the parser
 */
var Address = function (freeformAddress, options) {
	var address;

	if (!freeformAddress) {
		return undefined;
	}

	this.sync = true;
	this.loadParams = {};
	
	if (options) {
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? new Locale(options.locale) : options.locale;
		}
		
		if (typeof(options.sync) !== 'undefined') {
			this.sync = (options.sync == true);
		}
		
		if (options.loadParams) {
			this.loadParams = options.loadParams;
		}
	}

	this.locale = this.locale || new Locale();
	// initialize from an already parsed object
	if (typeof(freeformAddress) === 'object') {
		/**
		 * The street address, including house numbers and all.
		 * @type {string|undefined} 
		 */
		this.streetAddress = freeformAddress.streetAddress;
		/**
		 * The locality of this address (usually a city or town).
		 * @type {string|undefined} 
		 */
		this.locality = freeformAddress.locality;
		/**
		 * The region (province, canton, prefecture, state, etc.) where the address is located.
		 * @type {string|undefined} 
		 */
		this.region = freeformAddress.region;
		/**
		 * Country-specific code for expediting mail. In the US, this is the zip code.
		 * @type {string|undefined} 
		 */
		this.postalCode = freeformAddress.postalCode;
		/**
		 * Optional city-specific code for a particular post office, used to expidite
		 * delivery.
		 * @type {string|undefined} 
		 */
		this.postOffice = freeformAddress.postOffice;
		/**
		 * The country of the address.
		 * @type {string|undefined}
		 */
		this.country = freeformAddress.country;
		if (freeformAddress.countryCode) {
			/**
			 * The 2 or 3 letter ISO 3166 region code for the destination country in this address.
			 * @type {string} 
			 */
			this.countryCode = freeformAddress.countryCode;
		}
		if (freeformAddress.format) {
			/**
			 * private
			 * @type {string}
			 */
			this.format = freeformAddress.format;
		}
		return this;
	}

	address = freeformAddress.replace(/[ \t\r]+/g, " ").trim();
	address = address.replace(/[\s\n]+$/, "");
	address = address.replace(/^[\s\n]+/, "");
	//console.log("\n\n-------------\nAddress is '" + address + "'");
	
	this.lines = address.split(/[,，\n]/g);
	this.removeEmptyLines(this.lines);
	
	isAscii._init(this.sync, this.loadParams, ilib.bind(this, function() {
		isIdeo._init(this.sync, this.loadParams, ilib.bind(this, function() {
			isDigit._init(this.sync, this.loadParams, ilib.bind(this, function() {
				if (typeof(ilib.data.nativecountries) === 'undefined') {
					Utils.loadData({
						object: "Address",
						name: "nativecountries.json", // countries in their own language 
						locale: "-", // only need to load the root file 
						nonlocale: true,
						sync: this.sync, 
						loadParams: this.loadParams, 
						callback: ilib.bind(this, function(nativecountries) {
							ilib.data.nativecountries = nativecountries;
							this._loadCountries(options && options.onLoad);
						})
					});
				} else {
					this._loadCountries(options && options.onLoad);
				}
			}));
		}));
	}));
};

/** @protected */
Address.prototype = {
	/**
	 * @private
	 */
	_loadCountries: function(onLoad) {
		if (typeof(ilib.data.countries) === 'undefined') {
			Utils.loadData({
				object: "Address",
				name: "countries.json", // countries in English
				locale: "-", // only need to load the root file
				nonlocale: true,
				sync: this.sync, 
				loadParams: this.loadParams, 
				callback: ilib.bind(this, function(countries) {
					ilib.data.countries = countries;
					this._loadCtrynames(onLoad);
				})
			});
		} else {
			this._loadCtrynames(onLoad);
		}
	},

	/**
	 * @private
	 */
	_loadCtrynames: function(onLoad) {
		Utils.loadData({
			name: "ctrynames.json", 
			object: "Address", 
			locale: this.locale,
			sync: this.sync, 
			loadParams: this.loadParams, 
			callback: ilib.bind(this, function(ctrynames) {
				this._determineDest(ctrynames, onLoad);
			})
		});
	},
	
	/**
	 * @private
	 * @param {Object?} ctrynames
	 */
	_findDest: function (ctrynames) {
		var match;
		
		for (var countryName in ctrynames) {
			if (countryName && countryName !== "generated") {
				// find the longest match in the current table
				// ctrynames contains the country names mapped to region code
				// for efficiency, only test for things longer than the current match
				if (!match || match.text.length < countryName.length) {
					var temp = this._findCountry(countryName);
					if (temp) {
						match = temp;
						this.country = match.text;
						this.countryCode = ctrynames[countryName];
					}
				}
			}
		}
		return match;
	},
	
	/**
	 * @private
	 * @param {Object?} localizedCountries
	 * @param {function(Address):undefined} callback
	 */
	_determineDest: function (localizedCountries, callback) {
		var match;
		
		/*
		 * First, find the name of the destination country, as that determines how to parse
		 * the rest of the address. For any address, there are three possible ways 
		 * that the name of the country could be written:
		 * 1. In the current language
		 * 2. In its own native language
		 * 3. In English
		 * We'll try all three.
		 */
		var tables = [];
		if (localizedCountries) {
			tables.push(localizedCountries);
		}
		tables.push(ilib.data.nativecountries);
		tables.push(ilib.data.countries);
		
		for (var i = 0; i < tables.length; i++) {
			match = this._findDest(tables[i]);
			
			if (match) {
				this.lines[match.line] = this.lines[match.line].substring(0, match.start) + this.lines[match.line].substring(match.start + match.text.length);

				this._init(callback);
				return;
			}
		}
		
		// no country, so try parsing it as if we were in the same country
		this.country = undefined;
		this.countryCode = this.locale.getRegion();
		this._init(callback);
	},

	/**
	 * @private
	 * @param {function(Address):undefined} callback
	 */
	_init: function(callback) {
		Utils.loadData({
			object: "Address", 
			locale: new Locale(this.countryCode), 
			name: "address.json", 
			sync: this.sync, 
			loadParams: this.loadParams,
			callback: ilib.bind(this, function(info) {
				if (!info || JSUtils.isEmpty(info)) {
					// load the "unknown" locale instead
					Utils.loadData({
						object: "Address", 
						locale: new Locale("XX"), 
						name: "address.json", 
						sync: this.sync, 
						loadParams: this.loadParams,
						callback: ilib.bind(this, function(info) {
							this.info = info;
							this._parseAddress();
							if (typeof(callback) === 'function') {
								callback(this);
							}	
						})
					});
				} else {
					this.info = info;
					this._parseAddress();
					if (typeof(callback) === 'function') {
						callback(this);
					}
				}
			})
		});
	},

	/**
	 * @private
	 */
	_parseAddress: function() {
		// clean it up first
		var i, 
			asianChars = 0, 
			latinChars = 0,
			startAt,
			infoFields,
			field,
			pattern,
			matchFunction,
			match,
			fieldNumber;
		
		// for locales that support both latin and asian character addresses, 
		// decide if we are parsing an asian or latin script address
		if (this.info && this.info.multiformat) {
			for (var j = 0; j < this.lines.length; j++) {
				var line = new IString(this.lines[j]);
				var it = line.charIterator();
				while (it.hasNext()) {
					var c = it.next();
					if (isIdeo(c) || 
					        CType.withinRange(c, "hangul") || 
					        CType.withinRange(c, 'katakana') ||
					        CType.withinRange(c, 'hiragana') ||
					        CType.withinRange(c, 'bopomofo')) {
						asianChars++;
					} else if (isAscii(c) && !isDigit(c)) {
						latinChars++;
					}
				}
			}
			
			this.format = (asianChars >= latinChars) ? "asian" : "latin";
			startAt = this.info.startAt[this.format];
			infoFields = this.info.fields[this.format];
			// //console.log("multiformat locale: format is now " + this.format);
		} else {
			startAt = (this.info && this.info.startAt) || "end";
			infoFields = this.info.fields;
		}
		this.compare = (startAt === "end") ? this.endsWith : this.startsWith;
		
		//console.log("this.lines is: " + JSON.stringify(this.lines));
		
		for (i = 0; i < infoFields.length && this.lines.length > 0; i++) {
			field = infoFields[i];
			this.removeEmptyLines(this.lines);
			//console.log("Searching for field " + field.name);
			if (field.pattern) {
				if (typeof(field.pattern) === 'string') {
					pattern = new RegExp(field.pattern, "img");
					matchFunction = this.matchRegExp;
				} else {
					pattern = field.pattern;
					matchFunction = this.matchPattern;
				}
					
				switch (field.line) {
				case 'startAtFirst':
					for (fieldNumber = 0; fieldNumber < this.lines.length; fieldNumber++) {
						match = matchFunction(this, this.lines[fieldNumber], pattern, field.matchGroup, startAt);
						if (match) {
							break;
						}
					}
					break;
				case 'startAtLast':
					for (fieldNumber = this.lines.length-1; fieldNumber >= 0; fieldNumber--) {
						match = matchFunction(this, this.lines[fieldNumber], pattern, field.matchGroup, startAt);
						if (match) {
							break;
						}
					}
					break;
				case 'first':
					fieldNumber = 0;
					match = matchFunction(this, this.lines[fieldNumber], pattern, field.matchGroup, startAt);
					break;
				case 'last':
				default:
					fieldNumber = this.lines.length - 1;
					match = matchFunction(this, this.lines[fieldNumber], pattern, field.matchGroup, startAt);
					break;
				}
				if (match) {
					// //console.log("found match for " + field.name + ": " + JSON.stringify(match));
					// //console.log("remaining line is " + match.line);
					this.lines[fieldNumber] = match.line;
					this[field.name] = match.match;
				}
			} else {
				// if nothing is given, default to taking the whole field
				this[field.name] = this.lines.splice(fieldNumber,1)[0].trim();
				//console.log("typeof(this[field.name]) is " + typeof(this[field.name]) + " and value is " + JSON.stringify(this[field.name]));
			}
		}
			
		// all the left overs go in the street address field
		this.removeEmptyLines(this.lines);
		if (this.lines.length > 0) {
			//console.log("this.lines is " + JSON.stringify(this.lines) + " and splicing to get streetAddress");
			// Korea uses spaces between words, despite being an "asian" locale
			var joinString = (this.info.joinString && this.info.joinString[this.format]) || ((this.format && this.format === "asian") ? "" : ", ");
			this.streetAddress = this.lines.join(joinString).trim();
		}
		
		this.lines = undefined;
		//console.log("final result is " + JSON.stringify(this));
	},
	
	/**
	 * @protected
	 * Find the named country either at the end or the beginning of the address.
	 */
	_findCountry: function(name) {
		var start = -1, match, line = 0;
		
		if (this.lines.length > 0) {
			start = this.startsWith(this.lines[line], name);
			if (start === -1) {
				line = this.lines.length-1;
				start = this.endsWith(this.lines[line], name);
			}
			if (start !== -1) {
				match = {
					text: this.lines[line].substring(start, start + name.length),
					line: line,
					start: start
				};
			}
		}
		
		return match;
	},
	
	endsWith: function (subject, query) {
		var start = subject.length-query.length,
			i,
			pat;
		//console.log("endsWith: checking " + query + " against " + subject);
		for (i = 0; i < query.length; i++) {
			// TODO: use case mapper instead of toLowerCase()
			if (subject.charAt(start+i).toLowerCase() !== query.charAt(i).toLowerCase()) {
				return -1;
			}
		}
		if (start > 0) {
			pat = /\s/;
			if (!pat.test(subject.charAt(start-1))) {
				// make sure if we are not at the beginning of the string, that the match is 
				// not the end of some other word
				return -1;
			}
		}
		return start;
	},
	
	startsWith: function (subject, query) {
		var i;
		// //console.log("startsWith: checking " + query + " against " + subject);
		for (i = 0; i < query.length; i++) {
			// TODO: use case mapper instead of toLowerCase()
			if (subject.charAt(i).toLowerCase() !== query.charAt(i).toLowerCase()) {
				return -1;
			}
		}
		return 0;
	},
	
	removeEmptyLines: function (arr) {
		var i = 0;
		
		while (i < arr.length) {
			if (arr[i]) {
				arr[i] = arr[i].trim();
				if (arr[i].length === 0) {
					arr.splice(i,1);
				} else {
					i++;
				}
			} else {
				arr.splice(i,1);
			}
		}
	},
	
	matchRegExp: function(address, line, expression, matchGroup, startAt) {
		var lastMatch,
			match,
			ret = {},
			last;
		
		//console.log("searching for regexp " + expression.source + " in line " + line);
		
		match = expression.exec(line);
		if (startAt === 'end') {
			while (match !== null && match.length > 0) {
				//console.log("found matches " + JSON.stringify(match));
				lastMatch = match;
				match = expression.exec(line);
			}
			match = lastMatch;
		}
		
		if (match && match !== null) {
			//console.log("found matches " + JSON.stringify(match));
			matchGroup = matchGroup || 0;
			if (match[matchGroup] !== undefined) {
				ret.match = match[matchGroup].trim();
				ret.match = ret.match.replace(/^\-|\-+$/, '');
				ret.match = ret.match.replace(/\s+$/, '');
				last = (startAt === 'end') ? line.lastIndexOf(match[matchGroup]) : line.indexOf(match[matchGroup]); 
				//console.log("last is " + last);
				ret.line = line.slice(0,last);
				if (address.format !== "asian") {
					ret.line += " ";
				}
				ret.line += line.slice(last+match[matchGroup].length);
				ret.line = ret.line.trim();
				//console.log("found match " + ret.match + " from matchgroup " + matchGroup + " and rest of line is " + ret.line);
				return ret;
			}
		//} else {
			//console.log("no match");
		}
		
		return undefined;
	},
	
	matchPattern: function(address, line, pattern, matchGroup) {
		var start,
			j,
			ret = {};
		
		//console.log("searching in line " + line);
		
		// search an array of possible fixed strings
		//console.log("Using fixed set of strings.");
		for (j = 0; j < pattern.length; j++) {
			start = address.compare(line, pattern[j]); 
			if (start !== -1) {
                            ret.match = line.substring(start, start+pattern[j].length);
                            if (start !== 0) {
                                ret.line = line.substring(0,start).trim();
                            } else {
                                ret.line = line.substring(pattern[j].length).trim();
                            }
				//console.log("found match " + ret.match + " and rest of line is " + ret.line);
                            return ret;
			}
		}
		
		return undefined;
	}
};

module.exports = Address;
