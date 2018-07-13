/*
 * persratadie.js - Represent a rata die date in the Persian calendar
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
MathUtils.js
RataDie.js
Astro.js
GregorianDate.js
*/

var ilib = require("./ilib.js");
var MathUtils = require("./MathUtils.js");

var Astro = require("./Astro.js");
var RataDie = require("./RataDie.js");
var GregorianDate = require("./GregorianDate.js");


/**
 * @class
 * Construct a new Persian RD date number object. The constructor parameters can
 * contain any of the following properties:
 *
 * <ul>
 * <li><i>unixtime<i> - sets the time of this instance according to the given
 * unix time. Unix time is the number of milliseconds since midnight on Jan 1, 1970, Gregorian
 *
 * <li><i>julianday</i> - sets the time of this instance according to the given
 * Julian Day instance or the Julian Day given as a float
 *
 * <li><i>year</i> - any integer, including 0
 *
 * <li><i>month</i> - 1 to 12, where 1 means Farvardin, 2 means Ordibehesht, etc.
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
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
 * </ul>
 *
 * If the constructor is called with another Persian date instance instead of
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
 * @param {Object=} params parameters that govern the settings and behaviour of this Persian RD date
 */
var PersRataDie = function(params) {
	this.rd = NaN;
	Astro.initAstro(
		params && typeof(params.sync) === 'boolean' ? params.sync : true,
		params && params.loadParams,
		ilib.bind(this, function (x) {
		    RataDie.call(this, params);
			if (params && typeof(params.callback) === 'function') {
				params.callback(this);
			}
		})
	);
};

PersRataDie.prototype = new RataDie();
PersRataDie.prototype.parent = RataDie;
PersRataDie.prototype.constructor = PersRataDie;

/**
 * The difference between a zero Julian day and the first Persian date
 * @private
 * @type number
 */
PersRataDie.prototype.epoch = 1948319.5;

/**
 * @protected
 */
PersRataDie.prototype._tehranEquinox = function(year) {
    var equJED, equJD, equAPP, equTehran, dtTehran, eot;

    //  March equinox in dynamical time
    equJED = Astro._equinox(year, 0);

    //  Correct for delta T to obtain Universal time
    equJD = equJED - (Astro._deltat(year) / (24 * 60 * 60));

    //  Apply the equation of time to yield the apparent time at Greenwich
    eot = Astro._equationOfTime(equJED) * 360;
    eot = (eot - 20 * Math.floor(eot/20)) / 360;
    equAPP = equJD + eot;

    /*
     * Finally, we must correct for the constant difference between
     * the Greenwich meridian and the time zone standard for Iran
     * Standard time, 52 degrees 30 minutes to the East.
     */

    dtTehran = 52.5 / 360;
    equTehran = equAPP + dtTehran;

    return equTehran;
};

/**
 * Calculate the year based on the given Julian day.
 * @protected
 * @param {number} jd the Julian day to get the year for
 * @return {{year:number,equinox:number}} the year and the last equinox
 */
PersRataDie.prototype._getYear = function(jd) {
	var gd = new GregorianDate({julianday: jd});
    var guess = gd.getYears() - 2,
    	nexteq,
    	ret = {};

    //ret.equinox = Math.floor(this._tehranEquinox(guess));
    ret.equinox = this._tehranEquinox(guess);
	while (ret.equinox > jd) {
	    guess--;
	    // ret.equinox = Math.floor(this._tehranEquinox(guess));
	    ret.equinox = this._tehranEquinox(guess);
	}
	nexteq = ret.equinox - 1;
	// if the equinox falls after noon, then the day after that is the start of the
	// next year, so truncate the JD to get the noon of the day before the day with
	//the equinox on it, then add 0.5 to get the midnight of that day
	while (!(Math.floor(ret.equinox) + 0.5 <= jd && jd < Math.floor(nexteq) + 0.5)) {
	    ret.equinox = nexteq;
	    guess++;
	    // nexteq = Math.floor(this._tehranEquinox(guess));
	    nexteq = this._tehranEquinox(guess);
	}

	// Mean solar tropical year is 365.24219878 days
	ret.year = Math.round((ret.equinox - this.epoch - 1) / 365.24219878) + 1;

	return ret;
};

/**
 * Calculate the Rata Die (fixed day) number of the given date from the
 * date components.
 *
 * @protected
 * @param {Object} date the date components to calculate the RD from
 */
PersRataDie.prototype._setDateComponents = function(date) {
    var adr, guess, jd;

    // Mean solar tropical year is 365.24219878 days
    guess = this.epoch + 1 + 365.24219878 * ((date.year || 0) - 2);
    adr = {year: (date.year || 0) - 1, equinox: 0};

    while (adr.year < date.year) {
        adr = this._getYear(guess);
        guess = adr.equinox + (365.24219878 + 2);
    }

    jd = Math.floor(adr.equinox) +
            (((date.month || 0) <= 7) ?
                (((date.month || 1) - 1) * 31) :
                ((((date.month || 1) - 1) * 30) + 6)
            ) +
    	    ((date.day || 1) - 1 + 0.5); // add 0.5 so that we convert JDs, which start at noon to RDs which start at midnight

	jd += ((date.hour || 0) * 3600000 +
			(date.minute || 0) * 60000 +
			(date.second || 0) * 1000 +
			(date.millisecond || 0)) /
			86400000;

    this.rd = jd - this.epoch;
};

/**
 * Return the rd number of the particular day of the week on or before the
 * given rd. eg. The Sunday on or before the given rd.
 * @private
 * @param {number} rd the rata die date of the reference date
 * @param {number} dayOfWeek the day of the week that is being sought relative
 * to the current date
 * @return {number} the rd of the day of the week
 */
PersRataDie.prototype._onOrBefore = function(rd, dayOfWeek) {
	return rd - MathUtils.mod(Math.floor(rd) - dayOfWeek - 3, 7);
};

module.exports = PersRataDie;