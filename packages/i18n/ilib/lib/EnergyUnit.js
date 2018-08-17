/*
 * EnergyUnit.js - Unit conversions for energy measurements
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
 * Create a new energy measurement instance.
 *
 * @constructor
 * @extends Measurement
 * @param options {{unit:string,amount:number|string|undefined}} Options controlling
 * the construction of this instance
 */
var EnergyUnit = function (options) {
    this.unit = "joule";
    this.amount = 0;

    this.ratios = EnergyUnit.ratios;
    this.aliases = EnergyUnit.aliases;
    this.aliasesLower = EnergyUnit.aliasesLower;
    this.systems = EnergyUnit.systems;

    this.parent(options);
};

EnergyUnit.prototype = new Measurement();
EnergyUnit.prototype.parent = Measurement;
EnergyUnit.prototype.constructor = EnergyUnit;

EnergyUnit.ratios = {
   /*                index mJ          J           BTU               kJ          Wh                Cal               MJ             kWh                gJ             MWh                 GWh         */
    "millijoule":   [ 1,   1,          0.001,      9.4781707775e-7,  1e-6,       2.7777777778e-7,  2.3884589663e-7,  1.0e-9,        2.7777777778e-10,  1.0e-12,       2.7777777778e-13,   2.7777777778e-16  ],
    "joule":        [ 2,   1000,       1,          9.4781707775e-4,  0.001,      2.7777777778e-4,  2.3884589663e-4,  1.0e-6,        2.7777777778e-7,   1.0e-9,        2.7777777778e-10,   2.7777777778e-13  ],
    "BTU":          [ 3,   1055055.9,  1055.0559,  1,                1.0550559,  0.29307108333,    0.25199577243,    1.0550559e-3,  2.9307108333e-4,   1.0550559e-6,  2.9307108333e-7,    2.9307108333e-10  ],
    "kilojoule":    [ 4,   1000000,    1000,       0.94781707775,    1,          0.27777777778,    0.23884589663,    0.001,         2.7777777778e-4,   1.0e-6,        2.7777777778e-7,    2.7777777778e-10  ],
    "watt-hour":    [ 5,   3.6e+6,     3600,       3.4121414799,     3.6,        1,                0.85984522786,    0.0036,        0.001,             3.6e-6,        1.0e-6,             1.0e-9            ],
    "foodcalorie":  [ 6,   4.868e+5,   4186.8,     3.9683205411,     4.1868,     1.163,            1,                4.1868e-3,     1.163e-3,          4.1868e-6,     1.163e-6,           1.163e-9          ],
    "megajoule":    [ 7,   1e+9,       1e+6,       947.81707775,     1000,       277.77777778,     238.84589663,     1,             0.27777777778,     0.001,         2.7777777778e-4,    2.7777777778e-7   ],
    "kilowatt-hour":[ 8,   3.6e+9,     3.6e+6,     3412.1414799,     3600,       1000,             859.84522786,     3.6,           1,                 3.6e-3,        0.001,              1e-6              ],
    "gigajoule":    [ 9,   1e+12,      1e+9,       947817.07775,     1e+6,       277777.77778,     238845.89663,     1000,          277.77777778,      1,             0.27777777778,      2.7777777778e-4   ],
    "megawatt-hour":[ 10,  3.6e+12,    3.6e+9,     3412141.4799,     3.6e+6,     1e+6,             859845.22786,     3600,          1000,              3.6,           1,                  0.001             ],
    "gigawatt-hour":[ 11,  3.6e+15,    3.6e+12,    3412141479.9,     3.6e+9,     1e+9,             859845227.86,     3.6e+6,        1e+6,              3600,          1000,               1                 ]
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
EnergyUnit.prototype.getMeasure = function() {
	return "energy";
};

/**
 * Return a new instance of this type of measurement.
 *  
 * @param {Object} params parameters to the constructor
 * @return {Measurement} a measurement subclass instance
 */
EnergyUnit.prototype.newUnit = function(params) {
    return new EnergyUnit(params);
};

EnergyUnit.aliases = {
    "milli joule": "millijoule",
    "millijoule": "millijoule",
    "milliJ": "millijoule",
    "mJ": "millijoule",
    "joule": "joule",
    "joules": "joule",
    "J": "joule",
    "BTU": "BTU",
    "British Thermal Unit": "BTU",
    "British Thermal Units": "BTU",
    "kilo joule": "kilojoule",
    "kilojoule": "kilojoule",
    "kilojoules": "kilojoule",
    "kjoule": "kilojoule",
    "kJ": "kilojoule",
    "watt hour": "watt-hour",
    "watt hours": "watt-hour",
    "Wh": "watt-hour",
    "food calorie": "foodcalorie",
    "food calories": "foodcalorie",
    "calorie": "foodcalorie",
    "calories": "foodcalorie",
    "Cal": "foodcalorie",
    "mega joule": "megajoule",
    "mega joules": "megajoule",
    "megajoule": "megajoule",
    "megajoules": "megajoule",
    "MJ": "megajoule",
    "kilo watt hour": "kilowatt-hour",
    "kilo watt hours": "kilowatt-hour",
    "kiloWh": "kilowatt-hour",
    "kilowatt hour": "kilowatt-hour",
    "kilowatt hours": "kilowatt-hour",
    "kilowatt-hour": "kilowatt-hour",
    "kilowatt-hours": "kilowatt-hour",
    "kilowatthour": "kilowatt-hour",
    "kilowatthours": "kilowatt-hour",
    "kW hour": "kilowatt-hour",
    "kW hours": "kilowatt-hour",
    "kW-hour": "kilowatt-hour",
    "kW-hours": "kilowatt-hour",
    "kiloWh": "kilowatt-hour",
    "kWh": "kilowatt-hour",
    "giga joule": "gigajoule",
    "Gj": "gigajoule",
    "gigajoule": "gigajoule",
    "gigajoules": "gigajoule",
    "mega watt hour": "megawatt-hour",
    "mega watt hours": "megawatt-hour",
    "megawatt hour": "megawatt-hour",
    "megawatt hours": "megawatt-hour",
    "megawatt-hour": "megawatt-hour",
    "megawatt-hours": "megawatt-hour",
    "MW hour": "megawatt-hour",
    "MW hours": "megawatt-hour",
    "MW-hour": "megawatt-hour",
    "MW-hours": "megawatt-hour",
    "megaWh": "megawatt-hour",
    "MWh": "megawatt-hour",
    "giga watt hour": "gigawatt-hour",
    "giga watt hour": "gigawatt-hour",
    "giga watt hours": "gigawatt-hour",
    "gigawatt hour": "gigawatt-hour",
    "gigawatt hours": "gigawatt-hour",
    "gigawatt-hours": "gigawatt-hour",
    "gigawatthour": "gigawatt-hour",
    "GW hour": "gigawatt-hour",
    "GW hours": "gigawatt-hour",
    "GW-hour": "gigawatt-hour",
    "GW-hours": "gigawatt-hour",
    "gigaWh": "gigawatt-hour",
    "GWh": "gigawatt-hour"
};

(function() {
    EnergyUnit.aliasesLower = {};
    for (var a in EnergyUnit.aliases) {
        EnergyUnit.aliasesLower[a.toLowerCase()] = EnergyUnit.aliases[a];
    }
})();

/**
 * Convert a energy to another measure.
 * @static
 * @param to {string} unit to convert to
 * @param from {string} unit to convert from
 * @param energy {number} amount to be convert
 * @returns {number|undefined} the converted amount
 */
EnergyUnit.convert = function(to, from, energy) {
    from = Measurement.getUnitIdCaseInsensitive(EnergyUnit, from) || from;
    to = Measurement.getUnitIdCaseInsensitive(EnergyUnit, to) || to;
    var fromRow = EnergyUnit.ratios[from];
    var toRow = EnergyUnit.ratios[to];
    if (typeof(from) === 'undefined' || typeof(to) === 'undefined') {
        return undefined;
    }
    return energy * fromRow[toRow[0]];
};

EnergyUnit.systems = {
    "metric": [
        "millijoule",
        "joule",
        "kilojoule",
        "watt-hour",
        "megajoule",
        "kilowatt-hour",
        "gigajoule",
        "megawatt-hour",
        "gigawatt-hour"
    ],
    "imperial": [
        "BTU",
        "foodcalorie"
    ],
    "uscustomary": [
        "BTU",
        "foodcalorie"
    ],
    "conversions": {
        "metric": {
            "uscustomary": {
                "millijoule": "BTU",
                "joule": "BTU",
                "kilojoule": "BTU",
                "watt-hour": "BTU",
                "megajoule": "BTU",
                "kilowatt-hour": "BTU",
                "gigajoule": "BTU",
                "megawatt-hour": "BTU",
                "gigawatt-hour": "BTU"
            },
            "imperial": {
                "millijoule": "BTU",
                "joule": "BTU",
                "kilojoule": "BTU",
                "watt-hour": "BTU",
                "megajoule": "BTU",
                "kilowatt-hour": "BTU",
                "gigajoule": "BTU",
                "megawatt-hour": "BTU",
                "gigawatt-hour": "BTU"
            }
        },
        "uscustomary": {
            "metric": {
                "BTU": "joule",
                "foodcalorie": "joule"
            }
        },
        "imperial": {
            "metric": {
                "BTU": "joule",
                "foodcalorie": "joule"
            }
        }
    }
};

/**
 * @private
 * @static
 */
EnergyUnit.getMeasures = function () {
    return Object.keys(EnergyUnit.ratios);
};

//register with the factory method
Measurement._constructors["energy"] = EnergyUnit;

module.exports = EnergyUnit;