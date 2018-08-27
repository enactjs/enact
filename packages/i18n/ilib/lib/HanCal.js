/*
 * han.js - Represent a Han Chinese Lunar calendar object.
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
Calendar.js 
MathUtils.js 
Astro.js
GregorianDate.js
GregRataDie.js
RataDie.js
*/

var ilib = require("./ilib.js");
var MathUtils = require("./MathUtils.js");

var Calendar = require("./Calendar.js");

var Astro = require("./Astro.js");
var RataDie = require("./RataDie.js");
var GregorianDate = require("./GregorianDate.js");
var GregRataDie = require("./GregRataDie.js");

/**
 * @class
 * Construct a new Han algorithmic calendar object. This class encodes information about
 * a Han algorithmic calendar.<p>
 * 
 * 
 * @constructor
 * @param {Object=} params optional parameters to load the calendrical data
 * @extends Calendar
 */
var HanCal = function(params) {
	this.type = "han";
	var sync = params && typeof(params.sync) === 'boolean' ? params.sync : true;
	
	Astro.initAstro(sync, params && params.loadParams, ilib.bind(this, function (x) {
		if (params && typeof(params.onLoad) === 'function') {
			params.onLoad(this);
		}
	}));
};

/**
 * @protected
 * @static
 * @param {number} year
 * @param {number=} cycle
 * @return {number}
 */
HanCal._getElapsedYear = function(year, cycle) {
	var elapsedYear = year || 0;
	if (typeof(year) !== 'undefined' && year < 61 && typeof(cycle) !== 'undefined') {
		elapsedYear = 60 * cycle + year;
	}
	return elapsedYear;
};

/**
 * @protected
 * @static
 * @param {number} jd julian day to calculate from
 * @param {number} longitude longitude to seek 
 * @returns {number} the julian day of the next time that the solar longitude 
 * is a multiple of the given longitude
 */
HanCal._hanNextSolarLongitude = function(jd, longitude) {
	var tz = HanCal._chineseTZ(jd);
	var uni = Astro._universalFromLocal(jd, tz);
	var sol = Astro._nextSolarLongitude(uni, longitude);
	return Astro._localFromUniversal(sol, tz);
};

/**
 * @protected
 * @static
 * @param {number} jd julian day to calculate from 
 * @returns {number} the major solar term for the julian day
 */
HanCal._majorSTOnOrAfter = function(jd) {
	var tz = HanCal._chineseTZ(jd);
	var uni = Astro._universalFromLocal(jd, tz);
	var next = Astro._fixangle(30 * Math.ceil(Astro._solarLongitude(uni)/30));
	return HanCal._hanNextSolarLongitude(jd, next);
};

/**
 * @protected
 * @static
 * @param {number} year the year for which the leap year information is being sought
 * @param {number=} cycle if the given year < 60, this can specify the cycle. If the
 * cycle is not given, then the year should be given as elapsed years since the beginning
 * of the epoch
 */
HanCal._solsticeBefore = function (year, cycle) {
	var elapsedYear = HanCal._getElapsedYear(year, cycle);
	var gregyear = elapsedYear - 2697;
	var rd = new GregRataDie({
		year: gregyear-1, 
		month: 12, 
		day: 15, 
		hour: 0, 
		minute: 0, 
		second: 0, 
		millisecond: 0
	});
	return HanCal._majorSTOnOrAfter(rd.getRataDie() + RataDie.gregorianEpoch);
};

/**
 * @protected
 * @static
 * @param {number} jd julian day to calculate from
 * @returns {number} the current major solar term
 */
HanCal._chineseTZ = function(jd) {
	var year = GregorianDate._calcYear(jd - RataDie.gregorianEpoch);
	return year < 1929 ? 465.6666666666666666 : 480;
};

/**
 * @protected
 * @static
 * @param {number} jd julian day to calculate from 
 * @returns {number} the julian day of next new moon on or after the given julian day date
 */
HanCal._newMoonOnOrAfter = function(jd) {
	var tz = HanCal._chineseTZ(jd);
	var uni = Astro._universalFromLocal(jd, tz);
	var moon = Astro._newMoonAtOrAfter(uni);
	// floor to the start of the julian day
	return Astro._floorToJD(Astro._localFromUniversal(moon, tz)); 
};

/**
 * @protected
 * @static
 * @param {number} jd julian day to calculate from 
 * @returns {number} the julian day of previous new moon before the given julian day date
 */
HanCal._newMoonBefore = function(jd) {
	var tz = HanCal._chineseTZ(jd);
	var uni = Astro._universalFromLocal(jd, tz);
	var moon = Astro._newMoonBefore(uni);
	// floor to the start of the julian day
	return Astro._floorToJD(Astro._localFromUniversal(moon, tz));
};

/**
 * @static
 * @protected
 * @param {number} year the year for which the leap year information is being sought
 * @param {number=} cycle if the given year < 60, this can specify the cycle. If the
 * cycle is not given, then the year should be given as elapsed years since the beginning
 * of the epoch
 */
HanCal._leapYearCalc = function(year, cycle) {
	var ret = {
		elapsedYear: HanCal._getElapsedYear(year, cycle)
	};
	ret.solstice1 = HanCal._solsticeBefore(ret.elapsedYear);
	ret.solstice2 = HanCal._solsticeBefore(ret.elapsedYear+1);
	// ceil to the end of the julian day
	ret.m1 = HanCal._newMoonOnOrAfter(Astro._ceilToJD(ret.solstice1));
	ret.m2 = HanCal._newMoonBefore(Astro._ceilToJD(ret.solstice2));
	
	return ret;
};

/**
 * @protected
 * @static
 * @param {number} jd julian day to calculate from
 * @returns {number} the current major solar term
 */
HanCal._currentMajorST = function(jd) {
	var s = Astro._solarLongitude(Astro._universalFromLocal(jd, HanCal._chineseTZ(jd)));
	return MathUtils.amod(2 + Math.floor(s/30), 12);
};

/**
 * @protected
 * @static
 * @param {number} jd julian day to calculate from
 * @returns {boolean} true if there is no major solar term in the same year
 */
HanCal._noMajorST = function(jd) {
	return HanCal._currentMajorST(jd) === HanCal._currentMajorST(HanCal._newMoonOnOrAfter(jd+1));
};

/**
 * Return the number of months in the given year. The number of months in a year varies
 * for some luni-solar calendars because in some years, an extra month is needed to extend the 
 * days in a year to an entire solar year. The month is represented as a 1-based number
 * where 1=first month, 2=second month, etc.
 * 
 * @param {number} year a year for which the number of months is sought
 * @param {number=} cycle if the given year < 60, this can specify the cycle. If the
 * cycle is not given, then the year should be given as elapsed years since the beginning
 * of the epoch
 * @return {number} The number of months in the given year
 */
HanCal.prototype.getNumMonths = function(year, cycle) {
	return this.isLeapYear(year, cycle) ? 13 : 12;
};

/**
 * Return the number of days in a particular month in a particular year. This function
 * can return a different number for a month depending on the year because of things
 * like leap years.
 * 
 * @param {number} month the elapsed month for which the length is sought
 * @param {number} year the elapsed year within which that month can be found
 * @return {number} the number of days within the given month in the given year
 */
HanCal.prototype.getMonLength = function(month, year) {
	// distance between two new moons in Nanjing China
	var calc = HanCal._leapYearCalc(year);
	var priorNewMoon = HanCal._newMoonOnOrAfter(calc.m1 + month * 29);
	var postNewMoon = HanCal._newMoonOnOrAfter(priorNewMoon + 1);
	return postNewMoon - priorNewMoon;
};

/**
 * Return the equivalent year in the 2820 year cycle that begins on 
 * Far 1, 474. This particular cycle obeys the cycle-of-years formula 
 * whereas the others do not specifically. This cycle can be used as
 * a proxy for other years outside of the cycle by shifting them into 
 * the cycle.   
 * @param {number} year year to find the equivalent cycle year for
 * @returns {number} the equivalent cycle year
 */
HanCal.prototype.equivalentCycleYear = function(year) {
	var y = year - (year >= 0 ? 474 : 473);
	return MathUtils.mod(y, 2820) + 474;
};

/**
 * Return true if the given year is a leap year in the Han calendar.
 * If the year is given as a year/cycle combination, then the year should be in the 
 * range [1,60] and the given cycle is the cycle in which the year is located. If 
 * the year is greater than 60, then
 * it represents the total number of years elapsed in the proleptic calendar since
 * the beginning of the Chinese epoch in on 15 Feb, -2636 (Gregorian). In this 
 * case, the cycle parameter is ignored.
 * 
 * @param {number} year the year for which the leap year information is being sought
 * @param {number=} cycle if the given year < 60, this can specify the cycle. If the
 * cycle is not given, then the year should be given as elapsed years since the beginning
 * of the epoch
 * @return {boolean} true if the given year is a leap year
 */
HanCal.prototype.isLeapYear = function(year, cycle) {
	var calc = HanCal._leapYearCalc(year, cycle);
	return Math.round((calc.m2 - calc.m1) / 29.530588853000001) === 12;
};

/**
 * Return the month of the year that is the leap month. If the given year is
 * not a leap year, then this method will return -1.
 * 
 * @param {number} year the year for which the leap year information is being sought
 * @param {number=} cycle if the given year < 60, this can specify the cycle. If the
 * cycle is not given, then the year should be given as elapsed years since the beginning
 * of the epoch
 * @return {number} the number of the month that is doubled in this leap year, or -1
 * if this is not a leap year
 */
HanCal.prototype.getLeapMonth = function(year, cycle) {
	var calc = HanCal._leapYearCalc(year, cycle);
	
	if (Math.round((calc.m2 - calc.m1) / 29.530588853000001) != 12) {
		return -1; // no leap month
	}
	
	// search between rd1 and rd2 for the first month with no major solar term. That is our leap month.
	var month = 0;
	var m = HanCal._newMoonOnOrAfter(calc.m1+1);
	while (!HanCal._noMajorST(m)) {
		month++;
		m = HanCal._newMoonOnOrAfter(m+1);
	}
	
	// return the number of the month that is doubled
	return month; 
};

/**
 * Return the date of Chinese New Years in the given calendar year.
 * 
 * @param {number} year the Chinese year for which the new year information is being sought
 * @param {number=} cycle if the given year < 60, this can specify the cycle. If the
 * cycle is not given, then the year should be given as elapsed years since the beginning
 * of the epoch
 * @return {number} the julian day of the beginning of the given year 
 */
HanCal.prototype.newYears = function(year, cycle) {
	var calc = HanCal._leapYearCalc(year, cycle);
	var m2 = HanCal._newMoonOnOrAfter(calc.m1+1);
	if (Math.round((calc.m2 - calc.m1) / 29.530588853000001) === 12 &&
			(HanCal._noMajorST(calc.m1) || HanCal._noMajorST(m2)) ) {
		return HanCal._newMoonOnOrAfter(m2+1);
	}
	return m2;
};

/**
 * Return the type of this calendar.
 * 
 * @return {string} the name of the type of this calendar 
 */
HanCal.prototype.getType = function() {
	return this.type;
};


/* register this calendar for the factory method */
Calendar._constructors["han"] = HanCal;

module.exports = HanCal;
