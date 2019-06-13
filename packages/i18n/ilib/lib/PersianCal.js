/*
 * persianastro.js - Represent a Persian astronomical (Hijjri) calendar object.
 * 
 * Copyright © 2014-2015,2018, JEDLSoft
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
Calendar.js 
PersRataDie.js 
ilib.js
MathUtils.js
*/

var ilib = require("./ilib.js");
var MathUtils = require("./MathUtils.js");

var Calendar = require("./Calendar.js");

var PersRataDie = require("./PersRataDie.js");

/**
 * @class
 * Construct a new Persian astronomical (Hijjri) calendar object. This class encodes 
 * information about a Persian calendar. This class differs from the 
 * Persian calendar in that the leap years are calculated based on the
 * astronomical observations of the sun in Teheran, instead of calculating
 * the leap years based on a regular cyclical rhythm algorithm.<p>
 * 
 * @param {Object=} options Options governing the construction of this instance
 * @constructor
 * @extends Calendar
 */
var PersianCal = function(options) {
	this.type = "persian";
    
    if (options && typeof(options.onLoad) === "function") {
        options.onLoad(this);
    }
};

/**
 * @private
 * @const
 * @type Array.<number> 
 * the lengths of each month 
 */
PersianCal.monthLengths = [
	31,  // Farvardin
	31,  // Ordibehesht
	31,  // Khordad
	31,  // Tir
	31,  // Mordad
	31,  // Shahrivar
	30,  // Mehr
	30,  // Aban
	30,  // Azar
	30,  // Dey
	30,  // Bahman
	29   // Esfand
];

/**
 * Return the number of months in the given year. The number of months in a year varies
 * for some luni-solar calendars because in some years, an extra month is needed to extend the 
 * days in a year to an entire solar year. The month is represented as a 1-based number
 * where 1=first month, 2=second month, etc.
 * 
 * @param {number} year a year for which the number of months is sought
 * @return {number} The number of months in the given year
 */
PersianCal.prototype.getNumMonths = function(year) {
	return 12;
};

/**
 * Return the number of days in a particular month in a particular year. This function
 * can return a different number for a month depending on the year because of things
 * like leap years.
 * 
 * @param {number} month the month for which the length is sought
 * @param {number} year the year within which that month can be found
 * @return {number} the number of days within the given month in the given year
 */
PersianCal.prototype.getMonLength = function(month, year) {
	if (month !== 12 || !this.isLeapYear(year)) {
		return PersianCal.monthLengths[month-1];
	} else {
		// Month 12, Esfand, has 30 days instead of 29 in leap years
		return 30;
	}
};

/**
 * Return true if the given year is a leap year in the Persian astronomical calendar.
 * @param {number} year the year for which the leap year information is being sought
 * @return {boolean} true if the given year is a leap year
 */
PersianCal.prototype.isLeapYear = function(year) {
	var rdNextYear = new PersRataDie({
		cal: this,
		year: year + 1,
		month: 1,
		day: 1,
		hour: 0,
		minute: 0,
		second: 0,
		millisecond: 0
	});
	var rdThisYear = new PersRataDie({
		cal: this,
		year: year,
		month: 1,
		day: 1,
		hour: 0,
		minute: 0,
		second: 0,
		millisecond: 0
	}); 
    return (rdNextYear.getRataDie() - rdThisYear.getRataDie()) > 365;
};

/**
 * Return the type of this calendar.
 * 
 * @return {string} the name of the type of this calendar 
 */
PersianCal.prototype.getType = function() {
	return this.type;
};

/* register this calendar for the factory method */
Calendar._constructors["persian"] = PersianCal;

module.exports = PersianCal;
