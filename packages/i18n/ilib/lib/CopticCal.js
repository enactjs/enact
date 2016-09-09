/*
 * coptic.js - Represent a Coptic calendar object.
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


/* !depends ilib.js Calendar.js Locale.js Utils.js EthiopicCal.js */

var ilib = require("./ilib.js");
var Utils = require("./Utils.js");
var Locale = require("./Locale.js");
var Calendar = require("./Calendar.js");
var EthiopicCal = require("./EthiopicCal.js");

/**
 * @class
 * Construct a new Coptic calendar object. This class encodes information about
 * a Coptic calendar.<p>
 * 
 * 
 * @constructor
 * @extends EthiopicCal
 */
var CopticCal = function() {
	this.type = "coptic";
};

CopticCal.prototype = new EthiopicCal();
CopticCal.prototype.parent = EthiopicCal;
CopticCal.prototype.constructor = CopticCal;


/* register this calendar for the factory method */
Calendar._constructors["coptic"] = CopticCal;

module.exports = CopticCal;