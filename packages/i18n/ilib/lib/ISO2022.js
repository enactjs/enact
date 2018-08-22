/*
 * ISO2022.js - Implement the various ISO-2022 style mappings
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

// !depends ilib.js Charmap.js

var Charset = require("./Charset.js");
var Charmap = require("./Charmap.js");

/**
 * @class
 * Create a new ISO-2022 mapping instance
 * 
 * @constructor
 */
var ISO2022 = function (options) {
    // first, load in all the tables we need for this version of 2022
    options = options || {sync: true};
    var name = options.name || "ISO-2022-JP";
    var sync = typeof(options.sync) === "boolean" ? options.sync : true;
    
    if (typeof(options.charset) === "object" && options.charset instanceof Charset) {
        this.charset = options.charset;
        if (typeof(options.onLoad) === "function") {
            options.onLoad(this);
        }
    } else {
        new Charset({
            name: name,
            sync: sync,
            loadParams: options.loadParams,
            onLoad: ilib.bind(this, function(cs) {
                this.charset = cs;
                if (typeof(options.onLoad) === "function") {
                    options.onLoad(this);
                }
            })
        });
    }
};

ISO2022.prototype = new Charmap({noinstance: true});
ISO2022.prototype.parent = Charmap;
ISO2022.prototype.constructor = ISO2022;

ISO2022.prototype.mapToUnicode = function (bytes) {
	// TODO: implement ISO 2022 mappings
};
	
ISO2022.prototype.mapToNative = function(str) {
	// TODO: implement ISO 2022 mappings
};

/*
Still in development

Charmap._algorithms["ISO-2022-JP"] = Charmap.ISO2022;
Charmap._algorithms["ISO-2022-JP-1"] = Charmap.ISO2022;
Charmap._algorithms["ISO-2022-JP-2"] = Charmap.ISO2022;
Charmap._algorithms["ISO-2022-JP-3"] = Charmap.ISO2022;
Charmap._algorithms["ISO-2022-JP-2004"] = Charmap.ISO2022;
Charmap._algorithms["ISO-2022-CN"] = Charmap.ISO2022;
Charmap._algorithms["ISO-2022-CN-EXT"] = Charmap.ISO2022;
Charmap._algorithms["ISO-2022-KR"] = Charmap.ISO2022;
*/

module.exports = ISO2022;