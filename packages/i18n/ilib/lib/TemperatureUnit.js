/*
 * TemperatureUnit.js - Unit conversions for temperature measurements
 *
 * Copyright © 2014-2015, 2018 JEDLSoft
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

    this.ratios = TemperatureUnit.ratios;
    this.aliases = TemperatureUnit.aliases;
    this.aliasesLower = TemperatureUnit.aliasesLower;
    this.systems = TemperatureUnit.systems;

    this.parent(options);
};

TemperatureUnit.prototype = new Measurement();
TemperatureUnit.prototype.parent = Measurement;
TemperatureUnit.prototype.constructor = TemperatureUnit;

TemperatureUnit.ratios = {
    /*            index, C            K            F   */
    "celsius":    [ 1,   1,           1,           9/5 ],
    "kelvin":     [ 2,   1,           1,           9/5 ],
    "fahrenheit": [ 3,   5/9,         5/9,         1   ]
};

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

/**
 * Return a new instance of this type of measurement.
 *
 * @param {Object} params parameters to the constructor
 * @return {Measurement} a measurement subclass instance
 */
TemperatureUnit.prototype.newUnit = function(params) {
    return new TemperatureUnit(params);
};

TemperatureUnit.systems = {
    "metric": [
        "celsius",
        "kelvin"
    ],
    "uscustomary": [
        "fahrenheit"
    ],
    "imperial": [
        "fahrenheit"
    ],
    "conversions": {
        "metric": {
            "uscustomary": {
                "celsius": "fahrenheit",
                "kelvin": "fahrenheit"
            },
            "imperial": {
                "celsius": "fahrenheit",
                "kelvin": "fahrenheit"
            }
        },
        "uscustomary": {
            "metric": {
                "fahrenheit": "celsius"
            }
        },
        "imperial": {
            "metric": {
                "fahrenheit": "celsius"
            }
        }
    }
};

TemperatureUnit.aliases = {
    "Celsius": "celsius",
    "C": "celsius",
    "Centegrade": "celsius",
    "Centigrade": "celsius",
    "Fahrenheit": "fahrenheit",
    "F": "fahrenheit",
    "K": "kelvin",
    "Kelvin": "kelvin",
    "°F": "fahrenheit",
    "℉": "fahrenheit",
    "℃": "celsius",
    "°C": "celsius"
};

(function() {
    TemperatureUnit.aliasesLower = {};
    for (var a in TemperatureUnit.aliases) {
        TemperatureUnit.aliasesLower[a.toLowerCase()] = TemperatureUnit.aliases[a];
    }
})();

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
    return TemperatureUnit.convert(to, this.unit, this.amount);
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
    from = Measurement.getUnitIdCaseInsensitive(TemperatureUnit, from) || from;
    to = Measurement.getUnitIdCaseInsensitive(TemperatureUnit, to) || to;
    if (from === to) {
        return temperature;
    } else if (from === "celsius") {
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
    // no scaling for temp units
    return this;
 };

/**
 * @private
 * @static
 */
TemperatureUnit.getMeasures = function () {
    return ["celsius", "kelvin", "fahrenheit"];
};

//register with the factory method
Measurement._constructors["temperature"] = TemperatureUnit;

module.exports = TemperatureUnit;