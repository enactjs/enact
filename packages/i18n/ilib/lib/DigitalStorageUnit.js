/*
 * DigitalStorageUnit.js - Unit conversions for Digital Storage
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
JSUtils.js
*/

var Measurement = require("./Measurement.js");
var JSUtils = require("./JSUtils.js");

/**
 * @class
 * Create a new DigitalStorage measurement instance.
 *
 * @constructor
 * @extends Measurement
 * @param options {{unit:string,amount:number|string|undefined}} Options controlling
 * the construction of this instance
 */
var DigitalStorageUnit = function (options) {
	this.unit = "byte";
	this.amount = 0;

    this.ratios = DigitalStorageUnit.ratios;
    this.aliases = DigitalStorageUnit.aliases;
    this.aliasesLower = DigitalStorageUnit.aliasesLower;
    this.systems = DigitalStorageUnit.systems;

    this.parent(options);
};

DigitalStorageUnit.prototype = new Measurement();
DigitalStorageUnit.prototype.parent = Measurement;
DigitalStorageUnit.prototype.constructor = DigitalStorageUnit;

DigitalStorageUnit.ratios = {
    /*            #    bit             byte            kb              kB              mb              mB              gb               gB               tb               tB               pb               pB   */
	"bit":      [ 1,   1,              0.125,          0.0009765625,   1.220703125e-4, 9.536743164e-7, 1.192092896e-7, 9.313225746e-10, 1.164153218e-10, 9.094947017e-13, 1.136868377e-13, 8.881784197e-16, 1.110223025e-16 ],
    "byte":     [ 2,   8,              1,              0.0078125,      0.0009765625,   7.629394531e-6, 9.536743164e-7, 7.450580597e-9,  9.313225746e-10, 7.275957614e-12, 9.094947017e-13, 7.105427358e-15, 8.881784197e-16 ],
    "kilobit":  [ 3,   1024,           128,            1,              0.125,          0.0009765625,   1.220703125e-4, 9.536743164e-7,  1.192092896e-7,  9.313225746e-10, 1.164153218e-10, 9.094947017e-13, 1.136868377e-13 ],
    "kilobyte": [ 4,   8192,           1024,           8,              1,              0.0078125,      0.0009765625,   7.629394531e-6,  9.536743164e-7,  7.450580597e-9,  9.313225746e-10, 7.275957614e-12, 9.094947017e-13 ],
    "megabit":  [ 5,   1048576,        131072,         1024,           128,            1,              0.125,          0.0009765625,    1.220703125e-4,  9.536743164e-7,  1.192092896e-7,  9.313225746e-10, 1.164153218e-10 ],
    "megabyte": [ 6,   8388608,        1048576,        8192,           1024,           8,              1,              0.0078125,       0.0009765625,    7.629394531e-6,  9.536743164e-7,  7.450580597e-9,  9.313225746e-10 ],
    "gigabit":  [ 7,   1073741824,     134217728,      1048576,        131072,         1024,           128,            1,               0.125,           0.0009765625,    1.220703125e-4,  9.536743164e-7,  1.192092896e-7  ],
    "gigabyte": [ 8,   8589934592,     1073741824,     8388608,        1048576,        8192,           1024,           8,               1,               0.0078125,       0.0009765625,    7.629394531e-6,  9.536743164e-7  ],
    "terabit":  [ 9,   1.099511628e12, 137438953472,   1073741824,     134217728,      1048576,        131072,         1024,            128,             1,               0.125,           0.0009765625,    1.220703125e-4  ],
    "terabyte": [ 10,  8.796093022e12, 1.099511628e12, 8589934592,     1073741824,     8388608,        1048576,        8192,            1024,            8,               1,               0.0078125,       0.0009765625    ],
    "petabit":  [ 11,  1.125899907e15, 1.407374884e14, 1.099511628e12, 137438953472,   1073741824,     134217728,      1048576,         131072,          1024,            128,             1,               0.125           ],
    "petabyte": [ 12,  9.007199255e15, 1.125899907e15, 8.796093022e12, 1.099511628e12, 8589934592,     1073741824,     8388608,         1048576,         8192,            1024,            8,               1               ]
};

/**
 * Return a new instance of this type of measurement.
 * 
 * @param {Object} params parameters to the constructor
 * @return {Measurement} a measurement subclass instance
 */
DigitalStorageUnit.prototype.newUnit = function(params) {
    return new DigitalStorageUnit(params);
};

DigitalStorageUnit.systems = {
    "metric": [],
    "uscustomary": [],
    "imperial": [],
    "conversions": {
        "metric": {},
        "uscustomary": {},
        "imperial": {}
    }
};

DigitalStorageUnit.bitSystem = [
    "bit",
    "kilobit",
    "megabit",
    "gigabit",
    "terabit",
    "petabit"
];
DigitalStorageUnit.byteSystem = [
    "byte",
    "kilobyte",
    "megabyte",
    "gigabyte",
    "terabyte",
    "petabyte"
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
DigitalStorageUnit.prototype.getMeasure = function() {
	return "digitalStorage";
};

/**
 * Localize the measurement to the commonly used measurement in that locale. For example
 * If a user's locale is "en-US" and the measurement is given as "60 kmh",
 * the formatted number should be automatically converted to the most appropriate
 * measure in the other system, in this case, mph. The formatted result should
 * appear as "37.3 mph".
 *
 * @param {string} locale current locale string
 * @returns {Measurement} a new instance that is converted to locale
 */
DigitalStorageUnit.prototype.localize = function(locale) {
    return new DigitalStorageUnit({
        unit: this.unit,
        amount: this.amount
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
 * @param {Object=} units mapping from the measurement system to the units to use
 * for this scaling. If this is not defined, this measurement type will use the
 * set of units that it knows about for the given measurement system
 * @return {Measurement} a new instance that is scaled to the
 * right level
 */
DigitalStorageUnit.prototype.scale = function(measurementsystem, units) {
    var mSystem, systemName = this.getMeasurementSystem();
    if (units) {
        mSystem = units[systemName];
    } else {
        if (JSUtils.indexOf(DigitalStorageUnit.byteSystem, this.unit) > -1) {
            mSystem = DigitalStorageUnit.byteSystem;
        } else {
            mSystem = DigitalStorageUnit.bitSystem;
        }
    }
    
    return this.newUnit(this.scaleUnits(mSystem));
};

/**
 * Expand the current measurement such that any fractions of the current unit
 * are represented in terms of smaller units in the same system instead of fractions
 * of the current unit. For example, "6.25 feet" may be represented as
 * "6 feet 4 inches" instead. The return value is an array of measurements which
 * are progressively smaller until the smallest unit in the system is reached
 * or until there is a whole number of any unit along the way.
 *
 * @param {string=} measurementsystem system to use (uscustomary|imperial|metric),
 * or undefined if the system can be inferred from the current measure
 * @param {Object=} units mapping from the measurement system to the units to use
 * for this scaling. If this is not defined, this measurement type will use the
 * set of units that it knows about for the given measurement system
 * @return {Array.<Measurement>} an array of new measurements in order from
 * the current units to the smallest units in the system which together are the
 * same measurement as this one
 */
DigitalStorageUnit.prototype.expand = function(measurementsystem, units) {
    var mSystem, systemName = this.getMeasurementSystem();
    if (units) {
        mSystem = units[systemName];
    } else {
        if (this.unit in DigitalStorageUnit.byteSystem) {
            mSystem = DigitalStorageUnit.byteSystem;
        } else {
            mSystem = DigitalStorageUnit.bitSystem;
        }
    }

    return this.list(mSystem, DigitalStorageUnit.ratios).map(function(item) {
        return new DigitalStorageUnit(item);
    });
};


DigitalStorageUnit.aliases = {
    "bits": "bit",
    "bit": "bit",
    "Bits": "bit",
    "Bit": "bit",
    "byte": "byte",
    "bytes": "byte",
    "Byte": "byte",
    "Bytes": "byte",
    "kilobits": "kilobit",
    "Kilobits": "kilobit",
    "KiloBits": "kilobit",
    "kiloBits": "kilobit",
    "kilobit": "kilobit",
    "Kilobit": "kilobit",
    "kiloBit": "kilobit",
    "KiloBit": "kilobit",
    "kb": "kilobit",
    "Kb": "kilobit",
    "kilobyte": "kilobyte",
    "Kilobyte": "kilobyte",
    "kiloByte": "kilobyte",
    "KiloByte": "kilobyte",
    "kilobytes": "kilobyte",
    "Kilobytes": "kilobyte",
    "kiloBytes": "kilobyte",
    "KiloBytes": "kilobyte",
    "kB": "kilobyte",
    "KB": "kilobyte",
    "megabit": "megabit",
    "Megabit": "megabit",
    "megaBit": "megabit",
    "MegaBit": "megabit",
    "megabits": "megabit",
    "Megabits": "megabit",
    "megaBits": "megabit",
    "MegaBits": "megabit",
    "Mb": "megabit",
    "mb": "megabit",
    "megabyte": "megabyte",
    "Megabyte": "megabyte",
    "megaByte": "megabyte",
    "MegaByte": "megabyte",
    "megabytes": "megabyte",
    "Megabytes": "megabyte",
    "megaBytes": "megabyte",
    "MegaBytes": "megabyte",
    "MB": "megabyte",
    "mB": "megabyte",
    "gigabit": "gigabit",
    "Gigabit": "gigabit",
    "gigaBit": "gigabit",
    "GigaBit": "gigabit",
    "gigabits": "gigabit",
    "Gigabits": "gigabit",
    "gigaBits": "gigabyte",
    "GigaBits": "gigabit",
    "Gb": "gigabit",
    "gb": "gigabit",
    "gigabyte": "gigabyte",
    "Gigabyte": "gigabyte",
    "gigaByte": "gigabyte",
    "GigaByte": "gigabyte",
    "gigabytes": "gigabyte",
    "Gigabytes": "gigabyte",
    "gigaBytes": "gigabyte",
    "GigaBytes": "gigabyte",
    "GB": "gigabyte",
    "gB": "gigabyte",
    "terabit": "terabit",
    "Terabit": "terabit",
    "teraBit": "terabit",
    "TeraBit": "terabit",
    "terabits": "terabit",
    "Terabits": "terabit",
    "teraBits": "terabit",
    "TeraBits": "terabit",
    "tb": "terabit",
    "Tb": "terabit",
    "terabyte": "terabyte",
    "Terabyte": "terabyte",
    "teraByte": "terabyte",
    "TeraByte": "terabyte",
    "terabytes": "terabyte",
    "Terabytes": "terabyte",
    "teraBytes": "terabyte",
    "TeraBytes": "terabyte",
    "TB": "terabyte",
    "tB": "terabyte",
    "petabit": "petabit",
    "Petabit": "petabit",
    "petaBit": "petabit",
    "PetaBit": "petabit",
    "petabits": "petabit",
    "Petabits": "petabit",
    "petaBits": "petabit",
    "PetaBits": "petabit",
    "pb": "petabit",
    "Pb": "petabit",
    "petabyte": "petabyte",
    "Petabyte": "petabyte",
    "petaByte": "petabyte",
    "PetaByte": "petabyte",
    "petabytes": "petabyte",
    "Petabytes": "petabyte",
    "petaBytes": "petabyte",
    "PetaBytes": "petabyte",
    "PB": "petabyte",
    "pB": "petabyte"
};

(function() {
    DigitalStorageUnit.aliasesLower = {};
    for (var a in DigitalStorageUnit.aliases) {
        DigitalStorageUnit.aliasesLower[a.toLowerCase()] = DigitalStorageUnit.aliases[a];
    }
})();

/**
 * Convert a digitalStorage to another measure.
 * @static
 * @param to {string} unit to convert to
 * @param from {string} unit to convert from
 * @param digitalStorage {number} amount to be convert
 * @returns {number|undefined} the converted amount
 */
DigitalStorageUnit.convert = function(to, from, digitalStorage) {
    from = Measurement.getUnitIdCaseInsensitive(DigitalStorageUnit, from) || from;
    to = Measurement.getUnitIdCaseInsensitive(DigitalStorageUnit, to) || to;
	var fromRow = DigitalStorageUnit.ratios[from];
	var toRow = DigitalStorageUnit.ratios[to];
	if (typeof(from) === 'undefined' || typeof(to) === 'undefined') {
		return undefined;
	}
	var result = digitalStorage * fromRow[toRow[0]];
    return result;
};

/**
 * @private
 * @static
 */
DigitalStorageUnit.getMeasures = function () {
    return Object.keys(DigitalStorageUnit.ratios);
};

//register with the factory method
Measurement._constructors["digitalStorage"] = DigitalStorageUnit;

module.exports = DigitalStorageUnit;