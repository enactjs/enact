/**
 * Exports the {@link moonstone/ProgressBar.ProgressBar} component.
 *
 * @module moonstone/ProgressBar
 */

import kind from '@enact/core/kind';
import clamp from 'ramda/src/clamp';
import React from 'react';
import PropTypes from 'prop-types';

import {validateRange} from '../internal/validators';
import Skinnable from '../Skinnable';

import css from './ProgressBar.less';

const progressToPercent = (value) => (clamp(0, 1, value) * 100) + '%';

/**
 * {@link moonstone/ProgressBar.ProgressBar} is a component that can display the progress of a
 * process in a horizontal or vertical bar. A secondary progress indicator can be displayed, which
 * is different than the primary progress indicator i.e. to indicate background loading progress.
 *
 * @class ProgressBar
 * @memberof moonstone/ProgressBar
 * @ui
 * @public
 */
const ProgressBarBase = kind({
	name: 'ProgressBar',

	propTypes: /** @lends moonstone/ProgressBar.ProgressBar.prototype */ {
		/**
		* The proportion of the loaded portion of the progress bar. Valid values are
		* between `0` and `1`.
		*
		* @type {Number}
		* @default 0
		* @public
		*/
		backgroundProgress: PropTypes.number,

		/**
		* The proportion of the filled portion of the progress bar. Valid values are
		* between `0` and `1`.
		*
		* @type {Number}
		* @default 0
		* @public
		*/
		progress: PropTypes.number,

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
		progress: 0,
		vertical: false
	},

	styles: {
		css,
		className: 'progressBar'
	},

	computed: {
		className: ({vertical, styler}) => styler.append({vertical}),
		progress: ({progress}) => progressToPercent(progress),
		backgroundProgress: ({backgroundProgress}) => progressToPercent(backgroundProgress),
		progressCssProp: ({vertical}) => (vertical ? 'height' : 'width'),
		validate: ({backgroundProgress, progress}) => {
			if (__DEV__) {
				validateRange(backgroundProgress, 0, 1, 'ProgressBar', 'backgroundProgress', 'min', 'max');
				validateRange(progress, 0, 1, 'ProgressBar', 'progress', 'min', 'max');
			}
		}
	},

	render: ({backgroundProgress, progress, progressCssProp, ...rest}) => {
		delete rest.validate;
		delete rest.vertical;

		return (
			<div role="progressbar" {...rest}>
				<div className={css.load} style={{[progressCssProp]: backgroundProgress}} />
				<div className={css.fill} style={{[progressCssProp]: progress}} />
			</div>
		);
	}
});

const ProgressBar = Skinnable(ProgressBarBase);

export default ProgressBar;
export {ProgressBar, ProgressBarBase};
