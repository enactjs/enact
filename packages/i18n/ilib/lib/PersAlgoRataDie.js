/*
 * PersAlsoRataDie.js - Represent an RD date in the Persian algorithmic calendar
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
PersianAlgoCal.js 
MathUtils.js
RataDie.js
*/

var MathUtils = require("./MathUtils.js");
var PersianAlgoCal = require("./PersianAlgoCal.js");
var RataDie = require("./RataDie.js");

/**
 * @class
 * Construct a new Persian RD date number object. The constructor parameters can 
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
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
 * </ul>
 *
 * If the constructor is called with another Persian date instance instead of
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
 * @param {Object=} params parameters that govern the settings and behaviour of this Persian RD date
 */
var PersAlgoRataDie = function(params) {
	this.cal = params && params.cal || new PersianAlgoCal();
	this.rd = undefined;
	RataDie.call(this, params);
};

PersAlgoRataDie.prototype = new RataDie();
PersAlgoRataDie.prototype.parent = RataDie;
PersAlgoRataDie.prototype.constructor = PersAlgoRataDie;

/**
 * The difference between a zero Julian day and the first Persian date
 * @private
 * @const
 * @type number
 */
PersAlgoRataDie.prototype.epoch = 1948319.5;

/**
 * @private
 * @const
 * @type Array.<number>
 * the cumulative lengths of each month, for a non-leap year 
 */
PersAlgoRataDie.cumMonthLengths = [
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
	365
];

/**
 * Calculate the Rata Die (fixed day) number of the given date from the
 * date components.
 *
 * @protected
 * @param {Object} date the date components to calculate the RD from
 */
PersAlgoRataDie.prototype._setDateComponents = function(date) {
	var year = this.cal.equivalentCycleYear(date.year);
	var y = date.year - (date.year >= 0 ? 474 : 473);
	var rdOfYears = 1029983 * Math.floor(y/2820) + 365 * (year - 1) + Math.floor((682 * year - 110) / 2816);
	var dayInYear = (date.month > 1 ? PersAlgoRataDie.cumMonthLengths[date.month-1] : 0) + date.day;
	var rdtime = (date.hour * 3600000 +
		date.minute * 60000 +
		date.second * 1000 +
		date.millisecond) /
		86400000;
	
	/*
	// console.log("getRataDie: converting " +  JSON.stringify(this));
	console.log("getRataDie: year is " +  year);
	console.log("getRataDie: rd of years is " +  rdOfYears);
	console.log("getRataDie: day in year is " +  dayInYear);
	console.log("getRataDie: rdtime is " +  rdtime);
	console.log("getRataDie: rd is " +  (rdOfYears + dayInYear + rdtime));
	*/
	
	this.rd = rdOfYears + dayInYear + rdtime;
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
PersAlgoRataDie.prototype._onOrBefore = function(rd, dayOfWeek) {
	return rd - MathUtils.mod(Math.floor(rd) - dayOfWeek - 3, 7);
};

module.exports = PersAlgoRataDie;