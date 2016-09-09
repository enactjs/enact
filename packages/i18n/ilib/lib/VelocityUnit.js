/*
 * VelocityUnit.js - Unit conversions for VelocityUnits/speeds
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
 * Create a new speed measurement instance.
 * 
 * @constructor
 * @extends Measurement
 * @param options {{unit:string,amount:number|string|undefined}} Options controlling 
 * the construction of this instance
 */
var VelocityUnit = function (options) {
	this.unit = "meters/second";
	this.amount = 0;
	this.aliases = VelocityUnit.aliases; // share this table in all instances
	
	if (options) {
		if (typeof(options.unit) !== 'undefined') {
			this.originalUnit = options.unit;
			this.unit = this.aliases[options.unit] || options.unit;
		}
		
		if (typeof(options.amount) === 'object') {
			if (options.amount.getMeasure() === "speed") {
				this.amount = VelocityUnit.convert(this.unit, options.amount.getUnit(), options.amount.getAmount());
			} else {
				throw "Cannot convert units " + options.amount.unit + " to a speed";
			}
		} else if (typeof(options.amount) !== 'undefined') {
			this.amount = parseFloat(options.amount);
		}
	}
	
	if (typeof(VelocityUnit.ratios[this.unit]) === 'undefined') {
		throw "Unknown unit: " + options.unit;
	}
};

VelocityUnit.prototype = new Measurement();
VelocityUnit.prototype.parent = Measurement;
VelocityUnit.prototype.constructor = VelocityUnit;

VelocityUnit.ratios = {
	/*                 index, k/h         f/s         miles/h      knot         m/s        km/s         miles/s */
    "kilometer/hour":   [ 1,  1,          0.911344,   0.621371,    0.539957,    0.277778,  2.77778e-4,  1.72603109e-4 ],
	"feet/second":      [ 2,  1.09728,    1,          0.681818,    0.592484,    0.3048,    3.048e-4,    1.89393939e-4 ],  
    "miles/hour":       [ 3,  1.60934,    1.46667,    1,           0.868976,    0.44704,   4.4704e-4,   2.77777778e-4 ],
    "knot":             [ 4,  1.852,      1.68781,    1.15078,     1,           0.514444,  5.14444e-4,  3.19660958e-4 ],
  	"meters/second":    [ 5,  3.6,        3.28084,    2.236936,    1.94384,     1,         0.001,       6.21371192e-4 ],	
    "kilometer/second": [ 6,  3600,       3280.8399,  2236.93629,  1943.84449,  1000,      1,           0.621371192   ],
    "miles/second":     [ 7,  5793.6384,  5280,       3600,        3128.31447,  1609.344,  1.609344,    1             ]
};

VelocityUnit.metricSystem = {
    "kilometer/hour": 1,
    "meters/second": 5,
    "kilometer/second": 6
};
VelocityUnit.imperialSystem = {
    "feet/second": 2,
    "miles/hour": 3,
    "knot": 4,
    "miles/second": 7
};
VelocityUnit.uscustomarySystem = {
    "feet/second": 2,
    "miles/hour": 3,
    "knot": 4,
    "miles/second": 7
};

VelocityUnit.metricToUScustomary = {
    "kilometer/hour": "miles/hour",
    "meters/second": "feet/second",
    "kilometer/second": "miles/second"
};
VelocityUnit.UScustomaryTometric = {
    "miles/hour": "kilometer/hour",
    "feet/second": "meters/second",
    "miles/second": "kilometer/second",
    "knot": "kilometer/hour"
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
VelocityUnit.prototype.getMeasure = function() {
	return "speed";
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
VelocityUnit.prototype.convert = function(to) {
	if (!to || typeof(VelocityUnit.ratios[this.normalizeUnits(to)]) === 'undefined') {
		return undefined;
	}
	return new VelocityUnit({
		unit: to,
		amount: this
	});
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
VelocityUnit.prototype.scale = function(measurementsystem) {
	var mSystem;
	if (measurementsystem === "metric" ||
	    (typeof (measurementsystem) === 'undefined' && typeof (VelocityUnit.metricSystem[this.unit]) !== 'undefined')) {
		mSystem = VelocityUnit.metricSystem;
	} else if (measurementsystem === "imperial" ||
	    (typeof (measurementsystem) === 'undefined' && typeof (VelocityUnit.imperialSystem[this.unit]) !== 'undefined')) {
		mSystem = VelocityUnit.imperialSystem;
	} else if (measurementsystem === "uscustomary" ||
	    (typeof (measurementsystem) === 'undefined' && typeof (VelocityUnit.uscustomarySystem[this.unit]) !== 'undefined')) {
		mSystem = VelocityUnit.uscustomarySystem;
	} else {
		return new VelocityUnit({
		    unit: this.unit,
		    amount: this.amount
		});
	}

	var speed = this.amount;
	var munit = this.unit;
	var fromRow = VelocityUnit.ratios[this.unit];

	speed = 18446744073709551999;
	
    for ( var m in mSystem) {
		var tmp = this.amount * fromRow[mSystem[m]];
		if (tmp >= 1 && tmp < speed) {
			speed = tmp;
			munit = m;
		}
	}

	return new VelocityUnit({
	    unit: munit,
	    amount: speed
	});
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
VelocityUnit.prototype.localize = function(locale) {
    var to;
    if (locale === "en-US" || locale === "en-GB") {
        to = VelocityUnit.metricToUScustomary[this.unit] || this.unit;
    } else {
        to = VelocityUnit.UScustomaryTometric[this.unit] || this.unit;
    }
    return new VelocityUnit({
		unit: to,
		amount: this
    });
};

VelocityUnit.aliases = {
    "foot/sec": "feet/second",
    "foot/s": "feet/second",
    "feet/s": "feet/second",
    "f/s": "feet/second",
    "feet/second": "feet/second",
    "feet/sec": "feet/second",
    "meter/sec": "meters/second",
    "meter/s": "meters/second",
    "meters/s": "meters/second",
    "metre/sec": "meters/second",
    "metre/s": "meters/second",
    "metres/s": "meters/second",
    "mt/sec": "meters/second",
    "m/sec": "meters/second",
    "mt/s": "meters/second",
    "m/s": "meters/second",
    "mps": "meters/second",
    "meters/second": "meters/second",
    "meters/sec": "meters/second",
    "kilometer/hour": "kilometer/hour",
    "km/hour": "kilometer/hour",
    "kilometers/hour": "kilometer/hour",
    "kmh": "kilometer/hour",
    "km/h": "kilometer/hour",
    "kilometer/h": "kilometer/hour",
    "kilometers/h": "kilometer/hour",
    "km/hr": "kilometer/hour",
    "kilometer/hr": "kilometer/hour",
    "kilometers/hr": "kilometer/hour",
    "kilometre/hour": "kilometer/hour",
    "mph": "miles/hour",
    "mile/hour": "miles/hour",
    "mile/hr": "miles/hour",
    "mile/h": "miles/hour",
    "miles/h": "miles/hour",
    "miles/hr": "miles/hour",
    "miles/hour": "miles/hour",
    "kn": "knot",
    "kt": "knot",
    "kts": "knot",
    "knots": "knot",
    "nm/h": "knot",
    "nm/hr": "knot",
    "nauticalmile/h": "knot",
    "nauticalmile/hr": "knot",
    "nauticalmile/hour": "knot",
    "nauticalmiles/hr": "knot",
    "nauticalmiles/hour": "knot",
    "knot": "knot",
    "kilometer/second": "kilometer/second",
    "kilometer/sec": "kilometer/second",
    "kilometre/sec": "kilometer/second",
    "Kilometre/sec": "kilometer/second",
    "kilometers/second": "kilometer/second",
    "kilometers/sec": "kilometer/second",
    "kilometres/sec": "kilometer/second",
    "Kilometres/sec": "kilometer/second",
    "km/sec": "kilometer/second",
    "Km/s": "kilometer/second",
    "km/s": "kilometer/second",
    "miles/second": "miles/second",
    "miles/sec": "miles/second",
    "miles/s": "miles/second",
    "mile/s": "miles/second",
    "mile/sec": "miles/second",
    "Mile/s": "miles/second"
};

/**
 * Convert a speed to another measure.
 * @static
 * @param to {string} unit to convert to
 * @param from {string} unit to convert from
 * @param speed {number} amount to be convert
 * @returns {number|undefined} the converted amount
 */
VelocityUnit.convert = function(to, from, speed) {
    from = VelocityUnit.aliases[from] || from;
    to = VelocityUnit.aliases[to] || to;
	var fromRow = VelocityUnit.ratios[from];
	var toRow = VelocityUnit.ratios[to];
	if (typeof(from) === 'undefined' || typeof(to) === 'undefined') {
		return undefined;
	}	
	var result = speed * fromRow[toRow[0]];
    return result;
};

/**
 * @private
 * @static
 */
VelocityUnit.getMeasures = function () {
	var ret = [];
	for (var m in VelocityUnit.ratios) {
		ret.push(m);
	}
	return ret;
};

//register with the factory method
Measurement._constructors["speed"] = VelocityUnit;
Measurement._constructors["velocity"] = VelocityUnit;

module.exports = VelocityUnit;