/*
 * CalendarFactory.js - Constructs new instances of the right subclass of Calendar
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
Locale.js
LocaleInfo.js
Calendar.js
*/

var ilib = require("./ilib.js");
var Locale = require("./Locale.js");
var LocaleInfo = require("./LocaleInfo.js");
var Calendar = require("./Calendar.js");

/**
 * Factory method to create a new instance of a calendar subclass.<p>
 * 
 * The options parameter can be an object that contains the following
 * properties:
 * 
 * <ul>
 * <li><i>type</i> - specify the type of the calendar desired. The
 * list of valid values changes depending on which calendars are 
 * defined. When assembling your iliball.js, include those calendars 
 * you wish to use in your program or web page, and they will register 
 * themselves with this factory method. The "official", "gregorian",
 * and "julian" calendars are all included by default, as they are the
 * standard calendars for much of the world.
 * <li><i>locale</i> - some calendars vary depending on the locale.
 * For example, the "official" calendar transitions from a Julian-style
 * calendar to a Gregorian-style calendar on a different date for
 * each country, as the governments of those countries decided to
 * adopt the Gregorian calendar at different times.
 *  
 * <li><i>onLoad</i> - a callback function to call when the calendar object is fully 
 * loaded. When the onLoad option is given, the calendar factory will attempt to
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
 * If a locale is specified, but no type, then the calendar that is default for
 * the locale will be instantiated and returned. If neither the type nor
 * the locale are specified, then the calendar for the default locale will
 * be used. 
 * 
 * @static
 * @param {Object=} options options controlling the construction of this instance, or
 * undefined to use the default options
 * @return {Calendar} an instance of a calendar object of the appropriate type
 */
var CalendarFactory = function (options) {
	var locale,
		type,
		sync = true,
		instance;

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
				
				instance = CalendarFactory._init(type, options);
			}
		});
	} else {
		instance = CalendarFactory._init(type, options);
	}
	
	return instance;
};

/**
 * Map calendar names to classes to initialize in the dynamic code model.
 * TODO: Need to figure out some way that this doesn't have to be updated by hand.
 * @private
 */
CalendarFactory._dynMap = {
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
CalendarFactory._dynLoadCalendar = function (name) {
	if (!Calendar._constructors[name]) {
		var entry = CalendarFactory._dynMap[name];
		if (entry) {
			Calendar._constructors[name] = require("./" + entry + "Cal.js");
		}
	}
	return Calendar._constructors[name];
};

/** @private */
CalendarFactory._init = function(type, options) {
	var cons;
	
	if (ilib.isDynCode()) {
		CalendarFactory._dynLoadCalendar(type);
	}
	
	cons = Calendar._constructors[type];
	
	// pass the same options through to the constructor so the subclass
	// has the ability to do something with if it needs to
    if (!cons && typeof(options.onLoad) === "function") {
        options.onLoad(undefined);
    }
	return cons && new cons(options);
};

/**
 * Return an array of known calendar types that the factory method can instantiate.
 * 
 * @return {Array.<string>} an array of calendar types
 */
CalendarFactory.getCalendars = function () {
	var arr = [],
		c;
	
	if (ilib.isDynCode()) {
		for (c in CalendarFactory._dynMap) {
			CalendarFactory._dynLoadCalendar(c);
		}
	}
	
	for (c in Calendar._constructors) {
		if (c && Calendar._constructors[c]) {
			arr.push(c); // code like a pirate
		}
	}
	
	return arr;
};

module.exports = CalendarFactory;
