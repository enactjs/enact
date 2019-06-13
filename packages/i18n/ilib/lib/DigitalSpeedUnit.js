/*
 * DigitalSpeedUnit.js - Unit conversions for Digital Storage
 *
 * Copyright © 2018 JEDLSoft
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
 * Create a new DigitalSpeed measurement instance. This measures the speed of
 * transfer of data.
 *
 * @constructor
 * @extends Measurement
 * @param options {{unit:string,amount:number|string|undefined}} Options controlling
 * the construction of this instance
 */
var DigitalSpeedUnit = function (options) {
    this.unit = "byte";
    this.amount = 0;

    this.ratios = DigitalSpeedUnit.ratios;
    this.aliases = DigitalSpeedUnit.aliases;
    this.aliasesLower = DigitalSpeedUnit.aliasesLower;
    this.systems = DigitalSpeedUnit.systems;

    this.parent(options);
};

DigitalSpeedUnit.prototype = new Measurement();
DigitalSpeedUnit.prototype.parent = Measurement;
DigitalSpeedUnit.prototype.constructor = DigitalSpeedUnit;

DigitalSpeedUnit.ratios = {
    /*                       #    bps               Bps              kbps             kBps             Mbps              MBps              Gbps             GBps               Tbps              TBps              Pbps               PBps               Bph             kBph             MBph             GBph             TBph            PBph   */
    "bit-per-second":      [ 1,   1,                0.125,           0.0009765625,    1.220703125e-4,  9.536743164e-7,   1.192092896e-7,   9.313225746e-10, 1.164153218e-10,   9.094947017e-13,  1.136868377e-13,  8.881784197e-16,   1.110223025e-16,   450,            0.45,           4.5e-4,          4.5e-7,          4.5e-10,         4.5e-13         ],
    "byte-per-second":     [ 2,   8,                1,               0.0078125,       0.0009765625,    7.629394531e-6,   9.536743164e-7,   7.450580597e-9,  9.313225746e-10,   7.275957614e-12,  9.094947017e-13,  7.105427358e-15,   8.881784197e-16,   3600,           3.6,            3.6e-3,          3.6e-6,          3.6e-9,          3.6e-12         ],
    "kilobit-per-second":  [ 3,   1024,             128,             1,               0.125,           0.0009765625,     1.220703125e-4,   9.536743164e-7,  1.192092896e-7,    9.313225746e-10,  1.164153218e-10,  9.094947017e-13,   1.136868377e-13,   4.5e5,          450,            0.45,            4.5e-4,          4.5e-7,          4.5e-10         ],
    "kilobyte-per-second": [ 4,   8192,             1024,            8,               1,               0.0078125,        0.0009765625,     7.629394531e-6,  9.536743164e-7,    7.450580597e-9,   9.313225746e-10,  7.275957614e-12,   9.094947017e-13,   3.6e6,          3600,           3.6,             3.6e-3,          3.6e-6,          3.6e-9          ],
    "megabit-per-second":  [ 5,   1048576,          131072,          1024,            128,             1,                0.125,            0.0009765625,    1.220703125e-4,    9.536743164e-7,   1.192092896e-7,   9.313225746e-10,   1.164153218e-10,   4.5e8,          4.5e5,          450,             0.45,            4.5e-4,          4.5e-7          ],
    "megabyte-per-second": [ 6,   8388608,          1048576,         8192,            1024,            8,                1,                0.0078125,       0.0009765625,      7.629394531e-6,   9.536743164e-7,   7.450580597e-9,    9.313225746e-10,   3.6e9,          3.6e6,          3600,            3.6,             3.6e-3,          3.6e-6          ],
    "gigabit-per-second":  [ 7,   1073741824,       134217728,       1048576,         131072,          1024,             128,              1,               0.125,             0.0009765625,     1.220703125e-4,   9.536743164e-7,    1.192092896e-7,    4.5e11,         4.5e8,          4.5e5,           450,             0.45,            4.5e-4          ],
    "gigabyte-per-second": [ 8,   8589934592,       1073741824,      8388608,         1048576,         8192,             1024,             8,               1,                 0.0078125,        0.0009765625,     7.629394531e-6,    9.536743164e-7,    3.6e12,         3.6e9,          3.6e6,           3600,            3.6,             3.6e-3          ],
    "terabit-per-second":  [ 9,   1.099511628e12,   137438953472,    1073741824,      134217728,       1048576,          131072,           1024,            128,               1,                0.125,            0.0009765625,      1.220703125e-4,    4.5e14,         4.5e11,         4.5e8,           4.5e5,           450,             0.45            ],
    "terabyte-per-second": [ 10,  8.796093022e12,   1.099511628e12,  8589934592,      1073741824,      8388608,          1048576,          8192,            1024,              8,                1,                0.0078125,         0.0009765625,      3.6e15,         3.6e12,         3.6e9,           3.6e6,           3600,            3.6             ],
    "petabit-per-second":  [ 11,  1.125899907e15,   1.407374884e14,  1.099511628e12,  137438953472,    1073741824,       134217728,        1048576,         131072,            1024,             128,              1,                 0.125,             4.5e17,         4.5e14,         4.5e11,          4.5e8,           4.5e5,           450             ],
    "petabyte-per-second": [ 12,  9.007199255e15,   1.125899907e15,  8.796093022e12,  1.099511628e12,  8589934592,       1073741824,       8388608,         1048576,           8192,             1024,             8,                 1,                 3.6e18,         3.6e15,         3.6e12,          3.6e9,           3.6e6,           3600            ],

    "byte-per-hour":       [ 13,  28800,            3600,            28.125,           3.515625,        0.0274658203116, 3.43322753904e-3, 2.68220901492e-5, 3.35276126856e-6, 2.61934474104e-8, 3.27418092612e-9, 2.55795384888e-11, 3.19744231092e-12, 1,              0.0078125,      9.536743164e-7,  9.313225746e-10, 9.094947017e-13, 8.881784197e-16 ],
    "kilobyte-per-hour":   [ 14,  29491200,         3686400,         28800,            3600,            28.125,          3.515625,         0.0274658203116,  3.43322753904e-3, 2.68220901492e-5, 3.35276126856e-6, 2.61934474104e-8,  3.27418092612e-9,  1024,           1,              0.0078125,       9.536743164e-7,  9.313225746e-10, 9.094947017e-13 ],
    "megabyte-per-hour":   [ 15,  30198988800,      3774873600,      29491200,         3686400,         28800,           3600,             28.125,           3.515625,         0.0274658203116,  3.43322753904e-3, 2.68220901492e-5,  3.35276126856e-6,  1048576,        1024,           1,               0.0078125,       9.536743164e-7,  9.313225746e-10 ],
    "gigabyte-per-hour":   [ 16,  30923764531200,   3865470566400,   30198988800,      3774873600,      29491200,        3686400,          28800,            3600,             28.125,           3.515625,         0.0274658203116,   3.43322753904e-3,  1073741824,     1048576,        1024,            1,               0.0078125,       9.536743164e-7  ],
    "terabyte-per-hour":   [ 17,  3.16659348792e16, 3.9582418608e16, 30923764531200,   3865470566400,   30198988800,     3774873600,       29491200,         3686400,          28800,            3600,             28.125,            3.515625,          1.099511628e12, 1073741824,     1048576,         1024,            1,               0.0078125       ],
    "petabyte-per-hour":   [ 18,  3.2425917318e19,  4.0532396652e18, 3.16659348792e16, 3.9582418608e16, 30923764531200,  3865470566400,    30198988800,      3774873600,       29491200,         3686400,          28800,             3600,              1.125899907e15, 1.099511628e12, 1073741824,      1048576,         1024,            1               ]
};

/**
 * Return a new instance of this type of measurement.
 *
 * @param {Object} params parameters to the constructor
 * @return {Measurement} a measurement subclass instance
 */
DigitalSpeedUnit.prototype.newUnit = function(params) {
    return new DigitalSpeedUnit(params);
};

DigitalSpeedUnit.systems = {
    "metric": [],
    "uscustomary": [],
    "imperial": [],
    "conversions": {
        "metric": {},
        "uscustomary": {},
        "imperial": {}
    }
};

DigitalSpeedUnit.bitSystem = [
    "bit-per-second",
    "kilobit-per-second",
    "megabit-per-second",
    "gigabit-per-second",
    "terabit-per-second",
    "petabit-per-second"
];
DigitalSpeedUnit.byteSystem = [
    "byte-per-second",
    "kilobyte-per-second",
    "megabyte-per-second",
    "gigabyte-per-second",
    "terabyte-per-second",
    "petabyte-per-second"
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
 * @override
 * @return {string} the name of the type of this measurement
 */
DigitalSpeedUnit.prototype.getMeasure = function() {
    return "digitalSpeed";
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
DigitalSpeedUnit.prototype.localize = function(locale) {
    return new DigitalSpeedUnit({
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
DigitalSpeedUnit.prototype.scale = function(measurementsystem, units) {
    var mSystem, systemName = this.getMeasurementSystem();
    if (units) {
        mSystem = units[systemName];
    } else {
        if (JSUtils.indexOf(DigitalSpeedUnit.byteSystem, this.unit) > -1) {
            mSystem = DigitalSpeedUnit.byteSystem;
        } else {
            mSystem = DigitalSpeedUnit.bitSystem;
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
DigitalSpeedUnit.prototype.expand = function(measurementsystem, units) {
    var mSystem, systemName = this.getMeasurementSystem();
    if (units) {
        mSystem = units[systemName];
    } else {
        if (this.unit in DigitalSpeedUnit.byteSystem) {
            mSystem = DigitalSpeedUnit.byteSystem;
        } else {
            mSystem = DigitalSpeedUnit.bitSystem;
        }
    }

    return this.list(mSystem, DigitalSpeedUnit.ratios).map(function(item) {
        return new DigitalSpeedUnit(item);
    });
};

DigitalSpeedUnit.aliases = {
    "bits/s": "bit-per-second",
    "bit/s": "bit-per-second",
    "bits/second": "bit-per-second",
    "bit/second": "bit-per-second",
    "bps": "bit-per-second",
    "byte/s": "byte-per-second",
    "bytes/s": "byte-per-second",
    "byte/second": "byte-per-second",
    "bytes/second": "byte-per-second",
    "Bps": "byte-per-second",
    "kilobits/s": "kilobit-per-second",
    "kilobits/second": "kilobit-per-second",
    "Kilobits/s": "kilobit-per-second",
    "kilobit/s": "kilobit-per-second",
    "kilobit/second": "kilobit-per-second",
    "Kilobit/s": "kilobit-per-second",
    "kb/s": "kilobit-per-second",
    "Kb/s": "kilobit-per-second",
    "kbps": "kilobit-per-second",
    "Kbps": "kilobit-per-second",
    "kilobyte/s": "kilobyte-per-second",
    "kilobyte/second": "kilobyte-per-second",
    "Kilobyte/s": "kilobyte-per-second",
    "kilobytes/s": "kilobyte-per-second",
    "kilobytes/second": "kilobyte-per-second",
    "Kilobytes/s": "kilobyte-per-second",
    "kB/s": "kilobyte-per-second",
    "KB/s": "kilobyte-per-second",
    "kBps": "kilobyte-per-second",
    "KBps": "kilobyte-per-second",
    "megabit/s": "megabit-per-second",
    "megabits/s": "megabit-per-second",
    "megabit/second": "megabit-per-second",
    "megabits/second": "megabit-per-second",
    "Mb/s": "megabit-per-second",
    "mb/s": "megabit-per-second",
    "mbps": "megabit-per-second",
    "Mbps": "megabit-per-second",
    "megabyte/s": "megabyte-per-second",
    "megabytes/s": "megabyte-per-second",
    "megabyte/second": "megabyte-per-second",
    "megabytes/second": "megabyte-per-second",
    "MB/s": "megabyte-per-second",
    "mB/s": "megabyte-per-second",
    "mBps": "megabyte-per-second",
    "MBps": "megabyte-per-second",
    "gigabit/s": "gigabit-per-second",
    "gigabits/s": "gigabit-per-second",
    "gigabit/second": "gigabit-per-second",
    "gigabits/second": "gigabit-per-second",
    "Gb/s": "gigabit-per-second",
    "gb/s": "gigabit-per-second",
    "gbps": "gigabit-per-second",
    "Gbps": "gigabit-per-second",
    "gigabyte/s": "gigabyte-per-second",
    "gigabytes/s": "gigabyte-per-second",
    "gigabyte/second": "gigabyte-per-second",
    "gigabytes/second": "gigabyte-per-second",
    "GB/s": "gigabyte-per-second",
    "gB/s": "gigabyte-per-second",
    "gBps": "gigabyte-per-second",
    "GBps": "gigabyte-per-second",
    "terabit/second": "terabit-per-second",
    "terabits/second": "terabit-per-second",
    "tb/s": "terabit-per-second",
    "Tb/s": "terabit-per-second",
    "tbps": "terabit-per-second",
    "Tbps": "terabit-per-second",
    "terabyte/s": "terabyte-per-second",
    "terabytes/s": "terabyte-per-second",
    "terabyte/second": "terabyte-per-second",
    "terabytes/second": "terabyte-per-second",
    "TB/s": "terabyte-per-second",
    "tB/s": "terabyte-per-second",
    "tBps": "terabyte-per-second",
    "TBps": "terabyte-per-second",
    "petabit/s": "petabit-per-second",
    "petabits/s": "petabit-per-second",
    "petabit/second": "petabit-per-second",
    "petabits/second": "petabit-per-second",
    "pb/s": "petabit-per-second",
    "Pb/s": "petabit-per-second",
    "pbps": "petabit-per-second",
    "Pbps": "petabit-per-second",
    "petabyte/s": "petabyte-per-second",
    "petabytes/s": "petabyte-per-second",
    "petabyte/second": "petabyte-per-second",
    "petabytes/second": "petabyte-per-second",
    "PB/s": "petabyte-per-second",
    "pB/s": "petabyte-per-second",
    "pBps": "petabyte-per-second",
    "PBps": "petabyte-per-second",
    "byte/h": "byte-per-hour",
    "bytes/h": "byte-per-hour",
    "byte/hour": "byte-per-hour",
    "bytes/hour": "byte-per-hour",
    "B/h": "byte-per-hour",
    "Bph": "byte-per-hour",
    "kilobyte/h": "kilobyte-per-hour",
    "kilobytes/h": "kilobyte-per-hour",
    "kilobyte/hour": "kilobyte-per-hour",
    "kilobytes/hour": "kilobyte-per-hour",
    "kB/h": "kilobyte-per-hour",
    "KB/h": "kilobyte-per-hour",
    "kBph": "kilobyte-per-hour",
    "KBph": "kilobyte-per-hour",
    "megabyte/h": "megabyte-per-hour",
    "megabytes/h": "megabyte-per-hour",
    "megabyte/hour": "megabyte-per-hour",
    "megabytes/hour": "megabyte-per-hour",
    "MB/h": "megabyte-per-hour",
    "MBph": "megabyte-per-hour",
    "gigabyte/h": "gigabyte-per-hour",
    "gigabytes/h": "gigabyte-per-hour",
    "gigabyte/hour": "gigabyte-per-hour",
    "gigabytes/hour": "gigabyte-per-hour",
    "GB/h": "gigabyte-per-hour",
    "GBph": "gigabyte-per-hour",
    "petabyte/h": "petabyte-per-hour",
    "petabytes/h": "petabyte-per-hour",
    "petabyte/hour": "petabyte-per-hour",
    "petabytes/hour": "petabyte-per-hour",
    "PB/h": "petabyte-per-hour",
    "PBph": "petabyte-per-hour"
};

(function() {
    DigitalSpeedUnit.aliasesLower = {};
    for (var a in DigitalSpeedUnit.aliases) {
        DigitalSpeedUnit.aliasesLower[a.toLowerCase()] = DigitalSpeedUnit.aliases[a];
    }
})();

/**
 * Convert a digitalSpeed to another measure.
 * @static
 * @param to {string} unit to convert to
 * @param from {string} unit to convert from
 * @param digitalSpeed {number} amount to be convert
 * @returns {number|undefined} the converted amount
 */
DigitalSpeedUnit.convert = function(to, from, digitalSpeed) {
    from = Measurement.getUnitIdCaseInsensitive(DigitalSpeedUnit, from) || from;
    to = Measurement.getUnitIdCaseInsensitive(DigitalSpeedUnit, to) || to;
    var fromRow = DigitalSpeedUnit.ratios[from];
    var toRow = DigitalSpeedUnit.ratios[to];
    if (typeof(from) === 'undefined' || typeof(to) === 'undefined') {
        return undefined;
    }
    var result = digitalSpeed * fromRow[toRow[0]];
    return result;
};

/**
 * @private
 * @static
 */
DigitalSpeedUnit.getMeasures = function () {
    return Object.keys(DigitalSpeedUnit.ratios);
};

//register with the factory method
Measurement._constructors["digitalSpeed"] = DigitalSpeedUnit;

module.exports = DigitalSpeedUnit;