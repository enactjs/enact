/*
 * ilib.js - define the ilib name space
 * 
 * Copyright © 2012-2018, JEDLSoft
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
 * @namespace The global namespace that contains general ilib functions useful
 * to all of ilib
 * 
 * @version // !macro ilibVersion
 */
var ilib = ilib || {};

/** @private */
ilib._ver = function() {
    return // !macro ilibVersion
    ;
};

/**
 * Return the current version of ilib.
 * 
 * @static
 * @return {string} a version string for this instance of ilib
 */
ilib.getVersion = function () {
    if (ilib._dyncode) {
        try {
            var pkg;
            //pkg = require("../package.json");
            /* [Temp fix for webOS build for enyo]
               The build has 2 parts of Enyo using the webOS submission of iLib.
               First, Enyo ilib re-routes the locale JSON requests to /usr/share/javascript/ilib/locale/ in place of ./lib/enyo-ilib/ilib/locale.
               Second, it also copies the js from /usr/share/javascript/ilib/locale/lib into ./lib/enyo-ilib/ilib/lib.
               Since the package.json is outside that lib directory, it's triggering the error.
               Will either need to move the package.json file location or update the webos_enyojs_app_2.6+.bbclass to copy the package.json as well.
            */
            pkg.version = "13.0.2";
            return pkg.version;
        } catch (e) {
            // ignore
        }
    }
    return ilib._ver() || "13.0"; 
};

/**
 * Place where resources and such are eventually assigned.
 */
ilib.data = {
	/** @type {{ccc:Object.<string,number>,nfd:Object.<string,string>,nfc:Object.<string,string>,nfkd:Object.<string,string>,nfkc:Object.<string,string>}} */
    norm: {
    	ccc: {},
    	nfd: {},
    	nfc: {},
    	nfkd: {},
    	nfkc: {}
    },
    zoneinfo: {
        "Etc/UTC":{"o":"0:0","f":"UTC"},
        "local":{"f":"local"}
    },
    /** @type {Object.<string,{to:Object.<string,string>,from:Object.<string,number>}>} */ charmaps: {},
    /** @type {null|Object.<string,Array.<Array.<number>>>} */ ctype: null,
    /** @type {null|Object.<string,Array.<Array.<number>>>} */ ctype_c: null,
    /** @type {null|Object.<string,Array.<Array.<number>>>} */ ctype_l: null,
    /** @type {null|Object.<string,Array.<Array.<number>>>} */ ctype_m: null,
    /** @type {null|Object.<string,Array.<Array.<number>>>} */ ctype_p: null,
    /** @type {null|Object.<string,Array.<Array.<number>>>} */ ctype_z: null,
    /** @type {null|Object.<string,Array.<Array.<number>>>} */ scriptToRange: null,
    /** @type {null|Object.<string,string|Object.<string|Object.<string,string>>>} */ dateformats: null,
    /** @type {null|Array.<string>} */ timezones: [],
    cache: {}
};

/*
if (typeof(window) !== 'undefined') {
    window["ilib"] = ilib;
}
*/

// export ilib for use as a module in nodejs
if (typeof(module) !== 'undefined') {
    module.exports = ilib;
    module.exports.ilib = ilib;  // for backwards compatibility with older versions of ilib
}

/**
 * Sets the pseudo locale. Pseudolocalization (or pseudo-localization) is used for testing
 * internationalization aspects of software. Instead of translating the text of the software
 * into a foreign language, as in the process of localization, the textual elements of an application
 * are replaced with an altered version of the original language.These specific alterations make
 * the original words appear readable, but include the most problematic characteristics of 
 * the world's languages: varying length of text or characters, language direction, and so on.
 * Regular Latin pseudo locale: eu-ES and RTL pseudo locale: ps-AF
 * 
 * @param {string|undefined|null} localename the locale specifier for the pseudo locale
 */
ilib.setAsPseudoLocale = function (localename) {
   if (localename) {
	   ilib.pseudoLocales.push(localename)
   }
};

/**
 * Reset the list of pseudo locales back to the default single locale of zxx-XX.
 * @static
 */
ilib.clearPseudoLocales = function() {
	ilib.pseudoLocales = [
        "zxx-XX",
        "zxx-Cyrl-XX",
        "zxx-Hans-XX",
        "zxx-Hebr-XX"
    ];
};

ilib.clearPseudoLocales();

/**
 * Return the name of the platform
 * @private
 * @static
 * @return {string} string naming the platform
 */
ilib._getPlatform = function () {
    if (!ilib._platform) {
    	try {
    		if (typeof(java.lang.Object) !== 'undefined') {
    			ilib._platform = (typeof(process) !== 'undefined') ? "trireme" : "rhino";
    			return ilib._platform;
    		}
    	} catch (e) {}
    	
        if (typeof(process) !== 'undefined' && process.versions && process.versions.node && typeof(module) !== 'undefined') {
            ilib._platform = "nodejs";
        } else if (typeof(Qt) !== 'undefined') {
        	ilib._platform = "qt";
        } else if (typeof(window) !== 'undefined') {
            ilib._platform = (typeof(PalmSystem) !== 'undefined') ? "webos" : "browser";
        } else {
            ilib._platform = "unknown";
        }
    }    
    return ilib._platform;
};

/**
 * If this ilib is running in a browser, return the name of that browser.
 * @private
 * @static
 * @return {string|undefined} the name of the browser that this is running in ("firefox", "chrome", "ie", 
 * "safari", or "opera"), or undefined if this is not running in a browser or if
 * the browser name could not be determined 
 */
ilib._getBrowser = function () {
	var browser = undefined;
	if (ilib._getPlatform() === "browser") {
		if (navigator && navigator.userAgent) {
			if (navigator.userAgent.indexOf("Firefox") > -1) {
				browser = "firefox";
			}
			if (navigator.userAgent.search(/Opera|OPR/) > -1 ) {
				browser = "opera";
			}
			if (navigator.userAgent.indexOf("Chrome") > -1) {
				browser = "chrome";
			}
			if (navigator.userAgent.indexOf(" .NET") > -1) {
				browser = "ie";
			}
			if (navigator.userAgent.indexOf("Safari") > -1) {
				// chrome also has the string Safari in its userAgent, but the chrome case is 
				// already taken care of above
				browser = "safari";
			}
            if (navigator.userAgent.indexOf("Edge") > -1) {                
                browser = "Edge";
            }
            if (navigator.userAgent.search(/iPad|iPhone|iPod/) > -1) {
                // Due to constraints of the iOS platform, 
                // all browser must be built on top of the WebKit rendering engine
                browser = "iOS";
            }
		}
	}
	return browser;
};

/**
 * Return the value of a global variable given its name in a way that works 
 * correctly for the current platform.
 * @private
 * @static
 * @param {string} name the name of the variable to return
 * @return {*} the global variable, or undefined if it does not exist
 */
ilib._global = function(name) {
    switch (ilib._getPlatform()) {
        case "rhino":
            var top = (function() {
              return (typeof global === 'object') ? global : this;
            })();
            break;
        case "nodejs":
        case "trireme":
            top = typeof(global) !== 'undefined' ? global : this;
            //console.log("ilib._global: top is " + (typeof(global) !== 'undefined' ? "global" : "this"));
            break;
        case "qt":
        	return undefined;
        default:
        	top = window;
        	break;
    }
    try {
		return top[name];
	} catch (e) {
		return undefined;
	}
};

/**
 * Return true if the global variable is defined on this platform.
 * @private
 * @static
 * @param {string} name the name of the variable to check
 * @return {boolean} true if the global variable is defined on this platform, false otherwise
 */
ilib._isGlobal = function(name) {
	return typeof(ilib._global(name)) !== 'undefined';
};

/**
 * Clear the file load cache. This is mainly used by the unit tests,
 * but could be used by regular callers if you want to free up memory
 * for garbage collecting.
 */
ilib.clearCache = function() {
	ilib.data.cache = {};
};

/**
 * Sets the default locale for all of ilib. This locale will be used
 * when no explicit locale is passed to any ilib class. If the default
 * locale is not set, ilib will attempt to use the locale of the
 * environment it is running in, if it can find that. If not, it will
 * default to the locale "en-US". If a type of parameter is string, 
 * ilib will take only well-formed BCP-47 tag  <p>
 * 
 * 
 * @static
 * @param {string|undefined|null} spec the locale specifier for the default locale
 */
ilib.setLocale = function (spec) {
    if (typeof(spec) === 'string' || !spec) {
        ilib.locale = spec;
    }
    // else ignore other data types, as we don't have the dependencies
    // to look into them to find a locale
};

/**
 * Return the default locale for all of ilib if one has been set. This 
 * locale will be used when no explicit locale is passed to any ilib 
 * class. If the default
 * locale is not set, ilib will attempt to use the locale of the
 * environment it is running in, if it can find that. If not, it will
 * default to the locale "en-US".<p>
 * 
 * 
 * @static
 * @return {string} the locale specifier for the default locale
 */
ilib.getLocale = function () {
    if (typeof(ilib.locale) !== 'string') {
    	var plat = ilib._getPlatform();
    	switch (plat) {
    		case 'browser':
            	// running in a browser
                if(typeof(navigator.language) !== 'undefined') {
                    ilib.locale = navigator.language.substring(0,3) + navigator.language.substring(3,5).toUpperCase();  // FF/Opera/Chrome/Webkit    
                }
                if (!ilib.locale) {
                    // IE on Windows
                    var lang = typeof(navigator.browserLanguage) !== 'undefined' ? 
                        navigator.browserLanguage :
                        (typeof(navigator.userLanguage) !== 'undefined' ? 
                            navigator.userLanguage :
                            (typeof(navigator.systemLanguage) !== 'undefined' ?
                                navigator.systemLanguage :
                                undefined));
                    if (typeof(lang) !== 'undefined' && lang) {
                        // for some reason, MS uses lower case region tags
                        ilib.locale = lang.substring(0,3) + lang.substring(3,5).toUpperCase();
                    }
                }
                break;
    		case 'webos':
                // webOS
                if (typeof(PalmSystem.locales) !== 'undefined' && 
                		typeof(PalmSystem.locales.UI) != 'undefined' && 
                		PalmSystem.locales.UI.length > 0) {
                    ilib.locale = PalmSystem.locales.UI;
                } else if (typeof(PalmSystem.locale) !== 'undefined') {
                	ilib.locale = PalmSystem.locale;
                }
    			break;
    		case 'rhino':
                if (typeof(environment) !== 'undefined' && environment.user && typeof(environment.user.language) === 'string' && environment.user.language.length > 0) {
                	// running under plain rhino
                    ilib.locale = environment.user.language;
                    if (typeof(environment.user.country) === 'string' && environment.user.country.length > 0) {
                        ilib.locale += '-' + environment.user.country;
                    }
                }
                break;
    		case "trireme":
            	// under trireme on rhino emulating nodejs
            	var lang = process.env.LANG || process.env.LANGUAGE || process.env.LC_ALL;
                // the LANG variable on unix is in the form "lang_REGION.CHARSET"
                // where language and region are the correct ISO codes separated by
                // an underscore. This translate it back to the BCP-47 form.
                if (lang && typeof(lang) !== 'undefined') {
                    ilib.locale = lang.substring(0,2).toLowerCase() + '-' + lang.substring(3,5).toUpperCase();
                }
            	break;
    		case 'nodejs':
                // running under nodejs
                var lang = process.env.LANG || process.env.LC_ALL;
                // the LANG variable on unix is in the form "lang_REGION.CHARSET"
                // where language and region are the correct ISO codes separated by
                // an underscore. This translate it back to the BCP-47 form.
                if (lang && typeof(lang) !== 'undefined') {
                    ilib.locale = lang.substring(0,2).toLowerCase() + '-' + lang.substring(3,5).toUpperCase();
                }
    			break;
    		case 'qt':
            	// running in the Javascript engine under Qt/QML
            	var locobj = Qt.locale();
            	var lang = locobj.name && locobj.name.replace("_", "-") || "en-US";
    			break;
    	}
        ilib.locale = typeof(ilib.locale) === 'string' && ilib.locale ? ilib.locale : 'en-US';
        if (ilib.locale === "en") {
        	ilib.locale = "en-US"; // hack to get various platforms working correctly
        }
    }
    return ilib.locale;
};

/**
 * Sets the default time zone for all of ilib. This time zone will be used when
 * no explicit time zone is passed to any ilib class. If the default time zone
 * is not set, ilib will attempt to use the time zone of the
 * environment it is running in, if it can find that. If not, it will
 * default to the the UTC zone "Etc/UTC".<p>
 * 
 * 
 * @static
 * @param {string} tz the name of the time zone to set as the default time zone
 */
ilib.setTimeZone = function (tz) {
    ilib.tz = tz || ilib.tz;
};

/**
 * Return the default time zone for all of ilib if one has been set. This 
 * time zone will be used when no explicit time zone is passed to any ilib 
 * class. If the default time zone
 * is not set, ilib will attempt to use the locale of the
 * environment it is running in, if it can find that. If not, it will
 * default to the the zone "local".<p>
 * 
 * 
 * @static
 * @return {string} the default time zone for ilib
 */
ilib.getTimeZone = function() {
    if (typeof(ilib.tz) === 'undefined') {
        if (typeof(navigator) !== 'undefined' && typeof(navigator.timezone) !== 'undefined') {
            // running in a browser
            if (navigator.timezone.length > 0) {
                ilib.tz = navigator.timezone;
            }
        } else if (typeof(PalmSystem) !== 'undefined' && typeof(PalmSystem.timezone) !== 'undefined') {
            // running in webkit on webOS
            if (PalmSystem.timezone.length > 0) {
                ilib.tz = PalmSystem.timezone;
            }
        } else if (typeof(environment) !== 'undefined' && typeof(environment.user) !== 'undefined') {
            // running under rhino
            if (typeof(environment.user.timezone) !== 'undefined' && environment.user.timezone.length > 0) {
                ilib.tz = environment.user.timezone;
            }
        } else if (typeof(process) !== 'undefined' && typeof(process.env) !== 'undefined') {
            // running in nodejs
            if (process.env.TZ && typeof(process.env.TZ) !== "undefined") {
                ilib.tz = process.env.TZ;
            }
        }
        
        ilib.tz = ilib.tz || "local"; 
    }

    return ilib.tz;
};

/**
 * @class
 * Defines the interface for the loader class for ilib. The main method of the
 * loader object is loadFiles(), which loads a set of requested locale data files
 * from where-ever it is stored.
 * @interface
 */
ilib.Loader = function() {};

/**
 * Load a set of files from where-ever it is stored.<p>
 * 
 * This is the main function define a callback function for loading missing locale 
 * data or resources.
 * If this copy of ilib is assembled without including the required locale data
 * or resources, then that data can be lazy loaded dynamically when it is 
 * needed by calling this method. Each ilib class will first
 * check for the existence of data under ilib.data, and if it is not there, 
 * it will attempt to load it by calling this method of the laoder, and then place
 * it there.<p>
 * 
 * Suggested implementations of this method might load files 
 * directly from disk under nodejs or rhino, or within web pages, to load 
 * files from the server with XHR calls.<p>
 * 
 * The first parameter to this method, paths, is an array of relative paths within 
 * the ilib dir structure for the 
 * requested data. These paths will already have the locale spec integrated 
 * into them, so no further tweaking needs to happen to load the data. Simply
 * load the named files. The second
 * parameter tells the loader whether to load the files synchronously or asynchronously.
 * If the sync parameters is false, then the onLoad function must also be specified.
 * The third parameter gives extra parameters to the loader passed from the calling
 * code. This may contain any property/value pairs.  The last parameter, callback,
 * is a callback function to call when all of the data is finishing loading. Make
 * sure to call the callback with the context of "this" so that the caller has their 
 * context back again.<p>
 * 
 * The loader function must be able to operate either synchronously or asychronously. 
 * If the loader function is called with an undefined callback function, it is
 * expected to load the data synchronously, convert it to javascript
 * objects, and return the array of json objects as the return value of the 
 * function. If the loader 
 * function is called with a callback function, it may load the data 
 * synchronously or asynchronously (doesn't matter which) as long as it calls
 * the callback function with the data converted to a javascript objects
 * when it becomes available. If a particular file could not be loaded, the 
 * loader function should put undefined into the corresponding entry in the
 * results array. 
 * Note that it is important that all the data is loaded before the callback
 * is called.<p>
 * 
 * An example implementation for nodejs might be:
 * 
 * <pre>
 * var fs = require("fs");
 * 
 * var myLoader = function() {};
 * myLoader.prototype = new Loader();
 * myLoader.prototype.constructor = myLoader;
 * myLoader.prototype.loadFiles = function(paths, sync, params, callback) {
 *    if (sync) {
 *        var ret = [];
 *        // synchronous load -- just return the result
 *        paths.forEach(function (path) {
 *            var json = fs.readFileSync(path, "utf-8");
 *            ret.push(json ? JSON.parse(json) : undefined);
 *        });
 *        
 *        return ret;
 *    }
 *    this.callback = callback;
 *
 *    // asynchronous
 *    this.results = [];
 *    this._loadFilesAsync(paths);
 * }
 * myLoader.prototype._loadFilesAsync = function (paths) {
 *    if (paths.length > 0) {
 *        var file = paths.shift();
 *        fs.readFile(file, "utf-8", function(err, json) {
 *            this.results.push(err ? undefined : JSON.parse(json));
 *            // call self recursively so that the callback is only called at the end
 *            // when all the files are loaded sequentially
 *            if (paths.length > 0) {
 *                this._loadFilesAsync(paths);
 *            } else {
 *                this.callback(this.results);
 *            }
 *        });
 *     }
 * }
 * 
 * // bind to "this" so that "this" is relative to your own instance
 * ilib.setLoaderCallback(new myLoader());
 * </pre>

 * @param {Array.<string>} paths An array of paths to load from wherever the files are stored 
 * @param {Boolean} sync if true, load the files synchronously, and false means asynchronously
 * @param {Object} params an object with any extra parameters for the loader. These can be 
 * anything. The caller of the ilib class passes these parameters in. Presumably, the code that
 * calls ilib and the code that provides the loader are together and can have a private 
 * agreement between them about what the parameters should contain.
 * @param {function(Object)} callback function to call when the files are all loaded. The 
 * parameter of the callback function is the contents of the files.
 */
ilib.Loader.prototype.loadFiles = function (paths, sync, params, callback) {};

/**
 * Return all files available for loading using this loader instance.
 * This method returns an object where the properties are the paths to
 * directories where files are loaded from and the values are an array
 * of strings containing the relative paths under the directory of each
 * file that can be loaded.<p>
 * 
 * Example:
 *  <pre>
 *  {
 *      "/usr/share/javascript/ilib/locale": [
 *          "dateformats.json",
 *          "aa/dateformats.json",
 *          "af/dateformats.json",
 *          "agq/dateformats.json",
 *          "ak/dateformats.json",
 *          ...
 *          "zxx/dateformats.json"
 *      ]
 *  }
 *  </pre>
 * @returns {Object} a hash containing directory names and
 * paths to file that can be loaded by this loader 
 */
ilib.Loader.prototype.listAvailableFiles = function() {};

/**
 * Return true if the file in the named path is available for loading using
 * this loader. The path may be given as an absolute path, in which case
 * only that file is checked, or as a relative path, in which case, the
 * relative path may appear underneath any of the directories that the loader
 * knows about.
 * @returns {boolean} true if the file in the named path is available for loading, and
 * false otherwise
 */
ilib.Loader.prototype.isAvailable = function(path) {};

/**
 * Set the custom loader used to load ilib's locale data in your environment. 
 * The instance passed in must implement the Loader interface. See the
 * Loader class documentation for more information about loaders. 
 * 
 * @static
 * @param {ilib.Loader} loader class to call to access the requested data.
 * @return {boolean} true if the loader was installed correctly, or false
 * if not
 */
ilib.setLoaderCallback = function(loader) {
    // only a basic check
    if ((typeof(loader) === 'object' && typeof(loader.loadFiles) === 'function') || 
            typeof(loader) === 'function' || typeof(loader) === 'undefined') {
        //console.log("setting callback loader to " + (loader ? loader.name : "undefined"));
        ilib._load = loader;
        return true;
    }
    return false;
};

/**
 * Return the custom Loader instance currently in use with this instance 
 * of ilib. If there is no loader, this method returns undefined.
 * 
 * @protected
 * @static
 * @return {ilib.Loader|undefined} the loader instance currently in use, or 
 * undefined if there is no such loader
 */
ilib.getLoader = function() {
	return ilib._load;
};

/**
 * Test whether an object is an javascript array. 
 * 
 * @static
 * @param {*} object The object to test
 * @return {boolean} return true if the object is an array
 * and false otherwise
 */
ilib.isArray = function(object) {
	if (typeof(object) === 'object') {
		return Object.prototype.toString.call(object) === '[object Array]';
	}
	return false; 
};

/**
 * Extend object1 by mixing in everything from object2 into it. The objects
 * are deeply extended, meaning that this method recursively descends the
 * tree in the objects and mixes them in at each level. Arrays are extended
 * by concatenating the elements of object2 onto those of object1.  
 * 
 * @static
 * @param {Object} object1 the target object to extend
 * @param {Object=} object2 the object to mix in to object1
 * @return {Object} returns object1
 */
ilib.extend = function (object1, object2) {
	var prop = undefined;
	if (object2) {
		for (prop in object2) {
			// don't extend object with undefined or functions
			if (prop && typeof(object2[prop]) !== 'undefined' && typeof(object2[prop]) !== "function") {
				if (ilib.isArray(object1[prop]) && ilib.isArray(object2[prop])) {
					//console.log("Merging array prop " + prop);
					object1[prop] = object1[prop].concat(object2[prop]);
				} else if (typeof(object1[prop]) === 'object' && typeof(object2[prop]) === 'object') {
					//console.log("Merging object prop " + prop);
					if (prop !== "ilib") {
						object1[prop] = ilib.extend(object1[prop], object2[prop]);
					}
				} else {
					//console.log("Copying prop " + prop);
					// for debugging. Used to determine whether or not json files are overriding their parents unnecessarily
					object1[prop] = object2[prop];
				}
			}
		}
	}
	return object1;
};

ilib.extend2 = function (object1, object2) {
	var prop = undefined;
	if (object2) {
		for (prop in object2) {
			// don't extend object with undefined or functions
			if (prop && typeof(object2[prop]) !== 'undefined') {
				if (ilib.isArray(object1[prop]) && ilib.isArray(object2[prop])) {
					//console.log("Merging array prop " + prop);
					object1[prop] = object1[prop].concat(object2[prop]);
				} else if (typeof(object1[prop]) === 'object' && typeof(object2[prop]) === 'object') {
					//console.log("Merging object prop " + prop);
					if (prop !== "ilib") {
						object1[prop] = ilib.extend2(object1[prop], object2[prop]);
					}
				} else {
					//console.log("Copying prop " + prop);
					// for debugging. Used to determine whether or not json files are overriding their parents unnecessarily
					object1[prop] = object2[prop];
				}
			}
		}
	}
	return object1;
};

/**
 * If Function.prototype.bind does not exist in this JS engine, this
 * function reimplements it in terms of older JS functions.
 * bind() doesn't exist in many older browsers.
 * 
 * @static
 * @param {Object} scope object that the method should operate on
 * @param {function(...)} method method to call
 * @return {function(...)|undefined} function that calls the given method 
 * in the given scope with all of its arguments properly attached, or
 * undefined if there was a problem with the arguments
 */
ilib.bind = function(scope, method/*, bound arguments*/){
	if (!scope || !method) {
		return undefined;
	}
	
	/** @protected 
	 * @param {Arguments} inArrayLike
	 * @param {number=} inOffset
	 */
	function cloneArray(inArrayLike, inOffset) {
		var arr = [];
		for(var i = inOffset || 0, l = inArrayLike.length; i<l; i++){
			arr.push(inArrayLike[i]);
		}
		return arr;
	}

	if (typeof(method) === 'function') {
		var func, args = cloneArray(arguments, 2);
		if (typeof(method.bind) === 'function') {
			func = method.bind.apply(method, [scope].concat(args));
		} else {
			func = function() {
				var nargs = cloneArray(arguments);
				// invoke with collected args
				return method.apply(scope, args.concat(nargs));
			};
		}
		return func;
	}
	return undefined;
};

/**
 * @private
 */
ilib._dyncode = false;

/**
 * Return true if this copy of ilib is using dynamically loaded code. It returns
 * false for pre-assembled code.
 * 
 * @static
 * @return {boolean} true if this ilib uses dynamically loaded code, and false otherwise
 */
ilib.isDynCode = function() {
	return ilib._dyncode;
};

/**
 * @private
 */
ilib._dyndata = false;

/**
 * Return true if this copy of ilib is using dynamically loaded locale data. It returns
 * false for pre-assembled data.
 * 
 * @static
 * @return {boolean} true if this ilib uses dynamically loaded locale data, and false otherwise
 */
ilib.isDynData = function() {
	return ilib._dyndata;
};

ilib._loadtime = new Date().getTime();
