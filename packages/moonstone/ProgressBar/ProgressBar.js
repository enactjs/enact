import kind from 'enact-core/kind';
import {checkDefaultBounds} from 'enact-ui/validators/PropTypeValidators';
import R from 'ramda';
import React, {PropTypes} from 'react';

import css from './ProgressBar.less';

const progressToPercent = (value, max, min) => R.clamp(min, max, (value / max) * 100) + '%';

const ProgressBar = kind({
	name: 'ProgressBar',

	propTypes: {
		/**
		* The height/width of the loaded portion of the progress bar. Valid values are
		* between `min` and `max`.
		*
		* @type {Number}
		* @default 0
		* @public
		*/
		backgroundProgress: checkDefaultBounds,

		/**
		* The maximum value of the progress bar.
		*
		* @type {Number}
		* @default 100
		* @public
		*/
		max: PropTypes.number,

		/**
		* The minimum value of the progress bar.
		*
		* @type {Number}
		* @default 0
		* @public
		*/
		min: PropTypes.number,

		/**
		* The height/width of the filled portion of the progress bar. Valid values are
		* between `min` and `max`.
		*
		* @type {Number}
		* @default 0
		* @public
		*/
		progress: checkDefaultBounds,

		/**
		* If `true` the progress bar will be oriented vertically.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		vertical: PropTypes.bool
	},

	defaultProps: {
		backgroundProgress: 0,
		max: 100,
		min: 0,
		progress: 0,
		vertical: false
	},

	styles: {
		css,
		className: 'progressBar'
	},

	computed: {
		className: ({vertical, styler}) => styler.append({vertical}),
		progress: ({progress, max, min}) => progressToPercent(progress, max, min),
		backgroundProgress: ({backgroundProgress, max, min}) => progressToPercent(backgroundProgress, max, min),
		progressCssProp: ({vertical}) => (vertical ? 'height' : 'width')
	},

	render: ({backgroundProgress, progress, progressCssProp, ...rest}) => {
		delete rest.max;
		delete rest.min;
		delete rest.vertical;

		return (
			<div {...rest}>
				<div className={css.load} style={{[progressCssProp]: backgroundProgress}} />
				<div className={css.fill} style={{[progressCssProp]: progress}} />
			</div>
		);
	}
});

export default ProgressBar;
export {ProgressBar, ProgressBar as ProgressBarBase};
