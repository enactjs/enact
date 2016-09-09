/*
 * EthiopicRataDie.js - Represent an RD date in the Ethiopic calendar
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
EthiopicCal.js
RataDie.js
*/

var ilib = require("./ilib.js");
var EthiopicCal = require("./EthiopicCal.js");
var RataDie = require("./RataDie.js");

/**
 * @class
 * Construct a new Ethiopic RD date number object. The constructor parameters can 
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
 * <li><i>month</i> - 1 to 12, where 1 means Maskaram, 2 means Teqemt, etc., and 13 means Paguemen
 * 
 * <li><i>day</i> - 1 to 30
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
 * If the constructor is called with another Ethiopic date instance instead of
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
 * @param {Object=} params parameters that govern the settings and behaviour of this Ethiopic RD date
 */
var EthiopicRataDie = function(params) {
	this.cal = params && params.cal || new EthiopicCal();
	this.rd = undefined;
	RataDie.call(this, params);
};

EthiopicRataDie.prototype = new RataDie();
EthiopicRataDie.prototype.parent = RataDie;
EthiopicRataDie.prototype.constructor = EthiopicRataDie;

/**
 * The difference between the zero Julian day and the first Ethiopic date
 * of Friday, August 29, 8 CE Julian at 6:00am UTC.<p> 
 * 
 * See <a href="http://us.wow.com/wiki/Time_in_Ethiopia?s_chn=90&s_pt=aolsem&v_t=aolsem"
 * Time in Ethiopia</a> for information about how time is handled in Ethiopia.
 * 
 * @protected
 * @type number
 */
EthiopicRataDie.prototype.epoch = 1724219.75;

/**
 * Calculate the Rata Die (fixed day) number of the given date from the
 * date components.
 * 
 * @protected
 * @param {Object} date the date components to calculate the RD from
 */
EthiopicRataDie.prototype._setDateComponents = function(date) {
	var year = date.year;
	var years = 365 * (year - 1) + Math.floor(year/4);
	var dayInYear = (date.month-1) * 30 + date.day;
	var rdtime = (date.hour * 3600000 +
		date.minute * 60000 +
		date.second * 1000 +
		date.millisecond) / 
		86400000;
	
	/*
	console.log("calcRataDie: converting " +  JSON.stringify(parts));
	console.log("getRataDie: year is " +  years);
	console.log("getRataDie: day in year is " +  dayInYear);
	console.log("getRataDie: rdtime is " +  rdtime);
	console.log("getRataDie: rd is " +  (years + dayInYear + rdtime));
	*/
	
	this.rd = years + dayInYear + rdtime;
};

module.exports = EthiopicRataDie;
