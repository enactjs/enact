/*
 * isXdigit.js - Character type is hex digit
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

// !data ctype

var ilib = require("./ilib.js");

var CType = require("./CType.js");
var IString = require("./IString.js");

/**
 * Return whether or not the first character is a hexadecimal digit written
 * in the Latin script. (0-9 or A-F)<p>
 * 
 * @static
 * @param {string|IString|number} ch character or code point to examine
 * @return {boolean} true if the first character is a hexadecimal digit written
 * in the Latin script.
 */
var isXdigit = function (ch) {
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

	return CType._inRange(num, 'xdigit', ilib.data.ctype);
};

/**
 * @protected
 * @param {boolean} sync
 * @param {Object|undefined} loadParams
 * @param {function(*)|undefined} onLoad
 */
isXdigit._init = function (sync, loadParams, onLoad) {
	CType._init(sync, loadParams, onLoad);
};

module.exports = isXdigit;