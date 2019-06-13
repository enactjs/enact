/*
 * isDigit.js - Character type is digit
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

// !depends CType.js IString.js ilib.js

// !data ctype ctype_n

var ilib = require("./ilib.js");
var CType = require("./CType.js");
var IString = require("./IString.js");

/**
 * Return whether or not the first character is a digit character in the
 * Latin script.<p>
 *
 * @static
 * @param {string|IString|number} ch character or code point to examine
 * @return {boolean} true if the first character is a digit character in the
 * Latin script.
 */
var isDigit = function (ch) {
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
	return ilib.data.ctype ? CType._inRange(num, 'Nd', ilib.data.ctype_n) : (num >= 0x30 && num <= 0x39);
};

/**
 * @protected
 * @param {boolean} sync
 * @param {Object|undefined} loadParams
 * @param {function(*)|undefined} onLoad
 */
isDigit._init = function (sync, loadParams, onLoad) {
    CType._load("ctype_n", sync, loadParams, onLoad);
};

module.exports = isDigit;
