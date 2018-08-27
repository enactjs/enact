/*
 * Measurement.js - Measurement unit superclass
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

// !depends JSUtils.js MathUtils.js Locale.js

var JSUtils = require("./JSUtils.js");
var MathUtils = require("./MathUtils.js");
var Locale = require("./Locale.js");

function round(number, precision) {
    var factor = Math.pow(10, precision);
    return MathUtils.halfdown(number * factor) / factor;
}

/**
 * @class
 * Superclass for measurement instances that contains shared functionality
 * and defines the interface. <p>
 *
 * This class is never instantiated on its own. Instead, measurements should
 * be created using the {@link MeasurementFactory} function, which creates the
 * correct subclass based on the given parameters.<p>
 *
 * @param {Object] options options controlling the construction of this instance
 * @private
 * @constructor
 */
var Measurement = function(options) {
    if (options) {
        if (typeof(options.unit) !== 'undefined') {
            this.originalUnit = options.unit;
            this.unit = this.normalizeUnits(options.unit) || options.unit;
        }

        if (typeof(options.amount) === 'object') {
            if (options.amount.getMeasure() === this.getMeasure()) {
                this.amount = options.amount.convert(this.unit);
            } else {
                throw "Cannot convert unit " + options.amount.unit + " to a " + this.getMeasure();
            }
        } else if (typeof(options.amount) !== 'undefined') {
            this.amount = Number(options.amount);
        }

        if (typeof(this.ratios[this.unit]) === 'undefined') {
            throw "Unknown unit: " + options.unit;
        }
    }
};

/**
 * @private
 */
Measurement._constructors = {};

Measurement.prototype = {
    /**
     * Return the normalized name of the given units. If the units are
     * not recognized, this method returns its parameter unmodified.<p>
     *
     * Examples:
     *
     * <ui>
     * <li>"metres" gets normalized to "meter"<br>
     * <li>"ml" gets normalized to "milliliter"<br>
     * <li>"foobar" gets normalized to "foobar" (no change because it is not recognized)
     * </ul>
     *
     * @param {string} name name of the units to normalize.
     * @returns {string} normalized name of the units
     */
    normalizeUnits: function(name) {
        return Measurement.getUnitId(this.constructor, name) ||
            Measurement.getUnitIdCaseInsensitive(this.constructor, name) ||
            name;
    },

    /**
     * Return the normalized units used in this measurement.
     * @return {string} name of the unit of measurement
     */
    getUnit: function() {
        return this.unit;
    },

    /**
     * Return the units originally used to construct this measurement
     * before it was normalized.
     * @return {string} name of the unit of measurement
     */
    getOriginalUnit: function() {
        return this.originalUnit;
    },

    /**
     * Return the numeric amount of this measurement.
     * @return {number} the numeric amount of this measurement
     */
    getAmount: function() {
        return this.amount;
    },

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
    getMeasure: function() {},

    /**
     * Return an array of all units that this measurement types supports.
     *
     * @return {Array.<string>} an array of all units that this measurement
     * types supports
     */
    getMeasures: function () {
        return Object.keys(this.ratios);
    },

    /**
     * Return the name of the measurement system that the current
     * unit is a part of.
     *
     * @returns {string} the name of the measurement system for
     * the units of this measurement
     */
    getMeasurementSystem: function() {
        if (JSUtils.indexOf(this.systems.uscustomary, this.unit) > -1) {
            return "uscustomary";
        }

        if (JSUtils.indexOf(this.systems.imperial, this.unit) > -1) {
            return "imperial";
        }

        return "metric";
    },

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
    localize: function(locale) {
        var to;
        var toSystem = Measurement.getMeasurementSystemForLocale(locale);
        var fromSystem = this.getMeasurementSystem();
        if (toSystem === fromSystem) return this; // already there
        to = this.systems.conversions[fromSystem] &&
            this.systems.conversions[fromSystem][toSystem] &&
            this.systems.conversions[fromSystem][toSystem][this.unit];

        return to ? this.newUnit({
            unit: to,
            amount: this.convert(to)
        }) : this;
    },

    /**
     * Return the amount of the current measurement when converted to the
     * given measurement unit. Measurements can only be converted
     * to other measurements of the same type.<p>
     *
     * @param {string} to the name of the units to convert this measurement to
     * @return {number} the amount corresponding to the requested unit
     */
    convert: function(to) {
        if (!to || typeof(this.ratios[this.normalizeUnits(to)]) === 'undefined') {
            return undefined;
        }

        var from = this.getUnitIdCaseInsensitive(this.unit) || this.unit;
        to = this.getUnitIdCaseInsensitive(to) || to;
        if (typeof(from) === 'undefined' || typeof(to) === 'undefined') {
            return undefined;
        }

        var fromRow = this.ratios[from];
        var toRow = this.ratios[to];
        return this.amount * fromRow[toRow[0]];
    },

    /**
     * Return a new measurement instance that is converted to a different
     * measurement system. Measurements can only be converted
     * to other measurements of the same type.<p>
     *
     * @param {string} measurementSystem the name of the system to convert to
     * @return {Measurement} a new measurement in the given system, or the
     * current measurement if it is already in the given system or could not
     * be converted
     */
    convertSystem: function(measurementSystem) {
        if (!measurementSystem || measurementSystem === this.getMeasurementSystem()) {
            return this;
        }
        var map = this.systems.conversions[this.getMeasurementSystem()][measurementSystem];
        var newunit = map && map[this.unit];
        if (!newunit) return this;

        return this.newUnit({
            unit: newunit,
            amount: this.convert(newunit)
        });
    },

    /**
     * Scale the measurement unit to an acceptable level. The scaling
     * happens so that the integer part of the amount is as small as
     * possible without being below zero. This will result in the
     * largest units that can represent this measurement without
     * fractions. Measurements can only be scaled to other measurements
     * of the same type.
     *
     * @param {Object=} units mapping from the measurement system to the units to use
     * for this scaling. If this is not defined, this measurement type will use the
     * set of units that it knows about for the given measurement system
     * @return {Measurement} a new instance that is scaled to the
     * right level
     */
    scale: function(measurementsystem, units) {
        var systemName = this.getMeasurementSystem();
        var mSystem;
        if (units) {
            mSystem = (units[measurementsystem] && JSUtils.indexOf(units[measurementsystem], this.unit) > -1) ?
                units[measurementsystem] : units[systemName];
        }
        if (!mSystem) {
            mSystem = (this.systems[measurementsystem] && JSUtils.indexOf(this.systems[measurementsystem], this.unit) > -1) ?
                this.systems[measurementsystem] : this.systems[systemName];
        }
        if (!mSystem) {
            // cannot find the system to scale within... just return the measurement as is
            return this;
        }

        return this.newUnit(this.scaleUnits(mSystem));
    },

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
     * @param {Array.<string>=} units object containing a mapping between the measurement system
     * and an array of units to use to restrict the expansion to
     * @param {function(number):number=} constrain a function that constrains
     * a number according to the display options
     * @param {boolean=} scale if true, rescale all of the units so that the
     * largest unit is the largest one with a non-fractional number. If false, then
     * the current unit stays the largest unit.
     * @return {Array.<Measurement>} an array of new measurements in order from
     * the current units to the smallest units in the system which together are the
     * same measurement as this one
     */
    expand: function(measurementsystem, units, constrain, scale) {
        var systemName = this.getMeasurementSystem();
        var mSystem = (units && units[systemName]) ? units[systemName] : (this.systems[systemName] || this.systems.metric);

        return this.list(mSystem, this.ratios, constrain, scale).map(function(item) {
            return this.newUnit(item);
        }.bind(this));
    },

    /**
     * Convert the current measurement to a list of measures
     * and amounts. This method will autoScale the current measurement
     * to the largest measure in the given measures list such that the
     * amount of that measure is still greater than or equal to 1. From
     * there, it will truncate that measure to a whole
     * number and then it will calculate the remainder in terms of
     * each of the smaller measures in the given list.<p>
     *
     * For example, if a person's height is given as 70.5 inches, and
     * the list of measures is ["mile", "foot", "inch"], then it will
     * scale the amount to 5 feet, 10.5 inches. The amount is not big
     * enough to have any whole miles, so that measure is not used.
     * The first measure will be "foot" because it is the first one
     * in the measure list where the there is an amount of them that
     * is greater than or equal to 1. The return value in this example
     * would be:
     *
     * <pre>
     * [
     *   {
     *     "unit": "foot",
     *     "amount": 5
     *   },
     *   {
     *     "unit": "inch",
     *     "amount": 10.5
     *   }
     * ]
     * </pre>
     *
     * Note that all measures except the smallest will be returned
     * as whole numbers. The smallest measure will contain any possible
     * fractional remainder.
     *
     * @param {Array.<string>|undefined} measures array of measure names to
     * convert this measure to
     * @param {Object} ratios the conversion ratios
     * table for the measurement type
     * @param {function (number): number} constrain a function that constrains
     * a number according to the display options
     * @param {boolean} scale if true, rescale all of the units so that the
     * largest unit is the largest one with a non-fractional number. If false, then
     * the current unit stays the largest unit.
     * @returns {Array.<{unit: String, amount: Number}>} the conversion
     * of the current measurement into an array of unit names and
     * their amounts
     */
    list: function(measures, ratios, constrain, scale) {
        var row = ratios[this.unit];
        var ret = [];
        var remainder, i, scaled, index;
        var unit = this.unit;
        var amount = this.amount;
        constrain = constrain || round;

        var start = JSUtils.indexOf(measures, this.unit);

        if (scale || start === -1) {
            start = measures.length-1;
        }

        if (this.unit !== measures[0]) {
            // if this unit is not the smallest measure in the system, we have to convert
            unit = measures[0];
            amount = this.amount * row[ratios[unit][0]];
            row = ratios[unit];
        }

        // convert to smallest measure
        amount = constrain(amount);
        // go backwards so we get from the largest to the smallest units in order
        for (var j = start; j > 0; j--) {
            unit = measures[j];
            scaled = amount * row[ratios[unit][0]];
            var xf = Math.floor(scaled);
            if (xf) {
                var item = {
                    unit: unit,
                    amount: xf
                };
                ret.push(item);

                amount -= xf * ratios[unit][ratios[measures[0]][0]];
            }
        }

        // last measure is rounded/constrained, not truncated
        if (amount !== 0) {
            ret.push({
                unit: measures[0],
                amount: constrain(amount)
            });
        }

        return ret;
    },

    /**
     * @private
     */
    scaleUnits: function(mSystem) {
        var tmp, munit, amount = 18446744073709551999;
        var fromRow = this.ratios[this.unit];

        for (var m = 0; m < mSystem.length; m++) {
            tmp = this.amount * fromRow[this.ratios[mSystem[m]][0]];
            if ((tmp >= 1 && tmp < amount) || amount === 18446744073709551999) {
                amount = tmp;
                munit = mSystem[m];
            }
        }

        return {
            unit: munit,
            amount: amount
        };
    },

    /**
     * @private
     *
     * Return the normalized units identifier for the given unit. This looks up the units
     * in the aliases list and returns the normalized unit id.
     *
     * @static
     * @param {Measurement} measurement the class of measure being searched
     * @param {String} unit the unit to find
     * @returns {String|undefined} the normalized identifier for the given unit, or
     * undefined if there is no such unit in this type of measurement
     */
    getUnitId: function(unit) {
        if (!unit) return undefined;

        if (this.aliases && typeof(this.aliases[unit]) !== 'undefined') {
            return this.aliases[unit];
        }

        if (this.ratios && typeof(this.ratios[unit]) !== 'undefined') {
            return unit;
        }

        return undefined;
    },

    /**
     * Return the normalized units identifier for the given unit, searching case-insensitively.
     * This has the risk that things may match erroneously because many short form unit strings
     * are case-sensitive. This should method be used as a last resort if no case-sensitive match
     * is found amongst all the different types of measurements.
     *
     * @static
     * @param {Measurement} measurement the class of measure being searched
     * @param {String} unit the unit to find
     * @returns {String|undefined} the normalized identifier for the given unit, or
     * undefined if there is no such unit in this type of measurement
     */
    getUnitIdCaseInsensitive: function(unit) {
        if (!unit) return false;

        // try with the original case first, just in case that works
        var ret = this.getUnitId(unit);
        if (ret) return ret;

        var u = unit.toLowerCase();
        if (this.aliasesLower && typeof(this.aliasesLower[u]) !== 'undefined') {
            return this.aliasesLower[u];
        }

        return undefined;
    }
};

/**
 * Return the normalized units identifier for the given unit. This looks up the units
 * in the aliases list and returns the normalized unit id.
 *
 * @static
 * @param {Measurement} measurement the class of measure being searched
 * @param {String} unit the unit to find
 * @returns {String|undefined} the normalized identifier for the given unit, or
 * undefined if there is no such unit in this type of measurement
 */
Measurement.getUnitId = function(measurement, unit) {
    if (!unit) return undefined;

    if (typeof(measurement.aliases[unit]) !== 'undefined') {
        return measurement.aliases[unit];
    }

    if (measurement.ratios && typeof(measurement.ratios[unit]) !== 'undefined') {
        return unit;
    }

    return undefined;
};

/**
 * Return the normalized units identifier for the given unit, searching case-insensitively.
 * This has the risk that things may match erroneously because many short form unit strings
 * are case-sensitive. This should method be used as a last resort if no case-sensitive match
 * is found amongst all the different types of measurements.
 *
 * @static
 * @param {Measurement} measurement the class of measure being searched
 * @param {String} unit the unit to find
 * @returns {String|undefined} the normalized identifier for the given unit, or
 * undefined if there is no such unit in this type of measurement
 */
Measurement.getUnitIdCaseInsensitive = function(measurement, unit) {
    if (!unit) return false;
    var u = unit.toLowerCase();

    // try this first, just in case
    var ret = Measurement.getUnitId(measurement, unit);
    if (ret) return ret;

    if (measurement.aliases && !measurement.aliasesLower) {
        measurement.aliasesLower = {};
        for (var a in measurement.aliases) {
            measurement.aliasesLower[a.toLowerCase()] = measurement.aliases[a];
        }
    }

    if (typeof(measurement.aliasesLower[u]) !== 'undefined') {
        return measurement.aliasesLower[u];
    }

    return undefined;
};

// Hard-code these because CLDR has incorrect data, plus this is small so we don't
// want to do an async load just to get it.
// Source: https://en.wikipedia.org/wiki/Metrication#Overview
var systems = {
    "uscustomary": ["US", "FM", "MH", "LR", "PR", "PW", "GU", "WS", "AS", "VI", "MP"],
    "imperial": ["GB", "MM"]
};

// every other country in the world is metric. Myanmar (MM) is adopting metric by 2019
// supposedly, and Liberia is as well

/**
* Return the name of the measurement system in use in the given locale.
*
* @param {string|Locale} locale the locale spec or Locale instance of the
*
* @returns {string} the name of the measurement system
*/
Measurement.getMeasurementSystemForLocale = function(locale) {
  var l = typeof(locale) === "object" ? locale : new Locale(locale);
  var region = l.getRegion();

  if (JSUtils.indexOf(systems.uscustomary, region) > -1) {
      return "uscustomary";
  } else if (JSUtils.indexOf(systems.imperial, region) > -1) {
      return "imperial";
  }

  return "metric";
};

module.exports = Measurement;
