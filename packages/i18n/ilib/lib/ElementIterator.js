/*
 * ElementIterator.js - Iterate through a list of collation elements
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

/**
 * @class
 * An iterator through a sequence of collation elements. This
 * iterator takes a source of code points, converts them into
 * collation elements, and allows the caller to get single
 * elements at a time.
 * 
 * @constructor
 * @private
 * @param {CodePointSource} source source of code points to 
 * convert to collation elements
 * @param {Object} map mapping from sequences of code points to
 * collation elements
 * @param {number} keysize size in bits of the collation elements
 */
var ElementIterator = function (source, map, keysize) {
	this.elements = [];
	this.source = source;
	this.map = map;
	this.keysize = keysize;
};

/**
 * @private
 */
ElementIterator.prototype._fillBuffer = function () {
	var str = undefined;
	
	// peek ahead by up to 4 characters, which may combine
	// into 1 or more collation elements
	for (var i = 4; i > 0; i--) {
		str = this.source.peek(i);
		if (str && this.map[str]) {
			this.elements = this.elements.concat(this.map[str]);
			this.source.consume(i);
			return;
		}
	}
	
	if (str) {
		// no mappings for the first code point, so just use its
		// Unicode code point as a proxy for its sort order. Shift
		// it by the key size so that everything unknown sorts
		// after things that have mappings
		this.elements.push(str.charCodeAt(0) << this.keysize);
		this.source.consume(1);
	} else {
		// end of the string
		return undefined;
	}
};

/**
 * Return true if there are more collation elements left to
 * iterate through.
 * @returns {boolean} true if there are more elements left to
 * iterate through, and false otherwise
 */
ElementIterator.prototype.hasNext = function () {
	if (this.elements.length < 1) {
		this._fillBuffer();
	}
	return !!this.elements.length;
};

/**
 * Return the next collation element. If more than one collation 
 * element is generated from a sequence of code points 
 * (ie. an "expansion"), then this class will buffer the
 * other elements and return them on subsequent calls to 
 * this method.
 * 
 * @returns {number|undefined} the next collation element or
 * undefined for no more collation elements
 */
ElementIterator.prototype.next = function () {
	if (this.elements.length < 1) {
		this._fillBuffer();
	}
	var ret = this.elements[0];
	this.elements = this.elements.slice(1);
	return ret;
};

module.exports = ElementIterator;
