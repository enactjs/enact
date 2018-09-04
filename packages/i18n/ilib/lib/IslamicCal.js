/*
 * islamic.js - Represent a Islamic calendar object.
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


/* !depends 
ilib.js
Calendar.js 
MathUtils.js 
*/

var ilib = require("./ilib.js");
var MathUtils = require("./MathUtils.js");
var Calendar = require("./Calendar.js");

/**
 * @class
 * Construct a new Islamic calendar object. This class encodes information about
 * the civil Islamic calendar. The civil Islamic calendar is a tabular islamic 
 * calendar where the dates are calculated by arithmetic rules. This differs from 
 * the religious Islamic calendar which is used to mark the beginning of particular 
 * holidays. The religious calendar depends on the first sighting of the new 
 * crescent moon to determine the first day of the new month. Because humans and 
 * weather are both involved, the actual time of sighting varies, so it is not 
 * really possible to precalculate the religious calendar. Certain groups, such 
 * as the Islamic Society of North America, decreed in in 2007 that they will use
 * a calendar based on calculations rather than observations to determine the 
 * beginning of lunar months, and therefore the dates of holidays.<p>
 * 
 * @param {Object=} options Options governing the construction of this instance
 * @constructor
 * @extends Calendar
 */
var IslamicCal = function(options) {
	this.type = "islamic";
    
    if (options && typeof(options.onLoad) === "function") {
        options.onLoad(this);
    }
};

/**
 * the lengths of each month 
 * @private
 * @const
 * @type Array.<number>
 */
IslamicCal.monthLengths = [
	30,  /* Muharram */
	29,  /* Saffar */
	30,  /* Rabi'I */
	29,  /* Rabi'II */
	30,  /* Jumada I */
	29,  /* Jumada II */
	30,  /* Rajab */
	29,  /* Sha'ban */
	30,  /* Ramadan */
	29,  /* Shawwal */
	30,  /* Dhu al-Qa'da */
	29   /* Dhu al-Hijja */
];


/**
 * Return the number of months in the given year. The number of months in a year varies
 * for luni-solar calendars because in some years, an extra month is needed to extend the 
 * days in a year to an entire solar year. The month is represented as a 1-based number
 * where 1=first month, 2=second month, etc.
 * 
 * @param {number} year a year for which the number of months is sought
 */
IslamicCal.prototype.getNumMonths = function(year) {
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
IslamicCal.prototype.getMonLength = function(month, year) {
	if (month !== 12) {
		return IslamicCal.monthLengths[month-1];
	} else {
		return this.isLeapYear(year) ? 30 : 29;
	}
};

/**
 * Return true if the given year is a leap year in the Islamic calendar.
 * The year parameter may be given as a number, or as a IslamicDate object.
 * @param {number} year the year for which the leap year information is being sought
 * @return {boolean} true if the given year is a leap year
 */
IslamicCal.prototype.isLeapYear = function(year) {
	return (MathUtils.mod((14 + 11 * year), 30) < 11);
};

/**
 * Return the type of this calendar.
 * 
 * @return {string} the name of the type of this calendar 
 */
IslamicCal.prototype.getType = function() {
	return this.type;
};


/*register this calendar for the factory method */
Calendar._constructors["islamic"] = IslamicCal;

module.exports = IslamicCal;
