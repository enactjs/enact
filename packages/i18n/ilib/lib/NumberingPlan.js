/*
 * NumPlan.js - Represent a phone numbering plan.
 * 
 * Copyright © 2014-2015, JEDLSoft
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
Locale.js 
Utils.js
JSUtils.js
*/

// !data numplan

var ilib = require("./ilib.js");
var Utils = require("./Utils.js");
var JSUtils = require("./JSUtils.js");
var Locale = require("./Locale.js");

/**
 * @class
 * Create a numbering plan information instance for a particular country's plan.<p>
 * 
 * The options may contain any of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> - locale for which the numbering plan is sought. This locale
 * will be mapped to the actual numbering plan, which may be shared amongst a
 * number of countries.
 *
 * <li>onLoad - a callback function to call when the date format object is fully 
 * loaded. When the onLoad option is given, the DateFmt object will attempt to
 * load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the 
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two.
 * 
 * <li>sync - tell whether to load any missing locale data synchronously or 
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
 * @private
 * @constructor
 * @param {Object} options options governing the way this plan is loaded
 */
var NumberingPlan = function (options) {
	var sync = true,
	    loadParams = {};
	
	this.locale = new Locale();

	if (options) {
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? new Locale(options.locale) : options.locale;
		}
		
		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync == true);
		}
		
		if (options.loadParams) {
			loadParams = options.loadParams;
		}
	}	

	Utils.loadData({
		name: "numplan.json",
		object: "NumberingPlan",
		locale: this.locale,
		sync: sync, 
		loadParams: loadParams, 
		callback: ilib.bind(this, function (npdata) {
			if (!npdata) {
				npdata = {
					"region": "XX",
					"skipTrunk": false,
					"trunkCode": "0",
					"iddCode": "00",
					"dialingPlan": "closed",
					"commonFormatChars": " ()-./",
					"fieldLengths": {
						"areaCode": 0,
						"cic": 0,
						"mobilePrefix": 0,
						"serviceCode": 0
					}
				};
			}

			/** 
			 * @type {{
			 *   region:string,
			 *   skipTrunk:boolean,
			 *   trunkCode:string,
			 *   iddCode:string,
			 *   dialingPlan:string,
			 *   commonFormatChars:string,
			 *   fieldLengths:Object.<string,number>,
			 *   contextFree:boolean,
			 *   findExtensions:boolean,
			 *   trunkRequired:boolean,
			 *   extendedAreaCodes:boolean
			 * }}
			 */
			this.npdata = npdata;
			if (options && typeof(options.onLoad) === 'function') {
				options.onLoad(this);
			}
		})
	});
};

NumberingPlan.prototype = {
	/**
	 * Return the name of this plan. This may be different than the 
	 * name of the region because sometimes multiple countries share 
	 * the same plan.
	 * @return {string} the name of the plan
	 */
	getName: function() {
		return this.npdata.region;
	},

	/**
	 * Return the trunk code of the current plan as a string.
	 * @return {string|undefined} the trunk code of the plan or
	 * undefined if there is no trunk code in this plan
	 */
	getTrunkCode: function() {
		return this.npdata.trunkCode;
	},
	
	/**
	 * Return the international direct dialing code of this plan.
	 * @return {string} the IDD code of this plan
	 */
	getIDDCode: function() {
		return this.npdata.iddCode;	
	},
	
	/**
	 * Return the plan style for this plan. The plan style may be
	 * one of:
	 * 
	 * <ul>
	 * <li>"open" - area codes may be left off if the caller is 
	 * dialing to another number within the same area code
	 * <li>"closed" - the area code must always be specified, even
	 * if calling another number within the same area code
	 * </ul>
	 * 
	 * @return {string} the plan style, "open" or "closed"
	 */
	getPlanStyle: function() {	
		return this.npdata.dialingPlan;
	},
	/** [Need Comment]
	 * Return a contextFree
	 *
	 * @return {boolean}
	 */
	getContextFree: function() {
		return this.npdata.contextFree;
	},
	/** [Need Comment]
	 * Return a findExtensions
	 * 
	 * @return {boolean}
	 */
	getFindExtensions: function() {
		return this.npdata.findExtensions;
	},
	/** [Need Comment]
	 * Return a skipTrunk
	 * 
	 * @return {boolean}
	 */
	getSkipTrunk: function() {
		return this.npdata.skipTrunk;
	},
	/** [Need Comment]
	 * Return a skipTrunk
	 * 
	 * @return {boolean}
	 */
	getTrunkRequired: function() {
		return this.npdata.trunkRequired;
	},
	/**
	 * Return true if this plan uses extended area codes.
	 * @return {boolean} true if the plan uses extended area codes
	 */
	getExtendedAreaCode: function() {
		return this.npdata.extendedAreaCodes;
	},
	/**
	 * Return a string containing all of the common format characters
	 * used to format numbers.
	 * @return {string} the common format characters fused in this locale
	 */
	getCommonFormatChars: function() {
		return this.npdata.commonFormatChars;
	},
	
	/**
	 * Return the length of the field with the given name. If the length
	 * is returned as 0, this means it is variable length.
	 * 
	 * @param {string} field name of the field for which the length is 
	 * being sought
	 * @return {number} if positive, this gives the length of the given 
	 * field. If zero, the field is variable length. If negative, the
	 * field is not known.
	 */
	getFieldLength: function (field) {
		var dataField = this.npdata.fieldLengths;
		
		return dataField[field];
	}
};

module.exports = NumberingPlan;