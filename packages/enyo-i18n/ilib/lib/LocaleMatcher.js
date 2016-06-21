/*
 * LocaleMatcher.js - Locale matcher definition
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

// !depends ilib.js Locale.js Utils.js
// !data likelylocales

var ilib = require("./ilib.js");
var Utils = require("./Utils.js");
var Locale = require("./Locale.js");

/**
 * @class
 * Create a new locale matcher instance. This is used
 * to see which locales can be matched with each other in
 * various ways.<p>
 * 
 * The options object may contain any of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> - the locale to match
 * 
 * <li><i>onLoad</i> - a callback function to call when the locale matcher object is fully 
 * loaded. When the onLoad option is given, the locale matcher object will attempt to
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
 * @param {Object} options parameters to initialize this matcher 
 */
var LocaleMatcher = function(options) {
	var sync = true,
	    loadParams = undefined;
	
	this.locale = new Locale();
	
	if (options) {
		if (typeof(options.locale) !== 'undefined') {
			this.locale = (typeof(options.locale) === 'string') ? new Locale(options.locale) : options.locale;
		}
		
		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync == true);
		}
		
		if (typeof(options.loadParams) !== 'undefined') {
			loadParams = options.loadParams;
		}
	}

	if (!LocaleMatcher.cache) {
		LocaleMatcher.cache = {};
	}

	if (typeof(ilib.data.likelylocales) === 'undefined') {
		Utils.loadData({
			object: LocaleMatcher, 
			locale: "-", 
			name: "likelylocales.json", 
			sync: sync, 
			loadParams: loadParams, 
			callback: ilib.bind(this, function (info) {
				if (!info) {
					info = {};
					var spec = this.locale.getSpec().replace(/-/g, "_");
					LocaleMatcher.cache[spec] = info;
				}
				/** @type {Object.<string,string>} */
				this.info = info;
				if (options && typeof(options.onLoad) === 'function') {
					options.onLoad(this);
				}
			})
		});
	} else {
		this.info = /** @type {Object.<string,string>} */ ilib.data.likelylocales;
	}
};


LocaleMatcher.prototype = {
	/**
	 * Return the locale used to construct this instance. 
	 * @return {Locale|undefined} the locale for this matcher
	 */
	getLocale: function() {
		return this.locale;
	},
	
	/**
	 * Return an Locale instance that is fully specified based on partial information
	 * given to the constructor of this locale matcher instance. For example, if the locale
	 * spec given to this locale matcher instance is simply "ru" (for the Russian language), 
	 * then it will fill in the missing region and script tags and return a locale with 
	 * the specifier "ru-Cyrl-RU". (ie. Russian language, Cyrillic, Russian Federation).
	 * Any one or two of the language, script, or region parts may be left unspecified,
	 * and the other one or two parts will be filled in automatically. If this
	 * class has no information about the given locale, then the locale of this
	 * locale matcher instance is returned unchanged.
	 * 
	 * @returns {Locale} the most likely completion of the partial locale given
	 * to the constructor of this locale matcher instance
	 */
	getLikelyLocale: function () {
		if (typeof(this.info[this.locale.getSpec()]) === 'undefined') {
			return this.locale;
		}
		
		return new Locale(this.info[this.locale.getSpec()]);
	}
};

module.exports = LocaleMatcher;