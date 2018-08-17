/*
 * isPunct.js - Character type is punctuation
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

// !depends CType.js IString.js

// !data ctype_p

var ilib = require("./ilib.js");

var CType = require("./CType.js");
var IString = require("./IString.js");

/**
 * Return whether or not the first character is punctuation.<p>
 *
 * @static
 * @param {string|IString|number} ch character or code point to examine
 * @return {boolean} true if the first character is punctuation.
 */
var isPunct = function (ch) {
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

	return ilib.data.ctype_p ?
	    (CType._inRange(num, 'Pd', ilib.data.ctype_p) ||
		CType._inRange(num, 'Ps', ilib.data.ctype_p) ||
		CType._inRange(num, 'Pe', ilib.data.ctype_p) ||
		CType._inRange(num, 'Pc', ilib.data.ctype_p) ||
		CType._inRange(num, 'Po', ilib.data.ctype_p) ||
		CType._inRange(num, 'Pi', ilib.data.ctype_p) ||
		CType._inRange(num, 'Pf', ilib.data.ctype_p)) :
		((num >= 0x21 && num <= 0x2F) ||
		(num >= 0x3A && num <= 0x40) ||
		(num >= 0x5B && num <= 0x60) ||
		(num >= 0x7B && num <= 0x7E));
};

/**
 * @protected
 * @param {boolean} sync
 * @param {Object|undefined} loadParams
 * @param {function(*)|undefined} onLoad
 */
isPunct._init = function (sync, loadParams, onLoad) {
	CType._load("ctype_p", sync, loadParams, onLoad);
};

module.exports = isPunct;
