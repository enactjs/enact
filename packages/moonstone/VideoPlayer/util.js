// VideoPlayer utils.js
//

/**
 * What time is it right this moment
 *
 * @return {Number} Current time in miliseconds.
 * @private
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
 * @param  {Number|String} value A duration of time represented in seconds
 *
 * @return {Object}       An object with keys {hour, minute, second} representing the duration
 *                        seconds provided as an argument.
 * @private
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
 * @private
 */
const secondsToPeriod = (seconds) => {
	return 'P' + seconds + 'S';
};

/**
 * Make a human-readable time
 *
 * @param  {Number|String} seconds A duration of time represented in seconds
 * @param {DurationFmt} durfmt An instance of a {@link i18n/ilib/lib/DurationFmt.DurationFmt} object
 *                             from iLib confugured to display time used by the {@Link VideoPlayer}
 *                             component.
 *
 * @return {String}      Formatted duration string
 * @private
 */
const secondsToTime = (seconds, durfmt) => {
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
