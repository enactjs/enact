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
		 * Sets the orientation of the slider, whether the progress-bar depicts its progress value
		 * in a left and right orientation or up and down onientation.
		 * Must be either `'horizontal'` or `'vertical'`.
		 *
		 * @type {String}
		 * @default 'horizontal'
		 * @public
		 */
		orientation: PropTypes.oneOf(['horizontal', 'vertical']),

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
		 * Specify where the tooltip should appear in relation to the ProgressBar. Options are
		 * `'before'` and `'after'`. `before` renders above a `horizontal` slider and to the
		 * left of a `vertical` ProgressBar. `after` renders below a `horizontal` slider and to the
		 * right of a `vertical` ProgressBar. In the `vertical` case, the rendering position is
		 * automatically reversed when rendering in an RTL locale. This can be overridden by
		 * using the [tooltipForceSide]{@link moonstone/ProgressBar.ProgressBar.tooltipForceSide}
		 * prop.
		 *
		 * @type {String}
		 * @default 'before'
		 * @public
		 */
		tooltipSide: PropTypes.string
	},

	defaultProps: {
		tooltip: false,
		tooltipSide: 'before',
		tooltipForceSide: false
	},

	styles: {
		css: componentCss,
		publicClassNames: ['progressBar']
	},

	computed: {
		tooltipComponent: ({orientation, progress, tooltip, tooltipForceSide, tooltipSide}) => {
			if (tooltip) {
				const progressAfterMidpoint = progress > 0.5;
				const progressPercentage = Math.min(parseInt(progress * 100), 100);
				const percentageText = `${progressPercentage}%`;

				return (
					<ProgressBarTooltip
						forceSide={tooltipForceSide}
						knobAfterMidpoint={progressAfterMidpoint}
						proportion={progress}
						orientation={orientation}
						side={tooltipSide}
						visible
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
		delete rest.tooltipSide;
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
