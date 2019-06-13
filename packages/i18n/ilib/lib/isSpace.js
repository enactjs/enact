/*
 * isSpace.js - Character type is space char
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

// !data ctype ctype_z

var ilib = require("./ilib.js");

var CType = require("./CType.js");
var IString = require("./IString.js");

/**
 * Return whether or not the first character is a whitespace character.<p>
 *
 * @static
 * @param {string|IString|number} ch character or code point to examine
 * @return {boolean} true if the first character is a whitespace character.
 */
var isSpace = function (ch) {
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

	return ilib.data.ctype && ilib.data.ctype_z ?
	    (CType._inRange(num, 'space', ilib.data.ctype) ||
		CType._inRange(num, 'Zs', ilib.data.ctype_z) ||
		CType._inRange(num, 'Zl', ilib.data.ctype_z) ||
		CType._inRange(num, 'Zp', ilib.data.ctype_z)) :
		(ch === ' ' || num === 0xA0 ||
		(num >= 0x09 && num <= 0x0D));
};

/**
 * @protected
 * @param {boolean} sync
 * @param {Object|undefined} loadParams
 * @param {function(*)|undefined} onLoad
 */
isSpace._init = function (sync, loadParams, onLoad) {
	CType._load("ctype_z", sync, loadParams, function () {
		CType._init(sync, loadParams, onLoad);
	});
};

module.exports = isSpace;