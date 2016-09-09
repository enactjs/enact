/*
 * gregratadie.js - Represent the RD date number in the Gregorian calendar
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
GregorianCal.js
RataDie.js
MathUtils.js
*/

var ilib = require("./ilib.js");
var MathUtils = require("./MathUtils.js");
var GregorianCal = require("./GregorianCal.js");
var RataDie = require("./RataDie.js");

/**
 * @class
 * Construct a new Gregorian RD date number object. The constructor parameters can 
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
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
 * </ul>
 *
 * If the constructor is called with another Gregorian date instance instead of
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
 * @param {Object=} params parameters that govern the settings and behaviour of this Gregorian RD date
 */
var GregRataDie = function(params) {
	this.cal = params && params.cal || new GregorianCal();
	/** @type {number|undefined} */
	this.rd = undefined;
	RataDie.call(this, params);
};

GregRataDie.prototype = new RataDie();
GregRataDie.prototype.parent = RataDie;
GregRataDie.prototype.constructor = GregRataDie;

/**
 * the cumulative lengths of each month, for a non-leap year 
 * @private
 * @const
 * @type Array.<number>
 */
GregRataDie.cumMonthLengths = [
    0,   /* Jan */
	31,  /* Feb */
	59,  /* Mar */
	90,  /* Apr */
	120, /* May */
	151, /* Jun */
	181, /* Jul */
	212, /* Aug */
	243, /* Sep */
	273, /* Oct */
	304, /* Nov */
	334, /* Dec */
	365
];

/**
 * the cumulative lengths of each month, for a leap year 
 * @private
 * @const
 * @type Array.<number>
 */
GregRataDie.cumMonthLengthsLeap = [
	0,   /* Jan */
	31,  /* Feb */
	60,  /* Mar */
	91,  /* Apr */
	121, /* May */
	152, /* Jun */
	182, /* Jul */
	213, /* Aug */
	244, /* Sep */
	274, /* Oct */
	305, /* Nov */
	335, /* Dec */
	366
];

/**
 * Calculate the Rata Die (fixed day) number of the given date.
 * 
 * @private
 * @param {Object} date the date components to calculate the RD from
 */
GregRataDie.prototype._setDateComponents = function(date) {
	var year = parseInt(date.year, 10) || 0;
	var month = parseInt(date.month, 10) || 1;
	var day = parseInt(date.day, 10) || 1;
	var hour = parseInt(date.hour, 10) || 0;
	var minute = parseInt(date.minute, 10) || 0;
	var second = parseInt(date.second, 10) || 0;
	var millisecond = parseInt(date.millisecond, 10) || 0;

	var years = 365 * (year - 1) +
		Math.floor((year-1)/4) -
		Math.floor((year-1)/100) +
		Math.floor((year-1)/400);
	
	var dayInYear = (month > 1 ? GregRataDie.cumMonthLengths[month-1] : 0) +
		day +
		(GregorianCal.prototype.isLeapYear.call(this.cal, year) && month > 2 ? 1 : 0);
	var rdtime = (hour * 3600000 +
		minute * 60000 +
		second * 1000 +
		millisecond) / 
		86400000; 
	/*
	debug("getRataDie: converting " +  JSON.stringify(this));
	debug("getRataDie: year is " +  years);
	debug("getRataDie: day in year is " +  dayInYear);
	debug("getRataDie: rdtime is " +  rdtime);
	debug("getRataDie: rd is " +  (years + dayInYear + rdtime));
	*/
	
	/**
	 * @type {number|undefined} the RD number of this Gregorian date
	 */
	this.rd = years + dayInYear + rdtime;
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
GregRataDie.prototype._onOrBefore = function(rd, dayOfWeek) {
	return rd - MathUtils.mod(Math.floor(rd) - dayOfWeek, 7);
};

module.exports = GregRataDie;