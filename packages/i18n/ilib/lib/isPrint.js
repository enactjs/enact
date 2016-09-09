/*
 * isPrint.js - Character type is printable char
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

// !depends CType.js isCntrl.js

var CType = require("./CType.js");
var isCntrl = require("./isCntrl.js");

/**
 * Return whether or not the first character is any printable character,
 * including space.<p>
 * 
 * @static
 * @param {string|IString|number} ch character or code point to examine
 * @return {boolean} true if the first character is printable.
 */
var isPrint = function (ch) {
	return typeof(ch) !== 'undefined' && ch.length > 0 && !isCntrl(ch);
};

/**
 * @protected
 * @param {boolean} sync
 * @param {Object|undefined} loadParams
 * @param {function(*)|undefined} onLoad
 */
isPrint._init = function (sync, loadParams, onLoad) {
	isCntrl._init(sync, loadParams, onLoad);
};

module.exports = isPrint;