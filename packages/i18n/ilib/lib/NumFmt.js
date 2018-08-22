/*
 * NumFmt.js - Number formatter definition
 *
 * Copyright © 2012-2015, 2018 JEDLSoft
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
LocaleInfo.js
Utils.js
MathUtils.js
Currency.js
IString.js
JSUtils.js
INumber.js
*/

// !data localeinfo currency

var ilib = require("./ilib.js");
var Utils = require("./Utils.js");
var JSUtils = require("./JSUtils.js");
var MathUtils = require("./MathUtils.js");

var Locale = require("./Locale.js");
var LocaleInfo = require("./LocaleInfo.js");
var Currency = require("./Currency.js");
var IString = require("./IString.js");
var INumber = require("./INumber.js");

/**
 * @class
 * Create a new number formatter instance. Locales differ in the way that digits
 * in a formatted number are grouped, in the way the decimal character is represented,
 * etc. Use this formatter to get it right for any locale.<p>
 *
 * This formatter can format plain numbers, currency amounts, and percentage amounts.<p>
 *
 * As with all formatters, the recommended
 * practice is to create one formatter and use it multiple times to format various
 * numbers.<p>
 *
 * The options can contain any of the following properties:
 *
 * <ul>
 * <li><i>locale</i> - use the conventions of the specified locale when figuring out how to
 * format a number.
 * <li><i>type</i> - the type of this formatter. Valid values are "number", "currency", or
 * "percentage". If this property is not specified, the default is "number".
 * <li><i>currency</i> - the ISO 4217 3-letter currency code to use when the formatter type
 * is "currency". This property is required for currency formatting. If the type property
 * is "currency" and the currency property is not specified, the constructor will throw a
 * an exception.
 * <li><i>maxFractionDigits</i> - the maximum number of digits that should appear in the
 * formatted output after the decimal. A value of -1 means unlimited, and 0 means only print
 * the integral part of the number.
 * <li><i>minFractionDigits</i> - the minimum number of fractional digits that should
 * appear in the formatted output. If the number does not have enough fractional digits
 * to reach this minimum, the number will be zero-padded at the end to get to the limit.
 * If the type of the formatter is "currency" and this
 * property is not specified, then the minimum fraction digits is set to the normal number
 * of digits used with that currency, which is almost always 0, 2, or 3 digits.
 * <li><i>significantDigits</i> - specify that max number of significant digits in the
 * formatted output. This applies before and after the decimal point. The amount is
 * rounded according to the rounding mode specified, or the rounding mode as given in
 * the locale information. If the significant digits and the max or min fraction digits
 * are both specified, this formatter will attempt to honour them both by choosing the
 * one that is smaller if there is a conflict. For example, if the max fraction digits
 * is 6 and the significant digits is 5 and the number to be formatted has a long
 * fraction, it will only format 5 digits. The default is "unlimited digits", which means
 * to format as many digits as the javascript engine can represent internally (usually
 * around 13-15 or so on a 64-bit machine).
 * <li><i>useNative</i> - the flag used to determaine whether to use the native script settings
 * for formatting the numbers .
 * <li><i>roundingMode</i> - When the maxFractionDigits or maxIntegerDigits is specified,
 * this property governs how the least significant digits are rounded to conform to that
 * maximum. The value of this property is a string with one of the following values:
 * <ul>
 *   <li><i>up</i> - round away from zero
 *   <li><i>down</i> - round towards zero. This has the effect of truncating the number
 *   <li><i>ceiling</i> - round towards positive infinity
 *   <li><i>floor</i> - round towards negative infinity
 *   <li><i>halfup</i> - round towards nearest neighbour. If equidistant, round up.
 *   <li><i>halfdown</i> - round towards nearest neighbour. If equidistant, round down.
 *   <li><i>halfeven</i> - round towards nearest neighbour. If equidistant, round towards the even neighbour
 *   <li><i>halfodd</i> - round towards nearest neighbour. If equidistant, round towards the odd neighbour
 * </ul>
 * When the type of the formatter is "currency" and the <i>roundingMode</i> property is not
 * set, then the standard legal rounding rules for the locale are followed. If the type
 * is "number" or "percentage" and the <i>roundingMode</i> property is not set, then the
 * default mode is "halfdown".</i>.
 *
 * <li><i>style</i> - When the type of this formatter is "currency", the currency amount
 * can be formatted in the following styles: "common" and "iso". The common style is the
 * one commonly used in every day writing where the currency unit is represented using a
 * symbol. eg. "$57.35" for fifty-seven dollars and thirty five cents. The iso style is
 * the international style where the currency unit is represented using the ISO 4217 code.
 * eg. "USD 57.35" for the same amount. The default is "common" style if the style is
 * not specified.<p>
 *
 * When the type of this formatter is "number", the style can be one of the following:
 * <ul>
 *   <li><i>standard - format a fully specified floating point number properly for the locale
 *   <li><i>scientific</i> - use scientific notation for all numbers. That is, 1 integral
 *   digit, followed by a number of fractional digits, followed by an "e" which denotes
 *   exponentiation, followed digits which give the power of 10 in the exponent.
 *   <li><i>native</i> - format a floating point number using the native digits and
 *   formatting symbols for the script of the locale.
 *   <li><i>nogrouping</i> - format a floating point number without grouping digits for
 *   the integral portion of the number
 * </ul>
 * Note that if you specify a maximum number
 * of integral digits, the formatter with a standard style will give you standard
 * formatting for smaller numbers and scientific notation for larger numbers. The default
 * is standard style if this is not specified.
 *
 * <li><i>onLoad</i> - a callback function to call when the format data is fully
 * loaded. When the onLoad option is given, this class will attempt to
 * load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two.
 *
 * <li>sync - tell whether to load any missing locale data synchronously or
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
 *
 * @constructor
 * @param {Object.<string,*>} options A set of options that govern how the formatter will behave
 */
var NumFmt = function (options) {
	var sync = true;
	this.locale = new Locale();
	/**
	 * @private
	 * @type {string}
	 */
	this.type = "number";
	var loadParams = undefined;

	if (options) {
		if (options.locale) {
			this.locale = (typeof (options.locale) === 'string') ? new Locale(options.locale) : options.locale;
		}

		if (options.type) {
			if (options.type === 'number' ||
				options.type === 'currency' ||
				options.type === 'percentage') {
				this.type = options.type;
			}
		}

		if (options.currency) {
			/**
			 * @private
			 * @type {string}
			 */
			this.currency = options.currency;
		}

        if (typeof (options.maxFractionDigits) !== 'undefined') {
            /**
             * @private
             * @type {number|undefined}
             */
            this.maxFractionDigits = Number(options.maxFractionDigits);
        }
        if (typeof (options.minFractionDigits) !== 'undefined') {
            /**
             * @private
             * @type {number|undefined}
             */
            this.minFractionDigits = Number(options.minFractionDigits);
            // enforce the limits to avoid JS exceptions
            if (this.minFractionDigits < 0) {
                this.minFractionDigits = 0;
            }
            if (this.minFractionDigits > 20) {
                this.minFractionDigits = 20;
            }
        }
        if (typeof (options.significantDigits) !== 'undefined') {
            /**
             * @private
             * @type {number|undefined}
             */
            this.significantDigits = Number(options.significantDigits);
            // enforce the limits to avoid JS exceptions
            if (this.significantDigits < 1) {
                this.significantDigits = 1;
            }
            if (this.significantDigits > 20) {
                this.significantDigits = 20;
            }
        }
		if (options.style) {
			/**
			 * @private
			 * @type {string}
			 */
			this.style = options.style;
		}
		if (typeof(options.useNative) === 'boolean') {
			/**
			 * @private
			 * @type {boolean}
			 * */
			this.useNative = options.useNative;
		}
		/**
		 * @private
		 * @type {string}
		 */
		this.roundingMode = options.roundingMode;

		if (typeof(options.sync) === 'boolean') {
			sync = options.sync;
		}

		loadParams = options.loadParams;
	}

	/**
	 * @private
	 * @type {LocaleInfo|undefined}
	 */
	this.localeInfo = undefined;

	new LocaleInfo(this.locale, {
		sync: sync,
		loadParams: loadParams,
		onLoad: ilib.bind(this, function (li) {
			/**
			 * @private
			 * @type {LocaleInfo|undefined}
			 */
			this.localeInfo = li;

			if (this.type === "number") {
				this.templateNegative = new IString(this.localeInfo.getNegativeNumberFormat() || "-{n}");
			} else if (this.type === "currency") {
				var templates;

				if (!this.currency || typeof (this.currency) != 'string') {
					throw "A currency property is required in the options to the number formatter constructor when the type property is set to currency.";
				}

				new Currency({
					locale: this.locale,
					code: this.currency,
					sync: sync,
					loadParams: loadParams,
					onLoad: ilib.bind(this, function (cur) {
						this.currencyInfo = cur;
						if (this.style !== "common" && this.style !== "iso") {
							this.style = "common";
						}

						if (typeof(this.maxFractionDigits) !== 'number' && typeof(this.minFractionDigits) !== 'number') {
							this.minFractionDigits = this.maxFractionDigits = this.currencyInfo.getFractionDigits();
						}

						templates = this.localeInfo.getCurrencyFormats();
						this.template = new IString(templates[this.style] || templates.common);
						this.templateNegative = new IString(templates[this.style + "Negative"] || templates["commonNegative"]);
						this.sign = (this.style === "iso") ? this.currencyInfo.getCode() : this.currencyInfo.getSign();

						if (!this.roundingMode) {
							this.roundingMode = this.currencyInfo && this.currencyInfo.roundingMode;
						}

						this._init();

						if (options && typeof (options.onLoad) === 'function') {
							options.onLoad(this);
						}
					})
				});
				return;
			} else if (this.type === "percentage") {
				this.template =  new IString(this.localeInfo.getPercentageFormat() || "{n}%");
				this.templateNegative = new IString(this.localeInfo.getNegativePercentageFormat() || this.localeInfo.getNegativeNumberFormat() + "%");
			}

			this._init();

			if (options && typeof (options.onLoad) === 'function') {
				options.onLoad(this);
			}
		})
	});
};

/**
 * Return an array of available locales that this formatter can format
 * @static
 * @return {Array.<Locale>|undefined} an array of available locales
 */
NumFmt.getAvailableLocales = function () {
	return undefined;
};

/**
 * @private
 * @const
 * @type string
 */
NumFmt.zeros = "0000000000000000000000000000000000000000000000000000000000000000000000";

NumFmt.prototype = {
	/**
	 * Return true if this formatter uses native digits to format the number. If the useNative
	 * option is given to the constructor, then this flag will be honoured. If the useNative
	 * option is not given to the constructor, this this formatter will use native digits if
	 * the locale typically uses native digits.
	 *
	 *  @return {boolean} true if this formatter will format with native digits, false otherwise
	 */
	getUseNative: function() {
		if (typeof(this.useNative) === "boolean") {
			return this.useNative;
		}
		return (this.localeInfo.getDigitsStyle() === "native");
	},

	/**
	 * @private
	 */
	_init: function () {
		if (this.maxFractionDigits < this.minFractionDigits) {
			this.minFractionDigits = this.maxFractionDigits;
		}

		if (!this.roundingMode) {
			this.roundingMode = this.localeInfo.getRoundingMode();
		}

		if (!this.roundingMode) {
			this.roundingMode = "halfdown";
		}

		// set up the function, so we only have to figure it out once
		// and not every time we do format()
		this.round = MathUtils[this.roundingMode];
		if (!this.round) {
			this.roundingMode = "halfdown";
			this.round = MathUtils[this.roundingMode];
		}

		if (this.style === "nogrouping") {
			this.prigroupSize = this.secgroupSize = 0;
		} else {
			this.prigroupSize = this.localeInfo.getPrimaryGroupingDigits();
			this.secgroupSize = this.localeInfo.getSecondaryGroupingDigits();
			this.groupingSeparator = this.getUseNative() ? this.localeInfo.getNativeGroupingSeparator() : this.localeInfo.getGroupingSeparator();
		}
		this.decimalSeparator = this.getUseNative() ? this.localeInfo.getNativeDecimalSeparator() : this.localeInfo.getDecimalSeparator();

		if (this.getUseNative()) {
			var nd = this.localeInfo.getNativeDigits() || this.localeInfo.getDigits();
			if (nd) {
				this.digits = nd.split("");
			}
		}

		this.exponentSymbol = this.localeInfo.getExponential() || "e";
	},

    /**
     * Apply the constraints used in the current formatter to the given number. This will
     * will apply the maxFractionDigits, significantDigits, and rounding mode
     * constraints and return the result. The result is further
     * manipulated in the format method to produce the final formatted number string.
     * This method is intended for use by code that needs to use the same number that
     * this formatter instance uses for formatting before that number is turned into a
     * formatted string.
     *
     * @param {number} num the number to constrain
     * @returns {number} the number with the constraints applied to it
     */
    constrain: function(num) {
        var parts = ("" + num).split("."),
            result = num;

        // only apply the either significantDigits or the maxFractionDigits -- whichever results in a shorter fractional part
        if ((typeof(this.significantDigits) !== 'undefined' && this.significantDigits > 0) &&
            (typeof(this.maxFractionDigits) === 'undefined' || this.maxFractionDigits < 0 ||
                parts[0].length + this.maxFractionDigits > this.significantDigits)) {
            result = MathUtils.significant(result, this.significantDigits, this.round);
        }

        if (typeof(this.maxFractionDigits) !== 'undefined' && this.maxFractionDigits > -1) {
            result = MathUtils.shiftDecimal(this.round(MathUtils.shiftDecimal(result, this.maxFractionDigits)), -this.maxFractionDigits);
        }

        return result;
    },

	/**
	 * Format the number using scientific notation as a positive number. Negative
	 * formatting to be applied later.
	 * @private
	 * @param {number} num the number to format
	 * @return {string} the formatted number
	 */
	_formatScientific: function (num) {
		var n = new Number(num);
		var formatted;

		var factor,
			str = n.toExponential(),
			parts = str.split("e"),
			significant = parts[0],
			exponent = parts[1],
			numparts,
			integral,
			fraction;

        if (this.maxFractionDigits > 0 || this.significantDigits > 0) {
            // if there is a max fraction digits setting, round the fraction to
            // the right length first by dividing or multiplying by powers of 10.
            // manipulate the fraction digits so as to
            // avoid the rounding errors of floating point numbers
            var maxDigits = (this.maxFractionDigits || 25) + 1;
            if (this.significantDigits > 0) {
                maxDigits = Math.min(maxDigits, this.significantDigits);
            }
            significant = MathUtils.significant(significant, maxDigits, this.round);
        }
		numparts = ("" + significant).split(".");
		integral = numparts[0];
		fraction = numparts[1];

		if (typeof(this.maxFractionDigits) !== 'undefined') {
			fraction = fraction.substring(0, this.maxFractionDigits);
		}
		if (typeof(this.minFractionDigits) !== 'undefined') {
			fraction = JSUtils.pad(fraction || "", this.minFractionDigits, true);
		}
		formatted = integral;
		if (fraction.length) {
			formatted += this.decimalSeparator + fraction;
		}
		formatted += this.exponentSymbol + exponent;
		return formatted;
	},

	/**
	 * Formats the number as a positive number. Negative formatting to be applied later.
	 * @private
	 * @param {number} num the number to format
	 * @return {string} the formatted number
	 */
	_formatStandard: function (num) {
		var i;
		var k;

        var parts,
            integral,
            fraction,
            cycle,
            formatted;

        num = Math.abs(this.constrain(num));

		parts = ("" + num).split(".");
		integral = parts[0].toString();
		fraction = parts[1];

		if (this.minFractionDigits > 0) {
			fraction = JSUtils.pad(fraction || "", this.minFractionDigits, true);
		}

		if (this.secgroupSize > 0) {
			if (integral.length > this.prigroupSize) {
				var size1 = this.prigroupSize;
				var size2 = integral.length;
				var size3 = size2 - size1;
				integral = integral.slice(0, size3) + this.groupingSeparator + integral.slice(size3);
				var num_sec = integral.substring(0, integral.indexOf(this.groupingSeparator));
				k = num_sec.length;
				while (k > this.secgroupSize) {
					var secsize1 = this.secgroupSize;
					var secsize2 = num_sec.length;
					var secsize3 = secsize2 - secsize1;
					integral = integral.slice(0, secsize3) + this.groupingSeparator + integral.slice(secsize3);
					num_sec = integral.substring(0, integral.indexOf(this.groupingSeparator));
					k = num_sec.length;
				}
			}

			formatted = integral;
		} else if (this.prigroupSize !== 0) {
			cycle = MathUtils.mod(integral.length - 1, this.prigroupSize);

			formatted = "";

			for (i = 0; i < integral.length - 1; i++) {
				formatted += integral.charAt(i);
				if (cycle === 0) {
					formatted += this.groupingSeparator;
				}
				cycle = MathUtils.mod(cycle - 1, this.prigroupSize);
			}
			formatted += integral.charAt(integral.length - 1);
		} else {
			formatted = integral;
		}

        if (fraction &&
            ((typeof(this.maxFractionDigits) === 'undefined' && typeof(this.significantDigits) === 'undefined') ||
              this.maxFractionDigits > 0 || this.significantDigits > 0)) {
            formatted += this.decimalSeparator;
            formatted += fraction;
        }

		if (this.digits) {
			formatted = JSUtils.mapString(formatted, this.digits);
		}

		return formatted;
	},

	/**
	 * Format a number according to the settings of this number formatter instance.
	 * @param num {number|string|INumber|Number} a floating point number to format
	 * @return {string} a string containing the formatted number
	 */
	format: function (num) {
		var formatted, n;

		if (typeof (num) === 'undefined') {
			return "";
		}

		// convert to a real primitive number type
		n = Number(num);

		if (this.type === "number") {
			formatted = (this.style === "scientific") ?
				this._formatScientific(n) :
				this._formatStandard(n);

			if (num < 0) {
				formatted = this.templateNegative.format({n: formatted});
			}
		} else {
			formatted = this._formatStandard(n);
			var template = (n < 0) ? this.templateNegative : this.template;
			formatted = template.format({
				n: formatted,
				s: this.sign
			});
		}

		return formatted;
	},

	/**
	 * Return the type of formatter. Valid values are "number", "currency", and
	 * "percentage".
	 *
	 * @return {string} the type of formatter
	 */
	getType: function () {
		return this.type;
	},

	/**
	 * Return the locale for this formatter instance.
	 * @return {Locale} the locale instance for this formatter
	 */
	getLocale: function () {
		return this.locale;
	},

	/**
	 * Returns true if this formatter groups together digits in the integral
	 * portion of a number, based on the options set up in the constructor. In
	 * most western European cultures, this means separating every 3 digits
	 * of the integral portion of a number with a particular character.
	 *
	 * @return {boolean} true if this formatter groups digits in the integral
	 * portion of the number
	 */
	isGroupingUsed: function () {
		return (this.groupingSeparator !== 'undefined' && this.groupingSeparator.length > 0);
	},

	/**
	 * Returns the maximum fraction digits set up in the constructor.
	 *
	 * @return {number} the maximum number of fractional digits this
	 * formatter will format, or -1 for no maximum
	 */
	getMaxFractionDigits: function () {
		return typeof (this.maxFractionDigits) !== 'undefined' ? this.maxFractionDigits : -1;
	},

	/**
	 * Returns the minimum fraction digits set up in the constructor. If
	 * the formatter has the type "currency", then the minimum fraction
	 * digits is the amount of digits that is standard for the currency
	 * in question unless overridden in the options to the constructor.
	 *
	 * @return {number} the minimum number of fractional digits this
	 * formatter will format, or -1 for no minimum
	 */
	getMinFractionDigits: function () {
		return typeof (this.minFractionDigits) !== 'undefined' ? this.minFractionDigits : -1;
	},

   /**
     * Returns the significant digits set up in the constructor.
     *
     * @return {number} the number of significant digits this
     * formatter will format, or -1 for no minimum
     */
    getSignificantDigits: function () {
        return typeof (this.significantDigits) !== 'undefined' ? this.significantDigits : -1;
    },

	/**
	 * Returns the ISO 4217 code for the currency that this formatter formats.
	 * IF the typeof this formatter is not "currency", then this method will
	 * return undefined.
	 *
	 * @return {string} the ISO 4217 code for the currency that this formatter
	 * formats, or undefined if this not a currency formatter
	 */
	getCurrency: function () {
		return this.currencyInfo && this.currencyInfo.getCode();
	},

	/**
	 * Returns the rounding mode set up in the constructor. The rounding mode
	 * controls how numbers are rounded when the integral or fraction digits
	 * of a number are limited.
	 *
	 * @return {string} the name of the rounding mode used in this formatter
	 */
	getRoundingMode: function () {
		return this.roundingMode;
	},

	/**
	 * If this formatter is a currency formatter, then the style determines how the
	 * currency is denoted in the formatted output. This method returns the style
	 * that this formatter will produce. (See the constructor comment for more about
	 * the styles.)
	 * @return {string} the name of the style this formatter will use to format
	 * currency amounts, or "undefined" if this formatter is not a currency formatter
	 */
	getStyle: function () {
		return this.style;
	}
};

module.exports = NumFmt;