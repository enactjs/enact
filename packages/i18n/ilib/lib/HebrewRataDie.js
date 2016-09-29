/*
 * HebrewRataDie.js - Represent an RD date in the Hebrew calendar
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

/* !depends 
MathUtils.js
HebrewCal.js
RataDie.js
*/

var HebrewCal = require("./HebrewCal.js");
var MathUtils = require("./MathUtils.js");
var RataDie = require("./RataDie.js");

/**
 * @class
 * Construct a new Hebrew RD date number object. The constructor parameters can 
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
 * <li><i>parts</i> - 0 to 1079. Specify the halaqim parts of an hour. Either specify 
 * the parts or specify the minutes, seconds, and milliseconds, but not both. 
 * 
 * <li><i>minute</i> - 0 to 59
 * 
 * <li><i>second</i> - 0 to 59
 * 
 * <li><i>millisecond</i> - 0 to 999
 * 
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
 * </ul>
 *
 * If the constructor is called with another Hebrew date instance instead of
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
 * @extends RataDie
 * @param {Object=} params parameters that govern the settings and behaviour of this Hebrew RD date
 */
var HebrewRataDie = function(params) {
	this.cal = params && params.cal || new HebrewCal();
	this.rd = undefined;
	RataDie.call(this, params);
};

HebrewRataDie.prototype = new RataDie();
HebrewRataDie.prototype.parent = RataDie;
HebrewRataDie.prototype.constructor = HebrewRataDie;

/**
 * The difference between a zero Julian day and the first day of the Hebrew 
 * calendar: sunset on Monday, Tishri 1, 1 = September 7, 3760 BC Gregorian = JD 347997.25
 * @private
 * @const
 * @type number
 */
HebrewRataDie.prototype.epoch = 347997.25;

/**
 * the cumulative lengths of each month for a non-leap year, without new years corrections
 * @private
 * @const
 * @type Array.<number>
 */
HebrewRataDie.cumMonthLengths = [
	176,  /* Nisan */
	206,  /* Iyyar */
	235,  /* Sivan */
	265,  /* Tammuz */
	294,  /* Av */
	324,  /* Elul */
	0,    /* Tishri - Jewish New Year (Rosh HaShanah) starts in month 7 */
	30,   /* Heshvan */
	59,   /* Kislev */
	88,   /* Teveth */
	117,  /* Shevat */
	147   /* Adar I */
];

/**
 * the cumulative lengths of each month for a leap year, without new years corrections 
 * @private
 * @const
 * @type Array.<number>
 */
HebrewRataDie.cumMonthLengthsLeap = [
	206,  /* Nisan */
	236,  /* Iyyar */
	265,  /* Sivan */
	295,  /* Tammuz */
	324,  /* Av */
	354,  /* Elul */
	0,    /* Tishri - Jewish New Year (Rosh HaShanah) starts in month 7 */
	30,   /* Heshvan */
	59,   /* Kislev */
	88,   /* Teveth */
	117,  /* Shevat */
	147,  /* Adar I */
	177   /* Adar II */
];

/**
 * Calculate the Rata Die (fixed day) number of the given date from the
 * date components.
 * 
 * @private
 * @param {Object} date the date components to calculate the RD from
 */
HebrewRataDie.prototype._setDateComponents = function(date) {
	var elapsed = HebrewCal.elapsedDays(date.year);
	var days = elapsed +
		HebrewCal.newYearsCorrection(date.year, elapsed) +
		date.day - 1;
	var sum = 0, table;
	
	//console.log("getRataDie: converting " +  JSON.stringify(date));
	//console.log("getRataDie: days is " +  days);
	//console.log("getRataDie: new years correction is " +  HebrewCal.newYearsCorrection(date.year, elapsed));
	
	table = this.cal.isLeapYear(date.year) ? 
		HebrewRataDie.cumMonthLengthsLeap :
		HebrewRataDie.cumMonthLengths;
	sum = table[date.month-1];
	
	// gets cumulative without correction, so now add in the correction
	if ((date.month < 7 || date.month > 8) && HebrewCal.longHeshvan(date.year)) {
		sum++;
	}
	if ((date.month < 7 || date.month > 9) && HebrewCal.longKislev(date.year)) {
		sum++;
	}
	// console.log("getRataDie: cum days is now " +  sum);
	
	days += sum;
	
	// the date starts at sunset, which we take as 18:00, so the hours from
	// midnight to 18:00 are on the current Gregorian day, and the hours from
	// 18:00 to midnight are on the previous Gregorian day. So to calculate the 
	// number of hours into the current day that this time represents, we have
	// to count from 18:00 to midnight first, and add in 6 hours if the time is
	// less than 18:00
	var minute, second, millisecond;
	
	if (typeof(date.parts) !== 'undefined') {
		// The parts (halaqim) of the hour. This can be a number from 0 to 1079.
		var parts = parseInt(date.parts, 10);
		var seconds = parseInt(parts, 10) * 3.333333333333;
		minute = Math.floor(seconds / 60);
		seconds -= minute * 60;
		second = Math.floor(seconds);
		millisecond = (seconds - second);	
	} else {
		minute = parseInt(date.minute, 10) || 0;
		second = parseInt(date.second, 10) || 0;
		millisecond = parseInt(date.millisecond, 10) || 0;
	}
		
	var time;
	if (date.hour >= 18) {
		time = ((date.hour - 18 || 0) * 3600000 +
			(minute || 0) * 60000 +
			(second || 0) * 1000 +
			(millisecond || 0)) / 
			86400000;
	} else {
		time = 0.25 +	// 6 hours from 18:00 to midnight on the previous gregorian day
				((date.hour || 0) * 3600000 +
				(minute || 0) * 60000 +
				(second || 0) * 1000 +
				(millisecond || 0)) / 
				86400000;
	}
	
	//console.log("getRataDie: rd is " +  (days + time));
	this.rd = days + time;
};
	
/**
 * Return the rd number of the particular day of the week on or before the 
 * given rd. eg. The Sunday on or before the given rd.
 * @private
 * @param {number} rd the rata die date of the reference date
 * @param {number} dayOfWeek the day of the week that is being sought relative 
 * to the current date
 * @return {number} the rd of the day of the week
 */
HebrewRataDie.prototype._onOrBefore = function(rd, dayOfWeek) {
	return rd - MathUtils.mod(Math.floor(rd) - dayOfWeek + 1, 7);
};

module.exports = HebrewRataDie;
