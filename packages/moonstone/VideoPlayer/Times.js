/**
 * Times
 * {@link moonstone/VideoPlayer}.
 *
 * @class Times
 * @memberOf moonstone/VideoPlayer/Times
 * @ui
 * @private
 */
import React from 'react';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import kind from '@enact/core/kind';

import {secondsToPeriod, secondsToTime} from './util';

import css from './VideoPlayer.less';

const TimesBase = kind({
	name: 'Times',

	propTypes: /** @lends moonstone/BodyText.BodyText.prototype */ {
		/**
		 * The current time in seconds of the video source.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		current: React.PropTypes.number,

		/**
		 * The total time (duration) in seconds of the loaded video source.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		total: React.PropTypes.number
	},

	defaultProps: {
		current: 0,
		total: 0
	},

	styles: {
		css,
		className: 'times'
	},

	computed: {
		currentPeriod:   ({current}) => secondsToPeriod(current),
		currentReadable: ({current}) => secondsToTime(current),
		totalPeriod:     ({total}) => secondsToPeriod(total),
		totalReadable:   ({total}) => secondsToTime(total)
	},

	render: ({currentPeriod, currentReadable, totalPeriod, totalReadable, ...rest}) => {
		delete rest.current;
		delete rest.total;

		return (
			<div {...rest}>
				<time className={css.currentTime} dateTime={currentPeriod}>{currentReadable}</time>
				<span className={css.separator}>/</span>
				<time className={css.totalTime} dateTime={totalPeriod}>{totalReadable}</time>
			</div>
		);
	}
});

const Times = onlyUpdateForKeys(['current', 'total'])(TimesBase);

export default Times;
export {Times, TimesBase};
