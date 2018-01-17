/**
 * Provides unstyled progress bar component to be customized by a theme or application.
 *
 * @module ui/ProgressBar
 * @exports ProgressBar
 * @exports ProgressBarBase
 */

import kind from '@enact/core/kind';
import clamp from 'ramda/src/clamp';
import PropTypes from 'prop-types';
import React from 'react';

import {validateRange} from '../internal/validators';

import componentCss from './ProgressBar.less';

const progressToPercent = (value) => (clamp(0, 1, value) * 100) + '%';

/**
 * A basic progress bar component that can display the progress of a
 * process in a horizontal or vertical bar. A secondary progress indicator can be displayed, which
 * is different than the primary progress indicator i.e. to indicate background loading progress.
 *
 * @class ProgressBar
 * @memberof ui/ProgressBar
 * @ui
 * @public
 */
const ProgressBarBase = kind({
	name: 'ProgressBar',

	propTypes: /** @lends ui/ProgressBar.ProgressBar.prototype */ {
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
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `progressBar` - The root component class
		 * * `vertical` - Applied when `vertical` prop is `true`
		 * * `fill` - The foreground node of the progress bar
		 * * `load` - The background node of the progress bar
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

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
		css: componentCss,
		className: 'progressBar',
		publicClassNames: true
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

	render: ({backgroundProgress, css, progress, progressCssProp, ...rest}) => {
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

/**
 * [ProgressBar]{@link ui/ProgressBar.ProgressBar} is a minimally-styled image component
 *
 * @class ProgressBar
 * @extends ui/ProgressBar.ProgressBarBase
 * @memberof ui/ProgressBar
 * @ui
 * @public
 */

export default ProgressBarBase;
export {
	ProgressBarBase as ProgressBar,
	ProgressBarBase
};
