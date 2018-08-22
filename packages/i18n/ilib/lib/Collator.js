/*
 * Collator.js - Collation routines
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

/* !depends 
Locale.js 
ilib.js 
INumber.js 
isPunct.js 
NormString.js 
MathUtils.js 
Utils.js
JSUtils.js
LocaleInfo.js 
CodePointSource.js
ElementIterator.js
*/

// !data collation

var ilib = require("./ilib.js");
var MathUtils = require("./MathUtils.js");
var Utils = require("./Utils.js");
var JSUtils = require("./JSUtils.js");
var Locale = require("./Locale.js");
var LocaleInfo = require("./LocaleInfo.js");
var INumber = require("./INumber.js");
var isPunct = require("./isPunct.js");
var isDigit = require("./isDigit.js");
var NormString = require("./NormString.js");
var CodePointSource = require("./CodePointSource.js");
var ElementIterator = require("./ElementIterator.js");
var GlyphString = require("./GlyphString.js");

/**
 * @class
 * A class that implements a locale-sensitive comparator function 
 * for use with sorting function. The comparator function
 * assumes that the strings it is comparing contain Unicode characters
 * encoded in UTF-16.<p>
 * 
 * Collations usually depend only on the language, because most collation orders 
 * are shared between locales that speak the same language. There are, however, a
 * number of instances where a locale collates differently than other locales
 * that share the same language. There are also a number of instances where a
 * locale collates differently based on the script used. This object can handle
 * these cases automatically if a full locale is specified in the options rather
 * than just a language code.<p>
 * 
 * <h2>Options</h2>
 * 
 * The options parameter can contain any of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> - String|Locale. The locale which the comparator function 
 * will collate with. Default: the current iLib locale.
 * 
 * <li><i>sensitivity</i> - String. Sensitivity or strength of collator. This is one of 
 * "primary", "base", "secondary", "accent", "tertiary", "case", "quaternary", or 
 * "variant". Default: "primary"
 *   <ol>
 *   <li>base or primary - Only the primary distinctions between characters are significant.
 *   Another way of saying that is that the collator will be case-, accent-, and 
 *   variation-insensitive, and only distinguish between the base characters
 *   <li>case or secondary - Both the primary and secondary distinctions between characters
 *   are significant. That is, the collator will be accent- and variation-insensitive
 *   and will distinguish between base characters and character case.
 *   <li>accent or tertiary - The primary, secondary, and tertiary distinctions between
 *   characters are all significant. That is, the collator will be 
 *   variation-insensitive, but accent-, case-, and base-character-sensitive. 
 *   <li>variant or quaternary - All distinctions between characters are significant. That is,
 *   the algorithm is base character-, case-, accent-, and variation-sensitive.
 *   </ol>
 *   
 * <li><i>upperFirst</i> - boolean. When collating case-sensitively in a script that
 * has the concept of case, put upper-case
 * characters first, otherwise lower-case will come first. Warning: some browsers do
 * not implement this feature or at least do not implement it properly, so if you are 
 * using the native collator with this option, you may get different results in different
 * browsers. To guarantee the same results, set useNative to false to use the ilib 
 * collator implementation. This of course will be somewhat slower, but more 
 * predictable. Default: true
 * 
 * <li><i>reverse</i> - boolean. Return the list sorted in reverse order. When the
 * upperFirst option is also set to true, upper-case characters would then come at 
 * the end of the list. Default: false.
 * 
 * <li><i>scriptOrder</i> - string. When collating strings in multiple scripts,
 * this property specifies what order those scripts should be sorted. The default
 * Unicode Collation Algorithm (UCA) already has a default order for scripts, but
 * this can be tailored via this property. The value of this option is a 
 * space-separated list of ISO 15924 scripts codes. If a code is specified in this
 * property, its default data must be included using the JS assembly tool. If the
 * data is not included, the ordering for the script will be ignored. Default:
 * the default order defined by the UCA. 
 * 
 * <li><i>style</i> - The value of the style parameter is dependent on the locale.
 * For some locales, there are different styles of collating strings depending
 * on what kind of strings are being collated or what the preference of the user 
 * is. For example, in German, there is a phonebook order and a dictionary ordering
 * that sort the same array of strings slightly differently.
 * The static method {@link Collator#getAvailableStyles} will return a list of styles that ilib
 * currently knows about for any given locale. If the value of the style option is 
 * not recognized for a locale, it will be ignored. Default style is "standard".<p>
 * 
 * <li><i>usage</i> - Whether this collator will be used for searching or sorting.
 * Valid values are simply the strings "sort" or "search". When used for sorting,
 * it is good idea if a collator produces a stable sort. That is, the order of the 
 * sorted array of strings should not depend on the order of the strings in the
 * input array. As such, when a collator is supposed to act case insensitively, 
 * it nonetheless still distinguishes between case after all other criteria
 * are satisfied so that strings that are distinguished only by case do not sort
 * randomly. For searching, we would like to match two strings that different only 
 * by case, so the collator must return equals in that situation instead of 
 * further distinguishing by case. Default is "sort".
 * 
 * <li><i>numeric</i> - Treat the left and right strings as if they started with
 * numbers and sort them numerically rather than lexically.
 * 
 * <li><i>ignorePunctuation</i> - Skip punctuation characters when comparing the
 * strings.
 *  
 * <li>onLoad - a callback function to call when the collator object is fully 
 * loaded. When the onLoad option is given, the collator object will attempt to
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
 * 
 * <li><i>useNative</i> - when this option is true, use the native Intl object
 * provided by the Javascript engine, if it exists, to implement this class. If
 * it doesn't exist, or if this parameter is false, then this class uses a pure 
 * Javascript implementation, which is slower and uses a lot more memory, but 
 * works everywhere that ilib works. Default is "true".
 * </ul>
 * 
 * <h2>Operation</h2>
 * 
 * The Collator constructor returns a collator object tailored with the above 
 * options. The object contains an internal compare() method which compares two 
 * strings according to those options. This can be used directly to compare
 * two strings, but is not useful for passing to the javascript sort function
 * because then it will not have its collation data available. Instead, use the 
 * getComparator() method to retrieve a function that is bound to the collator
 * object. (You could also bind it yourself using ilib.bind()). The bound function 
 * can be used with the standard Javascript array sorting algorithm, or as a 
 * comparator with your own sorting algorithm.<p>
 * 
 * Example using the standard Javascript array sorting call with the bound
 * function:<p>
 * 
 * <code>
 * <pre>
 * var arr = ["ö", "oe", "ü", "o", "a", "ae", "u", "ß", "ä"];
 * var collator = new Collator({locale: 'de-DE', style: "dictionary"});
 * arr.sort(collator.getComparator());
 * console.log(JSON.stringify(arr));
 * </pre>
 * </code>
 * <p>
 * 
 * Would give the output:<p>
 * 
 * <code>
 * <pre>
 * ["a", "ae", "ä", "o", "oe", "ö", "ß", "u", "ü"]
 * </pre>
 * </code>
 * 
 * When sorting an array of Javascript objects according to one of the 
 * string properties of the objects, wrap the collator's compare function 
 * in your own comparator function that knows the structure of the objects
 * being sorted:<p>
 * 
 * <code>
 * <pre>
 * var collator = new Collator({locale: 'de-DE'});
 * var myComparator = function (collator) {
 *   var comparator = collator.getComparator();
 *   // left and right are your own objects
 *   return function (left, right) {
 *   	return comparator(left.x.y.textProperty, right.x.y.textProperty);
 *   };
 * };
 * arr.sort(myComparator(collator));
 * </pre>
 * </code>
 * <p>
 * 
 * <h2>Sort Keys</h2>
 * 
 * The collator class also has a method to retrieve the sort key for a
 * string. The sort key is an array of values that represent how each  
 * character in the string should be collated according to the characteristics
 * of the collation algorithm and the given options. Thus, sort keys can be 
 * compared directly value-for-value with other sort keys that were generated 
 * by the same collator, and the resulting ordering is guaranteed to be the 
 * same as if the original strings were compared by the collator.
 * Sort keys generated by different collators are not guaranteed to give
 * any reasonable results when compared together unless the two collators 
 * were constructed with 
 * exactly the same options and therefore end up representing the exact same 
 * collation sequence.<p>
 * 
 * A good rule of thumb is that you would use a sort key if you had 10 or more
 * items to sort or if your array might be resorted arbitrarily. For example, if your 
 * user interface was displaying a table with 100 rows in it, and each row had
 * 4 sortable text columns which could be sorted in acending or descending order,
 * the recommended practice would be to generate a sort key for each of the 4
 * sortable fields in each row and store that in the Javascript representation of the
 * table data. Then, when the user clicks on a column header to resort the
 * table according to that column, the resorting would be relatively quick 
 * because it would only be comparing arrays of values, and not recalculating 
 * the collation values for each character in each string for every comparison.<p>
 * 
 * For tables that are large, it is usually a better idea to do the sorting
 * on the server side, especially if the table is the result of a database
 * query. In this case, the table is usually a view of the cursor of a large
 * results set, and only a few entries are sent to the front end at a time.
 * In order to sort the set efficiently, it should be done on the database
 * level instead.
 * 
 * <h2>Data</h2>
 * 
 * Doing correct collation entails a huge amount of mapping data, much of which is
 * not necessary when collating in one language with one script, which is the most
 * common case. Thus, ilib implements a number of ways to include the data you
 * need or leave out the data you don't need using the JS assembly tool:
 * 
 * <ol>
 * <li>Full multilingual data - if you are sorting multilingual data and need to collate 
 * text written in multiple scripts, you can use the directive "!data collation/ducet" to 
 * load in the full collation data.  This allows the collator to perform the entire 
 * Unicode Collation Algorithm (UCA) based on the Default Unicode Collation Element 
 * Table (DUCET). The data is very large, on the order of multiple megabytes, but 
 * sometimes it is necessary.
 * <li>A few scripts - if you are sorting text written in only a few scripts, you may 
 * want to include only the data for those scripts. Each ISO 15924 script code has its
 * own data available in a separate file, so you can use the data directive to include
 * only the data for the scripts you need. For example, use  
 * "!data collation/Latn" to retrieve the collation information for the Latin script.
 * Because the "ducet" table mentioned in the previous point is a superset of the 
 * tables for all other scripts, you do not need to include explicitly the data for 
 * any particular script when using "ducet". That is, you either include "ducet" or 
 * you include a specific list of scripts.
 * <li>Only one script - if you are sorting text written only in one script, you can
 * either include the data directly as in the previous point, or you can rely on the 
 * locale to include the correct data for you. In this case, you can use the directive
 * "!data collate" to load in the locale's collation data for its most common script.
 * </ol>
 *   
 * With any of the above ways of including the data, the collator will only perform the
 * correct language-sensitive sorting for the given locale. All other scripts will be
 * sorted in the default manner according to the UCA. For example, if you include the
 * "ducet" data and pass in "de-DE" (German for Germany) as the locale spec, then
 * only the Latin script (the default script for German) will be sorted according to
 * German rules. All other scripts in the DUCET, such as Japanese or Arabic, will use 
 * the default UCA collation rules.<p>
 * 
 * If this collator encounters a character for which it has no collation data, it will
 * sort those characters by pure Unicode value after all characters for which it does have
 * collation data. For example, if you only loaded in the German collation data (ie. the
 * data for the Latin script tailored to German) to sort a list of person names, but that
 * list happens to include the names of a few Japanese people written in Japanese 
 * characters, the Japanese names will sort at the end of the list after all German names,
 * and will sort according to the Unicode values of the characters.
 * 
 * @constructor
 * @param {Object} options options governing how the resulting comparator 
 * function will operate
 */
var Collator = function(options) {
	var sync = true,
		loadParams = undefined,
		useNative = true;

	// defaults
	/** 
	 * @private
	 * @type {Locale} 
	 */
	this.locale = new Locale(ilib.getLocale());
	
	/** @private */
	this.caseFirst = "upper";
	/** @private */
	this.sensitivity = "variant";
	/** @private */
	this.level = 4;
	/** @private */
	this.usage = "sort";
	/** @private */
	this.reverse = false;
	/** @private */
	this.numeric = false;
	/** @private */
	this.style = "default";
	/** @private */
	this.ignorePunctuation = false;
	
	if (options) {
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? new Locale(options.locale) : options.locale;
		}
		if (options.sensitivity) {
			switch (options.sensitivity) {
				case 'primary':
				case 'base':
					this.sensitivity = "base";
					this.level = 1;
					break;
				case 'secondary':
				case 'accent':
					this.sensitivity = "accent";
					this.level = 2;
					break;
				case 'tertiary':
				case 'case':
					this.sensitivity = "case";
					this.level = 3;
					break;
				case 'quaternary':
				case 'variant':
					this.sensitivity = "variant";
					this.level = 4;
					break;
			}
		}
		if (typeof(options.upperFirst) !== 'undefined') {
			this.caseFirst = options.upperFirst ? "upper" : "lower"; 
		}
		
		if (typeof(options.ignorePunctuation) !== 'undefined') {
			this.ignorePunctuation = options.ignorePunctuation;
		}
		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync == true);
		}
		
		loadParams = options.loadParams;
		if (typeof(options.useNative) !== 'undefined') {
			useNative = options.useNative;
		}
		
		if (options.usage === "sort" || options.usage === "search") {
			this.usage = options.usage;
		}
		
		if (typeof(options.reverse) === 'boolean') {
			this.reverse = options.reverse;
		}

		if (typeof(options.numeric) === 'boolean') {
			this.numeric = options.numeric;
		}
		
		if (typeof(options.style) === 'string') {
			this.style = options.style;
		}
	} else {
	    options = {sync: true};
	}

	if (this.usage === "sort") {
		// produces a stable sort
		this.level = 4;
	}

	if (useNative && typeof(Intl) !== 'undefined' && Intl) {
		// this engine is modern and supports the new Intl object!
		//console.log("implemented natively");
		/** 
		 * @private
		 * @type {{compare:function(string,string)}} 
		 */
		this.collator = new Intl.Collator(this.locale.getSpec(), {
			sensitivity: this.sensitivity,
			caseFirst: this.caseFirst,
			ignorePunctuation: this.ignorePunctuation,
			numeric: this.numeric,
			usage: this.usage
		});
		
		if (options && typeof(options.onLoad) === 'function') {
			options.onLoad(this);
		}
	} else {
		//console.log("implemented in pure JS");
		
		// else implement in pure Javascript
		Utils.loadData({
			object: "Collator", 
			locale: this.locale, 
			name: "collation.json",
			sync: sync,
			loadParams: loadParams, 
			callback: ilib.bind(this, function (collation) {
				if (!collation) {
					collation = ilib.data.collation;
					var spec = this.locale.getSpec().replace(/-/g, '_');
					ilib.data.cache.Collator[spec] = collation;
				}
				this._initCollation(collation);
		        if (this.ignorePunctuation) {
		            isPunct._init(sync, loadParams, ilib.bind(this, function() {
		                this._init(options);
		            }));
		        } else {
		            this._init(options);
		        }
			})
		});
	}
};

Collator.prototype = {
    /**
     * @private
     */
    _init: function(options) {
        if (this.numeric) {
            // Create a fake INumber instance now to guarantee that the locale data 
            // is loaded so we can create sync INumber instances later, even in async mode
            new INumber("1", {
                sync: options.sync,
                loadParams: options.loadParams,
                onLoad: function(n) {
                    if (typeof(options.onLoad) === 'function') {
                        options.onLoad(this);
                    }
                }
            })
        } else {
            if (typeof(options.onLoad) === 'function') {
                options.onLoad(this);
            }
        }
    },
        
	/**
	 * @private
	 * Bit pack an array of values into a single number
	 * @param {number|null|Array.<number>} arr array of values to bit pack
	 * @param {number} offset offset for the start of this map
	 */
	_pack: function (arr, offset) {
		var value = 0;
		if (arr) {
			if (typeof(arr) === 'number') {
				arr = [ arr ];
			}
			for (var i = 0; i < this.level; i++) {
				var thisLevel = (typeof(arr[i]) !== "undefined" ? arr[i] : 0);
				if (i === 0) {
					thisLevel += offset;
				}
				if (i > 0) {
					value <<= this.collation.bits[i];	
				}
				if (i === 2 && this.caseFirst === "lower") {
					// sort the lower case first instead of upper
					value = value | (1 - thisLevel);
				} else {
					value = value | thisLevel;
				}
			}
		}
		return value;
	},
	
	/**
	 * @private
	 * Return the rule packed into an array of collation elements.
	 * @param {Array.<number|null|Array.<number>>} rule
	 * @param {number} offset
	 * @return {Array.<number>} a bit-packed array of numbers
	 */
	_packRule: function(rule, offset) {
		if (ilib.isArray(rule[0])) {
			var ret = [];
			for (var i = 0; i < rule.length; i++) {
				ret.push(this._pack(rule[i], offset));
			}
			return ret;
		} else {
			return [ this._pack(rule, offset) ];
		}
	},
    
	/**
	 * @private
	 */
	_addChars: function (str, offset) {
		var gs = new GlyphString(str);
		var it = gs.charIterator();
		var c;
		
		while (it.hasNext()) {
			c = it.next();
			if (c === "'") {
				// escape a sequence of chars as one collation element
				c = "";
				var x = "";
				while (it.hasNext() && x !== "'") {
					c += x;
					x = it.next();
				}
			}
			this.lastMap++;
			this.map[c] = this._packRule([this.lastMap], offset);
		}
	},
	
	/**
	 * @private
	 */
	_addRules: function(rules, start) {
	    var p;
	    for (var r in rules.map) {
	        if (r) {
	            this.map[r] = this._packRule(rules.map[r], start);
	            p = typeof(rules.map[r][0]) === 'number' ? rules.map[r][0] : rules.map[r][0][0];
	            this.lastMap = Math.max(p + start, this.lastMap);
	        }
	    }

	    if (typeof(rules.ranges) !== 'undefined') {
	        // for each range, everything in the range goes in primary sequence from the start
	        for (var i = 0; i < rules.ranges.length; i++) {
	            var range = rules.ranges[i];

	            this.lastMap = range.start;
	            if (typeof(range.chars) === "string") {
	                this._addChars(range.chars, start);
	            } else {
	                for (var k = 0; k < range.chars.length; k++) {
	                    this._addChars(range.chars[k], start);
	                }
	            }
	        }
	    }
	},
	
	/**
     * @private
     */
	_initCollation: function(rules) {
	    var rule = this.style;
	    while (typeof(rule) === 'string') {
	        rule = rules[rule];
	    }

	    if (!rule) {
	        rule = "default";

	        while (typeof(rule) === 'string') {
	            rule = rules[rule];
	        }
	    }
	    if (!rule) {
	        this.map = {};
	        return;
	    }

	    /** 
	     * @private
	     * @type {{scripts:Array.<string>,bits:Array.<number>,maxes:Array.<number>,bases:Array.<number>,map:Object.<string,Array.<number|null|Array.<number>>>}}
	     */
	    this.collation = rule;
	    this.map = {};
	    this.lastMap = -1;
	    this.keysize = this.collation.keysize[this.level-1];
	    this.defaultRule = rules["default"];

	    if (typeof(this.collation.inherit) !== 'undefined') {
	        for (var i = 0; i < this.collation.inherit.length; i++) {
	            if (this.collation.inherit === 'this') {
	                continue;
	            }
	            var col = this.collation.inherit[i];
	            rule = typeof(col) === 'object' ? col.name : col;
	            if (rules[rule]) {
	                this._addRules(rules[rule], col.start || this.lastMap+1);
	            }
	        }
	    }
	    this._addRules(this.collation, this.lastMap+1);
	},
    
    /**
     * @private
     */
    _basicCompare: function(left, right) {
		var l = (left instanceof NormString) ? left : new NormString(left),
			r = (right instanceof NormString) ? right : new NormString(right),
			lchar, 
			rchar,
			lelements,
			relements;
		
		if (this.numeric) {
			var lvalue = new INumber(left, {locale: this.locale});
			var rvalue = new INumber(right, {locale: this.locale});
			if (!isNaN(lvalue.valueOf()) && !isNaN(rvalue.valueOf())) {
				var diff = lvalue.valueOf() - rvalue.valueOf();
				if (diff) {
					return diff;
				} else {
					// skip the numeric part and compare the rest lexically
					l = new NormString(left.substring(lvalue.parsed.length));
					r = new NormString(right.substring(rvalue.parsed.length));
				}
			}
			// else if they aren't both numbers, then let the code below take care of the lexical comparison instead
		}
			
		lelements = new ElementIterator(new CodePointSource(l, this.ignorePunctuation), this.map, this.keysize);
		relements = new ElementIterator(new CodePointSource(r, this.ignorePunctuation), this.map, this.keysize);
		
		while (lelements.hasNext() && relements.hasNext()) {
			var diff = lelements.next() - relements.next();
			if (diff) {
				return diff;
			}
		}
		if (!lelements.hasNext() && !relements.hasNext()) {
			return 0;
		} else if (lelements.hasNext()) {
			return 1;
		} else {
			return -1;
		}
    },
    
	/**
	 * Compare two strings together according to the rules of this 
	 * collator instance. Do not use this function directly with 
	 * Array.sort, as it will not have its collation data available
	 * and therefore will not function properly. Use the function
	 * returned by getComparator() instead.
	 * 
	 * @param {string} left the left string to compare
	 * @param {string} right the right string to compare
	 * @return {number} a negative number if left comes before right, a
	 * positive number if right comes before left, and zero if left and 
	 * right are equivalent according to this collator
	 */
	compare: function (left, right) {
		// last resort: use the "C" locale
		if (this.collator) {
			// implemented by the core engine
			return this.collator.compare(left, right);
		}

		var ret = this._basicCompare(left, right);
		return this.reverse ? -ret : ret;
	},
	
	/**
	 * Return a comparator function that can compare two strings together
	 * according to the rules of this collator instance. The function 
	 * returns a negative number if the left 
	 * string comes before right, a positive number if the right string comes 
	 * before the left, and zero if left and right are equivalent. If the
	 * reverse property was given as true to the collator constructor, this 
	 * function will
	 * switch the sign of those values to cause sorting to happen in the
	 * reverse order.
	 * 
	 * @return {function(...)|undefined} a comparator function that 
	 * can compare two strings together according to the rules of this 
	 * collator instance
	 */
	getComparator: function() {
		// bind the function to this instance so that we have the collation
		// rules available to do the work
		if (this.collator) {
			// implemented by the core engine
			return this.collator.compare;
		}
		
		return ilib.bind(this, this.compare);
	},
	
	/**
	 * Return a sort key string for the given string. The sort key
	 * string is a list of values that represent each character 
	 * in the original string. The sort key
	 * values for any particular character consists of 3 numbers that
	 * encode the primary, secondary, and tertiary characteristics
	 * of that character. The values of each characteristic are 
	 * modified according to the strength of this collator instance 
	 * to give the correct collation order. The idea is that this
	 * sort key string is directly comparable byte-for-byte to 
	 * other sort key strings generated by this collator without
	 * any further knowledge of the collation rules for the locale.
	 * More formally, if a < b according to the rules of this collation, 
	 * then it is guaranteed that sortkey(a) < sortkey(b) when compared
	 * byte-for-byte. The sort key string can therefore be used
	 * without the collator to sort an array of strings efficiently
	 * because the work of determining the applicability of various
	 * collation rules is done once up-front when generating 
	 * the sort key.<p>
	 * 
	 * The sort key string can be treated as a regular, albeit somewhat
	 * odd-looking, string. That is, it can be pass to regular 
	 * Javascript functions without problems.  
	 * 
	 * @param {string} str the original string to generate the sort key for
	 * @return {string} a sort key string for the given string
	 */
	sortKey: function (str) {
		if (!str) {
			return "";
		}
		
		if (this.collator) {
			// native, no sort keys available
			return str;
		}
		
		if (this.numeric) {
			var v = new INumber(str, {locale: this.locale});
			var s = isNaN(v.valueOf()) ? "" : v.valueOf().toString(16);
			return JSUtils.pad(s, 16);	
		} else {
			var n = (typeof(str) === "string") ? new NormString(str) : str,
				ret = "",
				lelements = new ElementIterator(new CodePointSource(n, this.ignorePunctuation), this.map, this.keysize),
				element;
			
			while (lelements.hasNext()) {
				element = lelements.next();
				if (this.reverse) {
					// for reverse, take the bitwise inverse
					element = (1 << this.keysize) - element;
				}
				ret += JSUtils.pad(element.toString(16), this.keysize/4);	
			}
		}
		return ret;
	}
};

/**
 * Retrieve the list of collation style names that are available for the 
 * given locale. This list varies depending on the locale, and depending
 * on whether or not the data for that locale was assembled into this copy
 * of ilib.
 * 
 * @param {Locale|string=} locale The locale for which the available
 * styles are being sought
 * @return Array.<string> an array of style names that are available for
 * the given locale
 */
Collator.getAvailableStyles = function (locale) {
	return [ "standard" ];
};

/**
 * Retrieve the list of ISO 15924 script codes that are available in this
 * copy of ilib. This list varies depending on whether or not the data for 
 * various scripts was assembled into this copy of ilib. If the "ducet"
 * data is assembled into this copy of ilib, this method will report the
 * entire list of scripts as being available. If a collator instance is
 * instantiated with a script code that is not on the list returned by this
 * function, it will be ignored and text in that script will be sorted by
 * numeric Unicode values of the characters.
 * 
 * @return Array.<string> an array of ISO 15924 script codes that are 
 * available
 */
Collator.getAvailableScripts = function () {
	return [ "Latn" ];
};


/**
 * Return a default collation style
 *  
 * @returns {string} default collation style such as 'latin', 'korean' etc */
Collator.prototype.getDefaultCollatorStyle = function () {
	return this.defaultRule;
};

module.exports = Collator;
