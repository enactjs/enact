/*
 * Country.js - Country class to get country name corresponding to country code in locale assigned
 *
 * Copyright © 2017, LGE
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

// !depends ilib.js Utils.js Locale.js LocaleInfo.js ResBundle.js

// !data ctryreverse

var ilib = require("./ilib.js");
var Utils = require("./Utils.js");
var Locale = require("./Locale.js");
var LocaleInfo = require("./LocaleInfo.js");
var ResBundle = require("./ResBundle.js");

/**
 * @class
 * Create a new country information instance. Instances of this class encode
 * information about country name.<p>
 *
 * The options can contain any of the following properties:
 *
 * <ul>
 * <li><i>locale</i> - specify the locale for this instance. Country names are provided
 * in the language of this locale.
 *
 * <li><i>onLoad</i> - a callback function to call when the country name data is fully
 * loaded. When the onLoad option is given, this class will attempt to
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
 * If the locale is not set, the default locale(en-US) will be used.<p>
 *
 * @constructor
 * @param options {Object} a set of properties to govern how this instance is constructed.
 */
var Country = function (options) {
	var sync = true,
	    loadParams = undefined,
	    locale, localeinfo;

	if (options) {
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? new Locale(options.locale) : options.locale;
		}
		if (typeof(options.sync) !== 'undefined') {
			sync = options.sync;
		}
		if (options.loadParams) {
			loadParams = options.loadParams;
		}
	}

	this.locale = this.locale || new Locale();
	new LocaleInfo(this.locale, {
		sync: sync,
		loadParams: loadParams,
		onLoad: ilib.bind(this, function (li) {
			this.locinfo = li;
			if (this.locinfo.getRegionName() === undefined) {
				locale = 'en-US';
			} else {
				locale = this.locale;
			}

			if (!this.codeToCountry) {
				Utils.loadData({
					name: "ctryreverse.json",
					object: Country,
					locale: locale,
					sync: sync,
					loadParams: loadParams,
					callback: ilib.bind(this, function(countries) {
						this.codeToCountry = countries;
						this._calculateCountryToCode();
						if (options && typeof(options.onLoad) === 'function') {
							options.onLoad(this);
						}
					})
				});
			} else {
				this._calculateCountryToCode();
				if (options && typeof(options.onLoad) === 'function') {
					options.onLoad(this);
				}
			}
		})
	});
};

/**
 * Return an array of the ids for all ISO 3166-1 alpha-2 code that
 * this copy of ilib knows about.
 *
 * @static
 * @return {Object} an object of country code that this copy of ilib knows about.
 */
Country.getAvailableCode = function() {
	var countries = new ResBundle({
			name: "ctryreverse"
		}).getResObj();

	return Object.keys(countries);
};

/**
 * Return an array of country names that this copy of ilib knows about.
 *
 * @static
 * @return {Object} an object of country code that this copy of ilib knows about.
 */
Country.getAvailableCountry = function() {
	var ret = [],
		code,
		countries = new ResBundle({
			name: "ctryreverse"
		}).getResObj();

	for (code in countries) {
		if (code && countries[code]) {
			ret.push(countries[code]);
		}
	}

	return ret;
};

Country.prototype = {
	/**
	 * @private
	 */
	_calculateCountryToCode: function() {
		var temp = this.codeToCountry,
				code;

		this.countryToCode = {};

		for (code in temp) {
			if (code && temp[code]) {
				this.countryToCode[temp[code]] = code;
			}
		}
	},

	/**
	 * Return the country code corresponding to the country name given.
	 * If the country name is given, but it is not found in the list of known countries, this
	 * method will throw an exception.
	 * @param {string} ctryname The country name in the language of the locale of this instance
	 * @return {string} the country code corresponding to the country name
	 * @throws "Country xx is unknown" when the given country name is not in the list of
	 * known country names. xx is replaced with the requested country name.
	 */
	getCode: function (ctryname) {
		if (!this.countryToCode[ctryname]) {
			throw "Country " + ctryname + " is unknown";
		}
		return this.countryToCode[ctryname];
	},

	/**
	 * Return the country name corresponding to the country code given.
	 * If the code is given, but it is not found in the list of known countries, this
	 * method will throw an exception.
	 * @param {string} code The country code to get the country name
	 * @return {string} the country name in the language of the locale of this instance
	 * @throws "Country xx is unknown" when the given country code is not in the list of
	 * known country codes. xx is replaced with the requested country code.
	 */
	getName: function (code) {
		if (!this.codeToCountry[code]) {
			throw "Country " + code + " is unknown";
		}
		return this.codeToCountry[code];
	},

	/**
	 * Return the locale for this country. If the options to the constructor
	 * included a locale property in order to find the country that is appropriate
	 * for that locale, then the locale is returned here. If the options did not
	 * include a locale, then this method returns undefined.
	 * @return {Locale} the locale used in the constructor of this instance,
	 * or undefined if no locale was given in the constructor
	 */
	getLocale: function () {
		return this.locale;
	}
};

module.exports = Country;
