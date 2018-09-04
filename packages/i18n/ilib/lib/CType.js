/*
 * CType.js - Character type definitions
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

// !depends ilib.js Locale.js SearchUtils.js Utils.js IString.js

// !data ctype

var ilib = require("./ilib.js");
var SearchUtils = require("./SearchUtils.js");
var Utils = require("./Utils.js");
var Locale = require("./Locale.js");
var IString = require("./IString.js");

/**
 * Provides a set of static routines that return information about characters.
 * These routines emulate the C-library ctype functions. The characters must be 
 * encoded in utf-16, as no other charsets are currently supported. Only the first
 * character of the given string is tested.
 * @namespace
 */
var CType = {};


/**
 * Actual implementation for withinRange. Searches the given object for ranges.
 * The range names are taken from the Unicode range names in 
 * http://www.unicode.org/Public/UNIDATA/extracted/DerivedGeneralCategory.txt
 * 
 * <ul>
 * <li>Cn - Unassigned
 * <li>Lu - Uppercase_Letter
 * <li>Ll - Lowercase_Letter
 * <li>Lt - Titlecase_Letter
 * <li>Lm - Modifier_Letter
 * <li>Lo - Other_Letter
 * <li>Mn - Nonspacing_Mark
 * <li>Me - Enclosing_Mark
 * <li>Mc - Spacing_Mark
 * <li>Nd - Decimal_Number
 * <li>Nl - Letter_Number
 * <li>No - Other_Number
 * <li>Zs - Space_Separator
 * <li>Zl - Line_Separator
 * <li>Zp - Paragraph_Separator
 * <li>Cc - Control
 * <li>Cf - Format
 * <li>Co - Private_Use
 * <li>Cs - Surrogate
 * <li>Pd - Dash_Punctuation
 * <li>Ps - Open_Punctuation
 * <li>Pe - Close_Punctuation
 * <li>Pc - Connector_Punctuation
 * <li>Po - Other_Punctuation
 * <li>Sm - Math_Symbol
 * <li>Sc - Currency_Symbol
 * <li>Sk - Modifier_Symbol
 * <li>So - Other_Symbol
 * <li>Pi - Initial_Punctuation
 * <li>Pf - Final_Punctuation
 * </ul>
 * 
 * @protected
 * @param {number} num code point of the character to examine
 * @param {string} rangeName the name of the range to check
 * @param {Object} obj object containing the character range data
 * @return {boolean} true if the first character is within the named
 * range
 */
CType._inRange = function(num, rangeName, obj) {
	var range, i;
	if (num < 0 || !rangeName || !obj) {
		return false;
	}
	
	range = obj[rangeName];
	if (!range) {
		return false;
	}
	
	var compare = function(singlerange, target) {
		if (singlerange.length === 1) {
			return singlerange[0] - target;
		} else {
			return target < singlerange[0] ? singlerange[0] - target :
				(target > singlerange[1] ? singlerange[1] - target : 0);
		}
	};
	var result = SearchUtils.bsearch(num, range, compare);
	return result < range.length && compare(range[result], num) === 0;
};

/**
 * Return whether or not the first character is within the named range
 * of Unicode characters. The valid list of range names are taken from 
 * the Unicode 6.0 spec. Characters in all ranges of Unicode are supported,
 * including those supported in Javascript via UTF-16. Currently, this method 
 * supports the following range names:
 * 
 * <ul>
 * <li><i>ascii</i> - basic ASCII
 * <li><i>latin</i> - Latin, Latin Extended Additional, Latin-1 supplement, Latin Extended-C, Latin Extended-D, Latin Extended-E
 * <li><i>armenian</i>
 * <li><i>greek</i> - Greek, Greek Extended
 * <li><i>cyrillic</i> - Cyrillic, Cyrillic Extended-A, Cyrillic Extended-B, Cyrillic Extended-C, Cyrillic Supplement
 * <li><i>georgian</i> - Georgian, Georgian Supplement
 * <li><i>glagolitic</i> - Glagolitic, Glagolitic Supplement
 * <li><i>gothic</i>
 * <li><i>ogham</i>
 * <li><i>oldpersian</i>
 * <li><i>runic</i>
 * <li><i>ipa</i> - IPA, Phonetic Extensions, Phonetic Extensions Supplement
 * <li><i>phonetic</i>
 * <li><i>modifiertone</i> - Modifier Tone Letters
 * <li><i>spacing</i>
 * <li><i>diacritics</i>
 * <li><i>halfmarks</i> - Combining Half Marks
 * <li><i>small</i> - Small Form Variants
 * <li><i>bamum</i> - Bamum, Bamum Supplement
 * <li><i>ethiopic</i> - Ethiopic, Ethiopic Extended, Ethiopic Extended-A
 * <li><i>nko</i>
 * <li><i>osmanya</i>
 * <li><i>tifinagh</i>
 * <li><i>val</i>
 * <li><i>arabic</i> - Arabic, Arabic Supplement, Arabic Presentation Forms-A, 
 * Arabic Presentation Forms-B, Arabic Mathematical Alphabetic Symbols
 * <li><i>carlan</i>
 * <li><i>hebrew</i>
 * <li><i>mandaic</i>
 * <li><i>samaritan</i>
 * <li><i>syriac</i>
 * <li><i>mongolian</i>
 * <li><i>phagspa</i>
 * <li><i>tibetan</i>
 * <li><i>bengali</i>
 * <li><i>devanagari</i> - Devanagari, Devanagari Extended
 * <li><i>gujarati</i>
 * <li><i>gurmukhi</i>
 * <li><i>kannada</i>
 * <li><i>lepcha</i>
 * <li><i>limbu</i>
 * <li><i>malayalam</i>
 * <li><i>meetaimayek</i>
 * <li><i>olchiki</i>
 * <li><i>oriya</i>
 * <li><i>saurashtra</i>
 * <li><i>sinhala</i>
 * <li><i>sylotinagri</i> - Syloti Nagri
 * <li><i>tangut</i>
 * <li><i>tamil</i>
 * <li><i>telugu</i>
 * <li><i>thaana</i>
 * <li><i>vedic</i>
 * <li><i>batak</i>
 * <li><i>balinese</i>
 * <li><i>buginese</i>
 * <li><i>cham</i>
 * <li><i>javanese</i>
 * <li><i>kayahli</i>
 * <li><i>khmer</i>
 * <li><i>lao</i>
 * <li><i>myanmar</i> - Myanmar, Myanmar Extended-A, Myanmar Extended-B
 * <li><i>newtailue</i>
 * <li><i>rejang</i>
 * <li><i>sundanese</i> - Sundanese, Sundanese Supplement
 * <li><i>taile</i>
 * <li><i>taitham</i>
 * <li><i>taiviet</i>
 * <li><i>thai</i>
 * <li><i>buhld</i>
 * <li><i>hanunoo</i>
 * <li><i>tagalog</i>
 * <li><i>tagbanwa</i>
 * <li><i>bopomofo</i> - Bopomofo, Bopomofo Extended
 * <li><i>cjk</i> - the CJK unified ideographs (Han), CJK Unified Ideographs
 *  Extension A, CJK Unified Ideographs Extension B, CJK Unified Ideographs 
 *  Extension C, CJK Unified Ideographs Extension D, Ideographic Description 
 *  Characters (=isIdeo())
 * <li><i>cjkcompatibility</i> - CJK Compatibility, CJK Compatibility 
 * Ideographs, CJK Compatibility Forms, CJK Compatibility Ideographs Supplement
 * <li><i>cjkradicals</i> - the CJK radicals, KangXi radicals
 * <li><i>hangul</i> - Hangul Jamo, Hangul Syllables, Hangul Jamo Extended-A, 
 * Hangul Jamo Extended-B, Hangul Compatibility Jamo
 * <li><i>cjkpunct</i> - CJK symbols and punctuation
 * <li><i>cjkstrokes</i> - CJK strokes
 * <li><i>hiragana</i>
 * <li><i>katakana</i> - Katakana, Katakana Phonetic Extensions, Kana Supplement
 * <li><i>kanbun</i>
 * <li><i>lisu</i>
 * <li><i>yi</i> - Yi Syllables, Yi Radicals
 * <li><i>cherokee</i>
 * <li><i>canadian</i> - Unified Canadian Aboriginal Syllabics, Unified Canadian 
 * Aboriginal Syllabics Extended
 * <li><i>presentation</i> - Alphabetic presentation forms
 * <li><i>vertical</i> - Vertical Forms
 * <li><i>width</i> - Halfwidth and Fullwidth Forms
 * <li><i>punctuation</i> - General punctuation, Supplemental Punctuation
 * <li><i>box</i> - Box Drawing
 * <li><i>block</i> - Block Elements
 * <li><i>letterlike</i> - Letterlike symbols
 * <li><i>mathematical</i> - Mathematical alphanumeric symbols, Miscellaneous 
 * Mathematical Symbols-A, Miscellaneous Mathematical Symbols-B
 * <li><i>enclosedalpha</i> - Enclosed alphanumerics, Enclosed Alphanumeric Supplement
 * <li><i>enclosedcjk</i> - Enclosed CJK letters and months, Enclosed Ideographic Supplement
 * <li><i>cjkcompatibility</i> - CJK compatibility
 * <li><i>apl</i> - APL symbols
 * <li><i>controlpictures</i> - Control pictures
 * <li><i>misc</i> - Miscellaneous technical
 * <li><i>ocr</i> - Optical character recognition (OCR)
 * <li><i>combining</i> - Combining Diacritical Marks, Combining Diacritical Marks 
 * for Symbols, Combining Diacritical Marks Supplement, Combining Diacritical Marks Extended
 * <li><i>digits</i> - ASCII digits (=isDigit())
 * <li><i>indicnumber</i> - Common Indic Number Forms
 * <li><i>numbers</i> - Number forms
 * <li><i>supersub</i> - Superscripts and Subscripts
 * <li><i>arrows</i> - Arrows, Miscellaneous Symbols and Arrows, Supplemental Arrows-A,
 * Supplemental Arrows-B, Supplemental Arrows-C
 * <li><i>operators</i> - Mathematical operators, supplemental 
 * mathematical operators 
 * <li><i>geometric</i> - Geometric shapes, Geometric shapes extended
 * <li><i>ancient</i> - Ancient symbols
 * <li><i>braille</i> - Braille patterns
 * <li><i>currency</i> - Currency symbols
 * <li><i>dingbats</i>
 * <li><i>gamesymbols</i>
 * <li><i>yijing</i> - Yijing Hexagram Symbols
 * <li><i>specials</i>
 * <li><i>variations</i> - Variation Selectors, Variation Selectors Supplement
 * <li><i>privateuse</i> - Private Use Area, Supplementary Private Use Area-A, 
 * Supplementary Private Use Area-B
 * <li><i>supplementarya</i> - Supplementary private use area-A
 * <li><i>supplementaryb</i> - Supplementary private use area-B
 * <li><i>highsurrogates</i> - High Surrogates, High Private Use Surrogates
 * <li><i>lowsurrogates</i>
 * <li><i>reserved</i>
 * <li><i>noncharacters</i>
 * <li><i>copticnumber</i> - coptic epact numbers
 * <li><i>oldpermic</i> - old permic
 * <li><i>albanian</i> - albanian
 * <li><i>lineara</i> - linear a
 * <li><i>meroitic</i> - meroitic cursive
 * <li><i>oldnortharabian</i> - old north arabian
 * <li><i>oldhungarian</i> - Supplementary private use area-A
 * <li><i>sorasompeng</i> - sora sompeng
 * <li><i>warangciti</i> - warang citi
 * <li><i>paucinhau</i> - pau cin hau
 * <li><i>bassavah</i> - bassa vah
 * <li><i>pahawhhmong</i> - pahawh hmong
 * <li><i>shorthandformat</i> - shorthand format controls
 * <li><i>suttonsignwriting</i> - sutton signwriting
 * <li><i>pictographs</i> - miscellaneous symbols and pictographs, supplemental symbols and pictographs
 * <li><i>ornamentaldingbats</i> - ornamental dingbats
 * </ul><p>
 * 
 * 
 * @protected
 * @param {string|IString|number} ch character or code point to examine
 * @param {string} rangeName the name of the range to check
 * @return {boolean} true if the first character is within the named
 * range
 */
CType.withinRange = function(ch, rangeName) {
	if (!rangeName) {
		return false;
	}
	var num;
	switch (typeof(ch)) {
		case 'number':
			num = ch;
			break;
		case 'string':
			num = IString.toCodePoint(ch, 0);
			break;
		case 'undefined':
			return false;
		default:
			num = ch._toCodePoint(0);
			break;
	}

	return CType._inRange(num, rangeName.toLowerCase(), ilib.data.ctype);
};

/**
 * @protected
 * @param {boolean} sync
 * @param {Object|undefined} loadParams
 * @param {function(*)|undefined} onLoad
 */
CType._init = function(sync, loadParams, onLoad) {
	CType._load("ctype", sync, loadParams, onLoad);
};

/**
 * @protected
 * @param {string} name
 * @param {boolean} sync
 * @param {Object|undefined} loadParams
 * @param {function(*)|undefined} onLoad
 */
CType._load = function (name, sync, loadParams, onLoad) {
	if (!ilib.data[name]) {
		var loadName = name ? name + ".json" : "CType.json";
		Utils.loadData({
			object: "CType",
			name: loadName,
			locale: "-",
			nonlocale: true,
			sync: sync,
			loadParams: loadParams, 
			callback: ilib.bind(this, function(ct) {
				ilib.data[name] = ct;
				if (onLoad && typeof(onLoad) === 'function') {
					onLoad(ilib.data[name]);
				}
			})
		});
	} else {
		if (onLoad && typeof(onLoad) === 'function') {
			onLoad(ilib.data[name]);
		}
	}
};

module.exports = CType;
