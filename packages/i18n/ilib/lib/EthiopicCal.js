/*
 * ethiopic.js - Represent a Ethiopic calendar object.
 * 
 * Copyright © 2015,2018, JEDLSoft
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

/* !depends ilib.js Calendar.js Utils.js MathUtils.js */

var ilib = require("./ilib.js");
var Utils = require("./Utils.js");
var MathUtils = require("./MathUtils.js");

var Calendar = require("./Calendar.js");

/**
 * @class
 * Construct a new Ethiopic calendar object. This class encodes information about
 * a Ethiopic calendar.<p>
 * 
 * @param {Object=} options Options governing the construction of this instance
 * @constructor
 * @extends Calendar
 */
var EthiopicCal = function(options) {
	this.type = "ethiopic";
    
    if (options && typeof(options.onLoad) === "function") {
        options.onLoad(this);
    }
};

/**
 * Return the number of months in the given year. The number of months in a year varies
 * for lunar calendars because in some years, an extra month is needed to extend the 
 * days in a year to an entire solar year. The month is represented as a 1-based number
 * where 1=Maskaram, 2=Teqemt, etc. until 13=Paguemen.
 * 
 * @param {number} year a year for which the number of months is sought
 */
EthiopicCal.prototype.getNumMonths = function(year) {
	return 13;
};

/**
 * Return the number of days in a particular month in a particular year. This function
 * can return a different number for a month depending on the year because of things
 * like leap years.
 * 
 * @param {number|string} month the month for which the length is sought
 * @param {number} year the year within which that month can be found
 * @return {number} the number of days within the given month in the given year
 */
EthiopicCal.prototype.getMonLength = function(month, year) {
	var m = month;
	switch (typeof(m)) {
        case "string": 
            m = parseInt(m, 10); 
            break;
        case "function":
        case "object":
        case "undefined":
            return 30;
            break;
    }    
	if (m < 13) {
		return 30;
	} else {
		return this.isLeapYear(year) ? 6 : 5;
	}
};

/**
 * Return true if the given year is a leap year in the Ethiopic calendar.
 * The year parameter may be given as a number, or as a JulDate object.
 * @param {number|EthiopicDate|string} year the year for which the leap year information is being sought
 * @return {boolean} true if the given year is a leap year
 */
EthiopicCal.prototype.isLeapYear = function(year) {
	var y = year;
	 switch (typeof(y)) {
        case "string":
            y = parseInt(y, 10);
            break;
        case "object":
            if (typeof(y.year) !== "number") { // in case it is an ilib.Date object
                return false;
            }
            y = y.year;
            break;
        case "function":
        case "undefined":
            return false;
            break;
    }
	return MathUtils.mod(y, 4) === 3;
};

/**
 * Return the type of this calendar.
 * 
 * @return {string} the name of the type of this calendar 
 */
EthiopicCal.prototype.getType = function() {
	return this.type;
};


/* register this calendar for the factory method */
Calendar._constructors["ethiopic"] = EthiopicCal;

module.exports = EthiopicCal;
