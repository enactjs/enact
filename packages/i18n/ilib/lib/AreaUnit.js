/*
 * area.js - Unit conversions for Area
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

/*
!depends 
Measurement.js
*/

var Measurement = require("./Measurement.js");

/**
 * @class
 * Create a new area measurement instance.
 * @constructor
 * @extends Measurement
 * @param options {{unit:string,amount:number|string|undefined}} Options controlling 
 * the construction of this instance
 */
var AreaUnit = function (options) {
	this.unit = "square meter";
	this.amount = 0;
	this.aliases = AreaUnit.aliases; // share this table in all instances
	
	if (options) {
		if (typeof(options.unit) !== 'undefined') {
			this.originalUnit = options.unit;
			this.unit = this.aliases[options.unit] || options.unit;
		}
		
		if (typeof(options.amount) === 'object') {
			if (options.amount.getMeasure() === "area") {
				this.amount = AreaUnit.convert(this.unit, options.amount.getUnit(), options.amount.getAmount());
			} else {
				throw "Cannot convert unit " + options.amount.unit + " to area";
			}
		} else if (typeof(options.amount) !== 'undefined') {
			this.amount = parseFloat(options.amount);
		}
	}
	
	if (typeof(AreaUnit.ratios[this.unit]) === 'undefined') {
		throw "Unknown unit: " + options.unit;
	}
};

AreaUnit.prototype = new Measurement();
AreaUnit.prototype.parent = Measurement;
AreaUnit.prototype.constructor = AreaUnit;

AreaUnit.ratios = {
    /*               index		square cm,		square meter,   hectare,   	square km, 	, square inch 	square foot, 		square yard, 	  	  		acre,			square mile			        */
    "square centimeter":[1,   	1,				0.0001,			1e-8,	    1e-10,        0.15500031,	0.00107639104,		0.000119599005,			2.47105381e-8,		3.86102159e-11 		],
    "square meter": 	[2,   	10000,			1,              1e-4,       1e-6,         1550,    	 	10.7639,    	  	1.19599,   				0.000247105,		3.861e-7     	    ],
    "hectare":      	[3,	 	100000000,  	10000,          1,          0.01,         1.55e+7, 	  	107639,     	 	11959.9,   				2.47105	,			0.00386102    	    ],
    "square km":    	[4,	  	10000000000, 	1e+6,          	100,        1,	          1.55e+9, 	  	1.076e+7,   	 	1.196e+6,  				247.105 ,   		0.386102     	    ],
    "square inch":  	[5,	  	6.4516,			0.00064516,     6.4516e-8,  6.4516e-10,   1,			0.000771605,	  	0.0007716051, 			1.5942e-7,			2.491e-10    	    ],
    "square foot":  	[6,		929.0304,		0.092903,       9.2903e-6,  9.2903e-8,    144,			1,          	  	0.111111,  				2.2957e-5,			3.587e-8    		],
    "square yard":  	[7,		8361.2736,		0.836127,       8.3613e-5,  8.3613e-7,    1296,    	  	9,          	  	1,         				0.000206612,		3.2283e-7    	    ],
    "acre":         	[8,		40468564.2,		4046.86,        0.404686,   0.00404686,   6.273e+6,	  	43560,      	  	4840,      				1,		    		0.0015625    	    ],
    "square mile":  	[9,	   	2.58998811e+10,	2.59e+6,        258.999,    2.58999,      4.014e+9,	 	2.788e+7,   	  	3.098e+6,  				640,     			1   	     		]
}

/**
 * Return the type of this measurement. Examples are "mass",
 * "length", "speed", etc. Measurements can only be converted
 * to measurements of the same type.<p>
 * 
 * The type of the units is determined automatically from the 
 * units. For example, the unit "grams" is type "mass". Use the 
 * static call {@link Measurement.getAvailableUnits}
 * to find out what units this version of ilib supports.
 *  
 * @return {string} the name of the type of this measurement
 */
AreaUnit.prototype.getMeasure = function() {
	return "area";
}; 

/**
 * Return a new measurement instance that is converted to a new
 * measurement unit. Measurements can only be converted
 * to measurements of the same type.<p>
 *  
 * @param {string} to The name of the units to convert to
 * @return {Measurement|undefined} the converted measurement
 * or undefined if the requested units are for a different
 * measurement type
 * 
 */
AreaUnit.prototype.convert = function(to) {
	if (!to || typeof(AreaUnit.ratios[this.normalizeUnits(to)]) === 'undefined') {
		return undefined;
	}
	return new AreaUnit({
		unit: to, 
		amount: this
	});
};

AreaUnit.aliases = {
    "square centimeter":"square centimeter",
    "square cm":"square centimeter",
    "sq cm":"square centimeter",
    "Square Cm":"square centimeter",
    "square Centimeters":"square centimeter",
    "square Centimeter":"square centimeter",
    "square Centimetre":"square centimeter",
    "square Centimetres":"square centimeter",
    "square centimeters":"square centimeter",
    "Square km": "square km",
	"Square kilometre":"square km",
	"square kilometer":"square km",
	"square kilometre":"square km",
	"square kilometers":"square km",
	"square kilometres":"square km",
    "square km":"square km",
	"sq km":"square km",
	"km2":"square km",
	"Hectare":"hectare",
	"hectare":"hectare",
	"ha":"hectare",
	"Square meter": "square meter",
	"Square meters":"square meter",
	"square meter": "square meter",
	"square meters":"square meter",
	"Square metre": "square meter",
	"Square metres":"square meter",
	"square metres": "square meter",
	"Square Metres":"square meter",
	"sqm":"square meter",
	"m2": "square meter",
	"Square mile":"square mile",
	"Square miles":"square mile",
	"square mile":"square mile",
	"square miles":"square mile",
	"square mi":"square mile",
	"Square mi":"square mile",
	"sq mi":"square mile",
	"mi2":"square mile",
	"Acre": "acre",
	"acre": "acre",
	"Acres":"acre",
	"acres":"acre",
	"Square yard": "square yard",
	"Square yards":"square yard",
	"square yard": "square yard",
	"square yards":"square yard",
	"yd2":"square yard",
	"Square foot": "square foot",
	"square foot": "square foot",
	"Square feet": "square foot",
	"Square Feet": "square foot",
	"sq ft":"square foot",
	"ft2":"square foot",
	"Square inch":"square inch",
	"square inch":"square inch",
	"Square inches":"square inch",
	"square inches":"square inch",
	"in2":"square inch"
};

/**
 * Convert a Area to another measure.
 * @static
 * @param to {string} unit to convert to
 * @param from {string} unit to convert from
 * @param area {number} amount to be convert
 * @returns {number|undefined} the converted amount
 */
AreaUnit.convert = function(to, from, area) {
    from = AreaUnit.aliases[from] || from;
    to = AreaUnit.aliases[to] || to;
	var fromRow = AreaUnit.ratios[from];
	var toRow = AreaUnit.ratios[to];
	if (typeof(from) === 'undefined' || typeof(to) === 'undefined') {
		return undefined;
	}
	return area* fromRow[toRow[0]];
};

/**
 * @private
 * @static
 */
AreaUnit.getMeasures = function () {
	var ret = [];
	for (var m in AreaUnit.ratios) {
		ret.push(m);
	}
	return ret;
};

AreaUnit.metricSystem = {
	"square centimeter" : 1,
	"square meter" : 2,
	"hectare" : 3,
	"square km" : 4
};
AreaUnit.imperialSystem = {
	"square inch" : 5,
	"square foot" : 6,
	"square yard" : 7,
	"acre" : 8,
	"square mile" : 9
};
AreaUnit.uscustomarySystem = {
	"square inch" : 5,
	"square foot" : 6,
	"square yard" : 7,
	"acre" : 8,
	"square mile" : 9
};

AreaUnit.metricToUScustomary = {
	"square centimeter" : "square inch",
	"square meter" : "square yard",
	"hectare" : "acre",
	"square km" : "square mile"
};
AreaUnit.usCustomaryToMetric = {
	"square inch" : "square centimeter",
	"square foot" : "square meter",
	"square yard" : "square meter",
	"acre" : "hectare",
	"square mile" : "square km"
};


/**
 * Scale the measurement unit to an acceptable level. The scaling
 * happens so that the integer part of the amount is as small as
 * possible without being below zero. This will result in the 
 * largest units that can represent this measurement without
 * fractions. Measurements can only be scaled to other measurements 
 * of the same type.
 * 
 * @param {string=} measurementsystem system to use (uscustomary|imperial|metric),
 * or undefined if the system can be inferred from the current measure
 * @return {Measurement} a new instance that is scaled to the 
 * right level
 */
AreaUnit.prototype.scale = function(measurementsystem) {
    var fromRow = AreaUnit.ratios[this.unit];
    var mSystem;

    if (measurementsystem === "metric" || (typeof(measurementsystem) === 'undefined'
        && typeof(AreaUnit.metricSystem[this.unit]) !== 'undefined')) {
        mSystem = AreaUnit.metricSystem;
    } else if (measurementsystem === "uscustomary" || (typeof(measurementsystem) === 'undefined'
        && typeof(AreaUnit.uscustomarySystem[this.unit]) !== 'undefined')) {
        mSystem = AreaUnit.uscustomarySystem;
    } else if (measurementsystem === "imperial" || (typeof(measurementsystem) === 'undefined'
        && typeof(AreaUnit.imperialSystem[this.unit]) !== 'undefined')) {
        mSystem = AreaUnit.imperialSystem;
    }

    var area = this.amount;
    var munit = this.unit;

    area = 18446744073709551999;
    
    for (var m in mSystem) {
        var tmp = this.amount * fromRow[mSystem[m]];
        if (tmp >= 1 && tmp < area) {
	        area = tmp;
	        munit = m;
        }
    }

    return new AreaUnit({
        unit: munit,
        amount: area
    });
};

/**
 * Localize the measurement to the commonly used measurement in that locale. For example
 * If a user's locale is "en-US" and the measurement is given as "60 kmh", 
 * the formatted number should be automatically converted to the most appropriate 
 * measure in the other system, in this case, mph. The formatted result should
 * appear as "37.3 mph". 
 * 
 * @abstract
 * @param {string} locale current locale string
 * @returns {Measurement} a new instance that is converted to locale
 */
AreaUnit.prototype.localize = function(locale) {
    var to;
    if (locale === "en-US" || locale === "en-GB") {
        to = AreaUnit.metricToUScustomary[this.unit] || this.unit;
    } else {
        to = AreaUnit.usCustomaryToMetric[this.unit] || this.unit;
    }
    return new AreaUnit({
        unit: to,
        amount: this
    });
};


//register with the factory method
Measurement._constructors["area"] = AreaUnit;

module.exports = AreaUnit;