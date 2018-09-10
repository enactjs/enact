/**
 * A basic progress bar component that can display the progress of something in a horizontal or
 * vertical bar format.
 *
 * A secondary independent progress indicator can be displayed, to indicate
 * an additional degree of information, often used as a background loading progress.
 *
 * @module ui/ProgressBar
 * @exports ProgressBar
 */

import kind from '@enact/core/kind';
import clamp from 'ramda/src/clamp';
import PropTypes from 'prop-types';
import React from 'react';

import {validateRange} from '../internal/validators';

import componentCss from './ProgressBar.less';

const progressToPercent = (value) => (clamp(0, 1, value) * 100) + '%';
const calcBarStyle = (prop, anchor, value = anchor, startProp, endProp) => {
	let start = Math.min(anchor, value);
	let end = Math.max(anchor, value) - start;

	if (__DEV__) {
		validateRange(start, 0, 1, 'ProgressBar', prop, 'min', 'max');
		validateRange(end, 0, 1, 'ProgressBar', prop, 'min', 'max');
	}

	return {
		[startProp]: progressToPercent(start),
		[endProp]: progressToPercent(end)
	};
};

/**
 * An unstyled progress bar component that can be customized by a theme or application.
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
		 * The proportion of the loaded portion of the progress bar.
		 *
		 * * Valid values are between `0` and `1`.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		backgroundProgress: PropTypes.number,

		/**
		 * The contents to be displayed with progress bar.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `progressBar` - The root component class
		 * * `fill`        - The foreground node of the progress bar
		 * * `load`        - The background node of the progress bar
		 * * `horizontal`  - Applied when `orientation` is `'horizontal'`
		 * * `vertical`    - Applied when `orientation` is `'vertical'`
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Sets the orientation of the slider.
		 *
		 * Allowed values include:
		 *
		 * * `'horizontal'` - A left and right orientation
		 * * `'vertical'` - An up and down orientation
		 *
		 * @type {String}
		 * @default 'horizontal'
		 * @public
		 */
		orientation: PropTypes.oneOf(['horizontal', 'vertical']),

		/**
		 * The proportion of the filled portion of the progress bar.
		 *
		 * * Valid values are between `0` and `1`.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		progress: PropTypes.number,

		/**
		 * Sets the point, as a proportion between 0 and 1, from which the progress bar is filled.
		 *
		 * Applies to both the progress bar's `value` and `backgroundProgress`. In both cases,
		 * setting the value of `progressAnchor` will cause the progress bar to fill from that point
		 * down, when `value` or `backgroundProgress` is proportionally less than the anchor, or up,
		 * when `value` or `backgroundProgress` is proportionally greater than the anchor, rather
		 * than always from the start of the progress bar.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		progressAnchor: PropTypes.number
	},

	defaultProps: {
		backgroundProgress: 0,
		orientation: 'horizontal',
		progress: 0,
		progressAnchor: 0
	},

	styles: {
		css: componentCss,
		className: 'progressBar',
		publicClassNames: true
	},

	computed: {
		className: ({orientation, styler}) => styler.append(orientation),
		style: ({backgroundProgress, progress, progressAnchor, style}) => {
			return {
				...style,
				...calcBarStyle(
					'backgroundProgress',
					progressAnchor,
					backgroundProgress,
					'--ui-progressbar-proportion-start-background',
					'--ui-progressbar-proportion-end-background',
				),
				...calcBarStyle(
					'progress',
					progressAnchor,
					progress,
					'--ui-progressbar-proportion-start',
					'--ui-progressbar-proportion-end'
				)
			};
		}
	},

	render: ({children, css, ...rest}) => {
		delete rest.backgroundProgress;
		delete rest.orientation;
		delete rest.progress;
		delete rest.progressAnchor;

		return (
			<div role="progressbar" {...rest}>
				<div className={css.load} />
				<div className={css.fill} />
				{children}
			</div>
		);
	}
});

export default ProgressBar;
export {
	ProgressBar
};
