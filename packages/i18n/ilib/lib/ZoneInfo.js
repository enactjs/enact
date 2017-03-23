/*
 * ZoneInfo.js - represent a binary zone info file
 *
 * Copyright © 2014 LG Electronics, Inc.
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
 *
 * The portion of this code that parses the zone info file format is derived
 * from the code in the node-zoneinfo project by Gregory McWhirter licensed
 * under the MIT license:
 *
 * Copyright (c) 2013 Gregory McWhirter
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject
 * to the following conditions:

 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
 * OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

var _platform = "unknown";

(function () {
	if (typeof(enyo) !== 'undefined') {
		_platform = "enyo";
	} else if (typeof(environment) !== 'undefined') {
		_platform = "rhino";
	} else if (typeof(Qt) !== 'undefined') {
		_platform = "qt";
	} else if (typeof(process) !== 'undefined' || typeof(require) !== 'undefined') {
		_platform = "nodejs";
	} else if (typeof(window) !== 'undefined') {
		_platform = (typeof(PalmSystem) !== 'undefined') ? "webos" : "browser";
	}
})();

var PackedBuffer = PackedBuffer || (((_platform === "nodejs")||(_platform === "qt")) ? require("./PackedBuffer.js"): undefined);

/**
 * @constructor
 * Represents a binary zone info file of the sort that the Unix Zone Info Compiler
 * produces.
 * @param {string} path path to the file to be loaded
 * @param {number} year year of the zone info rules needed
 */
var ZoneInfoFile = function (path) {
	var that = this;
	switch (_platform) {
		/*
		Uncomment and use this when enyo works for binary load.
		case "enyo":
			var ajax = new enyo.Ajax({
				xhrFields: {
					responseType:"arraybuffer"
				},
				cacheBust: false,
				sync: true,
				handleAs: "binary",
				url: "file://" + path
			});
			ajax.response(this, function(s, r) {
				var byteArray = new Uint8Array(r);
				// console.log("ZoneInfoFile bytes received: " + byteArray.length);
				that._parseInfo(byteArray);
			});
			//ajax.error(this, function(s, r) {
			//	console.log("ZoneInfoFile: failed to load files " + JSON.stringify(s) + " " + r);
			//});
			ajax.go();
			break;
		*/

		case "nodejs":
			// console.log("ZoneInfoFile: loading zoneinfo path " + path + "\n");
			var fs = require("fs");
			var bytes = new Buffer(fs.readFileSync(path));
			var byteArray = new Uint8Array(bytes);
			this._parseInfo(byteArray);
			break;

		case "qt":
			var fr = require("./ilib.js").getLoader().fr;
			var bytes = fr.readBinary(path);
			this._parseInfo(bytes);
			break;

		default:
			// use normal web techniques
			var req = new XMLHttpRequest();
			req.open("GET", "file:" + path, false);
			req.responseType = "arraybuffer";
			req.onload = function(e) {
				var byteArray = new Uint8Array(req.response);
				// console.log("ZoneInfoFile bytes received: " + byteArray.length);
				that._parseInfo(byteArray);
			};
			req.onerror = function(e) {
				throw "Cannot load file " + path;
			};
			req.send();
			break;
	}
};

/**
 * @private
 * Parse the binary buffer to find the zone info
 * @param buffer
 */
ZoneInfoFile.prototype._parseInfo = function(buffer) {
	var packed = new PackedBuffer(buffer);

	// The time zone information files used by tzset(3)
	// begin with the magic characters "TZif" to identify
	// them as time zone information files, followed by
	// sixteen bytes reserved for future use, followed by
	// six four-byte values of type long, written in a
	// ''standard'' byte order (the high-order byte
	// of the value is written first).
	if (packed.getString(4) != "TZif") {
		throw "file format not recognized";
	} else {
		// ignore 16 bytes
		packed.skip(16);

		// The number of UTC/local indicators stored in the file.
		var tzh_ttisgmtcnt = packed.getLong();
		// The number of standard/wall indicators stored in the file.
		var tzh_ttisstdcnt = packed.getLong();
		// The number of leap seconds for which data is stored in the file.
		var tzh_leapcnt = packed.getLong();
		// The number of "transition times" for which data is stored in the file.
		var tzh_timecnt = packed.getLong();
		// The number of "local time types" for which data is stored in the file (must not be zero).
		var tzh_typecnt = packed.getLong();
		// The number of characters of "time zone abbreviation strings" stored in the file.
		var tzh_charcnt = packed.getLong();

		this.transitionTimes = tzh_timecnt ? packed.getLongs(tzh_timecnt) : [];

		this.transitionTimes = this.transitionTimes.map(function (item) {
			return item * 1000;
		});

		// these are indexes into the zonesInfo that correspond to each transition time
		this.ruleIndex = tzh_timecnt ? packed.getUnsignedBytes(tzh_timecnt) : [];

		this.zoneInfo = [];
		for (var i = 0; i < tzh_typecnt; i++) {
			this.zoneInfo.push({
				offset: Math.floor(packed.getLong()/60),  // offset in seconds, so convert to minutes
				isdst: !!packed.getByte(),
				abbreviationIndex: packed.getByte()
			});
		}

		var allAbbreviations = packed.getString(tzh_charcnt);

		for (var i = 0; i < tzh_typecnt; i++) {
			var abbreviation = allAbbreviations.substring(this.zoneInfo[i].abbreviationIndex);
			this.zoneInfo[i].abbreviation = abbreviation.substring(0, abbreviation.indexOf('\x00'));
		}

		// ignore the leap seconds
		if (tzh_leapcnt) {
			packed.skip(tzh_leapcnt * 2);
		}

		// skip the standard/wall time indicators
		if (tzh_ttisstdcnt) {
			packed.skip(tzh_ttisstdcnt);
		}

		// ignore the UTC/local time indicators -- everything should be UTC
		if (tzh_ttisgmtcnt) {
			packed.skip(tzh_ttisgmtcnt);
		}

		// finished reading

		// Replace ttinfo indexes for ttinfo objects.
		var that = this;
		this.ruleIndex = this.ruleIndex.map(function (item) {
			return {
				offset: that.zoneInfo[item].offset,
				isdst: that.zoneInfo[item].isdst,
				abbreviation: that.zoneInfo[item].abbreviation
			};
		});

		// calculate the dst savings for each daylight time
		for (var i = 0; i < tzh_timecnt; i++) {
			if (i > 0 && this.ruleIndex[i].isdst) {
				this.ruleIndex[i].savings = this.ruleIndex[i].offset - this.ruleIndex[i-1].offset;
			}
		}

		// Set standard, dst, and before ttinfos. before will be
		// used when a given time is before any transitions,
		// and will be set to the first non-dst ttinfo, or to
		// the first dst, if all of them are dst.
		if (!this.transitionTimes.length) {
			this.standardTime = this.zoneInfo[0];
		} else {
			for (var j = tzh_timecnt - 1; j > -1; j--) {
				var tti = this.ruleIndex[j];
				if (!this.standardTime && !tti.isdst) {
					this.standardTime = tti;
				} else if (!this.daylightTime && tti.isdst) {
					this.daylightTime = tti;
				}

				if (this.daylightTime && this.standardTime)
					break;
			}

			if (this.daylightTime && !this.standardTime) {
				this.standardTime = this.daylightTime;
			}

			for (var k = this.zoneInfo.length-1; k > 0; k--) {
				if (!this.zoneInfo[k].isdst) {
					this.defaultTime = this.zoneInfo[k];
					break;
				}
			}
		}
		if (!this.defaultTime) {
			this.defaultTime = this.zoneInfo[this.zoneInfo.length-1];
		}
	}
};

/**
 * Binary search a sorted array of numbers for a particular target value.
 * If the exact value is not found, it returns the index of the largest
 * entry that is smaller than the given target value.<p>
 *
 * @param {number} target element being sought
 * @param {Array} arr the array being searched
 * @return the index of the array into which the value would fit if
 * inserted, or -1 if given array is not an array or the target is not
 * a number
 */
ZoneInfoFile.prototype.bsearch = function(target, arr) {
	if (typeof(arr) === 'undefined' || !arr || typeof(target) === 'undefined' || target < arr[0]) {
		return -1;
	}

	// greater than the end of the array
	if (target > arr[arr.length-1]) {
		return arr.length - 1;
	}

	var high = arr.length - 1,
		low = 0,
		mid = 0,
		value;

	while (low <= high) {
		mid = Math.floor((high+low)/2);
		value = arr[mid] - target;
		if (value > 0) {
			high = mid - 1;
		} else if (value < 0) {
			low = mid + 1;
		} else {
			return mid;
		}
	}

	return high;
};

/**
 * Return whether or not this zone uses DST in the given year.
 *
 * @param {Date} date the Gregorian date to test
 * @returns {boolean} true if the zone uses DST in the given year
 */
ZoneInfoFile.prototype.usesDST = function(date) {
	var thisYear = date.getTime();
	var nextYear = thisYear + 31536000000; // this is the number of ms in 1 Gregorian year

	// search for the zone that was effective Jan 1 of this year
	// to Jan 1 of next year, and if any of the infos is DST, then
	// this zone supports DST in the given year.

	var index = this.bsearch(thisYear, this.transitionTimes);
	if (index !== -1) {
		while (index < this.transitionTimes.length && this.transitionTimes[index] < nextYear) {
			if (this.ruleIndex[index++].isdst) {
				return true;
			}
		}
	}

	return false;
};

/**
 * Return the raw offset from UTC that this zone uses at the given time.
 *
 * @param {Date} date the Gregorian date to test
 * @returns {number} offset from from UTC in number of minutes. Negative
 * numbers are west of Greenwich, positive are east of Greenwich
 */
ZoneInfoFile.prototype.getRawOffset = function(date) {
	var thisYear = date.getTime();
	var nextYear = thisYear + 31536000000; // this is the number of ms in 1 Gregorian year

	var index = this.bsearch(thisYear, this.transitionTimes);

	var offset = this.defaultTime.offset;
	if (index > -1) {
		while (index < this.transitionTimes.length && this.ruleIndex[index].isdst && this.transitionTimes[index+1] < nextYear) {
			index++;
		}

		if (index < this.transitionTimes.length && !this.ruleIndex[index].isdst) {
			offset = this.ruleIndex[index].offset;
		}
	}

	return offset;
};

/**
 * If this zone uses DST in the given year, return the DST savings
 * in use. If the zone does not use DST in the given year, this
 * method will return 0.
 *
 * @param {Date} date the Gregorian date to test
 * @returns {number} number of minutes in DST savings if the zone
 * uses DST in the given year, or zero otherwise
 */
ZoneInfoFile.prototype.getDSTSavings = function(date) {
	var thisYear = date.getTime();
	var nextYear = thisYear + 31536000000; // this is the number of ms in 1 Gregorian year

	// search for all transitions between now and one year
	// from now, and calculate the difference in DST (if any)

	var index = this.bsearch(thisYear, this.transitionTimes);
	var savings = 0;
	if (index > -1) {
		while (index < this.transitionTimes.length && !this.ruleIndex[index].isdst && this.transitionTimes[index+1] < nextYear) {
			index++;
		}

		if (index < this.transitionTimes.length && this.ruleIndex[index].isdst) {
			savings = this.ruleIndex[index].savings;
		}
	}

	return savings;
};

/**
 * Return the start date/time of DST if this zone uses
 * DST in the given year.
 *
 * @param {Date} date the Gregorian date to test
 * @returns {number} unixtime representation of the start
 * of DST in the given year, or -1 if the zone does not
 * use DST in the given year
 */
ZoneInfoFile.prototype.getDSTStartDate = function(date) {
	var year = date.getFullYear();
	var thisYear = new Date(year, 0, 1).getTime();
	var nextYear = new Date(year+1, 0, 1).getTime();

	// search for all transitions between Jan 1 of this year
	// to Jan 1 of next year, and calculate the difference
	// in DST (if any)

	var index = this.bsearch(thisYear, this.transitionTimes);
	var startDate = -1;
	if (index > -1) {
		if (this.transitionTimes[index] < thisYear) {
			index++; // start in this year instead of the previous year
		}
		while (index < this.transitionTimes.length && !this.ruleIndex[index].isdst && this.transitionTimes[index+1] < nextYear) {
			index++;
		}

		if (index < this.transitionTimes.length && this.ruleIndex[index].isdst) {
			startDate = this.transitionTimes[index];
		}
	}

	return startDate;
};

/**
 * Return the end date/time of DST if this zone uses
 * DST in the given year.
 *
 * @param {Date} date the Gregorian date to test
 * @returns {number} unixtime representation of the end
 * of DST in the given year, or -1 if the zone does not
 * use DST in the given year
 */
ZoneInfoFile.prototype.getDSTEndDate = function(date) {
	var year = date.getFullYear();
	var thisYear = new Date(year, 0, 1).getTime();
	var nextYear = new Date(year+1, 0, 1).getTime();

	// search for all transitions between Jan 1 of this year
	// to Jan 1 of next year, and calculate the difference
	// in DST (if any)

	var index = this.bsearch(thisYear, this.transitionTimes);
	var endDate = -1;
	if (index > -1) {
		if (this.transitionTimes[index] < thisYear) {
			index++; // start in this year instead of the previous year
		}
		while (index < this.transitionTimes.length && this.ruleIndex[index].isdst && this.transitionTimes[index+1] < nextYear) {
			index++;
		}

		if (index < this.transitionTimes.length && !this.ruleIndex[index].isdst) {
			endDate = this.transitionTimes[index];
		}
	}

	return endDate;
};

/**
 * Return the abbreviation used by this zone in standard
 * time.
 *
 * @param {Date} date the Gregorian date to test
 * @returns {string} a string representing the abbreviation
 * used in this time zone during standard time
 */
ZoneInfoFile.prototype.getAbbreviation = function(date) {
	var thisYear = date.getTime();
	var nextYear = thisYear + 31536000000; // this is the number of ms in 1 Gregorian year

	// search for all transitions between now and one year from now, and calculate the difference
	// in DST (if any)
	var abbr;
	if (this.transitionTimes.length > 0) {
		var index = this.bsearch(thisYear, this.transitionTimes);
		abbr = this.ruleIndex[index].abbreviation;
		if (index > -1) {
			while (index < this.transitionTimes.length && this.ruleIndex[index].isdst && this.transitionTimes[index+1] < nextYear) {
				index++;
			}

			if (index < this.transitionTimes.length && !this.ruleIndex[index].isdst) {
				abbr = this.ruleIndex[index].abbreviation;
			}
		}
	} else {
		abbr = this.standardTime.abbreviation;
	}

	return abbr;
};

/**
 * Return the abbreviation used by this zone in daylight
 * time. If the zone does not use DST in the given year,
 * this returns the same thing as getAbbreviation().
 *
 * @param {Date} date the Gregorian date to test
 * @returns {string} a string representing the abbreviation
 * used in this time zone during daylight time
 */
ZoneInfoFile.prototype.getDSTAbbreviation = function(date) {
	var thisYear = date.getTime();
	var nextYear = thisYear + 31536000000; // this is the number of ms in 1 Gregorian year

	// search for all transitions between now and one year from now, and calculate the difference
	// in DST (if any)

	var abbr;
	if (this.transitionTimes.length > 0) {
		var index = this.bsearch(thisYear, this.transitionTimes);
		abbr = this.ruleIndex[index].abbreviation;
		if (index > -1) {
			while (index < this.transitionTimes.length && !this.ruleIndex[index].isdst && this.transitionTimes[index+1] < nextYear) {
				index++;
			}

			if (index < this.transitionTimes.length && this.ruleIndex[index].isdst) {
				abbr = this.ruleIndex[index].abbreviation;
			}
		}
	} else {
		abbr = this.standardTime.abbreviation;
	}

	return abbr;
};

/**
 * Return the zone information for the given date in ilib
 * format.
 *
 * @param {Date} date the Gregorian date to test
 * @returns {Object} an object containing the zone information
 * for the given date in the format that ilib can use directly
 */
ZoneInfoFile.prototype.getIlibZoneInfo = function(date) {
	function minutesToStr(min) {
		var hours = Math.floor(min / 60);
		var minutes = min - hours * 60;

		return hours + ":" + minutes;
	}

	function unixtimeToJD(millis) {
		return 2440587.5 + millis / 86400000;
	}
	var res = {
		"o": minutesToStr(this.getRawOffset(date))
	};
	if (this.usesDST(date)) {
		res.f = "{c}";
		res.e = {
			"c": this.getAbbreviation(date),
			"j": unixtimeToJD(this.getDSTEndDate(date))
		};
		res.s = {
			"c": this.getDSTAbbreviation(date),
			"j": unixtimeToJD(this.getDSTStartDate(date)),
			"v": minutesToStr(this.getDSTSavings(date))
		};
	} else {
		res.f = this.getAbbreviation(date);
	}

	return res;
};

module.exports = ZoneInfoFile;
