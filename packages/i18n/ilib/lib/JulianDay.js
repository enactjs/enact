/*
 * JulianDay.js - A Julian Day object.
 * 
 * Copyright © 2012-2015, JEDLSoft
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

/**
 * @class
 * A Julian Day class. A Julian Day is a date based on the Julian Day count
 * of time invented by Joseph Scaliger in 1583 for use with astronomical calculations. 
 * Do not confuse it with a date in the Julian calendar, which it has very
 * little in common with. The naming is unfortunately close, and comes from history.<p>
 * 
 * 
 * @constructor
 * @param {number} num the Julian Day expressed as a floating point number 
 */
var JulianDay = function(num) {
	this.jd = num;
	this.days = Math.floor(this.jd);
	this.frac = num - this.days;
};

JulianDay.prototype = {
	/**
	 * Return the integral portion of this Julian Day instance. This corresponds to
	 * the number of days since the beginning of the epoch.
	 * 
	 * @return {number} the integral portion of this Julian Day
	 */
	getDays: function() {
		return this.days;
	},
	
	/**
	 * Set the date of this Julian Day instance.
	 * 
	 * @param {number} days the julian date expressed as a floating point number
	 */
	setDays: function(days) {
		this.days = Math.floor(days);
		this.jd = this.days + this.frac;
	},
	
	/**
	 * Return the fractional portion of this Julian Day instance. This portion 
	 * corresponds to the time of day for the instance.
	 */
	getDayFraction: function() {
		return this.frac;
	},
	
	/**
	 * Set the fractional part of the Julian Day. The fractional part represents
	 * the portion of a fully day. Julian dates start at noon, and proceed until
	 * noon of the next day. That would mean midnight is represented as a fractional
	 * part of 0.5.
	 * 
	 * @param {number} fraction The fractional part of the Julian date
	 */
	setDayFraction: function(fraction) {
		var t = Math.floor(fraction);
		this.frac = fraction - t;
		this.jd = this.days + this.frac;
	},
	
	/** 
	 * Return the Julian Day expressed as a floating point number.
	 * @return {number} the Julian Day as a number
	 */
	getDate: function () {
		return this.jd;
	},
	
	/**
	 * Set the date of this Julian Day instance.
	 * 
	 * @param {number} num the numeric Julian Day to set into this instance
	 */
	setDate: function (num) {
		this.jd = num;
	},
	
	/**
	 * Add an offset to the current date instance. The offset should be expressed in
	 * terms of Julian days. That is, each integral unit represents one day of time, and
	 * fractional part represents a fraction of a regular 24-hour day.
	 * 
	 * @param {number} offset an amount to add (or subtract) to the current result instance.
	 */
	addDate: function(offset) {
		if (typeof(offset) === 'number') {
			this.jd += offset;
			this.days = Math.floor(this.jd);
			this.frac = this.jd - this.days;
		}
	}
};

module.exports = JulianDay;
