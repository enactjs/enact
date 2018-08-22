/*
 * HanDate.js - Represent a date in the Han algorithmic calendar
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
IDate.js
GregorianDate.js 
HanCal.js
Astro.js 
JSUtils.js
MathUtils.js
LocaleInfo.js 
Locale.js
TimeZone.js
HanRataDie.js
RataDie.js
*/

var ilib = require("./ilib.js");
var JSUtils = require("./JSUtils.js");
var MathUtils = require("./MathUtils.js");

var Locale = require("./Locale.js");
var LocaleInfo = require("./LocaleInfo.js");
var IDate = require("./IDate.js");
var TimeZone = require("./TimeZone.js");
var Calendar = require("./Calendar.js");

var Astro = require("./Astro.js");
var HanCal = require("./HanCal.js");
var GregorianDate = require("./GregorianDate.js");
var HanRataDie = require("./HanRataDie.js");
var RataDie = require("./RataDie.js");

/**
 * @class
 * 
 * Construct a new Han date object. The constructor parameters can 
 * contain any of the following properties:
 * 
 * <ul>
 * <li><i>unixtime<i> - sets the time of this instance according to the given 
 * unix time. Unix time is the number of milliseconds since midnight on Jan 1, 1970, Gregorian
 * 
 * <li><i>julianday</i> - sets the time of this instance according to the given
 * Julian Day instance or the Julian Day given as a float
 * 
 * <li><i>cycle</i> - any integer giving the number of 60-year cycle in which the date is located.
 * If the cycle is not given but the year is, it is assumed that the year parameter is a fictitious 
 * linear count of years since the beginning of the epoch, much like other calendars. This linear
 * count is never used. If both the cycle and year are given, the year is wrapped to the range 0 
 * to 60 and treated as if it were a year in the regular 60-year cycle.
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
 * of this han date. The date/time is kept in the local time. The time zone
 * is used later if this date is formatted according to a different time zone and
 * the difference has to be calculated, or when the date format has a time zone
 * component in it.
 * 
 * <li><i>locale</i> - locale for this han date. If the time zone is not 
 * given, it can be inferred from this locale. For locales that span multiple
 * time zones, the one with the largest population is chosen as the one that 
 * represents the locale.
 * 
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
 * </ul>
 *
 * If the constructor is called with another Han date instance instead of
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
 * @extends Date
 * @param {Object=} params parameters that govern the settings and behaviour of this Han date
 */
var HanDate = function(params) {
	params = params || {};
	if (params.locale) {
		this.locale = (typeof(params.locale) === 'string') ? new Locale(params.locale) : params.locale;
	}
	if (params.timezone) {
		this.timezone = params.timezone;
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

HanDate.prototype = new IDate({noinstance: true});
HanDate.prototype.parent = IDate;
HanDate.prototype.constructor = HanDate;

/**
 * Initialize the han date
 * @private
 */
HanDate.prototype._init = function (params) {
    new HanCal({
        sync: params && typeof(params.sync) === 'boolean' ? params.sync : true,
        loadParams: params && params.loadParams,
        onLoad: ilib.bind(this, function (cal) {
            this.cal = cal;
    
            if (params.year || params.month || params.day || params.hour ||
                params.minute || params.second || params.millisecond || params.cycle || params.cycleYear) {
                if (typeof(params.cycle) !== 'undefined') {
                    /**
                     * Cycle number in the Han calendar.
                     * @type number
                     */
                    this.cycle = parseInt(params.cycle, 10) || 0;
                    
                    var year = (typeof(params.year) !== 'undefined' ? parseInt(params.year, 10) : parseInt(params.cycleYear, 10)) || 0;
                    
                    /**
                     * Year in the Han calendar.
                     * @type number
                     */
                    this.year = HanCal._getElapsedYear(year, this.cycle);
                } else {
                    if (typeof(params.year) !== 'undefined') {
                        this.year = parseInt(params.year, 10) || 0;
                        this.cycle = Math.floor((this.year - 1) / 60);
                    } else {
                        this.year = this.cycle = 0;
                    }
                }   
                
                /**
                 * The month number, ranging from 1 to 13
                 * @type number
                 */
                this.month = parseInt(params.month, 10) || 1;
    
                /**
                 * The day of the month. This ranges from 1 to 30.
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
            
                // derived properties
                
                /**
                 * Year in the cycle of the Han calendar
                 * @type number
                 */
                this.cycleYear = MathUtils.amod(this.year, 60); 

                /**
                 * The day of the year. Ranges from 1 to 384.
                 * @type number
                 */
                this.dayOfYear = parseInt(params.dayOfYear, 10);
    
                if (typeof(params.dst) === 'boolean') {
                    this.dst = params.dst;
                }
                
                this.newRd({
                    cal: this.cal,
                    cycle: this.cycle,
                    year: this.year,
                    month: this.month,
                    day: this.day,
                    hour: this.hour,
                    minute: this.minute,
                    second: this.second,
                    millisecond: this.millisecond,
                    sync: params.sync,
                    loadParams: params.loadParams,
                    callback: ilib.bind(this, function (rd) {
                        if (rd) {
                            this.rd = rd;
                            
                            // add the time zone offset to the rd to convert to UTC
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
                                    if (this.offset !== 0) {
                                        // this newRd can be called synchronously because we already called
                                        // it asynchronously above, so all of the astro data should 
                                        // already be loaded.
                                        this.rd = this.newRd({
                                            cal: this.cal,
                                            rd: this.rd.getRataDie() - this.offset
                                        });
                                        this._calcLeap();
                                    } else {
                                        // re-use the derived properties from the RD calculations
                                        this.leapMonth = this.rd.leapMonth;
                                        this.priorLeapMonth = this.rd.priorLeapMonth;
                                        this.leapYear = this.rd.leapYear;
                                    }
                                    
                                    this._init2(params);
                                })
                            });
                        } else {
                            this._init2(params);
                        }
                    })
                });
            } else {
                this._init2(params);
            }
        })
    });
};

/**
 * Finish the initialization for the han date.
 * @private
 */
HanDate.prototype._init2 = function (params) {
    if (!this.rd) {
        // init2() may be called without newRd having been called before,
        // so we cannot guarantee that the astro data is already loaded.
        // That means, we have to treat this as a possibly asynchronous
        // call.
        this.newRd(JSUtils.merge(params || {}, {
            cal: this.cal,
            sync: params.sync,
            loadParams: params.loadParams,
            callback: ilib.bind(this, function(rd) {
                this.rd = rd;
                this._calcDateComponents();

                if (params && typeof(params.onLoad) === 'function') {
                    params.onLoad(this);
                }
            })
        }));
    } else {
        if (params && typeof(params.onLoad) === 'function') {
            params.onLoad(this);
        }
    }
};

/**
 * Return a new RD for this date type using the given params.
 * @protected
 * @param {Object=} params the parameters used to create this rata die instance
 * @returns {RataDie} the new RD instance for the given params
 */
HanDate.prototype.newRd = function (params) {
	return new HanRataDie(params);
};

/**
 * Return the year for the given RD
 * @protected
 * @param {number} rd RD to calculate from 
 * @returns {number} the year for the RD
 */
HanDate.prototype._calcYear = function(rd) {
	var gregdate = new GregorianDate({
		rd: rd,
		timezone: this.timezone
	});
	var hanyear = gregdate.year + 2697;
	var newYears = this.cal.newYears(hanyear);
	return hanyear - ((rd + RataDie.gregorianEpoch < newYears) ? 1 : 0);
};

/** 
 * @private 
 * Calculate the leap year and months from the RD.
 */
HanDate.prototype._calcLeap = function() {
	var jd = this.rd.getRataDie() + RataDie.gregorianEpoch;
	
	var calc = HanCal._leapYearCalc(this.year);
	var m2 = HanCal._newMoonOnOrAfter(calc.m1+1);
	this.leapYear = Math.round((calc.m2 - calc.m1) / 29.530588853000001) === 12;
	
	var newYears = (this.leapYear &&
		(HanCal._noMajorST(calc.m1) || HanCal._noMajorST(m2))) ?
				HanCal._newMoonOnOrAfter(m2+1) : m2;
	
	var m = HanCal._newMoonBefore(jd + 1);
	this.priorLeapMonth = HanRataDie._priorLeapMonth(newYears, HanCal._newMoonBefore(m));
	this.leapMonth = (this.leapYear && HanCal._noMajorST(m) && !this.priorLeapMonth);
};

/**
 * @private
 * Calculate date components for the given RD date.
 */
HanDate.prototype._calcDateComponents = function () {
	var remainder,
		jd = this.rd.getRataDie() + RataDie.gregorianEpoch;

	// console.log("HanDate._calcDateComponents: calculating for jd " + jd);

	if (typeof(this.offset) === "undefined") {
		// now offset the jd by the time zone, then recalculate in case we were 
		// near the year boundary
		if (!this.tz) {
			this.tz = new TimeZone({id: this.timezone});
		}
		this.offset = this.tz.getOffsetMillis(this) / 86400000;
	}
	
	if (this.offset !== 0) {
		jd += this.offset;
	}

	// use the Gregorian calendar objects as a convenient way to short-cut some
	// of the date calculations
	
	var gregyear = GregorianDate._calcYear(this.rd.getRataDie());
	this.year = gregyear + 2697;
	var calc = HanCal._leapYearCalc(this.year);
	var m2 = HanCal._newMoonOnOrAfter(calc.m1+1);
	this.leapYear = Math.round((calc.m2 - calc.m1) / 29.530588853000001) === 12;
	var newYears = (this.leapYear &&
		(HanCal._noMajorST(calc.m1) || HanCal._noMajorST(m2))) ?
				HanCal._newMoonOnOrAfter(m2+1) : m2;
	
	// See if it's between Jan 1 and the Chinese new years of that Gregorian year. If
	// so, then the Han year is actually the previous one
	if (jd < newYears) {
		this.year--;
		calc = HanCal._leapYearCalc(this.year);
		m2 = HanCal._newMoonOnOrAfter(calc.m1+1);
		this.leapYear = Math.round((calc.m2 - calc.m1) / 29.530588853000001) === 12;
		newYears = (this.leapYear &&
			(HanCal._noMajorST(calc.m1) || HanCal._noMajorST(m2))) ?
					HanCal._newMoonOnOrAfter(m2+1) : m2;
	}
	// month is elapsed month, not the month number + leap month boolean
	var m = HanCal._newMoonBefore(jd + 1);
	this.month = Math.round((m - calc.m1) / 29.530588853000001);
	
	this.priorLeapMonth = HanRataDie._priorLeapMonth(newYears, HanCal._newMoonBefore(m));
	this.leapMonth = (this.leapYear && HanCal._noMajorST(m) && !this.priorLeapMonth);
	
	this.cycle = Math.floor((this.year - 1) / 60);
	this.cycleYear = MathUtils.amod(this.year, 60);
	this.day = Astro._floorToJD(jd) - m + 1;

	/*
	console.log("HanDate._calcDateComponents: year is " + this.year);
	console.log("HanDate._calcDateComponents: isLeapYear is " + this.leapYear);
	console.log("HanDate._calcDateComponents: cycle is " + this.cycle);
	console.log("HanDate._calcDateComponents: cycleYear is " + this.cycleYear);
	console.log("HanDate._calcDateComponents: month is " + this.month);
	console.log("HanDate._calcDateComponents: isLeapMonth is " + this.leapMonth);
	console.log("HanDate._calcDateComponents: day is " + this.day);
	*/

	// floor to the start of the julian day
	remainder = jd - Astro._floorToJD(jd);
	
	// console.log("HanDate._calcDateComponents: time remainder is " + remainder);
	
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
 * Return the year within the Chinese cycle of this date. Cycles are 60 
 * years long, and the value returned from this method is the number of the year 
 * within this cycle. The year returned from getYear() is the total elapsed 
 * years since the beginning of the Chinese epoch and does not include 
 * the cycles. 
 * 
 * @return {number} the year within the current Chinese cycle
 */
HanDate.prototype.getCycleYears = function() {
	return this.cycleYear;
};

/**
 * Return the Chinese cycle number of this date. Cycles are 60 years long,
 * and the value returned from getCycleYear() is the number of the year 
 * within this cycle. The year returned from getYear() is the total elapsed 
 * years since the beginning of the Chinese epoch and does not include 
 * the cycles. 
 * 
 * @return {number} the current Chinese cycle
 */
HanDate.prototype.getCycles = function() {
	return this.cycle;
};

/**
 * Return whether the year of this date is a leap year in the Chinese Han 
 * calendar. 
 * 
 * @return {boolean} true if the year of this date is a leap year in the 
 * Chinese Han calendar. 
 */
HanDate.prototype.isLeapYear = function() {
	return this.leapYear;
};

/**
 * Return whether the month of this date is a leap month in the Chinese Han 
 * calendar.
 * 
 * @return {boolean} true if the month of this date is a leap month in the 
 * Chinese Han calendar.
 */
HanDate.prototype.isLeapMonth = function() {
	return this.leapMonth;
};

/**
 * Return the day of the week of this date. The day of the week is encoded
 * as number from 0 to 6, with 0=Sunday, 1=Monday, etc., until 6=Saturday.
 * 
 * @return {number} the day of the week
 */
HanDate.prototype.getDayOfWeek = function() {
	var rd = Math.floor(this.rd.getRataDie() + (this.offset || 0));
	return MathUtils.mod(rd, 7);
};

/**
 * Return the ordinal day of the year. Days are counted from 1 and proceed linearly up to 
 * 365, regardless of months or weeks, etc. That is, Farvardin 1st is day 1, and 
 * December 31st is 365 in regular years, or 366 in leap years.
 * @return {number} the ordinal day of the year
 */
HanDate.prototype.getDayOfYear = function() {
	var newYears = this.cal.newYears(this.year);
	var priorNewMoon = HanCal._newMoonOnOrAfter(newYears + (this.month -1) * 29);
	return priorNewMoon - newYears + this.day;
};

/**
 * Return the era for this date as a number. The value for the era for Han 
 * calendars is -1 for "before the han era" (BP) and 1 for "the han era" (anno 
 * persico or AP). 
 * BP dates are any date before Farvardin 1, 1 AP. In the proleptic Han calendar, 
 * there is a year 0, so any years that are negative or zero are BP.
 * @return {number} 1 if this date is in the common era, -1 if it is before the 
 * common era 
 */
HanDate.prototype.getEra = function() {
	return (this.year < 1) ? -1 : 1;
};

/**
 * Return the name of the calendar that governs this date.
 * 
 * @return {string} a string giving the name of the calendar
 */
HanDate.prototype.getCalendar = function() {
	return "han";
};

// register with the factory method
IDate._constructors["han"] = HanDate;

module.exports = HanDate;