/*
 * Mapper.js - ilib string mapper class definition
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

// !depends ilib.js IString.js Utils.js Locale.js

var ilib = require("./ilib.js");
var Utils = require("./Utils.js");

var Locale = require("./Locale.js");
var IString = require("./IString.js");

/**
 * @class
 * Create a new string mapper instance. <p>
 * 
 * The options may contain any of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> - locale to use when loading the mapper. Some maps are 
 * locale-dependent, and this locale selects the right one. Default if this is
 * not specified is the current locale.
 * 
 * <li><i>name</i> - the name of the map to load
 * 
 * <li><i>mapFunction</i> - specify an algorithmic mapping function to use if 
 * the mapper does not have an explicit mapping for a character. The idea is
 * to save disk and memory when algorithmic mapping can be done for some of 
 * the characters, but not others. The exceptions can go into the json file,
 * and the characters that conform to the rule can be mapped algorithmically.
 * The map function should take a string containing 1 character as a parameter
 * and should return a string containing one or more characters. If the
 * character is outside of the range that can be mapped, it should be returned
 * unchanged. 
 * 
 * <li><i>onLoad</i> - a callback function to call when this object is fully 
 * loaded. When the onLoad option is given, this object will attempt to
 * load any missing locale data using the ilib loader callback.
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
 * 
 * @constructor
 * @param {Object=} options options to initialize this string mapper 
 */
var StringMapper = function (options) {
	var sync = true,
		loadParams = undefined;

	this.locale = new Locale();
	this.mapData = {};
	this.mapFunction = undefined;
	
	if (options) {
		if (typeof(options.locale) !== 'undefined') {
			this.locale = (typeof(options.locale) === 'string') ? new Locale(options.locale) : options.locale;
		}
		
		if (typeof(options.name) !== 'undefined') {
			this.name = options.name;
		}

		if (typeof(options.mapFunction) === 'function') {
			this.mapFunction = options.mapFunction;
		}

		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync == true);
		}
		
		if (typeof(options.loadParams) !== 'undefined') {
			loadParams = options.loadParams;
		}
	}
	
	Utils.loadData({
		object: "StringMapper", 
		locale: this.locale,
		name: this.name + ".json", 
		sync: sync,
		loadParams: loadParams, 
		callback: ilib.bind(this, function (map) {
			if (!map) {
				var spec = this.locale.getSpec().replace(/-/g, "_");
				ilib.data.cache.StringMapper[spec] = {};
			}
			this.mapData = map || {};
			if (options && typeof(options.onLoad) === 'function') {
				options.onLoad(this);
			}
		})
	});
};

StringMapper.prototype = {
	/**
	 * Return the locale that this mapper was constructed. 
	 * @returns
	 */
	getLocale: function () {
		return this.locale;
	},
		
	getName: function () {
		return this.name;
	},
	
	/**
	 * Map a string using the mapping defined in the constructor. This method
	 * iterates through all characters in the string and maps them one-by-one.
	 * If a particular character has a mapping, the mapping result will be 
	 * added to the output. If there is no mapping, but there is a mapFunction
	 * defined, the mapFunction results will be added to the result. Otherwise,
	 * the original character from the input string will be added to the result.
	 * 
	 * @param {string|IString|undefined} string
	 * @return {string|IString|undefined}
	 */
	map: function (string) {
		var input;
		if (!string) {
			return string;
		}
		if (typeof(string) === 'string') {
			input = new IString(string);
		} else {
			input = string.toString();
		}
		var ret = "";
		var it = input.charIterator();
		var c;
		
		while (it.hasNext()) {
			c = it.next();
			if (this.mapData && this.mapData[c]) {
				ret += this.mapData[c];
			} else if (this.mapFunction) {
				ret += this.mapFunction(c);
			} else {
				ret += c;
			}
		}
		
		return ret;
	}	
};

module.exports = StringMapper;