/*
 * Utils.js - Core utility routines
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

// !depends ilib.js Locale.js JSUtils.js

var ilib = require("./ilib.js");
var Locale = require("./Locale.js");
var JSUtils = require("./JSUtils.js");

var Utils = {};

/**
 * Find and merge all the locale data for a particular prefix in the given locale
 * and return it as a single javascript object. This merges the data in the 
 * correct order:
 * 
 * <ol>
 * <li>shared data (usually English)
 * <li>data for language
 * <li>data for language + region
 * <li>data for language + region + script
 * <li>data for language + region + script + variant
 * </ol>
 * 
 * It is okay for any of the above to be missing. This function will just skip the 
 * missing data. However, if everything except the shared data is missing, this 
 * function returns undefined, allowing the caller to go and dynamically load the
 * data instead.
 * 
 * @static
 * @param {string} prefix prefix under ilib.data of the data to merge
 * @param {Locale} locale locale of the data being sought
 * @param {boolean=} replaceArrays if true, replace the array elements in object1 with those in object2.
 * If false, concatenate array elements in object1 with items in object2.
 * @param {boolean=} returnOne if true, only return the most locale-specific data. If false,
 * merge all the relevant locale data together.
 * @return {Object?} the merged locale data
 */
Utils.mergeLocData = function (prefix, locale, replaceArrays, returnOne) {
	var data = undefined;
	var loc = locale || new Locale();
	var foundLocaleData = false;
	var property = prefix;
	var mostSpecific;

	data = ilib.data[prefix] || {};

	mostSpecific = data;

	if (loc.getLanguage()) {
		property = prefix + '_' + loc.getLanguage();
		if (ilib.data[property]) {
			foundLocaleData = true;
			data = JSUtils.merge(data, ilib.data[property], replaceArrays);
			mostSpecific = ilib.data[property];
		}
	}
	
	if (loc.getRegion()) {
		property = prefix + '_' + loc.getRegion();
		if (ilib.data[property]) {
			foundLocaleData = true;
			data = JSUtils.merge(data, ilib.data[property], replaceArrays);
			mostSpecific = ilib.data[property];
		}
	}
	
	if (loc.getLanguage()) {
		property = prefix + '_' + loc.getLanguage();
		
		if (loc.getScript()) {
			property = prefix + '_' + loc.getLanguage() + '_' + loc.getScript();
			if (ilib.data[property]) {
				foundLocaleData = true;
				data = JSUtils.merge(data, ilib.data[property], replaceArrays);
				mostSpecific = ilib.data[property];
			}
		}
		
		if (loc.getRegion()) {
			property = prefix + '_' + loc.getLanguage() + '_' + loc.getRegion();
			if (ilib.data[property]) {
				foundLocaleData = true;
				data = JSUtils.merge(data, ilib.data[property], replaceArrays);
				mostSpecific = ilib.data[property];
			}
		}		
	}
	
	if (loc.getRegion() && loc.getVariant()) {
		property = prefix + '_' + loc.getLanguage() + '_' + loc.getVariant();
		if (ilib.data[property]) {
			foundLocaleData = true;
			data = JSUtils.merge(data, ilib.data[property], replaceArrays);
			mostSpecific = ilib.data[property];
		}
	}

	if (loc.getLanguage() && loc.getScript() && loc.getRegion()) {
		property = prefix + '_' + loc.getLanguage() + '_' + loc.getScript() + '_' + loc.getRegion();
		if (ilib.data[property]) {
			foundLocaleData = true;
			data = JSUtils.merge(data, ilib.data[property], replaceArrays);
			mostSpecific = ilib.data[property];
		}
	}

	if (loc.getLanguage() && loc.getRegion() && loc.getVariant()) {
		property = prefix + '_' + loc.getLanguage() + '_' + loc.getRegion() + '_' + loc.getVariant();
		if (ilib.data[property]) {
			foundLocaleData = true;
			data = JSUtils.merge(data, ilib.data[property], replaceArrays);
			mostSpecific = ilib.data[property];
		}
	}

	if (loc.getLanguage() && loc.getScript() && loc.getRegion() && loc.getVariant()) {
		property = prefix + '_' + loc.getLanguage() + '_' + loc.getScript() + '_' + loc.getRegion() + '_' + loc.getVariant();
		if (ilib.data[property]) {
			foundLocaleData = true;
			data = JSUtils.merge(data, ilib.data[property], replaceArrays);
			mostSpecific = ilib.data[property];
		}
	}
	
	return foundLocaleData ? (returnOne ? mostSpecific : data) : undefined;
};

/**
 * Return an array of relative path names for the
 * files that represent the data for the given locale.<p>
 * 
 * Note that to prevent the situation where a directory for
 * a language exists next to the directory for a region where
 * the language code and region code differ only by case, the 
 * plain region directories are located under the special 
 * "undefined" language directory which has the ISO code "und".
 * The reason is that some platforms have case-insensitive 
 * file systems, and you cannot have 2 directories with the 
 * same name which only differ by case. For example, "es" is
 * the ISO 639 code for the language "Spanish" and "ES" is
 * the ISO 3166 code for the region "Spain", so both the
 * directories cannot exist underneath "locale". The region
 * therefore will be loaded from "und/ES" instead.<p>  
 * 
 * <h4>Variations</h4>
 * 
 * With only language and region specified, the following
 * sequence of paths will be generated:<p>
 * 
 * <pre>
 * language
 * und/region
 * language/region
 * </pre>
 * 
 * With only language and script specified:<p>
 * 
 * <pre>
 * language
 * language/script
 * </pre>
 * 
 * With only script and region specified:<p>
 * 
 * <pre>
 * und/region  
 * </pre>
 * 
 * With only region and variant specified:<p>
 * 
 * <pre>
 * und/region
 * region/variant
 * </pre>
 * 
 * With only language, script, and region specified:<p>
 * 
 * <pre>
 * language
 * und/region
 * language/script
 * language/region
 * language/script/region
 * </pre>
 * 
 * With only language, region, and variant specified:<p>
 * 
 * <pre>
 * language
 * und/region
 * language/region
 * region/variant
 * language/region/variant
 * </pre>
 * 
 * With all parts specified:<p>
 * 
 * <pre>
 * language
 * und/region
 * language/script
 * language/region
 * region/variant
 * language/script/region
 * language/region/variant
 * language/script/region/variant
 * </pre>
 * 
 * @static
 * @param {Locale} locale load the files for this locale
 * @param {string?} name the file name of each file to load without
 * any path
 * @return {Array.<string>} An array of relative path names
 * for the files that contain the locale data
 */
Utils.getLocFiles = function(locale, name) {
	var dir = "";
	var files = [];
	var filename = name || "resources.json";
	var loc = locale || new Locale();
	
	var language = loc.getLanguage();
	var region = loc.getRegion();
	var script = loc.getScript();
	var variant = loc.getVariant();
	
	files.push(filename); // generic shared file
	
	if (language) {
		dir = language + "/";
		files.push(dir + filename);
	}
	
	if (region) {
		dir = "und/" + region + "/";
		files.push(dir + filename);
	}
	
	if (language) {
		if (script) {
			dir = language + "/" + script + "/";
			files.push(dir + filename);
		}
		if (region) {
			dir = language + "/" + region + "/";
			files.push(dir + filename);
		}
	}
	
	if (region && variant) {
		dir = "und/" + region + "/" + variant + "/";
		files.push(dir + filename);
	}

	if (language && script && region) {
		dir = language + "/" + script + "/" + region + "/";
		files.push(dir + filename);
	}

	if (language && region && variant) {
		dir = language + "/" + region + "/" + variant + "/";
		files.push(dir + filename);
	}

	if (language && script && region && variant) {
		dir = language + "/" + script + "/" + region + "/" + variant + "/";
		files.push(dir + filename);
	}
	
	return files;
};

/**
 * Load data using the new loader object or via the old function callback.
 * @static
 * @private
 */
Utils._callLoadData = function (files, sync, params, callback) {
	// console.log("Utils._callLoadData called");
	if (typeof(ilib._load) === 'function') {
		// console.log("Utils._callLoadData: calling as a regular function");
		return ilib._load(files, sync, params, callback);
	} else if (typeof(ilib._load) === 'object' && typeof(ilib._load.loadFiles) === 'function') {
		// console.log("Utils._callLoadData: calling as an object");
		return ilib._load.loadFiles(files, sync, params, callback);
	}
	
	// console.log("Utils._callLoadData: not calling. Type is " + typeof(ilib._load) + " and instanceof says " + (ilib._load instanceof Loader));
	return undefined;
};

/**
 * Find locale data or load it in. If the data with the given name is preassembled, it will
 * find the data in ilib.data. If the data is not preassembled but there is a loader function,
 * this function will call it to load the data. Otherwise, the callback will be called with
 * undefined as the data. This function will create a cache under the given class object.
 * If data was successfully loaded, it will be set into the cache so that future access to 
 * the same data for the same locale is much quicker.<p>
 * 
 * The parameters can specify any of the following properties:<p>
 * 
 * <ul>
 * <li><i>name</i> - String. The name of the file being loaded. Default: ResBundle.json
 * <li><i>object</i> - String. The name of the class attempting to load data. This is used to differentiate parts of the cache.
 * <li><i>locale</i> - Locale. The locale for which data is loaded. Default is the current locale.
 * <li><i>nonlocale</i> - boolean. If true, the data being loaded is not locale-specific.
 * <li><i>type</i> - String. Type of file to load. This can be "json" or "other" type. Default: "json" 
 * <li><i>replace</i> - boolean. When merging json objects, this parameter controls whether to merge arrays
 * or have arrays replace each other. If true, arrays in child objects replace the arrays in parent 
 * objects. When false, the arrays in child objects are concatenated with the arrays in parent objects.  
 * <li><i>loadParams</i> - Object. An object with parameters to pass to the loader function
 * <li><i>sync</i> - boolean. Whether or not to load the data synchronously
 * <li><i>callback</i> - function(?)=. callback Call back function to call when the data is available.
 * Data is not returned from this method, so a callback function is mandatory.
 * </ul>
 * 
 * @static
 * @param {Object} params Parameters configuring how to load the files (see above)
 */
Utils.loadData = function(params) {
	var name = "resources.json",
		object = "generic", 
		locale = new Locale(ilib.getLocale()), 
		sync = false, 
		type = undefined,
		loadParams = {},
		callback = undefined,
		nonlocale = false,
		replace = false,
		basename;
	
	if (!params || typeof(params.callback) !== 'function') {
		return;
	}

	if (params.name) {
		name = params.name;
	}
	if (params.object) {
		object = params.object;
	}
	if (params.locale) {
		locale = (typeof(params.locale) === 'string') ? new Locale(params.locale) : params.locale;
	}			
	if (params.type) {
		type = params.type;
	}
	if (params.loadParams) {
		loadParams = params.loadParams;
	}
	if (params.sync) {
		sync = params.sync;
	}
	if (params.nonlocale) {
		nonlocale = !!params.nonlocale;
	}
	if (typeof(params.replace) === 'boolean') {
		replace = params.replace;
	}
	
	callback = params.callback;
	
	if (object && !ilib.data.cache[object]) {
	    ilib.data.cache[object] = {};
	}
	
	if (!type) {
		var dot = name.lastIndexOf(".");
		type = (dot !== -1) ? name.substring(dot+1) : "text";
	}

	var spec = ((!nonlocale && locale.getSpec().replace(/-/g, '_')) || "root") + "," + name + "," + String(JSUtils.hashCode(loadParams));
	if (!object || !ilib.data.cache[object] || typeof(ilib.data.cache[object][spec]) === 'undefined') {
		var data, returnOne = (loadParams && loadParams.returnOne);
		
		if (type === "json") {
			// console.log("type is json");
			basename = name.substring(0, name.lastIndexOf("."));
			if (nonlocale) {
				basename = basename.replace(/[\.:\(\)\/\\\+\-]/g, "_");
				data = ilib.data[basename];
			} else {
				data = Utils.mergeLocData(basename, locale, replace, returnOne);
			}
			if (data) {
				// console.log("found assembled data");
				if (object) {
					ilib.data.cache[object][spec] = data;
				}
				callback(data);
				return;
			}
		}
		
		// console.log("ilib._load is " + typeof(ilib._load));
		if (typeof(ilib._load) !== 'undefined') {
			// the data is not preassembled, so attempt to load it dynamically
			var files = nonlocale ? [ name || "resources.json" ] : Utils.getLocFiles(locale, name);
			if (type !== "json") {
				loadParams.returnOne = true;
			}
			
			Utils._callLoadData(files, sync, loadParams, ilib.bind(this, function(arr) {
				if (type === "json") {
					data = ilib.data[basename] || {};
					for (var i = 0; i < arr.length; i++) {
						if (typeof(arr[i]) !== 'undefined') {
						    if (loadParams.returnOne) {
						        data = arr[i];
						        break;
						    }
							data = JSUtils.merge(data, arr[i], replace);
						}
					}
					
					if (object) {
						ilib.data.cache[object][spec] = data;
					}
					callback(data);
				} else {
					var i = arr.length-1; 
					while (i > -1 && !arr[i]) {
						i--;
					}
					if (i > -1) {
						if (object) {
							ilib.data.cache[object][spec] = arr[i];
						}
						callback(arr[i]);
					} else {
						callback(undefined);
					}
				}
			}));
		} else {
			// no data other than the generic shared data
			if (type === "json") {
				data = ilib.data[basename];
			}
			if (object && data) {
				ilib.data.cache[object][spec] = data;
			}
			callback(data);
		}
	} else {
		callback(ilib.data.cache && ilib.data.cache[object] && ilib.data.cache[object][spec]);
	}
};

module.exports = Utils;