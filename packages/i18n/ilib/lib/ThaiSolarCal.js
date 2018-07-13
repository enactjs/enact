/*
 * thaisolar.js - Represent a Thai solar calendar object.
 *
 * Copyright © 2013-2015,2018, JEDLSoft
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


/* !depends ilib.js Calendar.js GregorianCal.js MathUtils.js */

var ilib = require("./ilib.js");
var MathUtils = require("./MathUtils.js");
var Calendar = require("./Calendar.js");
var GregorianCal = require("./GregorianCal.js");

/**
 * @class
 * Construct a new Thai solar calendar object. This class encodes information about
 * a Thai solar calendar.<p>
 *
 * @param {Object=} options Options governing the construction of this instance
 * @constructor
 * @extends Calendar
 */
var ThaiSolarCal = function(options) {
	this.type = "thaisolar";
    
    if (options && typeof(options.onLoad) === "function") {
        options.onLoad(this);
    }
};

ThaiSolarCal.prototype = new GregorianCal({noinstance: true});
ThaiSolarCal.prototype.parent = GregorianCal;
ThaiSolarCal.prototype.constructor = ThaiSolarCal;

/**
 * Return true if the given year is a leap year in the Thai solar calendar.
 * The year parameter may be given as a number, or as a ThaiSolarDate object.
 * @param {number|ThaiSolarDate} year the year for which the leap year information is being sought
 * @return {boolean} true if the given year is a leap year
 */
ThaiSolarCal.prototype.isLeapYear = function(year) {
	var y = (typeof(year) === 'number' ? year : year.getYears());
	y -= 543;
	var centuries = MathUtils.mod(y, 400);
	return (MathUtils.mod(y, 4) === 0 && centuries !== 100 && centuries !== 200 && centuries !== 300);
};


/* register this calendar for the factory method */
Calendar._constructors["thaisolar"] = ThaiSolarCal;

module.exports = ThaiSolarCal;
