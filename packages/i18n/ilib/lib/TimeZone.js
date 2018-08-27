/*
 * TimeZone.js - Definition of a time zone class
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

/*
!depends 
ilib.js 
Locale.js
LocaleInfo.js
Utils.js
MathUtils.js
JSUtils.js
GregRataDie.js
IString.js
CalendarFactory.js
*/

// !data localeinfo zoneinfo

var ilib = require("./ilib.js");
var Utils = require("./Utils.js");
var MathUtils = require("./MathUtils.js");
var JSUtils = require("./JSUtils.js");

var Locale = require("./Locale.js");
var LocaleInfo = require("./LocaleInfo.js");

var GregRataDie = require("./GregRataDie.js");
var CalendarFactory = require("./CalendarFactory.js");
var IString = require("./IString.js");

/**
 * @class
 * Create a time zone instance. 
 * 
 * This class reports and transforms
 * information about particular time zones.<p>
 * 
 * The options parameter may contain any of the following properties:
 * 
 * <ul>
 * <li><i>id</i> - The id of the requested time zone such as "Europe/London" or 
 * "America/Los_Angeles". These are taken from the IANA time zone database. (See
 * http://www.iana.org/time-zones for more information.) <p>
 * 
 * There is one special 
 * time zone that is not taken from the IANA database called simply "local". In
 * this case, this class will attempt to discover the current time zone and
 * daylight savings time settings by calling standard Javascript classes to 
 * determine the offsets from UTC. 
 * 
 * <li><i>locale</i> - The locale for this time zone.
 * 
 * <li><i>offset</i> - Choose the time zone based on the offset from UTC given in
 * number of minutes (negative is west, positive is east).
 * 
 * <li><i>onLoad</i> - a callback function to call when the data is fully 
 * loaded. When the onLoad option is given, this class will attempt to
 * load any missing locale data using the ilib loader callback.
 * When the data is loaded, the onLoad function is called with the current 
 * instance as a parameter. 
 * 
 * <li><i>sync</i> - tell whether to load any missing locale data synchronously or 
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while.
 *  
 * <li><i>loadParams</i> - an object containing parameters to pass to the 
 * loader callback function when locale data is missing. The parameters are not
 * interpretted or modified in any way. They are simply passed along. The object 
 * may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
 * </ul>
 * 
 * There is currently no way in the ECMAscript
 * standard to tell which exact time zone is currently in use. Choosing the
 * id "locale" or specifying an explicit offset will not give a specific time zone, 
 * as it is impossible to tell with certainty which zone the offsets 
 * match.<p>
 * 
 * When the id "local" is given or the offset option is specified, this class will
 * have the following behaviours:
 * <ul>
 * <li>The display name will always be given as the RFC822 style, no matter what
 * style is requested
 * <li>The id will also be returned as the RFC822 style display name
 * <li>When the offset is explicitly given, this class will assume the time zone 
 * does not support daylight savings time, and the offsets will be calculated 
 * the same way year round.
 * <li>When the offset is explicitly given, the inDaylightSavings() method will 
 * always return false.
 * <li>When the id "local" is given, this class will attempt to determine the 
 * daylight savings time settings by examining the offset from UTC on Jan 1
 * and June 1 of the current year. If they are different, this class assumes
 * that the local time zone uses DST. When the offset for a particular date is
 * requested, it will use the built-in Javascript support to determine the 
 * offset for that date.
 * </ul> 
 * 
 * If a more specific time zone is 
 * needed with display names and known start/stop times for DST, use the "id" 
 * property instead to specify the time zone exactly. You can perhaps ask the
 * user which time zone they prefer so that your app does not need to guess.<p>
 * 
 * If the id and the offset are both not given, the default time zone for the 
 * locale is retrieved from
 * the locale info. If the locale is not specified, the default locale for the
 * library is used.<p>
 * 
 * Because this class was designed for use in web sites, and the vast majority
 * of dates and times being formatted are recent date/times, this class is simplified
 * by not implementing historical time zones. That is, when governments change the 
 * time zone rules for a particular zone, only the latest such rule is implemented 
 * in this class. That means that determining the offset for a date that is prior 
 * to the last change may give the wrong result. Historical time zone calculations
 * may be implemented in a later version of iLib if there is enough demand for it,
 * but it would entail a much larger set of time zone data that would have to be
 * loaded.  
 * 
 * 
 * @constructor
 * @param {Object} options Options guiding the construction of this time zone instance
 */
var TimeZone = function(options) {
	this.sync = true;
	this.locale = new Locale();
	this.isLocal = false;
	
	if (options) {
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? new Locale(options.locale) : options.locale;
		}
		
		if (options.id) {
			var id = options.id.toString();
			if (id === 'local') {
				this.isLocal = true;
				
				// use standard Javascript Date to figure out the time zone offsets
				var now = new Date(), 
					jan1 = new Date(now.getFullYear(), 0, 1),  // months in std JS Date object are 0-based
					jun1 = new Date(now.getFullYear(), 5, 1);
				
				// Javascript's method returns the offset backwards, so we have to
				// take the negative to get the correct offset
				this.offsetJan1 = -jan1.getTimezoneOffset();
				this.offsetJun1 = -jun1.getTimezoneOffset();
				// the offset of the standard time for the time zone is always the one that is closest 
				// to negative infinity of the two, no matter whether you are in the northern or southern 
				// hemisphere, east or west
				this.offset = Math.min(this.offsetJan1, this.offsetJun1);
			}
			this.id = id;
		} else if (options.offset) {
			this.offset = (typeof(options.offset) === 'string') ? parseInt(options.offset, 10) : options.offset;
			this.id = this.getDisplayName(undefined, undefined);
		}
		
		if (typeof(options.sync) !== 'undefined') {
			this.sync = !!options.sync;
		}
		
		this.loadParams = options.loadParams;
		this.onLoad = options.onLoad;
	}

	//console.log("timezone: locale is " + this.locale);
	
	if (!this.id) {
		new LocaleInfo(this.locale, {
			sync: this.sync,
			loadParams: this.loadParams,
			onLoad: ilib.bind(this, function (li) {
				this.id = li.getTimeZone() || "Etc/UTC";
				this._loadtzdata();
			})
		});
	} else {
		this._loadtzdata();
	}

	//console.log("localeinfo is: " + JSON.stringify(this.locinfo));
	//console.log("id is: " + JSON.stringify(this.id));
};

/*
 * Explanation of the compressed time zone info properties.
 * {
 *     "o": "8:0",      // offset from UTC
 *     "f": "W{c}T",    // standard abbreviation. For time zones that observe DST, the {c} replacement is replaced with the 
 *                      // letter in the e.c or s.c properties below 
 *     "e": {           // info about the end of DST
 *         "j": 78322.5 // Julian day when the transition happens. Either specify the "j" property or all of the "m", "r", and 
 *                      // "t" properties, but not both sets.
 *         "m": 3,      // month that it ends
 *         "r": "l0",   // rule for the day it ends "l" = "last", numbers are Sun=0 through Sat=6. Other syntax is "0>7". 
 *                      // This means the 0-day (Sun) after the 7th of the month. Other possible operators are <, >, <=, >=
 *         "t": "2:0",  // time of day that the DST turns off, hours:minutes
 *         "c": "S"     // character to replace into the abbreviation for standard time 
 *     },
 *     "s": {           // info about the start of DST
 *         "j": 78189.5 // Julian day when the transition happens. Either specify the "j" property or all of the "m", "r", and 
 *                      // "t" properties, but not both sets.
 *         "m": 10,     // month that it starts
 *         "r": "l0",   // rule for the day it starts "l" = "last", numbers are Sun=0 through Sat=6. Other syntax is "0>7".
 *                      // This means the 0-day (Sun) after the 7th of the month. Other possible operators are <, >, <=, >=
 *         "t": "2:0",  // time of day that the DST turns on, hours:minutes
 *         "v": "1:0",  // amount of time saved in hours:minutes
 *         "c": "D"     // character to replace into the abbreviation for daylight time
 *     },
 *     "c": "AU",       // ISO code for the country that contains this time zone
 *     "n": "W. Australia {c} Time"
 *                      // long English name of the zone. The {c} replacement is for the word "Standard" or "Daylight" as appropriate
 * }
 */
TimeZone.prototype._loadtzdata = function () {
	var zoneName = this.id.replace(/-/g, "m").replace(/\+/g, "p");
	// console.log("id is: " + JSON.stringify(this.id));
	// console.log("zoneinfo is: " + JSON.stringify(ilib.data.zoneinfo[zoneName]));
	if (!ilib.data.zoneinfo[zoneName] && typeof(this.offset) === 'undefined') {
		Utils.loadData({
			object: "TimeZone", 
			nonlocale: true,	// locale independent 
			name: "zoneinfo/" + this.id + ".json", 
			sync: this.sync, 
			loadParams: this.loadParams, 
			callback: ilib.bind(this, function (tzdata) {
				if (tzdata && !JSUtils.isEmpty(tzdata)) {
					ilib.data.zoneinfo[zoneName] = tzdata;
				}
				this._initZone(zoneName);
			})
		});
	} else {
		this._initZone(zoneName);
	}
};

TimeZone.prototype._initZone = function(zoneName) {
	/** 
	 * @private
	 * @type {{o:string,f:string,e:Object.<{m:number,r:string,t:string,z:string}>,s:Object.<{m:number,r:string,t:string,z:string,v:string,c:string}>,c:string,n:string}} 
	 */
	this.zone = ilib.data.zoneinfo[zoneName];
	if (!this.zone && typeof(this.offset) === 'undefined') {
		this.id = "Etc/UTC";
		this.zone = ilib.data.zoneinfo[this.id];
	}
	
	this._calcDSTSavings();
	
	if (typeof(this.offset) === 'undefined' && this.zone.o) {
		var offsetParts = this._offsetStringToObj(this.zone.o);
		/**
		 * @private
		 * @type {number} raw offset from UTC without DST, in minutes
		 */
		this.offset = (Math.abs(offsetParts.h || 0) * 60 + (offsetParts.m || 0)) * MathUtils.signum(offsetParts.h || 0);
	}
	
	if (this.onLoad && typeof(this.onLoad) === 'function') {
		this.onLoad(this);
	}
};

/** @private */
TimeZone._marshallIds = function (country, sync, callback) {
	var tz, ids = [];
	
	if (!country) {
		// local is a special zone meaning "the local time zone according to the JS engine we are running upon"
		ids.push("local");
		for (tz in ilib.data.timezones) {
			if (ilib.data.timezones[tz]) {
				ids.push(ilib.data.timezones[tz]);
			}
		}
		if (typeof(callback) === 'function') {
			callback(ids);
		}
	} else {
		if (!ilib.data.zoneinfo.zonetab) {
			Utils.loadData({
				object: "TimeZone", 
				nonlocale: true,	// locale independent 
				name: "zoneinfo/zonetab.json", 
				sync: sync, 
				callback: ilib.bind(this, function (tzdata) {
					if (tzdata) {
						ilib.data.zoneinfo.zonetab = tzdata;
					}
					
					ids = ilib.data.zoneinfo.zonetab[country];
					
					if (typeof(callback) === 'function') {
						callback(ids);
					}
				})
			});
		} else {
			ids = ilib.data.zoneinfo.zonetab[country];
			if (typeof(callback) === 'function') {
				callback(ids);
			}
		}
	}
	
	return ids;
};

/**
 * Return an array of available zone ids that the constructor knows about.
 * The country parameter is optional. If it is not given, all time zones will
 * be returned. If it specifies a country code, then only time zones for that
 * country will be returned.
 * 
 * @param {string|undefined} country country code for which time zones are being sought
 * @param {boolean} sync whether to find the available ids synchronously (true) or asynchronously (false)
 * @param {function(Array.<string>)} onLoad callback function to call when the data is finished loading
 * @return {Array.<string>} an array of zone id strings
 */
TimeZone.getAvailableIds = function (country, sync, onLoad) {
	var tz, ids = [];
	
	if (typeof(sync) !== 'boolean') {
		sync = true;
	}
	
	if (ilib.data.timezones.length === 0) {
		if (typeof(ilib._load) !== 'undefined' && typeof(ilib._load.listAvailableFiles) === 'function') {
			ilib._load.listAvailableFiles(sync, function(hash) {
				for (var dir in hash) {
					var files = hash[dir];
					if (ilib.isArray(files)) {
						files.forEach(function (filename) {
							if (filename && filename.match(/^zoneinfo/)) {
								ilib.data.timezones.push(filename.replace(/^zoneinfo\//, "").replace(/\.json$/, ""));
							}
						});
					}
				}
				ids = TimeZone._marshallIds(country, sync, onLoad);
			});
		} else {
			for (tz in ilib.data.zoneinfo) {
				if (ilib.data.zoneinfo[tz]) {
					ilib.data.timezones.push(tz);
				}
			}
			ids = TimeZone._marshallIds(country, sync, onLoad);
		}
	} else {
		ids = TimeZone._marshallIds(country, sync, onLoad);
	}
	
	return ids;
};

/**
 * Return the id used to uniquely identify this time zone.
 * @return {string} a unique id for this time zone
 */
TimeZone.prototype.getId = function () {
	return this.id.toString();
};

/**
 * Return the abbreviation that is used for the current time zone on the given date.
 * The date may be in DST or during standard time, and many zone names have different
 * abbreviations depending on whether or not the date is falls within DST.<p>
 * 
 * There are two styles that are supported:
 * 
 * <ol>
 * <li>standard - returns the 3 to 5 letter abbreviation of the time zone name such 
 * as "CET" for "Central European Time" or "PDT" for "Pacific Daylight Time"
 * <li>rfc822 - returns an RFC 822 style time zone specifier, which specifies more
 * explicitly what the offset is from UTC
 * <li>long - returns the long name of the zone in English
 * </ol>
 *  
 * @param {IDate=} date a date to determine if it is in daylight time or standard time
 * @param {string=} style one of "standard" or "rfc822". Default if not specified is "standard"
 * @return {string} the name of the time zone, abbreviated according to the style 
 */
TimeZone.prototype.getDisplayName = function (date, style) {
	style = (this.isLocal || typeof(this.zone) === 'undefined') ? "rfc822" : (style || "standard");
	switch (style) {
		default:
		case 'standard':
			if (this.zone.f && this.zone.f !== "zzz") {
				if (this.zone.f.indexOf("{c}") !== -1) {
					var letter = "";
					letter = this.inDaylightTime(date) ? this.zone.s && this.zone.s.c : this.zone.e && this.zone.e.c; 
					var temp = new IString(this.zone.f);
					return temp.format({c: letter || ""});
				}
				return this.zone.f;
			} 
			var temp = "GMT" + this.zone.o;
			if (this.inDaylightTime(date)) {
				temp += "+" + this.zone.s.v;
			}
			return temp;
			break;
		case 'rfc822':
			var offset = this.getOffset(date), // includes the DST if applicable
				ret = "UTC",
				hour = offset.h || 0,
				minute = offset.m || 0;
			
			if (hour !== 0) {
				ret += (hour > 0) ? "+" : "-";
				if (Math.abs(hour) < 10) {
					ret += "0";
				}
				ret += (hour < 0) ? -hour : hour;
				if (minute < 10) {
					ret += "0";
				}
				ret += minute;
			}
			return ret; 
		case 'long':
			if (this.zone.n) {
				if (this.zone.n.indexOf("{c}") !== -1) {
					var str = this.inDaylightTime(date) ? "Daylight" : "Standard"; 
					var temp = new IString(this.zone.n);
					return temp.format({c: str || ""});
				}
				return this.zone.n;
			}
			var temp = "GMT" + this.zone.o;
			if (this.inDaylightTime(date)) {
				temp += "+" + this.zone.s.v;
			}
			return temp;
			break;
	}
};

/**
 * Convert the offset string to an object with an h, m, and possibly s property
 * to indicate the hours, minutes, and seconds.
 * 
 * @private
 * @param {string} str the offset string to convert to an object
 * @return {Object.<{h:number,m:number,s:number}>} an object giving the offset for the zone at 
 * the given date/time, in hours, minutes, and seconds
 */
TimeZone.prototype._offsetStringToObj = function (str) {
	var offsetParts = (typeof(str) === 'string') ? str.split(":") : [],
		ret = {h:0},
		temp;
	
	if (offsetParts.length > 0) {
		ret.h = parseInt(offsetParts[0], 10);
		if (offsetParts.length > 1) {
			temp = parseInt(offsetParts[1], 10);
			if (temp) {
				ret.m = temp;
			}
			if (offsetParts.length > 2) {
				temp = parseInt(offsetParts[2], 10);
				if (temp) {
					ret.s = temp;
				}
			}
		}
	}

	return ret;
};

/**
 * Returns the offset of this time zone from UTC at the given date/time. If daylight saving 
 * time is in effect at the given date/time, this method will return the offset value 
 * adjusted by the amount of daylight saving.
 * @param {IDate=} date the date for which the offset is needed
 * @return {Object.<{h:number,m:number}>} an object giving the offset for the zone at 
 * the given date/time, in hours, minutes, and seconds  
 */
TimeZone.prototype.getOffset = function (date) {
	if (!date) {
		return this.getRawOffset();
	}
	var offset = this.getOffsetMillis(date)/60000;
	
	var hours = MathUtils.down(offset/60),
		minutes = Math.abs(offset) - Math.abs(hours)*60;

	var ret = {
		h: hours
	};
	if (minutes != 0) {
		ret.m = minutes;
	}
	return ret;
};

/**
 * Returns the offset of this time zone from UTC at the given date/time expressed in 
 * milliseconds. If daylight saving 
 * time is in effect at the given date/time, this method will return the offset value 
 * adjusted by the amount of daylight saving. Negative numbers indicate offsets west
 * of UTC and conversely, positive numbers indicate offset east of UTC.
 *  
 * @param {IDate=} date the date for which the offset is needed, or null for the
 * present date
 * @return {number} the number of milliseconds of offset from UTC that the given date is
 */
TimeZone.prototype.getOffsetMillis = function (date) {
	var ret;
	
	// check if the dst property is defined -- the intrinsic JS Date object doesn't work so
	// well if we are in the overlap time at the end of DST
	if (this.isLocal && typeof(date.dst) === 'undefined') {
		var d = (!date) ? new Date() : new Date(date.getTimeExtended());
		return -d.getTimezoneOffset() * 60000;
	} 
	
	ret = this.offset;
	
	if (date && this.inDaylightTime(date)) {
		ret += this.dstSavings;
	}
	
	return ret * 60000;
};

/**
 * Return the offset in milliseconds when the date has an RD number in wall
 * time rather than in UTC time.
 * @protected
 * @param date the date to check in wall time
 * @returns {number} the number of milliseconds of offset from UTC that the given date is
 */
TimeZone.prototype._getOffsetMillisWallTime = function (date) {
	var ret;
	
	ret = this.offset;
	
	if (date && this.inDaylightTime(date, true)) {
		ret += this.dstSavings;
	}
	
	return ret * 60000;
};

/**
 * Returns the offset of this time zone from UTC at the given date/time. If daylight saving 
 * time is in effect at the given date/time, this method will return the offset value 
 * adjusted by the amount of daylight saving.
 * @param {IDate=} date the date for which the offset is needed
 * @return {string} the offset for the zone at the given date/time as a string in the 
 * format "h:m:s" 
 */
TimeZone.prototype.getOffsetStr = function (date) {
	var offset = this.getOffset(date),
		ret;
	
	ret = offset.h;
	if (typeof(offset.m) !== 'undefined') {
		ret += ":" + offset.m;
		if (typeof(offset.s) !== 'undefined') {
			ret += ":" + offset.s;
		}
	} else {
		ret += ":0";
	}
	
	return ret;
};

/**
 * Gets the offset from UTC for this time zone.
 * @return {Object.<{h:number,m:number,s:number}>} an object giving the offset from 
 * UTC for this time zone, in hours, minutes, and seconds 
 */
TimeZone.prototype.getRawOffset = function () {
	var hours = MathUtils.down(this.offset/60),
		minutes = Math.abs(this.offset) - Math.abs(hours)*60;
	
	var ret = {
		h: hours
	};
	if (minutes != 0) {
		ret.m = minutes;
	}
	return ret;
};

/**
 * Gets the offset from UTC for this time zone expressed in milliseconds. Negative numbers
 * indicate zones west of UTC, and positive numbers indicate zones east of UTC.
 * 
 * @return {number} an number giving the offset from 
 * UTC for this time zone in milliseconds 
 */
TimeZone.prototype.getRawOffsetMillis = function () {
	return this.offset * 60000;
};

/**
 * Gets the offset from UTC for this time zone without DST savings.
 * @return {string} the offset from UTC for this time zone, in the format "h:m:s" 
 */
TimeZone.prototype.getRawOffsetStr = function () {
	var off = this.getRawOffset();
	return off.h + ":" + (off.m || "0");
};

/**
 * Return the amount of time in hours:minutes that the clock is advanced during
 * daylight savings time.
 * @return {Object.<{h:number,m:number,s:number}>} the amount of time that the 
 * clock advances for DST in hours, minutes, and seconds 
 */
TimeZone.prototype.getDSTSavings = function () {
	if (this.isLocal) {
		// take the absolute because the difference in the offsets may be positive or
		// negative, depending on the hemisphere
		var savings = Math.abs(this.offsetJan1 - this.offsetJun1);
		var hours = MathUtils.down(savings/60),
			minutes = savings - hours*60;
		return {
			h: hours,
			m: minutes
		};
	} else if (this.zone && this.zone.s) {
		return this._offsetStringToObj(this.zone.s.v);	// this.zone.start.savings
	}
	return {h:0};
};

/**
 * Return the amount of time in hours:minutes that the clock is advanced during
 * daylight savings time.
 * @return {string} the amount of time that the clock advances for DST in the
 * format "h:m:s"
 */
TimeZone.prototype.getDSTSavingsStr = function () {
	if (this.isLocal) {
		var savings = this.getDSTSavings();
		return savings.h + ":" + savings.m;
	} else if (typeof(this.offset) !== 'undefined' && this.zone && this.zone.s) {
		return this.zone.s.v;	// this.zone.start.savings
	}
	return "0:0";
};

/**
 * return the rd of the start of DST transition for the given year
 * @protected
 * @param {Object} rule set of rules
 * @param {number} year year to check
 * @return {number} the rd of the start of DST for the year
 */
TimeZone.prototype._calcRuleStart = function (rule, year) {
	var type = "=", 
		weekday = 0, 
		day, 
		refDay, 
		cal, 
		hour = 0, 
		minute = 0, 
		second = 0,
		time,
		i;
	
	if (typeof(rule.j) !== 'undefined') {
		refDay = new GregRataDie({
			julianday: rule.j
		});
	} else {
		if (rule.r.charAt(0) == 'l' || rule.r.charAt(0) == 'f') {
			cal = CalendarFactory({type: "gregorian"}); // can be synchronous
			type = rule.r.charAt(0);
			weekday = parseInt(rule.r.substring(1), 10);
			day = (type === 'l') ? cal.getMonLength(rule.m, year) : 1;
			//console.log("_calcRuleStart: Calculating the " + 
			//		(rule.r.charAt(0) == 'f' ? "first " : "last ") + weekday + 
			//		" of month " + rule.m);
		} else {
			i = rule.r.indexOf('<');
			if (i == -1) {
				i = rule.r.indexOf('>');
			}
			
			if (i != -1) {
				type = rule.r.charAt(i);
				weekday = parseInt(rule.r.substring(0, i), 10);
				day = parseInt(rule.r.substring(i+1), 10); 
				//console.log("_calcRuleStart: Calculating the " + weekday + 
				//		type + day + " of month " + rule.m);
			} else {
				day = parseInt(rule.r, 10);
				//console.log("_calcRuleStart: Calculating the " + day + " of month " + rule.m);
			}
		}
	
		if (rule.t) {
			time = rule.t.split(":");
			hour = parseInt(time[0], 10);
			if (time.length > 1) {
				minute = parseInt(time[1], 10);
				if (time.length > 2) {
					second = parseInt(time[2], 10);
				}
			}
		}
		//console.log("calculating rd of " + year + "/" + rule.m + "/" + day);
		refDay = new GregRataDie({
			year: year, 
			month: rule.m, 
			day: day, 
			hour: hour, 
			minute: minute, 
			second: second
		});
	}
	//console.log("refDay is " + JSON.stringify(refDay));
	var d = refDay.getRataDie();
	
	switch (type) {
		case 'l':
		case '<':
			//console.log("returning " + refDay.onOrBefore(rd, weekday));
			d = refDay.onOrBefore(weekday); 
			break;
		case 'f':
		case '>':
			//console.log("returning " + refDay.onOrAfterRd(rd, weekday));
			d = refDay.onOrAfter(weekday); 
			break;
	}
	return d;
};

/**
 * @private
 */
TimeZone.prototype._calcDSTSavings = function () {
	var saveParts = this.getDSTSavings();
	
	/**
	 * @private
	 * @type {number} savings in minutes when DST is in effect 
	 */
	this.dstSavings = (Math.abs(saveParts.h || 0) * 60 + (saveParts.m || 0)) * MathUtils.signum(saveParts.h || 0);
};

/**
 * @private
 */
TimeZone.prototype._getDSTStartRule = function (year) {
	// TODO: update this when historic/future zones are supported
	return this.zone.s;
};

/**
 * @private
 */
TimeZone.prototype._getDSTEndRule = function (year) {
	// TODO: update this when historic/future zones are supported
	return this.zone.e;
};

/**
 * Returns whether or not the given date is in daylight saving time for the current
 * zone. Note that daylight savings time is observed for the summer. Because
 * the seasons are reversed, daylight savings time in the southern hemisphere usually
 * runs from the end of the year through New Years into the first few months of the
 * next year. This method will correctly calculate the start and end of DST for any
 * location.
 * 
 * @param {IDate=} date a date for which the info about daylight time is being sought,
 * or undefined to tell whether we are currently in daylight savings time
 * @param {boolean=} wallTime if true, then the given date is in wall time. If false or
 * undefined, it is in the usual UTC time.
 * @return {boolean} true if the given date is in DST for the current zone, and false
 * otherwise.
 */
TimeZone.prototype.inDaylightTime = function (date, wallTime) {
	var rd, startRd, endRd, year;

	if (this.isLocal) {
		// check if the dst property is defined -- the intrinsic JS Date object doesn't work so
		// well if we are in the overlap time at the end of DST, so we have to work around that
		// problem by adding in the savings ourselves
		var offset = this.offset * 60000;
		if (typeof(date.dst) !== 'undefined' && !date.dst) {
			offset += this.dstSavings * 60000;
		}

		var d = new Date(date ? date.getTimeExtended() - offset: undefined);
		// the DST offset is always the one that is closest to positive infinity, no matter 
		// if you are in the northern or southern hemisphere, east or west
		var dst = Math.max(this.offsetJan1, this.offsetJun1);
		return (-d.getTimezoneOffset() === dst);
	}
	
	if (!date || !date.cal || date.cal.type !== "gregorian") {
		// convert to Gregorian so that we can tell if it is in DST or not
		var time = date && typeof(date.getTimeExtended) === 'function' ? date.getTimeExtended() : undefined;
		rd = new GregRataDie({unixtime: time}).getRataDie();
		year = new Date(time).getUTCFullYear();
	} else {
		rd = date.rd.getRataDie();
		year = date.year;
	}
	// rd should be a Gregorian RD number now, in UTC
	
	// if we aren't using daylight time in this zone for the given year, then we are 
	// not in daylight time
	if (!this.useDaylightTime(year)) {
		return false;
	}
	
	// these calculate the start/end in local wall time
	var startrule = this._getDSTStartRule(year);
	var endrule = this._getDSTEndRule(year);
	startRd = this._calcRuleStart(startrule, year);
	endRd = this._calcRuleStart(endrule, year);
	
	if (wallTime) {
		// rd is in wall time, so we have to make sure to skip the missing time
		// at the start of DST when standard time ends and daylight time begins
		startRd += this.dstSavings/1440;
	} else {
		// rd is in UTC, so we have to convert the start/end to UTC time so 
		// that they can be compared directly to the UTC rd number of the date
		
		// when DST starts, time is standard time already, so we only have
		// to subtract the offset to get to UTC and not worry about the DST savings
		startRd -= this.offset/1440;  
		
		// when DST ends, time is in daylight time already, so we have to
		// subtract the DST savings to get back to standard time, then the
		// offset to get to UTC
		endRd -= (this.offset + this.dstSavings)/1440;
	}
	
	// In the northern hemisphere, the start comes first some time in spring (Feb-Apr), 
	// then the end some time in the fall (Sept-Nov). In the southern
	// hemisphere, it is the other way around because the seasons are reversed. Standard
	// time is still in the winter, but the winter months are May-Aug, and daylight 
	// savings time usually starts Aug-Oct of one year and runs through Mar-May of the 
	// next year.
	if (rd < endRd && endRd - rd <= this.dstSavings/1440 && typeof(date.dst) === 'boolean') {
		// take care of the magic overlap time at the end of DST
		return date.dst;
	}
	if (startRd < endRd) {
		// northern hemisphere
		return (rd >= startRd && rd < endRd) ? true : false;
	} 
	// southern hemisphere
	return (rd >= startRd || rd < endRd) ? true : false;
};

/**
 * Returns true if this time zone switches to daylight savings time at some point
 * in the year, and false otherwise.
 * @param {number} year Whether or not the time zone uses daylight time in the given year. If
 * this parameter is not given, the current year is assumed.
 * @return {boolean} true if the time zone uses daylight savings time
 */
TimeZone.prototype.useDaylightTime = function (year) {
	
	// this zone uses daylight savings time iff there is a rule defining when to start
	// and when to stop the DST
	return (this.isLocal && this.offsetJan1 !== this.offsetJun1) ||
		(typeof(this.zone) !== 'undefined' && 
		typeof(this.zone.s) !== 'undefined' && 
		typeof(this.zone.e) !== 'undefined');
};

/**
 * Returns the ISO 3166 code of the country for which this time zone is defined.
 * @return {string} the ISO 3166 code of the country for this zone
 */
TimeZone.prototype.getCountry = function () {
	return this.zone.c;
};

module.exports = TimeZone;
