/*
 *  webos-fix.js
 *
 *  Patches the `bowser` package detection function to re-align platform
 *  detection on LG webOS to idfentify Chromium version instead.
 *
 *  This is a temporary workaround for:
 *  https://github.com/rofrischmann/inline-style-prefixer/issues/160
 */

import bowser from 'bowser';

const fn = bowser.detect;
bowser.detect = function (userAgent) {
	let obj = fn.call(bowser, userAgent);
	if (obj.webos && obj.blink) {
		obj = fn.call(bowser, userAgent.replace('Web0S', ''));
	}
	return obj;
};
bowser._detect = bowser.detect;
