/*
 * MassUnit.js - Unit conversions for weight/mass measurements
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
ilib.js
Measurement.js
*/

var ilib = require("./ilib.js");
var Measurement = require("./Measurement.js");

/**
 * @class
 * Create a new mass measurement instance.
 *
 * @constructor
 * @extends Measurement
 * @param options {{unit:string,amount:number|string|undefined}} Options controlling
 * the construction of this instance
 */
var MassUnit = function (options) {
	this.unit = "gram";
	this.amount = 0;

    this.ratios = MassUnit.ratios;
    this.aliases = MassUnit.aliases;
    this.aliasesLower = MassUnit.aliasesLower;
    this.systems = MassUnit.systems;

    this.parent(options);
};

MassUnit.prototype = new Measurement();
MassUnit.prototype.parent = Measurement;
MassUnit.prototype.constructor = MassUnit;

MassUnit.ratios = {
    /*             index  µg          mg         g          oz          lb           kg          st            sh ton       mt ton        ln ton      */
    "microgram":   [ 1,   1,          0.001,     1e-6,      3.5274e-8,  2.2046e-9,   1e-9,       1.5747e-10,   1.1023e-12,  1e-12,        9.8421e-13   ],
    "milligram":   [ 2,   1000,       1,         0.001,     3.5274e-5,  2.2046e-6,   1e-6,       1.5747e-7,    1.1023e-9,   1e-9,         9.8421e-10   ],
    "gram":        [ 3,   1e+6,       1000,      1,         0.035274,   0.00220462,  0.001,      0.000157473,  1.1023e-6,   1e-6,         9.8421e-7    ],
    "ounce":       [ 4,   2.835e+7,   28349.5,   28.3495,   1,          0.0625,      0.0283495,  0.00446429,   3.125e-5,    2.835e-5,     2.7902e-5    ],
    "pound":       [ 5,   4.536e+8,   453592,    453.592,   16,         1,           0.453592,   0.0714286,    0.0005,      0.000453592,  0.000446429  ],
    "kilogram":    [ 6,   1e+9,       1e+6,      1000,      35.274,     2.20462,     1,          0.157473,     0.00110231,  0.001,        0.000984207  ],
    "stone":       [ 7,   6.35e+9,    6.35e+6,   6350.29,   224,        14,          6.35029,    1,            0.007,       0.00635029,   0.00625      ],
    "short-ton":   [ 8,   9.072e+11,  9.072e+8,  907185,    32000,      2000,        907.185,    142.857,      1,           0.907185,     0.892857     ],
    "metric-ton":  [ 9,   1e+12,      1e+9,      1e+6,      35274,      2204.62,     1000,       157.473,      1.10231,     1,            0.984207     ],
    "long-ton":    [ 10,  1.016e+12,  1.016e+9,  1.016e+6,  35840,      2240,        1016.05,    160,          1.12,        1.01605,      1            ]
};

/**
 * Return a new instance of this type of measurement.
 *
 * @param {Object} params parameters to the constructor
 * @return {Measurement} a measurement subclass instance
 */
MassUnit.prototype.newUnit = function(params) {
    return new MassUnit(params);
};

MassUnit.systems = {
    "metric": [
        "microgram",
        "milligram",
        "gram",
        "kilogram",
        "metric-ton"
    ],
    "imperial": [
        "ounce",
        "pound",
        "stone",
        "long-ton"
    ],
    "uscustomary": [
        "ounce",
        "pound",
        "short-ton"
    ],
    "conversions": {
        "metric": {
            "uscustomary": {
                "microgram": "ounce",
                "milligram": "ounce",
                "gram": "ounce",
                "kilogram": "pound",
                "metric-ton": "short-ton"
            },
            "imperial": {
                "microgram": "ounce",
                "milligram": "ounce",
                "gram": "ounce",
                "kilogram": "pound",
                "metric-ton": "long-ton"
            }
        },
        "uscustomary": {
            "imperial": {
                "ounce": "ounce",
                "pound": "pound",
                "short-ton": "long-ton"
            },
            "metric": {
                "ounce": "gram",
                "pound": "kilogram",
                "short-ton": "metric-ton"
            }
        },
        "imperial": {
            "uscustomary": {
                "ounce": "ounce",
                "pound": "pound",
                "stone": "pound",
                "long-ton": "short-ton"
            },
            "metric": {
                "ounce": "gram",
                "pound": "kilogram",
                "stone": "kilogram",
                "long-ton": "metric-ton"
            }
        }
    }
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
MassUnit.prototype.getMeasure = function() {
	return "mass";
};

MassUnit.aliases = {
    "µg":"microgram",
    "microgram":"microgram",
    "mcg":"microgram",
    "milligram":"milligram",
    "mg":"milligram",
    "milligrams":"milligram",
    "Milligram":"milligram",
    "Milligrams":"milligram",
    "MilliGram":"milligram",
    "MilliGrams":"milligram",
    "g":"gram",
    "gram":"gram",
    "grams":"gram",
    "Gram":"gram",
    "Grams":"gram",
    "ounce":"ounce",
    "oz":"ounce",
    "Ounce":"ounce",
    "ounces":"ounce",
    "Ounces":"ounce",
    "℥":"ounce",
    "pound":"pound",
    "poundm":"pound",
    "℔":"pound",
    "lb":"pound",
    "lbs":"pound",
    "pounds":"pound",
    "Pound":"pound",
    "Pounds":"pound",
    "kilogram":"kilogram",
    "kg":"kilogram",
    "kilograms":"kilogram",
    "kilo grams":"kilogram",
    "kilo gram":"kilogram",
    "Kilogram":"kilogram",
    "Kilograms":"kilogram",
    "KiloGram":"kilogram",
    "KiloGrams":"kilogram",
    "Kilo gram":"kilogram",
    "Kilo grams":"kilogram",
    "Kilo Gram":"kilogram",
    "Kilo Grams":"kilogram",
    "stone":"stone",
    "st":"stone",
    "stones":"stone",
    "Stone":"stone",
    "metric ton":"metric-ton",
    "metricton":"metric-ton",
    "t":"metric-ton",
    "tonne":"metric-ton",
    "tonnes":"metric-ton",
    "Tonne":"metric-ton",
    "Metric Ton":"metric-ton",
    "MetricTon":"metric-ton",
    "long ton":"long-ton",
    "longton":"long-ton",
    "Longton":"long-ton",
    "Long ton":"long-ton",
    "Long Ton":"long-ton",
    "short ton":"short-ton",
    "short tons":"short-ton",
    "Short ton":"short-ton",
    "Short Ton":"short-ton",
    "ton":"short-ton",
    "tons":"short-ton",
    "Ton":"short-ton"
};

(function() {
    MassUnit.aliasesLower = {};
    for (var a in MassUnit.aliases) {
        MassUnit.aliasesLower[a.toLowerCase()] = MassUnit.aliases[a];
    }
})();

/**
 * Convert a mass to another measure.
 * @static
 * @param to {string} unit to convert to
 * @param from {string} unit to convert from
 * @param mass {number} amount to be convert
 * @returns {number|undefined} the converted amount
 */
MassUnit.convert = function(to, from, mass) {
    from = Measurement.getUnitIdCaseInsensitive(MassUnit, from) || from;
    to = Measurement.getUnitIdCaseInsensitive(MassUnit, to) || to;
    var fromRow = MassUnit.ratios[from];
    var toRow = MassUnit.ratios[to];
    if (typeof(from) === 'undefined' || typeof(to) === 'undefined') {
        return undefined;
    }
    return mass * fromRow[toRow[0]];
};

/**
 * @private
 * @static
 */
MassUnit.getMeasures = function () {
    return Object.keys(MassUnit.ratios);
};

//register with the factory method
Measurement._constructors["mass"] = MassUnit;

module.exports = MassUnit;