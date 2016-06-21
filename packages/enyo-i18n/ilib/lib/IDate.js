/*
 * IDate.js - Represent a date in any calendar. This class is subclassed for each 
 * calendar and includes some shared functionality.
 * 
 * Copyright © 2012-2015, JEDLSoft
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

/* !depends LocaleInfo.js */

var LocaleInfo = require("./LocaleInfo.js");

/**
 * @class
 * Superclass for all the calendar date classes that contains shared 
 * functionality. This class is never instantiated on its own. Instead,
 * you should use the {@link DateFactory} function to manufacture a new
 * instance of a subclass of IDate. This class is called IDate for "ilib
 * date" so that it does not conflict with the built-in Javascript Date
 * class.
 * 
 * @private
 * @constructor
 * @param {Object=} options The date components to initialize this date with
 */
var IDate = function(options) {
};

/* place for the subclasses to put their constructors so that the factory method
 * can find them. Do this to add your date after it's defined: 
 * IDate._constructors["mytype"] = IDate.MyTypeConstructor;
 */
IDate._constructors = {};

IDate.prototype = {
	getType: function() {
		return "date";
	},
	
	/**
	 * Return the unix time equivalent to this date instance. Unix time is
	 * the number of milliseconds since midnight on Jan 1, 1970 UTC (Gregorian). This 
	 * method only returns a valid number for dates between midnight, 
	 * Jan 1, 1970 UTC (Gregorian) and Jan 19, 2038 at 3:14:07am UTC (Gregorian) when 
	 * the unix time runs out. If this instance encodes a date outside of that range, 
	 * this method will return -1. For date types that are not Gregorian, the point 
	 * in time represented by this date object will only give a return value if it
	 * is in the correct range in the Gregorian calendar as given previously.
	 * 
	 * @return {number} a number giving the unix time, or -1 if the date is outside the
	 * valid unix time range
	 */
	getTime: function() {
		return this.rd.getTime(); 
	},
	
	/**
	 * Return the extended unix time equivalent to this Gregorian date instance. Unix time is
	 * the number of milliseconds since midnight on Jan 1, 1970 UTC. Traditionally unix time
	 * (or the type "time_t" in C/C++) is only encoded with an unsigned 32 bit integer, and thus 
	 * runs out on Jan 19, 2038. However, most Javascript engines encode numbers well above 
	 * 32 bits and the Date object allows you to encode up to 100 million days worth of time 
	 * after Jan 1, 1970, and even more interestingly, 100 million days worth of time before
	 * Jan 1, 1970 as well. This method returns the number of milliseconds in that extended 
	 * range. If this instance encodes a date outside of that range, this method will return
	 * NaN.
	 * 
	 * @return {number} a number giving the extended unix time, or Nan if the date is outside 
	 * the valid extended unix time range
	 */
	getTimeExtended: function() {
		return this.rd.getTimeExtended();
	},

	/**
	 * Set the time of this instance according to the given unix time. Unix time is
	 * the number of milliseconds since midnight on Jan 1, 1970.
	 * 
	 * @param {number} millis the unix time to set this date to in milliseconds 
	 */
	setTime: function(millis) {
		this.rd = this.newRd({
			unixtime: millis,
			cal: this.cal
		});
		this._calcDateComponents();
	},
	
	getDays: function() {
		return this.day;
	},
	getMonths: function() {
		return this.month;
	},
	getYears: function() {
		return this.year;
	},
	getHours: function() {
		return this.hour;
	},
	getMinutes: function() {
		return this.minute;
	},
	getSeconds: function() {
		return this.second;
	},
	getMilliseconds: function() {
		return this.millisecond;
	},
	getEra: function() {
		return (this.year < 1) ? -1 : 1;
	},

	setDays: function(day) {
		this.day = parseInt(day, 10) || 1;
		this.rd._setDateComponents(this);
	},
	setMonths: function(month) {
		this.month = parseInt(month, 10) || 1;
		this.rd._setDateComponents(this);
	},
	setYears: function(year) {
		this.year = parseInt(year, 10) || 0;
		this.rd._setDateComponents(this);
	},
	
	setHours: function(hour) {
		this.hour = parseInt(hour, 10) || 0;
		this.rd._setDateComponents(this);
	},
	setMinutes: function(minute) {
		this.minute = parseInt(minute, 10) || 0;
		this.rd._setDateComponents(this);
	},
	setSeconds: function(second) {
		this.second = parseInt(second, 10) || 0;
		this.rd._setDateComponents(this);
	},
	setMilliseconds: function(milli) {
		this.millisecond = parseInt(milli, 10) || 0;
		this.rd._setDateComponents(this);
	},
	
	/**
	 * Return a new date instance in the current calendar that represents the first instance 
	 * of the given day of the week before the current date. The day of the week is encoded
	 * as a number where 0 = Sunday, 1 = Monday, etc.
	 * 
	 * @param {number} dow the day of the week before the current date that is being sought
	 * @return {IDate} the date being sought
	 */
	before: function (dow) {
		return new this.constructor({
			rd: this.rd.before(dow, this.offset),
			timezone: this.timezone
		});
	},
	
	/**
	 * Return a new date instance in the current calendar that represents the first instance 
	 * of the given day of the week after the current date. The day of the week is encoded
	 * as a number where 0 = Sunday, 1 = Monday, etc.
	 * 
	 * @param {number} dow the day of the week after the current date that is being sought
	 * @return {IDate} the date being sought
	 */
	after: function (dow) {
		return new this.constructor({
			rd: this.rd.after(dow, this.offset),
			timezone: this.timezone
		});
	},

	/**
	 * Return a new Gregorian date instance that represents the first instance of the 
	 * given day of the week on or before the current date. The day of the week is encoded
	 * as a number where 0 = Sunday, 1 = Monday, etc.
	 * 
	 * @param {number} dow the day of the week on or before the current date that is being sought
	 * @return {IDate} the date being sought
	 */
	onOrBefore: function (dow) {
		return new this.constructor({
			rd: this.rd.onOrBefore(dow, this.offset),
			timezone: this.timezone
		});
	},

	/**
	 * Return a new Gregorian date instance that represents the first instance of the 
	 * given day of the week on or after the current date. The day of the week is encoded
	 * as a number where 0 = Sunday, 1 = Monday, etc.
	 * 
	 * @param {number} dow the day of the week on or after the current date that is being sought
	 * @return {IDate} the date being sought
	 */
	onOrAfter: function (dow) {
		return new this.constructor({
			rd: this.rd.onOrAfter(dow, this.offset),
			timezone: this.timezone
		});
	},
	
	/**
	 * Return a Javascript Date object that is equivalent to this date
	 * object.
	 * 
	 * @return {Date|undefined} a javascript Date object
	 */
	getJSDate: function() {
		var unix = this.rd.getTimeExtended();
		return isNaN(unix) ? undefined : new Date(unix); 
	},
	
	/**
	 * Return the Rata Die (fixed day) number of this date.
	 * 
	 * @protected
	 * @return {number} the rd date as a number
	 */
	getRataDie: function() {
		return this.rd.getRataDie();
	},
	
	/**
	 * Set the date components of this instance based on the given rd.
	 * @protected
	 * @param {number} rd the rata die date to set
	 */
	setRd: function (rd) {
		this.rd = this.newRd({
			rd: rd,
			cal: this.cal
		});
		this._calcDateComponents();
	},
	
	/**
	 * Return the Julian Day equivalent to this calendar date as a number.
	 * 
	 * @return {number} the julian date equivalent of this date
	 */
	getJulianDay: function() {
		return this.rd.getJulianDay();
	},
	
	/**
	 * Set the date of this instance using a Julian Day.
	 * @param {number|JulianDay} date the Julian Day to use to set this date
	 */
	setJulianDay: function (date) {
		this.rd = this.newRd({
			julianday: (typeof(date) === 'object') ? date.getDate() : date,
			cal: this.cal
		});
		this._calcDateComponents();
	},

	/**
	 * Return the time zone associated with this date, or 
	 * undefined if none was specified in the constructor.
	 * 
	 * @return {string|undefined} the name of the time zone for this date instance
	 */
	getTimeZone: function() {
		return this.timezone || "local";
	},
	
	/**
	 * Set the time zone associated with this date.
	 * @param {string=} tzName the name of the time zone to set into this date instance,
	 * or "undefined" to unset the time zone 
	 */
	setTimeZone: function (tzName) {
		if (!tzName || tzName === "") {
			// same as undefining it
			this.timezone = undefined;
			this.tz = undefined;
		} else if (typeof(tzName) === 'string') {
			this.timezone = tzName;
			this.tz = undefined;
			// assuming the same UTC time, but a new time zone, now we have to 
			// recalculate what the date components are
			this._calcDateComponents();
		}
	},
	
	/**
	 * Return the rd number of the first Sunday of the given ISO year.
	 * @protected
	 * @param {number} year the year for which the first Sunday is being sought
	 * @return {number} the rd of the first Sunday of the ISO year
	 */
	firstSunday: function (year) {
		var firstDay = this.newRd({
			year: year,
			month: 1,
			day: 1,
			hour: 0,
			minute: 0,
			second: 0,
			millisecond: 0,
			cal: this.cal
		});
		var firstThu = this.newRd({
			rd: firstDay.onOrAfter(4),
			cal: this.cal
		});
		return firstThu.before(0);
	},
	
	/**
	 * Return the ISO 8601 week number in the current year for the current date. The week
	 * number ranges from 0 to 55, as some years have 55 weeks assigned to them in some
	 * calendars.
	 * 
	 * @return {number} the week number for the current date
	 */
	getWeekOfYear: function() {
		var rd = Math.floor(this.rd.getRataDie());
		var year = this._calcYear(rd + this.offset);
		var yearStart = this.firstSunday(year);
		var nextYear;
		
		// if we have a January date, it may be in this ISO year or the previous year
		if (rd < yearStart) {
			yearStart = this.firstSunday(year-1);
		} else {
			// if we have a late December date, it may be in this ISO year, or the next year
			nextYear = this.firstSunday(year+1);
			if (rd >= nextYear) {
				yearStart = nextYear;
			}
		}
		
		return Math.floor((rd-yearStart)/7) + 1;
	},
	
	/**
	 * Return the ordinal number of the week within the month. The first week of a month is
	 * the first one that contains 4 or more days in that month. If any days precede this
	 * first week, they are marked as being in week 0. This function returns values from 0
	 * through 6.<p>
	 * 
	 * The locale is a required parameter because different locales that use the same 
	 * Gregorian calendar consider different days of the week to be the beginning of
	 * the week. This can affect the week of the month in which some days are located.
	 * 
	 * @param {Locale|string} locale the locale or locale spec to use when figuring out 
	 * the first day of the week
	 * @return {number} the ordinal number of the week within the current month
	 */
	getWeekOfMonth: function(locale) {
		var li = new LocaleInfo(locale);
		
		var first = this.newRd({
			year: this._calcYear(this.rd.getRataDie()+this.offset),
			month: this.getMonths(),
			day: 1,
			hour: 0,
			minute: 0,
			second: 0,
			millisecond: 0,
			cal: this.cal
		});
		var weekStart = first.onOrAfter(li.getFirstDayOfWeek());
		
		if (weekStart - first.getRataDie() > 3) {
			// if the first week has 4 or more days in it of the current month, then consider
			// that week 1. Otherwise, it is week 0. To make it week 1, move the week start
			// one week earlier.
			weekStart -= 7;
		}
		return Math.floor((this.rd.getRataDie() - weekStart) / 7) + 1;
	}
};

module.exports = IDate;