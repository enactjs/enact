/*
 * TimeUnit.js - Unit conversions for time measurements
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
 * Create a new time measurement instance.
 *
 * @constructor
 * @extends Measurement
 * @param options {{unit:string,amount:number|string|undefined}} Options controlling
 * the construction of this instance
 */
var TimeUnit = function (options) {
    this.unit = "second";
    this.amount = 0;

    this.ratios = TimeUnit.ratios;
    this.aliases = TimeUnit.aliases;
    this.aliasesLower = TimeUnit.aliasesLower;
    this.systems = TimeUnit.systems;

    this.parent(options);
};

TimeUnit.prototype = new Measurement();
TimeUnit.prototype.parent = Measurement;
TimeUnit.prototype.constructor = TimeUnit;

TimeUnit.ratios = {
    /*              index  nsec        msec        mlsec       sec        min          hour          day           week         month        year         decade        century      millenium */
    "nanosecond":   [ 1,   1,          0.001,      1e-6,       1e-9,      1.6667e-11,  2.7778e-13,   1.1574e-14,   1.6534e-15,  3.8027e-16,  3.1689e-17,  3.1689e-18,   3.1689e-19,  3.1689e-20],
    "microsecond":  [ 2,   1000,       1,          0.001,      1e-6,      1.6667e-8,   2.7778e-10,   1.1574e-11,   1.6534e-12,  3.8027e-13,  3.1689e-14,  3.1689e-15,   3.1689e-16,  3.1689e-17],
    "millisecond":  [ 3,   1e+6,       1000,       1,          0.001,     1.6667e-5,   2.7778e-7,    1.1574e-8,    1.6534e-9,   3.8027e-10,  3.1689e-11,  3.1689e-12,   3.1689e-13,  3.1689e-14],
    "second":       [ 4,   1e+9,       1e+6,       1000,       1,         0.0166667,   0.000277778,  1.1574e-5,    1.6534e-6,   3.8027e-7,   3.1689e-8,   3.1689e-9,    3.1689e-10,  3.1689e-11],
    "minute":       [ 5,   6e+10,      6e+7,       60000,      60,        1,           0.0166667,    0.000694444,  9.9206e-5,   2.2816e-5,   1.9013e-6,   1.9013e-7,    1.9013e-8,   1.9013e-9 ],
    "hour":         [ 6,   3.6e+12,    3.6e+9,     3.6e+6,     3600,      60,          1,            0.0416667,    0.00595238,  0.00136895,  0.00011408,  1.1408e-5,    1.1408e-6,   1.1408e-7 ],
    "day":          [ 7,   8.64e+13,   8.64e+10,   8.64e+7,    86400,     1440,        24,           1,            0.142857,    0.0328549,   0.00273791,  0.000273791,  2.7379e-5,   2.7379e-6 ],
    "week":         [ 8,   6.048e+14,  6.048e+11,  6.048e+8,   604800,    10080,       168,          7,            1,           0.229984,    0.0191654,   0.00191654,   0.000191654, 1.91654e-5],
    "month":        [ 9,   2.63e+15,   2.63e+12,   2.63e+9,    2.63e+6,   43829.1,     730.484,      30.4368,      4.34812,     1,           0.0833333,   0.00833333,   0.000833333, 8.33333e-5],
    "year":         [ 10,  3.156e+16,  3.156e+13,  3.156e+10,  3.156e+7,  525949,      8765.81,      365.242,      52.1775,     12,          1,           0.1,          0.01,        0.001     ],
    "decade":       [ 11,  3.156e+17,  3.156e+14,  3.156e+11,  3.156e+8,  5.259e+6,    87658.1,      3652.42,      521.775,     120,         10,          1,            0.1,         0.01      ],
    "century":      [ 12,  3.156e+18,  3.156e+18,  3.156e+12,  3.156e+9,  5.259e+7,    876581,       36524.2,      5217.75,     1200,        100,         10,           1,           0.1       ],
    "millenium":    [ 13,  3.156e+19,  3.156e+19,  3.156e+13,  3.156e+10, 5.259e+8,    8765810,      365242,       52177.5,     12000,       1000,        100,          10,          1         ]
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
TimeUnit.prototype.getMeasure = function() {
    return "time";
};

/**
 * Return a new instance of this type of measurement.
 *
 * @param {Object} params parameters to the constructor
 * @return {Measurement} a measurement subclass instance
 */
TimeUnit.prototype.newUnit = function(params) {
    return new TimeUnit(params);
};


TimeUnit.systems = {
    "metric": [
        "nanosecond",
        "microsecond",
        "millisecond",
        "second",
        "minute",
        "hour",
        "day",
        "week",
        "month",
        "year",
        "decade",
        "century"
    ],
    "uscustomary": [
        "nanosecond",
        "microsecond",
        "millisecond",
        "second",
        "minute",
        "hour",
        "day",
        "week",
        "month",
        "year",
        "decade",
        "century"
    ],
    "imperial": [
        "nanosecond",
        "microsecond",
        "millisecond",
        "second",
        "minute",
        "hour",
        "day",
        "week",
        "month",
        "year",
        "decade",
        "century"
    ],
    "conversions": {
        "metric": {},
        "uscustomary": {},
        "imperial": {}
    }
};

TimeUnit.aliases = {
    "ns": "nanosecond",
    "NS": "nanosecond",
    "nS": "nanosecond",
    "Ns": "nanosecond",
    "Nanosecond": "nanosecond",
    "Nanoseconds": "nanosecond",
    "nanosecond": "nanosecond",
    "nanoseconds": "nanosecond",
    "NanoSecond": "nanosecond",
    "NanoSeconds": "nanosecond",
    "μs": "microsecond",
    "μS": "microsecond",
    "microsecond": "microsecond",
    "microseconds": "microsecond",
    "Microsecond": "microsecond",
    "Microseconds": "microsecond",
    "MicroSecond": "microsecond",
    "MicroSeconds": "microsecond",
    "ms": "millisecond",
    "MS": "millisecond",
    "mS": "millisecond",
    "Ms": "millisecond",
    "millisecond": "millisecond",
    "milliseconds": "millisecond",
    "Millisecond": "millisecond",
    "Milliseconds": "millisecond",
    "MilliSecond": "millisecond",
    "MilliSeconds": "millisecond",
    "s": "second",
    "S": "second",
    "sec": "second",
    "second": "second",
    "seconds": "second",
    "Second": "second",
    "Seconds": "second",
    "min": "minute",
    "Min": "minute",
    "minute": "minute",
    "minutes": "minute",
    "Minute": "minute",
    "Minutes": "minute",
    "h": "hour",
    "H": "hour",
    "hr": "hour",
    "Hr": "hour",
    "hR": "hour",
    "HR": "hour",
    "hour": "hour",
    "hours": "hour",
    "Hour": "hour",
    "Hours": "hour",
    "Hrs": "hour",
    "hrs": "hour",
    "day": "day",
    "days": "day",
    "Day": "day",
    "Days": "day",
    "week": "week",
    "weeks": "week",
    "Week": "week",
    "Weeks": "week",
    "month": "month",
    "Month": "month",
    "months": "month",
    "Months": "month",
    "year": "year",
    "years": "year",
    "Year": "year",
    "Years": "year",
    "yr": "year",
    "Yr": "year",
    "yrs": "year",
    "Yrs": "year",
    "decade": "decade",
    "decades": "decade",
    "Decade": "decade",
    "Decades": "decade",
    "century": "century",
    "centuries": "century",
    "Century": "century",
    "Centuries": "century",
    "millenium": "millenium",
    "milleniums": "millenium",
    "millenia": "millenium",
    "mill.": "millenium",
    "milm": "millenium"
};

(function() {
    TimeUnit.aliasesLower = {};
    for (var a in TimeUnit.aliases) {
        TimeUnit.aliasesLower[a.toLowerCase()] = TimeUnit.aliases[a];
    }
})();

/**
 * Convert a time to another measure.
 * @static
 * @param to {string} unit to convert to
 * @param from {string} unit to convert from
 * @param time {number} amount to be convert
 * @returns {number|undefined} the converted amount
 */
TimeUnit.convert = function(to, from, time) {
    from = Measurement.getUnitIdCaseInsensitive(TimeUnit, from) || from;
    to = Measurement.getUnitIdCaseInsensitive(TimeUnit, to) || to;
    var fromRow = TimeUnit.ratios[from];
    var toRow = TimeUnit.ratios[to];
    if (typeof(from) === 'undefined' || typeof(to) === 'undefined') {
        return undefined;
    }
    return time * fromRow[toRow[0]];
};

/**
 * @private
 * @static
 */
TimeUnit.getMeasures = function () {
    return Object.keys(TimeUnit.ratios);
};

//register with the factory method
Measurement._constructors["time"] = TimeUnit;

module.exports = TimeUnit;