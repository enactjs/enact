import kind from '@enact/core/kind';
import {memoize} from '@enact/core/util';
import ilib from '@enact/i18n';
import {contextTypes} from '@enact/i18n/I18nDecorator';
import NumFmt from '@enact/i18n/ilib/lib/NumFmt';
import React from 'react';
import PropTypes from 'prop-types';
import warning from 'warning';

import Tooltip from '../TooltipDecorator/Tooltip';

import css from './ProgressBarTooltip.less';

const memoizedPercentFormatter = memoize((/* locale */) => new NumFmt({
	type: 'percentage',
	useNative: false
}));

const getSide = (orientation, side) => {
	const valid = orientation === 'vertical' || (
		orientation === 'horizontal' && (side === 'before' || side === 'after')
	);

	warning(
		valid,
		'The value of `side` must be either "after" or "before" when `orientation` is "horizontal"'
	);

	return valid ? side : 'before';
};

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
		 * Sets the orientation of the tooltip based on the orientation of the Slider, 'vertical'
		 * sends the tooltip to one of the sides, 'horizontal'  positions it above the Slider.
		 * Must be either `'horizontal'` or `'vertical'`.
		 *
		 * @type {String}
		 * @default 'horizontal'
		 * @public
		 */
		orientation: PropTypes.oneOf(['horizontal', 'vertical']),

		/**
		 * Display the percentage instead of the value
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
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
		 * Specify where the tooltip should appear in relation to the ProgressBar/Slider bar.
		 *
		 * Allowed values are:
		 *
		 * * `"after"` renders below a `horizontal` ProgressBar/Slider and after (respecting the
		 *   current locale's text direction) a `vertical` ProgressBar/Slider
		 * * `"before"` renders above a `horizontal` ProgressBar/Slider and before (respecting the
		 *   current locale's text direction) a `vertical` ProgressBar/Slider
		 * * `"left"` renders to the left of a `vertical` ProgressBar/Slider regardless of locale
		 * * `"right"` renders to the right of a `vertical` ProgressBar/Slider regardless of locale
		 *
		 * @type {String}
		 * @default 'before'
		 * @public
		 */
		side: PropTypes.oneOf(['after', 'before', 'left', 'right']),

		/**
		 * Visibility of the tooltip
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		visible: PropTypes.bool
	},

	defaultProps: {
		orientation: 'horizontal',
		percent: false,
		proportion: 0,
		side: 'before',
		visible: false
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

				return formatter.format(Math.round(proportion * 100));
			}

			return children;
		},
		className: ({orientation, proportion, side, styler}) => {
			side = getSide(orientation, side);

			return styler.append(
				orientation,
				{
					afterMidpoint: proportion > 0.5,
					ignoreLocale: side === 'left' || side === 'right'
				},
				(side === 'before' || side === 'left') ? 'before' : 'after'
			);
		},
		arrowAnchor: ({proportion, orientation}) => {
			if (orientation === 'vertical') return 'middle';
			return proportion > 0.5 ? 'left' : 'right';
		},
		direction: ({orientation, side}, context) => {
			side = getSide(orientation, side);

			let dir = 'right';
			if (orientation === 'vertical') {
				if (
					// forced to the left
					side === 'left' ||
					// LTR before
					(!context.rtl && side === 'before') ||
					// RTL after
					(context.rtl && side === 'after')
				) {
					dir = 'left';
				}
			} else {
				dir = side === 'before' ? 'above' : 'below';
			}
			return dir;
		},
		style: ({proportion, style}) => ({
			...style,
			'--tooltip-progress-proportion': proportion
		})
	},

	render: ({children, visible, ...rest}) => {
		if (!visible) return null;

		delete rest.orientation;
		delete rest.percent;
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
