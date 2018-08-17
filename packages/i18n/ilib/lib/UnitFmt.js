/*
 * UnitFmt.js - Unit formatter class
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
Locale.js
IString.js
NumFmt.js
Utils.js
Measurement.js
*/

// !data unitfmt

var ilib = require("./ilib.js");
var Utils = require("./Utils.js");
var JSUtils = require("./JSUtils.js");

var Locale = require("./Locale.js");
var IString = require("./IString.js");
var NumFmt = require("./NumFmt.js");
var ListFmt = require("./ListFmt.js");
var Measurement = require("./Measurement.js");

// for converting ilib lengths to the ones that are supported in cldr
var lenMap = {
  "full": "long",
  "long": "long",
  "medium": "short",
  "short": "short"
};

/**
 * @class
 * Create a new unit formatter instance. The unit formatter is immutable once
 * it is created, but can format as many different strings with different values
 * as needed with the same options. Create different unit formatter instances
 * for different purposes and then keep them cached for use later if you have
 * more than one unit string to format.<p>
 *
 * The options may contain any of the following properties:
 *
 * <ul>
 * <li><i>locale</i> - locale to use when formatting the units. The locale also
 * controls the translation of the names of the units. If the locale is
 * not specified, then the default locale of the app or web page will be used.
 *
 * <li><i>autoScale</i> - when true, automatically scale the amount to get the smallest
 * number greater than 1, where possible, possibly by converting units within the locale's
 * measurement system. For example, if the current locale is "en-US", and we have
 * a measurement containing 278 fluid ounces, then the number "278" can be scaled down
 * by converting the units to a larger one such as gallons. The scaled size would be
 * 2.17188 gallons. Since iLib does not have a US customary measure larger than gallons,
 * it cannot scale it down any further. If the amount is less than the smallest measure
 * already, it cannot be scaled down any further and no autoscaling will be applied.
 * Default for the autoScale property is "true", so it only needs to be specified when
 * you want to turn off autoscaling.
 *
 * <li><i>autoConvert</i> - automatically convert the units to the nearest appropriate
 * measure of the same type in the measurement system used by the locale. For example,
 * if a measurement of length is given in meters, but the current locale is "en-US"
 * which uses the US Customary system, then the nearest appropriate measure would be
 * "yards", and the amount would be converted from meters to yards automatically before
 * being formatted. Default for the autoConvert property is "true", so it only needs to
 * be specified when you want to turn off autoconversion.
 *
 * <li><i>usage</i> - describe the reason for the measure. For example, the usage of
 * a formatter may be for a "person height", which implies that certain customary units
 * should be used, even though other measures in the same system may be more efficient.
 * In US Customary measures, a person's height is traditionally given in feet and inches,
 * even though yards, feet and inches would be more efficient and logical.<p>
 *
 * Specifying a usage implies that the
 * autoScale is turned on so that the measure can be scaled to the level required for
 * the customary measures for the usage. Setting the usage can also implicitly set
 * the style, the max- and minFractionDigits, roundingMode, length, etc. if those
 * options are not explicitly given in this options object. If they are given, the
 * explicit settings override the defaults of the usage.<p>
 *
 * Usages imply that the formatter should be used with a specific type of measurement.
 * If the format method is called on a measurement that is of the wrong type for the
 * usage, it will be formatted as a regular measurement with default options.<p>
 *
 * List of usages currently supported:
 *   <ul>
 *   <li><i>general</i> no specific usage with no preselected measures. (Default which does not
 *   restrict the units used for any type of measurement.)
 *   <li><i>floorSpace</i> area of the floor of a house or building
 *   <li><i>landArea</i> area of a piece of plot of land
 *   <li><i>networkingSpeed</i> speed of transfer of data over a network
 *   <li><i>audioSpeed</i> speed of transfer of audio data
 *   <li><i>interfaceSpeed</i> speed of transfer of data over a computer interface such as a USB or SATA bus
 *   <li><i>foodEnergy</i> amount of energy contains in food
 *   <li><i>electricalEnergy</i> amount of energy in electricity
 *   <li><i>heatingEnergy</i> amount of energy required to heat things such as water or home interiors
 *   <li><i>babyHeight</i> length of a baby
 *   <li><i>personHeight</i> height of an adult or child (not a baby)
 *   <li><i>vehicleDistance</i> distance traveled by a vehicle or aircraft (except a boat)
 *   <li><i>nauticalDistance</i> distance traveled by a boat
 *   <li><i>personWeight</i> weight/mass of an adult human or larger child
 *   <li><i>babyWeight</i> weight/mass of a baby or of small animals such as cats and dogs
 *   <li><i>vehicleWeight</i> weight/mass of a vehicle (including a boat)
 *   <li><i>drugWeight</i> weight/mass of a medicinal drug
 *   <li><i>vehicleSpeed</i> speed of travel of a vehicle or aircraft (except a boat)
 *   <li><i>nauticalSpeed</i> speed of travel of a boat
 *   <li><i>dryFoodVolume</i> volume of a dry food substance in a recipe such as flour
 *   <li><i>liquidFoodVolume</i> volume of a liquid food substance in a recipe such as milk
 *   <li><i>drinkVolume</i> volume of a drink
 *   <li><i>fuelVolume</i> volume of a vehicular fuel
 *   <li><i>engineVolume</i> volume of an engine's combustion space
 *   <li><i>storageVolume</i> volume of a mass storage tank
 *   <li><i>gasVolume</i> volume of a gas such as natural gas used in a home
 *   </ul>
 *
 * <li><i>style</i> - give the style of this formatter. This is used to
 * decide how to format the number and units when the number is not whole, or becomes
 * not whole after auto conversion and scaling. There are two basic styles
 * supported so far:
 *
 *   <ul>
 *   <li><i>numeric</i> - only the largest unit is used and the number is given as
 *   decimals. Example: "5.25 lbs"
 *   <li><i>list</i> - display the measure with a list of successively smaller-sized
 *   units. Example: "5 lbs 4 oz"
 *   </ul>
 *
 * The style is most useful for units which are not powers of 10 greater than the
 * smaller units as in the metric system, though it can be useful for metric measures
 * as well. Example: "2kg 381g".<p>
 *
 * The style may be set implicitly when you set the usage. For example, if the usage is
 * "personWeight", the style will be "numeric" and the maxFractionDigits will be 0. That
 * is, weight of adults and children are most often given in whole pounds. (eg. "172 lbs").
 * If the usage is "babyWeight", the style will be "list", and the measures will be pounds
 * and ounces. (eg. "7 lbs 2 oz").
 *
 * <li><i>length</i> - the length of the units text. This can be either "short" or "long"
 * with the default being "long". Example: a short units text might be "kph" and the
 * corresponding long units text would be "kilometers per hour". Typically, it is the
 * long units text that is translated per locale, though the short one may be as well.
 * Plurals are taken care of properly per locale as well.
 *
 * <li><i>maxFractionDigits</i> - the maximum number of digits that should appear in the
 * formatted output after the decimal. A value of -1 means unlimited, and 0 means only print
 * the integral part of the number.
 *
 * <li><i>minFractionDigits</i> - the minimum number of fractional digits that should
 * appear in the formatted output. If the number does not have enough fractional digits
 * to reach this minimum, the number will be zero-padded at the end to get to the limit.
 *
 * <li><i>significantDigits</i> - the number of significant digits that should appear
 * in the formatted output. If the given number is less than 1, this option will be ignored.
 *
 * <li><i>roundingMode</i> - When the maxFractionDigits or maxIntegerDigits is specified,
 * this property governs how the least significant digits are rounded to conform to that
 * maximum. The value of this property is a string with one of the following values:
 * <ul>
 *   <li><i>up</i> - round away from zero
 *   <li><i>down</i> - round towards zero. This has the effect of truncating the number
 *   <li><i>ceiling</i> - round towards positive infinity
 *   <li><i>floor</i> - round towards negative infinity
 *   <li><i>halfup</i> - round towards nearest neighbour. If equidistant, round up.
 *   <li><i>halfdown</i> - round towards nearest neighbour. If equidistant, round down.
 *   <li><i>halfeven</i> - round towards nearest neighbour. If equidistant, round towards the even neighbour
 *   <li><i>halfodd</i> - round towards nearest neighbour. If equidistant, round towards the odd neighbour
 * </ul>
 * Default if this is not specified is "halfup".
 *
 * <li><i>onLoad</i> - a callback function to call when the date format object is fully
 * loaded. When the onLoad option is given, the UnitFmt object will attempt to
 * load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two.
 *
 * <li><i>sync</i> - tell whether to load any missing locale data synchronously or
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while.
 *
 * <li><i>loadParams</i> - an object containing parameters to pass to the
 * loader callback function when locale data is missing. The parameters are not
 * interpretted or modified in any way. They are simply passed along. The object
 * may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
 * </ul>
 *
 * Here is an example of how you might use the unit formatter to format a string with
 * the correct units.<p>
 *
 *
 * @constructor
 * @param {Object} options options governing the way this date formatter instance works
 */
var UnitFmt = function(options) {
    var sync = true,
        loadParams = undefined;

    this.length = "long";
    this.scale  = true;
    this.measurementType = 'undefined';
    this.convert = true;
    this.locale = new Locale();

    options = options || {sync: true};

    if (options.locale) {
        this.locale = (typeof(options.locale) === 'string') ? new Locale(options.locale) : options.locale;
    }

    if (typeof(options.sync) === 'boolean') {
        sync = options.sync;
    }

    if (typeof(options.loadParams) !== 'undefined') {
        loadParams = options.loadParams;
    }

    if (options.length) {
        this.length = lenMap[options.length] || "long";
    }

    if (typeof(options.autoScale) === 'boolean') {
        this.scale = options.autoScale;
    }

    if (typeof(options.style) === 'string') {
        this.style = options.style;
    }

    if (typeof(options.usage) === 'string') {
        this.usage = options.usage;
    }

    if (typeof(options.autoConvert) === 'boolean') {
        this.convert = options.autoConvert;
    }

    if (typeof(options.useNative) === 'boolean') {
        this.useNative = options.useNative;
    }

    if (options.measurementSystem) {
        this.measurementSystem = options.measurementSystem;
    }

    if (typeof (options.maxFractionDigits) !== 'undefined') {
        /**
         * @private
         * @type {number|undefined}
         */
        this.maxFractionDigits = Number(options.maxFractionDigits);
    }
    if (typeof (options.minFractionDigits) !== 'undefined') {
        /**
         * @private
         * @type {number|undefined}
         */
        this.minFractionDigits = Number(options.minFractionDigits);
    }

    if (typeof (options.significantDigits) !== 'undefined') {
        /**
         * @private
         * @type {number|undefined}
         */
        this.significantDigits = Number(options.significantDigits);
    }

    /**
     * @private
     * @type {string}
     */
    this.roundingMode = options.roundingMode || "halfup";

    // ensure that the plural rules are loaded before we proceed
    IString.loadPlurals(sync, this.locale, loadParams, ilib.bind(this, function() {
        Utils.loadData({
            object: "UnitFmt",
            locale: this.locale,
            name: "unitfmt.json",
            sync: sync,
            loadParams: loadParams,
            callback: ilib.bind(this, function (format) {
                this.template = format["unitfmt"][this.length];

                if (this.usage && format.usages && format.usages[this.usage]) {
                    // if usage is not recognized, usageInfo will be undefined, which we will use to indicate unknown usage
                    this.usageInfo = format.usages[this.usage];

                    // default settings for this usage, but don't override the options that were passed in
                    if (typeof(this.maxFractionDigits) !== 'number' && typeof(this.usageInfo.maxFractionDigits) === 'number') {
                        this.maxFractionDigits = this.usageInfo.maxFractionDigits;
                    }
                    if (typeof(this.minFractionDigits) !== 'number' && typeof(this.usageInfo.minFractionDigits) === 'number') {
                        this.minFractionDigits = this.usageInfo.minFractionDigits;
                    }
                    if (typeof(this.significantDigits) !== 'number' && typeof(this.usageInfo.significantDigits) === 'number') {
                        this.significantDigits = this.usageInfo.significantDigits;
                    }
                    if (!this.measurementSystem && this.usageInfo.system) {
                        this.measurementSystem = this.usageInfo.system;
                    }
                    this.units = this.usageInfo.units;
                    if (!this.style && this.usageInfo.style) {
                        this.style = this.usageInfo.style;
                    }

                    if (this.usageInfo.systems) {
                        this.units = {
                            metric: this.usageInfo.systems.metric.units,
                            uscustomary: this.usageInfo.systems.uscustomary.units,
                            imperial: this.usageInfo.systems.imperial.units
                        };
                        this.numFmt = {};
                        this._initNumFmt(sync, loadParams, this.usageInfo.systems.metric, ilib.bind(this, function(numfmt) {
                            this.numFmt.metric = numfmt;
                            this._initNumFmt(sync, loadParams, this.usageInfo.systems.uscustomary, ilib.bind(this, function(numfmt) {
                                this.numFmt.uscustomary = numfmt;
                                this._initNumFmt(sync, loadParams, this.usageInfo.systems.imperial, ilib.bind(this, function(numfmt) {
                                    this.numFmt.imperial = numfmt;
                                    this._init(sync, loadParams, ilib.bind(this, function () {
                                        if (options && typeof(options.onLoad) === 'function') {
                                            options.onLoad(this);
                                        }
                                    }));
                                }));
                            }));
                        }));
                    } else {
                        this._initFormatters(sync, loadParams, {}, ilib.bind(this, function() {
                            if (options && typeof(options.onLoad) === 'function') {
                                options.onLoad(this);
                            }
                        }));
                    }
                } else {
                    this._initFormatters(sync, loadParams, {}, ilib.bind(this, function() {
                        if (options && typeof(options.onLoad) === 'function') {
                            options.onLoad(this);
                        }
                    }));
                }
            })
        });
    }));
};

UnitFmt.prototype = {
    /** @private */
    _initNumFmt: function(sync, loadParams, options, callback) {
        new NumFmt({
            locale: this.locale,
            useNative: this.useNative,
            maxFractionDigits: typeof(this.maxFractionDigits) !== 'undefined' ? this.maxFractionDigits : options.maxFractionDigits,
            minFractionDigits: typeof(this.minFractionDigits) !== 'undefined' ? this.minFractionDigits : options.minFractionDigits,
            significantDigits: typeof(this.significantDigits) !== 'undefined' ? this.significantDigits : options.significantDigits,
            roundingMode: this.roundingMode || options.roundingMode,
            sync: sync,
            loadParams: loadParams,
            onLoad: ilib.bind(this, function (numfmt) {
                callback(numfmt);
            })
        });
    },

    _initFormatters: function(sync, loadParams, options, callback) {
        this._initNumFmt(sync, loadParams, {}, ilib.bind(this, function(numfmt) {
            this.numFmt = {
                metric: numfmt,
                uscustomary: numfmt,
                imperial: numfmt
            };

            this._init(sync, loadParams, callback);
        }));
    },

    /** @private */
    _init: function(sync, loadParams, callback) {
        if (this.style === "list" || (this.usageInfo && this.usageInfo.systems &&
                (this.usageInfo.systems.metric.style === "list" ||
                this.usageInfo.systems.uscustomary.style === "list" ||
                this.usageInfo.systems.imperial.style === "list"))) {
            new ListFmt({
                locale: this.locale,
                style: "unit",
                sync: sync,
                loadParams: loadParams,
                onLoad: ilib.bind(this, function (listFmt) {
                    this.listFmt = listFmt;
                    callback();
                })
            });
        } else {
            callback();
        }
    },

    /**
     * Return the locale used with this formatter instance.
     * @return {Locale} the Locale instance for this formatter
     */
    getLocale: function() {
        return this.locale;
    },

    /**
     * Return the template string that is used to format date/times for this
     * formatter instance. This will work, even when the template property is not explicitly
     * given in the options to the constructor. Without the template option, the constructor
     * will build the appropriate template according to the options and use that template
     * in the format method.
     *
     * @return {string} the format template for this formatter
     */
    getTemplate: function() {
        return this.template;
    },

    /**
     * Convert this formatter to a string representation by returning the
     * format template. This method delegates to getTemplate.
     *
     * @return {string} the format template
     */
    toString: function() {
        return this.getTemplate();
    },

    /**
     * Return whether or not this formatter will auto-scale the units while formatting.
     * @returns {boolean} true if auto-scaling is turned on
     */
    getScale: function() {
        return this.scale;
    },

    /**
     * Return the measurement system that is used for this formatter.
     * @returns {string} the measurement system used in this formatter
     */
    getMeasurementSystem: function() {
        return this.measurementSystem;
    },

    /**
     * @private
     */
    _format: function(u, system) {
        var unit = u.getUnit() === "long-ton" ? "ton" : u.getUnit();
        var formatted = new IString(this.template[unit]);
        // make sure to use the right plural rules
        formatted.setLocale(this.locale, true, undefined, undefined);
        var rounded = this.numFmt[system].constrain(u.amount);
        formatted = formatted.formatChoice(rounded, {n: this.numFmt[system].format(u.amount)});
        return formatted.length > 0 ? formatted : rounded + " " + u.unit;
    },

    /**
     * Format a particular unit instance according to the settings of this
     * formatter object.
     *
     * @param {Measurement} measurement measurement to format
     * @return {string} the formatted version of the given date instance
     */
    format: function (measurement) {
        var u = measurement, system, listStyle;
        var doScale = this.scale;

        if (this.convert) {
            if (this.measurementSystem) {
                if (this.measurementSystem !== measurement.getMeasurementSystem()) {
                    u = u.convertSystem(this.measurementSystem);
                }
            } else if (!this.usageInfo || Measurement.getMeasurementSystemForLocale(this.locale) !== u.getMeasurementSystem()) {
                u = measurement.localize(this.locale);
            }

            doScale = (this.usageInfo && measurement.getMeasurementSystem() !== u.getMeasurementSystem()) || this.scale;
        }

        system = u.getMeasurementSystem() || this.getMeasurementSystem() || "metric";
        listStyle = (this.style === "list" || (this.usageInfo && this.usageInfo.systems && this.usageInfo.systems[system].style === "list"));

        if (doScale) {
            if (this.usageInfo && measurement.getMeasure() === this.usageInfo.type && !listStyle) {
                // scaling with a restricted set of units
                u = u.scale(system, this.units);
            } else {
                u = u.scale(); // scale within the current system
            }
        }

        if (listStyle) {
            var numFmt = this.numFmt[system];
            u = u.expand(undefined, this.units, ilib.bind(numFmt, numFmt.constrain), this.scale);
            var formatted = u.map(ilib.bind(this, function(unit) {
                return this._format(unit, system);
            }));
            if (this.listFmt && formatted.length) {
                return this.listFmt.format(formatted);
            } else {
                return formatted.join(' ');
            }
        } else {
            return this._format(u, system);
        }
    }
};

module.exports = UnitFmt;