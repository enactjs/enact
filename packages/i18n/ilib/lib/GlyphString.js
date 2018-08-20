/*
 * GlyphString.js - ilib string subclass that allows you to access 
 * whole glyphs at a time
 * 
 * Copyright © 2015-2018, JEDLSoft
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

// !depends IString.js CType.js Utils.js JSUtils.js
// !data normdata ctype_m

var ilib = require("./ilib.js");
var Utils = require("./Utils.js");
var JSUtils = require("./JSUtils.js");

var IString = require("./IString.js");
var CType = require("./CType.js");

/**
 * @class
 * Create a new glyph string instance. This string inherits from 
 * the IString class, and adds methods that allow you to access
 * whole glyphs at a time. <p>
 * 
 * In Unicode, various accented characters can be created by using
 * a base character and one or more combining characters following
 * it. These appear on the screen to the user as a single glyph.
 * For example, the Latin character "a" (U+0061) followed by the
 * combining diaresis character "¨" (U+0308) combine together to
 * form the "a with diaresis" glyph "ä", which looks like a single
 * character on the screen.<p>
 * 
 * The big problem with combining characters for web developers is
 * that many CSS engines do not ellipsize text between glyphs. They
 * only deal with single Unicode characters. So if a particular space 
 * only allows for 4 characters, the CSS engine will truncate a
 * string at 4 Unicode characters and then add the ellipsis (...)
 * character. What if the fourth Unicode character is the "a" and
 * the fifth one is the diaresis? Then a string like "xxxäxxx" that
 * is ellipsized at 4 characters will appear as "xxxa..." on the 
 * screen instead of "xxxä...".<p>
 * 
 * In the Latin script as it is commonly used, it is not so common
 * to form accented characters using combining accents, so the above
 * example is mostly for illustrative purposes. It is not unheard of
 * however. The situation is much, much worse in scripts such as Thai and 
 * Devanagari that normally make very heavy use of combining characters.
 * These scripts do so because Unicode does not include pre-composed 
 * versions of the accented characters like it does for Latin, so 
 * combining accents are the only way to create these accented and 
 * combined versions of the characters.<p>
 * 
 * The solution to this problem is not to use the the CSS property 
 * "text-overflow: ellipsis" in your web site, ever. Instead, use
 * a glyph string to truncate text between glyphs dynamically,
 * rather than truncating between Unicode characters using CSS.<p>
 * 
 * Glyph strings are also useful for truncation, hyphenation, and 
 * line wrapping, as all of these should be done between glyphs instead
 * of between characters.<p>
 * 
 * The options parameter is optional, and may contain any combination
 * of the following properties:<p>
 * 
 * <ul>
 * <li><i>onLoad</i> - a callback function to call when the locale data are
 * fully loaded. When the onLoad option is given, this object will attempt to
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
 * @constructor
 * @extends IString
 * @param {string|IString=} str initialize this instance with this string 
 * @param {Object=} options options governing the way this instance works
 */
var GlyphString = function (str, options) {
	if (options && options.noinstance) {
		return;
	}
	
	IString.call(this, str);
	
	options = options || {sync: true};
	
	CType._load("ctype_m", options.sync, options.loadParams, ilib.bind(this, function() {
		if (!ilib.data.norm || JSUtils.isEmpty(ilib.data.norm.ccc)) {
			Utils.loadData({
				object: "GlyphString", 
				locale: "-", 
				name: "normdata.json",
				nonlocale: true,
				sync: options.sync, 
				loadParams: options.loadParams, 
				callback: ilib.bind(this, function (norm) {
					ilib.extend(ilib.data.norm, norm);
					if (options && typeof(options.onLoad) === 'function') {
						options.onLoad(this);
					}
				})
			});
		} else {
			if (options && typeof(options.onLoad) === 'function') {
				options.onLoad(this);
			}
		}
	}));
};

GlyphString.prototype = new IString(undefined);
GlyphString.prototype.parent = IString;
GlyphString.prototype.constructor = GlyphString;

/**
 * Return true if the given character is a leading Jamo (Choseong) character.
 * 
 * @private
 * @static
 * @param {number} n code point to check
 * @return {boolean} true if the character is a leading Jamo character, 
 * false otherwise
 */
GlyphString._isJamoL = function (n) {
	return (n >= 0x1100 && n <= 0x1112);
};

/**
 * Return true if the given character is a vowel Jamo (Jungseong) character.
 * 
 * @private
 * @static
 * @param {number} n code point to check
 * @return {boolean} true if the character is a vowel Jamo character, 
 * false otherwise
 */
GlyphString._isJamoV = function (n) {
	return (n >= 0x1161 && n <= 0x1175);
};

/**
 * Return true if the given character is a trailing Jamo (Jongseong) character.
 * 
 * @private
 * @static
 * @param {number} n code point to check
 * @return {boolean} true if the character is a trailing Jamo character, 
 * false otherwise
 */
GlyphString._isJamoT = function (n) {
	return (n >= 0x11A8 && n <= 0x11C2);
};

/**
 * Return true if the given character is a LV Jamo character.
 * LV Jamo character is a precomposed Hangul character with LV sequence.
 * 
 * @private
 * @static
 * @param {number} n code point to check
 * @return {boolean} true if the character is a LV Jamo character,
 * false otherwise
 */
GlyphString._isJamoLV = function (n) {
	var syllableBase = 0xAC00;
	var leadingJamoCount = 19;
	var vowelJamoCount = 21;
	var trailingJamoCount = 28;
	var syllableCount = leadingJamoCount * vowelJamoCount * trailingJamoCount;
	var syllableIndex = n - syllableBase;
	// Check if n is a precomposed Hangul
	if (0 <= syllableIndex && syllableIndex < syllableCount) {
	// Check if n is a LV Jamo character
		if((syllableIndex % trailingJamoCount) == 0) {
			return true;
		}
	}
	return false;
};

/**
 * Return true if the given character is a precomposed Hangul character.
 * The precomposed Hangul character may be a LV Jamo character or a LVT Jamo Character.
 * 
 * @private
 * @static
 * @param {number} n code point to check
 * @return {boolean} true if the character is a precomposed Hangul character, 
 * false otherwise
 */
GlyphString._isHangul = function (n) {
	return (n >= 0xAC00 && n <= 0xD7A3);
};

/**
 * Algorithmically compose an L and a V combining Jamo characters into
 * a precomposed Korean syllabic Hangul character. Both should already
 * be in the proper ranges for L and V characters. 
 * 
 * @private
 * @static
 * @param {number} lead the code point of the lead Jamo character to compose
 * @param {number} trail the code point of the trailing Jamo character to compose
 * @return {string} the composed Hangul character
 */
GlyphString._composeJamoLV = function (lead, trail) {
	var lindex = lead - 0x1100;
	var vindex = trail - 0x1161;
	return IString.fromCodePoint(0xAC00 + (lindex * 21 + vindex) * 28);
};

/**
 * Algorithmically compose a Hangul LV and a combining Jamo T character 
 * into a precomposed Korean syllabic Hangul character. 
 * 
 * @private
 * @static
 * @param {number} lead the code point of the lead Hangul character to compose
 * @param {number} trail the code point of the trailing Jamo T character to compose
 * @return {string} the composed Hangul character
 */
GlyphString._composeJamoLVT = function (lead, trail) {
	return IString.fromCodePoint(lead + (trail - 0x11A7));
};

/**
 * Compose one character out of a leading character and a 
 * trailing character. If the characters are Korean Jamo, they
 * will be composed algorithmically. If they are any other
 * characters, they will be looked up in the nfc tables.
 * 
 * @private
 * @static
 * @param {string} lead leading character to compose
 * @param {string} trail the trailing character to compose
 * @return {string|null} the fully composed character, or undefined if
 * there is no composition for those two characters
 */
GlyphString._compose = function (lead, trail) {
	var first = lead.charCodeAt(0);
	var last = trail.charCodeAt(0);
	if (GlyphString._isJamoLV(first) && GlyphString._isJamoT(last)) {
		return GlyphString._composeJamoLVT(first, last);
	} else if (GlyphString._isJamoL(first) && GlyphString._isJamoV(last)) {
		return GlyphString._composeJamoLV(first, last);
	}

	var c = lead + trail;
	return (ilib.data.norm.nfc && ilib.data.norm.nfc[c]);
};

/**
 * Return an iterator that will step through all of the characters
 * in the string one at a time, taking care to step through decomposed 
 * characters and through surrogate pairs in the UTF-16 encoding 
 * as single characters. <p>
 * 
 * The GlyphString class will return decomposed Unicode characters
 * as a single unit that a user might see on the screen as a single
 * glyph. If the 
 * next character in the iteration is a base character and it is 
 * followed by combining characters, the base and all its following 
 * combining characters are returned as a single unit.<p>
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
 * @override
 * @return {Object} an iterator 
 * that iterates through all the characters in the string
 */
GlyphString.prototype.charIterator = function() {
	var it = IString.prototype.charIterator.call(this);
	
	/**
	 * @constructor
	 */
	function _chiterator (istring) {
		this.index = 0;
		this.spacingCombining = false;
		this.hasNext = function () {
			return !!this.nextChar || it.hasNext();
		};
		this.next = function () {
			var ch = this.nextChar || it.next(),
				prevCcc = ilib.data.norm.ccc[ch],
				nextCcc,
				composed = ch;
			
			this.nextChar = undefined;
			this.spacingCombining = false;
			
			if (ilib.data.norm.ccc && 
					(typeof(ilib.data.norm.ccc[ch]) === 'undefined' || ilib.data.norm.ccc[ch] === 0)) {
				// found a starter... find all the non-starters until the next starter. Must include
				// the next starter because under some odd circumstances, two starters sometimes recompose 
				// together to form another character
				var notdone = true;
				while (it.hasNext() && notdone) {
					this.nextChar = it.next();
					nextCcc = ilib.data.norm.ccc[this.nextChar];
					var codePoint = IString.toCodePoint(this.nextChar, 0);
					// Mn characters are Marks that are non-spacing. These do not take more room than an accent, so they should be 
					// considered part of the on-screen glyph, even if they are non-combining. Mc are marks that are spacing
					// and combining, which means they are part of the glyph, but they cause the glyph to use up more space than
					// just the base character alone.
					var isMn = CType._inRange(codePoint, "Mn", ilib.data.ctype_m);
					var isMc = CType._inRange(codePoint, "Mc", ilib.data.ctype_m);
					if (isMn || isMc || (typeof(nextCcc) !== 'undefined' && nextCcc !== 0)) {
						if (isMc) {
							this.spacingCombining = true;
						}
						ch += this.nextChar;
						this.nextChar = undefined;
					} else {
						// found the next starter. See if this can be composed with the previous starter
						var testChar = GlyphString._compose(composed, this.nextChar);
						if (prevCcc === 0 && typeof(testChar) !== 'undefined') { 
							// not blocked and there is a mapping 
							composed = testChar;
							ch += this.nextChar;
							this.nextChar = undefined;
						} else {
							// finished iterating, leave this.nextChar for the next next() call 
							notdone = false;
						}
					}
					prevCcc = nextCcc;
				}
			}
			return ch;
		};
		// Returns true if the last character returned by the "next" method included
		// spacing combining characters. If it does, then the character was wider than
		// just the base character alone, and the truncation code will not add it.
		this.wasSpacingCombining = function() {
			return this.spacingCombining;
		};
	};
	return new _chiterator(this);
};

/**
 * Truncate the current string at the given number of whole glyphs and return
 * the resulting string.
 * 
 * @param {number} length the number of whole glyphs to keep in the string
 * @return {string} a string truncated to the requested number of glyphs
 */
GlyphString.prototype.truncate = function(length) {
	var it = this.charIterator();
	var tr = "";
	for (var i = 0; i < length-1 && it.hasNext(); i++) {
		tr += it.next();
	}
	
	/*
	 * handle the last character separately. If it contains spacing combining
	 * accents, then we must assume that it uses up more horizontal space on
	 * the screen than just the base character by itself, and therefore this
	 * method will not truncate enough characters to fit in the given length.
	 * In this case, we have to chop off not only the combining characters, 
	 * but also the base character as well because the base without the
	 * combining accents is considered a different character.
	 */
	if (i < length && it.hasNext()) {
		var c = it.next();
		if (!it.wasSpacingCombining()) {
			tr += c;
		}
	}
	return tr;
};

/**
 * Truncate the current string at the given number of glyphs and add an ellipsis
 * to indicate that is more to the string. The ellipsis forms the last character
 * in the string, so the string is actually truncated at length-1 glyphs.
 * 
 * @param {number} length the number of whole glyphs to keep in the string 
 * including the ellipsis
 * @return {string} a string truncated to the requested number of glyphs
 * with an ellipsis
 */
GlyphString.prototype.ellipsize = function(length) {
	return this.truncate(length > 0 ? length-1 : 0) + "…";
};

module.exports = GlyphString;
