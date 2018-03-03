/**
 * A basic progress bar component that can display the progress of something in a horizontal or
 * vertical bar format. A secondary independent progress indicator can be displayed, to indicate
 * an additional degree of information, often used as a background loading progress.
 *
 * @module ui/ProgressBar
 * @exports ProgressBar
 */

import clamp from '@enact/core/internal/fp/clamp';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import {validateRange} from '../internal/validators';

import componentCss from './ProgressBar.less';

const progressToPercent = (value) => (clamp(0, 1, value) * 100) + '%';

/**
 * Provides unstyled progress bar component to be customized by a theme or application.
 *
 * @class ProgressBar
 * @memberof ui/ProgressBar
 * @ui
 * @public
 */
const ProgressBar = kind({
	name: 'ui:ProgressBar',

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
		 * * `fill` - The foreground node of the progress bar
		 * * `load` - The background node of the progress bar
		 * * `vertical` - Applied when `vertical` prop is `true`
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
		progressCssProp: ({vertical}) => (vertical ? 'height' : 'width')
	},

	render: ({backgroundProgress, css, progress, progressCssProp, ...rest}) => {
		delete rest.vertical;

		if (__DEV__) {
			validateRange(backgroundProgress, 0, 1, 'ProgressBar', 'backgroundProgress', 'min', 'max');
			validateRange(progress, 0, 1, 'ProgressBar', 'progress', 'min', 'max');
		}

		return (
			<div role="progressbar" {...rest}>
				<div className={css.load} style={{[progressCssProp]: progressToPercent(backgroundProgress)}} />
				<div className={css.fill} style={{[progressCssProp]: progressToPercent(progress)}} />
			</div>
		);
	}
});

export default ProgressBar;
export {
	ProgressBar
};
