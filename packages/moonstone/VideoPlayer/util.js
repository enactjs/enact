// VideoPlayer utils.js
//
import DurationFmt from '@enact/i18n/ilib/lib/DurationFmt';

const durfmt = new DurationFmt({length: 'medium', style: 'clock', useNative: false});


/**
 * What time is it right this moment
 *
 * @return {Number} Current time in miliseconds.
 * @public
 */
const getNow = function () {
	if (typeof window === 'object') {
		return window.performance.now();
	} else {
		return Date.now();
	}
};

/**
 * Create a time object (hour, minute, second) from an amount of seconds
 *
 * @param  {Number|String} time A duration of time represented in seconds
 *
 * @return {Object}       An object with keys {hour, minute, second} representing the duration
 *                        seconds provided as an argument.
 * @public
 */
const parseTime = (value) => {
	value = parseFloat(value);
	const time = {};
	const hour = Math.floor(value / (60 * 60));
	time.minute = Math.floor((value / 60) % 60);
	time.second = Math.floor(value % 60);
	if (hour) {
		time.hour = hour;
	}
	return time;
};

/**
 * Generate a time usable by <time datetime />
 *
 * @param  {Number|String} seconds A duration of time represented in seconds
 *
 * @return {String}      String formatted for use in a `datetime` field of a `<time>` tag.
 * @public
 */
const secondsToPeriod = (seconds) => {
	return 'P' + seconds + 'S';
};

/**
 * Make a human-readable time
 *
 * @param  {Number|String} seconds A duration of time represented in seconds
 *
 * @return {String}      Formatted duration string
 * @public
 */
const secondsToTime = (seconds) => {
	return durfmt.format(parseTime(seconds)).toString();
};

/**
 * Calculates numeric value of playback rate (with support for fractions).
 *
 * @private
 */
const calcNumberValueOfPlaybackRate = (rate) => {
	const pbArray = String(rate).split('/');
	return (pbArray.length > 1) ? parseInt(pbArray[0]) / parseInt(pbArray[1]) : parseInt(rate);
};


export {
	calcNumberValueOfPlaybackRate,
	getNow,
	parseTime,
	secondsToPeriod,
	secondsToTime
};
