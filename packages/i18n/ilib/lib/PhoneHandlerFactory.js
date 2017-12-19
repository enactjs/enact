/*
 * handler.js - Handle phone number parse states
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


/**
 * @class
 * @private
 * @constructor
 */
var PhoneHandler = function () {
	return this;
};

PhoneHandler.prototype = {
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	processSubscriberNumber: function(number, fields, regionSettings) {
		var last;
		
		last = number.search(/[xwtp,;]/i);	// last digit of the local number

		if (last > -1) {
			if (last > 0) {
				fields.subscriberNumber = number.substring(0, last);
			}
			// strip x's which are there to indicate a break between the local subscriber number and the extension, but
			// are not themselves a dialable character
			fields.extension = number.substring(last).replace('x', '');
		} else {
			if (number.length) {
				fields.subscriberNumber = number;
			}
		}
		
		if (regionSettings.plan.getFieldLength('maxLocalLength') &&
				fields.subscriberNumber &&
				fields.subscriberNumber.length > regionSettings.plan.getFieldLength('maxLocalLength')) {
			fields.invalid = true;
		}
	},
	/**
	 * @private
	 * @param {string} fieldName 
	 * @param {number} length length of phone number
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 * @param {boolean} noExtractTrunk 
	 */
	processFieldWithSubscriberNumber: function(fieldName, length, number, currentChar, fields, regionSettings, noExtractTrunk) {
		var ret, end;
		
		if (length !== undefined && length > 0) {
			// fixed length
			end = length;
			if (regionSettings.plan.getTrunkCode() === "0" && number.charAt(0) === "0") {
				end += regionSettings.plan.getTrunkCode().length;  // also extract the trunk access code
			}
		} else {
			// variable length
			// the setting is the negative of the length to add, so subtract to make it positive
			end = currentChar + 1 - length;
		}
		
		if (fields[fieldName] !== undefined) {
			// we have a spurious recognition, because this number already contains that field! So, just put
			// everything into the subscriberNumber as the default
			this.processSubscriberNumber(number, fields, regionSettings);
		} else {
			fields[fieldName] = number.substring(0, end);
			if (number.length > end) {
				this.processSubscriberNumber(number.substring(end), fields, regionSettings);
			}
		}
		
		ret = {
			number: ""
		};

		return ret;
	},
	/**
	 * @private
	 * @param {string} fieldName 
	 * @param {number} length length of phone number
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	processField: function(fieldName, length, number, currentChar, fields, regionSettings) {
		var ret = {}, end;
		
		if (length !== undefined && length > 0) {
			// fixed length
			end = length;
			if (regionSettings.plan.getTrunkCode() === "0" && number.charAt(0) === "0") {
				end += regionSettings.plan.getTrunkCode().length;  // also extract the trunk access code
			}
		} else {
			// variable length
			// the setting is the negative of the length to add, so subtract to make it positive
			end = currentChar + 1 - length;
		}
		
		if (fields[fieldName] !== undefined) {
			// we have a spurious recognition, because this number already contains that field! So, just put
			// everything into the subscriberNumber as the default
			this.processSubscriberNumber(number, fields, regionSettings);
			ret.number = "";
		} else {
			fields[fieldName] = number.substring(0, end);			
			ret.number = (number.length > end) ? number.substring(end) : "";
		}
		
		return ret;
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	trunk: function(number, currentChar, fields, regionSettings) {
		var ret, trunkLength;
		
		if (fields.trunkAccess !== undefined) {
			// What? We already have one? Okay, put the rest of this in the subscriber number as the default behaviour then.
			this.processSubscriberNumber(number, fields, regionSettings);
			number = "";
		} else {
			trunkLength = regionSettings.plan.getTrunkCode().length;
			fields.trunkAccess = number.substring(0, trunkLength);
			number = (number.length > trunkLength) ? number.substring(trunkLength) : "";
		}
		
		ret = {
			number: number
		};
		
		return ret;
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	plus: function(number, currentChar, fields, regionSettings) {
		var ret = {};
		
		if (fields.iddPrefix !== undefined) {
			// What? We already have one? Okay, put the rest of this in the subscriber number as the default behaviour then.
			this.processSubscriberNumber(number, fields, regionSettings);
			ret.number = "";
		} else {
			// found the idd prefix, so save it and cause the function to parse the next part
			// of the number with the idd table
			fields.iddPrefix = number.substring(0, 1);
	
			ret = {
				number: number.substring(1),
				table: 'idd'    // shared subtable that parses the country code
			};
		}		
		return ret;
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	idd: function(number, currentChar, fields, regionSettings) {
		var ret = {};
		
		if (fields.iddPrefix !== undefined) {
			// What? We already have one? Okay, put the rest of this in the subscriber number as the default behaviour then.
			this.processSubscriberNumber(number, fields, regionSettings);
			ret.number = "";
		} else {
			// found the idd prefix, so save it and cause the function to parse the next part
			// of the number with the idd table
			fields.iddPrefix = number.substring(0, currentChar+1);
	
			ret = {
				number: number.substring(currentChar+1),
				table: 'idd'    // shared subtable that parses the country code
			};
		}
		
		return ret;
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */	
	country: function(number, currentChar, fields, regionSettings) {
		var ret, cc;
		
		// found the country code of an IDD number, so save it and cause the function to 
		// parse the rest of the number with the regular table for this locale
		fields.countryCode = number.substring(0, currentChar+1);
		cc = fields.countryCode.replace(/[wWpPtT\+#\*]/g, ''); // fix for NOV-108200
		// console.log("Found country code " + fields.countryCode + ". Switching to country " + locale.region + " to parse the rest of the number");
		
		ret = {
			number: number.substring(currentChar+1),
			countryCode: cc
		};
		
		return ret;
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	cic: function(number, currentChar, fields, regionSettings) {
		return this.processField('cic', regionSettings.plan.getFieldLength('cic'), number, currentChar, fields, regionSettings);
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	service: function(number, currentChar, fields, regionSettings) {
		return this.processFieldWithSubscriberNumber('serviceCode', regionSettings.plan.getFieldLength('serviceCode'), number, currentChar, fields, regionSettings, false);
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	area: function(number, currentChar, fields, regionSettings) {
		var ret, last, end, localLength;
		
		last = number.search(/[xwtp]/i);	// last digit of the local number
		localLength = (last > -1) ? last : number.length;

		if (regionSettings.plan.getFieldLength('areaCode') > 0) {
			// fixed length
			end = regionSettings.plan.getFieldLength('areaCode');
			if (regionSettings.plan.getTrunkCode() === number.charAt(0)) {
				end += regionSettings.plan.getTrunkCode().length;  // also extract the trunk access code
				localLength -= regionSettings.plan.getTrunkCode().length;
			}
		} else {
			// variable length
			// the setting is the negative of the length to add, so subtract to make it positive
			end = currentChar + 1 - regionSettings.plan.getFieldLength('areaCode');
		}
		
		// substring() extracts the part of the string up to but not including the end character,
		// so add one to compensate
		if (regionSettings.plan.getFieldLength('maxLocalLength') !== undefined) {
			if (fields.trunkAccess !== undefined || fields.mobilePrefix !== undefined ||
					fields.countryCode !== undefined ||
					localLength > regionSettings.plan.getFieldLength('maxLocalLength')) {
				// too long for a local number by itself, or a different final state already parsed out the trunk
				// or mobile prefix, then consider the rest of this number to be an area code + part of the subscriber number
				fields.areaCode = number.substring(0, end);
				if (number.length > end) {
					this.processSubscriberNumber(number.substring(end), fields, regionSettings);
				}
			} else {
				// shorter than the length needed for a local number, so just consider it a local number
				this.processSubscriberNumber(number, fields, regionSettings);
			}
		} else {
			fields.areaCode = number.substring(0, end);
			if (number.length > end) {
				this.processSubscriberNumber(number.substring(end), fields, regionSettings);
			}
		}
		
		// extensions are separated from the number by a dash in Germany
		if (regionSettings.plan.getFindExtensions() !== undefined && fields.subscriberNumber !== undefined) {
			var dash = fields.subscriberNumber.indexOf("-");
			if (dash > -1) {
				fields.subscriberNumber = fields.subscriberNumber.substring(0, dash);
				fields.extension = fields.subscriberNumber.substring(dash+1);
			}
		}

		ret = {
			number: ""
		};

		return ret;
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	none: function(number, currentChar, fields, regionSettings) {
		var ret;
		
		// this is a last resort function that is called when nothing is recognized.
		// When this happens, just put the whole stripped number into the subscriber number
			
		if (number.length > 0) {
			this.processSubscriberNumber(number, fields, regionSettings);
			if (currentChar > 0 && currentChar < number.length) {
				// if we were part-way through parsing, and we hit an invalid digit,
				// indicate that the number could not be parsed properly
				fields.invalid = true;
			}
		}
		
		ret = {
			number:""
		};
		
		return ret;
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	vsc: function(number, currentChar, fields, regionSettings) {
		var ret, length, end;

		if (fields.vsc === undefined) {
			length = regionSettings.plan.getFieldLength('vsc') || 0;
			if (length !== undefined && length > 0) {
				// fixed length
				end = length;
			} else {
				// variable length
				// the setting is the negative of the length to add, so subtract to make it positive
				end = currentChar + 1 - length;
			}
			
			// found a VSC code (ie. a "star code"), so save it and cause the function to 
			// parse the rest of the number with the same table for this locale
			fields.vsc = number.substring(0, end);
			number = (number.length > end) ? "^" + number.substring(end) : "";
		} else {
			// got it twice??? Okay, this is a bogus number then. Just put everything else into the subscriber number as the default
			this.processSubscriberNumber(number, fields, regionSettings);
			number = "";
		}

		// treat the rest of the number as if it were a completely new number
		ret = {
			number: number
		};

		return ret;
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	cell: function(number, currentChar, fields, regionSettings) {
		return this.processFieldWithSubscriberNumber('mobilePrefix', regionSettings.plan.getFieldLength('mobilePrefix'), number, currentChar, fields, regionSettings, false);
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	personal: function(number, currentChar, fields, regionSettings) {
		return this.processFieldWithSubscriberNumber('serviceCode', regionSettings.plan.getFieldLength('personal'), number, currentChar, fields, regionSettings, false);
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	emergency: function(number, currentChar, fields, regionSettings) {
		return this.processFieldWithSubscriberNumber('emergency', regionSettings.plan.getFieldLength('emergency'), number, currentChar, fields, regionSettings, true);
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	premium: function(number, currentChar, fields, regionSettings) {
		return this.processFieldWithSubscriberNumber('serviceCode', regionSettings.plan.getFieldLength('premium'), number, currentChar, fields, regionSettings, false);
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	special: function(number, currentChar, fields, regionSettings) {
		return this.processFieldWithSubscriberNumber('serviceCode', regionSettings.plan.getFieldLength('special'), number, currentChar, fields, regionSettings, false);
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	service2: function(number, currentChar, fields, regionSettings) {
		return this.processFieldWithSubscriberNumber('serviceCode', regionSettings.plan.getFieldLength('service2'), number, currentChar, fields, regionSettings, false);
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	service3: function(number, currentChar, fields, regionSettings) {
		return this.processFieldWithSubscriberNumber('serviceCode', regionSettings.plan.getFieldLength('service3'), number, currentChar, fields, regionSettings, false);
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	service4: function(number, currentChar, fields, regionSettings) {
		return this.processFieldWithSubscriberNumber('serviceCode', regionSettings.plan.getFieldLength('service4'), number, currentChar, fields, regionSettings, false);
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	cic2: function(number, currentChar, fields, regionSettings) {
		return this.processField('cic', regionSettings.plan.getFieldLength('cic2'), number, currentChar, fields, regionSettings);
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	cic3: function(number, currentChar, fields, regionSettings) {
		return this.processField('cic', regionSettings.plan.getFieldLength('cic3'), number, currentChar, fields, regionSettings);
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	start: function(number, currentChar, fields, regionSettings) {
		// don't do anything except transition to the next state
		return {
			number: number
		};
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	local: function(number, currentChar, fields, regionSettings) {
		// in open dialling plans, we can tell that this number is a local subscriber number because it
		// starts with a digit that indicates as such
		this.processSubscriberNumber(number, fields, regionSettings);
		return {
			number: ""
		};
	}
};

// context-sensitive handler
/**
 * @class
 * @private
 * @extends PhoneHandler
 * @constructor
 */
var CSStateHandler = function () {
	return this;
};

CSStateHandler.prototype = new PhoneHandler();
CSStateHandler.prototype.special = function (number, currentChar, fields, regionSettings) {
	var ret;
	
	// found a special area code that is both a node and a leaf. In
	// this state, we have found the leaf, so chop off the end 
	// character to make it a leaf.
	if (number.charAt(0) === "0") {
		fields.trunkAccess = number.charAt(0);
		fields.areaCode = number.substring(1, currentChar);
	} else {
		fields.areaCode = number.substring(0, currentChar);
	}
	this.processSubscriberNumber(number.substring(currentChar), fields, regionSettings);
	
	ret = {
		number: ""
	};
	
	return ret;
};

/**
 * @class
 * @private
 * @extends PhoneHandler
 * @constructor
 */
var USStateHandler = function () {
	return this;
};

USStateHandler.prototype = new PhoneHandler();
USStateHandler.prototype.vsc = function (number, currentChar, fields, regionSettings) {
	var ret;

	// found a VSC code (ie. a "star code")
	fields.vsc = number;

	// treat the rest of the number as if it were a completely new number
	ret = {
		number: ""
	};

	return ret;
};

/**
 * Creates a phone handler instance that is correct for the locale. Phone handlers are
 * used to handle parsing of the various fields in a phone number.
 * 
 * @protected
 * @static
 * @return {PhoneHandler} the correct phone handler for the locale
 */
var PhoneHandlerFactory = function (locale, plan) {
	if (plan.getContextFree() !== undefined && typeof(plan.getContextFree()) === 'boolean' && plan.getContextFree() === false) {
		return new CSStateHandler();
	}
	var region = (locale && locale.getRegion()) || "ZZ";
	switch (region) {
	case 'US':
		return new USStateHandler();
		break;
	default:
		return new PhoneHandler();
	}
};

module.exports = PhoneHandlerFactory;