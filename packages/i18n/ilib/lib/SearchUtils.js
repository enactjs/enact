/*
 * SearchUtils.js - Misc search utility routines
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

var SearchUtils = {};

/**
 * Binary search a sorted array for a particular target value.
 * If the exact value is not found, it returns the index of the smallest 
 * entry that is greater than the given target value.<p> 
 * 
 * The comparator
 * parameter is a function that knows how to compare elements of the 
 * array and the target. The function should return a value greater than 0
 * if the array element is greater than the target, a value less than 0 if
 * the array element is less than the target, and 0 if the array element 
 * and the target are equivalent.<p>
 * 
 * If the comparator function is not specified, this function assumes
 * the array and the target are numeric values and should be compared 
 * as such.<p>
 * 
 * 
 * @static
 * @param {*} target element being sought 
 * @param {Array} arr the array being searched
 * @param {?function(*,*)=} comparator a comparator that is appropriate for comparing two entries
 * in the array  
 * @return the index of the array into which the value would fit if 
 * inserted, or -1 if given array is not an array or the target is not 
 * a number
 */
SearchUtils.bsearch = function(target, arr, comparator) {
	if (typeof(arr) === 'undefined' || !arr || typeof(target) === 'undefined') {
		return -1;
	}
	
	var high = arr.length - 1,
		low = 0,
		mid = 0,
		value,
		cmp = comparator || SearchUtils.bsearch.numbers;
	
	while (low <= high) {
		mid = Math.floor((high+low)/2);
		value = cmp(arr[mid], target);
		if (value > 0) {
			high = mid - 1;
		} else if (value < 0) {
			low = mid + 1;
		} else {
			return mid;
		}
	}
	
	return low;
};

/**
 * Returns whether or not the given element is greater than, less than,
 * or equal to the given target.<p>
 * 
 * @private
 * @static
 * @param {number} element the element being tested
 * @param {number} target the target being sought
 */
SearchUtils.bsearch.numbers = function(element, target) {
	return element - target;
};

/**
 * Do a bisection search of a function for a particular target value.<p> 
 * 
 * The function to search is a function that takes a numeric parameter, 
 * does calculations, and returns gives a numeric result. The 
 * function should should be smooth and not have any discontinuities 
 * between the low and high values of the parameter.
 *  
 * 
 * @static
 * @param {number} target value being sought
 * @param {number} low the lower bounds to start searching
 * @param {number} high the upper bounds to start searching
 * @param {number} precision minimum precision to support. Use 0 if you want to use the default.
 * @param {?function(number)=} func function to search 
 * @return an approximation of the input value to the function that gives the desired
 * target output value, correct to within the error range of Javascript floating point 
 * arithmetic, or NaN if there was some error
 */
SearchUtils.bisectionSearch = function(target, low, high, precision, func) {
	if (typeof(target) !== 'number' || 
			typeof(low) !== 'number' || 
			typeof(high) !== 'number' || 
			typeof(func) !== 'function') {
		return NaN;
	}
	
	var mid = 0,
		value,
		pre = precision > 0 ? precision : 1e-13;
	
	do {
		mid = (high+low)/2;
		value = func(mid);
		if (value > target) {
			high = mid;
		} else if (value < target) {
			low = mid;
		}
	} while (high - low > pre);
	
	return mid;
};

module.exports = SearchUtils;
