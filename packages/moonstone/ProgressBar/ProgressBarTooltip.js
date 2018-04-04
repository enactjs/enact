import kind from '@enact/core/kind';
import {memoize} from '@enact/core/util';
import ilib from '@enact/i18n';
import {contextTypes} from '@enact/i18n/I18nDecorator';
import NumFmt from '@enact/i18n/ilib/lib/NumFmt';
import React from 'react';
import PropTypes from 'prop-types';

import Tooltip from '../TooltipDecorator/Tooltip';

import css from './ProgressBarTooltip.less';

const memoizedPercentFormatter = memoize((/* locale */) => new NumFmt({
	type: 'percentage',
	useNative: false
}));

/**
 * A [Tooltip]{@link moonstone/TooltipDecorator.Tooltip} specifically adapted for use with
 * [IncrementSlider]{@link moonstone/IncrementSlider.IncrementSlider},
 * [ProgressBar]{@link moonstone/ProgressBar.ProgressBar}, or
 * [Slider]{@link moonstone/Slider.Slider}.
 *
 * @class ProgressBarTooltip
 * @memberof moonstone/ProgressBar
 * @ui
 * @public
 */
const ProgressBarTooltipBase = kind({
	name: 'ProgressBarTooltip',

	propTypes: /** @lends moonstone/ProgressBar.ProgressBarTooltip.prototype */{
		/**
		 * Setting to `true` overrides the natural LTR->RTL tooltip side-flipping for locale changes
		 * for `vertical` ProgressBars/Sliders. This may be useful if you have a static layout that does not
		 * automatically reverse when in an RTL language.
		 *
		 * @type {Boolean}
		 * @public
		 */
		forceSide: PropTypes.bool,

		/**
		 * Sets the orientation of the tooltip based on the orientation of the Slider, 'vertical'
		 * sends the tooltip to one of the sides, 'horizontal'  positions it above the Slider.
		 * Must be either `'horizontal'` or `'vertical'`.
		 *
		 * @type {String}
		 * @default 'horizontal'
		 * @public
		 */
		orientation: PropTypes.oneOf(['horizontal', 'vertical']),

		percent: PropTypes.bool,

		/**
		 * The proportion of progress across the bar. Should be a number between 0 and 1.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		proportion: PropTypes.number,

		/**
		 * Specify where the tooltip should appear in relation to the ProgressBar/Slider bar. Options are
		 * `'before'` and `'after'`. `before` renders above a `horizontal` ProgressBar/Slider and to the
		 * left of a `vertical` ProgressBar/Slider. `after` renders below a `horizontal` ProgressBar/Slider
		 * and to the right of a `vertical` ProgressBar/Slider.
		 * In the `vertical` case, the rendering position is automatically reversed when rendering in an RTL locale.
		 * This can be overridden by using the [tooltipForceSide]{@link moonstone/Slider.Slider#tooltipForceSide} prop.
		 *
		 * @type {String}
		 * @default 'before'
		 * @public
		 */
		side: PropTypes.oneOf(['before', 'after'])
	},

	defaultProps: {
		forceSide: false,
		orientation: 'horizontal',
		proportion: 0,
		side: 'before'
	},

	styles: {
		css,
		className: 'tooltip'
	},

	contextTypes,

	computed: {
		children: ({children, proportion, percent}) => {
			if (percent) {
				const formatter = memoizedPercentFormatter(ilib.getLocale());

				return formatter.format(Math.floor(proportion * 100));
			}

			return children;
		},
		className: ({forceSide, orientation, proportion, side, styler}) => styler.append(
			orientation,
			{
				afterMidpoint: proportion > 0.5,
				ignoreLocale: forceSide
			},
			side
		),
		arrowAnchor: ({proportion, orientation}) => {
			if (orientation === 'vertical') return 'middle';
			return proportion > 0.5 ? 'left' : 'right';
		},
		direction: ({forceSide, orientation, side}, context) => {
			let dir = 'right';
			if (orientation === 'vertical') {
				if (
					// LTR before (Both force and nonforce cases)
					(!context.rtl && !forceSide && side === 'before') ||
					// RTL after
					(context.rtl && !forceSide && side === 'after') ||
					// RTL before FORCE
					(context.rtl && forceSide && side === 'before')
				) {
					dir = 'left';
				} else {
					dir = 'right';
				}
			} else {
				dir = (side === 'before' ? 'above' : 'below');
			}
			return dir;
		}
	},

	render: ({children, ...rest}) => {
		delete rest.forceSide;
		delete rest.orientation;
		delete rest.proportion;
		delete rest.side;

		return (
			<Tooltip {...rest}>
				{children}
			</Tooltip>
		);
	}
});

ProgressBarTooltipBase.defaultSlot = 'tooltip';

export default ProgressBarTooltipBase;
export {
	ProgressBarTooltipBase,
	ProgressBarTooltipBase as ProgressBarTooltip
};
