/*
 * IString.js - ilib string subclass definition
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

// !depends ilib.js Utils.js Locale.js MathUtils.js

// !data plurals

var ilib = require("./ilib.js");
var Utils = require("./Utils.js");
var MathUtils = require("./MathUtils.js");
var Locale = require("./Locale.js");

/**
 * @class
 * Create a new ilib string instance. This string inherits from and
 * extends the Javascript String class. It can be
 * used almost anywhere that a normal Javascript string is used, though in
 * some instances you will need to call the {@link #toString} method when
 * a built-in Javascript string is needed. The formatting methods are 
 * methods that are not in the intrinsic String class and are most useful
 * when localizing strings in an app or web site in combination with 
 * the ResBundle class.<p>
 * 
 * This class is named IString ("ilib string") so as not to conflict with the 
 * built-in Javascript String class.
 * 
 * @constructor
 * @param {string|IString=} string initialize this instance with this string 
 */
var IString = function (string) {
	if (typeof(string) === 'object') {
		if (string instanceof IString) {
			this.str = string.str;	
		} else {
			this.str = string.toString();
		}
	} else if (typeof(string) === 'string') {
		this.str = new String(string);
	} else {
		this.str = "";
	}
	this.length = this.str.length;
	this.cpLength = -1;
	this.localeSpec = ilib.getLocale();
};

/**
 * Return true if the given character is a Unicode surrogate character,
 * either high or low.
 * 
 * @private
 * @static
 * @param {string} ch character to check
 * @return {boolean} true if the character is a surrogate
 */
IString._isSurrogate = function (ch) {
	var n = ch.charCodeAt(0);
	return ((n >= 0xDC00 && n <= 0xDFFF) || (n >= 0xD800 && n <= 0xDBFF));
};

/**
 * Convert a UCS-4 code point to a Javascript string. The codepoint can be any valid 
 * UCS-4 Unicode character, including supplementary characters. Standard Javascript
 * only supports supplementary characters using the UTF-16 encoding, which has 
 * values in the range 0x0000-0xFFFF. String.fromCharCode() will only
 * give you a string containing 16-bit characters, and will not properly convert 
 * the code point for a supplementary character (which has a value > 0xFFFF) into 
 * two UTF-16 surrogate characters. Instead, it will just just give you whatever
 * single character happens to be the same as your code point modulo 0x10000, which
 * is almost never what you want.<p> 
 * 
 * Similarly, that means if you use String.charCodeAt()
 * you will only retrieve a 16-bit value, which may possibly be a single
 * surrogate character that is part of a surrogate pair representing a character
 * in the supplementary plane. It will not give you a code point. Use 
 * IString.codePointAt() to access code points in a string, or use 
 * an iterator to walk through the code points in a string. 
 * 
 * @static
 * @param {number} codepoint UCS-4 code point to convert to a character
 * @return {string} a string containing the character represented by the codepoint
 */
IString.fromCodePoint = function (codepoint) {
	if (codepoint < 0x10000) {
		return String.fromCharCode(codepoint);
	} else {
		var high = Math.floor(codepoint / 0x10000) - 1;
		var low = codepoint & 0xFFFF;
		
		return String.fromCharCode(0xD800 | ((high & 0x000F) << 6) |  ((low & 0xFC00) >> 10)) +
			String.fromCharCode(0xDC00 | (low & 0x3FF));
	}
};

/**
 * Convert the character or the surrogate pair at the given
 * index into the intrinsic Javascript string to a Unicode 
 * UCS-4 code point.
 * 
 * @param {string} str string to get the code point from
 * @param {number} index index into the string
 * @return {number} code point of the character at the
 * given index into the string
 */
IString.toCodePoint = function(str, index) {
	if (!str || str.length === 0) {
		return -1;
	}
	var code = -1, high = str.charCodeAt(index);
	if (high >= 0xD800 && high <= 0xDBFF) {
		if (str.length > index+1) {
			var low = str.charCodeAt(index+1);
			if (low >= 0xDC00 && low <= 0xDFFF) {
				code = (((high & 0x3C0) >> 6) + 1) << 16 |
					(((high & 0x3F) << 10) | (low & 0x3FF));
			}
		}
	} else {
		code = high;
	}
	
	return code;
};

/**
 * Load the plural the definitions of plurals for the locale.
 * @param {boolean=} sync
 * @param {Locale|string=} locale
 * @param {Object=} loadParams
 * @param {function(*)=} onLoad
 */
IString.loadPlurals = function (sync, locale, loadParams, onLoad) {
	var loc;
	if (locale) {
		loc = (typeof(locale) === 'string') ? new Locale(locale) : locale;
	} else {
		loc = new Locale(ilib.getLocale());
	}
	var spec = loc.getLanguage();
	if (!ilib.data["plurals_" + spec]) {
		Utils.loadData({
			name: "plurals.json",
			object: IString,
			locale: loc,
			sync: sync,
			loadParams: loadParams,
			callback: /** @type function(Object=):undefined */ ilib.bind(this, /** @type function() */ function(plurals) {
				if (!plurals) {
					IString.cache[spec] = {};
				}
				ilib.data["plurals_" + spec] = plurals || {};
				if (onLoad && typeof(onLoad) === 'function') {
					onLoad(ilib.data["plurals_" + spec]);
				}
			})
		});
	} else {
		if (onLoad && typeof(onLoad) === 'function') {
			onLoad(ilib.data["plurals_" + spec]);
		}
	}
};

/**
 * @private
 * @static
 */
IString._fncs = {
	/**
	 * @private
	 * @param {Object} obj
	 * @return {string|undefined}
	 */
	firstProp: function (obj) {
		for (var p in obj) {
			if (p && obj[p]) {
				return p;
			}
		}
		return undefined; // should never get here
	},
	
	/**
	 * @private
	 * @param {Object} obj
	 * @param {number} n
	 * @return {?}
	 */
	getValue: function (obj, n) {
		if (typeof(obj) === 'object') {
			var subrule = IString._fncs.firstProp(obj);
			return IString._fncs[subrule](obj[subrule], n);
		} else if (typeof(obj) === 'string') {
			return n;
		} else {
			return obj;
		}
	},
	
	/**
	 * @private
	 * @param {number} n
	 * @param {Array.<number|Array.<number>>} range
	 * @return {boolean}
	 */
	matchRangeContinuous: function(n, range) {
		for (var num in range) {
			if (typeof(num) !== 'undefined' && typeof(range[num]) !== 'undefined') {
				var obj = /** @type {Object|null|undefined} */ range[num];
				if (typeof(obj) === 'number') {
					if (n === range[num]) {
						return true;
					}
				} else if (Object.prototype.toString.call(obj) === '[object Array]') {
					if (n >= obj[0] && n <= obj[1]) {
						return true;
					}
				}
			}
		}
		return false;
	},

	/**
	 * @private
	 * @param {number} n
	 * @param {Array.<number|Array.<number>>} range
	 * @return {boolean}
	 */
	matchRange: function(n, range) {
		if (Math.floor(n) !== n) {
			return false;
		}
		return IString._fncs.matchRangeContinuous(n, range);
	},
	
	/**
	 * @private
	 * @param {Object} rule
	 * @param {number} n
	 * @return {boolean}
	 */
	is: function(rule, n) {
		var left = IString._fncs.getValue(rule[0], n);
		var right = IString._fncs.getValue(rule[1], n);
		return left == right;
		// return IString._fncs.getValue(rule[0]) == IString._fncs.getValue(rule[1]);
	},
	
	/**
	 * @private
	 * @param {Object} rule
	 * @param {number} n
	 * @return {boolean}
	 */
	isnot: function(rule, n) {
		return IString._fncs.getValue(rule[0], n) != IString._fncs.getValue(rule[1], n);
	},
	
	/**
	 * @private
	 * @param {Object} rule
	 * @param {number} n
	 * @return {boolean}
	 */
	inrange: function(rule, n) {
		return IString._fncs.matchRange(IString._fncs.getValue(rule[0], n), rule[1]);
	},
	
	/**
	 * @private
	 * @param {Object} rule
	 * @param {number} n
	 * @return {boolean}
	 */
	notin: function(rule, n) {
		return !IString._fncs.matchRange(IString._fncs.getValue(rule[0], n), rule[1]);
	},
	
	/**
	 * @private
	 * @param {Object} rule
	 * @param {number} n
	 * @return {boolean}
	 */
	within: function(rule, n) {
		return IString._fncs.matchRangeContinuous(IString._fncs.getValue(rule[0], n), rule[1]);		
	},
	
	/**
	 * @private
	 * @param {Object} rule
	 * @param {number} n
	 * @return {number}
	 */
	mod: function(rule, n) {
		return MathUtils.mod(IString._fncs.getValue(rule[0], n), IString._fncs.getValue(rule[1], n));
	},
	
	/**
	 * @private
	 * @param {Object} rule
	 * @param {number} n
	 * @return {number}
	 */
	n: function(rule, n) {
		return n;
	},
	
	/**
	 * @private
	 * @param {Object} rule
	 * @param {number} n
	 * @return {boolean}
	 */
	or: function(rule, n) {
		return IString._fncs.getValue(rule[0], n) || IString._fncs.getValue(rule[1], n);
	},
	
	/**
	 * @private
	 * @param {Object} rule
	 * @param {number} n
	 * @return {boolean}
	 */
	and: function(rule, n) {
		return IString._fncs.getValue(rule[0], n) && IString._fncs.getValue(rule[1], n);
	}
};

IString.prototype = {
	/**
	 * Return the length of this string in characters. This function defers to the regular
	 * Javascript string class in order to perform the length function. Please note that this
	 * method is a real method, whereas the length property of Javascript strings is 
	 * implemented by native code and appears as a property.<p>
	 * 
	 * Example:
	 * 
	 * <pre>
	 * var str = new IString("this is a string");
	 * console.log("String is " + str._length() + " characters long.");
	 * </pre>
	 * @private
	 */
	_length: function () {
		return this.str.length;
	},
	
	/**
	 * Format this string instance as a message, replacing the parameters with 
	 * the given values.<p>
	 * 
	 * The string can contain any text that a regular Javascript string can
	 * contain. Replacement parameters have the syntax:
	 * 
	 * <pre>
	 * {name}
	 * </pre>
	 * 
	 * Where "name" can be any string surrounded by curly brackets. The value of 
	 * "name" is taken from the parameters argument.<p>
	 * 
	 * Example:
	 * 
	 * <pre>
	 * var str = new IString("There are {num} objects.");
	 * console.log(str.format({
	 *   num: 12
	 * });
	 * </pre>
	 * 
	 * Would give the output:
	 * 
	 * <pre>
	 * There are 12 objects.
	 * </pre>
	 * 
	 * If a property is missing from the parameter block, the replacement
	 * parameter substring is left untouched in the string, and a different
	 * set of parameters may be applied a second time. This way, different
	 * parts of the code may format different parts of the message that they
	 * happen to know about.<p>
	 * 
	 * Example:
	 * 
	 * <pre>
	 * var str = new IString("There are {num} objects in the {container}.");
	 * console.log(str.format({
	 *   num: 12
	 * });
	 * </pre>
	 * 
	 * Would give the output:<p>
	 * 
	 * <pre>
	 * There are 12 objects in the {container}.
	 * </pre>
	 * 
	 * The result can then be formatted again with a different parameter block that
	 * specifies a value for the container property.
	 * 
	 * @param params a Javascript object containing values for the replacement 
	 * parameters in the current string
	 * @return a new IString instance with as many replacement parameters filled
	 * out as possible with real values.
	 */
	format: function (params) {
		var formatted = this.str;
		if (params) {
			var regex;
			for (var p in params) {
				if (typeof(params[p]) !== 'undefined') {
					regex = new RegExp("\{"+p+"\}", "g");
					formatted = formatted.replace(regex, params[p]);
				}
			}
		}
		return formatted.toString();
	},
	
	/**
	 * Format a string as one of a choice of strings dependent on the value of
	 * a particular argument index.<p>
	 * 
	 * The syntax of the choice string is as follows. The string contains a
	 * series of choices separated by a vertical bar character "|". Each choice
	 * has a value or range of values to match followed by a hash character "#"
	 * followed by the string to use if the variable matches the criteria.<p>
	 * 
	 * Example string:
	 * 
	 * <pre>
	 * var num = 2;
	 * var str = new IString("0#There are no objects.|1#There is one object.|2#There are {number} objects.");
	 * console.log(str.formatChoice(num, {
	 *   number: num
	 * }));
	 * </pre>
	 * 
	 * Gives the output:
	 * 
	 * <pre>
	 * "There are 2 objects."
	 * </pre>
	 * 
	 * The strings to format may contain replacement variables that will be formatted
	 * using the format() method above and the params argument as a source of values
	 * to use while formatting those variables.<p>
	 * 
	 * If the criterion for a particular choice is empty, that choice will be used
	 * as the default one for use when none of the other choice's criteria match.<p>
	 * 
	 * Example string:
	 * 
	 * <pre>
	 * var num = 22;
	 * var str = new IString("0#There are no objects.|1#There is one object.|#There are {number} objects.");
	 * console.log(str.formatChoice(num, {
	 *   number: num
	 * }));
	 * </pre>
	 * 
	 * Gives the output:
	 * 
	 * <pre>
	 * "There are 22 objects."
	 * </pre>
	 * 
	 * If multiple choice patterns can match a given argument index, the first one 
	 * encountered in the string will be used. If no choice patterns match the 
	 * argument index, then the default choice will be used. If there is no default
	 * choice defined, then this method will return an empty string.<p>
	 * 
	 * <b>Special Syntax</b><p>
	 * 
	 * For any choice format string, all of the patterns in the string should be
	 * of a single type: numeric, boolean, or string/regexp. The type of the 
	 * patterns is determined by the type of the argument index parameter.<p>
	 * 
	 * If the argument index is numeric, then some special syntax can be used 
	 * in the patterns to match numeric ranges.<p>
	 * 
	 * <ul>
	 * <li><i>&gt;x</i> - match any number that is greater than x 
	 * <li><i>&gt;=x</i> - match any number that is greater than or equal to x
	 * <li><i>&lt;x</i> - match any number that is less than x
	 * <li><i>&lt;=x</i> - match any number that is less than or equal to x
	 * <li><i>start-end</i> - match any number in the range [start,end)
	 * <li><i>zero</i> - match any number in the class "zero". (See below for
	 * a description of number classes.)
	 * <li><i>one</i> - match any number in the class "one"
	 * <li><i>two</i> - match any number in the class "two"
	 * <li><i>few</i> - match any number in the class "few"
	 * <li><i>many</i> - match any number in the class "many"
	 * </ul>
	 * 
	 * A number class defines a set of numbers that receive a particular syntax
	 * in the strings. For example, in Slovenian, integers ending in the digit
	 * "1" are in the "one" class, including 1, 21, 31, ... 101, 111, etc.
	 * Similarly, integers ending in the digit "2" are in the "two" class. 
	 * Integers ending in the digits "3" or "4" are in the "few" class, and
	 * every other integer is handled by the default string.<p>
	 * 
	 * The definition of what numbers are included in a class is locale-dependent.
	 * They are defined in the data file plurals.json. If your string is in a
	 * different locale than the default for ilib, you should call the setLocale()
	 * method of the string instance before calling this method.<p> 
	 * 
	 * <b>Other Pattern Types</b><p>
	 * 
	 * If the argument index is a boolean, the string values "true" and "false" 
	 * may appear as the choice patterns.<p>
	 * 
	 * If the argument index is of type string, then the choice patterns may contain
	 * regular expressions, or static strings as degenerate regexps.
	 * 
	 * @param {*} argIndex The index into the choice array of the current parameter
	 * @param {Object} params The hash of parameter values that replace the replacement 
	 * variables in the string
	 * @throws "syntax error in choice format pattern: " if there is a syntax error
	 * @return {string} the formatted string
	 */
	formatChoice: function(argIndex, params) {
		var choices = this.str.split("|");
		var type = typeof(argIndex);
		var limits = [];
		var strings = [];
		var i;
		var parts;
		var limit;
		var arg;
		var result = undefined;
		var defaultCase = "";
	
		if (this.str.length === 0) {
			// nothing to do
			return "";
		}
		
		// first parse all the choices
		for (i = 0; i < choices.length; i++) {		
			parts = choices[i].split("#");		
			if (parts.length > 2) {
				limits[i] = parts[0];
				parts = parts.shift();			
				strings[i] = parts.join("#");
			} else if (parts.length === 2) {
				limits[i] = parts[0];
				strings[i] = parts[1];
			} else {
				// syntax error
				throw "syntax error in choice format pattern: " + choices[i];
			}		
		}
		
		// then apply the argument index
		for (i = 0; i < limits.length; i++) {
			if (limits[i].length === 0) {
				// this is default case
				defaultCase = new IString(strings[i]);			
			} else {
				switch (type) {
					case 'number':
						arg = parseInt(argIndex, 10);
											
						if (limits[i].substring(0,2) === "<=") {						
							limit = parseFloat(limits[i].substring(2));
							if (arg <= limit) {
								result = new IString(strings[i]);
								i = limits.length;
							}
						} else if (limits[i].substring(0,2) === ">=") {						
							limit = parseFloat(limits[i].substring(2));
							if (arg >= limit) {
								result = new IString(strings[i]);
								i = limits.length;
							}
						} else if (limits[i].charAt(0) === "<") {						
							limit = parseFloat(limits[i].substring(1));
							if (arg < limit) {
								result = new IString(strings[i]);
								i = limits.length;
							}
						} else if (limits[i].charAt(0) === ">") {						
							limit = parseFloat(limits[i].substring(1));
							if (arg > limit) {
								result = new IString(strings[i]);
								i = limits.length;
							}
						} else {
							this.locale = this.locale || new Locale(this.localeSpec);
							switch (limits[i]) {
								case "zero":
								case "one":
								case "two":
								case "few":
								case "many":
									// CLDR locale-dependent number classes
									var ruleset = ilib.data["plurals_" + this.locale.getLanguage()];
									if (ruleset) {
										var rule = ruleset[limits[i]];
										if (IString._fncs.getValue(rule, arg)) {
											result = new IString(strings[i]);
											i = limits.length;
										}
									}
									break;
								default:
									var dash = limits[i].indexOf("-");
									if (dash !== -1) {							
										// range
										var start = limits[i].substring(0, dash);
										var end = limits[i].substring(dash+1);							
										if (arg >= parseInt(start, 10) && arg <= parseInt(end, 10)) {								
											result = new IString(strings[i]);
											i = limits.length;
										}
									} else if (arg === parseInt(limits[i], 10)) {							
										// exact amount
										result = new IString(strings[i]);
										i = limits.length;
									}
									break;
							}
						}
						break;
					case 'boolean':					
						if (limits[i] === "true" && argIndex === true) {						
							result = new IString(strings[i]);
							i = limits.length;
						} else if (limits[i] === "false" && argIndex === false) {						
							result = new IString(strings[i]);
							i = limits.length;
						}
						break;
					case 'string':					
						var regexp = new RegExp(limits[i], "i");
						if (regexp.test(argIndex)) {
							result = new IString(strings[i]);
							i = limits.length;
						}
						break;
					case 'object':
						throw "syntax error: fmtChoice parameter for the argument index cannot be an object";
				}
			}
		}
		
		if (!result) {		
			result = defaultCase || new IString("");
		}
		
		result = result.format(params);
		
		return result.toString();
	},
	
	// delegates
	/**
	 * Same as String.toString()
	 * @return {string} this instance as regular Javascript string
	 */
	toString: function () {
		return this.str.toString();
	},
	
	/**
	 * Same as String.valueOf()
	 * @return {string} this instance as a regular Javascript string
	 */
	valueOf: function () {
		return this.str.valueOf();
	},
	
	/**
	 * Same as String.charAt()
	 * @param {number} index the index of the character being sought
	 * @return {IString} the character at the given index
	 */
	charAt: function(index) {
		return new IString(this.str.charAt(index));
	},
	
	/**
	 * Same as String.charCodeAt(). This only reports on 
	 * 2-byte UCS-2 Unicode values, and does not take into
	 * account supplementary characters encoded in UTF-16.
	 * If you would like to take account of those characters,
	 * use codePointAt() instead.
	 * @param {number} index the index of the character being sought
	 * @return {number} the character code of the character at the 
	 * given index in the string 
	 */
	charCodeAt: function(index) {
		return this.str.charCodeAt(index);
	},
	
	/**
	 * Same as String.concat()
	 * @param {string} strings strings to concatenate to the current one
	 * @return {IString} a concatenation of the given strings
	 */
	concat: function(strings) {
		return new IString(this.str.concat(strings));
	},
	
	/**
	 * Same as String.indexOf()
	 * @param {string} searchValue string to search for
	 * @param {number} start index into the string to start searching, or
	 * undefined to search the entire string
	 * @return {number} index into the string of the string being sought,
	 * or -1 if the string is not found 
	 */
	indexOf: function(searchValue, start) {
		return this.str.indexOf(searchValue, start);
	},
	
	/**
	 * Same as String.lastIndexOf()
	 * @param {string} searchValue string to search for
	 * @param {number} start index into the string to start searching, or
	 * undefined to search the entire string
	 * @return {number} index into the string of the string being sought,
	 * or -1 if the string is not found 
	 */
	lastIndexOf: function(searchValue, start) {
		return this.str.lastIndexOf(searchValue, start);
	},
	
	/**
	 * Same as String.match()
	 * @param {string} regexp the regular expression to match
	 * @return {Array.<string>} an array of matches
	 */
	match: function(regexp) {
		return this.str.match(regexp);
	},
	
	/**
	 * Same as String.replace()
	 * @param {string} searchValue a regular expression to search for
	 * @param {string} newValue the string to replace the matches with
	 * @return {IString} a new string with all the matches replaced
	 * with the new value
	 */
	replace: function(searchValue, newValue) {
		return new IString(this.str.replace(searchValue, newValue));
	},
	
	/**
	 * Same as String.search()
	 * @param {string} regexp the regular expression to search for
	 * @return {number} position of the match, or -1 for no match
	 */
	search: function(regexp) {
		return this.str.search(regexp);
	},
	
	/**
	 * Same as String.slice()
	 * @param {number} start first character to include in the string
	 * @param {number} end include all characters up to, but not including
	 * the end character
	 * @return {IString} a slice of the current string
	 */
	slice: function(start, end) {
		return new IString(this.str.slice(start, end));
	},
	
	/**
	 * Same as String.split()
	 * @param {string} separator regular expression to match to find
	 * separations between the parts of the text
	 * @param {number} limit maximum number of items in the final 
	 * output array. Any items beyond that limit will be ignored.
	 * @return {Array.<string>} the parts of the current string split 
	 * by the separator
	 */
	split: function(separator, limit) {
		return this.str.split(separator, limit);
	},
	
	/**
	 * Same as String.substr()
	 * @param {number} start the index of the character that should 
	 * begin the returned substring
	 * @param {number} length the number of characters to return after
	 * the start character.
	 * @return {IString} the requested substring 
	 */
	substr: function(start, length) {
		var plat = ilib._getPlatform();
		if (plat === "qt" || plat === "rhino" || plat === "trireme") {
			// qt and rhino have a broken implementation of substr(), so
			// work around it
			if (typeof(length) === "undefined") {
				length = this.str.length - start;
			}
		}
		return new IString(this.str.substr(start, length));
	},
	
	/**
	 * Same as String.substring()
	 * @param {number} from the index of the character that should 
	 * begin the returned substring
	 * @param {number} to the index where to stop the extraction. If
	 * omitted, extracts the rest of the string
	 * @return {IString} the requested substring 
	 */
	substring: function(from, to) {
		return this.str.substring(from, to);
	},
	
	/**
	 * Same as String.toLowerCase(). Note that this method is
	 * not locale-sensitive. 
	 * @return {IString} a string with the first character
	 * lower-cased
	 */
	toLowerCase: function() {
		return this.str.toLowerCase();
	},
	
	/**
	 * Same as String.toUpperCase(). Note that this method is
	 * not locale-sensitive. Use toLocaleUpperCase() instead
	 * to get locale-sensitive behaviour. 
	 * @return {IString} a string with the first character
	 * upper-cased
	 */
	toUpperCase: function() {
		return this.str.toUpperCase();
	},
	
	/**
	 * Convert the character or the surrogate pair at the given
	 * index into the string to a Unicode UCS-4 code point.
	 * @protected
	 * @param {number} index index into the string
	 * @return {number} code point of the character at the
	 * given index into the string
	 */
	_toCodePoint: function (index) {
		return IString.toCodePoint(this.str, index);
	},
	
	/**
	 * Call the callback with each character in the string one at 
	 * a time, taking care to step through the surrogate pairs in 
	 * the UTF-16 encoding properly.<p>
	 * 
	 * The standard Javascript String's charAt() method only
	 * returns a particular 16-bit character in the 
	 * UTF-16 encoding scheme.
	 * If the index to charAt() is pointing to a low- or 
	 * high-surrogate character,
	 * it will return the surrogate character rather 
	 * than the the character 
	 * in the supplementary planes that the two surrogates together 
	 * encode. This function will call the callback with the full
	 * character, making sure to join two  
	 * surrogates into one character in the supplementary planes
	 * where necessary.<p>
	 * 
	 * @param {function(string)} callback a callback function to call with each
	 * full character in the current string
	 */
	forEach: function(callback) {
		if (typeof(callback) === 'function') {
			var it = this.charIterator();
			while (it.hasNext()) {
				callback(it.next());
			}
		}
	},

	/**
	 * Call the callback with each numeric code point in the string one at 
	 * a time, taking care to step through the surrogate pairs in 
	 * the UTF-16 encoding properly.<p>
	 * 
	 * The standard Javascript String's charCodeAt() method only
	 * returns information about a particular 16-bit character in the 
	 * UTF-16 encoding scheme.
	 * If the index to charCodeAt() is pointing to a low- or 
	 * high-surrogate character,
	 * it will return the code point of the surrogate character rather 
	 * than the code point of the character 
	 * in the supplementary planes that the two surrogates together 
	 * encode. This function will call the callback with the full
	 * code point of each character, making sure to join two  
	 * surrogates into one code point in the supplementary planes.<p>
	 * 
	 * @param {function(string)} callback a callback function to call with each
	 * code point in the current string
	 */
	forEachCodePoint: function(callback) {
		if (typeof(callback) === 'function') {
			var it = this.iterator();
			while (it.hasNext()) {
				callback(it.next());
			}
		}
	},

	/**
	 * Return an iterator that will step through all of the characters
	 * in the string one at a time and return their code points, taking 
	 * care to step through the surrogate pairs in UTF-16 encoding 
	 * properly.<p>
	 * 
	 * The standard Javascript String's charCodeAt() method only
	 * returns information about a particular 16-bit character in the 
	 * UTF-16 encoding scheme.
	 * If the index is pointing to a low- or high-surrogate character,
	 * it will return a code point of the surrogate character rather 
	 * than the code point of the character 
	 * in the supplementary planes that the two surrogates together 
	 * encode.<p>
	 * 
	 * The iterator instance returned has two methods, hasNext() which
	 * returns true if the iterator has more code points to iterate through,
	 * and next() which returns the next code point as a number.<p>
	 * 
	 * @return {Object} an iterator 
	 * that iterates through all the code points in the string
	 */
	iterator: function() {
		/**
		 * @constructor
		 */
		function _iterator (istring) {
			this.index = 0;
			this.hasNext = function () {
				return (this.index < istring.str.length);
			};
			this.next = function () {
				if (this.index < istring.str.length) {
					var num = istring._toCodePoint(this.index);
					this.index += ((num > 0xFFFF) ? 2 : 1);
				} else {
					num = -1;
				}
				return num;
			};
		};
		return new _iterator(this);
	},

	/**
	 * Return an iterator that will step through all of the characters
	 * in the string one at a time, taking 
	 * care to step through the surrogate pairs in UTF-16 encoding 
	 * properly.<p>
	 * 
	 * The standard Javascript String's charAt() method only
	 * returns information about a particular 16-bit character in the 
	 * UTF-16 encoding scheme.
	 * If the index is pointing to a low- or high-surrogate character,
	 * it will return that surrogate character rather 
	 * than the surrogate pair which represents a character 
	 * in the supplementary planes.<p>
	 * 
	 * The iterator instance returned has two methods, hasNext() which
	 * returns true if the iterator has more characters to iterate through,
	 * and next() which returns the next character.<p>
	 * 
	 * @return {Object} an iterator 
	 * that iterates through all the characters in the string
	 */
	charIterator: function() {
		/**
		 * @constructor
		 */
		function _chiterator (istring) {
			this.index = 0;
			this.hasNext = function () {
				return (this.index < istring.str.length);
			};
			this.next = function () {
				var ch;
				if (this.index < istring.str.length) {
					ch = istring.str.charAt(this.index);
					if (IString._isSurrogate(ch) && 
							this.index+1 < istring.str.length && 
							IString._isSurrogate(istring.str.charAt(this.index+1))) {
						this.index++;
						ch += istring.str.charAt(this.index);
					}
					this.index++;
				}
				return ch;
			};
		};
		return new _chiterator(this);
	},
	
	/**
	 * Return the code point at the given index when the string is viewed 
	 * as an array of code points. If the index is beyond the end of the
	 * array of code points or if the index is negative, -1 is returned.
	 * @param {number} index index of the code point 
	 * @return {number} code point of the character at the given index into
	 * the string
	 */
	codePointAt: function (index) {
		if (index < 0) {
			return -1;
		}
		var count,
			it = this.iterator(),
			ch;
		for (count = index; count >= 0 && it.hasNext(); count--) {
			ch = it.next();
		}
		return (count < 0) ? ch : -1;
	},
	
	/**
	 * Set the locale to use when processing choice formats. The locale
	 * affects how number classes are interpretted. In some cultures,
	 * the limit "few" maps to "any integer that ends in the digits 2 to 9" and
	 * in yet others, "few" maps to "any integer that ends in the digits
	 * 3 or 4".
	 * @param {Locale|string} locale locale to use when processing choice
	 * formats with this string
	 * @param {boolean=} sync [optional] whether to load the locale data synchronously 
	 * or not
	 * @param {Object=} loadParams [optional] parameters to pass to the loader function
	 * @param {function(*)=} onLoad [optional] function to call when the loading is done
	 */
	setLocale: function (locale, sync, loadParams, onLoad) {
		if (typeof(locale) === 'object') {
			this.locale = locale;
		} else {
			this.localeSpec = locale;
			this.locale = new Locale(locale);
		}
		
		IString.loadPlurals(typeof(sync) !== 'undefined' ? sync : true, this.locale, loadParams, onLoad);
	},

	/**
	 * Return the locale to use when processing choice formats. The locale
	 * affects how number classes are interpretted. In some cultures,
	 * the limit "few" maps to "any integer that ends in the digits 2 to 9" and
	 * in yet others, "few" maps to "any integer that ends in the digits
	 * 3 or 4".
	 * @return {string} localespec to use when processing choice
	 * formats with this string
	 */
	getLocale: function () {
		return (this.locale ? this.locale.getSpec() : this.localeSpec) || ilib.getLocale();
	},

	/**
	 * Return the number of code points in this string. This may be different
	 * than the number of characters, as the UTF-16 encoding that Javascript
	 * uses for its basis returns surrogate pairs separately. Two 2-byte 
	 * surrogate characters together make up one character/code point in 
	 * the supplementary character planes. If your string contains no
	 * characters in the supplementary planes, this method will return the
	 * same thing as the length() method.
	 * @return {number} the number of code points in this string
	 */
	codePointLength: function () {
		if (this.cpLength === -1) {
			var it = this.iterator();
			this.cpLength = 0;
			while (it.hasNext()) { 
				this.cpLength++;
				it.next();
			};
		}
		return this.cpLength;	
	}
};

module.exports = IString;