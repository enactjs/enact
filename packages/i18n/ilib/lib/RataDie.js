/*
 * ratadie.js - Represent the RD date number in the calendar
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
JulianDay.js
MathUtils.js
JSUtils.js
*/

var ilib = require("./ilib.js");
var MathUtils = require("./MathUtils.js");
var JSUtils = require("./JSUtils.js");
var JulianDay = require("./JulianDay.js");

/**
 * @class
 * Construct a new RD date number object. The constructor parameters can 
 * contain any of the following properties:
 * 
 * <ul>
 * <li><i>unixtime<i> - sets the time of this instance according to the given 
 * unix time. Unix time is the number of milliseconds since midnight on Jan 1, 1970.
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
 * <li><i>parts</i> - 0 to 1079. Specify the halaqim parts of an hour. Either specify 
 * the parts or specify the minutes, seconds, and milliseconds, but not both. This is only used
 * in the Hebrew calendar. 
 * 
 * <li><i>minute</i> - 0 to 59
 * 
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
 * </ul>
 *
 * If the constructor is called with another date instance instead of
 * a parameter block, the other instance acts as a parameter block and its
 * settings are copied into the current instance.<p>
 * 
 * If the constructor is called with no arguments at all or if none of the 
 * properties listed above are present, then the RD is calculate based on 
 * the current date at the time of instantiation. <p>
 * 
 * If any of the properties from <i>year</i> through <i>millisecond</i> are not
 * specified in the params, it is assumed that they have the smallest possible
 * value in the range for the property (zero or one).<p>
 * 
 * 
 * @private
 * @constructor
 * @param {Object=} params parameters that govern the settings and behaviour of this RD date
 */
var RataDie = function(params) {
	if (params) {
		if (typeof(params.date) !== 'undefined') {
			// accept JS Date classes or strings
			var date = params.date;
			if (!(JSUtils.isDate(date))) {
				date = new Date(date); // maybe a string initializer?
			}
			this._setTime(date.getTime());
		} else if (typeof(params.unixtime) !== 'undefined') {
			this._setTime(parseInt(params.unixtime, 10));
		} else if (typeof(params.julianday) !== 'undefined') {
			// JD time is defined to be UTC
			this._setJulianDay(parseFloat(params.julianday));
		} else if (params.year || params.month || params.day || params.hour ||
				params.minute || params.second || params.millisecond || params.parts || params.cycle) {
			this._setDateComponents(params);
		} else if (typeof(params.rd) !== 'undefined') {
			this.rd = (typeof(params.rd) === 'object' && params.rd instanceof RataDie) ? params.rd.rd : params.rd;
		}
	}
	
	/**
	 * @type {number} the Rata Die number of this date for this calendar type
	 */
	if (typeof(this.rd) === 'undefined') {
		var now = new Date();
		this._setTime(now.getTime());
	}
};

/**
 * @private
 * @const
 * @type {number}
 */
RataDie.gregorianEpoch = 1721424.5;

RataDie.prototype = {
	/**
	 * @protected
	 * @const
	 * @type {number}
	 * the difference between a zero Julian day and the zero Gregorian date. 
	 */
	epoch: RataDie.gregorianEpoch,
	
	/**
	 * Set the RD of this instance according to the given unix time. Unix time is
	 * the number of milliseconds since midnight on Jan 1, 1970.
	 *
	 * @protected
	 * @param {number} millis the unix time to set this date to in milliseconds 
	 */
	_setTime: function(millis) {
		// 2440587.5 is the julian day of midnight Jan 1, 1970, UTC (Gregorian)
		this._setJulianDay(2440587.5 + millis / 86400000);
	},

	/**
	 * Set the date of this instance using a Julian Day.
	 * @protected
	 * @param {number} date the Julian Day to use to set this date
	 */
	_setJulianDay: function (date) {
		var jd = (typeof(date) === 'number') ? new JulianDay(date) : date;
		// round to the nearest millisecond
		this.rd = MathUtils.halfup((jd.getDate() - this.epoch) * 86400000) / 86400000;
	},

	/**
	 * Return the rd number of the particular day of the week on or before the 
	 * given rd. eg. The Sunday on or before the given rd.
	 * @protected
	 * @param {number} rd the rata die date of the reference date
	 * @param {number} dayOfWeek the day of the week that is being sought relative 
	 * to the current date
	 * @return {number} the rd of the day of the week
	 */
	_onOrBefore: function(rd, dayOfWeek) {
		return rd - MathUtils.mod(Math.floor(rd) - dayOfWeek - 2, 7);
	},
	
	/**
	 * Return the rd number of the particular day of the week on or before the current rd.
	 * eg. The Sunday on or before the current rd. If the offset is given, the calculation
	 * happens in wall time instead of UTC. UTC time may be a day before or day behind 
	 * wall time, so it it would give the wrong day of the week if this calculation was
	 * done in UTC time when the caller really wanted wall time. Even though the calculation
	 * may be done in wall time, the return value is nonetheless always given in UTC.
	 * @param {number} dayOfWeek the day of the week that is being sought relative 
	 * to the current date
	 * @param {number=} offset RD offset for the time zone. Zero is assumed if this param is
	 * not given
	 * @return {number} the rd of the day of the week
	 */
	onOrBefore: function(dayOfWeek, offset) {
		offset = offset || 0;
		return this._onOrBefore(this.rd + offset, dayOfWeek) - offset;
	},
	
	/**
	 * Return the rd number of the particular day of the week on or before the current rd.
	 * eg. The Sunday on or before the current rd. If the offset is given, the calculation
	 * happens in wall time instead of UTC. UTC time may be a day before or day behind 
	 * wall time, so it it would give the wrong day of the week if this calculation was
	 * done in UTC time when the caller really wanted wall time. Even though the calculation
	 * may be done in wall time, the return value is nonetheless always given in UTC.
	 * @param {number} dayOfWeek the day of the week that is being sought relative 
	 * to the reference date
	 * @param {number=} offset RD offset for the time zone. Zero is assumed if this param is
	 * not given
	 * @return {number} the day of the week
	 */
	onOrAfter: function(dayOfWeek, offset) {
		offset = offset || 0;
		return this._onOrBefore(this.rd+6+offset, dayOfWeek) - offset;
	},
	
	/**
	 * Return the rd number of the particular day of the week before the current rd.
	 * eg. The Sunday before the current rd. If the offset is given, the calculation
	 * happens in wall time instead of UTC. UTC time may be a day before or day behind 
	 * wall time, so it it would give the wrong day of the week if this calculation was
	 * done in UTC time when the caller really wanted wall time. Even though the calculation
	 * may be done in wall time, the return value is nonetheless always given in UTC.
	 * @param {number} dayOfWeek the day of the week that is being sought relative 
	 * to the reference date
	 * @param {number=} offset RD offset for the time zone. Zero is assumed if this param is
	 * not given
	 * @return {number} the day of the week
	 */
	before: function(dayOfWeek, offset) {
		offset = offset || 0;
		return this._onOrBefore(this.rd-1+offset, dayOfWeek) - offset;
	},
	
	/**
	 * Return the rd number of the particular day of the week after the current rd.
	 * eg. The Sunday after the current rd. If the offset is given, the calculation
	 * happens in wall time instead of UTC. UTC time may be a day before or day behind 
	 * wall time, so it it would give the wrong day of the week if this calculation was
	 * done in UTC time when the caller really wanted wall time. Even though the calculation
	 * may be done in wall time, the return value is nonetheless always given in UTC.
	 * @param {number} dayOfWeek the day of the week that is being sought relative 
	 * to the reference date
	 * @param {number=} offset RD offset for the time zone. Zero is assumed if this param is
	 * not given
	 * @return {number} the day of the week
	 */
	after: function(dayOfWeek, offset) {
		offset = offset || 0;
		return this._onOrBefore(this.rd+7+offset, dayOfWeek) - offset;
	},

	/**
	 * Return the unix time equivalent to this Gregorian date instance. Unix time is
	 * the number of milliseconds since midnight on Jan 1, 1970 UTC. This method only
	 * returns a valid number for dates between midnight, Jan 1, 1970 and  
	 * Jan 19, 2038 at 3:14:07am when the unix time runs out. If this instance 
	 * encodes a date outside of that range, this method will return -1.
	 * 
	 * @return {number} a number giving the unix time, or -1 if the date is outside the
	 * valid unix time range
	 */
	getTime: function() {
		// earlier than Jan 1, 1970
		// or later than Jan 19, 2038 at 3:14:07am
		var jd = this.getJulianDay();
		if (jd < 2440587.5 || jd > 2465442.634803241) { 
			return -1;
		}
	
		// avoid the rounding errors in the floating point math by only using
		// the whole days from the rd, and then calculating the milliseconds directly
		return Math.round((jd - 2440587.5) * 86400000);
	},

	/**
	 * Return the extended unix time equivalent to this Gregorian date instance. Unix time is
	 * the number of milliseconds since midnight on Jan 1, 1970 UTC. Traditionally unix time
	 * (or the type "time_t" in C/C++) is only encoded with a unsigned 32 bit integer, and thus 
	 * runs out on Jan 19, 2038. However, most Javascript engines encode numbers well above 
	 * 32 bits and the Date object allows you to encode up to 100 million days worth of time 
	 * after Jan 1, 1970, and even more interestingly 100 million days worth of time before
	 * Jan 1, 1970 as well. This method returns the number of milliseconds in that extended 
	 * range. If this instance encodes a date outside of that range, this method will return
	 * NaN.
	 * 
	 * @return {number} a number giving the extended unix time, or NaN if the date is outside 
	 * the valid extended unix time range
	 */
	getTimeExtended: function() {
		var jd = this.getJulianDay();
		
		// test if earlier than Jan 1, 1970 - 100 million days
		// or later than Jan 1, 1970 + 100 million days
		if (jd < -97559412.5 || jd > 102440587.5) { 
			return NaN;
		}
	
		// avoid the rounding errors in the floating point math by only using
		// the whole days from the rd, and then calculating the milliseconds directly
		return Math.round((jd - 2440587.5) * 86400000);
	},

	/**
	 * Return the Julian Day equivalent to this calendar date as a number.
	 * This returns the julian day in UTC.
	 * 
	 * @return {number} the julian date equivalent of this date
	 */
	getJulianDay: function() {
		return this.rd + this.epoch;
	},

	/**
	 * Return the Rata Die (fixed day) number of this RD date.
	 * 
	 * @return {number} the rd date as a number
	 */
	getRataDie: function() {
		return this.rd;
	}
};

module.exports = RataDie;