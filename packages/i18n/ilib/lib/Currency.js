/*
 * Currency.js - Currency definition
 * 
 * Copyright © 2012-2015, JEDLSoft
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

// !depends ilib.js Utils.js Locale.js LocaleInfo.js

// !data currency

var ilib = require("./ilib.js");
var Utils = require("./Utils.js");
var Locale = require("./Locale.js");
var LocaleInfo = require("./LocaleInfo.js");
var ResBundle = require("./ResBundle.js");

/**
 * @class
 * Create a new currency information instance. Instances of this class encode 
 * information about a particular currency.<p>
 * 
 * Note: that if you are looking to format currency for display, please see
 * the number formatting class {NumFmt}. This class only gives information
 * about currencies.<p> 
 * 
 * The options can contain any of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> - specify the locale for this instance
 * <li><i>code</i> - find info on a specific currency with the given ISO 4217 code 
 * <li><i>sign</i> - search for a currency that uses this sign
 * <li><i>onLoad</i> - a callback function to call when the currency data is fully 
 * loaded. When the onLoad option is given, this class will attempt to
 * load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the 
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two. 
 * <li><i>sync</i> - tell whether to load any missing locale data synchronously or 
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while.
 * <li><i>loadParams</i> - an object containing parameters to pass to the 
 * loader callback function when locale data is missing. The parameters are not
 * interpretted or modified in any way. They are simply passed along. The object 
 * may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
 * </ul>
 * 
 * When searching for a currency by its sign, this class cannot guarantee 
 * that it will return info about a specific currency. The reason is that currency 
 * signs are sometimes shared between different currencies and the sign is 
 * therefore ambiguous. If you need a 
 * guarantee, find the currency using the code instead.<p>
 * 
 * The way this class finds a currency by sign is the following. If the sign is 
 * unambiguous, then
 * the currency is returned. If there are multiple currencies that use the same
 * sign, and the current locale uses that sign, then the default currency for
 * the current locale is returned. If there are multiple, but the current locale
 * does not use that sign, then the currency with the largest circulation is
 * returned. For example, if you are in the en-GB locale, and the sign is "$",
 * then this class will notice that there are multiple currencies with that
 * sign (USD, CAD, AUD, HKD, MXP, etc.) Since "$" is not used in en-GB, it will 
 * pick the one with the largest circulation, which in this case is the US Dollar
 * (USD).<p>
 * 
 * If neither the code or sign property is set, the currency that is most common 
 * for the locale
 * will be used instead. If the locale is not set, the default locale will be used.
 * If the code is given, but it is not found in the list of known currencies, this
 * constructor will throw an exception. If the sign is given, but it is not found,
 * this constructor will default to the currency for the current locale. If both
 * the code and sign properties are given, then the sign property will be ignored
 * and only the code property used. If the locale is given, but it is not a known
 * locale, this class will default to the default locale instead.<p>
 * 
 * 
 * @constructor
 * @param options {Object} a set of properties to govern how this instance is constructed.
 * @throws "currency xxx is unknown" when the given currency code is not in the list of 
 * known currencies. xxx is replaced with the requested code.
 */
var Currency = function (options) {
	if (options) {
		if (options.code) {
			this.code = options.code;
		}
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? new Locale(options.locale) : options.locale;
		}
		if (options.sign) {
			this.sign = options.sign;
		}
		if (options.loadParams) {
			this.loadParams = options.loadParams;
		}
	} else {
	    options = {sync: true};
	}
	
    if (typeof(options.sync) === 'undefined') {
        options.sync = true;
    }
	
	this.locale = this.locale || new Locale();
	if (typeof(ilib.data.currency) === 'undefined') {
		Utils.loadData({
			name: "currency.json",
			object: "Currency", 
			locale: "-",
			sync: this.sync, 
			loadParams: this.loadParams, 
			callback: ilib.bind(this, function(currency) {
				ilib.data.currency = currency;
				this._loadLocinfo(options);
			})
		});
	} else {
		this._loadLocinfo(options);
	}
};

/**
 * Return an array of the ids for all ISO 4217 currencies that
 * this copy of ilib knows about.
 * 
 * @static
 * @return {Array.<string>} an array of currency ids that this copy of ilib knows about.
 */
Currency.getAvailableCurrencies = function() {
	var ret = [],
		cur,
		currencies = new ResBundle({
			name: "currency"
		}).getResObj();
	
	for (cur in currencies) {
		if (cur && currencies[cur]) {
			ret.push(cur);
		}
	}
	
	return ret;
};

Currency.prototype = {
	/**
	 * @private
	 */
	_loadLocinfo: function(options) {
		new LocaleInfo(this.locale, {
		    sync: options.sync,
		    loadParams: options.loadParams,
			onLoad: ilib.bind(this, function (li) {
			    var currInfo;

			    this.locinfo = li;
			    if (this.code) {
			        currInfo = ilib.data.currency[this.code];
			        if (!currInfo) {
			            if (options.sync) {
			                throw "currency " + this.code + " is unknown";
			            } else if (typeof(options.onLoad) === "function") {
			                options.onLoad(undefined);
			                return;
			            }
			        }
			    } else if (this.sign) {
			        currInfo = ilib.data.currency[this.sign]; // maybe it is really a code...
			        if (typeof(currInfo) !== 'undefined') {
			            this.code = this.sign;
			        } else {
			            this.code = this.locinfo.getCurrency();
			            currInfo = ilib.data.currency[this.code];
			            if (currInfo.sign !== this.sign) {
			                // current locale does not use the sign, so search for it
			                for (var cur in ilib.data.currency) {
			                    if (cur && ilib.data.currency[cur]) {
			                        currInfo = ilib.data.currency[cur];
			                        if (currInfo.sign === this.sign) {
			                            // currency data is already ordered so that the currency with the
			                            // largest circulation is at the beginning, so all we have to do
			                            // is take the first one in the list that matches
			                            this.code = cur;
			                            break;
			                        }
			                    }
			                }
			            }
			        }
			    }

			    if (!currInfo || !this.code) {
			        this.code = this.locinfo.getCurrency();
			        currInfo = ilib.data.currency[this.code];
			    }

			    this.name = currInfo.name;
			    this.fractionDigits = currInfo.decimals;
			    this.sign = currInfo.sign;

				if (typeof(options.onLoad) === 'function') {
				    options.onLoad(this);
				}
			})
		});
	},
	
	/**
	 * Return the ISO 4217 currency code for this instance.
	 * @return {string} the ISO 4217 currency code for this instance
	 */
	getCode: function () {
		return this.code;
	},
	
	/**
	 * Return the default number of fraction digits that is typically used
	 * with this type of currency.
	 * @return {number} the number of fraction digits for this currency
	 */
	getFractionDigits: function () {
		return this.fractionDigits;
	},
	
	/**
	 * Return the sign commonly used to represent this currency.
	 * @return {string} the sign commonly used to represent this currency
	 */
	getSign: function () {
		return this.sign;
	},
	
	/**
	 * Return the name of the currency in English.
	 * @return {string} the name of the currency in English
	 */
	getName: function () {
		return this.name;
	},
	
	/**
	 * Return the locale for this currency. If the options to the constructor 
	 * included a locale property in order to find the currency that is appropriate
	 * for that locale, then the locale is returned here. If the options did not
	 * include a locale, then this method returns undefined.
	 * @return {Locale} the locale used in the constructor of this instance,
	 * or undefined if no locale was given in the constructor
	 */
	getLocale: function () {
		return this.locale;
	}
};

module.exports = Currency;
