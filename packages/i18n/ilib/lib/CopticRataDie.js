/*
 * CopticRataDie.js - Represent an RD date in the Coptic calendar
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
CopticCal.js 
JSUtils.js
EthiopicRataDie.js
*/

var ilib = require("./ilib.js");
var JSUtils = require("./JSUtils.js");
var CopticCal = require("./CopticCal.js");
var EthiopicRataDie = require("./EthiopicRataDie.js");

/**
 * @class
 * Construct a new Coptic RD date number object. The constructor parameters can 
 * contain any of the following properties:
 * 
 * <ul>
 * <li><i>unixtime<i> - sets the time of this instance according to the given 
 * unix time. Unix time is the number of milliseconds since midnight on Jan 1, 1970.
 * 
 * <li><i>julianday</i> - sets the time of this instance according to the given
 * Julian Day instance or the Julian Day given as a float
 * 
 * <li><i>year</i> - any integer, including 0
 * 
 * <li><i>month</i> - 1 to 13, where 1 means Thoout, 2 means Paope, etc., and 13 means Epagomene
 * 
 * <li><i>day</i> - 1 to 30
 * 
 * <li><i>hour</i> - 0 to 23. A formatter is used to display 12 hour clocks, but this representation 
 * is always done with an unambiguous 24 hour representation
 * 
 * <li><i>minute</i> - 0 to 59
 * 
 * <li><i>second</i> - 0 to 59
 * 
 * <li><i>millisecond</i> - 0 to 999
 * 
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
 * </ul>
 *
 * If the constructor is called with another Coptic date instance instead of
 * a parameter block, the other instance acts as a parameter block and its
 * settings are copied into the current instance.<p>
 * 
 * If the constructor is called with no arguments at all or if none of the 
 * properties listed above are present, then the RD is calculate based on 
 * the current date at the time of instantiation. <p>
 * 
 * If any of the properties from <i>year</i> through <i>millisecond</i> are not
 * specified in the params, it is assumed that they have the smallest possible
 * value in the range for the property (zero or one).<p>
 * 
 * 
 * @private
 * @constructor
 * @extends EthiopicRataDie
 * @param {Object=} params parameters that govern the settings and behaviour of this Coptic RD date
 */
var CopticRataDie = function(params) {
	this.cal = params && params.cal || new CopticCal();
	this.rd = undefined;
	/**
	 * The difference between the zero Julian day and the first Coptic date
	 * of Friday, August 29, 284 CE Julian at 7:00am UTC. 
	 * @private
	 * @const
	 * @type number
	 */
	this.epoch = 1825028.5;

	var tmp = {};
	if (params) {
		JSUtils.shallowCopy(params, tmp);
	}
	tmp.cal = this.cal; // override the cal parameter that may be passed in
	EthiopicRataDie.call(this, tmp);
};

CopticRataDie.prototype = new EthiopicRataDie();
CopticRataDie.prototype.parent = EthiopicRataDie;
CopticRataDie.prototype.constructor = CopticRataDie;

module.exports = CopticRataDie;