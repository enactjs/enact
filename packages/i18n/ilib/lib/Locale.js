/*
 * Locale.js - Locale specifier definition
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

// !depends ilib.js JSUtils.js

var ilib = require("./ilib.js");
var JSUtils = require("./JSUtils.js");

/**
 * @class
 * Create a new locale instance. Locales are specified either with a specifier string 
 * that follows the BCP-47 convention (roughly: "language-region-script-variant") or 
 * with 4 parameters that specify the language, region, variant, and script individually.<p>
 * 
 * The language is given as an ISO 639-1 two-letter, lower-case language code. You
 * can find a full list of these codes at 
 * <a href="http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes">http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes</a><p>
 * 
 * The region is given as an ISO 3166-1 two-letter, upper-case region code. You can
 * find a full list of these codes at 
 * <a href="http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2">http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2</a>.<p>
 * 
 * The variant is any string that does not contain a dash which further differentiates
 * locales from each other.<p>
 * 
 * The script is given as the ISO 15924 four-letter script code. In some locales,
 * text may be validly written in more than one script. For example, Serbian is often
 * written in both Latin and Cyrillic, though not usually mixed together. You can find a
 * full list of these codes at 
 * <a href="http://en.wikipedia.org/wiki/ISO_15924#List_of_codes">http://en.wikipedia.org/wiki/ISO_15924#List_of_codes</a>.<p>
 * 
 * As an example in ilib, the script can be used in the date formatter. Dates formatted 
 * in Serbian could have day-of-week names or month names written in the Latin
 * or Cyrillic script. Often one script is default such that sr-SR-Latn is the same
 * as sr-SR so the script code "Latn" can be left off of the locale spec.<p> 
 * 
 * Each part is optional, and an empty string in the specifier before or after a 
 * dash or as a parameter to the constructor denotes an unspecified value. In this
 * case, many of the ilib functions will treat the locale as generic. For example
 * the locale "en-" is equivalent to "en" and to "en--" and denotes a locale
 * of "English" with an unspecified region and variant, which typically matches
 * any region or variant.<p>
 * 
 * Without any arguments to the constructor, this function returns the locale of
 * the host Javascript engine.<p>
 * 
 * 
 * @constructor
 * @param {?string|Locale=} language the ISO 639 2-letter code for the language, or a full 
 * locale spec in BCP-47 format, or another Locale instance to copy from
 * @param {string=} region the ISO 3166 2-letter code for the region
 * @param {string=} variant the name of the variant of this locale, if any
 * @param {string=} script the ISO 15924 code of the script for this locale, if any
 */
var Locale = function(language, region, variant, script) {
    if (typeof(region) === 'undefined' && typeof(variant) === 'undefined' && typeof(script) === 'undefined') {
		var spec = language || ilib.getLocale();
		if (typeof(spec) === 'string') {
			var parts = spec.split('-');
	        for ( var i = 0; i < parts.length; i++ ) {
	        	if (Locale._isLanguageCode(parts[i])) {
	    			/** 
	    			 * @private
	    			 * @type {string|undefined}
	    			 */
	        		this.language = parts[i];
	        	} else if (Locale._isRegionCode(parts[i])) {
	    			/** 
	    			 * @private
	    			 * @type {string|undefined}
	    			 */
	        		this.region = parts[i];
	        	} else if (Locale._isScriptCode(parts[i])) {
	    			/** 
	    			 * @private
	    			 * @type {string|undefined}
	    			 */
	        		this.script = parts[i];
	        	} else {
	    			/** 
	    			 * @private
	    			 * @type {string|undefined}
	    			 */
	        		this.variant = parts[i];
	        	}
	        }
	        this.language = this.language || undefined;
	        this.region = this.region || undefined;
	        this.script = this.script || undefined;
	        this.variant = this.variant || undefined;
		} else if (typeof(spec) === 'object') {
	        this.language = spec.language || undefined;
	        this.region = spec.region || undefined;
	        this.script = spec.script || undefined;
	        this.variant = spec.variant || undefined;
		}
	} else {
		if (language && typeof(language) === "string") {
			language = language.trim();
			this.language = language.length > 0 ? language.toLowerCase() : undefined;
		} else {
			this.language = undefined;
		}
		if (region && typeof(region) === "string") {
			region = region.trim();
			this.region = region.length > 0 ? region.toUpperCase() : undefined;
		} else {
			this.region = undefined;
		}
		if (variant && typeof(variant) === "string") {
			variant = variant.trim();
			this.variant = variant.length > 0 ? variant : undefined;
		} else {
			this.variant = undefined;
		}
		if (script && typeof(script) === "string") {
			script = script.trim();
			this.script = script.length > 0 ? script : undefined;
		} else {
			this.script = undefined;
		}
	}
	this._genSpec();
};

// from http://en.wikipedia.org/wiki/ISO_3166-1
Locale.a2toa3regmap = {
	"AF": "AFG",
	"AX": "ALA",
	"AL": "ALB",
	"DZ": "DZA",
	"AS": "ASM",
	"AD": "AND",
	"AO": "AGO",
	"AI": "AIA",
	"AQ": "ATA",
	"AG": "ATG",
	"AR": "ARG",
	"AM": "ARM",
	"AW": "ABW",
	"AU": "AUS",
	"AT": "AUT",
	"AZ": "AZE",
	"BS": "BHS",
	"BH": "BHR",
	"BD": "BGD",
	"BB": "BRB",
	"BY": "BLR",
	"BE": "BEL",
	"BZ": "BLZ",
	"BJ": "BEN",
	"BM": "BMU",
	"BT": "BTN",
	"BO": "BOL",
	"BQ": "BES",
	"BA": "BIH",
	"BW": "BWA",
	"BV": "BVT",
	"BR": "BRA",
	"IO": "IOT",
	"BN": "BRN",
	"BG": "BGR",
	"BF": "BFA",
	"BI": "BDI",
	"KH": "KHM",
	"CM": "CMR",
	"CA": "CAN",
	"CV": "CPV",
	"KY": "CYM",
	"CF": "CAF",
	"TD": "TCD",
	"CL": "CHL",
	"CN": "CHN",
	"CX": "CXR",
	"CC": "CCK",
	"CO": "COL",
	"KM": "COM",
	"CG": "COG",
	"CD": "COD",
	"CK": "COK",
	"CR": "CRI",
	"CI": "CIV",
	"HR": "HRV",
	"CU": "CUB",
	"CW": "CUW",
	"CY": "CYP",
	"CZ": "CZE",
	"DK": "DNK",
	"DJ": "DJI",
	"DM": "DMA",
	"DO": "DOM",
	"EC": "ECU",
	"EG": "EGY",
	"SV": "SLV",
	"GQ": "GNQ",
	"ER": "ERI",
	"EE": "EST",
	"ET": "ETH",
	"FK": "FLK",
	"FO": "FRO",
	"FJ": "FJI",
	"FI": "FIN",
	"FR": "FRA",
	"GF": "GUF",
	"PF": "PYF",
	"TF": "ATF",
	"GA": "GAB",
	"GM": "GMB",
	"GE": "GEO",
	"DE": "DEU",
	"GH": "GHA",
	"GI": "GIB",
	"GR": "GRC",
	"GL": "GRL",
	"GD": "GRD",
	"GP": "GLP",
	"GU": "GUM",
	"GT": "GTM",
	"GG": "GGY",
	"GN": "GIN",
	"GW": "GNB",
	"GY": "GUY",
	"HT": "HTI",
	"HM": "HMD",
	"VA": "VAT",
	"HN": "HND",
	"HK": "HKG",
	"HU": "HUN",
	"IS": "ISL",
	"IN": "IND",
	"ID": "IDN",
	"IR": "IRN",
	"IQ": "IRQ",
	"IE": "IRL",
	"IM": "IMN",
	"IL": "ISR",
	"IT": "ITA",
	"JM": "JAM",
	"JP": "JPN",
	"JE": "JEY",
	"JO": "JOR",
	"KZ": "KAZ",
	"KE": "KEN",
	"KI": "KIR",
	"KP": "PRK",
	"KR": "KOR",
	"KW": "KWT",
	"KG": "KGZ",
	"LA": "LAO",
	"LV": "LVA",
	"LB": "LBN",
	"LS": "LSO",
	"LR": "LBR",
	"LY": "LBY",
	"LI": "LIE",
	"LT": "LTU",
	"LU": "LUX",
	"MO": "MAC",
	"MK": "MKD",
	"MG": "MDG",
	"MW": "MWI",
	"MY": "MYS",
	"MV": "MDV",
	"ML": "MLI",
	"MT": "MLT",
	"MH": "MHL",
	"MQ": "MTQ",
	"MR": "MRT",
	"MU": "MUS",
	"YT": "MYT",
	"MX": "MEX",
	"FM": "FSM",
	"MD": "MDA",
	"MC": "MCO",
	"MN": "MNG",
	"ME": "MNE",
	"MS": "MSR",
	"MA": "MAR",
	"MZ": "MOZ",
	"MM": "MMR",
	"NA": "NAM",
	"NR": "NRU",
	"NP": "NPL",
	"NL": "NLD",
	"NC": "NCL",
	"NZ": "NZL",
	"NI": "NIC",
	"NE": "NER",
	"NG": "NGA",
	"NU": "NIU",
	"NF": "NFK",
	"MP": "MNP",
	"NO": "NOR",
	"OM": "OMN",
	"PK": "PAK",
	"PW": "PLW",
	"PS": "PSE",
	"PA": "PAN",
	"PG": "PNG",
	"PY": "PRY",
	"PE": "PER",
	"PH": "PHL",
	"PN": "PCN",
	"PL": "POL",
	"PT": "PRT",
	"PR": "PRI",
	"QA": "QAT",
	"RE": "REU",
	"RO": "ROU",
	"RU": "RUS",
	"RW": "RWA",
	"BL": "BLM",
	"SH": "SHN",
	"KN": "KNA",
	"LC": "LCA",
	"MF": "MAF",
	"PM": "SPM",
	"VC": "VCT",
	"WS": "WSM",
	"SM": "SMR",
	"ST": "STP",
	"SA": "SAU",
	"SN": "SEN",
	"RS": "SRB",
	"SC": "SYC",
	"SL": "SLE",
	"SG": "SGP",
	"SX": "SXM",
	"SK": "SVK",
	"SI": "SVN",
	"SB": "SLB",
	"SO": "SOM",
	"ZA": "ZAF",
	"GS": "SGS",
	"SS": "SSD",
	"ES": "ESP",
	"LK": "LKA",
	"SD": "SDN",
	"SR": "SUR",
	"SJ": "SJM",
	"SZ": "SWZ",
	"SE": "SWE",
	"CH": "CHE",
	"SY": "SYR",
	"TW": "TWN",
	"TJ": "TJK",
	"TZ": "TZA",
	"TH": "THA",
	"TL": "TLS",
	"TG": "TGO",
	"TK": "TKL",
	"TO": "TON",
	"TT": "TTO",
	"TN": "TUN",
	"TR": "TUR",
	"TM": "TKM",
	"TC": "TCA",
	"TV": "TUV",
	"UG": "UGA",
	"UA": "UKR",
	"AE": "ARE",
	"GB": "GBR",
	"US": "USA",
	"UM": "UMI",
	"UY": "URY",
	"UZ": "UZB",
	"VU": "VUT",
	"VE": "VEN",
	"VN": "VNM",
	"VG": "VGB",
	"VI": "VIR",
	"WF": "WLF",
	"EH": "ESH",
	"YE": "YEM",
	"ZM": "ZMB",
	"ZW": "ZWE"
};


Locale.a1toa3langmap = {
	"ab": "abk",
	"aa": "aar",
	"af": "afr",
	"ak": "aka",
	"sq": "sqi",
	"am": "amh",
	"ar": "ara",
	"an": "arg",
	"hy": "hye",
	"as": "asm",
	"av": "ava",
	"ae": "ave",
	"ay": "aym",
	"az": "aze",
	"bm": "bam",
	"ba": "bak",
	"eu": "eus",
	"be": "bel",
	"bn": "ben",
	"bh": "bih",
	"bi": "bis",
	"bs": "bos",
	"br": "bre",
	"bg": "bul",
	"my": "mya",
	"ca": "cat",
	"ch": "cha",
	"ce": "che",
	"ny": "nya",
	"zh": "zho",
	"cv": "chv",
	"kw": "cor",
	"co": "cos",
	"cr": "cre",
	"hr": "hrv",
	"cs": "ces",
	"da": "dan",
	"dv": "div",
	"nl": "nld",
	"dz": "dzo",
	"en": "eng",
	"eo": "epo",
	"et": "est",
	"ee": "ewe",
	"fo": "fao",
	"fj": "fij",
	"fi": "fin",
	"fr": "fra",
	"ff": "ful",
	"gl": "glg",
	"ka": "kat",
	"de": "deu",
	"el": "ell",
	"gn": "grn",
	"gu": "guj",
	"ht": "hat",
	"ha": "hau",
	"he": "heb",
	"hz": "her",
	"hi": "hin",
	"ho": "hmo",
	"hu": "hun",
	"ia": "ina",
	"id": "ind",
	"ie": "ile",
	"ga": "gle",
	"ig": "ibo",
	"ik": "ipk",
	"io": "ido",
	"is": "isl",
	"it": "ita",
	"iu": "iku",
	"ja": "jpn",
	"jv": "jav",
	"kl": "kal",
	"kn": "kan",
	"kr": "kau",
	"ks": "kas",
	"kk": "kaz",
	"km": "khm",
	"ki": "kik",
	"rw": "kin",
	"ky": "kir",
	"kv": "kom",
	"kg": "kon",
	"ko": "kor",
	"ku": "kur",
	"kj": "kua",
	"la": "lat",
	"lb": "ltz",
	"lg": "lug",
	"li": "lim",
	"ln": "lin",
	"lo": "lao",
	"lt": "lit",
	"lu": "lub",
	"lv": "lav",
	"gv": "glv",
	"mk": "mkd",
	"mg": "mlg",
	"ms": "msa",
	"ml": "mal",
	"mt": "mlt",
	"mi": "mri",
	"mr": "mar",
	"mh": "mah",
	"mn": "mon",
	"na": "nau",
	"nv": "nav",
	"nb": "nob",
	"nd": "nde",
	"ne": "nep",
	"ng": "ndo",
	"nn": "nno",
	"no": "nor",
	"ii": "iii",
	"nr": "nbl",
	"oc": "oci",
	"oj": "oji",
	"cu": "chu",
	"om": "orm",
	"or": "ori",
	"os": "oss",
	"pa": "pan",
	"pi": "pli",
	"fa": "fas",
	"pl": "pol",
	"ps": "pus",
	"pt": "por",
	"qu": "que",
	"rm": "roh",
	"rn": "run",
	"ro": "ron",
	"ru": "rus",
	"sa": "san",
	"sc": "srd",
	"sd": "snd",
	"se": "sme",
	"sm": "smo",
	"sg": "sag",
	"sr": "srp",
	"gd": "gla",
	"sn": "sna",
	"si": "sin",
	"sk": "slk",
	"sl": "slv",
	"so": "som",
	"st": "sot",
	"es": "spa",
	"su": "sun",
	"sw": "swa",
	"ss": "ssw",
	"sv": "swe",
	"ta": "tam",
	"te": "tel",
	"tg": "tgk",
	"th": "tha",
	"ti": "tir",
	"bo": "bod",
	"tk": "tuk",
	"tl": "tgl",
	"tn": "tsn",
	"to": "ton",
	"tr": "tur",
	"ts": "tso",
	"tt": "tat",
	"tw": "twi",
	"ty": "tah",
	"ug": "uig",
	"uk": "ukr",
	"ur": "urd",
	"uz": "uzb",
	"ve": "ven",
	"vi": "vie",
	"vo": "vol",
	"wa": "wln",
	"cy": "cym",
	"wo": "wol",
	"fy": "fry",
	"xh": "xho",
	"yi": "yid",
	"yo": "yor",
	"za": "zha",
	"zu": "zul"
};

/**
 * Tell whether or not the str does not start with a lower case ASCII char.
 * @private
 * @param {string} str the char to check
 * @return {boolean} true if the char is not a lower case ASCII char
 */
Locale._notLower = function(str) {
	// do this with ASCII only so we don't have to depend on the CType functions
	var ch = str.charCodeAt(0);
	return ch < 97 || ch > 122;
};

/**
 * Tell whether or not the str does not start with an upper case ASCII char.
 * @private
 * @param {string} str the char to check
 * @return {boolean} true if the char is a not an upper case ASCII char
 */
Locale._notUpper = function(str) {
	// do this with ASCII only so we don't have to depend on the CType functions
	var ch = str.charCodeAt(0);
	return ch < 65 || ch > 90;
};

/**
 * Tell whether or not the str does not start with a digit char.
 * @private
 * @param {string} str the char to check
 * @return {boolean} true if the char is a not an upper case ASCII char
 */
Locale._notDigit = function(str) {
	// do this with ASCII only so we don't have to depend on the CType functions
	var ch = str.charCodeAt(0);
	return ch < 48 || ch > 57;
};

/**
 * Tell whether or not the given string has the correct syntax to be 
 * an ISO 639 language code.
 * 
 * @private
 * @param {string} str the string to parse
 * @return {boolean} true if the string could syntactically be a language code.
 */
Locale._isLanguageCode = function(str) {
	if (typeof(str) === 'undefined' || str.length < 2 || str.length > 3) {
		return false;
	}

	for (var i = 0; i < str.length; i++) {
		if (Locale._notLower(str.charAt(i))) {
			return false;
		}
	}
	
	return true;
};

/**
 * Tell whether or not the given string has the correct syntax to be 
 * an ISO 3166 2-letter region code or M.49 3-digit region code.
 * 
 * @private
 * @param {string} str the string to parse
 * @return {boolean} true if the string could syntactically be a language code.
 */
Locale._isRegionCode = function (str) {
	if (typeof(str) === 'undefined' || str.length < 2 || str.length > 3) {
		return false;
	}
	
	if (str.length === 2) {
		for (var i = 0; i < str.length; i++) {
			if (Locale._notUpper(str.charAt(i))) {
				return false;
			}
		}
	} else {
		for (var i = 0; i < str.length; i++) {
			if (Locale._notDigit(str.charAt(i))) {
				return false;
			}
		}
	}
	
	return true;
};

/**
 * Tell whether or not the given string has the correct syntax to be 
 * an ISO 639 language code.
 * 
 * @private
 * @param {string} str the string to parse
 * @return {boolean} true if the string could syntactically be a language code.
 */
Locale._isScriptCode = function(str) {
	if (typeof(str) === 'undefined' || str.length !== 4 || Locale._notUpper(str.charAt(0))) {
		return false;
	}
	
	for (var i = 1; i < 4; i++) {
		if (Locale._notLower(str.charAt(i))) {
			return false;
		}
	}
	
	return true;
};

/**
 * Return the ISO-3166 alpha3 equivalent region code for the given ISO 3166 alpha2
 * region code. If the given alpha2 code is not found, this function returns its
 * argument unchanged.
 * @static
 * @param {string|undefined} alpha2 the alpha2 code to map
 * @return {string|undefined} the alpha3 equivalent of the given alpha2 code, or the alpha2
 * parameter if the alpha2 value is not found
 */
Locale.regionAlpha2ToAlpha3 = function(alpha2) {
	return Locale.a2toa3regmap[alpha2] || alpha2;
};

/**
 * Return the ISO-639 alpha3 equivalent language code for the given ISO 639 alpha1
 * language code. If the given alpha1 code is not found, this function returns its
 * argument unchanged.
 * @static
 * @param {string|undefined} alpha1 the alpha1 code to map
 * @return {string|undefined} the alpha3 equivalent of the given alpha1 code, or the alpha1
 * parameter if the alpha1 value is not found
 */
Locale.languageAlpha1ToAlpha3 = function(alpha1) {
	return Locale.a1toa3langmap[alpha1] || alpha1;
};

Locale.prototype = {
	/**
	 * @private
	 */
	_genSpec: function () {
		this.spec = this.language || "";
		
		if (this.script) {
			if (this.spec.length > 0) {
				this.spec += "-";
			}
			this.spec += this.script;
		}
		
		if (this.region) {
			if (this.spec.length > 0) {
				this.spec += "-";
			}
			this.spec += this.region;
		}
		
		if (this.variant) {
			if (this.spec.length > 0) {
				this.spec += "-";
			}
			this.spec += this.variant;
		}
	},

	/**
	 * Return the ISO 639 language code for this locale. 
	 * @return {string|undefined} the language code for this locale 
	 */
	getLanguage: function() {
		return this.language;
	},
	
	/**
	 * Return the language of this locale as an ISO-639-alpha3 language code
	 * @return {string|undefined} the alpha3 language code of this locale
	 */
	getLanguageAlpha3: function() {
		return Locale.languageAlpha1ToAlpha3(this.language);
	},
	
	/**
	 * Return the ISO 3166 region code for this locale.
	 * @return {string|undefined} the region code of this locale
	 */
	getRegion: function() {
		return this.region;
	},
	
	/**
	 * Return the region of this locale as an ISO-3166-alpha3 region code
	 * @return {string|undefined} the alpha3 region code of this locale
	 */
	getRegionAlpha3: function() {
		return Locale.regionAlpha2ToAlpha3(this.region);
	},
	
	/**
	 * Return the ISO 15924 script code for this locale
	 * @return {string|undefined} the script code of this locale
	 */
	getScript: function () {
		return this.script;
	},
	
	/**
	 * Return the variant code for this locale
	 * @return {string|undefined} the variant code of this locale, if any
	 */
	getVariant: function() {
		return this.variant;
	},
	
	/**
	 * Return the whole locale specifier as a string.
	 * @return {string} the locale specifier
	 */
	getSpec: function() {
	    if (!this.spec) this._genSpec();
		return this.spec;
	},
	
	/**
	 * Return the language locale specifier. This includes the
	 * language and the script if it is available. This can be
	 * used to see whether the written language of two locales
	 * match each other regardless of the region or variant.
	 * 
	 * @return {string} the language locale specifier
	 */
	getLangSpec: function() {
	    var spec = this.language;
	    if (spec && this.script) {
	        spec += "-" + this.script;
	    }
	    return spec || "";
	},
	
	/**
	 * Express this locale object as a string. Currently, this simply calls the getSpec
	 * function to represent the locale as its specifier.
	 * 
	 * @return {string} the locale specifier
	 */
	toString: function() {
		return this.getSpec();
	},
	
	/**
	 * Return true if the the other locale is exactly equal to the current one.
	 * @return {boolean} whether or not the other locale is equal to the current one 
	 */
	equals: function(other) {
		return this.language === other.language &&
			this.region === other.region &&
			this.script === other.script &&
			this.variant === other.variant;
	},

	/**
	 * Return true if the current locale is the special pseudo locale.
	 * @return {boolean} true if the current locale is the special pseudo locale
	 */
	isPseudo: function () {
		return JSUtils.indexOf(ilib.pseudoLocales, this.spec) > -1;
	}
};

// static functions
/**
 * @private
 */
Locale.locales = [
	// !macro localelist
];

/**
 * Return the list of available locales that this iLib file supports.
 * If this copy of ilib is pre-assembled with locale data, then the 
 * list locales may be much smaller
 * than the list of all available locales in the iLib repository. The
 * assembly tool will automatically fill in the list for an assembled
 * copy of iLib. If this copy is being used with dynamically loaded 
 * data, then you 
 * can load any locale that iLib supports. You can form a locale with any 
 * combination of a language and region tags that exist in the locale
 * data directory. Language tags are in the root of the locale data dir,
 * and region tags can be found underneath the "und" directory. (The 
 * region tags are separated into a different dir because the region names 
 * conflict with language names on file systems that are case-insensitive.) 
 * If you have culled the locale data directory to limit the size of
 * your app, then this function should return only those files that actually exist
 * according to the ilibmanifest.json file in the root of that locale
 * data dir. Make sure your ilibmanifest.json file is up-to-date with
 * respect to the list of files that exist in the locale data dir.
 * 
 * @param {boolean} sync if false, load the list of available files from disk
 * asynchronously, otherwise load them synchronously. (Default: true/synchronously)
 * @param {Function} onLoad a callback function to call if asynchronous
 * load was requested and the list of files have been loaded.
 * @return {Array.<string>} this is an array of locale specs for which 
 * this iLib file has locale data for
 */
Locale.getAvailableLocales = function (sync, onLoad) {
	var locales = [];
	if (Locale.locales.length || typeof(ilib._load.listAvailableFiles) !== 'function') {
		locales = Locale.locales;
		if (onLoad && typeof(onLoad) === 'function') {
			onLoad(locales);
		}
	} else {
		if (typeof(sync) === 'undefined') {
			sync = true;
		}
		ilib._load.listAvailableFiles(sync, function(manifest) {
			if (manifest) {
				for (var dir in manifest) {
					var filelist = manifest[dir];
					for (var i = 0; i < filelist.length; i++) {
						if (filelist[i].length > 15 && filelist[i].substr(-15) === "localeinfo.json") {
							locales.push(filelist[i].substring(0,filelist[i].length-16).replace(/\//g, "-"));
						}
					}
				}
			}
			if (onLoad && typeof(onLoad) === 'function') {
				onLoad(locales);
			}
		});
	}
	return locales;
};

module.exports = Locale;
