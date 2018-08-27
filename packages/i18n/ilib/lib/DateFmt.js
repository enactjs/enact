/*
 * DateFmt.js - Date formatter definition
 * 
 * Copyright © 2012-2015, 2018, JEDLSoft
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
IDate.js
DateFactory.js  
IString.js 
ResBundle.js 
Calendar.js
CalendarFactory.js
LocaleInfo.js
TimeZone.js
GregorianCal.js
JSUtils.js
Utils.js
ISet.js
*/

// !data dateformats sysres

var ilib = require("./ilib.js");
var Utils = require("./Utils.js");
var JSUtils = require("./JSUtils.js");

var Locale = require("./Locale.js");
var LocaleInfo = require("./LocaleInfo.js");

var IDate = require("./IDate.js");
var DateFactory = require("./DateFactory.js");
var Calendar = require("./Calendar.js");
var CalendarFactory = require("./CalendarFactory.js");

var IString = require("./IString.js");
var ResBundle = require("./ResBundle.js");
var TimeZone = require("./TimeZone.js");
var GregorianCal = require("./GregorianCal.js");

var ISet = require("./ISet.js");

/**
 * @class
 * Create a new date formatter instance. The date formatter is immutable once
 * it is created, but can format as many different dates as needed with the same
 * options. Create different date formatter instances for different purposes
 * and then keep them cached for use later if you have more than one date to
 * format.<p>
 * 
 * The options may contain any of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> - locale to use when formatting the date/time. If the locale is
 * not specified, then the default locale of the app or web page will be used.
 * 
 * <li><i>calendar</i> - the type of calendar to use for this format. The value should
 * be a sting containing the name of the calendar. Currently, the supported
 * types are "gregorian", "julian", "arabic", "hebrew", or "chinese". If the
 * calendar is not specified, then the default calendar for the locale is used. When the
 * calendar type is specified, then the format method must be called with an instance of
 * the appropriate date type. (eg. Gregorian calendar means that the format method must 
 * be called with a GregDate instance.)
 *  
 * <li><i>timezone</i> - time zone to use when formatting times. This may be a time zone
 * instance or a time zone specifier from the IANA list of time zone database names 
 * (eg. "America/Los_Angeles"), 
 * the string "local", or a string specifying the offset in RFC 822 format. The IANA
 * list of time zone names can be viewed at 
 * <a href="http://en.wikipedia.org/wiki/List_of_tz_database_time_zones">this page</a>.
 * If the time zone is given as "local", the offset from UTC as given by
 * the Javascript system is used. If the offset is given as an RFC 822 style offset
 * specifier, it will parse that string and use the resulting offset. If the time zone
 * is not specified, the
 * default time zone for the locale is used. If both the date object and this formatter
 * instance contain time zones and those time zones are different from each other, the 
 * formatter will calculate the offset between the time zones and subtract it from the 
 * date before formatting the result for the current time zone. The theory is that a date
 * object that contains a time zone specifies a specific instant in time that is valid
 * around the world, whereas a date object without one is a local time and can only be
 * used for doing things in the local time zone of the user.
 * 
 * <li><i>type</i> - Specify whether this formatter should format times only, dates only, or
 * both times and dates together. Valid values are "time", "date", and "datetime". Note that
 * in some locales, the standard format uses the order "time followed by date" and in others, 
 * the order is exactly opposite, so it is better to create a single "datetime" formatter 
 * than it is to create a time formatter and a date formatter separately and concatenate the 
 * results. A "datetime" formatter will get the order correct for the locale.<p>
 * 
 * The default type if none is specified in with the type option is "date".
 * 
 * <li><i>length</i> - Specify the length of the format to use. The length is the approximate size of the 
 * formatted string.
 * 
 * <ul>
 * <li><i>short</i> - use a short representation of the time. This is the most compact format possible for the locale.
 * <li><i>medium</i> - use a medium length representation of the time. This is a slightly longer format.
 * <li><i>long</i> - use a long representation of the time. This is a fully specified format, but some of the textual 
 * components may still be abbreviated
 * <li><i>full</i> - use a full representation of the time. This is a fully specified format where all the textual 
 * components are spelled out completely
 * </ul>
 * 
 * eg. The "short" format for an en_US date may be "MM/dd/yy", whereas the long format might be "d MMM, yyyy". In the long
 * format, the month name is textual instead of numeric and is longer, the year is 4 digits instead of 2, and the format 
 * contains slightly more spaces and formatting characters.<p>
 * 
 * Note that the length parameter does not specify which components are to be formatted. Use the "date" and the "time"
 * properties to specify the components. Also, very few of the components of a time format differ according to the length,
 * so this property has little to no affect on time formatting.
 * 
 * <li><i>date</i> - This property tells
 * which components of a date format to use. For example,
 * sometimes you may wish to format a date that only contains the month and date
 * without the year, such as when displaying a person's yearly birthday. The value
 * of this property allows you to specify only those components you want to see in the
 * final output, ordered correctly for the locale. <p>
 * 
 * Valid values are:
 * 
 * <ul>
 * <li><i>dmwy</i> - format all components, weekday, date, month, and year
 * <li><i>dmy</i> - format only date, month, and year
 * <li><i>dmw</i> - format only weekday, date, and month
 * <li><i>dm</i> - format only date and month
 * <li><i>my</i> - format only month and year
 * <li><i>dw</i> - format only the weekday and date
 * <li><i>d</i> - format only the date
 * <li><i>m</i> - format only the month, in numbers for shorter lengths, and letters for 
 * longer lengths
 * <li><i>n</i> - format only the month, in letters only for all lengths
 * <li><i>y</i> - format only the year
 * </ul>
 * Default components, if this property is not specified, is "dmy". This property may be specified
 * but has no affect if the current formatter is for times only.<p>
 * 
 * As of ilib 12.0, you can now pass ICU style skeletons in this option similar to the ones you 
 * get from <a href="http://icu-project.org/apiref/icu4c432/classDateTimePatternGenerator.html#aa30c251609c1eea5ad60c95fc497251e">DateTimePatternGenerator.getSkeleton()</a>. 
 * It will not extract the length from the skeleton so you still need to pass the length property, 
 * but it will extract the date components.
 * 
 * <li><i>time</i> - This property gives which components of a time format to use. The time will be formatted 
 * correctly for the locale with only the time components requested. For example, a clock might only display 
 * the hour and minute and not need the seconds or the am/pm component. In this case, the time property should be set 
 * to "hm". <p>
 * 
 * Valid values for this property are:
 * 
 * <ul>
 * <li><i>ahmsz</i> - format the hours, minutes, seconds, am/pm (if using a 12 hour clock), and the time zone
 * <li><i>ahms</i> - format the hours, minutes, seconds, and am/pm (if using a 12 hour clock)
 * <li><i>hmsz</i> - format the hours, minutes, seconds, and the time zone
 * <li><i>hms</i> - format the hours, minutes, and seconds
 * <li><i>ahmz</i> - format the hours, minutes, am/pm (if using a 12 hour clock), and the time zone
 * <li><i>ahm</i> - format the hours, minutes, and am/pm (if using a 12 hour clock)
 * <li><i>hmz</i> - format the hours, minutes, and the time zone
 * <li><i>ah</i> - format only the hours and am/pm if using a 12 hour clock
 * <li><i>hm</i> - format only the hours and minutes
 * <li><i>ms</i> - format only the minutes and seconds
 * <li><i>h</i> - format only the hours
 * <li><i>m</i> - format only the minutes
 * <li><i>s</i> - format only the seconds
 * </ul>
 * 
 * If you want to format a length of time instead of a particular instant
 * in time, use the duration formatter object (DurationFmt) instead because this
 * formatter is geared towards instants. A date formatter will make sure that each component of the 
 * time is within the normal range
 * for that component. That is, the minutes will always be between 0 and 59, no matter
 * what is specified in the date to format. A duration format will allow the number
 * of minutes to exceed 59 if, for example, you were displaying the length of
 * a movie of 198 minutes.<p>
 * 
 * Default value if this property is not specified is "hma".<p>
 * 
 * As of ilib 12.0, you can now pass ICU style skeletons in this option similar to the ones you 
 * get from <a href="http://icu-project.org/apiref/icu4c432/classDateTimePatternGenerator.html#aa30c251609c1eea5ad60c95fc497251e">DateTimePatternGenerator.getSkeleton()</a>. 
 * It will not extract the length from the skeleton so you still need to pass the length property, 
 * but it will extract the time components.
 * 
 * <li><i>clock</i> - specify that the time formatter should use a 12 or 24 hour clock. 
 * Valid values are "12" and "24".<p>
 * 
 * In some locales, both clocks are used. For example, in en_US, the general populace uses
 * a 12 hour clock with am/pm, but in the US military or in nautical or aeronautical or 
 * scientific writing, it is more common to use a 24 hour clock. This property allows you to
 * construct a formatter that overrides the default for the locale.<p>
 * 
 * If this property is not specified, the default is to use the most widely used convention
 * for the locale.
 *  
 * <li><i>template</i> - use the given template string as a fixed format when formatting 
 * the date/time. Valid codes to use in a template string are as follows:
 * 
 * <ul>
 * <li><i>a</i> - am/pm marker
 * <li><i>d</i> - 1 or 2 digit date of month, not padded
 * <li><i>dd</i> - 1 or 2 digit date of month, 0 padded to 2 digits
 * <li><i>O</i> - ordinal representation of the date of month (eg. "1st", "2nd", etc.)
 * <li><i>D</i> - 1 to 3 digit day of year
 * <li><i>DD</i> - 1 to 3 digit day of year, 0 padded to 2 digits
 * <li><i>DDD</i> - 1 to 3 digit day of year, 0 padded to 3 digits
 * <li><i>M</i> - 1 or 2 digit month number, not padded
 * <li><i>MM</i> - 1 or 2 digit month number, 0 padded to 2 digits
 * <li><i>N</i> - 1 character month name abbreviation
 * <li><i>NN</i> - 2 character month name abbreviation
 * <li><i>MMM</i> - 3 character month month name abbreviation
 * <li><i>MMMM</i> - fully spelled out month name
 * <li><i>yy</i> - 2 digit year
 * <li><i>yyyy</i> - 4 digit year
 * <li><i>E</i> - day-of-week name, abbreviated to a single character
 * <li><i>EE</i> - day-of-week name, abbreviated to a max of 2 characters
 * <li><i>EEE</i> - day-of-week name, abbreviated to a max of 3 characters
 * <li><i>EEEE</i> - day-of-week name fully spelled out 
 * <li><i>G</i> - era designator
 * <li><i>w</i> - week number in year
 * <li><i>ww</i> - week number in year, 0 padded to 2 digits
 * <li><i>W</i> - week in month
 * <li><i>h</i> - hour (12 followed by 1 to 11)
 * <li><i>hh</i> - hour (12, followed by 1 to 11), 0 padded to 2 digits
 * <li><i>k</i> - hour (1 to 24)
 * <li><i>kk</i> - hour (1 to 24), 0 padded to 2 digits
 * <li><i>H</i> - hour (0 to 23)
 * <li><i>HH</i> - hour (0 to 23), 0 padded to 2 digits
 * <li><i>K</i> - hour (0 to 11)
 * <li><i>KK</i> - hour (0 to 11), 0 padded to 2 digits
 * <li><i>m</i> - minute in hour
 * <li><i>mm</i> - minute in hour, 0 padded to 2 digits
 * <li><i>s</i> - second in minute
 * <li><i>ss</i> - second in minute, 0 padded to 2 digits
 * <li><i>S</i> - millisecond (1 to 3 digits)
 * <li><i>SSS</i> - millisecond, 0 padded to 3 digits
 * <li><i>z</i> - general time zone
 * <li><i>Z</i> - RFC 822 time zone
 * </ul>
 * 
 * <li><i>useNative</i> - the flag used to determine whether to use the native script settings 
 * for formatting the numbers.
 *
 * <li><i>meridiems</i> - string that specifies what style of meridiems to use with this 
 * format. The choices are "default", "gregorian", "ethiopic", and "chinese". The "default" 
 * style is often the simple Gregorian AM/PM, but the actual style is chosen by the locale. 
 * (For almost all locales, the Gregorian AM/PM style is most frequently used.)
 * The "ethiopic" style uses 5 different meridiems for "morning", "noon", "afternoon", 
 * "evening", and "night". The "chinese" style uses 7 different meridiems corresponding 
 * to the various parts of the day. N.B. Even for the Chinese locales, the default is "gregorian"
 * when formatting dates in the Gregorian calendar.
 *
 * <li><i>onLoad</i> - a callback function to call when the date format object is fully 
 * loaded. When the onLoad option is given, the DateFmt object will attempt to
 * load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the 
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two.
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
 * Any substring containing letters within single or double quotes will be used 
 * as-is in the final output and will not be interpretted for codes as above.<p>
 * 
 * Example: a date format in Spanish might be given as: "'El' d. 'de' MMMM", where
 * the 'El' and the 'de' are left as-is in the output because they are quoted. Typical 
 * output for this example template might be, "El 5. de Mayo".
 * 
 * The following options will be used when formatting a date/time with an explicit
 * template:
 * 
 * <ul>
 * <li>locale - the locale is only used for 
 * translations of things like month names or day-of-week names.
 * <li>calendar - used to translate a date instance into date/time component values 
 * that can be formatted into the template
 * <li>timezone - used to figure out the offset to add or subtract from the time to
 * get the final time component values
 * <li>clock - used to figure out whether to format times with a 12 or 24 hour clock.
 * If this option is specified, it will override the hours portion of a time format.
 * That is, "hh" is switched with "HH" and "kk" is switched with "KK" as appropriate. 
 * If this option is not specified, the 12/24 code in the template will dictate whether 
 * to use the 12 or 24 clock, and the 12/24 default in the locale will be ignored.
 * </ul>
 * 
 * All other options will be ignored and their corresponding getter methods will
 * return the empty string.<p>
 * 
 * 
 * @constructor
 * @param {Object} options options governing the way this date formatter instance works
 */
var DateFmt = function(options) {
	var arr, i, bad, 
		sync = true, 
		loadParams = undefined;
	
	this.locale = new Locale();
	this.type = "date";
	this.length = "s";
	this.dateComponents = "dmy";
	this.timeComponents = "ahm";
	this.meridiems = "default";
	
	options = options || {sync: true};
	if (options.locale) {
	    this.locale = (typeof(options.locale) === 'string') ? new Locale(options.locale) : options.locale;
	}

	if (options.type) {
	    if (options.type === 'date' || options.type === 'time' || options.type === 'datetime') {
	        this.type = options.type;
	    }
	}

	if (options.calendar) {
	    this.calName = options.calendar;
	}

	if (options.length) {
	    if (options.length === 'short' ||
	        options.length === 'medium' ||
	        options.length === 'long' ||
	        options.length === 'full') {
	        // only use the first char to save space in the json files
	        this.length = options.length.charAt(0);
	    }
	}

	if (options.date) {
	    arr = options.date.split("");
	    var dateComps = new ISet();
	    bad = false;
	    for (i = 0; i < arr.length; i++) {
	        var c = arr[i].toLowerCase();
	        if (c === "e") c = "w"; // map ICU -> ilib
	        if (c !== 'd' && c !== 'm' && c !== 'y' && c !== 'w' && c !== 'n') {
	            // ignore time components and the era
	            if (c !== 'h' && c !== 'm'  && c !== 's' && c !== 'a' && c !== 'z' && c !== 'g') {
	                bad = true;
	                break;
	            }
	        } else {
	            dateComps.add(c);
	        }
	    }
	    if (!bad) {
	        var comps = dateComps.asArray().sort(function (left, right) {
	            return (left < right) ? -1 : ((right < left) ? 1 : 0);
	        });
	        this.dateComponents = comps.join("");
	    }
	}

	if (options.time) {
	    arr = options.time.split("");
	    var timeComps = new ISet();
	    this.badTime = false;
	    for (i = 0; i < arr.length; i++) {
	        var c = arr[i].toLowerCase();
	        if (c !== 'h' && c !== 'm' && c !== 's' && c !== 'a' && c !== 'z') {
	            // ignore the date components
	            if (c !== 'd' && c !== 'm' && c !== 'y' && c !== 'w' && c !== 'e' && c !== 'n' && c !== 'g') {
	                this.badTime = true;
	                break;
	            }
	        } else {
	            timeComps.add(c);
	        }
	    }
	    if (!this.badTime) {
	        var comps = timeComps.asArray().sort(function (left, right) {
	            return (left < right) ? -1 : ((right < left) ? 1 : 0);
	        });
	        this.timeComponents = comps.join("");
	    }
	}

	if (options.clock && (options.clock === '12' || options.clock === '24')) {
	    this.clock = options.clock;
	}

	if (options.template) {
	    // many options are not useful when specifying the template directly, so zero
	    // them out.
	    this.type = "";
	    this.length = "";
	    this.dateComponents = "";
	    this.timeComponents = "";

	    this.template = options.template;
	}

	if (options.timezone) {
	    if (options.timezone instanceof TimeZone) {
	        this.tz = options.timezone;
	        this.timezone = this.tz.getId();
	    } else {
	        this.timezone = options.timezone;
	    }
	}

	if (typeof(options.useNative) === 'boolean') {
	    this.useNative = options.useNative;
	}

	if (typeof(options.meridiems) !== 'undefined' && 
	    (options.meridiems === "chinese" || 
	        options.meridiems === "gregorian" || 
	        options.meridiems === "ethiopic")) {
	    this.meridiems = options.meridiems;
	}

	if (typeof(options.sync) !== 'undefined') {
	    sync = (options.sync === true);
	}

	loadParams = options.loadParams;

	new LocaleInfo(this.locale, {
		sync: sync,
		loadParams: loadParams, 
		onLoad: ilib.bind(this, function (li) {
			this.locinfo = li;
			
			// get the default calendar name from the locale, and if the locale doesn't define
			// one, use the hard-coded gregorian as the last resort
			this.calName = this.calName || this.locinfo.getCalendar() || "gregorian";
			if (ilib.isDynCode()) {
				// If we are running in the dynamic code loading assembly of ilib, the following
				// will attempt to dynamically load the calendar date class for this calendar. If 
				// it doesn't work, this just goes on and it will use Gregorian instead.
				DateFactory._dynLoadDate(this.calName);
			}
			
			CalendarFactory({
				type: this.calName,
				sync: sync,
				loadParams: loadParams,
				onLoad: ilib.bind(this, function(cal) {
				    this.cal = cal;
				    
				    if (!this.cal) {
				        // can be synchronous
				        this.cal = new GregorianCal();
				    }
				    if (this.meridiems === "default") {
				        this.meridiems = li.getMeridiemsStyle();
				    }

				    // load the strings used to translate the components
				    new ResBundle({
				        locale: this.locale,
				        name: "sysres",
				        sync: sync,
				        loadParams: loadParams, 
				        onLoad: ilib.bind(this, function (rb) {
				            this.sysres = rb;
				            
				            if (!this.tz) {
				                var timezone = options.timezone;
				                if (!timezone && !options.locale) { 
				                    timezone = "local";
				                }
				                
				                new TimeZone({
				                    locale: this.locale,
				                    id: timezone,
				                    sync: sync,
				                    loadParams: loadParams,
				                    onLoad: ilib.bind(this, function(tz) {
				                        this.tz = tz;
				                        this._init(options);
				                    })
				                });
				            } else {
				                this._init(options);
				            }
				        })
				    });
				})
			});
		})
	});
};

// used in getLength
DateFmt.lenmap = {
	"s": "short",
	"m": "medium",
	"l": "long",
	"f": "full"
};

DateFmt.defaultFmt = {
	"gregorian": {
		"order": "{date} {time}",
		"date": {
			"dmwy": "EEE d/MM/yyyy",
			"dmy": "d/MM/yyyy",
			"dmw": "EEE d/MM",
			"dm": "d/MM",
			"my": "MM/yyyy",
			"dw": "EEE d",
			"d": "dd",
			"m": "MM",
			"y": "yyyy",
			"n": "NN",
			"w": "EEE"
		},
		"time": {
			"12": "h:mm:ssa",
			"24": "H:mm:ss"
		},
		"range": {
			"c00": "{st} - {et}, {sd}/{sm}/{sy}",
			"c01": "{sd}/{sm} {st} - {ed}/{em} {et}, {sy}",
			"c02": "{sd}/{sm} {st} - {ed}/{em} {et}, {sy}",
			"c03": "{sd}/{sm}/{sy} {st} - {ed}/{em}/{ey} {et}",
			"c10": "{sd}-{ed}/{sm}/{sy}",
			"c11": "{sd}/{sm} - {ed}/{em} {sy}",
			"c12": "{sd}/{sm}/{sy} - {ed}/{em}/{ey}",
			"c20": "{sm}/{sy} - {em}/{ey}",
			"c30": "{sy} - {ey}"
		}
	},
	"islamic": "gregorian",
	"hebrew": "gregorian",
	"julian": "gregorian",
	"buddhist": "gregorian",
	"persian": "gregorian",
	"persian-algo": "gregorian",
	"han": "gregorian"
};

/**
* @static
* @private
*/
DateFmt.monthNameLenMap = {
	"short" : "N",
	"medium": "NN",
	"long":   "MMM",
	"full":   "MMMM"
};

/**
* @static
* @private
*/
DateFmt.weekDayLenMap = {
	"short" : "E",
	"medium": "EE",
	"long":   "EEE",
	"full":   "EEEE"
};

/**
 * Return the range of possible meridiems (times of day like "AM" or 
 * "PM") in this date formatter.<p>
 *
 * The options may contain any of the following properties:
 *
 * <ul>
 * <li><i>locale</i> - locale to use when formatting the date/time. If the locale is
 * not specified, then the default locale of the app or web page will be used.
 * 
 * <li><i>meridiems</i> - string that specifies what style of meridiems to use with this 
 * format. The choices are "default", "gregorian", "ethiopic", and "chinese". The "default" 
 * style is often the simple Gregorian AM/PM, but the actual style is chosen by the locale. 
 * (For almost all locales, the Gregorian AM/PM style is most frequently used.)
 * The "ethiopic" style uses 5 different meridiems for "morning", "noon", "afternoon", 
 * "evening", and "night". The "chinese" style uses 7 different meridiems corresponding 
 * to the various parts of the day. N.B. Even for the Chinese locales, the default is "gregorian"
 * when formatting dates in the Gregorian calendar.
 * </ul>
 *
 * @static
 * @public
 * @param {Object} options options governing the way this date formatter instance works for getting meridiems range
 * @return {Array.<{name:string,start:string,end:string}>}
 */
DateFmt.getMeridiemsRange = function (options) {
	options = options || {sync: true};
	var args = JSUtils.merge({}, options);
	args.onLoad = function(fmt) {
	    if (typeof(options.onLoad) === "function") {
	        options.onLoad(fmt.getMeridiemsRange());
	    }
	};
	var fmt = new DateFmt(args);

	return fmt.getMeridiemsRange();
};

DateFmt.prototype = {
    /**
     * @private
     * Finish initializing the formatter object
     */
    _init: function(options) {
        if (typeof (options.sync) === 'undefined') {
            options.sync = true;
        }
        if (!this.template) {
            Utils.loadData({
                object: "DateFmt", 
                locale: this.locale, 
                name: "dateformats.json", 
                sync: options.sync, 
                loadParams: options.loadParams, 
                callback: ilib.bind(this, function (formats) {
                    var spec = this.locale.getSpec().replace(/-/g, '_');
                    if (!formats) {
                        formats = ilib.data.dateformats || DateFmt.defaultFmt;
                        ilib.data.cache.DateFmt[spec] = formats;
                    }
                    
                    if (typeof(this.clock) === 'undefined') {
                        // default to the locale instead
                        this.clock = this.locinfo.getClock();
                    }
                    
                    var ret = this;

                    if (typeof(options.sync) === "boolean" && !options.sync) {
                        // in async mode, capture the exception and call the callback with "undefined"
                        try {
                            this._initTemplate(formats);
                            this._massageTemplate();
                        } catch (e) {
                            ret = undefined;
                        }
                    } else {
                        // in sync mode, allow the exception to percolate upwards
                        this._initTemplate(formats);
                        this._massageTemplate();
                    }

                    if (typeof(options.onLoad) === 'function') {
                        options.onLoad(ret);
                    }
               })
            });
        } else {
            this._massageTemplate();
        
            if (typeof(options.onLoad) === 'function') {
                options.onLoad(this);
            }
        }
    },
    
	/**
	 * @protected
	 * @param {string|{
	 * 		order:(string|{
	 * 			s:string,
	 * 			m:string,
	 * 			l:string,
	 * 			f:string
	 * 		}),
	 * 		date:Object.<string, (string|{
	 * 			s:string,
	 * 			m:string,
	 * 			l:string,
	 * 			f:string
	 * 		})>,
	 * 		time:Object.<string,Object.<string,(string|{
	 * 			s:string,
	 * 			m:string,
	 * 			l:string,
	 * 			f:string
	 * 		})>>,
	 * 		range:Object.<string, (string|{
	 * 			s:string,
	 * 			m:string,
	 * 			l:string,
	 * 			f:string
	 * 		})>
	 * 	}} formats
	 */
	_initTemplate: function (formats) {
		if (formats[this.calName]) {
			var name = formats[this.calName];
			// may be an alias to another calendar type
			this.formats = (typeof(name) === "string") ? formats[name] : name;
			
			this.template = "";
			
			switch (this.type) {
				case "datetime":
					this.template = (this.formats && this._getLengthFormat(this.formats.order, this.length)) || "{date} {time}";
					this.template = this.template.replace("{date}", this._getFormat(this.formats.date, this.dateComponents, this.length) || "");
					this.template = this.template.replace("{time}", this._getFormat(this.formats.time[this.clock], this.timeComponents, this.length) || "");
					break;
				case "date":
					this.template = this._getFormat(this.formats.date, this.dateComponents, this.length);
					break;
				case "time":
					this.template = this._getFormat(this.formats.time[this.clock], this.timeComponents, this.length);
					break;
			}
			
			// calculate what order the components appear in for this locale
			this.componentOrder = this._getFormat(this.formats.date, "dmy", "l").
			    replace(/[^dMy]/g, "").
			    replace(/y+/, "y").
			    replace(/d+/, "d").
			    replace(/M+/, "m");
		} else {
			throw "No formats available for calendar " + this.calName + " in locale " + this.locale.toString();
		}
	},
	
	/**
	 * @protected
	 */
	_massageTemplate: function () {
		var i;
		
		if (this.clock && this.template) {
			// explicitly set the hours to the requested type
			var temp = "";
			switch (this.clock) {
				case "24":
					for (i = 0; i < this.template.length; i++) {
						if (this.template.charAt(i) == "'") {
							temp += this.template.charAt(i++);
							while (i < this.template.length && this.template.charAt(i) !== "'") {
								temp += this.template.charAt(i++);
							}
							if (i < this.template.length) {
								temp += this.template.charAt(i);
							}
						} else if (this.template.charAt(i) == 'K') {
							temp += 'k';
						} else if (this.template.charAt(i) == 'h') {
							temp += 'H';
						} else {
							temp += this.template.charAt(i);
						}
					}
					this.template = temp;
					break;
				case "12":
					for (i = 0; i < this.template.length; i++) {
						if (this.template.charAt(i) == "'") {
							temp += this.template.charAt(i++);
							while (i < this.template.length && this.template.charAt(i) !== "'") {
								temp += this.template.charAt(i++);
							}
							if (i < this.template.length) {
								temp += this.template.charAt(i);
							}
						} else if (this.template.charAt(i) == 'k') {
							temp += 'K';
						} else if (this.template.charAt(i) == 'H') {
							temp += 'h';
						} else {
							temp += this.template.charAt(i);
						}
					}
					this.template = temp;
					break;
			}
		}
		
		// tokenize it now for easy formatting
		this.templateArr = this._tokenize(this.template);

		var digits;
		// set up the mapping to native or alternate digits if necessary
		if (typeof(this.useNative) === "boolean") {
			if (this.useNative) {
				digits = this.locinfo.getNativeDigits();
				if (digits) {
					this.digits = digits;
				}
			}
		} else if (this.locinfo.getDigitsStyle() === "native") {
			digits = this.locinfo.getNativeDigits();
			if (digits) {
				this.useNative = true;
				this.digits = digits;
			}
		}
	},
    
	/**
	 * Convert the template into an array of date components separated by formatting chars.
	 * @protected
	 * @param {string} template Format template to tokenize into components
	 * @return {Array.<string>} a tokenized array of date format components
	 */
	_tokenize: function (template) {
		var i = 0, start, ch, letter, arr = [];
		
		// console.log("_tokenize: tokenizing template " + template);
		if (template) {
			while (i < template.length) {
				ch = template.charAt(i);
				start = i;
				if (ch === "'") {
					// console.log("found quoted string");
					i++;
					// escaped string - push as-is, then dequote later
					while (i < template.length && template.charAt(i) !== "'") {
						i++;
					}
					if (i < template.length) {
						i++;	// grab the other quote too
					}
				} else if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
					letter = template.charAt(i);
					// console.log("found letters " + letter);
					while (i < template.length && ch === letter) {
						ch = template.charAt(++i);
					}
				} else {
					// console.log("found other");
					while (i < template.length && ch !== "'" && (ch < 'a' || ch > 'z') && (ch < 'A' || ch > 'Z')) {
						ch = template.charAt(++i);
					}
				}
				arr.push(template.substring(start,i));
				// console.log("start is " + start + " i is " + i + " and substr is " + template.substring(start,i));
			}
		}
		return arr;
	},
    
	/**
	 * @protected
	 * @param {Object.<string, (string|{s:string,m:string,l:string,f:string})>} obj Object to search
	 * @param {string} components Format components to search
	 * @param {string} length Length of the requested format
	 * @return {string|undefined} the requested format
	 */
	_getFormatInternal: function getFormatInternal(obj, components, length) {
		if (typeof(components) !== 'undefined' && obj && obj[components]) {
			return this._getLengthFormat(obj[components], length);
		}
		return undefined;
	},

	// stand-alone of m (month) is l
	// stand-alone of d (day) is a
	// stand-alone of w (weekday) is e
	// stand-alone of y (year) is r
	_standAlones: {
		"m": "l",
		"d": "a",
		"w": "e",
		"y": "r"
	},
	
	/**
	 * @protected
	 * @param {Object.<string, (string|{s:string,m:string,l:string,f:string})>} obj Object to search
	 * @param {string} components Format components to search
	 * @param {string} length Length of the requested format
	 * @return {string|undefined} the requested format
	 */
	_getFormat: function getFormat(obj, components, length) {
		// handle some special cases for stand-alone formats
		if (components && this._standAlones[components]) {
    		var tmp = this._getFormatInternal(obj, this._standAlones[components], length);
    		if (tmp) {
    			return tmp;
    		}
		}
		
		// if no stand-alone format is available, fall back to the regular format
		return this._getFormatInternal(obj, components, length);
	},

	/**
	 * @protected
	 * @param {(string|{s:string,m:string,l:string,f:string})} obj Object to search
	 * @param {string} length Length of the requested format
	 * @return {(string|undefined)} the requested format
	 */
	_getLengthFormat: function getLengthFormat(obj, length) {
		if (typeof(obj) === 'string') {
			return obj;
		} else if (obj[length]) {
			return obj[length];
		}
		return undefined;
	},

	/**
	 * Return the locale used with this formatter instance.
	 * @return {Locale} the Locale instance for this formatter
	 */
	getLocale: function() {
		return this.locale;
	},
	
	/**
	 * Return the template string that is used to format date/times for this
	 * formatter instance. This will work, even when the template property is not explicitly 
	 * given in the options to the constructor. Without the template option, the constructor 
	 * will build the appropriate template according to the options and use that template
	 * in the format method. 
	 * 
	 * @return {string} the format template for this formatter
	 */
	getTemplate: function() {
		return this.template;
	},
	
	/**
	 * Return the order of the year, month, and date components for the current locale.<p>
	 * 
	 * When implementing a date input widget in a UI, it would be useful to know what
	 * order to put the year, month, and date input fields so that it conforms to the
	 * user expectations for the locale. This method gives that order by returning a
	 * string that has a single "y", "m", and "d" character in it in the correct
	 * order.<p>
	 * 
	 * For example, the return value "ymd" means that this locale formats the year first,
	 * the month second, and the date third, and "mdy" means that the month is first,
	 * the date is second, and the year is third. Four of the 6 possible permutations
	 * of the three letters have at least one locale that uses that ordering, though some
	 * combinations are far more likely than others. The ones that are not used by any 
	 * locales are "dym" and "myd", though new locales are still being added to 
	 * CLDR frequently, and possible orderings cannot be predicted. Your code should 
	 * support all 6 possibilities, just in case.
	 * 
	 * @return {String} a string giving the date component order
	 */
	getDateComponentOrder: function() {
	    return this.componentOrder;
	},
	
	/**
	 * Return the type of this formatter. The type is a string that has one of the following
	 * values: "time", "date", "datetime".
	 * @return {string} the type of the formatter
	 */
	getType: function() {
		return this.type;
	},
	
	/**
	 * Return the name of the calendar used to format date/times for this
	 * formatter instance.
	 * @return {string} the name of the calendar used by this formatter
	 */
	getCalendar: function () {
		return this.cal.getType();
	},
	
	/**
	 * Return the length used to format date/times in this formatter. This is either the
	 * value of the length option to the constructor, or the default value.
	 * 
	 * @return {string} the length of formats this formatter returns
	 */
	getLength: function () {
		return DateFmt.lenmap[this.length] || "";
	},
	
	/**
	 * Return the date components that this formatter formats. This is either the 
	 * value of the date option to the constructor, or the default value. If this
	 * formatter is a time-only formatter, this method will return the empty 
	 * string. The date component letters may be specified in any order in the 
	 * constructor, but this method will reorder the given components to a standard 
	 * order.
	 * 
	 * @return {string} the date components that this formatter formats
	 */
	getDateComponents: function () {
		return this.dateComponents || "";
	},

	/**
	 * Return the time components that this formatter formats. This is either the 
	 * value of the time option to the constructor, or the default value. If this
	 * formatter is a date-only formatter, this method will return the empty 
	 * string. The time component letters may be specified in any order in the 
	 * constructor, but this method will reorder the given components to a standard 
	 * order.
	 * 
	 * @return {string} the time components that this formatter formats
	 */
	getTimeComponents: function () {
		return this.timeComponents || "";
	},

	/**
	 * Return the time zone used to format date/times for this formatter
	 * instance.
	 * @return {TimeZone} a time zone object that this formatter is formatting for
	 */
	getTimeZone: function () {
		return this.tz;
	},
	
	/**
	 * Return the clock option set in the constructor. If the clock option was
	 * not given, the default from the locale is returned instead.
	 * @return {string} "12" or "24" depending on whether this formatter uses
	 * the 12-hour or 24-hour clock
	 */
	getClock: function () {
		return this.clock || this.locinfo.getClock();
	},
	
	/**
	 * Return the meridiems range in current locale. 
	 * @return {Array.<{name:string,start:string,end:string}>} the range of available meridiems
	 */
	getMeridiemsRange: function () {
		var result;
		var _getSysString = function (key) {
			return (this.sysres.getString(undefined, key + "-" + this.calName) || this.sysres.getString(undefined, key)).toString();
		};

		switch (this.meridiems) {
		case "chinese":
			result = [
				{
					name: _getSysString.call(this, "azh0"),
					start: "00:00",
					end: "05:59"
				},
				{
					name: _getSysString.call(this, "azh1"),
					start: "06:00",
					end: "08:59"
				},
				{
					name: _getSysString.call(this, "azh2"),
					start: "09:00",
					end: "11:59"
				},
				{
					name: _getSysString.call(this, "azh3"),
					start: "12:00",
					end: "12:59"
				},
				{
					name: _getSysString.call(this, "azh4"),
					start: "13:00",
					end: "17:59"
				},
				{
					name: _getSysString.call(this, "azh5"),
					start: "18:00",
					end: "20:59"
				},
				{
					name: _getSysString.call(this, "azh6"),
					start: "21:00",
					end: "23:59"
				}
			];
			break;
		case "ethiopic":
			result = [
				{
					name: _getSysString.call(this, "a0-ethiopic"),
					start: "00:00",
					end: "05:59"
				},
				{
					name: _getSysString.call(this, "a1-ethiopic"),
					start: "06:00",
					end: "06:00"
				},
				{
					name: _getSysString.call(this, "a2-ethiopic"),
					start: "06:01",
					end: "11:59"
				},
				{
					name: _getSysString.call(this, "a3-ethiopic"),
					start: "12:00",
					end: "17:59"
				},
				{
					name: _getSysString.call(this, "a4-ethiopic"),
					start: "18:00",
					end: "23:59"
				}
			];
			break;
		default:
			result = [
				{
					name: _getSysString.call(this, "a0"),
					start: "00:00",
					end: "11:59"
				},
				{
					name: _getSysString.call(this, "a1"),
					start: "12:00",
					end: "23:59"
				}
			];
			break;
		}

		return result;
	},
	
	/**
	 * @private
	 */
	_getTemplate: function (prefix, calendar) {
		if (calendar !== "gregorian") {
			return prefix + "-" + calendar;
		}
		return prefix;
	},

	/**
	 * Returns an array of the months of the year, formatted to the optional length specified.
	 * i.e. ...getMonthsOfYear() OR ...getMonthsOfYear({length: "short"})
	 * <p>
	 * The options parameter may contain any of the following properties:
	 * 
	 * <ul>
	 * <li><i>length</i> - length of the names of the months being sought. This may be one of
	 * "short", "medium", "long", or "full"
	 * <li><i>date</i> - retrieve the names of the months in the date of the given date
	 * <li><i>year</i> - retrieve the names of the months in the given year. In some calendars,
	 * the months have different names depending if that year is a leap year or not.
	 * </ul>
	 * 
	 * @param  {Object=} options an object-literal that contains any of the above properties
	 * @return {Array} an array of the names of all of the months of the year in the current calendar
	 */
	getMonthsOfYear: function(options) {
		var length = (options && options.length) || this.getLength(),
			template = DateFmt.monthNameLenMap[length],
			months = [undefined],
			date,
			monthCount;
		
		if (options) {
			if (options.date) {
				date = DateFactory._dateToIlib(options.date); 	
			}
			
			if (options.year) {
				date = DateFactory({year: options.year, month: 1, day: 1, type: this.cal.getType()});
			}
		}
		
		if (!date) {
			date = DateFactory({
				calendar: this.cal.getType()
			});
		}

		monthCount = this.cal.getNumMonths(date.getYears());
		for (var i = 1; i <= monthCount; i++) {
			months[i] = this.sysres.getString(this._getTemplate(template + i, this.cal.getType())).toString();
		}
		return months;
	},

	/**
	 * Returns an array of the days of the week, formatted to the optional length specified.
	 * i.e. ...getDaysOfWeek() OR ...getDaysOfWeek({length: "short"})
	 * <p>
	 * The options parameter may contain any of the following properties:
	 * 
	 * <ul>
	 * <li><i>length</i> - length of the names of the months being sought. This may be one of
	 * "short", "medium", "long", or "full"
	 * </ul>
	 * @param  {Object=} options an object-literal that contains one key 
	 *                   "length" with the standard length strings
	 * @return {Array} an array of all of the names of the days of the week
	 */
	getDaysOfWeek: function(options) {
		var length = (options && options.length) || this.getLength(),
			template = DateFmt.weekDayLenMap[length],
			days = [];
		for (var i = 0; i < 7; i++) {
			days[i] = this.sysres.getString(this._getTemplate(template + i, this.cal.getType())).toString();
		}
		return days;
	},

	
	/**
	 * Convert this formatter to a string representation by returning the
	 * format template. This method delegates to getTemplate.
	 * 
	 * @return {string} the format template
	 */
	toString: function() {
		return this.getTemplate();
	},
		
	/**
	 * @private
	 * Format a date according to a sequence of components. 
	 * @param {IDate} date a date/time object to format
	 * @param {Array.<string>} templateArr an array of components to format
	 * @return {string} the formatted date
	 */
	_formatTemplate: function (date, templateArr) {
		var i, key, temp, tz, str = "";
		for (i = 0; i < templateArr.length; i++) {
			switch (templateArr[i]) {
				case 'd':
					str += (date.day || 1);
					break;
				case 'dd':
					str += JSUtils.pad(date.day || "1", 2);
					break;
				case 'yy':
					temp = "" + ((date.year || 0) % 100);
					str += JSUtils.pad(temp, 2);
					break;
				case 'yyyy':
					str += JSUtils.pad(date.year || "0", 4);
					break;
				case 'M':
					str += (date.month || 1);
					break;
				case 'MM':
					str += JSUtils.pad(date.month || "1", 2);
					break;
				case 'h':
					temp = (date.hour || 0) % 12;
					if (temp == 0) {
						temp = "12";
					}
					str += temp; 
					break;
				case 'hh':
					temp = (date.hour || 0) % 12;
					if (temp == 0) {
						temp = "12";
					}
					str += JSUtils.pad(temp, 2);
					break;
				/*
				case 'j':
					temp = (date.hour || 0) % 12 + 1;
					str += temp; 
					break;
				case 'jj':
					temp = (date.hour || 0) % 12 + 1;
					str += JSUtils.pad(temp, 2);
					break;
				*/
				case 'K':
					temp = (date.hour || 0) % 12;
					str += temp; 
					break;
				case 'KK':
					temp = (date.hour || 0) % 12;
					str += JSUtils.pad(temp, 2);
					break;

				case 'H':
					str += (date.hour || "0");
					break;
				case 'HH':
					str += JSUtils.pad(date.hour || "0", 2);
					break;
				case 'k':
					str += (date.hour == 0 ? "24" : date.hour);
					break;
				case 'kk':
					temp = (date.hour == 0 ? "24" : date.hour);
					str += JSUtils.pad(temp, 2);
					break;

				case 'm':
					str += (date.minute || "0");
					break;
				case 'mm':
					str += JSUtils.pad(date.minute || "0", 2);
					break;
				case 's':
					str += (date.second || "0");
					break;
				case 'ss':
					str += JSUtils.pad(date.second || "0", 2);
					break;
				case 'S':
					str += (date.millisecond || "0");
					break;
				case 'SSS':
					str += JSUtils.pad(date.millisecond || "0", 3);
					break;

				case 'N':
				case 'NN':
				case 'MMM':
				case 'MMMM':
				case 'L':
				case 'LL':
				case 'LLL':
				case 'LLLL':
					key = templateArr[i] + (date.month || 1);
					str += (this.sysres.getString(undefined, key + "-" + this.calName) || this.sysres.getString(undefined, key));
					break;
					
				case 'E':
				case 'EE':
				case 'EEE':
				case 'EEEE':
				case 'c':
				case 'cc':
				case 'ccc':
				case 'cccc':
					key = templateArr[i] + date.getDayOfWeek();
					//console.log("finding " + key + " in the resources");
					str += (this.sysres.getString(undefined, key + "-" + this.calName) || this.sysres.getString(undefined, key));
					break;

				case 'a':
					switch (this.meridiems) {
					case "chinese":
						if (date.hour < 6) {
							key = "azh0";	// before dawn
						} else if (date.hour < 9) {
							key = "azh1";	// morning
						} else if (date.hour < 12) {
							key = "azh2";	// late morning/day before noon
						} else if (date.hour < 13) {
							key = "azh3";	// noon hour/midday
						} else if (date.hour < 18) {
							key = "azh4";	// afternoon
						} else if (date.hour < 21) {
							key = "azh5";	// evening time/dusk
						} else {
							key = "azh6";	// night time
						}
						break;
					case "ethiopic":
						if (date.hour < 6) {
							key = "a0-ethiopic";	// morning
						} else if (date.hour === 6 && date.minute === 0) {
							key = "a1-ethiopic";	// noon
						} else if (date.hour >= 6 && date.hour < 12) {
							key = "a2-ethiopic";	// afternoon
						} else if (date.hour >= 12 && date.hour < 18) {
							key = "a3-ethiopic";	// evening
						} else if (date.hour >= 18) {
							key = "a4-ethiopic";	// night
						}
						break;
					default:
						key = date.hour < 12 ? "a0" : "a1";
						break;
					}
					//console.log("finding " + key + " in the resources");
					str += (this.sysres.getString(undefined, key + "-" + this.calName) || this.sysres.getString(undefined, key));
					break;
					
				case 'w':
					str += date.getWeekOfYear();
					break;
				case 'ww':
					str += JSUtils.pad(date.getWeekOfYear(), 2);
					break;

				case 'D':
					str += date.getDayOfYear();
					break;
				case 'DD':
					str += JSUtils.pad(date.getDayOfYear(), 2);
					break;
				case 'DDD':
					str += JSUtils.pad(date.getDayOfYear(), 3);
					break;
				case 'W':
					str += date.getWeekOfMonth(this.locale);
					break;

				case 'G':
					key = "G" + date.getEra();
					str += (this.sysres.getString(undefined, key + "-" + this.calName) || this.sysres.getString(undefined, key));
					break;

				case 'O':
					temp = this.sysres.getString("1#1st|2#2nd|3#3rd|21#21st|22#22nd|23#23rd|31#31st|#{num}th", "ordinalChoice");
					str += temp.formatChoice(date.day, {num: date.day});
					break;
					
				case 'z': // general time zone
					tz = this.getTimeZone(); // lazy-load the tz
					str += tz.getDisplayName(date, "standard");
					break;
				case 'Z': // RFC 822 time zone
					tz = this.getTimeZone(); // lazy-load the tz
					str += tz.getDisplayName(date, "rfc822");
					break;

				default:
					str += templateArr[i].replace(/'/g, "");
					break;
			}
		}

		if (this.digits) {
			str = JSUtils.mapString(str, this.digits);
		}
		return str;
	},
	
	/**
	 * Format a particular date instance according to the settings of this
	 * formatter object. The type of the date instance being formatted must 
	 * correspond exactly to the calendar type with which this formatter was 
	 * constructed. If the types are not compatible, this formatter will
	 * produce bogus results.
	 * 
	 * @param {IDate|Number|String|Date|JulianDay|null|undefined} dateLike a date-like object to format
	 * @return {string} the formatted version of the given date instance
	 */
	format: function (dateLike) {
		var thisZoneName = this.tz && this.tz.getId() || "local";

		var date = DateFactory._dateToIlib(dateLike, thisZoneName, this.locale);
		
		if (!date.getCalendar || !(date instanceof IDate)) {
			throw "Wrong date type passed to DateFmt.format()";
		}
		
		var dateZoneName = date.timezone || "local";
		
		// convert to the time zone of this formatter before formatting
		if (dateZoneName !== thisZoneName || date.getCalendar() !== this.calName) {
			// console.log("Differing time zones date: " + dateZoneName + " and fmt: " + thisZoneName + ". Converting...");
			// this will recalculate the date components based on the new time zone
			// and/or convert a date in another calendar to the current calendar before formatting it
			var newDate = DateFactory({
				type: this.calName,
				timezone: thisZoneName,
				julianday: date.getJulianDay()
			});
			
			date = newDate;
		}
		return this._formatTemplate(date, this.templateArr);
	},
	
	/**
	 * Return a string that describes a date relative to the given 
	 * reference date. The string returned is text that for the locale that
	 * was specified when the formatter instance was constructed.<p>
	 * 
	 * The date can be in the future relative to the reference date or in
	 * the past, and the formatter will generate the appropriate string.<p>
	 * 
	 * The text used to describe the relative reference depends on the length
	 * of time between the date and the reference. If the time was in the
	 * past, it will use the "ago" phrase, and in the future, it will use
	 * the "in" phrase. Examples:<p>
	 * 
	 * <ul>
	 * <li>within a minute: either "X seconds ago" or "in X seconds"
	 * <li>within an hour: either "X minutes ago" or "in X minutes"
	 * <li>within a day: either "X hours ago" or "in X hours"
	 * <li>within 2 weeks: either "X days ago" or "in X days"
	 * <li>within 12 weeks (~3 months): either "X weeks ago" or "in X weeks"
	 * <li>within two years: either "X months ago" or "in X months"
	 * <li>longer than 2 years: "X years ago" or "in X years"
	 * </ul>
	 * 
	 * @param {IDate|Number|String|Date|JulianDay|null|undefined} reference a date that the date parameter should be relative to
	 * @param {IDate|Number|String|Date|JulianDay|null|undefined} date a date being formatted
	 * @throws "Wrong calendar type" when the start or end dates are not the same
	 * calendar type as the formatter itself
	 * @return {string} the formatted relative date
	 */
	formatRelative: function(reference, date) {
		reference = DateFactory._dateToIlib(reference);
		date = DateFactory._dateToIlib(date);

		var referenceRd, dateRd, fmt, time, diff, absDiff, num;

		if (typeof(reference) !== 'object' || !reference.getCalendar || reference.getCalendar() !== this.calName ||
			typeof(date) !== 'object' || !date.getCalendar || date.getCalendar() !== this.calName) {
			throw "Wrong calendar type";
		}
		
		referenceRd = reference.getRataDie();
		dateRd = date.getRataDie();

		diff = referenceRd - dateRd;
		absDiff = Math.abs(diff);

		if (absDiff < 0.000694444) {
			num = Math.round(absDiff * 86400);
			switch (this.length) {
				case 's':
					fmt = diff > 0 ? this.sysres.getString("#{num}s ago") : this.sysres.getString("#in {num}s");
					break;
				case 'm':
					fmt = diff > 0 ? this.sysres.getString("1#1 sec ago|#{num} sec ago") : this.sysres.getString("1#in 1 sec|#in {num} sec");
					break;
				default:
				case 'f':
				case 'l':
					fmt = diff > 0 ? this.sysres.getString("1#1 second ago|#{num} seconds ago") : this.sysres.getString("1#in 1 second|#in {num} seconds");
					break;
			}
		} else if (absDiff < 0.041666667) {
			num = Math.round(absDiff * 1440);
			switch (this.length) {
				case 's':
					fmt = diff > 0 ? this.sysres.getString("#{num}mi ago") : this.sysres.getString("#in {num}mi");
					break;
				case 'm':
					fmt = diff > 0 ? this.sysres.getString("1#1 min ago|#{num} min ago") :  this.sysres.getString("1#in 1 min|#in {num} min");
					break;
				default:
				case 'f':
				case 'l':
					fmt = diff > 0 ? this.sysres.getString("1#1 minute ago|#{num} minutes ago") : this.sysres.getString("1#in 1 minute|#in {num} minutes");
					break;
			}
		} else if (absDiff < 1) {
			num = Math.round(absDiff * 24);
			switch (this.length) {
				case 's':
					fmt = diff > 0 ? this.sysres.getString("#{num}h ago") : this.sysres.getString("#in {num}h");
					break;
				case 'm':
					fmt = diff > 0 ? this.sysres.getString("1#1 hr ago|#{num} hrs ago") : this.sysres.getString("1#in 1 hr|#in {num} hrs");
					break;
				default:
				case 'f':
				case 'l':
					fmt = diff > 0 ? this.sysres.getString("1#1 hour ago|#{num} hours ago") : this.sysres.getString("1#in 1 hour|#in {num} hours");
					break;
			}
		} else if (absDiff < 14) {
			num = Math.round(absDiff);
			switch (this.length) {
				case 's':
					fmt = diff > 0 ? this.sysres.getString("#{num}d ago") : this.sysres.getString("#in {num}d");
					break;
				case 'm':
					fmt = diff > 0 ? this.sysres.getString("1#1 dy ago|#{nudurationm} dys ago") : this.sysres.getString("1#in 1 dy|#in {num} dys");
					break;
				default:
				case 'f':
				case 'l':
					fmt = diff > 0 ? this.sysres.getString("1#1 day ago|#{num} days ago") : this.sysres.getString("1#in 1 day|#in {num} days");
					break;
			}
		} else if (absDiff < 84) {
			num = Math.round(absDiff/7);
			switch (this.length) {
				case 's':
					fmt = diff > 0 ? this.sysres.getString("#{num}w ago") : this.sysres.getString("#in {num}w");
					break;
				case 'm':
					fmt = diff > 0 ? this.sysres.getString("1#1 wk ago|#{num} wks ago") : this.sysres.getString("1#in 1 wk|#in {num} wks");
					break;
				default:
				case 'f':
				case 'l':
					fmt = diff > 0 ? this.sysres.getString("1#1 week ago|#{num} weeks ago") : this.sysres.getString("1#in 1 week|#in {num} weeks");
					break;
			}
		} else if (absDiff < 730) {
			num = Math.round(absDiff/30.4);
			switch (this.length) {
				case 's':
					fmt = diff > 0 ? this.sysres.getString("#{num}mo ago") : this.sysres.getString("#in {num}mo");
					break;
				case 'm':
					fmt = diff > 0 ? this.sysres.getString("1#1 mon ago|#{num} mons ago") : this.sysres.getString("1#in 1 mon|#in {num} mons");
					break;
				default:
				case 'f':
				case 'l':
					fmt = diff > 0 ? this.sysres.getString("1#1 month ago|#{num} months ago") : this.sysres.getString("1#in 1 month|#in {num} months");
					break;
			}
		} else {
			num = Math.round(absDiff/365);
			switch (this.length) {
				case 's':
					fmt = diff > 0 ? this.sysres.getString("#{num}y ago") : this.sysres.getString("#in {num}y");
					break;
				case 'm':
					fmt = diff > 0 ? this.sysres.getString("1#1 yr ago|#{num} yrs ago") : this.sysres.getString("1#in 1 yr|#in {num} yrs");
					break;
				default:
				case 'f':
				case 'l':
					fmt = diff > 0 ? this.sysres.getString("1#1 year ago|#{num} years ago") : this.sysres.getString("1#in 1 year|#in {num} years");
					break;
			}
		}
		return fmt.formatChoice(num, {num: num});
	}
};

module.exports = DateFmt;
