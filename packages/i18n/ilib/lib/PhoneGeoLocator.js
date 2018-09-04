/*
 * phonegeo.js - Represent a phone number geolocator object.
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
NumberingPlan.js
PhoneLocale.js
PhoneNumber.js
Utils.js
JSUtils.js
ResBundle.js
*/

// !data iddarea area extarea extstates phoneres

var ilib = require("./ilib.js");
var Utils = require("./Utils.js");
var JSUtils = require("./JSUtils.js");
var Locale = require("./Locale.js");

var PhoneNumber = require("./PhoneNumber.js");
var NumberingPlan = require("./NumberingPlan.js");
var PhoneLocale = require("./PhoneLocale.js");
var ResBundle = require("./ResBundle.js");

/**
 * @class
 * Create an instance that can geographically locate a phone number.<p>
 * 
 * The location of the number is calculated according to the following rules:
 * 
 * <ol>
 * <li>If the areaCode property is undefined or empty, or if the number specifies a 
 * country code for which we do not have information, then the area property may be 
 * missing from the returned object. In this case, only the country object will be returned.
 * 
 * <li>If there is no area code, but there is a mobile prefix, service code, or emergency 
 * code, then a fixed string indicating the type of number will be returned.
 * 
 * <li>The country object is filled out according to the countryCode property of the phone
 * number. 
 * 
 * <li>If the phone number does not have an explicit country code, the MCC will be used if
 * it is available. The country code can be gleaned directly from the MCC. If the MCC 
 * of the carrier to which the phone is currently connected is available, it should be 
 * passed in so that local phone numbers will look correct.
 * 
 * <li>If the country's dialling plan mandates a fixed length for phone numbers, and a 
 * particular number exceeds that length, then the area code will not be given on the
 * assumption that the number has problems in the first place and we cannot guess
 * correctly.
 * </ol>
 * 
 * The returned area property varies in specificity according
 * to the locale. In North America, the area is no finer than large parts of states
 * or provinces. In Germany and the UK, the area can be as fine as small towns.<p>
 * 
 * If the number passed in is invalid, no geolocation will be performed. If the location
 * information about the country where the phone number is located is not available,
 * then the area information will be missing and only the country will be available.<p>
 * 
 * The options parameter can contain any one of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> The locale parameter is used to load translations of the names of regions and
 * areas if available. For example, if the locale property is given as "en-US" (English for USA), 
 * but the phone number being geolocated is in Germany, then this class would return the the names
 * of the country (Germany) and region inside of Germany in English instead of German. That is, a 
 * phone number in Munich and return the country "Germany" and the area code "Munich"
 * instead of "Deutschland" and "München". The default display locale is the current ilib locale. 
 * If translations are not available, the region and area names are given in English, which should 
 * always be available.
 * <li><i>mcc</i> The mcc of the current mobile carrier, if known.
 * 
 * <li><i>onLoad</i> - a callback function to call when the data for the
 * locale is fully loaded. When the onLoad option is given, this object 
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
 * @param {Object} options parameters controlling the geolocation of the phone number.
 */
var PhoneGeoLocator = function(options) {
	var sync = true,
		loadParams = {},
		locale = ilib.getLocale();

	if (options) {
		if (options.locale) {
			locale = options.locale;
		}

		if (typeof(options.sync) === 'boolean') {
			sync = options.sync;
		}
		
		if (options.loadParams) {
			loadParams = options.loadParams;
		}
	}
	
	new PhoneLocale({
		locale: locale,
		mcc: options && options.mcc,
		countryCode: options && options.countryCode,
		sync: sync,
		loadParams: loadParams,
		onLoad: ilib.bind(this, function (loc) {
			this.locale = loc;
			new NumberingPlan({
				locale: this.locale,
				sync: sync,
				loadParams: loadParams,
				onLoad: ilib.bind(this, function (plan) {
					this.plan = plan;
					
					new ResBundle({
						locale: this.locale,
						name: "phoneres",
						sync: sync,
						loadParams: loadParams,
						onLoad: ilib.bind(this, function (rb) {
							this.rb = rb;
							
							Utils.loadData({
								name: "iddarea.json",
								object: "PhoneGeoLocator",
								nonlocale: true,
								sync: sync,
								loadParams: loadParams,
								callback: ilib.bind(this, function (data) {
									this.regiondata = data;
									Utils.loadData({
										name: "area.json",
										object: "PhoneGeoLocator",
										locale: this.locale,
										sync: sync,
										loadParams: JSUtils.merge(loadParams, {
											returnOne: true
										}),
										callback: ilib.bind(this, function (areadata) {
											this.areadata = areadata;
		
											if (options && typeof(options.onLoad) === 'function') {
												options.onLoad(this);
											}
										})
									});
								})
							});
						})
					});
				})
			});
		})
	});
};

PhoneGeoLocator.prototype = {
	/**
	 * @private
	 * 
	 * Used for locales where the area code is very general, and you need to add in
	 * the initial digits of the subscriber number in order to get the area
	 * 
	 * @param {string} number
	 * @param {Object} stateTable
	 */
	_parseAreaAndSubscriber: function (number, stateTable) {
		var ch,
			i,
			handlerMethod,
			newState,
			prefix = "",
			consumed,
			lastLeaf,
			currentState,
			dot = 14;	// special transition which matches all characters. See AreaCodeTableMaker.java

		if (!number || !stateTable) {
			// can't parse anything
			return undefined;
		}

		//console.log("GeoLocator._parseAreaAndSubscriber: parsing number " + number);

		currentState = stateTable;
		i = 0;
		while (i < number.length) {
			ch = PhoneNumber._getCharacterCode(number.charAt(i));
			if (ch >= 0) {
				// newState = stateData.states[state][ch];
				newState = currentState.s && currentState.s[ch];
				
				if (!newState && currentState.s && currentState.s[dot]) {
					newState = currentState.s[dot];
				}
				
				if (typeof(newState) === 'object') {
					if (typeof(newState.l) !== 'undefined') {
						// save for latter if needed
						lastLeaf = newState;
						consumed = i;
					}
					// console.info("recognized digit " + ch + " continuing...");
					// recognized digit, so continue parsing
					currentState = newState;
					i++;
				} else {
					if (typeof(newState) === 'undefined' || newState === 0) {
						// this is possibly a look-ahead and it didn't work... 
						// so fall back to the last leaf and use that as the
						// final state
						newState = lastLeaf;
						i = consumed;
					}
					
					if ((typeof(newState) === 'number' && newState) ||
						(typeof(newState) === 'object' && typeof(newState.l) !== 'undefined')) {
						// final state
						var stateNumber = typeof(newState) === 'number' ? newState : newState.l;
						handlerMethod = PhoneNumber._states[stateNumber];

						//console.info("reached final state " + newState + " handler method is " + handlerMethod + " and i is " + i);
	
						return (handlerMethod === "area") ? number.substring(0, i+1) : undefined;
					} else {
						// failed parse. Either no last leaf to fall back to, or there was an explicit
						// zero in the table
						break;
					}
				}
			} else if (ch === -1) {
				// non-transition character, continue parsing in the same state
				i++;
			} else {
				// should not happen
				// console.info("skipping character " + ch);
				// not a digit, plus, pound, or star, so this is probably a formatting char. Skip it.
				i++;
			}
		}
		return undefined;
	},
	/**
	 * @private
	 * @param prefix
	 * @param table
	 * @returns
	 */
	_matchPrefix: function(prefix, table)  {
		var i, matchedDot, matchesWithDots = [];

		if (table[prefix]) {
			return table[prefix];
		}
		for (var entry in table) {
			if (entry && typeof(entry) === 'string') {
				i = 0;
				matchedDot = false;
				while (i < entry.length && (entry.charAt(i) === prefix.charAt(i) || entry.charAt(i) === '.')) {
					if (entry.charAt(i) === '.') {
						matchedDot = true;
					}
					i++;
				}
				if (i >= entry.length) {
					if (matchedDot) {
						matchesWithDots.push(entry);
					} else {
						return table[entry];
					}
				}
			}
		}

		// match entries with dots last, so sort the matches so that the entry with the 
		// most dots sorts last. The entry that ends up at the beginning of the list is
		// the best match because it has the fewest dots
		if (matchesWithDots.length > 0) {
			matchesWithDots.sort(function (left, right) {
				return (right < left) ? -1 : ((left < right) ? 1 : 0);
			});
			return table[matchesWithDots[0]];
		}
		
		return undefined;
	},
	/**
	 * @private
	 * @param number
	 * @param data
	 * @param locale
	 * @param plan
	 * @param options
	 * @returns {Object}
	 */
	_getAreaInfo: function(number, data, locale, plan, options) {
		var sync = true,
			ret = {}, 
			countryCode, 
			areaInfo, 
			temp, 
			areaCode, 
			geoTable, 
			tempNumber, 
			prefix;

		if (options && typeof(options.sync) === 'boolean') {
			sync = options.sync;
		}

		prefix = number.areaCode || number.serviceCode;
		geoTable = data;
		
		if (prefix !== undefined) {
			if (plan.getExtendedAreaCode()) {
				// for countries where the area code is very general and large, and you need a few initial
				// digits of the subscriber number in order find the actual area
				tempNumber = prefix + number.subscriberNumber;
				tempNumber = tempNumber.replace(/[wWpPtT\+#\*]/g, '');	// fix for NOV-108200
		
				Utils.loadData({
					name: "extarea.json",
					object: "PhoneGeoLocator", 
					locale: locale,
					sync: sync,
					loadParams: JSUtils.merge((options && options.loadParams) || {}, {returnOne: true}),
					callback: ilib.bind(this, function (data) {
						this.extarea = data;
						Utils.loadData({
							name: "extstates.json",
							object: "PhoneGeoLocator", 
							locale: locale,
							sync: sync,
							loadParams: JSUtils.merge((options && options.loadParams) || {}, {returnOne: true}),
							callback: ilib.bind(this, function (data) {
								this.extstates = data;
								geoTable = this.extarea;
								if (this.extarea && this.extstates) {
									prefix = this._parseAreaAndSubscriber(tempNumber, this.extstates);
								}
								
								if (!prefix) {
									// not a recognized prefix, so now try the general table
									geoTable = this.areadata;
									prefix = number.areaCode || number.serviceCode;					
								}

								if ((!plan.fieldLengths || 
								  plan.getFieldLength('maxLocalLength') === undefined ||
								  !number.subscriberNumber ||
								 	number.subscriberNumber.length <= plan.fieldLengths('maxLocalLength'))) {
								  	areaInfo = this._matchPrefix(prefix, geoTable);
									if (areaInfo && areaInfo.sn && areaInfo.ln) {
										//console.log("Found areaInfo " + JSON.stringify(areaInfo));
										ret.area = {
											sn: this.rb.getString(areaInfo.sn).toString(),
											ln: this.rb.getString(areaInfo.ln).toString()
										};
									}
								}		
							})
						});
					})
				});

			} else if (!plan || 
					plan.getFieldLength('maxLocalLength') === undefined || 
					!number.subscriberNumber ||
					number.subscriberNumber.length <= plan.getFieldLength('maxLocalLength')) {
				if (geoTable) {
					areaCode = prefix.replace(/[wWpPtT\+#\*]/g, '');
					areaInfo = this._matchPrefix(areaCode, geoTable);

					if (areaInfo && areaInfo.sn && areaInfo.ln) {
						ret.area = {
							sn: this.rb.getString(areaInfo.sn).toString(),
							ln: this.rb.getString(areaInfo.ln).toString()
						};
					} else if (number.serviceCode) {
						ret.area = {
							sn: this.rb.getString("Service Number").toString(),
							ln: this.rb.getString("Service Number").toString()
						};
					}
				} else {
					countryCode = number.locale._mapRegiontoCC(this.locale.getRegion());
					if (countryCode !== "0" && this.regiondata) {
						temp = this.regiondata[countryCode];
						if (temp && temp.sn) {
							ret.country = {
								sn: this.rb.getString(temp.sn).toString(),
								ln: this.rb.getString(temp.ln).toString(),
								code: this.locale.getRegion()
							};
						}
					}
				}
			} else {
				countryCode = number.locale._mapRegiontoCC(this.locale.getRegion());
				if (countryCode !== "0" && this.regiondata) {
					temp = this.regiondata[countryCode];
					if (temp && temp.sn) {
						ret.country = {
							sn: this.rb.getString(temp.sn).toString(),
							ln: this.rb.getString(temp.ln).toString(),
							code: this.locale.getRegion()
						};
					}
				}
			}

		} else if (number.mobilePrefix) {
			ret.area = {
				sn: this.rb.getString("Mobile Number").toString(),
				ln: this.rb.getString("Mobile Number").toString()
			};
		} else if (number.emergency) {
			ret.area = {
				sn: this.rb.getString("Emergency Services Number").toString(),
				ln: this.rb.getString("Emergency Services Number").toString()
			};
		}

		return ret;
	},
	/**
	 * Returns a the location of the given phone number, if known. 
	 * The returned object has 2 properties, each of which has an sn (short name) 
	 * and an ln (long name) string. Additionally, the country code, if given,
	 * includes the 2 letter ISO code for the recognized country.
	 *	 	{
	 *			"country": {
	 *	        	"sn": "North America",
	 *            	"ln": "North America and the Caribbean Islands",
	 *				"code": "us"
	 *         	 },
	 *         	 "area": {
	 *       	    "sn": "California",
	 *          	 "ln": "Central California: San Jose, Los Gatos, Milpitas, Sunnyvale, Cupertino, Gilroy"
	 *         	 }
	 *    	 }
	 * 
	 * The location name is subject to the following rules:
	 *
	 * If the areaCode property is undefined or empty, or if the number specifies a 
	 * country code for which we do not have information, then the area property may be 
	 * missing from the returned object. In this case, only the country object will be returned.
	 *
	 * If there is no area code, but there is a mobile prefix, service code, or emergency 
	 * code, then a fixed string indicating the type of number will be returned.
	 * 
	 * The country object is filled out according to the countryCode property of the phone
	 * number. 
	 * 
	 * If the phone number does not have an explicit country code, the MCC will be used if
	 * it is available. The country code can be gleaned directly from the MCC. If the MCC 
	 * of the carrier to which the phone is currently connected is available, it should be 
	 * passed in so that local phone numbers will look correct.
	 * 
	 * If the country's dialling plan mandates a fixed length for phone numbers, and a 
	 * particular number exceeds that length, then the area code will not be given on the
	 * assumption that the number has problems in the first place and we cannot guess
	 * correctly.
	 *
	 * The returned area property varies in specificity according
	 * to the locale. In North America, the area is no finer than large parts of states
	 * or provinces. In Germany and the UK, the area can be as fine as small towns.
	 *
	 * The strings returned from this function are already localized to the 
	 * given locale, and thus are ready for display to the user.
	 *
	 * If the number passed in is invalid, an empty object is returned. If the location
	 * information about the country where the phone number is located is not available,
	 * then the area information will be missing and only the country will be returned.
     *
	 * The options parameter can contain any one of the following properties:
 	 * 
 	 * <ul>
 	 * <li><i>locale</i> The locale parameter is used to load translations of the names of regions and
 	 * areas if available. For example, if the locale property is given as "en-US" (English for USA), 
 	 * but the phone number being geolocated is in Germany, then this class would return the the names
 	 * of the country (Germany) and region inside of Germany in English instead of German. That is, a 
 	 * phone number in Munich and return the country "Germany" and the area code "Munich"
 	 * instead of "Deutschland" and "München". The default display locale is the current ilib locale. 
 	 * If translations are not available, the region and area names are given in English, which should 
 	 * always be available.
 	 * <li><i>mcc</i> The mcc of the current mobile carrier, if known.
 	 * 
 	 * <li><i>onLoad</i> - a callback function to call when the data for the
 	 * locale is fully loaded. When the onLoad option is given, this object 
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
	 * @param {PhoneNumber} number phone number to locate
	 * @param {Object} options options governing the way this ares is loaded
	 * @return {Object} an object  
	 * that describes the country and the area in that country corresponding to this
	 * phone number. Each of the country and area contain a short name (sn) and long
	 * name (ln) that describes the location.
	 */
	locate: function(number, options) {
		var loadParams = {},
			ret = {}, 
			region, 
			countryCode, 
			temp, 
			plan,
			areaResult,
			phoneLoc = this.locale,
			sync = true;

		if (number === undefined || typeof(number) !== 'object' || !(number instanceof PhoneNumber)) {
			return ret;
		}

		if (options) {
			if (typeof(options.sync) !== 'undefined') {
				sync = (options.sync == true);
			}
		
			if (options.loadParams) {
				loadParams = options.loadParams;
			}
		}

		// console.log("GeoLocator.locate: looking for geo for number " + JSON.stringify(number));
		region = this.locale.getRegion();
		if (number.countryCode !== undefined && this.regiondata) {
			countryCode = number.countryCode.replace(/[wWpPtT\+#\*]/g, '');
			temp = this.regiondata[countryCode];
			phoneLoc = number.destinationLocale;
			plan = number.destinationPlan;
			ret.country = {
				sn: this.rb.getString(temp.sn).toString(),
				ln: this.rb.getString(temp.ln).toString(),
				code: phoneLoc.getRegion()
			};
		}
		
		if (!plan) {
			plan = this.plan;
		}
		
		Utils.loadData({
			name: "area.json",
			object: "PhoneGeoLocator",
			locale: phoneLoc,
			sync: sync,
			loadParams: JSUtils.merge(loadParams, {
				returnOne: true
			}),
			callback: ilib.bind(this, function (areadata) {
				if (areadata) {
					this.areadata = areadata;	
				}
				areaResult = this._getAreaInfo(number, this.areadata, phoneLoc, plan, options);
				ret = JSUtils.merge(ret, areaResult);

				if (ret.country === undefined) {
					countryCode = number.locale._mapRegiontoCC(region);
					
					if (countryCode !== "0" && this.regiondata) {
						temp = this.regiondata[countryCode];
						if (temp && temp.sn) {
							ret.country = {
								sn: this.rb.getString(temp.sn).toString(),
								ln: this.rb.getString(temp.ln).toString(),
								code: this.locale.getRegion()
							};
						}
					}
				}
			})
		});
		
		return ret;
	},
	
	/**
	 * Returns a string that describes the ISO-3166-2 country code of the given phone
	 * number.<p> 
	 * 
	 * If the phone number is a local phone number and does not contain
	 * any country information, this routine will return the region for the current
	 * formatter instance.
     *
	 * @param {PhoneNumber} number An PhoneNumber instance
	 * @return {string}
	 */
	country: function(number) {
		var countryCode,
			region,
			phoneLoc;

		if (!number || !(number instanceof PhoneNumber)) {
			return "";
		}

		phoneLoc = number.locale;

		region = (number.countryCode && phoneLoc._mapCCtoRegion(number.countryCode)) ||
			(number.locale && number.locale.region) || 
			phoneLoc.locale.getRegion() ||
			this.locale.getRegion();

		countryCode = number.countryCode || phoneLoc._mapRegiontoCC(region);
		
		if (number.areaCode) {
			region = phoneLoc._mapAreatoRegion(countryCode, number.areaCode);
		} else if (countryCode === "33" && number.serviceCode) {
			// french departments are in the service code, not the area code
			region = phoneLoc._mapAreatoRegion(countryCode, number.serviceCode);
		}		
		return region;
	}
};

module.exports = PhoneGeoLocator;