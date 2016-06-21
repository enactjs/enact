/*
 * Measurement.js - Measurement unit superclass
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
 * Superclass for measurement instances that contains shared functionality
 * and defines the interface. <p>
 * 
 * This class is never instantiated on its own. Instead, measurements should
 * be created using the {@link MeasurementFactory} function, which creates the
 * correct subclass based on the given parameters.<p>
 * 
 * @private
 * @constructor 
 */
var Measurement = function() {
};

/**
 * @private
 */
Measurement._constructors = {};

Measurement.prototype = {
	/**
	 * Return the normalized name of the given units. If the units are
	 * not recognized, this method returns its parameter unmodified.<p>
	 * 
	 * Examples:
	 * 
	 * <ui>
	 * <li>"metres" gets normalized to "meter"<br>
	 * <li>"ml" gets normalized to "milliliter"<br>
	 * <li>"foobar" gets normalized to "foobar" (no change because it is not recognized)
	 * </ul>
	 *  
	 * @param {string} name name of the units to normalize. 
	 * @returns {string} normalized name of the units
	 */
	normalizeUnits: function(name) {
		return this.aliases[name] || name;
	},

	/**
	 * Return the normalized units used in this measurement.
	 * @return {string} name of the unit of measurement 
	 */
	getUnit: function() {
		return this.unit;
	},
     
	/**
	 * Return the units originally used to construct this measurement
	 * before it was normalized.
	 * @return {string} name of the unit of measurement 
	 */
	getOriginalUnit: function() {
		return this.originalUnit;
	},
	
	/**
	 * Return the numeric amount of this measurement.
	 * @return {number} the numeric amount of this measurement
	 */
	getAmount: function() {
		return this.amount;
	},
	
	/**
	 * Return the type of this measurement. Examples are "mass",
	 * "length", "speed", etc. Measurements can only be converted
	 * to measurements of the same type.<p>
	 * 
	 * The type of the units is determined automatically from the 
	 * units. For example, the unit "grams" is type "mass". Use the 
	 * static call {@link Measurement.getAvailableUnits}
	 * to find out what units this version of ilib supports.
	 * 
	 * @abstract
	 * @return {string} the name of the type of this measurement
	 */
	getMeasure: function() {},
	
	/**
	 * Return a new measurement instance that is converted to a new
	 * measurement unit. Measurements can only be converted
	 * to measurements of the same type.<p>
	 * 
	 * @abstract
	 * @param {string} to The name of the units to convert to
	 * @return {Measurement|undefined} the converted measurement
	 * or undefined if the requested units are for a different
	 * measurement type
	 */
	convert: function(to) {},     
        
        /**
	 * Scale the measurement unit to an acceptable level. The scaling
	 * happens so that the integer part of the amount is as small as
	 * possible without being below zero. This will result in the 
	 * largest units that can represent this measurement without
	 * fractions. Measurements can only be scaled to other measurements 
	 * of the same type.
	 * 
	 * @abstract
	 * @param {string=} measurementsystem system to use (uscustomary|imperial|metric),
	 * or undefined if the system can be inferred from the current measure
	 * @return {Measurement} a new instance that is scaled to the 
	 * right level
	 */
	scale: function(measurementsystem) {},
        
	/**
	 * Localize the measurement to the commonly used measurement in that locale, for example
	 * If a user's locale is "en-US" and the measurement is given as "60 kmh", 
	 * the formatted number should be automatically converted to the most appropriate 
	 * measure in the other system, in this case, mph. The formatted result should
	 * appear as "37.3 mph". 
	 * 
	 * @abstract
	 * @param {string} locale current locale string
	 * @returns {Measurement} a new instance that is converted to locale
	 */
	localize: function(locale) {}
};

module.exports = Measurement;
