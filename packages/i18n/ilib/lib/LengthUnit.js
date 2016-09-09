/*
 * LengthUnit.js - Unit conversions for Lengths/lengths
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
 * Create a new length measurement instance.
 *  
 * @constructor
 * @extends Measurement
 * @param options {{unit:string,amount:number|string|undefined}} Options controlling 
 * the construction of this instance
 */
var LengthUnit = function (options) {
	this.unit = "meter";
	this.amount = 0;
	this.aliases = LengthUnit.aliases; // share this table in all instances
	
	if (options) {
		if (typeof(options.unit) !== 'undefined') {
			this.originalUnit = options.unit;
			this.unit = this.aliases[options.unit] || options.unit;
		}
		
		if (typeof(options.amount) === 'object') {
			if (options.amount.getMeasure() === "length") {
				this.amount = LengthUnit.convert(this.unit, options.amount.getUnit(), options.amount.getAmount());
			} else {
				throw "Cannot convert unit " + options.amount.unit + " to a length";
			}
		} else if (typeof(options.amount) !== 'undefined') {
			this.amount = parseFloat(options.amount);
		}
	}
	
	if (typeof(LengthUnit.ratios[this.unit]) === 'undefined') {
		throw "Unknown unit: " + options.unit;
	}
};

LengthUnit.prototype = new Measurement();
LengthUnit.prototype.parent = Measurement;
LengthUnit.prototype.constructor = LengthUnit;

LengthUnit.ratios = {
	/*              index, µm           mm           cm           inch         dm           foot          yard          m             dam            hm              km              mile            nm            Mm             Gm             */ 
	"micrometer":   [ 1,   1,           1e-3,        1e-4,        3.93701e-5,  1e-5,        3.28084e-6,   1.09361e-6,   1e-6,         1e-7,          1e-8,           1e-9,           6.21373e-10,  5.39957e-10,  1e-12,          1e-15           ],
	"millimeter":   [ 2,   1000,        1,           0.1,         0.0393701,   0.01,        0.00328084,   1.09361e-3,   0.001,        1e-4,          1e-5,           1e-6,           6.21373e-7,   5.39957e-7,   1e-9,           1e-12           ],
	"centimeter":   [ 3,   1e4,         10,          1,           0.393701,    0.1,         0.0328084,    0.0109361,    0.01,         0.001,         1e-4,           1e-5,           6.21373e-6,   5.39957e-6,   1e-8,           1e-9            ],
    "inch":         [ 4,   25399.986,   25.399986,   2.5399986,   1,           0.25399986,  0.083333333,  0.027777778,  0.025399986,  2.5399986e-3,  2.5399986e-4,   2.5399986e-5,   1.5783e-5,    1.3715e-5,    2.5399986e-8,   2.5399986e-11   ],
    "decimeter":    [ 5,   1e5,         100,         10,          3.93701,     1,           0.328084,     0.109361,     0.1,          0.01,          0.001,          1e-4,           6.21373e-5,   5.39957e-5,   1e-7,           1e-8            ],
    "foot":         [ 6,   304799.99,   304.79999,   30.479999,   12,          3.0479999,   1,            0.33333333,   0.30479999,   0.030479999,   3.0479999e-3,   3.0479999e-4,   1.89394e-4,   1.64579e-4,   3.0479999e-7,   3.0479999e-10   ],
    "yard":         [ 7,   914402.758,  914.402758,  91.4402758,  36,          9.14402758,  3,            1,            0.914402758,  0.0914402758,  9.14402758e-3,  9.14402758e-4,  5.68182e-4,   4.93737e-4,   9.14402758e-7,  9.14402758e-10  ],
	"meter":        [ 8,   1e6,         1000,        100,         39.3701,     10,          3.28084,      1.09361,      1,            0.1,           0.01,           0.001,          6.213712e-4,  5.39957e-4,   1e-6,           1e-7            ],
	"decameter":    [ 9,   1e7,         1e4,         1000,        393.701,     100,         32.8084,      10.9361,      10,           1,             0.1,            0.01,           6.21373e-3,   5.39957e-3,   1e-5,           1e-6            ],
	"hectometer":   [ 10,  1e8,         1e5,         1e4,         3937.01,     1000,        328.084,      109.361,      100,          10,            1,              0.1,            0.0621373,    0.0539957,    1e-4,           1e-5            ],
	"kilometer":    [ 11,  1e9,         1e6,         1e5,         39370.1,     1e4,         3280.84,      1093.61,      1000,         100,           10,             1,              0.621373,     0.539957,     0.001,          1e-4            ],
    "mile":         [ 12,  1.60934e9,   1.60934e6,   1.60934e5,   63360,       1.60934e4,   5280,         1760,         1609.34,      160.934,       16.0934,        1.60934,        1,            0.868976,     1.60934e-3,     1.60934e-6      ],
    "nauticalmile": [ 13,  1.852e9,     1.852e6,     1.852e5,     72913.4,     1.852e4,     6076.12,      2025.37,      1852,         185.2,         18.52,          1.852,          1.15078,      1,            1.852e-3,       1.852e-6        ],
	"megameter":    [ 14,  1e12,        1e9,         1e6,         3.93701e7,   1e5,         3.28084e6,    1.09361e6,    1e4,          1000,          100,            10,             621.373,      539.957,      1,              0.001           ],        
    "gigameter":    [ 15,  1e15,        1e12,        1e9,         3.93701e10,  1e8,         3.28084e9,    1.09361e9,    1e7,          1e6,           1e5,            1e4,            621373.0,     539957.0,     1000,           1               ]	
};

LengthUnit.metricSystem = {
    "micrometer": 1,
    "millimeter": 2,
    "centimeter": 3,
    "decimeter": 5,
    "meter": 8,
    "decameter": 9,
    "hectometer": 10,
    "kilometer": 11,
    "megameter": 14,
    "gigameter": 15
};
LengthUnit.imperialSystem = {
    "inch": 4,
    "foot": 6,
    "yard": 7,
    "mile": 12,
    "nauticalmile": 13
};
LengthUnit.uscustomarySystem = {
    "inch": 4,
    "foot": 6,
    "yard": 7,
    "mile": 12,
    "nauticalmile": 13
};

LengthUnit.metricToUScustomary = {
    "micrometer": "inch",
    "millimeter": "inch",
    "centimeter": "inch",
    "decimeter": "inch",
    "meter": "yard",
    "decameter": "yard",
    "hectometer": "mile",
    "kilometer": "mile",
    "megameter": "nauticalmile",
    "gigameter": "nauticalmile"
};
LengthUnit.usCustomaryToMetric = {
    "inch": "centimeter",
    "foot": "centimeter",
    "yard": "meter",
    "mile": "kilometer",
    "nauticalmile": "kilometer"
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
LengthUnit.prototype.getMeasure = function() {
	return "length";
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
LengthUnit.prototype.localize = function(locale) {
    var to;
    if (locale === "en-US" || locale === "en-GB") {
        to = LengthUnit.metricToUScustomary[this.unit] || this.unit;
    } else {
        to = LengthUnit.usCustomaryToMetric[this.unit] || this.unit;
    }
    return new LengthUnit({
        unit: to,
        amount: this
    });
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
LengthUnit.prototype.convert = function(to) {
	if (!to || typeof(LengthUnit.ratios[this.normalizeUnits(to)]) === 'undefined') {
		return undefined;
	}
	return new LengthUnit({
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
LengthUnit.prototype.scale = function(measurementsystem) {
    var mSystem;    
    if (measurementsystem === "metric" || (typeof(measurementsystem) === 'undefined' 
            && typeof(LengthUnit.metricSystem[this.unit]) !== 'undefined')) {
        mSystem = LengthUnit.metricSystem;
    } else if (measurementsystem === "imperial" || (typeof(measurementsystem) === 'undefined' 
            && typeof(LengthUnit.imperialSystem[this.unit]) !== 'undefined')) {
        mSystem = LengthUnit.imperialSystem;
    } else if (measurementsystem === "uscustomary" || (typeof(measurementsystem) === 'undefined' 
            && typeof(LengthUnit.uscustomarySystem[this.unit]) !== 'undefined')) {
        mSystem = LengthUnit.uscustomarySystem;
    } else {
        return new LengthUnit({
			unit: this.unit,
			amount: this.amount
		});
    }    
    
    var length = this.amount;
    var munit = this.unit;
    var fromRow = LengthUnit.ratios[this.unit];
    
    length = 18446744073709551999;
    for (var m in mSystem) {
    	var tmp = this.amount * fromRow[mSystem[m]];
        if (tmp >= 1 && tmp < length) {
	        length = tmp;
	        munit = m;
        }
    }
    
    return new LengthUnit({
		unit: munit,
		amount: length
    });
};

LengthUnit.aliases = {
	"miles": "mile",
	"mile":"mile",
	"nauticalmiles": "nauticalmile",
	"nautical mile": "nauticalmile",
	"nautical miles": "nauticalmile",
	"nauticalmile":"nauticalmile",
	"yards": "yard",
	"yard": "yard",
	"feet": "foot",
	"foot": "foot",
	"inches": "inch",
	"inch": "inch",
	"meters": "meter",
	"metre": "meter",
	"metres": "meter",
	"m": "meter",
	"meter": "meter",        
	"micrometers": "micrometer",
	"micrometres": "micrometer",
	"micrometre": "micrometer",
	"µm": "micrometer",
	"micrometer": "micrometer",
	"millimeters": "millimeter",
	"millimetres": "millimeter",
	"millimetre": "millimeter",
	"mm": "millimeter",
	"millimeter": "millimeter",
	"centimeters": "centimeter",
	"centimetres": "centimeter",
	"centimetre": "centimeter",
	"cm": "centimeter",
	"centimeter": "centimeter",
	"decimeters": "decimeter",
	"decimetres": "decimeter",
	"decimetre": "decimeter",
	"dm": "decimeter",
	"decimeter": "decimeter",
	"decameters": "decameter",
	"decametres": "decameter",
	"decametre": "decameter",
	"dam": "decameter",
	"decameter": "decameter",
	"hectometers": "hectometer",
	"hectometres": "hectometer",
	"hectometre": "hectometer",
	"hm": "hectometer",
	"hectometer": "hectometer",
	"kilometers": "kilometer",
	"kilometres": "kilometer",
	"kilometre": "kilometer",
	"km": "kilometer",
	"kilometer": "kilometer",
	"megameters": "megameter",
	"megametres": "megameter",
	"megametre": "megameter",
	"Mm": "megameter",
	"megameter": "megameter",
	"gigameters": "gigameter",
	"gigametres": "gigameter",
	"gigametre": "gigameter",
	"Gm": "gigameter",
	"gigameter": "gigameter"
};

/**
 * Convert a length to another measure.
 * @static
 * @param to {string} unit to convert to
 * @param from {string} unit to convert from
 * @param length {number} amount to be convert
 * @returns {number|undefined} the converted amount
 */
LengthUnit.convert = function(to, from, length) {
    from = LengthUnit.aliases[from] || from;
    to = LengthUnit.aliases[to] || to;
	var fromRow = LengthUnit.ratios[from];
	var toRow = LengthUnit.ratios[to];
	if (typeof(from) === 'undefined' || typeof(to) === 'undefined') {
		return undefined;
	}
	return length * fromRow[toRow[0]];
};

/**
 * @private
 * @static
 */
LengthUnit.getMeasures = function () {
	var ret = [];
	for (var m in LengthUnit.ratios) {
		ret.push(m);
	}
	return ret;
};

//register with the factory method
Measurement._constructors["length"] = LengthUnit;

module.exports = LengthUnit;