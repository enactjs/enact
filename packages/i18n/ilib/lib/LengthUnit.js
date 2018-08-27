/*
 * LengthUnit.js - Unit conversions for length measurements
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

    this.ratios = LengthUnit.ratios;
    this.aliases = LengthUnit.aliases;
    this.aliasesLower = LengthUnit.aliasesLower;
    this.systems = LengthUnit.systems;

    this.parent(options);
};

LengthUnit.prototype = new Measurement();
LengthUnit.prototype.parent = Measurement;
LengthUnit.prototype.constructor = LengthUnit;

LengthUnit.ratios = {
    /*               index, µm           mm           cm           inch         dm           foot          yard          m             dam            hm              km              mile            nm            Mm             Gm             */
    "micrometer":    [ 1,   1,           1e-3,        1e-4,        3.93701e-5,  1e-5,        3.28084e-6,   1.09361e-6,   1e-6,         1e-7,          1e-8,           1e-9,           6.21373e-10,  5.39957e-10,  1e-12,          1e-15           ],
    "millimeter":    [ 2,   1000,        1,           0.1,         0.0393701,   0.01,        0.00328084,   1.09361e-3,   0.001,        1e-4,          1e-5,           1e-6,           6.21373e-7,   5.39957e-7,   1e-9,           1e-12           ],
    "centimeter":    [ 3,   1e4,         10,          1,           0.393701,    0.1,         0.0328084,    0.0109361,    0.01,         0.001,         1e-4,           1e-5,           6.21373e-6,   5.39957e-6,   1e-8,           1e-9            ],
    "inch":          [ 4,   25399.986,   25.399986,   2.5399986,   1,           0.25399986,  0.083333333,  0.027777778,  0.025399986,  2.5399986e-3,  2.5399986e-4,   2.5399986e-5,   1.5783e-5,    1.3715e-5,    2.5399986e-8,   2.5399986e-11   ],
    "decimeter":     [ 5,   1e5,         100,         10,          3.93701,     1,           0.328084,     0.109361,     0.1,          0.01,          0.001,          1e-4,           6.21373e-5,   5.39957e-5,   1e-7,           1e-8            ],
    "foot":          [ 6,   304799.99,   304.79999,   30.479999,   12,          3.0479999,   1,            0.33333333,   0.30479999,   0.030479999,   3.0479999e-3,   3.0479999e-4,   1.89394e-4,   1.64579e-4,   3.0479999e-7,   3.0479999e-10   ],
    "yard":          [ 7,   914402.758,  914.402758,  91.4402758,  36,          9.14402758,  3,            1,            0.914402758,  0.0914402758,  9.14402758e-3,  9.14402758e-4,  5.68182e-4,   4.93737e-4,   9.14402758e-7,  9.14402758e-10  ],
    "meter":         [ 8,   1e6,         1000,        100,         39.3701,     10,          3.28084,      1.09361,      1,            0.1,           0.01,           0.001,          6.213712e-4,  5.39957e-4,   1e-6,           1e-7            ],
    "decameter":     [ 9,   1e7,         1e4,         1000,        393.701,     100,         32.8084,      10.9361,      10,           1,             0.1,            0.01,           6.21373e-3,   5.39957e-3,   1e-5,           1e-6            ],
    "hectometer":    [ 10,  1e8,         1e5,         1e4,         3937.01,     1000,        328.084,      109.361,      100,          10,            1,              0.1,            0.0621373,    0.0539957,    1e-4,           1e-5            ],
    "kilometer":     [ 11,  1e9,         1e6,         1e5,         39370.1,     1e4,         3280.84,      1093.61,      1000,         100,           10,             1,              0.621373,     0.539957,     0.001,          1e-4            ],
    "mile":          [ 12,  1.60934e9,   1.60934e6,   1.60934e5,   63360,       1.60934e4,   5280,         1760,         1609.34,      160.934,       16.0934,        1.60934,        1,            0.868976,     1.60934e-3,     1.60934e-6      ],
    "nautical-mile": [ 13,  1.852e9,     1.852e6,     1.852e5,     72913.4,     1.852e4,     6076.12,      2025.37,      1852,         185.2,         18.52,          1.852,          1.15078,      1,            1.852e-3,       1.852e-6        ],
    "megameter":     [ 14,  1e12,        1e9,         1e6,         3.93701e7,   1e5,         3.28084e6,    1.09361e6,    1e4,          1000,          100,            10,             621.373,      539.957,      1,              0.001           ],
    "gigameter":     [ 15,  1e15,        1e12,        1e9,         3.93701e10,  1e8,         3.28084e9,    1.09361e9,    1e7,          1e6,           1e5,            1e4,            621373.0,     539957.0,     1000,           1               ]
};

/**
 * Return a new instance of this type of measurement.
 *
 * @param {Object} params parameters to the constructor
 * @return {Measurement} a measurement subclass instance
 */
LengthUnit.prototype.newUnit = function(params) {
    return new LengthUnit(params);
};

LengthUnit.systems = {
    "metric": [
        "micrometer",
        "millimeter",
        "centimeter",
        "decimeter",
        "meter",
        "decameter",
        "hectometer",
        "kilometer",
        "megameter",
        "gigameter"
    ],
    "imperial": [
        "inch",
        "foot",
        "yard",
        "mile",
        "nautical-mile"
    ],
    "uscustomary": [
        "inch",
        "foot",
        "yard",
        "mile",
        "nautical-mile"
    ],
    "conversions": {
        "metric": {
            "uscustomary": {
                "micrometer": "inch",
                "millimeter": "inch",
                "centimeter": "inch",
                "decimeter": "inch",
                "meter": "yard",
                "decameter": "yard",
                "hectometer": "mile",
                "kilometer": "mile",
                "megameter": "mile",
                "gigameter": "mile"
            },
            "imperial": {
                "micrometer": "inch",
                "millimeter": "inch",
                "centimeter": "inch",
                "decimeter": "inch",
                "meter": "yard",
                "decameter": "yard",
                "hectometer": "mile",
                "kilometer": "mile",
                "megameter": "mile",
                "gigameter": "mile"
            }
        },
        "uscustomary": {
            "metric": {
                "inch": "centimeter",
                "foot": "centimeter",
                "yard": "meter",
                "mile": "kilometer",
                "nautical-mile": "kilometer"
            }
        },
        "imperial": {
            "metric": {
                "inch": "centimeter",
                "foot": "centimeter",
                "yard": "meter",
                "mile": "kilometer",
                "nautical-mile": "kilometer"
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
 * @returns {string} the name of the type of this measurement
 */
LengthUnit.prototype.getMeasure = function() {
    return "length";
};

LengthUnit.aliases = {
    "miles": "mile",
    "mile":"mile",
    "nauticalmiles": "nautical-mile",
    "nautical mile": "nautical-mile",
    "nautical miles": "nautical-mile",
    "nauticalmile":"nautical-mile",
    "yards": "yard",
    "yard": "yard",
    "feet": "foot",
    "foot": "foot",
    "inches": "inch",
    "inch": "inch",
    "in": "inch",
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

(function() {
    LengthUnit.aliasesLower = {};
    for (var a in LengthUnit.aliases) {
        LengthUnit.aliasesLower[a.toLowerCase()] = LengthUnit.aliases[a];
    }
})();

/**
 * Convert a length to another measure.
 * @static
 * @param to {string} unit to convert to
 * @param from {string} unit to convert from
 * @param length {number} amount to be convert
 * @returns {number|undefined} the converted amount
 */
LengthUnit.convert = function(to, from, length) {
    from = Measurement.getUnitIdCaseInsensitive(LengthUnit, from) || from;
    to = Measurement.getUnitIdCaseInsensitive(LengthUnit, to) || to;
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
    return Object.keys(LengthUnit.ratios);
};

//register with the factory method
Measurement._constructors["length"] = LengthUnit;

module.exports = LengthUnit;