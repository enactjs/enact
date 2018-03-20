/**
 * Provides Moonstone-themed progress bar component.
 *
 * @example
 * <ProgressBar progress={0.5} backgroundProgress={0.75} />
 *
 * @module moonstone/ProgressBar
 * @exports ProgressBar
 * @exports ProgressBarBase
 * @exports ProgressBarDecorator
 */

import kind from '@enact/core/kind';
import UiProgressBar from '@enact/ui/ProgressBar';
import Pure from '@enact/ui/internal/Pure';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import Skinnable from '../Skinnable';
import {ProgressBarTooltip} from './ProgressBarTooltip';

import componentCss from './ProgressBar.less';

/**
 * Renders a moonstone-styled ProgressBar.
 *
 * @class ProgressBarBase
 * @memberof moonstone/ProgressBar
 * @ui
 * @public
 */
const ProgressBarBase = kind({
	name: 'ProgressBar',

	propTypes: /** @lends moonstone/ProgressBar.ProgressBarBase.prototype */ {
		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `progressBar` - The root component class
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
		 * Enables the built-in tooltip, whose behavior can be modified by the other tooltip
		 * properties.
		 *
		 * @type {Boolean}
		 * @public
		 */
		tooltip: PropTypes.bool,

		/**
		 * Setting to `true` overrides the natural tooltip position
		 * for `vertical` progress bar to the left. This may be useful
		 * if you have a static layout that have the progress bar at
		 * the right edge of the container.
		 *
		 * @type {Boolean}
		 * @public
		 */
		tooltipForceSide: PropTypes.bool,

		/**
		 * If `true` the progress bar will be oriented vertically.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		vertical: PropTypes.bool
	},

	styles: {
		css: componentCss,
		publicClassNames: ['progressBar']
	},

	computed: {
		tooltipComponent: ({progress, tooltip, tooltipForceSide, vertical}) => {
			if (tooltip) {
				const progressAfterMidpoint = progress > 0.5;
				const progressPercentage = Math.min(parseInt(progress * 100), 100);
				const percentageText = `${progressPercentage}%`;
				const tooltipVerticalPosition = {
					top: `${100 - progressPercentage}%`,
					right: tooltipForceSide ? 'auto' : '-1.5rem',
					left: tooltipForceSide ? '3rem' : null
				};
				const tooltipHorizontalPosition = progressAfterMidpoint ? {
					right: `${100 - progressPercentage}%`,
					bottom: '1rem'
				} : {
					left: percentageText,
					bottom: '1rem'
				};

				const tooltipPosition = vertical ? tooltipVerticalPosition : tooltipHorizontalPosition;

				return (
					<ProgressBarTooltip
						forceSide={tooltipForceSide}
						knobAfterMidpoint={progressAfterMidpoint}
						style={tooltipPosition}
						vertical={vertical}
					>
						{percentageText}
					</ProgressBarTooltip>
				);
			} else {
				return null;
			}
		}
	},

	render: ({css, tooltipComponent, ...rest}) => {
		delete rest.tooltip;
		delete rest.tooltipForceSide;

		return (
			<UiProgressBar
				{...rest}
				css={css}
			>
				{tooltipComponent}
			</UiProgressBar>
		);
	}
});

/**
 * Moonstone-specific behaviors to apply to [ProgressBar]{@link moonstone/ProgressBar.ProgressBarBase}.
 *
 * @hoc
 * @memberof moonstone/ProgressBar
 * @mixes ui/Skinnable.Skinnable
 * @public
 */
const ProgressBarDecorator = compose(
	Pure,
	Skinnable
);

/**
 * The ready-to-use Moonstone-styled ProgressBar.
 *
 * @class ProgressBar
 * @memberof moonstone/ProgressBar
 * @extends moonstone/ProgressBar.ProgressBarBase
 * @mixes moonstone/ProgressBar.ProgressBarDecorator
 * @ui
 * @public
 */
const ProgressBar = ProgressBarDecorator(ProgressBarBase);


export default ProgressBar;
export {
	ProgressBar,
	ProgressBarBase,
	ProgressBarDecorator,
	ProgressBarTooltip
};
