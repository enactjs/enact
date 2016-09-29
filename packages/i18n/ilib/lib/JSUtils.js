/*
 * JSUtils.js - Misc utilities to work around Javascript engine differences
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

// !depends ilib.js

var ilib = require("./ilib.js");

var JSUtils = {};

/**
 * Perform a shallow copy of the source object to the target object. This only 
 * copies the assignments of the source properties to the target properties, 
 * but not recursively from there.<p>
 * 
 * 
 * @static
 * @param {Object} source the source object to copy properties from
 * @param {Object} target the target object to copy properties into
 */
JSUtils.shallowCopy = function (source, target) {
	var prop = undefined;
	if (source && target) {
		for (prop in source) {
			if (prop !== undefined && typeof(source[prop]) !== 'undefined') {
				target[prop] = source[prop];
			}
		}
	}
};

/**
 * Perform a recursive deep copy from the "from" object to the "deep" object.
 * 
 * @static
 * @param {Object} from the object to copy from
 * @param {Object} to the object to copy to
 * @return {Object} a reference to the the "to" object
 */
JSUtils.deepCopy = function(from, to) {
	var prop;

	for (prop in from) {
		if (prop) {
			if (typeof(from[prop]) === 'object') {
				to[prop] = {};
				JSUtils.deepCopy(from[prop], to[prop]);
			} else {
				to[prop] = from[prop];
			}
		}
	}
	return to;
};

/**
 * Map a string to the given set of alternate characters. If the target set
 * does not contain a particular character in the input string, then that
 * character will be copied to the output unmapped.
 * 
 * @static
 * @param {string} str a string to map to an alternate set of characters
 * @param {Array.<string>|Object} map a mapping to alternate characters
 * @return {string} the source string where each character is mapped to alternate characters
 */
JSUtils.mapString = function (str, map) {
	var mapped = "";
	if (map && str) {
		for (var i = 0; i < str.length; i++) {
			var c = str.charAt(i); // TODO use a char iterator?
			mapped += map[c] || c; 
		}
	} else {
		mapped = str;
	}
	return mapped;
};

/**
 * Check if an object is a member of the given array. If this javascript engine
 * support indexOf, it is used directly. Otherwise, this function implements it
 * itself. The idea is to make sure that you can use the quick indexOf if it is
 * available, but use a slower implementation in older engines as well.
 * 
 * @static
 * @param {Array.<Object>} array array to search
 * @param {Object} obj object being sought. This should be of the same type as the
 * members of the array being searched. If not, this function will not return
 * any results.
 * @return {number} index of the object in the array, or -1 if it is not in the array.
 */
JSUtils.indexOf = function(array, obj) {
	if (!array || !obj) {
		return -1;
	}
	if (typeof(array.indexOf) === 'function') {
		return array.indexOf(obj);
	} else {
		for (var i = 0; i < array.length; i++) {
	        if (array[i] === obj) {
	            return i;
	        }
	    }
	    return -1;
	}
};

/**
 * Convert a string into the hexadecimal representation
 * of the Unicode characters in that string.
 * 
 * @static
 * @param {string} string The string to convert
 * @param {number=} limit the number of digits to use to represent the character (1 to 8)
 * @return {string} a hexadecimal representation of the
 * Unicode characters in the input string
 */
JSUtils.toHexString = function(string, limit) {
	var i, 
		result = "", 
		lim = (limit && limit < 9) ? limit : 4;
	
	if (!string) {
		return "";
	}
	for (i = 0; i < string.length; i++) {
		var ch = string.charCodeAt(i).toString(16);
		result += "00000000".substring(0, lim-ch.length) + ch;
	}
	return result.toUpperCase();
};

/**
 * Test whether an object in a Javascript Date. 
 * 
 * @static
 * @param {*} object The object to test
 * @return {boolean} return true if the object is a Date
 * and false otherwise
 */
JSUtils.isDate = function(object) {
	var o;
	if (typeof(object) === 'object') {
		o = /** @type {Object|null|undefined} */ object;
		return Object.prototype.toString.call(o) === '[object Date]';
	}
	return false; 
};

/**
 * Merge the properties of object2 into object1 in a deep manner and return a merged
 * object. If the property exists in both objects, the value in object2 will overwrite 
 * the value in object1. If a property exists in object1, but not in object2, its value
 * will not be touched. If a property exists in object2, but not in object1, it will be 
 * added to the merged result.<p>
 * 
 * Name1 and name2 are for creating debug output only. They are not necessary.<p>
 * 
 * 
 * @static
 * @param {*} object1 the object to merge into
 * @param {*} object2 the object to merge
 * @param {boolean=} replace if true, replace the array elements in object1 with those in object2.
 * If false, concatenate array elements in object1 with items in object2.
 * @param {string=} name1 name of the object being merged into
 * @param {string=} name2 name of the object being merged in
 * @return {Object} the merged object
 */
JSUtils.merge = function (object1, object2, replace, name1, name2) {
	var prop = undefined,
		newObj = {};
	for (prop in object1) {
		if (prop && typeof(object1[prop]) !== 'undefined') {
			newObj[prop] = object1[prop];
		}
	}
	for (prop in object2) {
		if (prop && typeof(object2[prop]) !== 'undefined') {
			if (ilib.isArray(object1[prop]) && ilib.isArray(object2[prop])) {
				if (typeof(replace) !== 'boolean' || !replace) {
					newObj[prop] = [].concat(object1[prop]);
					newObj[prop] = newObj[prop].concat(object2[prop]);
				} else {
					newObj[prop] = object2[prop];
				}
			} else if (typeof(object1[prop]) === 'object' && typeof(object2[prop]) === 'object') {
				newObj[prop] = JSUtils.merge(object1[prop], object2[prop], replace);
			} else {
				// for debugging. Used to determine whether or not json files are overriding their parents unnecessarily
				if (name1 && name2 && newObj[prop] == object2[prop]) {
					console.log("Property " + prop + " in " + name1 + " is being overridden by the same value in " + name2);
				}
				newObj[prop] = object2[prop];
			}
		}
	}
	return newObj;
};

/**
 * Return true if the given object has no properties.<p>
 * 
 * 
 * @static
 * @param {Object} obj the object to check
 * @return {boolean} true if the given object has no properties, false otherwise
 */
JSUtils.isEmpty = function (obj) {
	var prop = undefined;
	
	if (!obj) {
		return true;
	}
	
	for (prop in obj) {
		if (prop && typeof(obj[prop]) !== 'undefined') {
			return false;
		}
	}
	return true;
};

/**
 * @static
 */
JSUtils.hashCode = function(obj) {
	var hash = 0;
	
	function addHash(hash, newValue) {
		// co-prime numbers creates a nicely distributed hash
		hash *= 65543;
		hash += newValue;
		hash %= 2147483647; 
		return hash;
	}
	
	function stringHash(str) {
		var hash = 0;
		for (var i = 0; i < str.length; i++) {
			hash = addHash(hash, str.charCodeAt(i));
		}
		return hash;
	}
	
	switch (typeof(obj)) {
		case 'undefined':
			hash = 0;
			break;
		case 'string':
			hash = stringHash(obj);
			break;
		case 'function':
		case 'number':
		case 'xml':
			hash = stringHash(String(obj));
			break;
		case 'boolean':
			hash = obj ? 1 : 0;
			break;
		case 'object':
			var props = [];
			for (var p in obj) {
				if (obj.hasOwnProperty(p)) {
					props.push(p);
				}
			}
			// make sure the order of the properties doesn't matter
			props.sort();
			for (var i = 0; i < props.length; i++) {
				hash = addHash(hash, stringHash(props[i]));
				hash = addHash(hash, JSUtils.hashCode(obj[props[i]]));
			}
			break;
	}
	
	return hash;
};


module.exports = JSUtils;
