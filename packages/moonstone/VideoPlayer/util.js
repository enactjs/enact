import React from 'react';
// VideoPlayer utils.js
//

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
 * @param  {Object} config Additional configuration object that includes `includeHour`.
 *
 * @return {String}      Formatted duration string
 * @private
 */
const secondsToTime = (seconds, durfmt, config) => {
	const includeHour = config && config.includeHour;

	if (durfmt) {
		const parsedTime = parseTime(seconds);
		const timeString = durfmt.format(parsedTime).toString();

		if (includeHour && !parsedTime.hour) {
			return '00:' + timeString;
		} else {
			return timeString;
		}
	}

	return includeHour ? '00:00:00' : '00:00';
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

/**
 * Safely count the children nodes and exclude null & undefined values for an accurate count of
 * real children
 *
 * @param {component} children React.Component or React.PureComponent
 * @return {Number} Number of children nodes
 * @private
 */
const countReactChildren = (children) => React.Children.toArray(children).filter(n => n != null).length;

export {
	calcNumberValueOfPlaybackRate,
	countReactChildren,
	parseTime,
	secondsToPeriod,
	secondsToTime
};
