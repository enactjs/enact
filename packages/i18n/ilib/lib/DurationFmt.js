/*
 * DurFmt.js - Date formatter definition
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
DateFmt.js
IString.js 
ResBundle.js 
LocaleInfo.js
JSUtils.js
Utils.js
ScriptInfo.js
*/

// !data dateformats sysres
// !resbundle sysres

var ilib = require("./ilib.js");
var Utils = require("./Utils.js");
var JSUtils = require("./JSUtils.js");
var Locale = require("./Locale.js");
var LocaleInfo = require("./LocaleInfo.js");
var DateFmt = require("./DateFmt.js");
var IString = require("./IString.js");
var ResBundle = require("./ResBundle.js");
var ScriptInfo = require("./ScriptInfo.js");

/**
 * @class
 * Create a new duration formatter instance. The duration formatter is immutable once
 * it is created, but can format as many different durations as needed with the same
 * options. Create different duration formatter instances for different purposes
 * and then keep them cached for use later if you have more than one duration to
 * format.<p>
 * 
 * Duration formatters format lengths of time. The duration formatter is meant to format 
 * durations of such things as the length of a song or a movie or a meeting, or the 
 * current position in that song or movie while playing it. If you wish to format a 
 * period of time that has a specific start and end date/time, then use a
 * [DateRngFmt] instance instead and call its format method.<p>
 *  
 * The options may contain any of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> - locale to use when formatting the duration. If the locale is
 * not specified, then the default locale of the app or web page will be used.
 * 
 * <li><i>length</i> - Specify the length of the format to use. The length is the approximate size of the 
 * formatted string.
 * 
 * <ul>
 * <li><i>short</i> - use a short representation of the duration. This is the most compact format possible for the locale. eg. 1y 1m 1w 1d 1:01:01
 * <li><i>medium</i> - use a medium length representation of the duration. This is a slightly longer format. eg. 1 yr 1 mo 1 wk 1 dy 1 hr 1 mi 1 se
 * <li><i>long</i> - use a long representation of the duration. This is a fully specified format, but some of the textual 
 * parts may still be abbreviated. eg. 1 yr 1 mo 1 wk 1 day 1 hr 1 min 1 sec
 * <li><i>full</i> - use a full representation of the duration. This is a fully specified format where all the textual 
 * parts are spelled out completely. eg. 1 year, 1 month, 1 week, 1 day, 1 hour, 1 minute and 1 second
 * </ul>
 * 
 * <li><i>style<i> - whether hours, minutes, and seconds should be formatted as a text string
 * or as a regular time as on a clock. eg. text is "1 hour, 15 minutes", whereas clock is "1:15:00". Valid
 * values for this property are "text" or "clock". Default if this property is not specified
 * is "text".
 * 
 *<li><i>useNative</i> - the flag used to determaine whether to use the native script settings 
 * for formatting the numbers .
 * 
 * <li><i>onLoad</i> - a callback function to call when the format data is fully 
 * loaded. When the onLoad option is given, this class will attempt to
 * load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the 
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two. 
 * 
 * <li>sync - tell whether to load any missing locale data synchronously or 
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
 * <p>
 * 
 * 
 * @constructor
 * @param {?Object} options options governing the way this date formatter instance works
 */
var DurationFmt = function(options) {
	var sync = true;
	var loadParams = undefined;
	
	this.locale = new Locale();
	this.length = "short";
	this.style = "text";
	
	if (options) {
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? new Locale(options.locale) : options.locale;
		}
		
		if (options.length) {
			if (options.length === 'short' ||
				options.length === 'medium' ||
				options.length === 'long' ||
				options.length === 'full') {
				if(options.length === 'medium') {
					this.length = 'short';
				} else {
					this.length = options.length;
				}
			}
		}
		
		if (options.style) {
			if (options.style === 'text' || options.style === 'clock') {
				this.style = options.style;
			}
		}
		
		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync == true);
		}
		
		if (typeof(options.useNative) === 'boolean') {
			this.useNative = options.useNative;
		}
		
		loadParams = options.loadParams;
	}
	options = options || {sync: true};

    new ResBundle({
        locale: this.locale,
        name: "sysres",
        sync: sync,
        loadParams: loadParams,
        onLoad: ilib.bind(this, function (sysres) {
            IString.loadPlurals(options.sync, this.locale, options.loadParams, ilib.bind(this, function() {
                switch (this.length) {
                    case 'short':
                        this.components = {
                            year: sysres.getString("#{num}y"),
                            month: sysres.getString("#{num}m", "durationShortMonths"),
                            week: sysres.getString("#{num}w"),
                            day: sysres.getString("#{num}d"),
                            hour: sysres.getString("#{num}h"),
                            minute: sysres.getString("#{num}m", "durationShortMinutes"),
                            second: sysres.getString("#{num}s"),
                            millisecond: sysres.getString("#{num}m", "durationShortMillis"),
                            separator: sysres.getString(" ", "separatorShort"),
                            finalSeparator: "" // not used at this length
                        };
                        break;

                    case 'medium':
                        this.components = {
                            year: sysres.getString("1#1 yr|#{num} yrs", "durationMediumYears"),
                            month: sysres.getString("1#1 mo|#{num} mos"),
                            week: sysres.getString("1#1 wk|#{num} wks", "durationMediumWeeks"),
                            day: sysres.getString("1#1 dy|#{num} dys"),
                            hour: sysres.getString("1#1 hr|#{num} hrs", "durationMediumHours"),
                            minute: sysres.getString("1#1 mi|#{num} min"),
                            second: sysres.getString("1#1 se|#{num} sec"),
                            millisecond: sysres.getString("#{num} ms", "durationMediumMillis"),
                            separator: sysres.getString(" ", "separatorMedium"),
                            finalSeparator: "" // not used at this length
                        };
                        break;

                    case 'long':
                        this.components = {
                            year: sysres.getString("1#1 yr|#{num} yrs"),
                            month: sysres.getString("1#1 mon|#{num} mons"),
                            week: sysres.getString("1#1 wk|#{num} wks"),
                            day: sysres.getString("1#1 day|#{num} days", "durationLongDays"),
                            hour: sysres.getString("1#1 hr|#{num} hrs"),
                            minute: sysres.getString("1#1 min|#{num} min"),
                            second: sysres.getString("1#1 sec|#{num} sec"),
                            millisecond: sysres.getString("#{num} ms"),
                            separator: sysres.getString(", ", "separatorLong"),
                            finalSeparator: "" // not used at this length
                        };
                        break;

                    case 'full':
                        this.components = {
                            year: sysres.getString("1#1 year|#{num} years"),
                            month: sysres.getString("1#1 month|#{num} months"),
                            week: sysres.getString("1#1 week|#{num} weeks"),
                            day: sysres.getString("1#1 day|#{num} days"),
                            hour: sysres.getString("1#1 hour|#{num} hours"),
                            minute: sysres.getString("1#1 minute|#{num} minutes"),
                            second: sysres.getString("1#1 second|#{num} seconds"),
                            millisecond: sysres.getString("1#1 millisecond|#{num} milliseconds"),
                            separator: sysres.getString(", ", "separatorFull"),
                            finalSeparator: sysres.getString(" and ", "finalSeparatorFull")
                        };
                        break;
                }

                if (this.style === 'clock') {
                    new DateFmt({
                        locale: this.locale,
                        calendar: "gregorian",
                        type: "time",
                        time: "ms",
                        sync: sync,
                        loadParams: loadParams,
                        useNative: this.useNative,
                        onLoad: ilib.bind(this, function (fmtMS) {
                            this.timeFmtMS = fmtMS;
                            new DateFmt({
                                locale: this.locale,
                                calendar: "gregorian",
                                type: "time",
                                time: "hm",
                                sync: sync,
                                loadParams: loadParams,
                                useNative: this.useNative,
                                onLoad: ilib.bind(this, function (fmtHM) {
                                    this.timeFmtHM = fmtHM;
                                    new DateFmt({
                                        locale: this.locale,
                                        calendar: "gregorian",
                                        type: "time",
                                        time: "hms",
                                        sync: sync,
                                        loadParams: loadParams,
                                        useNative: this.useNative,
                                        onLoad: ilib.bind(this, function (fmtHMS) {
                                            this.timeFmtHMS = fmtHMS;

                                            // munge with the template to make sure that the hours are not formatted mod 12
                                            this.timeFmtHM.template = this.timeFmtHM.template.replace(/hh?/, 'H');
                                            this.timeFmtHM.templateArr = this.timeFmtHM._tokenize(this.timeFmtHM.template);
                                            this.timeFmtHMS.template = this.timeFmtHMS.template.replace(/hh?/, 'H');
                                            this.timeFmtHMS.templateArr = this.timeFmtHMS._tokenize(this.timeFmtHMS.template);

                                            this._init(this.timeFmtHM.locinfo, options);
                                        })
                                    });
                                })
                            });
                        })
                    });
                    return;
                }

                new LocaleInfo(this.locale, {
                    sync: sync,
                    loadParams: loadParams,
                    onLoad: ilib.bind(this, function (li) {
                        this._init(li, options);
                    })
                });
            }));
        })
    });
};

/**
 * @private
 * @static
 */
DurationFmt.complist = {
	"text": ["year", "month", "week", "day", "hour", "minute", "second", "millisecond"],
	"clock": ["year", "month", "week", "day"]
};

/**
 * @private
 */
DurationFmt.prototype._mapDigits = function(str) {
	if (this.useNative && this.digits) {
		return JSUtils.mapString(str.toString(), this.digits);
	}
	return str;
};

/**
 * @private
 * @param {LocaleInfo} locinfo
 * @param {Object|undefined} options
 */
DurationFmt.prototype._init = function(locinfo, options) {
    var digits;
    new ScriptInfo(locinfo.getScript(), {
        sync: options.sync,
        loadParams: options.loadParams,
        onLoad: ilib.bind(this, function(scriptInfo) {
            this.scriptDirection = scriptInfo.getScriptDirection();

            if (typeof(this.useNative) === 'boolean') {
                // if the caller explicitly said to use native or not, honour that despite what the locale data says...
                if (this.useNative) {
                    digits = locinfo.getNativeDigits();
                    if (digits) {
                        this.digits = digits;
                    }
                }
            } else if (locinfo.getDigitsStyle() === "native") {
                // else if the locale usually uses native digits, then use them 
                digits = locinfo.getNativeDigits();
                if (digits) {
                    this.useNative = true;
                    this.digits = digits;
                }
            } // else use western digits always

            if (typeof(options.onLoad) === 'function') {
                options.onLoad(this);
            }      
        })
    });
};

/**
 * Format a duration according to the format template of this formatter instance.<p>
 * 
 * The components parameter should be an object that contains any or all of these 
 * numeric properties:
 * 
 * <ul>
 * <li>year
 * <li>month
 * <li>week
 * <li>day
 * <li>hour
 * <li>minute
 * <li>second
 * </ul>
 * <p>
 *
 * When a property is left out of the components parameter or has a value of 0, it will not
 * be formatted into the output string, except for times that include 0 minutes and 0 seconds.
 * 
 * This formatter will not ensure that numbers for each component property is within the
 * valid range for that component. This allows you to format durations that are longer
 * than normal range. For example, you could format a duration has being "33 hours" rather
 * than "1 day, 9 hours".
 * 
 * @param {Object} components date/time components to be formatted into a duration string
 * @return {IString} a string with the duration formatted according to the style and 
 * locale set up for this formatter instance. If the components parameter is empty or 
 * undefined, an empty string is returned.
 */
DurationFmt.prototype.format = function (components) {
	var i, list, temp, fmt, secondlast = true, str = "";
	
	list = DurationFmt.complist[this.style];
	//for (i = 0; i < list.length; i++) {
	for (i = list.length-1; i >= 0; i--) {
		//console.log("Now dealing with " + list[i]);
		if (typeof(components[list[i]]) !== 'undefined' && components[list[i]] != 0) {
			if (str.length > 0) {
				str = ((this.length === 'full' && secondlast) ? this.components.finalSeparator : this.components.separator) + str;
				secondlast = false;
			}
			str = this.components[list[i]].formatChoice(components[list[i]], {num: this._mapDigits(components[list[i]])}) + str;
		}
	}

	if (this.style === 'clock') {
		if (typeof(components.hour) !== 'undefined') {
			fmt = (typeof(components.second) !== 'undefined') ? this.timeFmtHMS : this.timeFmtHM;
		} else {
			fmt = this.timeFmtMS;
		}
				
		if (str.length > 0) {
			str += this.components.separator;
		}
		str += fmt._formatTemplate(components, fmt.templateArr);
	}

	if (this.scriptDirection === 'rtl') {
		str = "\u200F" + str;
	}
	return new IString(str);
};

/**
 * Return the locale that was used to construct this duration formatter object. If the
 * locale was not given as parameter to the constructor, this method returns the default
 * locale of the system.
 * 
 * @return {Locale} locale that this duration formatter was constructed with
 */
DurationFmt.prototype.getLocale = function () {
	return this.locale;
};

/**
 * Return the length that was used to construct this duration formatter object. If the
 * length was not given as parameter to the constructor, this method returns the default
 * length. Valid values are "short", "medium", "long", and "full".
 * 
 * @return {string} length that this duration formatter was constructed with
 */
DurationFmt.prototype.getLength = function () {
	return this.length;
};

/**
 * Return the style that was used to construct this duration formatter object. Returns
 * one of "text" or "clock".
 * 
 * @return {string} style that this duration formatter was constructed with
 */
DurationFmt.prototype.getStyle = function () {
	return this.style;
};

module.exports = DurationFmt;
