/*
 * ThaiSolarDate.js - Represent a date in the ThaiSolar calendar
 * 
 * Copyright © 2013-2015, JEDLSoft
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
IDate.js 
JSUtils.js
GregorianDate.js
ThaiSolarCal.js
*/

var ilib = require("./ilib.js");
var JSUtils = require("./JSUtils.js");

var Calendar = require("./Calendar.js");
var IDate = require("./IDate.js");

var ThaiSolarCal = require("./ThaiSolarCal.js");
var GregorianDate = require("./GregorianDate.js");
var GregRataDie = require("./GregRataDie.js");

/**
 * @class
 * Construct a new Thai solar date object. The constructor parameters can 
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
 * <li><i>timezone</i> - the TimeZone instance or time zone name as a string 
 * of this Thai solar date. The date/time is kept in the local time. The time zone
 * is used later if this date is formatted according to a different time zone and
 * the difference has to be calculated, or when the date format has a time zone
 * component in it.
 * 
 * <li><i>locale</i> - locale for this Thai solar date. If the time zone is not 
 * given, it can be inferred from this locale. For locales that span multiple
 * time zones, the one with the largest population is chosen as the one that 
 * represents the locale. 
 * </ul>
 *
 * If the constructor is called with another Thai solar date instance instead of
 * a parameter block, the other instance acts as a parameter block and its
 * settings are copied into the current instance.<p>
 * 
 * If the constructor is called with no arguments at all or if none of the 
 * properties listed above 
 * from <i>unixtime</i> through <i>millisecond</i> are present, then the date 
 * components are 
 * filled in with the current date at the time of instantiation. Note that if
 * you do not give the time zone when defaulting to the current time and the 
 * time zone for all of ilib was not set with <i>ilib.setTimeZone()</i>, then the
 * time zone will default to UTC ("Universal Time, Coordinated" or "Greenwich 
 * Mean Time").<p>
 * 
 * If any of the properties from <i>year</i> through <i>millisecond</i> are not
 * specified in the params, it is assumed that they have the smallest possible
 * value in the range for the property (zero or one).<p>
 * 
 * 
 * @constructor
 * @extends GregorianDate
 * @param {Object=} params parameters that govern the settings and behaviour of this Thai solar date
 */
var ThaiSolarDate = function(params) {
    var p = {};

    if (params) {
        JSUtils.shallowCopy(params, p);
        
        // there is 198327 days difference between the Thai solar and
        // Gregorian epochs which is equivalent to 543 years
        if (typeof(p.year) !== 'undefined') {
            p.year -= 543;
        }
        if (typeof(p.rd) !== 'undefined') {
            p.rd -= 198327;
        }
    }
    this.rd = null; // clear these out so that the GregorianDate constructor can set it
    this.offset = undefined;
    //console.log("ThaiSolarDate.constructor: date is " + JSON.stringify(this) + " parent is " + JSON.stringify(this.parent) + " and parent.parent is " + JSON.stringify(this.parent.parent));

    p.onLoad = ilib.bind(this, function(gd) {
        this.cal = new ThaiSolarCal();
        
        // make sure the year is set correctly from the original params
        if (params && typeof(params.year) !== 'undefined') {
            this.year = parseInt(params.year, 10);
        }

        if (params && typeof(params.onLoad) === "function") {
            params.onLoad(gd);
        }
    });

    GregorianDate.call(this, p);
};

ThaiSolarDate.prototype = new GregorianDate({noinstance: true});
ThaiSolarDate.prototype.parent = GregorianDate.prototype;
ThaiSolarDate.prototype.constructor = ThaiSolarDate;

/**
 * the difference between a zero Julian day and the zero Thai Solar date.
 * This is some 543 years before the start of the Gregorian epoch. 
 * @private
 * @type number
 */
ThaiSolarDate.epoch = 1523097.5;

/**
 * Calculate the date components for the current time zone
 * @protected
 */
ThaiSolarDate.prototype._calcDateComponents = function () {
	// there is 198327 days difference between the Thai solar and 
	// Gregorian epochs which is equivalent to 543 years
	// console.log("ThaiSolarDate._calcDateComponents: date is " + JSON.stringify(this) + " parent is " + JSON.stringify(this.parent) + " and parent.parent is " + JSON.stringify(this.parent.parent));
	this.parent._calcDateComponents.call(this);
	this.year += 543;
};

/**
 * Return the Rata Die (fixed day) number of this date.
 * 
 * @protected
 * @return {number} the rd date as a number
 */
ThaiSolarDate.prototype.getRataDie = function() {
	// there is 198327 days difference between the Thai solar and 
	// Gregorian epochs which is equivalent to 543 years
	return this.rd.getRataDie() + 198327;
};

/**
 * Return a new Gregorian date instance that represents the first instance of the 
 * given day of the week before the current date. The day of the week is encoded
 * as a number where 0 = Sunday, 1 = Monday, etc.
 * 
 * @param {number} dow the day of the week before the current date that is being sought
 * @return {IDate} the date being sought
 */
ThaiSolarDate.prototype.before = function (dow) {
	return new ThaiSolarDate({
		rd: this.rd.before(dow, this.offset) + 198327,
		timezone: this.timezone
	});
};

/**
 * Return a new Gregorian date instance that represents the first instance of the 
 * given day of the week after the current date. The day of the week is encoded
 * as a number where 0 = Sunday, 1 = Monday, etc.
 * 
 * @param {number} dow the day of the week after the current date that is being sought
 * @return {IDate} the date being sought
 */
ThaiSolarDate.prototype.after = function (dow) {
	return new ThaiSolarDate({
		rd: this.rd.after(dow, this.offset) + 198327,
		timezone: this.timezone
	});
};

/**
 * Return a new Gregorian date instance that represents the first instance of the 
 * given day of the week on or before the current date. The day of the week is encoded
 * as a number where 0 = Sunday, 1 = Monday, etc.
 * 
 * @param {number} dow the day of the week on or before the current date that is being sought
 * @return {IDate} the date being sought
 */
ThaiSolarDate.prototype.onOrBefore = function (dow) {
	return new ThaiSolarDate({
		rd: this.rd.onOrBefore(dow, this.offset) + 198327,
		timezone: this.timezone
	});
};

/**
 * Return a new Gregorian date instance that represents the first instance of the 
 * given day of the week on or after the current date. The day of the week is encoded
 * as a number where 0 = Sunday, 1 = Monday, etc.
 * 
 * @param {number} dow the day of the week on or after the current date that is being sought
 * @return {IDate} the date being sought
 */
ThaiSolarDate.prototype.onOrAfter = function (dow) {
	return new ThaiSolarDate({
		rd: this.rd.onOrAfter(dow, this.offset) + 198327,
		timezone: this.timezone
	});
};

/**
 * Return the name of the calendar that governs this date.
 * 
 * @return {string} a string giving the name of the calendar
 */
ThaiSolarDate.prototype.getCalendar = function() {
	return "thaisolar";
};

//register with the factory method
IDate._constructors["thaisolar"] = ThaiSolarDate;

module.exports = ThaiSolarDate;
