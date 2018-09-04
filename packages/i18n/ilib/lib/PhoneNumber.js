/*
 * phonenum.js - Represent a phone number.
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
PhoneHandlerFactory.js
Utils.js
JSUtils.js
*/

// !data states idd mnc

var ilib = require("./ilib.js");
var Utils = require("./Utils.js");
var JSUtils = require("./JSUtils.js");
var Locale = require("./Locale.js");
var NumberingPlan = require("./NumberingPlan.js");
var PhoneLocale = require("./PhoneLocale.js");
var PhoneHandlerFactory = require("./PhoneHandlerFactory.js");

/**
 * @class
 * Create a new phone number instance that parses the phone number parameter for its 
 * constituent parts, and store them as separate fields in the returned object.
 * 
 * The options object may include any of these properties:
 * 
 * <ul>
 * <li><i>locale</i> The locale with which to parse the number. This gives a clue as to which
 * numbering plan to use.
 * <li><i>mcc</i> The mobile carrier code (MCC) associated with the carrier that the phone is 
 * currently connected to, if known. This also can give a clue as to which numbering plan to
 * use
 * <li>onLoad - a callback function to call when this instance is fully 
 * loaded. When the onLoad option is given, this class will attempt to
 * load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the 
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two.
 * <li>sync - tell whether to load any missing locale data synchronously or 
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while.
 * <li><i>loadParams</i> - an object containing parameters to pass to the 
 * loader callback function when locale data is missing. The parameters are not
 * interpretted or modified in any way. They are simply passed along. The object 
 * may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
 * </ul>
 * 
 * This function is locale-sensitive, and will assume any number passed to it is
 * appropriate for the given locale. If the MCC is given, this method will assume
 * that numbers without an explicit country code have been dialled within the country
 * given by the MCC. This affects how things like area codes are parsed. If the MCC
 * is not given, this method will use the given locale to determine the country
 * code. If the locale is not explicitly given either, then this function uses the 
 * region of current locale as the default.<p>
 * 
 * The input number may contain any formatting characters for the given locale. Each 
 * field that is returned in the json object is a simple string of digits with
 * all formatting and whitespace characters removed.<p>
 * 
 * The number is decomposed into its parts, regardless if the number
 * contains formatting characters. If a particular part cannot be extracted from given 
 * number, the field will not be returned as a field in the object. If no fields can be
 * extracted from the number at all, then all digits found in the string will be 
 * returned in the subscriberNumber field. If the number parameter contains no 
 * digits, an empty object is returned.<p>
 * 
 * This instance can contain any of the following fields after parsing is done:
 * 
 * <ul>
 * <li>vsc - if this number starts with a VSC (Vertical Service Code, or "star code"), this field will contain the star and the code together
 * <li>iddPrefix - the prefix for international direct dialing. This can either be in the form of a plus character or the IDD access code for the given locale
 * <li>countryCode - if this number is an international direct dial number, this is the country code
 * <li>cic - for "dial-around" services (access to other carriers), this is the prefix used as the carrier identification code
 * <li>emergency - an emergency services number
 * <li>mobilePrefix - prefix that introduces a mobile phone number
 * <li>trunkAccess - trunk access code (long-distance access)
 * <li>serviceCode - like a geographic area code, but it is a required prefix for various services
 * <li>areaCode - geographic area codes
 * <li>subscriberNumber - the unique number of the person or company that pays for this phone line
 * <li>extension - in some countries, extensions are dialed directly without going through an operator or a voice prompt system. If the number includes an extension, it is given in this field.
 * <li>invalid - this property is added and set to true if the parser found that the number is invalid in the numbering plan for the country. This method will make its best effort at parsing, but any digits after the error will go into the subscriberNumber field
 * </ul>
 * 
 * The following rules determine how the number is parsed:
 * 
 * <ol>
 * <li>If the number starts with a character that is alphabetic instead of numeric, do
 * not parse the number at all. There is a good chance that it is not really a phone number.
 * In this case, an empty instance will be returned.
 * <li>If the phone number uses the plus notation or explicitly uses the international direct
 * dialing prefix for the given locale, then the country code is identified in 
 * the number. The rules of given locale are used to parse the IDD prefix, and then the rules
 * of the country in the prefix are used to parse the rest of the number.
 * <li>If a country code is provided as an argument to the function call, use that country's
 * parsing rules for the number. This is intended for programs like a Contacts application that 
 * know what the country is of the person that owns the phone number and can pass that on as 
 * a hint.
 * <li>If the appropriate locale cannot be easily determined, default to using the rules 
 * for the current user's region.
 * </ol>
 * 
 * Example: parsing the number "+49 02101345345-78" will give the following properties in the
 * resulting phone number instance:
 * 
 * <pre>
 *      {
 *        iddPrefix: "+",
 *        countryCode: "49",
 *        areaCode: "02101",
 *        subscriberNumber: "345345",
 *        extension: "78"
 *      }
 * </pre>
 *  
 * Note that in this example, because international direct dialing is explicitly used 
 * in the number, the part of this number after the IDD prefix and country code will be 
 * parsed exactly the same way in all locales with German rules (country code 49).
 *  
 * Regions currently supported are:
 *  
 * <ul>
 * <li>NANP (North American Numbering Plan) countries - USA, Canada, Bermuda, various Caribbean nations
 * <li>UK
 * <li>Republic of Ireland
 * <li>Germany
 * <li>France
 * <li>Spain
 * <li>Italy
 * <li>Mexico
 * <li>India
 * <li>People's Republic of China
 * <li>Netherlands
 * <li>Belgium
 * <li>Luxembourg
 * <li>Australia
 * <li>New Zealand
 * <li>Singapore
 * <li>Korea
 * <li>Japan
 * <li>Russia
 * <li>Brazil
 * </ul>
 * 
 * @constructor
 * @param {!string|PhoneNumber} number A free-form phone number to be parsed, or another phone
 * number instance to copy
 * @param {Object=} options options that guide the parser in parsing the number
 */
var PhoneNumber = function(number, options) {
	var stateData,
		regionSettings;

	this.sync = true;
	this.loadParams = {};
	

	if (options) {
		if (typeof(options.sync) === 'boolean') {
			this.sync = options.sync;
		}

		if (options.loadParams) {
			this.loadParams = options.loadParams;
		}

		if (typeof(options.onLoad) === 'function') {
			/** 
			 * @private
			 * @type {function(PhoneNumber)} 
			 */
			this.onLoad = options.onLoad;
		}
	} else {
	    options = {sync: true};
	}

	if (!number || (typeof number === "string" && number.length === 0)) {
        if (typeof(options.onLoad) === 'function') {
            options.onLoad(undefined);
        }

	    return this;
	}
	
	if (typeof number === "object") {
		/**
		 * The vertical service code. These are codes that typically
		 * start with a star or hash, like "*69" for "dial back the 
		 * last number that called me".
		 * @type {string|undefined} 
		 */
		this.vsc = number.vsc;

		/**
		 * The international direct dialing prefix. This is always
		 * followed by the country code. 
		 * @type {string} 
		 */
		this.iddPrefix = number.iddPrefix;
		
		/**
		 * The unique IDD country code for the country where the
		 * phone number is serviced. 
		 * @type {string|undefined} 
		 */
		this.countryCode = number.countryCode;
		
		/**
		 * The digits required to access the trunk. 
		 * @type {string|undefined} 
		 */
		this.trunkAccess = number.trunkAccess;
		
		/**
		 * The carrier identification code used to identify 
		 * alternate long distance or international carriers. 
		 * @type {string|undefined} 
		 */
		this.cic = number.cic;
		
		/**
		 * Identifies an emergency number that is typically
		 * short, such as "911" in North America or "112" in
		 * many other places in the world. 
		 * @type {string|undefined} 
		 */
		this.emergency = number.emergency;
		
		/**
		 * The prefix of the subscriber number that indicates
		 * that this is the number of a mobile phone. 
		 * @type {string|undefined} 
		 */
		this.mobilePrefix = number.mobilePrefix;
		
		/**
		 * The prefix that identifies this number as commercial
		 * service number. 
		 * @type {string|undefined} 
		 */
		this.serviceCode = number.serviceCode;
		
		/**
		 * The area code prefix of a land line number. 
		 * @type {string|undefined} 
		 */
		this.areaCode = number.areaCode;
		
		/**
		 * The unique number associated with the subscriber
		 * of this phone. 
		 * @type {string|undefined} 
		 */
		this.subscriberNumber = number.subscriberNumber;
		
		/**
		 * The direct dial extension number. 
		 * @type {string|undefined} 
		 */
		this.extension = number.extension;
		
		/**
		 * @private
		 * @type {boolean} 
		 */
		this.invalid = number.invalid;

		if (number.plan && number.locale) {
			/** 
			 * @private
			 * @type {NumberingPlan} 
			 */
			this.plan = number.plan;
			
			/** 
			 * @private
			 * @type {PhoneLocale} 
			 */
			this.locale = number.locale;
	
			/** 
			 * @private
			 * @type {NumberingPlan} 
			 */
			this.destinationPlan = number.destinationPlan;
			
			/** 
			 * @private
			 * @type {PhoneLocale} 
			 */
			this.destinationLocale = number.destinationLocale;
	
			if (options && typeof(options.onLoad) === 'function') {
				options.onLoad(this);
			}
			return;
		}
	}

	new PhoneLocale({
		locale: options && options.locale,
		mcc: options && options.mcc,
		sync: this.sync,
		loadParams: this.loadParams,
		onLoad: ilib.bind(this, function(loc) {
			this.locale = this.destinationLocale = loc;
			new NumberingPlan({
				locale: this.locale,
				sync: this.sync,
				loadParms: this.loadParams,
				onLoad: ilib.bind(this, function (plan) {
					this.plan = this.destinationPlan = plan;
			
					if (typeof number === "object") {
						// the copy constructor code above did not find the locale 
						// or plan before, but now they are loaded, so we can return 
						// already without going further
					    if (typeof(options.onLoad) === "function") {
					        options.onLoad(this);
					    }
						return;
					}
					Utils.loadData({
						name: "states.json",
						object: "PhoneNumber",
						locale: this.locale,
						sync: this.sync,
						loadParams: JSUtils.merge(this.loadParams, {
							returnOne: true
						}),
						callback: ilib.bind(this, function (stdata) {
							if (!stdata) {
								stdata = PhoneNumber._defaultStates;
							}
		
							stateData = stdata;

							regionSettings = {
								stateData: stateData,
								plan: plan,
								handler: PhoneHandlerFactory(this.locale, plan)
							};
							
							// use ^ to indicate the beginning of the number, because certain things only match at the beginning
							number = "^" + number.replace(/\^/g, '');
							number = PhoneNumber._stripFormatting(number);

							this._parseNumber(number, regionSettings, options);
						})
					});
				})
			});
		})
	});
};

/**
 * Parse an International Mobile Subscriber Identity (IMSI) number into its 3 constituent parts:
 * 
 * <ol>
 * <li>mcc - Mobile Country Code, which identifies the country where the phone is currently receiving 
 * service.
 * <li>mnc - Mobile Network Code, which identifies the carrier which is currently providing service to the phone 
 * <li>msin - Mobile Subscription Identifier Number. This is a unique number identifying the mobile phone on 
 * the network, which usually maps to an account/subscriber in the carrier's database.
 * </ol>
 * 
 * Because this function may need to load data to identify the above parts, you can pass an options
 * object that controls how the data is loaded. The options may contain any of the following properties:
 *
 * <ul>
 * <li>onLoad - a callback function to call when the parsing is done. When the onLoad option is given, 
 * this method will attempt to load the locale data using the ilib loader callback. When it is done
 * (even if the data is already preassembled), the onLoad function is called with the parsing results
 * as a parameter, so this callback can be used with preassembled or dynamic, synchronous or 
 * asynchronous loading or a mix of the above.
 * <li>sync - tell whether to load any missing locale data synchronously or asynchronously. If this 
 * option is given as "false", then the "onLoad" callback must be given, as the results returned from 
 * this constructor will not be usable for a while.
 * <li><i>loadParams</i> - an object containing parameters to pass to the loader callback function 
 * when locale data is missing. The parameters are not interpretted or modified in any way. They are 
 * simply passed along. The object may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
 * </ul>
 *
 * @static
 * @param {string} imsi IMSI number to parse
 * @param {Object} options options controlling the loading of the locale data
 * @return {{mcc:string,mnc:string,msin:string}|undefined} components of the IMSI number, when the locale data
 * is loaded synchronously, or undefined if asynchronous
 */
PhoneNumber.parseImsi = function(imsi, options) {
	var sync = true,
		loadParams = {},
		fields = {};
	
	if (!imsi) {
	    if (options && typeof(options.onLoad) === 'function') {
            options.onLoad(undefined);
        }
		return undefined;
	}

	if (options) {
		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync == true);
		}
		
		if (options.loadParams) {
			loadParams = options.loadParams;
		}
	}	

	if (ilib.data.mnc) {
		fields = PhoneNumber._parseImsi(ilib.data.mnc, imsi);
		
		if (options && typeof(options.onLoad) === 'function') {
			options.onLoad(fields);
		}
	} else {
		Utils.loadData({
			name: "mnc.json", 
			object: "PhoneNumber", 
			nonlocale: true, 
			sync: sync, 
			loadParams: loadParams, 
			callback: ilib.bind(this, function(data) {
				ilib.data.mnc = data;
				fields = PhoneNumber._parseImsi(data, imsi);
				
				if (options && typeof(options.onLoad) === 'function') {
					options.onLoad(fields);
				}
			})
		});
	}
	return fields;
};


/**
 * @static
 * @protected
 */
PhoneNumber._parseImsi = function(data, imsi) {
	var ch, 
		i,
		currentState, 
		end, 
		handlerMethod,
		state = 0,
		newState,
		fields = {},
		lastLeaf,
		consumed = 0;
	
	currentState = data;
	if (!currentState) {
		// can't parse anything
		return undefined;
	}
	
	i = 0;
	while (i < imsi.length) {
		ch = PhoneNumber._getCharacterCode(imsi.charAt(i));
		// console.info("parsing char " + imsi.charAt(i) + " code: " + ch);
		if (ch >= 0) {
			newState = currentState.s && currentState.s[ch];
			
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
				if ((typeof(newState) === 'undefined' || newState === 0 ||
					(typeof(newState) === 'object' && typeof(newState.l) === 'undefined')) &&
					 lastLeaf) {
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

					// console.info("reached final state " + newState + " handler method is " + handlerMethod + " and i is " + i);
	
					// deal with syntactic ambiguity by using the "special" end state instead of "area"
					if ( handlerMethod === "area" ) {
						end = i+1;
					} else {
						// unrecognized imsi, so just assume the mnc is 3 digits
						end = 6;
					}
					
					fields.mcc = imsi.substring(0,3);
					fields.mnc = imsi.substring(3,end);
					fields.msin = imsi.substring(end);
	
					return fields;
				} else {
					// parse error
					if (imsi.length >= 6) {
						fields.mcc = imsi.substring(0,3);
						fields.mnc = imsi.substring(3,6);
						fields.msin = imsi.substring(6);
					}
					return fields;
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
		
	if (i >= imsi.length && imsi.length >= 6) {
		// we reached the end of the imsi, but did not finish recognizing anything. 
		// Default to last resort and assume 3 digit mnc
		fields.mcc = imsi.substring(0,3);
		fields.mnc = imsi.substring(3,6);
		fields.msin = imsi.substring(6);
	} else {
		// unknown or not enough characters for a real imsi 
		fields = undefined;
	}
		
	// console.info("Globalization.Phone.parseImsi: final result is: " + JSON.stringify(fields));
	return fields;
};

/**
 * @static
 * @private
 */
PhoneNumber._stripFormatting = function(str) {
	var ret = "";
	var i;

	for (i = 0; i < str.length; i++) {
		if (PhoneNumber._getCharacterCode(str.charAt(i)) >= -1) {
			ret += str.charAt(i);
		}
	}
	return ret;
};

/**
 * @static
 * @protected
 */
PhoneNumber._getCharacterCode = function(ch) {
	if (ch >= '0' && ch <= '9') {
			return ch - '0';
		}
	switch (ch) {
	case '+':
		return 10;
	case '*':
		return 11;
	case '#':
		return 12;
	case '^':
		return 13;
	case 'p':		// pause chars
	case 'P':
	case 't':
	case 'T':
	case 'w':
	case 'W':
		return -1;
	case 'x':
	case 'X':
	case ',':
	case ';':		// extension char
		return -1;
	}
	return -2;
};

/**
 * @private
 */
PhoneNumber._states = [
	"none",
	"unknown",
	"plus",
	"idd",
	"cic",
	"service",
	"cell",
	"area",
	"vsc",
	"country",
	"personal",
	"special",
	"trunk",
	"premium",
	"emergency",
	"service2",
	"service3",
	"service4",
	"cic2",
	"cic3",
	"start",
	"local"
];

/**
 * @private
 */
PhoneNumber._fieldOrder = [
	"vsc",
	"iddPrefix",
	"countryCode",
	"trunkAccess",
	"cic",
	"emergency",
	"mobilePrefix",
	"serviceCode",
	"areaCode",
	"subscriberNumber",
	"extension"
];

PhoneNumber._defaultStates = {
	"s": [
        0,
		21,  // 1 -> local
        21,  // 2 -> local
        21,  // 3 -> local
        21,  // 4 -> local
        21,  // 5 -> local
        21,  // 6 -> local
        21,  // 7 -> local
        21,  // 8 -> local
        21,  // 9 -> local
        0,0,0,
	    { // ^
	    	"s": [
				{ // ^0
					"s": [3], // ^00 -> idd
					"l": 12   // ^0  -> trunk
				},
				21,  // ^1 -> local
	            21,  // ^2 -> local
	            21,  // ^3 -> local
	            21,  // ^4 -> local
	            21,  // ^5 -> local
	            21,  // ^6 -> local
	            21,  // ^7 -> local
	            21,  // ^8 -> local
	            21,  // ^9 -> local
	            2    // ^+ -> plus
	        ]
	    }
	]
};

PhoneNumber.prototype = {
	/**
	 * @protected
	 * @param {string} number
	 * @param {Object} regionData
	 * @param {Object} options
	 * @param {string} countryCode
	 */
	_parseOtherCountry: function(number, regionData, options, countryCode) {
		new PhoneLocale({
			locale: this.locale,
			countryCode: countryCode,
			sync: this.sync,
			loadParms: this.loadParams,
			onLoad: ilib.bind(this, function (loc) {
				/*
				 * this.locale is the locale where this number is being parsed,
				 * and is used to parse the IDD prefix, if any, and this.destinationLocale is 
				 * the locale of the rest of this number after the IDD prefix.
				 */
				/** @type {PhoneLocale} */
				this.destinationLocale = loc;

				Utils.loadData({
					name: "states.json",
					object: "PhoneNumber",
					locale: this.destinationLocale,
					sync: this.sync,
					loadParams: JSUtils.merge(this.loadParams, {
						returnOne: true
					}),
					callback: ilib.bind(this, function (stateData) {
						if (!stateData) {
							stateData = PhoneNumber._defaultStates;
						}
						
						new NumberingPlan({
							locale: this.destinationLocale,
							sync: this.sync,
							loadParms: this.loadParams,
							onLoad: ilib.bind(this, function (plan) {
								/*
								 * this.plan is the plan where this number is being parsed,
								 * and is used to parse the IDD prefix, if any, and this.destinationPlan is 
								 * the plan of the rest of this number after the IDD prefix in the 
								 * destination locale.
								 */
								/** @type {NumberingPlan} */
								this.destinationPlan = plan;

								var regionSettings = {
									stateData: stateData,
									plan: plan,
									handler: PhoneHandlerFactory(this.destinationLocale, plan)
								};
								
								// for plans that do not skip the trunk code when dialing from
								// abroad, we need to treat the number from here on in as if it 
								// were parsing a local number from scratch. That way, the parser
								// does not get confused between parts of the number at the
								// beginning of the number, and parts in the middle.
								if (!plan.getSkipTrunk()) {
									number = '^' + number;
								}
									
								// recursively call the parser with the new states data
								// to finish the parsing
								this._parseNumber(number, regionSettings, options);
							})
						});
					})
				});
			})
		});
	},
	
	/**
	 * @protected
	 * @param {string} number
	 * @param {Object} regionData
	 * @param {Object} options
	 */
	_parseNumber: function(number, regionData, options) {
		var i, ch,
			regionSettings,
			newState,
			dot,
			handlerMethod,
			result,
			currentState = regionData.stateData,
			lastLeaf = undefined,
			consumed = 0;

		regionSettings = regionData;
		dot = 14; // special transition which matches all characters. See AreaCodeTableMaker.java

		i = 0;
		while (i < number.length) {
			ch = PhoneNumber._getCharacterCode(number.charAt(i));
			if (ch >= 0) {
				// newState = stateData.states[state][ch];
				newState = currentState.s && currentState.s[ch];
				
				if (!newState && currentState.s && currentState.s[dot]) {
					newState = currentState.s[dot];
				}
				
				if (typeof(newState) === 'object' && i+1 < number.length) {
					if (typeof(newState.l) !== 'undefined') {
						// this is a leaf node, so save that for later if needed
						lastLeaf = newState;
						consumed = i;
					}
					// console.info("recognized digit " + ch + " continuing...");
					// recognized digit, so continue parsing
					currentState = newState;
					i++;
				} else {
					if ((typeof(newState) === 'undefined' || newState === 0 ||
						(typeof(newState) === 'object' && typeof(newState.l) === 'undefined')) &&
						 lastLeaf) {
						// this is possibly a look-ahead and it didn't work... 
						// so fall back to the last leaf and use that as the
						// final state
						newState = lastLeaf;
						i = consumed;
						consumed = 0;
						lastLeaf = undefined;
					}
					
					if ((typeof(newState) === 'number' && newState) ||
						(typeof(newState) === 'object' && typeof(newState.l) !== 'undefined')) {
						// final state
						var stateNumber = typeof(newState) === 'number' ? newState : newState.l;
						handlerMethod = PhoneNumber._states[stateNumber];
						
						if (number.charAt(0) === '^') {
							result = regionSettings.handler[handlerMethod](number.slice(1), i-1, this, regionSettings);
						} else {
							result = regionSettings.handler[handlerMethod](number, i, this, regionSettings);
						}
		
						// reparse whatever is left
						number = result.number;
						i = consumed = 0;
						lastLeaf = undefined;
						
						//console.log("reparsing with new number: " +  number);
						currentState = regionSettings.stateData;
						// if the handler requested a special sub-table, use it for this round of parsing,
						// otherwise, set it back to the regular table to continue parsing
	
						if (result.countryCode !== undefined) {
							this._parseOtherCountry(number, regionData, options, result.countryCode);
							// don't process any further -- let the work be done in the onLoad callbacks
							return;
						} else if (result.table !== undefined) {
							Utils.loadData({
								name: result.table + ".json",
								object: "PhoneNumber",
								nonlocale: true,
								sync: this.sync,
								loadParams: this.loadParams,
								callback: ilib.bind(this, function (data) {
									if (!data) {
										data = PhoneNumber._defaultStates;
									}
	
									regionSettings = {
										stateData: data,
										plan: regionSettings.plan,
										handler: regionSettings.handler
									};
									
									// recursively call the parser with the new states data
									// to finish the parsing
									this._parseNumber(number, regionSettings, options);
								})
							});
							// don't process any further -- let the work be done in the onLoad callbacks
							return;
						} else if (result.skipTrunk !== undefined) {
							ch = PhoneNumber._getCharacterCode(regionSettings.plan.getTrunkCode());
							currentState = currentState.s && currentState.s[ch];
						}
					} else {
						handlerMethod = (typeof(newState) === 'number') ? "none" : "local";
						// failed parse. Either no last leaf to fall back to, or there was an explicit
						// zero in the table. Put everything else in the subscriberNumber field as the
						// default place
						if (number.charAt(0) === '^') {
							result = regionSettings.handler[handlerMethod](number.slice(1), i-1, this, regionSettings);
						} else {
							result = regionSettings.handler[handlerMethod](number, i, this, regionSettings);
						}
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
		if (i >= number.length && currentState !== regionData.stateData) {
			handlerMethod = (typeof(currentState.l) === 'undefined' || currentState === 0) ? "none" : "local";
			// we reached the end of the phone number, but did not finish recognizing anything. 
			// Default to last resort and put everything that is left into the subscriber number
			//console.log("Reached end of number before parsing was complete. Using handler for method none.")
			if (number.charAt(0) === '^') {
				result = regionSettings.handler[handlerMethod](number.slice(1), i-1, this, regionSettings);
			} else {
				result = regionSettings.handler[handlerMethod](number, i, this, regionSettings);
			}
		}

		// let the caller know we are done parsing
		if (this.onLoad) {
			this.onLoad(this);
		}
	},
	/**
	 * @protected
	 */
	_getPrefix: function() {
		return this.areaCode || this.serviceCode || this.mobilePrefix || "";
	},
	
	/**
	 * @protected
	 */
	_hasPrefix: function() {
		return (this._getPrefix() !== "");
	},
	
	/**
	 * Exclusive or -- return true, if one is defined and the other isn't
	 * @protected
	 */
	_xor : function(left, right) {
		if ((left === undefined && right === undefined ) || (left !== undefined && right !== undefined)) {
			return false;
		} else {
			return true;
		}
	},
	
	/**
	 * return a version of the phone number that contains only the dialable digits in the correct order 
	 * @protected
	 */
	_join: function () {
		var fieldName, formatted = "";
		
		try {
			for (var field in PhoneNumber._fieldOrder) {
				if (typeof field === 'string' && typeof PhoneNumber._fieldOrder[field] === 'string') {
					fieldName = PhoneNumber._fieldOrder[field];
					// console.info("normalize: formatting field " + fieldName);
					if (this[fieldName] !== undefined) {
						formatted += this[fieldName];
					}
				}
			}
		} catch ( e ) {
			//console.warn("caught exception in _join: " + e);
			throw e;
		}
		return formatted;
	},

	/**
	 * This routine will compare the two phone numbers in an locale-sensitive
	 * manner to see if they possibly reference the same phone number.<p>
	 * 
	 * In many places,
	 * there are multiple ways to reach the same phone number. In North America for 
	 * example, you might have a number with the trunk access code of "1" and another
	 * without, and they reference the exact same phone number. This is considered a
	 * strong match. For a different pair of numbers, one may be a local number and
	 * the other a full phone number with area code, which may reference the same 
	 * phone number if the local number happens to be located in that area code. 
	 * However, you cannot say for sure if it is in that area code, so it will 
	 * be considered a somewhat weaker match.<p>
	 *  
	 * Similarly, in other countries, there are sometimes different ways of 
	 * reaching the same destination, and the way that numbers
	 * match depends on the locale.<p>
	 * 
	 * The various phone number fields are handled differently for matches. There
	 * are various fields that do not need to match at all. For example, you may
	 * type equally enter "00" or "+" into your phone to start international direct
	 * dialling, so the iddPrefix field does not need to match at all.<p> 
	 * 
	 * Typically, fields that require matches need to match exactly if both sides have a value 
	 * for that field. If both sides specify a value and those values differ, that is
	 * a strong non-match. If one side does not have a value and the other does, that 
	 * causes a partial match, because the number with the missing field may possibly
	 * have an implied value that matches the other number. For example, the numbers
	 * "650-555-1234" and "555-1234" have a partial match as the local number "555-1234"
	 * might possibly have the same 650 area code as the first number, and might possibly
	 * not. If both side do not specify a value for a particular field, that field is 
	 * considered matching.<p>
	 *  
	 * The values of following fields are ignored when performing matches:
	 * 
	 * <ul>
	 * <li>vsc
	 * <li>iddPrefix
	 * <li>cic
	 * <li>trunkAccess
	 * </ul>
	 * 
	 * The values of the following fields matter if they do not match:
	 *   
	 * <ul>
	 * <li>countryCode - A difference causes a moderately strong problem except for 
	 * certain countries where there is a way to access the same subscriber via IDD 
	 * and via intranetwork dialling
	 * <li>mobilePrefix - A difference causes a possible non-match
	 * <li>serviceCode - A difference causes a possible non-match
	 * <li>areaCode - A difference causes a possible non-match
	 * <li>subscriberNumber - A difference causes a very strong non-match
	 * <li>extension - A difference causes a minor non-match
	 * </ul>
	 *  
	 * @param {string|PhoneNumber} other other phone number to compare this one to
	 * @return {number} non-negative integer describing the percentage quality of the 
	 * match. 100 means a very strong match (100%), and lower numbers are less and 
	 * less strong, down to 0 meaning not at all a match. 
	 */
	compare: function (other) {
		var match = 100,
			FRdepartments = {"590":1, "594":1, "596":1, "262":1},
			ITcountries = {"378":1, "379":1},
			thisPrefix,
			otherPrefix,
			currentCountryCode = 0;

		if (typeof this.locale.region === "string") {
			currentCountryCode = this.locale._mapRegiontoCC(this.locale.region);
		}
		
		// subscriber number must be present and must match
		if (!this.subscriberNumber || !other.subscriberNumber || this.subscriberNumber !== other.subscriberNumber) {
			return 0;
		}

		// extension must match if it is present
		if (this._xor(this.extension, other.extension) || this.extension !== other.extension) {
			return 0;
		}

		if (this._xor(this.countryCode, other.countryCode)) {
			// if one doesn't have a country code, give it some demerit points, but if the
			// one that has the country code has something other than the current country
			// add even more. Ignore the special cases where you can dial the same number internationally or via 
			// the local numbering system
			switch (this.locale.getRegion()) {
			case 'FR':
				if (this.countryCode in FRdepartments || other.countryCode in FRdepartments) {
					if (this.areaCode !== other.areaCode || this.mobilePrefix !== other.mobilePrefix) {
						match -= 100;
					}
				} else {
					match -= 16;
				}
				break;
			case 'IT':
				if (this.countryCode in ITcountries || other.countryCode in ITcountries) { 
					if (this.areaCode !== other.areaCode) {
						match -= 100;
					}
				} else {
					match -= 16;
				}
				break;
			default:
				match -= 16;
				if ((this.countryCode !== undefined && this.countryCode !== currentCountryCode) || 
					(other.countryCode !== undefined && other.countryCode !== currentCountryCode)) {
					match -= 16;
				}
			}
		} else if (this.countryCode !== other.countryCode) {
			// ignore the special cases where you can dial the same number internationally or via 
			// the local numbering system
			if (other.countryCode === '33' || this.countryCode === '33') {
				// france
				if (this.countryCode in FRdepartments || other.countryCode in FRdepartments) {
					if (this.areaCode !== other.areaCode || this.mobilePrefix !== other.mobilePrefix) {
						match -= 100;
					}
				} else {
					match -= 100;
				}
			} else if (this.countryCode === '39' || other.countryCode === '39') {
				// italy
				if (this.countryCode in ITcountries || other.countryCode in ITcountries) { 
					if (this.areaCode !== other.areaCode) {
						match -= 100;
					}
				} else {
					match -= 100;
				}
			} else {
				match -= 100;
			}
		}

		if (this._xor(this.serviceCode, other.serviceCode)) {
			match -= 20;
		} else if (this.serviceCode !== other.serviceCode) {
			match -= 100;
		}

		if (this._xor(this.mobilePrefix, other.mobilePrefix)) {
			match -= 20;
		} else if (this.mobilePrefix !== other.mobilePrefix) {
			match -= 100;
		}

		if (this._xor(this.areaCode, other.areaCode)) {
			// one has an area code, the other doesn't, so dock some points. It could be a match if the local
			// number in the one number has the same implied area code as the explicit area code in the other number.
			match -= 12;
		} else if (this.areaCode !== other.areaCode) {
			match -= 100;
		}

		thisPrefix = this._getPrefix();
		otherPrefix = other._getPrefix();
		
		if (thisPrefix && otherPrefix && thisPrefix !== otherPrefix) {
			match -= 100;
		}
		
		// make sure we are between 0 and 100
		if (match < 0) {
			match = 0;	
		} else if (match > 100) {
			match = 100;
		}

		return match;
	},
	
	/**
	 * Determine whether or not the other phone number is exactly equal to the current one.<p>
	 *  
	 * The difference between the compare method and the equals method is that the compare 
	 * method compares normalized numbers with each other and returns the degree of match,
	 * whereas the equals operator returns true iff the two numbers contain the same fields
	 * and the fields are exactly the same. Functions and other non-phone number properties
	 * are not compared.
	 * @param {string|PhoneNumber} other another phone number to compare to this one
	 * @return {boolean} true if the numbers are the same, false otherwise
	 */
	equals: function equals(other) {
		if (other.locale && this.locale && !this.locale.equals(other.locale) && (!this.countryCode || !other.countryCode)) {
			return false;
		}

		var _this = this;
		return PhoneNumber._fieldOrder.every(function(field) {
		    return _this[field] === other[field];
		});
	},

	/**
	 * @private
	 * @param {{
	 *   mcc:string,
	 *   defaultAreaCode:string,
	 *   country:string,
	 *   networkType:string,
	 *   assistedDialing:boolean,
	 *   sms:boolean,
	 *   manualDialing:boolean
	 * }} options an object containing options to help in normalizing. 
	 * @param {PhoneNumber} norm
	 * @param {PhoneLocale} homeLocale
	 * @param {PhoneLocale} currentLocale
	 * @param {NumberingPlan} currentPlan
	 * @param {PhoneLocale} destinationLocale
	 * @param {NumberingPlan} destinationPlan
	 * @param {boolean} sync
	 * @param {Object|undefined} loadParams
	 */
	_doNormalize: function(options, norm, homeLocale, currentLocale, currentPlan, destinationLocale, destinationPlan, sync, loadParams) {
		var formatted = "";
		
		if (!norm.invalid && options && options.assistedDialing) {
			// don't normalize things that don't have subscriber numbers. Also, don't normalize
			// manually dialed local numbers. Do normalize local numbers in contact entries.
			if (norm.subscriberNumber && 
					(!options.manualDialing ||
					 norm.iddPrefix ||
					 norm.countryCode ||
					 norm.trunkAccess)) {
				// console.log("normalize: assisted dialling normalization of " + JSON.stringify(norm));
				if (currentLocale.getRegion() !== destinationLocale.getRegion()) {
					// we are currently calling internationally
					if (!norm._hasPrefix() && 
							options.defaultAreaCode && 
							destinationLocale.getRegion() === homeLocale.getRegion() &&
							(!destinationPlan.getFieldLength("minLocalLength") || 
								norm.subscriberNumber.length >= destinationPlan.getFieldLength("minLocalLength"))) {
						// area code is required when dialling from international, but only add it if we are dialing
						// to our home area. Otherwise, the default area code is not valid!
						norm.areaCode = options.defaultAreaCode;
						if (!destinationPlan.getSkipTrunk() && destinationPlan.getTrunkCode()) {
							// some phone systems require the trunk access code, even when dialling from international
							norm.trunkAccess = destinationPlan.getTrunkCode();
						}
					}
					
					if (norm.trunkAccess && destinationPlan.getSkipTrunk()) {
						// on some phone systems, the trunk access code is dropped when dialling from international
						delete norm.trunkAccess;
					}
					
					// make sure to get the country code for the destination region, not the current region!
					if (options.sms) {
						if (homeLocale.getRegion() === "US" && currentLocale.getRegion() !== "US") {
							if (destinationLocale.getRegion() !== "US") {
								norm.iddPrefix = "011"; // non-standard code to make it go through the US first
								norm.countryCode = norm.countryCode || homeLocale._mapRegiontoCC(destinationLocale.getRegion());
							} else if (options.networkType === "cdma") {
								delete norm.iddPrefix;
								delete norm.countryCode;
								if (norm.areaCode) {
									norm.trunkAccess = "1";
								}
							} else if (norm.areaCode) {
								norm.iddPrefix = "+";
								norm.countryCode = "1";
								delete norm.trunkAccess;
							}
						} else {
							norm.iddPrefix = (options.networkType === "cdma") ? currentPlan.getIDDCode() : "+";
							norm.countryCode = norm.countryCode || homeLocale._mapRegiontoCC(destinationLocale.region);
						}
					} else if (norm._hasPrefix() && !norm.countryCode) {
						norm.countryCode = homeLocale._mapRegiontoCC(destinationLocale.region);
					}

					if (norm.countryCode && !options.sms) {
						// for CDMA, make sure to get the international dialling access code for the current region, not the destination region
						// all umts carriers support plus dialing
						norm.iddPrefix = (options.networkType === "cdma") ? currentPlan.getIDDCode() : "+";
					}
				} else {
					// console.log("normalize: dialing within the country");
					if (options.defaultAreaCode) {
						if (destinationPlan.getPlanStyle() === "open") {
							if (!norm.trunkAccess && norm._hasPrefix() && destinationPlan.getTrunkCode()) {
								// call is not local to this area code, so you have to dial the trunk code and the area code
								norm.trunkAccess = destinationPlan.getTrunkCode();
							}
						} else {
							// In closed plans, you always have to dial the area code, even if the call is local.
							if (!norm._hasPrefix()) {
								if (destinationLocale.getRegion() === homeLocale.getRegion()) {
									norm.areaCode = options.defaultAreaCode;
									if (destinationPlan.getTrunkRequired() && destinationPlan.getTrunkCode()) {
										norm.trunkAccess = norm.trunkAccess || destinationPlan.getTrunkCode();
									}
								}
							} else {
								if (destinationPlan.getTrunkRequired() && destinationPlan.getTrunkCode()) {
									norm.trunkAccess = norm.trunkAccess || destinationPlan.getTrunkCode();
								}
							}
						}
					}
					
					if (options.sms &&
							homeLocale.getRegion() === "US" && 
							currentLocale.getRegion() !== "US") {
						norm.iddPrefix = "011"; // make it go through the US first
						if (destinationPlan.getSkipTrunk() && norm.trunkAccess) {
							delete norm.trunkAccess;
						}
					} else if (norm.iddPrefix || norm.countryCode) {
						// we are in our destination country, so strip the international dialling prefixes
						delete norm.iddPrefix;
						delete norm.countryCode;
						
						if ((destinationPlan.getPlanStyle() === "open" || destinationPlan.getTrunkRequired()) && destinationPlan.getTrunkCode()) {
							norm.trunkAccess = destinationPlan.getTrunkCode();
						}
					}
				}
			}
		} else if (!norm.invalid) {
			// console.log("normalize: non-assisted normalization");
			if (!norm._hasPrefix() && options && options.defaultAreaCode && destinationLocale.getRegion() === homeLocale.region) {
				norm.areaCode = options.defaultAreaCode;
			}
			
			if (!norm.countryCode && norm._hasPrefix()) {
				norm.countryCode = homeLocale._mapRegiontoCC(destinationLocale.getRegion());
			}

			if (norm.countryCode) {
				if (options && options.networkType && options.networkType === "cdma") {
					norm.iddPrefix = currentPlan.getIDDCode(); 
				} else {
					// all umts carriers support plus dialing
					norm.iddPrefix = "+";
				}
		
				if (destinationPlan.getSkipTrunk() && norm.trunkAccess) {
					delete norm.trunkAccess;
				} else if (!destinationPlan.getSkipTrunk() && !norm.trunkAccess && destinationPlan.getTrunkCode()) {
					norm.trunkAccess = destinationPlan.getTrunkCode();
				}
			}
		}
		
		// console.info("normalize: after normalization, the normalized phone number is: " + JSON.stringify(norm));
		formatted = norm._join();

		return formatted;
	},
	
	/**
	 * @private
	 * @param {{
	 *   mcc:string,
	 *   defaultAreaCode:string,
	 *   country:string,
	 *   networkType:string,
	 *   assistedDialing:boolean,
	 *   sms:boolean,
	 *   manualDialing:boolean
	 * }} options an object containing options to help in normalizing. 
	 * @param {PhoneNumber} norm
	 * @param {PhoneLocale} homeLocale
	 * @param {PhoneLocale} currentLocale
	 * @param {NumberingPlan} currentPlan
	 * @param {PhoneLocale} destinationLocale
	 * @param {NumberingPlan} destinationPlan
	 * @param {boolean} sync
	 * @param {Object|undefined} loadParams
	 * @param {function(string)} callback
	 */
	_doReparse: function(options, norm, homeLocale, currentLocale, currentPlan, destinationLocale, destinationPlan, sync, loadParams, callback) {
		var formatted, 
			tempRegion;
		
		if (options &&
				options.assistedDialing &&
				!norm.trunkAccess && 
				!norm.iddPrefix &&
				norm.subscriberNumber && 
				norm.subscriberNumber.length > destinationPlan.getFieldLength("maxLocalLength")) {

			// numbers that are too long are sometimes international direct dialed numbers that
			// are missing the IDD prefix. So, try reparsing it using a plus in front to see if that works.
			new PhoneNumber("+" + this._join(), {
				locale: this.locale,
				sync: sync,
				loadParms: loadParams,
				onLoad: ilib.bind(this, function (data) {
					tempRegion = (data.countryCode && data.locale._mapCCtoRegion(data.countryCode));

					if (tempRegion && tempRegion !== "unknown" && tempRegion !== "SG") {
						// only use it if it is a recognized country code. Singapore (SG) is a special case.
						norm = data;
						destinationLocale = data.destinationLocale;
						destinationPlan = data.destinationPlan;
					}
					
					formatted = this._doNormalize(options, norm, homeLocale, currentLocale, currentPlan, destinationLocale, destinationPlan, sync, loadParams);
					if (typeof(callback) === 'function') {
						callback(formatted);
					}
				})
			});
		} else if (options && options.assistedDialing && norm.invalid && currentLocale.region !== norm.locale.region) {
			// if this number is not valid for the locale it was parsed with, try again with the current locale
			// console.log("norm is invalid. Attempting to reparse with the current locale");

			new PhoneNumber(this._join(), {
				locale: currentLocale,
				sync: sync,
				loadParms: loadParams,
				onLoad: ilib.bind(this, function (data) {
					if (data && !data.invalid) {
						norm = data;
					}
					
					formatted = this._doNormalize(options, norm, homeLocale, currentLocale, currentPlan, destinationLocale, destinationPlan, sync, loadParams);
					if (typeof(callback) === 'function') {
						callback(formatted);
					}
				})
			});
		} else {
			formatted = this._doNormalize(options, norm, homeLocale, currentLocale, currentPlan, destinationLocale, destinationPlan, sync, loadParams);
			if (typeof(callback) === 'function') {
				callback(formatted);
			}
		}
	},
	
	/**
	 * This function normalizes the current phone number to a canonical format and returns a
	 * string with that phone number. If parts are missing, this function attempts to fill in 
	 * those parts.<p>
	 * 	  
	 * The options object contains a set of properties that can possibly help normalize
	 * this number by providing "extra" information to the algorithm. The options
	 * parameter may be null or an empty object if no hints can be determined before
	 * this call is made. If any particular hint is not
	 * available, it does not need to be present in the options object.<p>
	 * 
	 * The following is a list of hints that the algorithm will look for in the options
	 * object:
	 * 
	 * <ul>
	 * <li><i>mcc</i> the mobile carrier code of the current network upon which this 
	 * phone is operating. This is translated into an IDD country code. This is 
	 * useful if the number being normalized comes from CNAP (callerid) and the
	 * MCC is known.
	 * <li><i>defaultAreaCode</i> the area code of the phone number of the current
	 * device, if available. Local numbers in a person's contact list are most 
	 * probably in this same area code.
	 * <li><i>country</i> the 2 letter ISO 3166 code of the country if it is
	 * known from some other means such as parsing the physical address of the
	 * person associated with the phone number, or the from the domain name 
	 * of the person's email address
	 * <li><i>networkType</i> specifies whether the phone is currently connected to a
	 * CDMA network or a UMTS network. Valid values are the strings "cdma" and "umts".
	 * If one of those two strings are not specified, or if this property is left off
	 * completely, this method will assume UMTS.
	 * </ul>
	 * 
	 * The following are a list of options that control the behaviour of the normalization:
	 * 
	 * <ul>
	 * <li><i>assistedDialing</i> if this is set to true, the number will be normalized
	 * so that it can dialled directly on the type of network this phone is 
	 * currently connected to. This allows customers to dial numbers or use numbers 
	 * in their contact list that are specific to their "home" region when they are 
	 * roaming and those numbers would not otherwise work with the current roaming 
	 * carrier as they are. The home region is 
	 * specified as the phoneRegion system preference that is settable in the 
	 * regional settings app. With assisted dialling, this method will add or 
	 * remove international direct dialling prefixes and country codes, as well as
	 * national trunk access codes, as required by the current roaming carrier and the
	 * home region in order to dial the number properly. If it is not possible to 
	 * construct a full international dialling sequence from the options and hints given,
	 * this function will not modify the phone number, and will return "undefined".
	 * If assisted dialling is false or not specified, then this method will attempt
	 * to add all the information it can to the number so that it is as fully
	 * specified as possible. This allows two numbers to be compared more easily when
	 * those two numbers were otherwise only partially specified.
	 * <li><i>sms</i> set this option to true for the following conditions: 
	 *   <ul>
	 *   <li>assisted dialing is turned on
	 *   <li>the phone number represents the destination of an SMS message
	 *   <li>the phone is UMTS 
	 *   <li>the phone is SIM-locked to its carrier
	 *   </ul> 
	 * This enables special international direct dialling codes to route the SMS message to
	 * the correct carrier. If assisted dialling is not turned on, this option has no
	 * affect.
	 * <li><i>manualDialing</i> set this option to true if the user is entering this number on
	 * the keypad directly, and false when the number comes from a stored location like a 
	 * contact entry or a call log entry. When true, this option causes the normalizer to 
	 * not perform any normalization on numbers that look like local numbers in the home 
	 * country. If false, all numbers go through normalization. This option only has an effect
	 * when the assistedDialing option is true as well, otherwise it is ignored.
	 * </ul> 
	 * 
	 * If both a set of options and a locale are given, and they offer conflicting
	 * information, the options will take precedence. The idea is that the locale
	 * tells you the region setting that the user has chosen (probably in 
	 * firstuse), whereas the the hints are more current information such as
	 * where the phone is currently operating (the MCC).<p> 
	 * 
	 * This function performs the following types of normalizations with assisted
	 * dialling turned on:
	 * 
	 * <ol>
	 * <li>If the current location of the phone matches the home country, this is a
	 * domestic call.
	 *   <ul> 
	 *   <li>Remove any iddPrefix and countryCode fields, as they are not needed
	 *   <li>Add in a trunkAccess field that may be necessary to call a domestic numbers 
	 *     in the home country
	 *   </ul>
	 * <li> If the current location of the phone does not match the home country,
	 * attempt to form a whole international number.
	 *   <ul>
	 *   <li>Add in the area code if it is missing from the phone number and the area code
	 *     of the current phone is available in the hints
	 *   <li>Add the country dialling code for the home country if it is missing from the 
	 *     phone number
	 *   <li>Add or replace the iddPrefix with the correct one for the current country. The
	 *     phone number will have been parsed with the settings for the home country, so
	 *     the iddPrefix may be incorrect for the
	 *     current country. The iddPrefix for the current country can be "+" if the phone 
	 *     is connected to a UMTS network, and either a "+" or a country-dependent 
	 *     sequences of digits for CDMA networks.
	 *   </ul>
	 * </ol>
	 * 
	 * This function performs the following types of normalization with assisted
	 * dialling turned off:
	 * 
	 * <ul>
	 * <li>Normalize the international direct dialing prefix to be a plus or the
	 * international direct dialling access code for the current country, depending
	 * on the network type.
	 * <li>If a number is a local number (ie. it is missing its area code), 
	 * use a default area code from the hints if available. CDMA phones always know their area 
	 * code, and GSM/UMTS phones know their area code in many instances, but not always 
	 * (ie. not on Vodaphone or Telcel phones). If the default area code is not available, 
	 * do not add it.
	 * <li>In assisted dialling mode, if a number is missing its country code, 
	 * use the current MCC number if
	 * it is available to figure out the current country code, and prepend that 
	 * to the number. If it is not available, leave it off. Also, use that 
	 * country's settings to parse the number instead of the current format 
	 * locale.
	 * <li>For North American numbers with an area code but no trunk access 
	 * code, add in the trunk access code.
	 * <li>For other countries, if the country code is added in step 3, remove the 
	 * trunk access code when required by that country's conventions for 
	 * international calls. If the country requires a trunk access code for 
	 * international calls and it doesn't exist, add one.
	 * </ul>
	 *  
	 * This method modifies the current object, and also returns a string 
	 * containing the normalized phone number that can be compared directly against
	 * other normalized numbers. The canonical format for phone numbers that is 
	 * returned from thhomeLocaleis method is simply an uninterrupted and unformatted string 
	 * of dialable digits.
	 * 
	 * @param {{
	 *   mcc:string,
	 *   defaultAreaCode:string,
	 *   country:string,
	 *   networkType:string,
	 *   assistedDialing:boolean,
	 *   sms:boolean,
	 *   manualDialing:boolean
	 * }} options an object containing options to help in normalizing. 
	 * @return {string|undefined} the normalized string, or undefined if the number
	 * could not be normalized
	 */
	normalize: function(options) {
		var norm,
			sync = true,
			loadParams = {};
			

		if (options) {
			if (typeof(options.sync) !== 'undefined') {
				sync = (options.sync == true);
			}
			
			if (options.loadParams) {
				loadParams = options.loadParams;
			}
		}
		
		// Clone this number, so we don't mess with the original.
		// No need to do this asynchronously because it's a copy constructor which doesn't 
		// load any extra files.
		norm = new PhoneNumber(this);

		var normalized;
		
		if (options && (typeof(options.mcc) !== 'undefined' || typeof(options.country) !== 'undefined')) {
			new PhoneLocale({
				mcc: options.mcc,
				countryCode: options.countryCode,
				locale: this.locale,
				sync: sync,
				loadParams: loadParams,
				onLoad: ilib.bind(this, function(loc) {
					new NumberingPlan({
						locale: loc,
						sync: sync,
						loadParms: loadParams,
						onLoad: ilib.bind(this, function (plan) {
							this._doReparse(options, norm, this.locale, loc, plan, this.destinationLocale, this.destinationPlan, sync, loadParams, function (fmt) {
								normalized = fmt;
								
								if (options && typeof(options.onLoad) === 'function') {
									options.onLoad(fmt);
								}
							});
						})
					});
				})
			});
		} else {
			this._doReparse(options, norm, this.locale, this.locale, this.plan, this.destinationLocale, this.destinationPlan, sync, loadParams, function (fmt) {
				normalized = fmt;
				
				if (options && typeof(options.onLoad) === 'function') {
					options.onLoad(fmt);
				}
			});
		}

		// return the value for the synchronous case
		return normalized;
	}
};

module.exports = PhoneNumber;