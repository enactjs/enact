/*
 * julian.js - Represent a Julian calendar object.
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
 * Construct a new Julian calendar object. This class encodes information about
 * a Julian calendar.<p>
 * 
 * @param {Object=} options Options governing the construction of this instance
 * @constructor
 * @extends Calendar
 */
var JulianCal = function(options) {
	this.type = "julian";
    
    if (options && typeof(options.onLoad) === "function") {
        options.onLoad(this);
    }
};

/* the lengths of each month */
JulianCal.monthLengths = [
	31,  /* Jan */
	28,  /* Feb */
	31,  /* Mar */
	30,  /* Apr */
	31,  /* May */
	30,  /* Jun */
	31,  /* Jul */
	31,  /* Aug */
	30,  /* Sep */
	31,  /* Oct */
	30,  /* Nov */
	31   /* Dec */
];

/**
 * the cumulative lengths of each month, for a non-leap year 
 * @private
 * @const
 * @type Array.<number>
 */
JulianCal.cumMonthLengths = [
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
JulianCal.cumMonthLengthsLeap = [
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
 * Return the number of months in the given year. The number of months in a year varies
 * for lunar calendars because in some years, an extra month is needed to extend the 
 * days in a year to an entire solar year. The month is represented as a 1-based number
 * where 1=Jaunary, 2=February, etc. until 12=December.
 * 
 * @param {number} year a year for which the number of months is sought
 */
JulianCal.prototype.getNumMonths = function(year) {
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
JulianCal.prototype.getMonLength = function(month, year) {
	if (month !== 2 || !this.isLeapYear(year)) {
		return JulianCal.monthLengths[month-1];
	} else {
		return 29;
	}
};

/**
 * Return true if the given year is a leap year in the Julian calendar.
 * The year parameter may be given as a number, or as a JulDate object.
 * @param {number|JulianDate} year the year for which the leap year information is being sought
 * @return {boolean} true if the given year is a leap year
 */
JulianCal.prototype.isLeapYear = function(year) {
	var y = (typeof(year) === 'number' ? year : year.year);
	return MathUtils.mod(y, 4) === ((year > 0) ? 0 : 3);
};

/**
 * Return the type of this calendar.
 * 
 * @return {string} the name of the type of this calendar 
 */
JulianCal.prototype.getType = function() {
	return this.type;
};


/* register this calendar for the factory method */
Calendar._constructors["julian"] = JulianCal;

module.exports = JulianCal;
