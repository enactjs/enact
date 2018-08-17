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
HanCal.js
MathUtils.js
RataDie.js
*/

var ilib = require("./ilib.js");
var MathUtils = require("./MathUtils.js");
var HanCal = require("./HanCal.js");
var RataDie = require("./RataDie.js");

/**
 * Construct a new Han RD date number object. The constructor parameters can 
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
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
 * </ul>
 *
 * If the constructor is called with another Han date instance instead of
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
 * @class
 * @constructor
 * @extends RataDie
 * @param {Object=} params parameters that govern the settings and behaviour of this Han RD date
 */
var HanRataDie = function(params) {
	this.rd = NaN;
	if (params && params.cal) {
		this.cal = params.cal;
		RataDie.call(this, params);
		if (params && typeof(params.callback) === 'function') {
			params.callback(this);
		}
	} else {
		new HanCal({
			sync: params && params.sync,
			loadParams: params && params.loadParams,
			onLoad: ilib.bind(this, function(c) {
				this.cal = c;
				RataDie.call(this, params);
				if (params && typeof(params.callback) === 'function') {
					params.callback(this);
				}
			})
		});
	}
};

HanRataDie.prototype = new RataDie();
HanRataDie.prototype.parent = RataDie;
HanRataDie.prototype.constructor = HanRataDie;

/**
 * The difference between a zero Julian day and the first Han date
 * which is February 15, -2636 (Gregorian).
 * @private
 * @type number
 */
HanRataDie.epoch = 758325.5;

/**
 * Calculate the Rata Die (fixed day) number of the given date from the
 * date components.
 *
 * @protected
 * @param {Object} date the date components to calculate the RD from
 */
HanRataDie.prototype._setDateComponents = function(date) {
	var calc = HanCal._leapYearCalc(date.year, date.cycle);
	var m2 = HanCal._newMoonOnOrAfter(calc.m1+1);
	var newYears;
	this.leapYear = (Math.round((calc.m2 - calc.m1) / 29.530588853000001) === 12);
	if (this.leapYear && (HanCal._noMajorST(calc.m1) || HanCal._noMajorST(m2)) ) {
		newYears = HanCal._newMoonOnOrAfter(m2+1);
	} else {
		newYears = m2;
	}

	var priorNewMoon = HanCal._newMoonOnOrAfter(calc.m1 + date.month * 29); // this is a julian day
	this.priorLeapMonth = HanRataDie._priorLeapMonth(newYears, HanCal._newMoonBefore(priorNewMoon));
	this.leapMonth = (this.leapYear && HanCal._noMajorST(priorNewMoon) && !this.priorLeapMonth);

	var rdtime = (date.hour * 3600000 +
		date.minute * 60000 +
		date.second * 1000 +
		date.millisecond) /
		86400000;
	
	/*
	console.log("getRataDie: converting " +  JSON.stringify(date) + " to an RD");
	console.log("getRataDie: year is " +  date.year + " plus cycle " + date.cycle);
	console.log("getRataDie: isLeapYear is " +  this.leapYear);
	console.log("getRataDie: priorNewMoon is " +  priorNewMoon);
	console.log("getRataDie: day in month is " +  date.day);
	console.log("getRataDie: rdtime is " +  rdtime);
	console.log("getRataDie: rd is " +  (priorNewMoon + date.day - 1 + rdtime));
	*/
	
	this.rd = priorNewMoon + date.day - 1 + rdtime - RataDie.gregorianEpoch;
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
HanRataDie.prototype._onOrBefore = function(rd, dayOfWeek) {
	return rd - MathUtils.mod(Math.floor(rd) - dayOfWeek, 7);
};

/**
 * @protected
 * @static
 * @param {number} jd1 first julian day
 * @param {number} jd2 second julian day
 * @returns {boolean} true if there is a leap month earlier in the same year 
 * as the given months 
 */
HanRataDie._priorLeapMonth = function(jd1, jd2) {
	return jd2 >= jd1 &&
		(HanRataDie._priorLeapMonth(jd1, HanCal._newMoonBefore(jd2)) ||
				HanCal._noMajorST(jd2));
};


module.exports = HanRataDie;