/*
 * hebrew.js - Represent a Hebrew calendar object.
 * 
 * Copyright © 2012-2015,2018, JEDLSoft
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


/* !depends ilib.js Calendar.js MathUtils.js */

var ilib = require("./ilib.js");
var MathUtils = require("./MathUtils.js");
var Calendar = require("./Calendar.js");

/**
 * @class
 * Construct a new Hebrew calendar object. This class encodes information about
 * the Hebrew (Jewish) calendar. The Hebrew calendar is a tabular hebrew 
 * calendar where the dates are calculated by arithmetic rules. This differs from 
 * the religious Hebrew calendar which is used to mark the beginning of particular 
 * holidays. The religious calendar depends on the first sighting of the new 
 * crescent moon to determine the first day of the new month. Because humans and 
 * weather are both involved, the actual time of sighting varies, so it is not 
 * really possible to precalculate the religious calendar. Certain groups, such 
 * as the Hebrew Society of North America, decreed in in 2007 that they will use
 * a calendar based on calculations rather than observations to determine the 
 * beginning of lunar months, and therefore the dates of holidays.<p>
 * 
 * @param {Object=} options Options governing the construction of this instance
 * @constructor
 * @extends Calendar
 */
var HebrewCal = function(options) {
	this.type = "hebrew";
    
    if (options && typeof(options.onLoad) === "function") {
        options.onLoad(this);
    }
};

/**
 * Return the number of days elapsed in the Hebrew calendar before the
 * given year starts.
 * @private
 * @param {number} year the year for which the number of days is sought
 * @return {number} the number of days elapsed in the Hebrew calendar before the
 * given year starts
 */
HebrewCal.elapsedDays = function(year) {
	var months = Math.floor(((235*year) - 234)/19);
	var parts = 204 + 793 * MathUtils.mod(months, 1080);
	var hours = 11 + 12 * months + 793 * Math.floor(months/1080) + 
		Math.floor(parts/1080);
	var days = 29 * months + Math.floor(hours/24);
	return (MathUtils.mod(3 * (days + 1), 7) < 3) ? days + 1 : days;
};

/**
 * Return the number of days that the New Year's (Rosh HaShanah) in the Hebrew 
 * calendar will be corrected for the given year. Corrections are caused because New 
 * Year's is not allowed to start on certain days of the week. To deal with 
 * it, the start of the new year is corrected for the next year by adding a 
 * day to the 8th month (Heshvan) and/or the 9th month (Kislev) in the current
 * year to make them 30 days long instead of 29.
 * 
 * @private
 * @param {number} year the year for which the correction is sought
 * @param {number} elapsed number of days elapsed up to this year
 * @return {number} the number of days correction in the current year to make sure
 * Rosh HaShanah does not fall on undesirable days of the week
 */
HebrewCal.newYearsCorrection = function(year, elapsed) {
	var lastYear = HebrewCal.elapsedDays(year-1),
		thisYear = elapsed,
		nextYear = HebrewCal.elapsedDays(year+1);
	
	return (nextYear - thisYear) == 356 ? 2 : ((thisYear - lastYear) == 382 ? 1 : 0);
};

/**
 * Return the rata die date of the new year for the given hebrew year.
 * @private
 * @param {number} year the year for which the new year is needed
 * @return {number} the rata die date of the new year
 */
HebrewCal.newYear = function(year) {
	var elapsed = HebrewCal.elapsedDays(year); 
	
	return elapsed + HebrewCal.newYearsCorrection(year, elapsed);
};

/**
 * Return the number of days in the given year. Years contain a variable number of
 * days because the date of Rosh HaShanah (New Year's) changes so that it doesn't
 * fall on particular days of the week. Days are added to the months of Heshvan
 * and/or Kislev in the previous year in order to prevent the current year's New
 * Year from being on Sunday, Wednesday, or Friday.
 * 
 * @param {number} year the year for which the length is sought
 * @return {number} number of days in the given year
 */
HebrewCal.daysInYear = function(year) {
	return HebrewCal.newYear(year+1) - HebrewCal.newYear(year);
};

/**
 * Return true if the given year contains a long month of Heshvan. That is,
 * it is 30 days instead of 29.
 * 
 * @private
 * @param {number} year the year in which that month is questioned
 * @return {boolean} true if the given year contains a long month of Heshvan
 */
HebrewCal.longHeshvan = function(year) {
	return MathUtils.mod(HebrewCal.daysInYear(year), 10) === 5;
};

/**
 * Return true if the given year contains a long month of Kislev. That is,
 * it is 30 days instead of 29.
 * 
 * @private
 * @param {number} year the year in which that month is questioned
 * @return {boolean} true if the given year contains a short month of Kislev
 */
HebrewCal.longKislev = function(year) {
	return MathUtils.mod(HebrewCal.daysInYear(year), 10) !== 3;
};

/**
 * Return the date of the last day of the month for the given year. The date of
 * the last day of the month is variable because a number of months gain an extra 
 * day in leap years, and it is variable which months gain a day for each leap 
 * year and which do not.
 * 
 * @param {number} month the month for which the number of days is sought
 * @param {number} year the year in which that month is
 * @return {number} the number of days in the given month and year
 */
HebrewCal.prototype.lastDayOfMonth = function(month, year) {
	switch (month) {
		case 2: 
		case 4: 
		case 6: 
		case 10: 
			return 29;
		case 13:
			return this.isLeapYear(year) ? 29 : 0;
		case 8:
			return HebrewCal.longHeshvan(year) ? 30 : 29;
		case 9:
			return HebrewCal.longKislev(year) ? 30 : 29;
		case 12:
		case 1:
		case 3:
		case 5:
		case 7:
		case 11:
			return 30;
		default:
			return 0;
	}
};

/**
 * Return the number of months in the given year. The number of months in a year varies
 * for luni-solar calendars because in some years, an extra month is needed to extend the 
 * days in a year to an entire solar year. The month is represented as a 1-based number
 * where 1=first month, 2=second month, etc.
 * 
 * @param {number} year a year for which the number of months is sought
 */
HebrewCal.prototype.getNumMonths = function(year) {
	return this.isLeapYear(year) ? 13 : 12;
};

/**
 * Return the number of days in a particular month in a particular year. This function
 * can return a different number for a month depending on the year because of leap years.
 *
 * @param {number} month the month for which the length is sought
 * @param {number} year the year within which that month can be found
 * @returns {number} the number of days within the given month in the given year, or
 * 0 for an invalid month in the year
 */
HebrewCal.prototype.getMonLength = function(month, year) {
	if (month < 1 || month > 13 || (month == 13 && !this.isLeapYear(year))) {
		return 0;
	}
	return this.lastDayOfMonth(month, year);
};

/**
 * Return true if the given year is a leap year in the Hebrew calendar.
 * The year parameter may be given as a number, or as a HebrewDate object.
 * @param {number|Object} year the year for which the leap year information is being sought
 * @returns {boolean} true if the given year is a leap year
 */
HebrewCal.prototype.isLeapYear = function(year) {
	var y = (typeof(year) == 'number') ? year : year.year;
	return (MathUtils.mod(1 + 7 * y, 19) < 7);
};

/**
 * Return the type of this calendar.
 * 
 * @returns {string} the name of the type of this calendar 
 */
HebrewCal.prototype.getType = function() {
	return this.type;
};


/*register this calendar for the factory method */
Calendar._constructors["hebrew"] = HebrewCal;

module.exports = HebrewCal;
