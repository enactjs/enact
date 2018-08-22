/*
 * Name.js - Person name parser
 *
 * Copyright © 2013-2015, 2018, JEDLSoft
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
ilib.js 
Locale.js
Utils.js 
isAlpha.js 
isIdeo.js 
isPunct.js 
isSpace.js
JSUtils.js 
IString.js
*/

// !data name

// notes:
// icelandic given names: http://en.wiktionary.org/wiki/Appendix:Icelandic_given_names
// danish approved given names: http://www.familiestyrelsen.dk/samliv/navne/
// http://www.mentalfloss.com/blogs/archives/59277
// other countries with first name restrictions: Norway, China, New Zealand, Japan, Sweden, Germany, Hungary

var ilib = require("./ilib.js");
var Utils = require("./Utils.js");
var JSUtils = require("./JSUtils.js");

var Locale = require("./Locale.js");
var IString = require("./IString.js");
var CType = require("./CType.js");
var isAlpha = require("./isAlpha.js");
var isIdeo = require("./isIdeo.js");
var isPunct = require("./isPunct.js");
var isSpace = require("./isSpace.js");

/**
 * @class
 * A class to parse names of people. Different locales have different conventions when it
 * comes to naming people.<p>
 *
 * The options can contain any of the following properties:
 *
 * <ul>
 * <li><i>locale</i> - use the rules and conventions of the given locale in order to parse
 * the name
 * <li><i>style</i> - explicitly use the named style to parse the name. Valid values so
 * far are "western" and "asian". If this property is not specified, then the style will
 * be gleaned from the name itself. This class will count the total number of Latin or Asian
 * characters. If the majority of the characters are in one style, that style will be
 * used to parse the whole name.
 * <li><i>order</i> - explicitly use the given order for names. In some locales, such
 * as Russian, names may be written equally validly as "givenName familyName" or "familyName
 * givenName". This option tells the parser which order to prefer, and overrides the
 * default order for the locale. Valid values are "gf" (given-family) or "fg" (family-given).
 * <li><i>useSpaces</i> - explicitly specifies whether to use spaces or not between the given name , middle name
 * and family name.
 * <li><i>compoundFamilyName</i> - for Asian and some other types of names, search for compound
 * family names. If this parameter is not specified, the default is to use the setting that is
 * most common for the locale. If it is specified, the locale default is 
 * overridden with this flag.
 * <li>onLoad - a callback function to call when the name info is fully
 * loaded and the name has been parsed. When the onLoad option is given, the name object
 * will attempt to load any missing locale data using the ilib loader callback.
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
 * 
 * Additionally, a name instance can be constructed by giving the explicit 
 * already-parsed fields or by using another name instance as the parameter. (That is,
 * it becomes a copy constructor.) The name fields can be any of the following:
 * 
 * <ul>
 * <li><i>prefix</i> - the prefix prepended to the name
 * <li><i>givenName</i> - the person's given or "first" name
 * <li><i>middleName</i> - one or more middle names, separated by spaces even if the
 * language doesn't use usually use spaces. The spaces are merely separators.
 * <li><i>familyName</i> - one or more family or "last" names, separated by spaces 
 * even if the language doesn't use usually use spaces. The spaces are merely separators.
 * <li><i>suffix</i> - the suffix appended to the name
 * <li><i>honorific</i> - the honorific title of the name. This could be formatted
 * as a prefix or a suffix, depending on the customs of the particular locale. You
 * should only give either an honorific or a prefix/suffix, but not both.
 * </ul>
 *
 * When the parser has completed its parsing, it fills in the same fields as listed 
 * above.<p>
 *
 * For names that include auxilliary words, such as the family name "van der Heijden", all
 * of the auxilliary words ("van der") will be included in the field.<p>
 *
 * For names in some Spanish locales, it is assumed that the family name is doubled. That is,
 * a person may have a paternal family name followed by a maternal family name. All
 * family names will be listed in the familyName field as normal, separated by spaces.
 * When formatting the short version of such names, only the paternal family name is used.
 *
 * @constructor
 * @param {string|Name|Object=} name the name to parse
 * @param {Object=} options Options governing the construction of this name instance
 */
var Name = function (name, options) {
    var sync = true;

    if (!name || name.length === 0) {
        if (options && typeof(options.onLoad) === 'function') {
            options.onLoad(undefined);
        }
        return;
    }

    this.loadParams = {};

    if (options) {
        if (options.locale) {
            this.locale = (typeof (options.locale) === 'string') ? new Locale(options.locale) : options.locale;
        }

        if (options.style && (options.style === "asian" || options.style === "western")) {
            this.style = options.style;
        }

        if (options.order && (options.order === "gmf" || options.order === "fmg" || options.order === "fgm")) {
            this.order = options.order;
        }

        if (typeof(options.sync) === 'boolean') {
            sync = options.sync;
        }

        if (typeof(options.loadParams) !== 'undefined') {
            this.loadParams = options.loadParams;
        }
        
        if (typeof(options.compoundFamilyName) !== 'undefined') {
            this.singleFamilyName = !options.compoundFamilyName; 
        }
    }

    this.locale = this.locale || new Locale();
	
	isAlpha._init(sync, this.loadParams, ilib.bind(this, function() {
		isIdeo._init(sync, this.loadParams, ilib.bind(this, function() {
			isPunct._init(sync, this.loadParams, ilib.bind(this, function() {
				isSpace._init(sync, this.loadParams, ilib.bind(this, function() {
					Utils.loadData({
						object: "Name", 
						locale: this.locale, 
						name: "name.json", 
						sync: sync, 
						loadParams: this.loadParams, 
						callback: ilib.bind(this, function (info) {
							if (!info) {
								info = Name.defaultInfo[this.style || "western"];
								var spec = this.locale.getSpec().replace(/-/g, "_");
								ilib.data.cache.Name[spec] = info;
							}
                            if (typeof (name) === 'object') {
    							    // copy constructor
							    /**
							     * The prefixes for this name
							     * @type {string|Array.<string>}
							     */
							    this.prefix = name.prefix;
							    /**
							     * The given (personal) name in this name.
							     * @type {string|Array.<string>}
							     */
							    this.givenName = name.givenName;
							    /**
							     * The middle names used in this name. If there are multiple middle names, they all
							     * appear in this field separated by spaces.
							     * @type {string|Array.<string>}
							     */
							    this.middleName = name.middleName;
							    /**
							     * The family names in this name. If there are multiple family names, they all
							     * appear in this field separated by spaces.
							     * @type {string|Array.<string>}
							     */
							    this.familyName = name.familyName;
							    /**
							     * The suffixes for this name. If there are multiple suffixes, they all
							     * appear in this field separated by spaces.
							     * @type {string|Array.<string>}
							     */
							    this.suffix = name.suffix;
							    /**
							     * The honorific title for this name. This honorific will be used as the prefix
							     * or suffix as dictated by the locale
							     * @type {string|Array.<string>}
							     */
							    this.honorific = name.honorific;

							    // private properties
							    this.locale = name.locale;
							    this.style = name.style;
							    this.order = name.order;
							    this.useSpaces = name.useSpaces;
							    this.isAsianName = name.isAsianName;
							    
							    if (options && typeof(options.onLoad) === 'function') {
	                                options.onLoad(this);
	                            }
							    
					    	        return;
						    }
							/** 
							 * @type {{
							 *   nameStyle:string,
							 *   order:string,
							 *   prefixes:Array.<string>,
							 *   suffixes:Array.<string>,
							 *   auxillaries:Array.<string>,
							 *   honorifics:Array.<string>,
							 *   knownFamilyNames:Array.<string>,
							 *   noCompoundFamilyNames:boolean,
							 *   sortByHeadWord:boolean
							 * }} */
							this.info = info;
							this._init(name);
							if (options && typeof(options.onLoad) === 'function') {
								options.onLoad(this);
							}
						})
					});					
				}));
			}));
		}));
	}));
};

Name.defaultInfo = {
	"western": ilib.data.name || {
		"components": {
			"short": "gf",
			"medium": "gmf",
			"long": "pgmf",
			"full": "pgmfs",
			"formal_short": "hf",
			"formal_long": "hgf"
		},
		"format": "{prefix} {givenName} {middleName} {familyName}{suffix}",
		"sortByHeadWord": false,
		"nameStyle": "western",
		"conjunctions": {
			"and1": "and",
			"and2": "and",
			"or1": "or",
			"or2": "or"
		},
		"auxillaries": {
			"von": 1,
			"von der": 1,
			"von den": 1,
			"van": 1,
			"van der": 1,
			"van de": 1,
			"van den": 1,
			"de": 1,
			"di": 1,
			"la": 1,
			"lo": 1,
			"des": 1,
			"le": 1,
			"les": 1,
			"du": 1,
			"de la": 1,
			"del": 1,
			"de los": 1,
			"de las": 1
		},
		"prefixes": [
	        "doctor",
	        "dr",
	        "mr",
	        "mrs",
	        "ms",
	        "mister",
	        "madame",
	        "madamoiselle",
	        "miss",
	        "monsieur",
	        "señor",
	        "señora",
	        "señorita"
		],
		"suffixes": [
	        ",",
	        "junior",
	        "jr",
	        "senior",
	        "sr",
	        "i",
	        "ii",
	        "iii",
	        "esq",
	        "phd",
	        "md"
		],
	    "patronymicName":[ ],
	    "familyNames":[ ]
	},
	"asian": {
		"components": {
			"short": "gf",
			"medium": "gmf",
			"long": "hgmf",
			"full": "hgmf",
			"formal_short": "hf",
			"formal_long": "hgf"
		},
		"format": "{prefix}{familyName}{middleName}{givenName}{suffix}",
		"nameStyle": "asian",
		"sortByHeadWord": false,
		"conjunctions": {},
		"auxillaries": {},
		"prefixes": [],
		"suffixes": [],
	    "patronymicName":[],
	    "familyNames":[]
	}
};

/**
 * Return true if the given character is in the range of the Han, Hangul, or kana
 * scripts.
 * @static
 * @protected
 */
Name._isAsianChar = function(c) {
	return isIdeo(c) ||
		CType.withinRange(c, "hangul") ||
		CType.withinRange(c, "hiragana") ||
		CType.withinRange(c, "katakana");
};


/**
 * @static
 * @protected
 */
Name._isAsianName = function (name, language) {
    // the idea is to count the number of asian chars and the number
    // of latin chars. If one is greater than the other, choose
    // that style.
    var asian = 0,
        latin = 0,
        i;

    if (name && name.length > 0) {
        for (i = 0; i < name.length; i++) {
        	var c = name.charAt(i);

            if (Name._isAsianChar(c)) {
                if (language =="ko" || language =="ja" || language =="zh") {
                    return true;
                }
                asian++;
            } else if (isAlpha(c)) {
                if (!language =="ko" || !language =="ja" || !language =="zh") {
                    return false;
                }
                latin++;
            }
        }

        return latin < asian;
    }

    return false;
};

/**
 * Return true if any Latin letters are found in the string. Return
 * false if all the characters are non-Latin.
 * @static
 * @protected
 */
Name._isEuroName = function (name, language) {
    var c,
        n = new IString(name),
        it = n.charIterator();

    while (it.hasNext()) {
        c = it.next();

        if (!Name._isAsianChar(c) && !isPunct(c) && !isSpace(c)) {
            return true;
        } else if (Name._isAsianChar(c) && (language =="ko" || language =="ja" || language =="zh")) {
            return false;
        }
    }
    return false;
};

Name.prototype = {
    /**
     * @protected
     */
    _init: function (name) {
        var parts, prefixArray, prefix, prefixLower,
            suffixArray, suffix, suffixLower,
            i, info, hpSuffix;
        var currentLanguage = this.locale.getLanguage();

        if (name) {
            // for DFISH-12905, pick off the part that the LDAP server automatically adds to our names in HP emails
            i = name.search(/\s*[,\/\(\[\{<]/);
            if (i !== -1) {
                hpSuffix = name.substring(i);
                hpSuffix = hpSuffix.replace(/\s+/g, ' '); // compress multiple whitespaces
                suffixArray = hpSuffix.split(" ");
                var conjunctionIndex = this._findLastConjunction(suffixArray);
                if (conjunctionIndex > -1) {
                    // it's got conjunctions in it, so this is not really a suffix
                    hpSuffix = undefined;
                } else {
                    name = name.substring(0, i);
                }
            }

            this.isAsianName = Name._isAsianName(name, currentLanguage);
            if (this.info.nameStyle === "asian") {
                info = this.isAsianName ? this.info : Name.defaultInfo.western;
            } else {
                info = this.isAsianName ? Name.defaultInfo.asian : this.info;
            }

            if (this.isAsianName) {
                // all-asian names
                if (this.useSpaces == false) {
                    name = name.replace(/\s+/g, ''); // eliminate all whitespaces
                }
                parts = name.trim().split('');
            }
            //} 
            else {
                name = name.replace(/, /g, ' , ');
                name = name.replace(/\s+/g, ' '); // compress multiple whitespaces
                parts = name.trim().split(' ');
            }

            // check for prefixes
            if (parts.length > 1) {
                for (i = parts.length; i > 0; i--) {
                    prefixArray = parts.slice(0, i);
                    prefix = prefixArray.join(this.isAsianName ? '' : ' ');
                    prefixLower = prefix.toLowerCase();
                    prefixLower = prefixLower.replace(/[,\.]/g, ''); // ignore commas and periods
                    if (ilib.isArray(this.info.prefixes) &&
                        (JSUtils.indexOf(this.info.prefixes, prefixLower) > -1 || this._isConjunction(prefixLower))) {
                        if (this.prefix) {
                            if (!this.isAsianName) {
                                this.prefix += ' ';
                            }
                            this.prefix += prefix;
                        } else {
                            this.prefix = prefix;
                        }
                        parts = parts.slice(i);
                        i = parts.length;
                    }
                }
            }
            // check for suffixes
            if (parts.length > 1) {
                for (i = parts.length; i > 0; i--) {
                    suffixArray = parts.slice(-i);
                    suffix = suffixArray.join(this.isAsianName ? '' : ' ');
                    suffixLower = suffix.toLowerCase();
                    suffixLower = suffixLower.replace(/[\.]/g, ''); // ignore periods
                    if (ilib.isArray(this.info.suffixes) && JSUtils.indexOf(this.info.suffixes, suffixLower) > -1) {
                        if (this.suffix) {
                            if (!this.isAsianName && !isPunct(this.suffix.charAt(0))) {
                                this.suffix = ' ' + this.suffix;
                            }
                            this.suffix = suffix + this.suffix;
                        } else {
                            this.suffix = suffix;
                        }
                        parts = parts.slice(0, parts.length - i);
                        i = parts.length;
                    }
                }
            }

            if (hpSuffix) {
                this.suffix = (this.suffix && this.suffix + hpSuffix) || hpSuffix;
            }

            // adjoin auxillary words to their headwords
            if (parts.length > 1 && !this.isAsianName) {
                parts = this._joinAuxillaries(parts, this.isAsianName);
            }

            if (this.isAsianName) {
                this._parseAsianName(parts, currentLanguage);
            } else {
                this._parseWesternName(parts);
            }

            this._joinNameArrays();
        }
    },

    /**
	 * @return {number} 
	 *
	_findSequence: function(parts, hash, isAsian) {
		var sequence, sequenceLower, sequenceArray, aux = [], i, ret = {};
		
		if (parts.length > 0 && hash) {
			//console.info("_findSequence: finding sequences");
			for (var start = 0; start < parts.length-1; start++) {
				for ( i = parts.length; i > start; i-- ) {
					sequenceArray = parts.slice(start, i);
					sequence = sequenceArray.join(isAsian ? '' : ' ');
					sequenceLower = sequence.toLowerCase();
					sequenceLower = sequenceLower.replace(/[,\.]/g, '');  // ignore commas and periods
					
					//console.info("_findSequence: checking sequence: '" + sequenceLower + "'");
					
					if ( sequenceLower in hash ) {
						ret.match = sequenceArray;
						ret.start = start;
						ret.end = i;
						return ret;
						//console.info("_findSequence: Found sequence '" + sequence + "' New parts list is " + JSON.stringify(parts));
					}
				}
			}
		}
	
		return undefined;
	},
	*/

    /**
     * @protected
     * @param {Array} parts
     * @param {Array} names
     * @param {boolean} isAsian
     * @param {boolean=} noCompoundPrefix
     */
    _findPrefix: function (parts, names, isAsian, noCompoundPrefix) {
        var i, prefix, prefixLower, prefixArray, aux = [];

        if (parts.length > 0 && names) {
            for (i = parts.length; i > 0; i--) {
                prefixArray = parts.slice(0, i);
                prefix = prefixArray.join(isAsian ? '' : ' ');
                prefixLower = prefix.toLowerCase();
                prefixLower = prefixLower.replace(/[,\.]/g, ''); // ignore commas and periods

                if (prefixLower in names) {
                    aux = aux.concat(isAsian ? prefix : prefixArray);
                    if (noCompoundPrefix) {
                    	// don't need to parse further. Just return it as is.
                    	return aux;
                    }
                    parts = parts.slice(i);
                    i = parts.length + 1;
                }
            }
        }

        return aux;
    },

    /**
     * @protected
     */
    _findSuffix: function (parts, names, isAsian) {
        var i, j, seq = "";

        for (i = 0; i < names.length; i++) {
            if (parts.length >= names[i].length) {
                j = 0;
                while (j < names[i].length && parts[parts.length - j] === names[i][names[i].length - j]) {
                    j++;
                }
                if (j >= names[i].length) {
                    seq = parts.slice(parts.length - j).join(isAsian ? "" : " ") + (isAsian ? "" : " ") + seq;
                    parts = parts.slice(0, parts.length - j);
                    i = -1; // restart the search
                }
            }
        }

        this.suffix = seq;
        return parts;
    },

    /**
     * @protected
     * Tell whether or not the given word is a conjunction in this language.
     * @param {string} word the word to test
     * @return {boolean} true if the word is a conjunction
     */
    _isConjunction: function _isConjunction(word) {
        return (this.info.conjunctions.and1 === word ||
            this.info.conjunctions.and2 === word ||
            this.info.conjunctions.or1 === word ||
            this.info.conjunctions.or2 === word ||
            ("&" === word) ||
            ("+" === word));
    },

    /**
     * Find the last instance of 'and' in the name
     * @protected
     * @param {Array.<string>} parts
     * @return {number}
     */
    _findLastConjunction: function _findLastConjunction(parts) {
        var conjunctionIndex = -1,
            index, part;

        for (index = 0; index < parts.length; index++) {
            part = parts[index];
            if (typeof (part) === 'string') {
                part = part.toLowerCase();
                // also recognize English
                if ("and" === part || "or" === part || "&" === part || "+" === part) {
                    conjunctionIndex = index;
                }
                if (this._isConjunction(part)) {
                    conjunctionIndex = index;
                }
            }
        }
        return conjunctionIndex;
    },

    /**
     * @protected
     * @param {Array.<string>} parts the current array of name parts
     * @param {boolean} isAsian true if the name is being parsed as an Asian name
     * @return {Array.<string>} the remaining parts after the prefixes have been removed
     */
    _extractPrefixes: function (parts, isAsian) {
        var i = this._findPrefix(parts, this.info.prefixes, isAsian);
        if (i > 0) {
            this.prefix = parts.slice(0, i).join(isAsian ? "" : " ");
            return parts.slice(i);
        }
        // prefixes not found, so just return the array unmodified
        return parts;
    },

    /**
     * @protected
     * @param {Array.<string>} parts the current array of name parts
     * @param {boolean} isAsian true if the name is being parsed as an Asian name
     * @return {Array.<string>} the remaining parts after the suffices have been removed
     */
    _extractSuffixes: function (parts, isAsian) {
        var i = this._findSuffix(parts, this.info.suffixes, isAsian);
        if (i > 0) {
            this.suffix = parts.slice(i).join(isAsian ? "" : " ");
            return parts.slice(0, i);
        }
        // suffices not found, so just return the array unmodified
        return parts;
    },

    /**
     * Adjoin auxillary words to their head words.
     * @protected
     * @param {Array.<string>} parts the current array of name parts
     * @param {boolean} isAsian true if the name is being parsed as an Asian name
     * @return {Array.<string>} the parts after the auxillary words have been plucked onto their head word
     */
    _joinAuxillaries: function (parts, isAsian) {
        var start, i, prefixArray, prefix, prefixLower;

        if (this.info.auxillaries && (parts.length > 2 || this.prefix)) {
            for (start = 0; start < parts.length - 1; start++) {
                for (i = parts.length; i > start; i--) {
                    prefixArray = parts.slice(start, i);
                    prefix = prefixArray.join(' ');
                    prefixLower = prefix.toLowerCase();
                    prefixLower = prefixLower.replace(/[,\.]/g, ''); // ignore commas and periods

                    if (prefixLower in this.info.auxillaries) {
                        parts.splice(start, i + 1 - start, prefixArray.concat(parts[i]));
                        i = start;
                    }
                }
            }
        }

        return parts;
    },

    /**
     * Recursively join an array or string into a long string.
     * @protected
     */
    _joinArrayOrString: function _joinArrayOrString(part) {
        var i;
        if (typeof (part) === 'object') {
            for (i = 0; i < part.length; i++) {
                part[i] = this._joinArrayOrString(part[i]);
            }
            var ret = "";
            part.forEach(function (segment) {
                if (ret.length > 0 && !isPunct(segment.charAt(0))) {
                    ret += ' ';
                }
                ret += segment;
            });

            return ret;
        }

        return part;
    },

    /**
     * @protected
     */
    _joinNameArrays: function _joinNameArrays() {
        var prop;
        for (prop in this) {

            if (this[prop] !== undefined && typeof (this[prop]) === 'object' && ilib.isArray(this[prop])) {

                this[prop] = this._joinArrayOrString(this[prop]);
            }
        }
    },

    /**
     * @protected
     */
    _parseAsianName: function (parts, language) {
        var familyNameArray = this._findPrefix(parts, this.info.knownFamilyNames, true, typeof(this.singleFamilyName) !== 'undefined' ? this.singleFamilyName : this.info.noCompoundFamilyNames);
        var tempFullName = parts.join('');

        if (familyNameArray && familyNameArray.length > 0) {
            this.familyName = familyNameArray.join('');
            this.givenName = parts.slice(this.familyName.length).join('');
            
            //Overide parsing rules if spaces are found in korean
            if (language === "ko" && tempFullName.search(/\s*[/\s]/) > -1 && !this.suffix) {
                this._parseKoreanName(tempFullName);
            }
        } else if (this.locale.getLanguage() === "ja") {
            this._parseJapaneseName(parts);
        } else if (this.suffix || this.prefix) {
            this.familyName = parts.join('');
        } else {
            this.givenName = parts.join('');
        }
    },

    /**
     * @protected
     */
    _parseKoreanName: function (name) {
        var tempName = name;

        var spaceSplit = tempName.split(" ");
        var spceCount = spaceSplit.length;
        var fistSpaceIndex = tempName.indexOf(" ");
        var lastSpaceIndex = tempName.lastIndexOf(" ");

        if (spceCount === 2) {
            this.familyName = spaceSplit[0];
            this.givenName = tempName.slice(fistSpaceIndex, tempName.length);
        } else {
            this.familyName = spaceSplit[0];
            this.middleName = tempName.slice(fistSpaceIndex, lastSpaceIndex);
            this.givenName = tempName.slice(lastSpaceIndex, tempName.length);
        }
        
    },

    /**
     * @protected
     */
    _parseJapaneseName: function (parts) {
    	if (this.suffix && this.suffix.length > 1 && this.info.honorifics.indexOf(this.suffix)>-1) {
    		if (parts.length === 1) {
    			if (CType.withinRange(parts[0], "cjk")) {
    				this.familyName = parts[0];
    			} else {
    				this.givenName = parts[0];
    			}
    			return;
    		} else if (parts.length === 2) {
    			this.familyName = parts.slice(0,parts.length).join("")
    			return;
    		}
    	}
    	if (parts.length > 1) {
    		var fn = "";                                                                    
    		for (var i = 0; i < parts.length; i++) {
    			if (CType.withinRange(parts[i], "cjk")) {
    				fn += parts[i];
    			} else if (fn.length > 1 && CType.withinRange(parts[i], "hiragana")) {
    				this.familyName = fn;
    				this.givenName = parts.slice(i,parts.length).join("");
    				return;
    			} else {
    				break;
    			}
    		}
    	}
    	if (parts.length === 1) {
    		this.familyName = parts[0];
    	} else if (parts.length === 2) {
    		this.familyName = parts[0];
    		this.givenName = parts[1];
    	} else if (parts.length === 3) {
    		this.familyName = parts[0];
    		this.givenName = parts.slice(1,parts.length).join("");
    	} else if (parts.length > 3) {
    		this.familyName = parts.slice(0,2).join("")
    		this.givenName = parts.slice(2,parts.length).join("");
    	}      
    },

    /**
     * @protected
     */
    _parseSpanishName: function (parts) {
        var conjunctionIndex;

        if (parts.length === 1) {
            if (this.prefix || typeof (parts[0]) === 'object') {
                this.familyName = parts[0];
            } else {
                this.givenName = parts[0];
            }
        } else if (parts.length === 2) {
            // we do G F
            this.givenName = parts[0];
            this.familyName = parts[1];
        } else if (parts.length === 3) {
            conjunctionIndex = this._findLastConjunction(parts);
            // if there's an 'and' in the middle spot, put everything in the first name
            if (conjunctionIndex === 1) {
                this.givenName = parts;
            } else {
                // else, do G F F
                this.givenName = parts[0];
                this.familyName = parts.slice(1);
            }
        } else if (parts.length > 3) {
            //there are at least 4 parts to this name

            conjunctionIndex = this._findLastConjunction(parts);
            ////console.log("@@@@@@@@@@@@@@@@"+conjunctionIndex)
            if (conjunctionIndex > 0) {
                // if there's a conjunction that's not the first token, put everything up to and 
                // including the token after it into the first name, the last 2 tokens into
                // the family name (if they exist) and everything else in to the middle name
                // 0 1 2 3 4 5
                // G A G
                // G A G F
                // G G A G
                // G A G F F
                // G G A G F
                // G G G A G
                // G A G M F F
                // G G A G F F
                // G G G A G F
                // G G G G A G
                this.givenName = parts.splice(0, conjunctionIndex + 2);
                if (parts.length > 1) {
                    this.familyName = parts.splice(parts.length - 2, 2);
                    if (parts.length > 0) {
                        this.middleName = parts;
                    }
                } else if (parts.length === 1) {
                    this.familyName = parts[0];
                }
            } else {
                this.givenName = parts.splice(0, 1);
                this.familyName = parts.splice(parts.length - 2, 2);
                this.middleName = parts;
            }
        }
    },

    /**
     * @protected
     */
    _parseIndonesianName: function (parts) {
        var conjunctionIndex;

        if (parts.length === 1) {
            //if (this.prefix || typeof(parts[0]) === 'object') {
            //this.familyName = parts[0];
            //} else {
            this.givenName = parts[0];
            //}
            //} else if (parts.length === 2) {
            // we do G F
            //this.givenName = parts[0];
            //this.familyName = parts[1];
        } else if (parts.length >= 2) {
            //there are at least 3 parts to this name

            conjunctionIndex = this._findLastConjunction(parts);
            if (conjunctionIndex > 0) {
                // if there's a conjunction that's not the first token, put everything up to and 
                // including the token after it into the first name, the last 2 tokens into
                // the family name (if they exist) and everything else in to the middle name
                // 0 1 2 3 4 5
                // G A G
                // G A G F
                // G G A G
                // G A G F F
                // G G A G F
                // G G G A G
                // G A G M F F
                // G G A G F F
                // G G G A G F
                // G G G G A G
                this.givenName = parts.splice(0, conjunctionIndex + 2);
                if (parts.length > 1) {
                    //this.familyName = parts.splice(parts.length-2, 2);
                    //if ( parts.length > 0 ) {
                    this.middleName = parts;
                }
                //} else if (parts.length === 1) {
                //	this.familyName = parts[0];
                //}
            } else {
                this.givenName = parts.splice(0, 1);
                //this.familyName = parts.splice(parts.length-2, 2);
                this.middleName = parts;
            }
        }
    },
    
    /**
     * @protected
     */
    _parseGenericWesternName: function (parts) {
        /* Western names are parsed as follows, and rules are applied in this 
         * order:
         *
         * G
         * G F
         * G M F
         * G M M F
         * P F
         * P G F
         */
        var conjunctionIndex;

        if (parts.length === 1) {
            if (this.prefix || typeof (parts[0]) === 'object') {
                // already has a prefix, so assume it goes with the family name like "Dr. Roberts" or
                // it is a name with auxillaries, which is almost always a family name
                this.familyName = parts[0];
            } else {
                this.givenName = parts[0];
            }
        } else if (parts.length === 2) {
            // we do G F
            if (this.info.order == 'fgm') {
                this.givenName = parts[1];
                this.familyName = parts[0];
            } else if (this.info.order == "gmf" || typeof (this.info.order) == 'undefined') {
                this.givenName = parts[0];
                this.familyName = parts[1];
            }
        } else if (parts.length >= 3) {
            //find the first instance of 'and' in the name
            conjunctionIndex = this._findLastConjunction(parts);

            if (conjunctionIndex > 0) {
                // if there's a conjunction that's not the first token, put everything up to and 
                // including the token after it into the first name, the last token into
                // the family name (if it exists) and everything else in to the middle name
                // 0 1 2 3 4 5
                // G A G M M F
                // G G A G M F
                // G G G A G F
                // G G G G A G
                //if(this.order == "gmf") {
                this.givenName = parts.slice(0, conjunctionIndex + 2);

                if (conjunctionIndex + 1 < parts.length - 1) {
                    this.familyName = parts.splice(parts.length - 1, 1);
                    ////console.log(this.familyName);
                    if (conjunctionIndex + 2 < parts.length - 1) {
                        this.middleName = parts.slice(conjunctionIndex + 2, parts.length - conjunctionIndex - 3);
                    }
                } else if (this.info.order == "fgm") {
                    this.familyName = parts.slice(0, conjunctionIndex + 2);
                    if (conjunctionIndex + 1 < parts.length - 1) {
                        this.middleName = parts.splice(parts.length - 1, 1);
                        if (conjunctionIndex + 2 < parts.length - 1) {
                            this.givenName = parts.slice(conjunctionIndex + 2, parts.length - conjunctionIndex - 3);
                        }
                    }
                }
            } else if (this.info.order === "fgm") {
                this.givenName = parts[1];
                this.middleName = parts.slice(2);
                this.familyName = parts[0];
            } else {
                this.givenName = parts[0];
                this.middleName = parts.slice(1, parts.length - 1);
                this.familyName = parts[parts.length - 1];
            }
        }
    },
    
     /**
     * parse patrinomic name from the russian names 
     * @protected
     * @param {Array.<string>} parts the current array of name parts
     * @return number  index of the part which contains patronymic name
     */
    _findPatronymicName: function(parts) {
    	var index, part;
    	for (index = 0; index < parts.length; index++) {
    		part = parts[index];
    		if (typeof (part) === 'string') {
    			part = part.toLowerCase();

    			var subLength = this.info.patronymicName.length;
    			while(subLength--) {
    				if(part.indexOf(this.info.patronymicName[subLength])!== -1 )
    					return index;
    			}
    		}
    	}
    	return -1;
    },

    /**
	 * find if the given part is patronymic name
	 * 
	 * @protected
	 * @param {string} part string from name parts @
	 * @return number index of the part which contains familyName
	 */
    _isPatronymicName: function(part) {
	    var pName;
	    if ( typeof (part) === 'string') {
		    pName = part.toLowerCase();

		    var subLength = this.info.patronymicName.length;
		    while (subLength--) {
			    if (pName.indexOf(this.info.patronymicName[subLength]) !== -1)
				    return true;
		    }
	    }
	    return false;
    },

    /**
	 * find family name from the russian name
	 * 
	 * @protected
	 * @param {Array.<string>} parts the current array of name parts
	 * @return boolean true if patronymic, false otherwise
	 */
    _findFamilyName: function(parts) {
	    var index, part, substring;
	    for (index = 0; index < parts.length; index++) {
		    part = parts[index];

		    if ( typeof (part) === 'string') {
			    part = part.toLowerCase();
			    var length = part.length - 1;

			    if (this.info.familyName.indexOf(part) !== -1) {
				    return index;
			    } else if (part[length] === 'в' || part[length] === 'н' ||
			        part[length] === 'й') {
				    substring = part.slice(0, -1);
				    if (this.info.familyName.indexOf(substring) !== -1) {
					    return index;
				    }
			    } else if ((part[length - 1] === 'в' && part[length] === 'а') ||
			        (part[length - 1] === 'н' && part[length] === 'а') ||
			        (part[length - 1] === 'а' && part[length] === 'я')) {
				    substring = part.slice(0, -2);
				    if (this.info.familyName.indexOf(substring) !== -1) {
					    return index;
				    }
			    }
		    }
	    }
	    return -1;
    },

    /**
	 * parse russian name
	 * 
	 * @protected
	 * @param {Array.<string>} parts the current array of name parts
	 * @return
	 */
    _parseRussianName: function(parts) {
	    var conjunctionIndex, familyIndex = -1;

	    if (parts.length === 1) {
		    if (this.prefix || typeof (parts[0]) === 'object') {
			    // already has a prefix, so assume it goes with the family name
				// like "Dr. Roberts" or
			    // it is a name with auxillaries, which is almost always a
				// family name
			    this.familyName = parts[0];
		    } else {
			    this.givenName = parts[0];
		    }
	    } else if (parts.length === 2) {
		    // we do G F
		    if (this.info.order === 'fgm') {
			    this.givenName = parts[1];
			    this.familyName = parts[0];
		    } else if (this.info.order === "gmf") {
			    this.givenName = parts[0];
			    this.familyName = parts[1];
		    } else if ( typeof (this.info.order) === 'undefined') {
			    if (this._isPatronymicName(parts[1]) === true) {
				    this.middleName = parts[1];
				    this.givenName = parts[0];
			    } else if ((familyIndex = this._findFamilyName(parts)) !== -1) {
				    if (familyIndex === 1) {
					    this.givenName = parts[0];
					    this.familyName = parts[1];
				    } else {
					    this.familyName = parts[0];
					    this.givenName = parts[1];
				    }

			    } else {
				    this.givenName = parts[0];
				    this.familyName = parts[1];
			    }

		    }
	    } else if (parts.length >= 3) {
		    // find the first instance of 'and' in the name
		    conjunctionIndex = this._findLastConjunction(parts);
		    var patronymicNameIndex = this._findPatronymicName(parts);
		    if (conjunctionIndex > 0) {
			    // if there's a conjunction that's not the first token, put
				// everything up to and
			    // including the token after it into the first name, the last
				// token into
			    // the family name (if it exists) and everything else in to the
				// middle name
			    // 0 1 2 3 4 5
			    // G A G M M F
			    // G G A G M F
			    // G G G A G F
			    // G G G G A G
			    // if(this.order == "gmf") {
			    this.givenName = parts.slice(0, conjunctionIndex + 2);

			    if (conjunctionIndex + 1 < parts.length - 1) {
				    this.familyName = parts.splice(parts.length - 1, 1);
				    // //console.log(this.familyName);
				    if (conjunctionIndex + 2 < parts.length - 1) {
					    this.middleName = parts.slice(conjunctionIndex + 2,
					        parts.length - conjunctionIndex - 3);
				    }
			    } else if (this.order == "fgm") {
				    this.familyName = parts.slice(0, conjunctionIndex + 2);
				    if (conjunctionIndex + 1 < parts.length - 1) {
					    this.middleName = parts.splice(parts.length - 1, 1);
					    if (conjunctionIndex + 2 < parts.length - 1) {
						    this.givenName = parts.slice(conjunctionIndex + 2,
						        parts.length - conjunctionIndex - 3);
					    }
				    }
			    }
		    } else if (patronymicNameIndex !== -1) {
			    this.middleName = parts[patronymicNameIndex];

			    if (patronymicNameIndex === (parts.length - 1)) {
				    this.familyName = parts[0];
				    this.givenName = parts.slice(1, patronymicNameIndex);
			    } else {
				    this.givenName = parts.slice(0, patronymicNameIndex);

				    this.familyName = parts[parts.length - 1];
			    }
		    } else {
			    this.givenName = parts[0];

			    this.middleName = parts.slice(1, parts.length - 1);

			    this.familyName = parts[parts.length - 1];
		    }
	    }
    },
    
    
    /**
     * @protected
     */
    _parseWesternName: function (parts) {

        if (this.locale.getLanguage() === "es" || this.locale.getLanguage() === "pt") {
            // in spain and mexico and portugal, we parse names differently than in the rest of the world 
            // because of the double family names
            this._parseSpanishName(parts);
        } else if (this.locale.getLanguage() === "ru") {
            /*
             * In Russian, names can be given equally validly as given-family
             * or family-given. Use the value of the "order" property of the
             * constructor options to give the default when the order is ambiguous.
             */
            this._parseRussianName(parts);
        } else if (this.locale.getLanguage() === "id") {
            // in indonesia, we parse names differently than in the rest of the world 
            // because names don't have family names usually.
            this._parseIndonesianName(parts);
        } else {
        	this._parseGenericWesternName(parts);
        }
    },

    /**
     * When sorting names with auxiliary words (like "van der" or "de los"), determine
     * which is the "head word" and return a string that can be easily sorted by head
     * word. In English, names are always sorted by initial characters. In places like
     * the Netherlands or Germany, family names are sorted by the head word of a list
     * of names rather than the first element of that name.
     * @return {string|undefined} a string containing the family name[s] to be used for sorting
     * in the current locale, or undefined if there is no family name in this object
     */
    getSortFamilyName: function () {
        var name,
            auxillaries,
            auxString,
            parts,
            i;

        // no name to sort by
        if (!this.familyName) {
            return undefined;
        }

        // first break the name into parts
        if (this.info) {
            if (this.info.sortByHeadWord) {
                if (typeof (this.familyName) === 'string') {
                    name = this.familyName.replace(/\s+/g, ' '); // compress multiple whitespaces
                    parts = name.trim().split(' ');
                } else {
                    // already split
                    parts = this.familyName;
                }

                auxillaries = this._findPrefix(parts, this.info.auxillaries, false);
                if (auxillaries && auxillaries.length > 0) {
                    if (typeof (this.familyName) === 'string') {
                        auxString = auxillaries.join(' ');
                        name = this.familyName.substring(auxString.length + 1) + ', ' + auxString;
                    } else {
                        name = parts.slice(auxillaries.length).join(' ') +
                            ', ' +
                            parts.slice(0, auxillaries.length).join(' ');
                    }
                }
            } else if (this.info.knownFamilyNames && this.familyName) {
                parts = this.familyName.split('');
                var familyNameArray = this._findPrefix(parts, this.info.knownFamilyNames, true, this.info.noCompoundFamilyNames);
                name = "";
                for (i = 0; i < familyNameArray.length; i++) {
                    name += (this.info.knownFamilyNames[familyNameArray[i]] || "");
                }
            }
        }

        return name || this.familyName;
    },

    getHeadFamilyName: function () {},

    /** 
     * @protected
     * Return a shallow copy of the current instance.
     */
    clone: function () {
        return new Name(this);
    }
};

module.exports = Name;