// utils.js
//

// const debug = (msg, val) => {
// 	// if (typeof val === 'boolean' || )
// 	console.log('%c' + msg + ': ' + (val ? 'FOUND!!!' : 'NOT FOUND'), 'color:' + (val ? 'green' : 'red'));
// };


// What time is it right this moment
const getNow = () => new Date().getTime();

// const zeroPad = (num) => ((num < 10 && num >= 0) ? '0' + num : num);
const padDigit = (val) => {
	if (val) {
		return (String(val).length < 2) ? '0' + val : val;
	}
	return '00';
};

// Create a time object (hours, minutes, seconds) from an amount of seconds
const parseTime = (time) => {
	// http://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
	// by powtac on Jun 10 '11 at 23:27
	time = parseInt(time); // don't forget the second param
	const h   = Math.floor(time / 3600),
		m = Math.floor((time - (h * 3600)) / 60),
		s = time - (h * 3600) - (m * 60);

	return {h, m, s};
};

// Generate a time usable by <time datetime />
const secondsToPeriod = (time) => {
	return 'P' + time + 'S';
};

// Make a human-readable time
const secondsToTime = (time) => {
	time = parseTime(time);
	return (time.h ? time.h + ':' : '') + padDigit(time.m) + ':' + padDigit(time.s);
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
	padDigit,
	parseTime,
	secondsToPeriod,
	secondsToTime
};
