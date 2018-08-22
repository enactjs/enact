/*
 * GregorianDate.js - Represent a date in the Gregorian calendar
 *
 * Copyright © 2012-2015, 2018, JEDLSoft
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
IDate.js 
GregorianCal.js 
SearchUtils.js
MathUtils.js
Locale.js
LocaleInfo.js 
JulianDay.js
GregRataDie.js
TimeZone.js
*/

var ilib = require("./ilib.js");
var SearchUtils = require("./SearchUtils.js");
var MathUtils = require("./MathUtils.js");

var Locale = require("./Locale.js");
var LocaleInfo = require("./LocaleInfo.js");
var JulianDay = require("./JulianDay.js");
var IDate = require("./IDate.js");
var TimeZone = require("./TimeZone.js");
var Calendar = require("./Calendar.js");

var GregorianCal = require("./GregorianCal.js");
var GregRataDie = require("./GregRataDie.js");

/**
 * @class
 * Construct a new Gregorian date object. The constructor parameters can
 * contain any of the following properties:
 *
 * <ul>
 * <li><i>unixtime<i> - sets the time of this instance according to the given
 * unix time. Unix time is the number of milliseconds since midnight on Jan 1, 1970.
 *
 * <li><i>julianday</i> - sets the time of this instance according to the given
 * Julian Day instance or the Julian Day given as a float
 *
 * <li><i>year</i> - any integer, including 0
 *
 * <li><i>month</i> - 1 to 12, where 1 means January, 2 means February, etc.
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
 * <li><i>dst</i> - boolean used to specify whether the given time components are
 * intended to be in daylight time or not. This is only used in the overlap
 * time when transitioning from DST to standard time, and the time components are
 * ambiguous. Otherwise at all other times of the year, this flag is ignored.
 * If you specify the date using unix time (UTC) or a julian day, then the time is
 * already unambiguous and this flag does not need to be specified.
 * <p>
 * For example, in the US, the transition out of daylight savings time
 * in 2014 happens at Nov 2, 2014 2:00am Daylight Time, when the time falls
 * back to Nov 2, 2014 1:00am Standard Time. If you give a date/time components as
 * "Nov 2, 2014 1:30am", then there are two 1:30am times in that day, and you would
 * have to give the standard flag to indicate which of those two you mean.
 * (dst=true means daylight time, dst=false means standard time).
 *
 * <li><i>timezone</i> - the TimeZone instance or time zone name as a string
 * of this gregorian date. The date/time is kept in the local time. The time zone
 * is used later if this date is formatted according to a different time zone and
 * the difference has to be calculated, or when the date format has a time zone
 * component in it.
 *
 * <li><i>locale</i> - locale for this gregorian date. If the time zone is not
 * given, it can be inferred from this locale. For locales that span multiple
 * time zones, the one with the largest population is chosen as the one that
 * represents the locale.
 *
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
 *
 * <li><i>onLoad</i> - a callback function to call when this date object is fully
 * loaded. When the onLoad option is given, this date object will attempt to
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
 * If the constructor is called with another Gregorian date instance instead of
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
 * @param {Object=} params parameters that govern the settings and behaviour of this Gregorian date
 */
var GregorianDate = function(params) {
    this.cal = new GregorianCal();

    params = params || {};
    if (typeof(params.noinstance) === 'boolean' && params.noinstance) {
        // for doing inheritance, so don't need to fill in the data. The
        // inheriting class only wants the methods.
        return;
    }

    if (params.timezone) {
        this.timezone = params.timezone.toString();
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

GregorianDate.prototype = new IDate({noinstance: true});
GregorianDate.prototype.parent = IDate;
GregorianDate.prototype.constructor = GregorianDate;

/**
 * @private
 * Initialize this date object
 */
GregorianDate.prototype._init = function (params) {
    if (params.year || params.month || params.day || params.hour ||
        params.minute || params.second || params.millisecond ) {
        this.year = parseInt(params.year, 10) || 0;
        this.month = parseInt(params.month, 10) || 1;
        this.day = parseInt(params.day, 10) || 1;
        this.hour = parseInt(params.hour, 10) || 0;
        this.minute = parseInt(params.minute, 10) || 0;
        this.second = parseInt(params.second, 10) || 0;
        this.millisecond = parseInt(params.millisecond, 10) || 0;
        if (typeof(params.dst) === 'boolean') {
            this.dst = params.dst;
        }
        this.rd = this.newRd(params);

        // add the time zone offset to the rd to convert to UTC
        this.offset = 0;
        if (this.timezone === "local" && typeof(params.dst) === 'undefined') {
            // if dst is defined, the intrinsic Date object has no way of specifying which version of a time you mean
            // in the overlap time at the end of DST. Do you mean the daylight 1:30am or the standard 1:30am? In this
            // case, use the ilib calculations below, which can distinguish between the two properly
            var d = new Date(this.year, this.month-1, this.day, this.hour, this.minute, this.second, this.millisecond);
            var hBefore = new Date(this.year, this.month-1, this.day, this.hour - 1, this.minute, this.second, this.millisecond);
            this.offset = -d.getTimezoneOffset() / 1440;
            if (d.getTimezoneOffset() < hBefore.getTimezoneOffset()) {
                var startOffset = -hBefore.getTimezoneOffset() / 1440;
                this.rd = this.newRd({
                    rd: this.rd.getRataDie() - startOffset
                });
            } else {
                this.rd = this.newRd({
                    rd: this.rd.getRataDie() - this.offset
                });
            }
            this._init2(params);
        } else {
            new TimeZone({
                id: this.timezone,
                sync: params.sync,
                loadParams: params.loadParams,
                onLoad: ilib.bind(this, function(tz) {
                    this.tz = tz;

                    // getOffsetMillis requires that this.year, this.rd, and this.dst
                    // are set in order to figure out which time zone rules apply and
                    // what the offset is at that point in the year
                    this.offset = this.tz._getOffsetMillisWallTime(this) / 86400000;
                    this.rd = this.newRd({
                        rd: this.rd.getRataDie() - this.offset
                    });
                    this._init2(params);
                })
            });
        }
    } else {
        this._init2(params);
    }
};

/**
 * @private
 * Finish initializing this date object
 */
GregorianDate.prototype._init2 = function (params) {
    if (!this.rd) {
        this.rd = this.newRd(params);
        this._calcDateComponents();
    }

    if (typeof(params.onLoad) === "function") {
        params.onLoad(this);
    }
};

/**
 * Return a new RD for this date type using the given params.
 * @private
 * @param {Object=} params the parameters used to create this rata die instance
 * @returns {RataDie} the new RD instance for the given params
 */
GregorianDate.prototype.newRd = function (params) {
	return new GregRataDie(params);
};

/**
 * Calculates the Gregorian year for a given rd number.
 * @private
 * @static
 */
GregorianDate._calcYear = function(rd) {
	var days400,
		days100,
		days4,
		years400,
		years100,
		years4,
		years1,
		year;

	years400 = Math.floor((rd - 1) / 146097);
	days400 = MathUtils.mod((rd - 1), 146097);
	years100 = Math.floor(days400 / 36524);
	days100 = MathUtils.mod(days400, 36524);
	years4 = Math.floor(days100 / 1461);
	days4 = MathUtils.mod(days100, 1461);
	years1 = Math.floor(days4 / 365);

	year = 400 * years400 + 100 * years100 + 4 * years4 + years1;
	if (years100 !== 4 && years1 !== 4) {
		year++;
	}
	return year;
};

/**
 * @private
 */
GregorianDate.prototype._calcYear = function(rd) {
	return GregorianDate._calcYear(rd);
};

/**
 * Calculate the date components for the current time zone
 * @private
 */
GregorianDate.prototype._calcDateComponents = function () {
	if (this.timezone === "local" && this.rd.getRataDie() >= -99280837 && this.rd.getRataDie() <= 100719163) {
		// console.log("using js Date to calculate offset");
		// use the intrinsic JS Date object to do the tz conversion for us, which
		// guarantees that it follows the system tz database settings
		var d = new Date(this.rd.getTimeExtended());

		/**
		 * Year in the Gregorian calendar.
		 * @type number
		 */
		this.year = d.getFullYear();

		/**
		 * The month number, ranging from 1 (January) to 12 (December).
		 * @type number
		 */
		this.month = d.getMonth()+1;

		/**
		 * The day of the month. This ranges from 1 to 31.
		 * @type number
		 */
		this.day = d.getDate();

		/**
		 * The hour of the day. This can be a number from 0 to 23, as times are
		 * stored unambiguously in the 24-hour clock.
		 * @type number
		 */
		this.hour = d.getHours();

		/**
		 * The minute of the hours. Ranges from 0 to 59.
		 * @type number
		 */
		this.minute = d.getMinutes();

		/**
		 * The second of the minute. Ranges from 0 to 59.
		 * @type number
		 */
		this.second = d.getSeconds();

		/**
		 * The millisecond of the second. Ranges from 0 to 999.
		 * @type number
		 */
		this.millisecond = d.getMilliseconds();

		this.offset = -d.getTimezoneOffset() / 1440;
	} else {
		// console.log("using ilib to calculate offset. tz is " + this.timezone);
		// console.log("GregDate._calcDateComponents: date is " + JSON.stringify(this) + " parent is " + JSON.stringify(this.parent) + " and parent.parent is " + JSON.stringify(this.parent.parent));
		if (typeof(this.offset) === "undefined") {
			// console.log("calculating offset");
			this.year = this._calcYear(this.rd.getRataDie());

			// now offset the RD by the time zone, then recalculate in case we were
			// near the year boundary
			if (!this.tz) {
				this.tz = new TimeZone({id: this.timezone});
			}
			this.offset = this.tz.getOffsetMillis(this) / 86400000;
		// } else {
			// console.log("offset is already defined somehow. type is " + typeof(this.offset));
			// console.trace("Stack is this one");
		}
		// console.log("offset is " + this.offset);
		var rd = this.rd.getRataDie();
		if (this.offset !== 0) {
			rd += this.offset;
		}
		this.year = this._calcYear(rd);

		var yearStartRd = this.newRd({
			year: this.year,
			month: 1,
			day: 1,
			cal: this.cal
		});

		// remainder is days into the year
		var remainder = rd - yearStartRd.getRataDie() + 1;

		var cumulative = GregorianCal.prototype.isLeapYear.call(this.cal, this.year) ?
			GregRataDie.cumMonthLengthsLeap :
			GregRataDie.cumMonthLengths;

		this.month = SearchUtils.bsearch(Math.floor(remainder), cumulative);
		remainder = remainder - cumulative[this.month-1];

		this.day = Math.floor(remainder);
		remainder -= this.day;
		// now convert to milliseconds for the rest of the calculation
		remainder = Math.round(remainder * 86400000);

		this.hour = Math.floor(remainder/3600000);
		remainder -= this.hour * 3600000;

		this.minute = Math.floor(remainder/60000);
		remainder -= this.minute * 60000;

		this.second = Math.floor(remainder/1000);
		remainder -= this.second * 1000;

		this.millisecond = Math.floor(remainder);
	}
};

/**
 * Return the day of the week of this date. The day of the week is encoded
 * as number from 0 to 6, with 0=Sunday, 1=Monday, etc., until 6=Saturday.
 *
 * @return {number} the day of the week
 */
GregorianDate.prototype.getDayOfWeek = function() {
	var rd = Math.floor(this.rd.getRataDie() + (this.offset || 0));
	return MathUtils.mod(rd, 7);
};

/**
 * Return the ordinal day of the year. Days are counted from 1 and proceed linearly up to
 * 365, regardless of months or weeks, etc. That is, January 1st is day 1, and
 * December 31st is 365 in regular years, or 366 in leap years.
 * @return {number} the ordinal day of the year
 */
GregorianDate.prototype.getDayOfYear = function() {
	var cumulativeMap = this.cal.isLeapYear(this.year) ?
		GregRataDie.cumMonthLengthsLeap :
		GregRataDie.cumMonthLengths;

	return cumulativeMap[this.month-1] + this.day;
};

/**
 * Return the era for this date as a number. The value for the era for Gregorian
 * calendars is -1 for "before the common era" (BCE) and 1 for "the common era" (CE).
 * BCE dates are any date before Jan 1, 1 CE. In the proleptic Gregorian calendar,
 * there is a year 0, so any years that are negative or zero are BCE. In the Julian
 * calendar, there is no year 0. Instead, the calendar goes straight from year -1 to
 * 1.
 * @return {number} 1 if this date is in the common era, -1 if it is before the
 * common era
 */
GregorianDate.prototype.getEra = function() {
	return (this.year < 1) ? -1 : 1;
};

/**
 * Return the name of the calendar that governs this date.
 *
 * @return {string} a string giving the name of the calendar
 */
GregorianDate.prototype.getCalendar = function() {
	return "gregorian";
};

// register with the factory method
IDate._constructors["gregorian"] = GregorianDate;

module.exports = GregorianDate;
