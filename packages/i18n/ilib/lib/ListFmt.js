/*
 * ListFmt.js - Represent a list formatter.
 * 
 * Copyright © 2017, JEDLSoft
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

/*
!depends 
ilib.js 
Utils.js
Locale.js 
*/

// !data list

var ilib = require("./ilib.js");
var Utils = require("./Utils.js");
var Locale = require("./Locale.js");


/**
 * @class
 * Create a new list formatter object that formats lists of items according to 
 * the options.<p>
 * 
 * The options object can contain zero or more of the following parameters:
 *
 * <ul>
 * <li><i>locale</i> locale to use to format this list, or undefined to use the 
 * default locale
 * 
 * <li><i>length</i> - Specify the length of the format to use. The length is the approximate size of the 
 * formatted string.
 * 
 * <ul>
 * <li><i>short</i> 
 * <li><i>medium</i>  
 * <li><i>long</i>  
 * <li><i>full</i>
 * </ul>
 *
 * <li><i>style</i> the name of style to use to format the list, or undefined 
 * to use the default "standard" style. another style option is "units".
 *
 * <li><i>onLoad</i> - a callback function to call when the locale data is fully loaded and the address has been 
 * parsed. When the onLoad option is given, the address formatter object 
 * will attempt to load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the 
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two. 
 * 
 * <li><i>sync</i> - tell whether to load any missing locale data synchronously or 
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while. 
 *
 * <li><i>loadParams</i> - an object containing parameters to pass to the 
 * loader callback function when locale data is missing. The parameters are not
 * interpretted or modified in any way. They are simply passed along. The object 
 * may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
 * </ul>
 *
 * @constructor
 * @param {Object} options properties that control how this formatter behaves
 */
var ListFmt = function(options) {
	this.locale = new Locale();
	this.sync = true;
	this.style = "standard";
	this.length = "short";
	this.loadParams = {};
	
	if (options) {
		if (options.locale) {
			this.locale = options.locale;
		}

		if (typeof(options.sync) !== 'undefined') {
			this.sync = (options.sync == true);
		}

		if (options.length) {
			this.length = options.length;
		}

		if (options.loadParams) {
			this.loadParams = options.loadParams;
		}

		if (options.style) {
			this.style = options.style;
		}
	}

	Utils.loadData({
		name: "list.json",
		object: ListFmt,
		locale: this.locale, 
		sync: this.sync,
		loadParams: this.loadParams,
		callback: ilib.bind(this, function (fmtdata) {
			this.fmtdata = fmtdata;
			
			if (options && typeof(options.onLoad) === 'function') {
				options.onLoad(this);
			}
		})
	});
};

/**
 * Format a list of strings as grammatical text that is appropriate 
 * for the locale of this formatter.
 * 
 * @param {Array.<String>} items an array of strings to format in
 * order that you would like them to appear
 * @returns {string} a string containing the list of items that
 * is grammatically correct for the locale of this formatter
 */

ListFmt.prototype.format = function(items) {
	if (!items || (!ilib.isArray(items))) {
		return "";
	}

	var itemCount = items.length;
	var fmtTemplate, formattedList;
	var startFmt, middleFmt, endFmt;
	var i;
	
	fmtTemplate = this.fmtdata[this.style][this.length] || this.fmtdata[this.style];
	startFmt = fmtTemplate["start"];
	middleFmt = fmtTemplate["middle"];
	endFmt = fmtTemplate["end"];

	if (itemCount === 0) {
		return "";
	}
	else if (itemCount === 1) {
		formattedList =  items.toString();

	} else if ( itemCount === 2) {
		fmtTemplate = fmtTemplate["2"];
		formattedList = fmtTemplate.replace("{0}", items[0]).replace("{1}", items[1]);

	} else {
		for(i = itemCount; i >= 0 ; i--){
			if (i == itemCount) {
				formattedList = endFmt.replace("{0}", items[itemCount-2]).replace("{1}", items[itemCount-1]);
				i = i-2;
			} else if (i == 0) {
				formattedList = startFmt.replace("{0}",items[i]).replace("{1}", formattedList);
			}
			 else {
				formattedList = middleFmt.replace("{0}",items[i]).replace("{1}", formattedList);
			}
		}
	}
	return formattedList;
};

/**
 * Return the locale of this formatter.
 * 
 * @returns {string} the locale of this formatter
 */
ListFmt.prototype.getLocale = function() {
	return this.locale.getSpec();
};

/**
 * Return the style of names returned by this formatter
 * @return {string} the style of names returned by this formatter
 */
ListFmt.prototype.getStyle = function() {
	return this.style;
};

module.exports = ListFmt;