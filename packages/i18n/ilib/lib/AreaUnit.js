/*
 * AreaUnit.js - Unit conversions for area
 *
 * Copyright © 2014-2015, 2018 JEDLSoft
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
    this.unit = "square-meter";
    this.amount = 0;

    this.ratios = AreaUnit.ratios;
    this.aliases = AreaUnit.aliases;
    this.aliasesLower = AreaUnit.aliasesLower;
    this.systems = AreaUnit.systems;

    this.parent(options);
};

AreaUnit.prototype = new Measurement();
AreaUnit.prototype.parent = Measurement;
AreaUnit.prototype.constructor = AreaUnit;

AreaUnit.ratios = {
    /*               index		square cm,		square meter,   hectare,   	square km, 	, square inch 	square foot, 		square yard, 	  	  	acre,			    square mile			        */
    "square-centimeter":[1,   	1,				0.0001,			1e-8,	    1e-10,        0.15500031,	0.00107639104,		0.000119599005,			2.47105381e-8,		3.86102159e-11 		],
    "square-meter": 	[2,   	10000,			1,              1e-4,       1e-6,         1550,    	 	10.7639,    	  	1.19599,   				0.000247105,		3.861e-7     	    ],
    "hectare":      	[3,	 	100000000,  	10000,          1,          0.01,         1.55e+7, 	  	107639,     	 	11959.9,   				2.47105	,			0.00386102    	    ],
    "square-kilometer": [4,	  	10000000000, 	1e+6,          	100,        1,	          1.55e+9, 	  	1.076e+7,   	 	1.196e+6,  				247.105 ,   		0.386102     	    ],
    "square-inch":  	[5,	  	6.4516,			0.00064516,     6.4516e-8,  6.4516e-10,   1,			0.0069444444444444, 0.0007716051, 			1.5942e-7,			2.491e-10    	    ],
    "square-foot":  	[6,		929.0304,		0.092903,       9.2903e-6,  9.2903e-8,    144,			1,          	  	0.111111,  				2.2957e-5,			3.587e-8    		],
    "square-yard":  	[7,		8361.2736,		0.836127,       8.3613e-5,  8.3613e-7,    1296,    	  	9,          	  	1,         				0.000206612,		3.2283e-7    	    ],
    "acre":         	[8,		40468564.2,		4046.86,        0.404686,   0.00404686,   6.273e+6,	  	43560,      	  	4840,      				1,		    		0.0015625    	    ],
    "square-mile":  	[9,	   	2.58998811e+10,	2.59e+6,        258.999,    2.58999,      4.014e+9,	 	2.788e+7,   	  	3.098e+6,  				640,     			1   	     		]
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
 * Return a new instance of this type of measurement.
 * 
 * @param {Object} params parameters to the constructor
 * @return {Measurement} a measurement subclass instance
 */
AreaUnit.prototype.newUnit = function(params) {
    return new AreaUnit(params);
};

AreaUnit.aliases = {
    "square centimeter":"square-centimeter",
    "square centimeters":"square-centimeter",
    "square centimetre":"square-centimeter",
    "square centimetres":"square-centimeter",
    "sq centimeter":"square-centimeter",
    "sq centimeters":"square-centimeter",
    "sq centimetre":"square-centimeter",
    "sq centimetres":"square-centimeter",
    "square cm":"square-centimeter",
    "sq cm":"square-centimeter",
    "cm2":"square-centimeter",
    "cm²":"square-centimeter",
    "square kilometer":"square-kilometer",
    "square kilometre":"square-kilometer",
    "square kilometers":"square-kilometer",
    "square kilometres":"square-kilometer",
    "sq kilometer":"square-kilometer",
    "sq kilometre":"square-kilometer",
    "sq kilometers":"square-kilometer",
    "sq kilometres":"square-kilometer",
    "square km":"square-kilometer",
    "sq km":"square-kilometer",
    "km2":"square-kilometer",
    "km²":"square-kilometer",
    "hectare":"hectare",
    "ha":"hectare",
    "square meter": "square-meter",
    "square meters":"square-meter",
    "square metre": "square-meter",
    "square metres": "square-meter",
    "sq meter": "square-meter",
    "sq meters":"square-meter",
    "sq metre": "square-meter",
    "sq metres": "square-meter",
    "sqm":"square-meter",
    "m2": "square-meter",
    "m²":"square-meter",
    "square mile":"square-mile",
    "square miles":"square-mile",
    "square mi":"square-mile",
    "sq mi":"square-mile",
    "mi2":"square-mile",
    "mi²":"square-mile",
    "acre": "acre",
    "acres":"acre",
    "square yard": "square-yard",
    "square yards":"square-yard",
    "sq yard": "square-yard",
    "sq yards": "square-yard",
    "sq yrd": "square-yard",
    "sq yrds": "square-yard",
    "yard2":"square-yard",
    "yard²":"square-yard",
    "yrd2":"square-yard",
    "yrd²":"square-yard",
    "yd2":"square-yard",
    "yd²":"square-yard",
    "square foot": "square-foot",
    "square feet": "square-foot",
    "sq ft":"square-foot",
    "ft2":"square-foot",
    "ft²":"square-foot",
    "square inch":"square-inch",
    "square inches":"square-inch",
    "in2":"square-inch",
    "in²":"square-inch"
};

(function() {
    AreaUnit.aliasesLower = {};
    for (var a in AreaUnit.aliases) {
        AreaUnit.aliasesLower[a.toLowerCase()] = AreaUnit.aliases[a];
    }
})();

/**
 * Convert a Area to another measure.
 * @static
 * @param to {string} unit to convert to
 * @param from {string} unit to convert from
 * @param area {number} amount to be convert
 * @returns {number|undefined} the converted amount
 */
AreaUnit.convert = function(to, from, area) {
    from = Measurement.getUnitIdCaseInsensitive(AreaUnit, from) || from;
    to = Measurement.getUnitIdCaseInsensitive(AreaUnit, to) || to;
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
    return Object.keys(AreaUnit.ratios);
};

AreaUnit.systems = {
    "metric": [
        "square-centimeter",
        "square-meter",
        "hectare",
        "square-kilometer"
    ],
    "imperial": [
        "square-inch",
        "square-foot",
        "square-yard",
        "acre",
        "square-mile"
    ],
    "uscustomary": [
        "square-inch",
        "square-foot",
        "square-yard",
        "acre",
        "square-mile"
    ],
    "conversions": {
        "metric": {
            "uscustomary": {
                "square-centimeter" : "square-inch",
                "square-meter" : "square-yard",
                "hectare" : "acre",
                "square-kilometer" : "square-mile"
            },
            "imperial": {
                "square-centimeter" : "square-inch",
                "square-meter" : "square-yard",
                "hectare" : "acre",
                "square-kilometer" : "square-mile"
            }
        },
        "uscustomary": {
            "metric": {
                "square-inch" : "square-centimeter",
                "square-foot" : "square-meter",
                "square-yard" : "square-meter",
                "acre" : "hectare",
                "square-mile" : "square-kilometer"
            }
        },
        "imperial": {
            "metric": {
                "square-inch" : "square-centimeter",
                "square-foot" : "square-meter",
                "square-yard" : "square-meter",
                "acre" : "hectare",
                "square-mile" : "square-kilometer"
            }
        }
    }
};

//register with the factory method
Measurement._constructors["area"] = AreaUnit;

module.exports = AreaUnit;