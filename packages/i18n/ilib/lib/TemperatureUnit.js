/*
 * temperature.js - Unit conversions for Temperature/temperature
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
Measurement.js
*/

var Measurement = require("./Measurement.js");

/**
 * @class
 * Create a new Temperature measurement instance.
 *  
 * @constructor
 * @extends Measurement
 * @param options {{unit:string,amount:number|string|undefined}} Options controlling 
 * the construction of this instance
 */
var TemperatureUnit = function (options) {
	this.unit = "celsius";
	this.amount = 0;
	this.aliases = TemperatureUnit.aliases; // share this table in all instances

	if (options) {
		if (typeof(options.unit) !== 'undefined') {
			this.originalUnit = options.unit;
			this.unit = this.aliases[options.unit] || options.unit;
		}

		if (typeof(options.amount) === 'object') {
			if (options.amount.getMeasure() === "temperature") {
				this.amount = TemperatureUnit.convert(this.unit, options.amount.getUnit(), options.amount.getAmount());
			} else {
				throw "Cannot convert unit " + options.amount.unit + " to a temperature";
			}
		} else if (typeof(options.amount) !== 'undefined') {
			this.amount = parseFloat(options.amount);
		}
	}
};

TemperatureUnit.prototype = new Measurement();
TemperatureUnit.prototype.parent = Measurement;
TemperatureUnit.prototype.constructor = TemperatureUnit;

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
 * @return {string} the name of the type of this measurement
 */
TemperatureUnit.prototype.getMeasure = function() {
	return "temperature";
};

TemperatureUnit.aliases = {
    "Celsius": "celsius",
    "celsius": "celsius",
    "C": "celsius",
    "centegrade": "celsius",
    "Centegrade": "celsius",
    "centigrade": "celsius",
    "Centigrade": "celsius",
    "fahrenheit": "fahrenheit",
    "Fahrenheit": "fahrenheit",
    "F": "fahrenheit",
    "kelvin": "kelvin",
    "K": "kelvin",
    "Kelvin": "kelvin",
    "°F": "fahrenheit",
    "℉": "fahrenheit",
    "℃": "celsius",
    "°C": "celsius"
};

/**
 * Return a new measurement instance that is converted to a new
 * measurement unit. Measurements can only be converted
 * to measurements of the same type.<p>
 *  
 * @param {string} to The name of the units to convert to
 * @return {Measurement|undefined} the converted measurement
 * or undefined if the requested units are for a different
 * measurement type 
 */
TemperatureUnit.prototype.convert = function(to) {
	if (!to || typeof(TemperatureUnit.ratios[this.normalizeUnits(to)]) === 'undefined') {
		return undefined;
	}
	return new TemperatureUnit({
		unit: to,
		amount: this
	});
};

/**
 * Convert a temperature to another measure.
 * @static
 * @param to {string} unit to convert to
 * @param from {string} unit to convert from
 * @param temperature {number} amount to be convert
 * @returns {number|undefined} the converted amount
 */
TemperatureUnit.convert = function(to, from, temperature) {
	var result = 0;
	from = TemperatureUnit.aliases[from] || from;
	to = TemperatureUnit.aliases[to] || to;
	if (from === to)
		return temperature;

	else if (from === "celsius") {
		if (to === "fahrenheit") {
			result = ((temperature * 9 / 5) + 32);
		} else if (to === "kelvin") {
			result = (temperature + 273.15);
		}

	} else if (from === "fahrenheit") {
		if (to === "celsius") {
			result = ((5 / 9 * (temperature - 32)));
		} else if (to === "kelvin") {
			result = ((temperature + 459.67) * 5 / 9);
		}
	} else if (from === "kelvin") {
		if (to === "celsius") {
			result = (temperature - 273.15);
		} else if (to === "fahrenheit") {
			result = ((temperature * 9 / 5) - 459.67);
		}
	}

	return result;
};

/**
 * Scale the measurement unit to an acceptable level. The scaling
 * happens so that the integer part of the amount is as small as
 * possible without being below zero. This will result in the 
 * largest units that can represent this measurement without
 * fractions. Measurements can only be scaled to other measurements 
 * of the same type.
 * 
 * @param {string=} measurementsystem system to use (uscustomary|imperial|metric),
 * or undefined if the system can be inferred from the current measure
 * @return {Measurement} a new instance that is scaled to the 
 * right level
 */
TemperatureUnit.prototype.scale = function(measurementsystem) {
    return new TemperatureUnit({
        unit: this.unit,
        amount: this.amount
    }); 
};

/**
 * @private
 * @static
 */
TemperatureUnit.getMeasures = function () {
	return ["celsius", "kelvin", "fahrenheit"];
};
TemperatureUnit.metricToUScustomary = {
	"celsius": "fahrenheit"
};
TemperatureUnit.usCustomaryToMetric = {
	"fahrenheit": "celsius"
};

/**
 * Localize the measurement to the commonly used measurement in that locale. For example
 * If a user's locale is "en-US" and the measurement is given as "60 kmh", 
 * the formatted number should be automatically converted to the most appropriate 
 * measure in the other system, in this case, mph. The formatted result should
 * appear as "37.3 mph". 
 * 
 * @abstract
 * @param {string} locale current locale string
 * @returns {Measurement} a new instance that is converted to locale
 */
TemperatureUnit.prototype.localize = function(locale) {
    var to;
    if (locale === "en-US" ) {
        to = TemperatureUnit.metricToUScustomary[this.unit] || this.unit;
    } else {
        to = TemperatureUnit.usCustomaryToMetric[this.unit] || this.unit;
    }
    return new TemperatureUnit({
        unit: to,
        amount: this
    });
};
//register with the factory method
Measurement._constructors["temperature"] = TemperatureUnit;

module.exports = TemperatureUnit;