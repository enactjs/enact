import React from 'react';
import PropTypes from 'prop-types';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import kind from '@enact/core/kind';

import {secondsToPeriod, secondsToTime} from './util';

import css from './VideoPlayer.module.less';

/**
 * Times {@link moonstone/VideoPlayer}.
 *
 * @class Times
 * @memberof moonstone/VideoPlayer
 * @ui
 * @private
 */
const TimesBase = kind({
	name: 'Times',

	propTypes: /** @lends moonstone/VideoPlayer.Times.prototype */ {
		/**
		 * An instance of a Duration Formatter from i18n. {@link i18n/ilib/lib/DurationFmt.DurationFmt}
		 *
		 * @type {Object}
		 * @required
		 * @public
		 */
		formatter: PropTypes.object.isRequired,

		/**
		 * The current time in seconds of the video source.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		current: PropTypes.number,

		/**
		 * The total time (duration) in seconds of the loaded video source.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		total: PropTypes.number
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
		currentReadable: ({current, formatter}) => secondsToTime(current, formatter),
		totalPeriod:     ({total}) => secondsToPeriod(total),
		totalReadable:   ({total, formatter}) => secondsToTime(total, formatter)
	},

	render: ({currentPeriod, currentReadable, totalPeriod, totalReadable, ...rest}) => {
		delete rest.current;
		delete rest.formatter;
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

const Times = onlyUpdateForKeys(['current', 'formatter', 'total'])(TimesBase);

export default Times;
export {Times, TimesBase};
