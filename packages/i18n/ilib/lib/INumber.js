/*
 * INumber.js - Parse a number in any locale
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

/*
!depends 
ilib.js 
Locale.js 
isDigit.js 
isSpace.js
LocaleInfo.js
Utils.js
JSUtils.js
Currency.js
*/

var ilib = require("./ilib.js");
var Utils = require("./Utils.js");
var JSUtils = require("./JSUtils.js");

var Locale = require("./Locale.js");
var LocaleInfo = require("./LocaleInfo.js");

var CType = require("./CType.js");
var isDigit = require("./isDigit.js");
var isSpace = require("./isSpace.js");

var Currency = require("./Currency.js");


/**
 * @class
 * Parse a string as a number, ignoring all locale-specific formatting.<p>
 * 
 * This class is different from the standard Javascript parseInt() and parseFloat() 
 * functions in that the number to be parsed can have formatting characters in it 
 * that are not supported by those two
 * functions, and it handles numbers written in other locales properly. For example, 
 * if you pass the string "203,231.23" to the parseFloat() function in Javascript, it 
 * will return you the number 203. The INumber class will parse it correctly and 
 * the value() function will return the number 203231.23. If you pass parseFloat() the 
 * string "203.231,23" with the locale set to de-DE, it will return you 203 again. This
 * class will return the correct number 203231.23 again.<p>
 * 
 * The options object may contain any of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> - specify the locale of the string to parse. This is used to
 * figure out what the decimal point character is. If not specified, the default locale
 * for the app or browser is used.
 * <li><i>type</i> - specify whether this string should be interpretted as a number,
 * currency, or percentage amount. When the number is interpretted as a currency
 * amount, the getCurrency() method will return something useful, otherwise it will
 * return undefined. If
 * the number is to be interpretted as percentage amount and there is a percentage sign
 * in the string, then the number will be returned
 * as a fraction from the valueOf() method. If there is no percentage sign, then the 
 * number will be returned as a regular number. That is "58.3%" will be returned as the 
 * number 0.583 but "58.3" will be returned as 58.3. Valid values for this property 
 * are "number", "currency", and "percentage". Default if this is not specified is
 * "number".
 * <li><i>onLoad</i> - a callback function to call when the locale data is fully 
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
 * <p>
 * 
 * This class is named INumber ("ilib number") so as not to conflict with the 
 * built-in Javascript Number class.
 * 
 * @constructor
 * @param {string|number|INumber|Number|undefined} str a string to parse as a number, or a number value
 * @param {Object=} options Options controlling how the instance should be created 
 */
var INumber = function (str, options) {
	var i, stripped = "", 
		sync = true;
	
	this.locale = new Locale();
	this.type = "number";
	
	if (options) {
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? new Locale(options.locale) : options.locale;
		}
		if (options.type) {
			switch (options.type) {
				case "number":
				case "currency":
				case "percentage":
					this.type = options.type;
					break;
				default:
					break;
			}
		}
		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync == true);
		}
	} else {
	    options = {sync: true};
	}
	
	isDigit._init(sync, options.loadParams, ilib.bind(this, function() {
		isSpace._init(sync, options.loadParams, ilib.bind(this, function() {
			new LocaleInfo(this.locale, {
				sync: sync,
				loadParams: options.loadParams,
				onLoad: ilib.bind(this, function (li) {
				    this.li = li;
					this.decimal = li.getDecimalSeparator();
					var nativeDecimal = this.li.getNativeDecimalSeparator() || "";
					
					switch (typeof(str)) {
					case 'string':
						// stripping should work for all locales, because you just ignore all the
						// formatting except the decimal char
						var unary = true; // looking for the unary minus still?
						var lastNumericChar = 0;
						this.str = str || "0";
						i = 0;
						for (i = 0; i < this.str.length; i++) {
							if (unary && this.str.charAt(i) === '-') {
								unary = false;
								stripped += this.str.charAt(i);
								lastNumericChar = i;
							} else if (isDigit(this.str.charAt(i))) {
								stripped += this.str.charAt(i);
								unary = false;
								lastNumericChar = i;
							} else if (this.str.charAt(i) === this.decimal || this.str.charAt(i) === nativeDecimal) {
								stripped += "."; // always convert to period
								unary = false;
								lastNumericChar = i;
							} // else ignore
						}
						// record what we actually parsed
						this.parsed = this.str.substring(0, lastNumericChar+1);
						
						/** @type {number} */
						this.value = parseFloat(this._mapToLatinDigits(stripped));
						break;
					case 'number':
						this.str = "" + str;
						this.value = str;
						break;
						
					case 'object':
						// call parseFloat to coerse the type to number
						this.value = parseFloat(str.valueOf());
						this.str = "" + this.value;
						break;
						
					case 'undefined':
						this.value = 0;
						this.str = "0";
						break;
					}
					
					switch (this.type) {
						default:
							// don't need to do anything special for other types
							break;
						case "percentage":
							if (this.str.indexOf(li.getPercentageSymbol()) !== -1) {
								this.value /= 100;
							}
							break;
						case "currency":
							stripped = "";
							i = 0;
							while (i < this.str.length &&
								   !isDigit(this.str.charAt(i)) &&
								   !isSpace(this.str.charAt(i))) {
								stripped += this.str.charAt(i++);
							}
							if (stripped.length === 0) {
								while (i < this.str.length && 
									   isDigit(this.str.charAt(i)) ||
									   isSpace(this.str.charAt(i)) ||
									   this.str.charAt(i) === '.' ||
									   this.str.charAt(i) === ',' ) {
									i++;
								}
								while (i < this.str.length && 
									   !isDigit(this.str.charAt(i)) &&
									   !isSpace(this.str.charAt(i))) {
									stripped += this.str.charAt(i++);
								}
							}
							new Currency({
								locale: this.locale, 
								sign: stripped,
								sync: sync,
								loadParams: options.loadParams,
								onLoad: ilib.bind(this, function (cur) {
									this.currency = cur;
									if (options && typeof(options.onLoad) === 'function') {
										options.onLoad(this);
									}
								})
							});
							return;
					}
					
					if (options && typeof(options.onLoad) === 'function') {
						options.onLoad(this);
					}
				})
			});
		}));
	}));
};

INumber.prototype = {
    /**
     * @private
     */
    _mapToLatinDigits: function(str) {
        // only map if there are actual native digits
        var digits = this.li.getNativeDigits();
        if (!digits) return str;
        
        var digitMap = {};
        for (var i = 0; i < digits.length; i++) {
            digitMap[digits[i]] = String(i);
        }
        var decimal = this.li.getNativeDecimalSeparator();
        
        return str.split("").map(function(ch) {
            if (ch == decimal) return ".";
            return digitMap[ch] || ch;
        }).join("");
    },
    
	/**
	 * Return the locale for this formatter instance.
	 * @return {Locale} the locale instance for this formatter
	 */
	getLocale: function () {
		return this.locale;
	},
	
	/**
	 * Return the original string that this number instance was created with.
	 * @return {string} the original string
	 */
	toString: function () {
		return this.str;
	},
	
	/**
	 * If the type of this INumber instance is "currency", then the parser will attempt
	 * to figure out which currency this amount represents. The amount can be written
	 * with any of the currency signs or ISO 4217 codes that are currently
	 * recognized by ilib, and the currency signs may occur before or after the
	 * numeric portion of the string. If no currency can be recognized, then the 
	 * default currency for the locale is returned. If multiple currencies can be
	 * recognized (for example if the currency sign is "$"), then this method 
	 * will prefer the one for the current locale. If multiple currencies can be
	 * recognized, but none are used in the current locale, then the first currency
	 * encountered will be used. This may produce random results, though the larger
	 * currencies occur earlier in the list. For example, if the sign found in the
	 * string is "$" and that is not the sign of the currency of the current locale
	 * then the US dollar will be recognized, as it is the largest currency that uses
	 * the "$" as its sign.
	 * 
	 * @return {Currency|undefined} the currency instance for this amount, or 
	 * undefined if this INumber object is not of type currency
	 */
	getCurrency: function () {
		return this.currency;
	},
	
	/**
	 * Return the value of this INumber object as a primitive number instance.
	 * @return {number} the value of this number instance
	 */
	valueOf: function () {
		return this.value;
	}
};

module.exports = INumber;