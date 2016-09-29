/*
 * CodePointSource.js - Source of code points from a string
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

// !depends isPunct.js NormString.js

var isPunct = require("./isPunct.js");
var NormString = require("./NormString.js");

/**
 * @class
 * Represents a buffered source of code points. The input string is first
 * normalized so that combining characters come out in a standardized order.
 * If the "ignorePunctuation" flag is turned on, then punctuation 
 * characters are skipped.
 * 
 * @constructor
 * @private
 * @param {NormString|string} str a string to get code points from
 * @param {boolean} ignorePunctuation whether or not to ignore punctuation
 * characters
 */
var CodePointSource = function(str, ignorePunctuation) {
	this.chars = [];
	// first convert the string to a normalized sequence of characters
	var s = (typeof(str) === "string") ? new NormString(str) : str;
	this.it = s.charIterator();
	this.ignorePunctuation = typeof(ignorePunctuation) === "boolean" && ignorePunctuation;
};

/**
 * Return the first num code points in the source without advancing the
 * source pointer. If there are not enough code points left in the
 * string to satisfy the request, this method will return undefined. 
 * 
 * @param {number} num the number of characters to peek ahead
 * @return {string|undefined} a string formed out of up to num code points from
 * the start of the string, or undefined if there are not enough character left
 * in the source to complete the request
 */
CodePointSource.prototype.peek = function(num) {
	if (num < 1) {
		return undefined;
	}
	if (this.chars.length < num && this.it.hasNext()) {
		for (var i = 0; this.chars.length < 4 && this.it.hasNext(); i++) {
			var c = this.it.next();
			if (c && !this.ignorePunctuation || !isPunct(c)) {
				this.chars.push(c);
			}
		}
	}
	if (this.chars.length < num) {
		return undefined;
	}
	return this.chars.slice(0, num).join("");
};
/**
 * Advance the source pointer by the given number of code points.
 * @param {number} num number of code points to advance
 */
CodePointSource.prototype.consume = function(num) {
	if (num > 0) {
		this.peek(num); // for the iterator to go forward if needed
		if (num < this.chars.length) {
			this.chars = this.chars.slice(num);
		} else {
			this.chars = [];
		}
	}
};

module.exports = CodePointSource;
