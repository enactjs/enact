/*
 * PersianDate.js - Represent a date in the Persian astronomical (Hijjri) calendar
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

/* !depends
ilib.js
Locale.js
TimeZone.js
IDate.js
PersRataDie.js
PersianCal.js
SearchUtils.js
MathUtils.js
JSUtils.js
LocaleInfo.js
Astro.js
*/

// !data astro

var ilib = require("./ilib.js");
var SearchUtils = require("./SearchUtils.js");
var MathUtils = require("./MathUtils.js");
var JSUtils = require("./JSUtils.js");
var Locale = require("./Locale.js");
var LocaleInfo = require("./LocaleInfo.js");
var TimeZone = require("./TimeZone.js");
var IDate = require("./IDate.js");
var Calendar = require("./Calendar.js");

var Astro = require("./Astro.js");
var PersianCal = require("./PersianCal.js");
var PersRataDie = require("./PersRataDie.js");

/**
 * @class
 *
 * Construct a new Persian astronomical date object. The constructor parameters can
 * contain any of the following properties:
 *
 * <ul>
 * <li><i>unixtime<i> - sets the time of this instance according to the given
 * unix time. Unix time is the number of milliseconds since midnight on Jan 1, 1970, Gregorian
 *
 * <li><i>julianday</i> - sets the time of this instance according to the given
 * Julian Day instance or the Julian Day given as a float
 *
 * <li><i>year</i> - any integer, including 0
 *
 * <li><i>month</i> - 1 to 12, where 1 means Farvardin, 2 means Ordibehesht, etc.
 *
 * <li><i>day</i> - 1 to 31
 *
 * <li><i>hour</i> - 0 to 23. A formatter is used to display 12 hour clocks, but this representation
 * is always done with an unambiguous 24 hour representation
 *
 * <li><i>minute</i> - 0 to 59
 *
 * <li><i>second</i> - 0 to 59
 *
 * <li><i>millisecond</i> - 0 to 999
 *
 * <li><i>timezone</i> - the TimeZone instance or time zone name as a string
 * of this persian date. The date/time is kept in the local time. The time zone
 * is used later if this date is formatted according to a different time zone and
 * the difference has to be calculated, or when the date format has a time zone
 * component in it.
 *
 * <li><i>locale</i> - locale for this persian date. If the time zone is not
 * given, it can be inferred from this locale. For locales that span multiple
 * time zones, the one with the largest population is chosen as the one that
 * represents the locale.
 *
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
 * </ul>
 *
 * If the constructor is called with another Persian date instance instead of
 * a parameter block, the other instance acts as a parameter block and its
 * settings are copied into the current instance.<p>
 *
 * If the constructor is called with no arguments at all or if none of the
 * properties listed above
 * from <i>unixtime</i> through <i>millisecond</i> are present, then the date
 * components are
 * filled in with the current date at the time of instantiation. Note that if
 * you do not give the time zone when defaulting to the current time and the
 * time zone for all of ilib was not set with <i>ilib.setTimeZone()</i>, then the
 * time zone will default to UTC ("Universal Time, Coordinated" or "Greenwich
 * Mean Time").<p>
 *
 * If any of the properties from <i>year</i> through <i>millisecond</i> are not
 * specified in the params, it is assumed that they have the smallest possible
 * value in the range for the property (zero or one).<p>
 *
 *
 * @constructor
 * @extends IDate
 * @param {Object=} params parameters that govern the settings and behaviour of this Persian date
 */
var PersianDate = function(params) {
    this.cal = new PersianCal();

    params = params || {};

    if (params.timezone) {
        this.timezone = params.timezone;
    }
    if (params.locale) {
        this.locale = (typeof(params.locale) === 'string') ? new Locale(params.locale) : params.locale;
    }

    if (!this.timezone) {
        if (this.locale) {
            new LocaleInfo(this.locale, {
                sync: params.sync,
                loadParams: params.loadParams,
                onLoad: ilib.bind(this, function(li) {
                    this.li = li;
                    this.timezone = li.getTimeZone();
                    this._init(params);
                })
            });
        } else {
            this.timezone = "local";
            this._init(params);
        }
    } else {
        this._init(params);
    }
};

PersianDate.prototype = new IDate({noinstance: true});
PersianDate.prototype.parent = IDate;
PersianDate.prototype.constructor = PersianDate;

/**
 * @private
 * Initialize this date object
 */
PersianDate.prototype._init = function (params) {
    Astro.initAstro(
        typeof(params.sync) === 'boolean' ? params.sync : true,
        params.loadParams,
        ilib.bind(this, function (x) {
            if (params.year || params.month || params.day || params.hour ||
                    params.minute || params.second || params.millisecond) {
                /**
                 * Year in the Persian calendar.
                 * @type number
                 */
                this.year = parseInt(params.year, 10) || 0;

                /**
                 * The month number, ranging from 1 to 12
                 * @type number
                 */
                this.month = parseInt(params.month, 10) || 1;

                /**
                 * The day of the month. This ranges from 1 to 31.
                 * @type number
                 */
                this.day = parseInt(params.day, 10) || 1;

                /**
                 * The hour of the day. This can be a number from 0 to 23, as times are
                 * stored unambiguously in the 24-hour clock.
                 * @type number
                 */
                this.hour = parseInt(params.hour, 10) || 0;

                /**
                 * The minute of the hours. Ranges from 0 to 59.
                 * @type number
                 */
                this.minute = parseInt(params.minute, 10) || 0;

                /**
                 * The second of the minute. Ranges from 0 to 59.
                 * @type number
                 */
                this.second = parseInt(params.second, 10) || 0;

                /**
                 * The millisecond of the second. Ranges from 0 to 999.
                 * @type number
                 */
                this.millisecond = parseInt(params.millisecond, 10) || 0;

                /**
                 * The day of the year. Ranges from 1 to 366.
                 * @type number
                 */
                this.dayOfYear = parseInt(params.dayOfYear, 10);

                if (typeof(params.dst) === 'boolean') {
                    this.dst = params.dst;
                }

                this.newRd(JSUtils.merge(params, {
                    callback: ilib.bind(this, function(rd) {
                        this.rd = rd;

                        new TimeZone({
                            id: this.timezone,
                            sync: params.sync,
                            loadParams: params.loadParams,
                            onLoad: ilib.bind(this, function(tz) {
                                this.tz = tz;
                                // add the time zone offset to the rd to convert to UTC
                                // getOffsetMillis requires that this.year, this.rd, and this.dst
                                // are set in order to figure out which time zone rules apply and
                                // what the offset is at that point in the year
                                this.offset = this.tz._getOffsetMillisWallTime(this) / 86400000;
                                if (this.offset !== 0) {
                                    this.rd = this.newRd({
                                        rd: this.rd.getRataDie() - this.offset
                                    });
                                }
                                this._init2(params);
                            })
                        });
                    })
                }));

            } else {
                this._init2(params);
            }
        })
    );
};

/**
 * @private
 * Finish initializing this date object
 */
PersianDate.prototype._init2 = function (params) {
    if (!this.rd) {
        this.newRd(JSUtils.merge(params, {
            callback: ilib.bind(this, function(rd) {
                this.rd = rd;
                this._calcDateComponents();

                if (typeof(params.onLoad) === "function") {
                    params.onLoad(this);
                }
            })
        }));
    } else {
        if (typeof(params.onLoad) === "function") {
            params.onLoad(this);
        }
    }
};

/**
 * @private
 * @const
 * @type Array.<number>
 * the cumulative lengths of each month, for a non-leap year
 */
PersianDate.cumMonthLengths = [
    0,    // Farvardin
	31,   // Ordibehesht
	62,   // Khordad
	93,   // Tir
	124,  // Mordad
	155,  // Shahrivar
	186,  // Mehr
	216,  // Aban
	246,  // Azar
	276,  // Dey
	306,  // Bahman
	336,  // Esfand
	366
];

/**
 * Return a new RD for this date type using the given params.
 * @protected
 * @param {Object=} params the parameters used to create this rata die instance
 * @returns {RataDie} the new RD instance for the given params
 */
PersianDate.prototype.newRd = function (params) {
	return new PersRataDie(params);
};

/**
 * Return the year for the given RD
 * @protected
 * @param {number} rd RD to calculate from
 * @returns {number} the year for the RD
 */
PersianDate.prototype._calcYear = function(rd) {
	var julianday = rd + this.rd.epoch;
	return this.rd._getYear(julianday).year;
};

/**
 * @private
 * Calculate date components for the given RD date.
 */
PersianDate.prototype._calcDateComponents = function () {
	var remainder,
		rd = this.rd.getRataDie();

	this.year = this._calcYear(rd);

	if (typeof(this.offset) === "undefined") {
		// now offset the RD by the time zone, then recalculate in case we were
		// near the year boundary
		if (!this.tz) {
			this.tz = new TimeZone({id: this.timezone});
		}
		this.offset = this.tz.getOffsetMillis(this) / 86400000;
	}

	if (this.offset !== 0) {
		rd += this.offset;
		this.year = this._calcYear(rd);
	}

	//console.log("PersDate.calcComponent: calculating for rd " + rd);
	//console.log("PersDate.calcComponent: year is " + ret.year);
	var yearStart = this.newRd({
		year: this.year,
		month: 1,
		day: 1,
		hour: 0,
		minute: 0,
		second: 0,
		millisecond: 0
	});
	remainder = rd - yearStart.getRataDie() + 1;

	this.dayOfYear = remainder;

	//console.log("PersDate.calcComponent: remainder is " + remainder);

	this.month = SearchUtils.bsearch(Math.floor(remainder), PersianDate.cumMonthLengths);
	remainder -= PersianDate.cumMonthLengths[this.month-1];

	//console.log("PersDate.calcComponent: month is " + this.month + " and remainder is " + remainder);

	this.day = Math.floor(remainder);
	remainder -= this.day;

	//console.log("PersDate.calcComponent: day is " + this.day + " and remainder is " + remainder);

	// now convert to milliseconds for the rest of the calculation
	remainder = Math.round(remainder * 86400000);

	this.hour = Math.floor(remainder/3600000);
	remainder -= this.hour * 3600000;

	this.minute = Math.floor(remainder/60000);
	remainder -= this.minute * 60000;

	this.second = Math.floor(remainder/1000);
	remainder -= this.second * 1000;

	this.millisecond = remainder;
};

/**
 * Return the day of the week of this date. The day of the week is encoded
 * as number from 0 to 6, with 0=Sunday, 1=Monday, etc., until 6=Saturday.
 *
 * @return {number} the day of the week
 */
PersianDate.prototype.getDayOfWeek = function() {
	var rd = Math.floor(this.getRataDie());
	return MathUtils.mod(rd-3, 7);
};

/**
 * Return the ordinal day of the year. Days are counted from 1 and proceed linearly up to
 * 365, regardless of months or weeks, etc. That is, Farvardin 1st is day 1, and
 * December 31st is 365 in regular years, or 366 in leap years.
 * @return {number} the ordinal day of the year
 */
PersianDate.prototype.getDayOfYear = function() {
	return PersianDate.cumMonthLengths[this.month-1] + this.day;
};

/**
 * Return the era for this date as a number. The value for the era for Persian
 * calendars is -1 for "before the persian era" (BP) and 1 for "the persian era" (anno
 * persico or AP).
 * BP dates are any date before Farvardin 1, 1 AP. In the proleptic Persian calendar,
 * there is a year 0, so any years that are negative or zero are BP.
 * @return {number} 1 if this date is in the common era, -1 if it is before the
 * common era
 */
PersianDate.prototype.getEra = function() {
	return (this.year < 1) ? -1 : 1;
};

/**
 * Return the name of the calendar that governs this date.
 *
 * @return {string} a string giving the name of the calendar
 */
PersianDate.prototype.getCalendar = function() {
	return "persian";
};

// register with the factory method
IDate._constructors["persian"] = PersianDate;

module.exports = PersianDate;