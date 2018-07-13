/*
 * DateFactory.js - Factory class to create the right subclasses of a date for any 
 * calendar or locale.
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

/* !depends ilib.js Locale.js LocaleInfo.js JulianDay.js JSUtils.js CalendarFactory.js IDate.js GregorianDate.js*/

var ilib = require("./ilib.js");
var JSUtils = require("./JSUtils.js");

var Locale = require("./Locale.js");
var LocaleInfo = require("./LocaleInfo.js");
var JulianDay = require("./JulianDay.js");
var CalendarFactory = require("./CalendarFactory.js");

// Statically depend on these even though we don't use them
// to guarantee they are loaded into the cache already.
var IDate = require("./IDate.js");
var GregorianDate = require("./GregorianDate.js");

/**
 * Factory method to create a new instance of a date subclass.<p>
 * 
 * The options parameter can be an object that contains the following
 * properties:
 * 
 * <ul>
 * <li><i>type</i> - specify the type/calendar of the date desired. The
 * list of valid values changes depending on which calendars are 
 * defined. When assembling your iliball.js, include those date type 
 * you wish to use in your program or web page, and they will register 
 * themselves with this factory method. The "gregorian",
 * and "julian" calendars are all included by default, as they are the
 * standard calendars for much of the world. If not specified, the type
 * of the date returned is the one that is appropriate for the locale.
 * This property may also be given as "calendar" instead of "type".
 * 
 * <li><i>onLoad</i> - a callback function to call when the date object is fully 
 * loaded. When the onLoad option is given, the date factory will attempt to
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
 * The options object is also passed down to the date constructor, and 
 * thus can contain the the properties as the date object being instantiated.
 * See the documentation for {@link GregorianDate}, and other
 * subclasses for more details on other parameter that may be passed in.<p>
 * 
 * Please note that if you do not give the type parameter, this factory
 * method will create a date object that is appropriate for the calendar
 * that is most commonly used in the specified or current ilib locale. 
 * For example, in Thailand, the most common calendar is the Thai solar 
 * calendar. If the current locale is "th-TH" (Thai for Thailand) and you 
 * use this factory method to construct a new date without specifying the
 * type, it will automatically give you back an instance of 
 * {@link ThaiSolarDate}. This is convenient because you do not 
 * need to know which locales use which types of dates. In fact, you 
 * should always use this factory method to make new date instances unless
 * you know that you specifically need a date in a particular calendar.<p>
 * 
 * Also note that when you pass in the date components such as year, month,
 * day, etc., these components should be appropriate for the given date
 * being instantiated. That is, in our Thai example in the previous
 * paragraph, the year and such should be given as a Thai solar year, not
 * the Gregorian year that you get from the Javascript Date class. In
 * order to initialize a date instance when you don't know what subclass
 * will be instantiated for the locale, use a parameter such as "unixtime" 
 * or "julianday" which are unambiguous and based on UTC time, instead of
 * the year/month/date date components. The date components for that UTC 
 * time will be calculated and the time zone offset will be automatically 
 * factored in.
 * 
 * @static
 * @param {Object=} options options controlling the construction of this instance, or
 * undefined to use the default options
 * @return {IDate} an instance of a calendar object of the appropriate type 
 */
var DateFactory = function(options) {
	var locale,
		type,
		cons,
		sync = true,
		obj;


	if (options) {
		if (options.locale) {
			locale = (typeof(options.locale) === 'string') ? new Locale(options.locale) : options.locale;
		}
		
		type = options.type || options.calendar;
		
		if (typeof(options.sync) === 'boolean') {
			sync = options.sync;
		}
	}
	
	if (!locale) {
		locale = new Locale();	// default locale
	}

	if (!type) {
		new LocaleInfo(locale, {
			sync: sync,
			loadParams: options && options.loadParams,
			onLoad: function(info) {
				type = info.getCalendar();
				
				obj = DateFactory._init(type, options);
			}
		});
	} else {
		obj = DateFactory._init(type, options);
	}
	
	return obj
};

/**
 * Map calendar names to classes to initialize in the dynamic code model.
 * TODO: Need to figure out some way that this doesn't have to be updated by hand.
 * @private
 */
DateFactory._dynMap = {
	"coptic":       "Coptic",
	"ethiopic":     "Ethiopic",
	"gregorian":    "Gregorian",
	"han":          "Han",
	"hebrew":       "Hebrew",
	"islamic":      "Islamic",
	"julian":       "Julian",
	"persian":      "Persian",
	"persian-algo": "PersianAlgo",
	"thaisolar":    "ThaiSolar"
};

/**
 * Dynamically load the code for a calendar and calendar class if necessary.
 * @protected
 */
DateFactory._dynLoadDate = function (name) {
	if (!IDate._constructors[name]) {
		var entry = DateFactory._dynMap[name];
		if (entry) {
			IDate._constructors[name] = require("./" + entry + "Date.js");
		}
	}
	return IDate._constructors[name];
};

/** 
 * @protected
 * @static 
 */
DateFactory._init = function(type, options) {
	var cons;
	
	if (ilib.isDynCode()) {
		DateFactory._dynLoadDate(type);
		CalendarFactory._dynLoadCalendar(type);
	}
	
	cons = IDate._constructors[type];
	
	// pass the same options through to the constructor so the subclass
	// has the ability to do something with if it needs to
	if (!cons && typeof(options.onLoad) === "function") {
	    options.onLoad(undefined);
	}
	return cons && new cons(options);
};

/**
 * Convert JavaScript Date objects and other types into native Dates. This accepts any
 * string or number that can be translated by the JavaScript Date class,
 * (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse)
 * any JavaScript Date classed object, any IDate subclass, an JulianDay object, an object
 * containing the normal options to initialize an IDate instance, or null (will 
 * return null or undefined if input is null or undefined). Normal output is 
 * a standard native subclass of the IDate object as appropriate for the locale.
 * 
 * @static
 * @protected
 * @param {IDate|Object|JulianDay|Date|string|number=} inDate The input date object, string or Number.
 * @param {IString|string=} timezone timezone to use if a new date object is created
 * @param {Locale|string=} locale locale to use when constructing an IDate
 * @return {IDate|null|undefined} an IDate subclass equivalent to the given inDate
 */
DateFactory._dateToIlib = function(inDate, timezone, locale) {
	if (typeof(inDate) === 'undefined' || inDate === null) {
		return inDate;
	}
	if (inDate instanceof IDate) {
		return inDate;
	}
	if (typeof(inDate) === 'number') {
		return DateFactory({
			unixtime: inDate,
			timezone: timezone,
			locale: locale
		});
	}
	if (typeof(inDate) === 'string') {
		inDate = new Date(inDate);
	}
	if (JSUtils.isDate(inDate)) {
		return DateFactory({
			unixtime: inDate.getTime(),
			timezone: timezone,
			locale: locale
		});
	}
	if (inDate instanceof JulianDay) {
		return DateFactory({
			jd: inDate,
			timezone: timezone,
			locale: locale
		});
	}
	if (typeof(inDate) === 'object') {
		return DateFactory(inDate);
	}
	return DateFactory({
		unixtime: inDate.getTime(),
		timezone: timezone,
		locale: locale
	});
};

module.exports = DateFactory;
