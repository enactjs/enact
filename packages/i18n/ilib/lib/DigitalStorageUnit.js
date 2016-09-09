/*
 * digitalStorage.js - Unit conversions for Digital Storage
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
	this.aliases = DigitalStorageUnit.aliases; // share this table in all instances
	
	if (options) {
		if (typeof(options.unit) !== 'undefined') {
			this.originalUnit = options.unit;
			this.unit = this.aliases[options.unit] || options.unit;
		}
		
		if (typeof(options.amount) === 'object') {
			if (options.amount.getMeasure() === "digitalStorage") {
				this.amount = DigitalStorageUnit.convert(this.unit, options.amount.getUnit(), options.amount.getAmount());
			} else {
				throw "Cannot convert unit " + options.amount.unit + " to a digitalStorage";
			}
		} else if (typeof(options.amount) !== 'undefined') {
			this.amount = parseFloat(options.amount);
		}
	}
	
	if (typeof(DigitalStorageUnit.ratios[this.unit]) === 'undefined') {
		throw "Unknown unit: " + options.unit;
	}
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
 * Return a new measurement instance that is converted to a new
 * measurement unit. Measurements can only be converted
 * to measurements of the same type.<p>
 *  
 * @param {string} to The name of the units to convert to
 * @return {Measurement|undefined} the converted measurement
 * or undefined if the requested units are for a different
 * measurement type
 * 
 */
DigitalStorageUnit.prototype.convert = function(to) {
	if (!to || typeof(DigitalStorageUnit.ratios[this.normalizeUnits(to)]) === 'undefined') {
		return undefined;
	}
	return new DigitalStorageUnit({
		unit: to,
		amount: this
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
 * @return {Measurement} a new instance that is scaled to the 
 * right level
 */
DigitalStorageUnit.prototype.scale = function(measurementsystem) {
    
    var fromRow = DigitalStorageUnit.ratios[this.unit];    
    var dStorage = this.amount;
    var munit = this.unit;
    var i;
    
    dStorage = 18446744073709551999;
    for (var m in DigitalStorageUnit.ratios) {
    	i = DigitalStorageUnit.ratios[m][0];
        var tmp = this.amount * fromRow[i];
        if (tmp >= 1 && tmp < dStorage) {
	        dStorage = tmp;
	        munit = m;
        }
    }
    
    return new DigitalStorageUnit({
		unit: munit,
		amount: dStorage
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

/**
 * Convert a digitalStorage to another measure.
 * @static
 * @param to {string} unit to convert to
 * @param from {string} unit to convert from
 * @param digitalStorage {number} amount to be convert
 * @returns {number|undefined} the converted amount
 */
DigitalStorageUnit.convert = function(to, from, digitalStorage) {
    from = DigitalStorageUnit.aliases[from] || from;
    to = DigitalStorageUnit.aliases[to] || to;
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
	var ret = [];
	for (var m in DigitalStorageUnit.ratios) {
		ret.push(m);
	}
	return ret;
};

//register with the factory method
Measurement._constructors["digitalStorage"] = DigitalStorageUnit;

module.exports = DigitalStorageUnit;