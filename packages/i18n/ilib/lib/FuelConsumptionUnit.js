/*
 * fuelconsumption.js - Unit conversions for FuelConsumption
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
 * Create a new fuelconsumption measurement instance.
 * 
 * @constructor
 * @extends Measurement
 * @param options {{unit:string,amount:number|string|undefined}} Options controlling
 * the construction of this instance
 */
var FuelConsumptionUnit = function(options) {
    this.unit = "km/liter";
    this.amount = 0;
    this.aliases = FuelConsumptionUnit.aliases; // share this table in all instances

    if (options) {
        if (typeof(options.unit) !== 'undefined') {
            this.originalUnit = options.unit;
            this.unit = this.aliases[options.unit] || options.unit;
        }

        if (typeof(options.amount) === 'object') {
            if (options.amount.getMeasure() === "fuelconsumption") {
                this.amount = FuelConsumptionUnit.convert(this.unit, options.amount.getUnit(), options.amount.getAmount());
            } else {
                throw "Cannot convert unit " + options.amount.unit + " to fuelconsumption";
            }
        } else if (typeof(options.amount) !== 'undefined') {
            this.amount = parseFloat(options.amount);
        }
    }
};

FuelConsumptionUnit.prototype = new Measurement();
FuelConsumptionUnit.prototype.parent = Measurement;
FuelConsumptionUnit.prototype.constructor = FuelConsumptionUnit;

FuelConsumptionUnit.ratios = [
    "km/liter",
    "liter/100km",
    "mpg",
    "mpg(imp)"
];

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
FuelConsumptionUnit.prototype.getMeasure = function() {
    return "fuelconsumption";
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
FuelConsumptionUnit.prototype.convert = function(to) {
    if (!to || typeof(FuelConsumptionUnit.ratios[this.normalizeUnits(to)]) === 'undefined') {
        return undefined;
    }
    return new FuelConsumptionUnit({
        unit: to,
        amount: this
    });
};
/*["km/liter", "liter/100km", "mpg", "mpg(imp)"*/
FuelConsumptionUnit.aliases = {
    "Km/liter": "km/liter",
    "KM/Liter": "km/liter",
    "KM/L": "km/liter",
    "Kilometers Per Liter": "km/liter",
    "kilometers per liter": "km/liter",
    "km/l": "km/liter",
    "Kilometers/Liter": "km/liter",
    "Kilometer/Liter": "km/liter",
    "kilometers/liter": "km/liter",
    "kilometer/liter": "km/liter",
    "km/liter": "km/liter",
    "Liter/100km": "liter/100km",
    "Liters/100km": "liter/100km",
    "Liter/100kms": "liter/100km",
    "Liters/100kms": "liter/100km",
    "liter/100km": "liter/100km",
    "liters/100kms": "liter/100km",
    "liters/100km": "liter/100km",
    "liter/100kms": "liter/100km",
    "Liter/100KM": "liter/100km",
    "Liters/100KM": "liter/100km",
    "L/100km": "liter/100km",
    "L/100KM": "liter/100km",
    "l/100KM": "liter/100km",
    "l/100km": "liter/100km",
    "l/100kms": "liter/100km",
    "MPG(US)": "mpg",
    "USMPG ": "mpg",
    "mpg": "mpg",
    "mpgUS": "mpg",
    "mpg(US)": "mpg",
    "mpg(us)": "mpg",
    "mpg-us": "mpg",
    "mpg Imp": "mpg(imp)",
    "MPG(imp)": "mpg(imp)",
    "mpg(imp)": "mpg(imp)",
    "mpg-imp": "mpg(imp)"
};

FuelConsumptionUnit.metricToUScustomary = {
    "km/liter": "mpg",
    "liter/100km": "mpg"
};
FuelConsumptionUnit.metricToImperial = {
    "km/liter": "mpg(imp)",
    "liter/100km": "mpg(imp)"
};

FuelConsumptionUnit.imperialToMetric = {
	"mpg(imp)": "km/liter"
};
FuelConsumptionUnit.imperialToUScustomary = {
	"mpg(imp)": "mpg"
};

FuelConsumptionUnit.uScustomaryToImperial = {
	"mpg": "mpg(imp)"
};
FuelConsumptionUnit.uScustomarylToMetric = {
	"mpg": "km/liter"
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
FuelConsumptionUnit.prototype.localize = function(locale) {
	var to;
	if (locale === "en-US") {
		to = FuelConsumptionUnit.metricToUScustomary[this.unit] ||
		    FuelConsumptionUnit.imperialToUScustomary[this.unit] ||
		    this.unit;
	} else if (locale === "en-GB") {
		to = FuelConsumptionUnit.metricToImperial[this.unit] ||
		    FuelConsumptionUnit.uScustomaryToImperial[this.unit] ||
		    this.unit;
	} else {
		to = FuelConsumptionUnit.uScustomarylToMetric[this.unit] ||
		    FuelConsumptionUnit.imperialToUScustomary[this.unit] ||
		    this.unit;
	}
	return new FuelConsumptionUnit({
	    unit: to,
	    amount: this
	});
};

/**
 * Convert a FuelConsumption to another measure.
 * 
 * @static
 * @param to {string} unit to convert to
 * @param from {string} unit to convert from
 * @param fuelConsumption {number} amount to be convert
 * @returns {number|undefined} the converted amount
 */
FuelConsumptionUnit.convert = function(to, from, fuelConsumption) {
    from = FuelConsumptionUnit.aliases[from] || from;
    to = FuelConsumptionUnit.aliases[to] || to;
    var returnValue = 0;

    switch (from) {
        case "km/liter":
            switch (to) {
                case "km/liter":
                    returnValue = fuelConsumption * 1;
                    break;
                case "liter/100km":
                    returnValue = 100 / fuelConsumption;
                    break;
                case "mpg":
                    returnValue = fuelConsumption * 2.35215;
                    break;
                case "mpg(imp)":
                    returnValue = fuelConsumption * 2.82481;
                    break;
            }
            break;
        case "liter/100km":
            switch (to) {
                case "km/liter":
                    returnValue = 100 / fuelConsumption;
                    break;
                case "liter/100km":
                    returnValue = fuelConsumption * 1;
                    break;
                case "mpg":
                    returnValue = 235.215 / fuelConsumption;
                    break;
                case "mpg(imp)":
                    returnValue = 282.481 / fuelConsumption;
                    break;
            }
            break;
        case "mpg":
            switch (to) {
                case "km/liter":
                    returnValue = fuelConsumption * 0.425144;
                    break;
                case "liter/100km":
                    returnValue = 235.215 / fuelConsumption;
                    break;
                case "mpg":
                    returnValue = 1 * fuelConsumption;
                    break;
                case "mpg(imp)":
                    returnValue = 1.20095 * fuelConsumption;
                    break;
            }
            break;
        case "mpg(imp)":
            switch (to) {
                case "km/liter":
                    returnValue = fuelConsumption * 0.354006;
                    break;
                case "liter/100km":
                    returnValue = 282.481 / fuelConsumption;
                    break;
                case "mpg":
                    returnValue = 0.832674 * fuelConsumption;
                    break;
                case "mpg(imp)":
                    returnValue = 1 * fuelConsumption;
                    break;
            }
            break;
    }
    return returnValue;
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
FuelConsumptionUnit.prototype.scale = function(measurementsystem) {
    return new FuelConsumptionUnit({
        unit: this.unit,
        amount: this.amount
    }); 
};

/**
 * @private
 * @static
 */
FuelConsumptionUnit.getMeasures = function() {
    var ret = [];
    ret.push("km/liter");
    ret.push("liter/100km");
    ret.push("mpg");
    ret.push("mpg(imp)");
    
    return ret;
};

//register with the factory method
Measurement._constructors["fuelconsumption"] = FuelConsumptionUnit;

module.exports = FuelConsumptionUnit;