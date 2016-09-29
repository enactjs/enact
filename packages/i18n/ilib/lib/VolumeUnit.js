/*
 * volume.js - Unit conversions for volume
 * 
 * Copyright © 2014-2015, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
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
 * Create a new Volume measurement instance.
 * 
 * @constructor
 * @extends Measurement
 * @param options {{unit:string,amount:number|string|undefined}} Options controlling 
 * the construction of this instance
 */
var VolumeUnit = function (options) {
	this.unit = "cubic meter";
	this.amount = 0;
	this.aliases = VolumeUnit.aliases; // share this table in all instances
	
	if (options) {
		if (typeof(options.unit) !== 'undefined') {
			this.originalUnit = options.unit;
			this.unit = this.aliases[options.unit] || options.unit;
		}
		
		if (typeof(options.amount) === 'object') {
			if (options.amount.getMeasure() === "volume") {
				this.amount = VolumeUnit.convert(this.unit, options.amount.getUnit(), options.amount.getAmount());
			} else {
				throw "Cannot convert unit " + options.amount.unit + " to a volume";
			}
		} else if (typeof(options.amount) !== 'undefined') {
			this.amount = parseFloat(options.amount);
		}
	}
	
	if (typeof(VolumeUnit.ratios[this.unit]) === 'undefined') {
		throw "Unknown unit: " + options.unit;
	}
};

VolumeUnit.prototype = new Measurement();
VolumeUnit.prototype.parent = Measurement;
VolumeUnit.prototype.constructor = VolumeUnit;

VolumeUnit.ratios = {
    /*                 index, tsp,      tbsp,          cubic inch  us ounce, cup,        pint,       quart,      gallon,      cubic foot,  milliliter  liter,      cubic meter, imperial tsp,  imperial tbsp, imperial ounce,  imperial pint,  imperial quart, imperial gal, */
    "tsp" :            [1,    1,        0.333333,      0.300781,   0.166667, 0.0208333,  0.0104167,  0.00520833, 0.00130208,  0.000174063, 4.92892,    0.00492892, 4.9289e-6,   0.832674,      0.277558,      0.173474,        0.00867369,     0.00433684,     0.00108421          ],
    "tbsp":            [2,    3,        1,             0.902344,   0.5,      0.0625,     0.0312,     0.015625,   0.00390625,  0.00052219,  14.7868,    0.0147868,  1.4787e-5,   2.49802,       0.832674,      0.520421,        0.0260211,      0.0130105,      0.00325263          ],
    "cubic inch":      [3,    3.32468,  1.10823,       1,          0.554113, 0.0692641,  0.034632,   0.017316,   0.004329,    0.000578704, 16.3871,    0.0163871,  1.6387e-5,   2.76837,       0.92279,       0.576744,        0.0288372,      0.0144186,      0.00360465          ],
    "us ounce":        [4,    6,        2,             1.80469,    1,        0.125,      0.0625,     0.0078125,  0.0078125,   0.00104438,  29.5735,    0.0295735,  2.9574e-5,   4.99604,       1.04084,       1.04084,         0.0520421,      0.0260211,      0.00650526          ],
    "cup":             [5,    48,       16,            14.4375,    8,        1,          0.5,        0.25,       0.0625,      0.00835503,  236.588,    0.236588,   0.000236588, 39.9683,       13.3228,       8.32674,         0.416337,       0.208168,       0.0520421           ],
    "pint":            [6,    96,       32,            28.875,     16,       2,          1,          0.5,        0.125,       0.0167101,   473.176,    0.473176,   0.000473176, 79.9367,       26.6456,       16.6535,         0.832674,       0.416337,       0.104084            ],
    "quart":           [7,    192,      64,            57.75,      32,       4,          2,          1,          0.25,        0.0334201,   946.353,    0.946353,   0.000946353, 159.873,       53.2911,       33.307,          1.66535,        0.832674,       0.208168            ],
    "gallon":          [8,    768,      256,           231,        128,      16,         8,          4,          1,           0.133681,    3785.41,    3.78541,    0.00378541,  639.494,       213.165,       133.228,         6.66139,        3.3307,         0.832674            ],
    "cubic foot":      [9,    5745.04,  1915.01,       1728,       957.506,  119.688,    59.8442,    29.9221,    7.48052,     1,           28316.8,    28.3168,    0.0283168,   4783.74,       1594.58,       996.613,         49.8307,        24.9153,        6.22883             ],
    "milliliter":      [10,   0.202884, 0.067628,      0.0610237,  0.033814, 0.00422675, 0.00211338, 0.00105669, 0.000264172, 3.5315e-5,   1,          0.001,      1e-6,        0.168936,      0.0563121,     0.0351951,       0.00175975,     0.000879877,    0.000219969         ],
    "liter":           [11,   202.884,  67.628,        61.0237,    33.814,   4.22675,    2.11338,    1.05669,    0.264172,    0.0353147,   1000,       1,          0.001,       56.3121,       56.3121,       35.191,          1.75975,        0.879877,       0.219969            ],
    "cubic meter":     [12,   202884,   67628,         61023.7,    33814,    4226.75,    2113.38,    1056.69,    264.172,     35.3147,     1e+6,       1000,       1,           168936,        56312.1,       35195.1,         1759.75,        879.877,        219.969             ],
    "imperial tsp":    [13,   1.20095,  0.200158,      0.361223,   0.600475, 0.0250198,  0.0125099,  0.00625495, 0.00156374,  0.000209041, 5.91939,    0.00591939, 5.9194e-6,   1,             0.333333,      0.208333,        0.0104167,      0.00520833,     0.00130208          ],
    "imperial tbsp":   [14,   3.60285,  1.20095,       1.08367,    0.600475, 0.0750594,  0.0375297,  0.0187649,  0.00469121,  0.000627124, 17.7582,    0.0177582,  1.7758e-5,   3,             1,             0.625,           0.03125,        0.015625,       0.00390625          ],
    "imperial ounce":  [15,   5.76456,  1.92152,       1.73387,    0.96076,  0.120095,   0.0600475,  0.0300238,  0.00750594,  0.0010034,   28.4131,    0.0284131,  2.8413e-5,   4.8,           1.6,           1,               0.05,           0.025,          0.00625             ],
    "imperial pint":   [16,   115.291,  38.4304,       34.6774,    19.2152,  2.4019,     1.20095,    0.600475,   0.150119,    0.020068,    568.261,    0.568261,   0.000568261, 96,            32,            20,              1,              0.5,            0.125               ],
    "imperial quart":  [17,   230.582,  76.8608,       69.3549,    38.4304,  4.8038,     2.4019,     1.20095,    0.300238,    0.0401359,   1136.52,    1.13652,    0.00113652,  192,           64,            40,              2,              1,              0.25                ],
    "imperial gallon": [18,   922.33,   307.443,       277.42,     153.722,  19.2152,    9.6076,     4.8038,     1.20095,     0.160544,    4546.09,    4.54609,    0.00454609,  768,           256,           160,             8,              4,              1                   ]
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
VolumeUnit.prototype.getMeasure = function() {
	return "volume";
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
VolumeUnit.prototype.convert = function(to) {
	if (!to || typeof(VolumeUnit.ratios[this.normalizeUnits(to)]) === 'undefined') {
		return undefined;
	}
	return new VolumeUnit({
		unit: to,
		amount: this
	});
};

VolumeUnit.aliases = {
    "US gal": "gallon",
    "US gallon": "gallon",
    "US Gal": "gallon",
    "US Gallons": "gallon",
    "Gal(US)": "gallon",
    "gal(US)": "gallon",
    "gallon": "gallon",
    "quart": "quart",
    "US quart": "quart",
    "US quarts": "quart",
    "US Quart": "quart",
    "US Quarts": "quart",
    "US qt": "quart",
    "Qt(US)": "quart",
    "qt(US)": "quart",
    "US pint": "pint",
    "US Pint": "pint",
    "pint": "pint",
    "pint(US)": "pint",
    "Pint(US)": "pint",
    "US cup": "cup",
    "US Cup": "cup",
    "cup(US)": "cup",
    "Cup(US)": "cup",
    "cup": "cup",
    "us ounce": "us ounce",
    "US ounce": "us ounce",
    "℥": "us ounce",
    "US Oz": "us ounce",
    "oz(US)": "us ounce",
    "Oz(US)": "us ounce",
    "US tbsp": "tbsp",
    "tbsp": "tbsp",
    "tbsp(US)": "tbsp",
    "US tablespoon": "tbsp",
    "US tsp": "tsp",
    "tsp(US)": "tsp",
    "tsp": "tsp",
    "Cubic meter": "cubic meter",
    "cubic meter": "cubic meter",
    "Cubic metre": "cubic meter",
    "cubic metre": "cubic meter",
    "m3": "cubic meter",
    "Liter": "liter",
    "Liters": "liter",
    "liter": "liter",
    "L": "liter",
    "l": "liter",
    "Milliliter": "milliliter",
    "ML": "milliliter",
    "ml": "milliliter",
    "milliliter": "milliliter",
    "mL": "milliliter",
    "Imperial gal": "imperial gallon",
    "imperial gallon": "imperial gallon",
    "Imperial gallon": "imperial gallon",
    "gallon(imperial)": "imperial gallon",
    "gal(imperial)": "imperial gallon",
    "Imperial quart": "imperial quart",
    "imperial quart": "imperial quart",
    "Imperial Quart": "imperial quart",
    "IMperial qt": "imperial quart",
    "qt(Imperial)": "imperial quart",
    "quart(imperial)": "imperial quart",
    "Imperial pint": "imperial pint",
    "imperial pint": "imperial pint",
    "pint(Imperial)": "imperial pint",
    "imperial oz": "imperial ounce",
    "imperial ounce": "imperial ounce",
    "Imperial Ounce": "imperial ounce",
    "Imperial tbsp": "imperial tbsp",
    "imperial tbsp": "imperial tbsp",
    "tbsp(Imperial)": "imperial tbsp",
    "Imperial tsp": "imperial tsp",
    "imperial tsp": "imperial tsp",
    "tsp(Imperial)": "imperial tsp",
    "Cubic foot": "cubic foot",
    "cubic foot": "cubic foot",
    "Cubic Foot": "cubic foot",
    "Cubic feet": "cubic foot",
    "cubic Feet": "cubic foot",
    "cubic ft": "cubic foot",
    "ft3": "cubic foot",
    "Cubic inch": "cubic inch",
    "Cubic inches": "cubic inch",
    "cubic inches": "cubic inch",
    "cubic inch": "cubic inch",
    "cubic in": "cubic inch",
    "cu in": "cubic inch",
    "cu inch": "cubic inch",
    "inch³": "cubic inch",
    "in³": "cubic inch",
    "inch^3": "cubic inch",
    "in^3": "cubic inch",
    "c.i": "cubic inch",
    "CI": "cubic inch",
    "cui": "cubic inch"
};

/**
 * Convert a volume to another measure.
 * @static
 * @param to {string} unit to convert to
 * @param from {string} unit to convert from
 * @param volume {number} amount to be convert
 * @returns {number|undefined} the converted amount
 */
VolumeUnit.convert = function(to, from, volume) {
    from = VolumeUnit.aliases[from] || from;
    to = VolumeUnit.aliases[to] || to;
	var fromRow = VolumeUnit.ratios[from];
	var toRow = VolumeUnit.ratios[to];
	if (typeof(from) === 'undefined' || typeof(to) === 'undefined') {
		return undefined;
	}	
	var result = volume * fromRow[toRow[0]];
    return result;
};

/**
 * @private
 * @static
 */
VolumeUnit.getMeasures = function () {
	var ret = [];
	for (var m in VolumeUnit.ratios) {
		ret.push(m);
	}
	return ret;
};
VolumeUnit.metricSystem = {
    "milliliter": 10,
    "liter": 11,
    "cubic meter": 12
};
VolumeUnit.imperialSystem = {
    "imperial tsp": 13,
    "imperial tbsp": 14,
    "imperial ounce": 15,
    "imperial pint": 16,
    "imperial quart": 17,
    "imperial gallon": 18
};
VolumeUnit.uscustomarySystem = {
    "tsp": 1,
    "tbsp": 2,
    "cubic inch": 3,
    "us ounce": 4,
    "cup": 5,
    "pint": 6,
    "quart": 7,
    "gallon": 8,
    "cubic foot": 9
};

VolumeUnit.metricToUScustomary = {
    "milliliter": "tsp",
    "liter": "quart",
    "cubic meter": "cubic foot"
};
VolumeUnit.metricToImperial = {
    "milliliter": "imperial tsp",
    "liter": "imperial quart",
    "cubic meter": "imperial gallon"
};

VolumeUnit.imperialToMetric = {
    "imperial tsp": "milliliter",
    "imperial tbsp": "milliliter",
    "imperial ounce": "milliliter",
    "imperial pint": "liter",
    "imperial quart": "liter",
    "imperial gallon": "cubic meter"
};
VolumeUnit.imperialToUScustomary = {
    "imperial tsp": "tsp",
    "imperial tbsp": "tbsp",
    "imperial ounce": "us ounce",
    "imperial pint": "pint",
    "imperial quart": "quart",
    "imperial gallon": "gallon"
};

VolumeUnit.uScustomaryToImperial = {
    "tsp": "imperial tsp",
    "tbsp": "imperial tbsp",
    "cubic inch": "imperial tbsp",
    "us ounce": "imperial ounce",
    "cup": "imperial ounce",
    "pint": "imperial pint",
    "quart": "imperial quart",
    "gallon": "imperial gallon",
    "cubic foot": "imperial gallon"
};
VolumeUnit.uScustomarylToMetric = {
    "tsp": "milliliter",
    "tbsp": "milliliter",
    "cubic inch": "milliliter",
    "us ounce": "milliliter",
    "cup": "milliliter",
    "pint": "liter",
    "quart": "liter",
    "gallon": "cubic meter",
    "cubic foot": "cubic meter"
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
VolumeUnit.prototype.localize = function(locale) {
	var to;
	if (locale === "en-US") {
		to = VolumeUnit.metricToUScustomary[this.unit] ||
		    VolumeUnit.imperialToUScustomary[this.unit] ||
		    this.unit;
	} else if (locale === "en-GB") {
		to = VolumeUnit.metricToImperial[this.unit] ||
		    VolumeUnit.uScustomaryToImperial[this.unit] ||
		    this.unit;
	} else {
		to = VolumeUnit.uScustomarylToMetric[this.unit] ||
		    VolumeUnit.imperialToUScustomary[this.unit] ||
		    this.unit;
	}
	return new VolumeUnit({
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
VolumeUnit.prototype.scale = function(measurementsystem) {
    var fromRow = VolumeUnit.ratios[this.unit];
    var mSystem;

    if (measurementsystem === "metric"|| (typeof(measurementsystem) === 'undefined'
        && typeof(VolumeUnit.metricSystem[this.unit]) !== 'undefined')) {
        mSystem = VolumeUnit.metricSystem;
    } else if (measurementsystem === "uscustomary" || (typeof(measurementsystem) === 'undefined'
        && typeof(VolumeUnit.uscustomarySystem[this.unit]) !== 'undefined')) {
        mSystem = VolumeUnit.uscustomarySystem;
    } else if (measurementsystem === "imperial"|| (typeof(measurementsystem) === 'undefined'
        && typeof(VolumeUnit.imperialSystem[this.unit]) !== 'undefined')) {
        mSystem = VolumeUnit.imperialSystem;
    }

    var volume = this.amount;
    var munit = this.unit;

    volume = 18446744073709551999;
    
    for (var m in mSystem) {
    	var tmp = this.amount * fromRow[mSystem[m]];
        if (tmp >= 1 && tmp < volume) {
        	volume = tmp;
	        munit = m;
        }
    }
    
    return new VolumeUnit({
        unit: munit,
        amount: volume
    });
};

//register with the factory method
Measurement._constructors["volume"] = VolumeUnit;

module.exports = VolumeUnit;
