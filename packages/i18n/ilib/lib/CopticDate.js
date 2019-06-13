/*
 * CopticDate.js - Represent a date in the Coptic calendar
 * 
 * Copyright © 2015, JEDLSoft
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
CopticCal.js 
MathUtils.js
JSUtils.js
Locale.js
LocaleInfo.js 
TimeZone.js
EthiopicDate.js
CopticRataDie.js
*/

var ilib = require("./ilib.js");
var MathUtils = require("./MathUtils.js");
var JSUtils = require("./JSUtils.js");

var Locale = require("./Locale.js");
var LocaleInfo = require("./LocaleInfo.js");
var IDate = require("./IDate.js");
var TimeZone = require("./TimeZone.js");
var Calendar = require("./Calendar.js");

var EthiopicDate = require("./EthiopicDate.js");
var CopticCal = require("./CopticCal.js");
var CopticRataDie = require("./CopticRataDie.js");

/**
 * @class
 * Construct a new date object for the Coptic Calendar. The constructor can be called
 * with a parameter object that contains any of the following properties:
 * 
 * <ul>
 * <li><i>unixtime<i> - sets the time of this instance according to the given 
 * unix time. Unix time is the number of milliseconds since midnight on Jan 1, 1970 (Gregorian).
 * <li><i>julianday</i> - the Julian Day to set into this date
 * <li><i>year</i> - any integer
 * <li><i>month</i> - 1 to 13, where 1 means Thoout, 2 means Paope, etc., and 13 means Epagomene
 * <li><i>day</i> - 1 to 30
 * <li><i>hour</i> - 0 to 23. A formatter is used to display 12 hour clocks, but this representation 
 * is always done with an unambiguous 24 hour representation
 * <li><i>minute</i> - 0 to 59
 * <li><i>second</i> - 0 to 59
 * <li><i>millisecond<i> - 0 to 999
 * <li><i>locale</i> - the TimeZone instance or time zone name as a string 
 * of this coptic date. The date/time is kept in the local time. The time zone
 * is used later if this date is formatted according to a different time zone and
 * the difference has to be calculated, or when the date format has a time zone
 * component in it.
 * <li><i>timezone</i> - the time zone of this instance. If the time zone is not 
 * given, it can be inferred from this locale. For locales that span multiple
 * time zones, the one with the largest population is chosen as the one that 
 * represents the locale. 
 * 
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
 * </ul>
 *  
 * If called with another Coptic date argument, the date components of the given
 * date are copied into the current one.<p>
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
 * 
 * @constructor
 * @extends EthiopicDate
 * @param {Object=} params parameters that govern the settings and behaviour of this Coptic date
 */
var CopticDate = function(params) {
    this.rd = NaN; // clear these out so that the EthiopicDate constructor can set it
    var newparams = ilib.extend({}, params);
    newparams.onLoad = function(ed) {
        ed.cal = new CopticCal();
        if (typeof(params.onLoad) === "function") {
            params.onLoad(ed);
        }
    };
    EthiopicDate.call(this, params);
};

CopticDate.prototype = new EthiopicDate({noinstance: true});
CopticDate.prototype.parent = EthiopicDate.prototype;
CopticDate.prototype.constructor = CopticDate;

/**
 * Return a new RD for this date type using the given params.
 * @protected
 * @param {Object=} params the parameters used to create this rata die instance
 * @returns {RataDie} the new RD instance for the given params
 */
CopticDate.prototype.newRd = function (params) {
	return new CopticRataDie(params);
};

/**
 * Return the day of the week of this date. The day of the week is encoded
 * as number from 0 to 6, with 0=Sunday, 1=Monday, etc., until 6=Saturday.
 * 
 * @return {number} the day of the week
 */
CopticDate.prototype.getDayOfWeek = function() {
	var rd = Math.floor(this.rd.getRataDie() + (this.offset || 0));
	return MathUtils.mod(rd-3, 7);
};

/**
 * Return the name of the calendar that governs this date.
 * 
 * @return {string} a string giving the name of the calendar
 */
CopticDate.prototype.getCalendar = function() {
	return "coptic";
};

//register with the factory method
IDate._constructors["coptic"] = CopticDate;

module.exports = CopticDate;