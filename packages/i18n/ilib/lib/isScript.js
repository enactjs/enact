/*
 * isScript.js - Character type is script
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

// !data scriptToRange

var ilib = require("./ilib.js");

var CType = require("./CType.js");
var IString = require("./IString.js");

/**
 * Return whether or not the first character in the given string is 
 * in the given script. The script is given as the 4-letter ISO
 * 15924 script code.<p>
 * 
 * @static
 * @param {string|IString|number} ch character or code point to examine
 * @param {string} script the 4-letter ISO 15924 to query against
 * @return {boolean} true if the first character is in the given script, and
 * false otherwise
 */
var isScript = function (ch, script) {
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

	return CType._inRange(num, script, ilib.data.scriptToRange);
};

/**
 * @protected
 * @param {boolean} sync
 * @param {Object|undefined} loadParams
 * @param {function(*)|undefined} onLoad
 */
isScript._init = function (sync, loadParams, onLoad) {
	CType._load("scriptToRange", sync, loadParams, onLoad);
};

module.exports = isScript;