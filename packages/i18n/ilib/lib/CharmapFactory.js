/*
 * CharmapFactory.js - Factory class to create the right subclasses of a charmap for any 
 * given chararacter set.
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

/* !depends ilib.js JSUtils.js Charmap.js CharmapTable.js */
// !data charset/ISO-8859-15 charmaps/ISO-8859-15

var ilib = require("./ilib.js");
var JSUtils = require("./JSUtils.js");

var Charset = require("./Charset.js");
var Charmap = require("./Charmap.js");

/**
 * Factory method to create a new instance of a character set mapping (charmap) 
 * subclass that is appropriate for the requested charset. Charmap instances map strings to 
 * other character sets. The charsets can be of any type, single-byte, multi-byte,
 * shifting, etc. <p>
 * 
 * All mappings are done to or from Unicode in the UTF-16 encoding, which is the base
 * character set and encoding used by Javascript itself. In order to convert 
 * between two non-Unicode character sets, you must chain two charmap instances together 
 * to first map to Unicode and then back to the second charset. <p>
 * 
 * The options parameter controls which mapping is constructed and its behaviours. The 
 * current list of supported options are:
 * 
 * <ul>
 * <li><i>name</i> - the name of the native charset to map to or from. This can be 
 * given as an {@link Charset} instance or as a string that contains any commonly used name 
 * for the character set, which is normalized to a standard IANA name. 
 * If a name is not given, this class will default to the Western European character 
 * set called ISO-8859-15.
 * 
 * <li><i>missing</i> - specify what to do if a mapping is missing for a particular
 * character. For example, if you are mapping Unicode characters to a particular native
 * character set that does not support particular Unicode characters, the mapper will
 * follow the behaviour specified in this property. Valid values are:
 * <ul>
 * <li><i>skip</i> - skip any characters that do not exist in the target charset
 * <li><i>placeholder</i> - put a static placeholder character in the output string 
 * wherever there is an unknown character in the input string. Use the <i>placeholder</i> 
 * parameter to specify which character to use in this case
 * <li><i>escape</i> - use an escape sequence to represent the unknown character 
 * </ul>
 * The default value for the missing property if not otherwise specified is "escape"
 * so that information is not lost.
 * 
 * <li><i>placeholder</i> - specify the placeholder character to use when the 
 * mapper cannot map a particular input character to the output string. If this
 * option is not specified, then the '?' (question mark) character is used where 
 * possible.
 * 
 * <li><i>escapeStyle</i> - what style of escape sequences should be used to
 * escape unknown characters in the input when mapping to native, and what
 * style of espcae sequences should be parsed when mapping to Unicode. Valid 
 * values are:
 * <ul>
 * <li><i>html</i> - Escape the characters as HTML entities. This would use
 * the standard HTML 5.0 (or later) entity names where possible, and numeric
 * entities in all other cases. Eg. an "e" with an acute accent would be 
 * "&#x00E9;"
 * <li><i>js</i> - Use the Javascript escape style. Eg. an "e" with an acute
 * accent would be "\u00E9". This can also be specified as "c#" as
 * it uses a similar escape syntax.
 * <li><i>c</i> - Use the C/C++ escape style, which is similar to the the
 * Javascript style, but uses an "x" in place of the "u". Eg. an "e" with an 
 * acute accent would be "\x00E9". This can also be specified as "c++".
 * <li><i>java</i> - Use the Java escape style. This is very similar to the
 * the Javascript style, but the backslash has to be escaped twice. Eg. an
 * "e" with an acute accent would be "\\u00E9". This can also be specified
 * as "ruby", as Ruby uses a similar escape syntax with double backslashes.
 * <li><i>perl</i> - Use the Perl escape style. Eg. an "e" with an acute
 * accent would be "\N{U+00E9}"
 * </ul>
 * The default if this style is not specified is "js" for Javascript.
 * 
 * <li><i>onLoad</i> - a callback function to call when this object is fully 
 * loaded. When the onLoad option is given, this class will attempt to
 * load any missing data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the 
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two.
 * 
 * <li><i>sync</i> - tell whether to load any missing data synchronously or 
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, because the instance returned from this constructor will
 * not be usable for a while.
 *
 * <li><i>loadParams</i> - an object containing parameters to pass to the 
 * loader callback function when data is missing. The parameters are not
 * interpretted or modified in any way. They are simply passed along. The object 
 * may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
 * </ul>
 * 
 * If this copy of ilib is pre-assembled and all the data is already available, 
 * or if the data was already previously loaded, then this constructor will call
 * the onLoad callback immediately when the initialization is done. 
 * If the onLoad option is not given, this class will only attempt to load any
 * missing data synchronously.
 * 
 * @static
 * @param {Object=} options options controlling the construction of this instance, or
 * undefined to use the default options
 * @return {Charmap|undefined} an instance of a character set mapping class appropriate for
 * the requested charset, or undefined if no mapper could be found that supports the
 * requested charset
 */
var CharmapFactory = function(options) {
	var charsetName = (options && options.name) || "ISO-8859-15";
	var sync = true;
	
	// console.log("CharmapFactory: called with options: " + JSON.stringify(options));
	
	if (options) {
		if (typeof(options.sync) === 'boolean') {
			sync = options.sync;
		}
	} else {
	    options = {sync: true};
	}

	var instance;
	
	new Charset({
		name: charsetName,
		sync: sync,
		loadParams: options.loadParams,
		onLoad: function (charset) {
			// name will be normalized already
			var cons, name = charset.getName();
	
			// console.log("CharmapFactory: normalized charset name: " + name);
			
			if (!Charmap._algorithms[name] && ilib.isDynCode()) {
				// console.log("CharmapFactory: isDynCode. Doing require");
				var entry = CharmapFactory._dynMap[name] || "CharmapTable";
				cons = Charmap._algorithms[name] = require("./" + entry + ".js");
			}
			
			if (!cons) {
				cons = Charmap._algorithms[name] || Charmap._algorithms["CharmapTable"];
			}
			
			// console.log("CharmapFactory: cons is "); console.dir(cons);
			
			// pass the same options through to the constructor so the subclass
			// has the ability to do something with if it needs to
			instance = cons && new cons(JSUtils.merge(options || {}, {charset: charset}));
		}
	});
	
	return instance;
};


/**
 * Map standardized charset names to classes to initialize in the dynamic code model.
 * These classes implement algorithmic mappings instead of table-based ones.
 * TODO: Need to figure out some way that this doesn't have to be updated by hand.
 * @private
 */
CharmapFactory._dynMap = {
	"UTF-8":      "UTF8",
	"UTF-16":     "UTF16LE",
	"UTF-16LE":   "UTF16LE",
	"UTF-16BE":   "UTF16BE",
	"US-ASCII":   "Charmap"
	/*
	not implemented yet
	"ISO-2022-JP": "ISO2022",
	"ISO-2022-JP-1": "ISO2022",
	"ISO-2022-JP-2": "ISO2022",
	"ISO-2022-JP-3": "ISO2022",
	"ISO-2022-JP-2004": "ISO2022",
	"ISO-2022-CN": "ISO2022",
	"ISO-2022-CN-EXT": "ISO2022",
	"ISO-2022-KR": "ISO2022"
	*/
};

module.exports = CharmapFactory;