import kind from '@enact/core/kind';
import {memoize} from '@enact/core/util';
import ilib from '@enact/i18n';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import NumFmt from 'ilib-webos-tv/lib/NumFmt';
import React from 'react';
import PropTypes from 'prop-types';
import warning from 'warning';

import Tooltip from '../TooltipDecorator/Tooltip';

import css from './ProgressBarTooltip.module.less';

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
		 * Sets the orientation of the tooltip based on the orientation of the bar.
		 *
		 * 'vertical' sends the tooltip to one of the sides, 'horizontal'  positions it above the bar.
		 * * Values: `'horizontal'`, `'vertical'`
		 *
		 * @type {String}
		 * @default 'horizontal'
		 * @public
		 */
		orientation: PropTypes.oneOf(['horizontal', 'vertical']),

		/**
		 * Displays the value as a percentage.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		percent: PropTypes.bool,

		/**
		 * The proportion of the filled part of the bar.
		 *
		 * * Should be a number between 0 and 1.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		proportion: PropTypes.number,

		/**
		 * Sets the text direction to be right-to-left
		 *
		 * @type {Boolean}
		 * @private
		 */
		rtl: PropTypes.bool,

		/**
		 * Specify where the tooltip should appear in relation to the ProgressBar/Slider bar.
		 *
		 * Allowed values are:
		 *
		 * * `'after'` renders below a `horizontal` ProgressBar/Slider and after (respecting the
		 *   current locale's text direction) a `vertical` ProgressBar/Slider
		 * * `'before'` renders above a `horizontal` ProgressBar/Slider and before (respecting the
		 *   current locale's text direction) a `vertical` ProgressBar/Slider
		 * * `'left'` renders to the left of a `vertical` ProgressBar/Slider regardless of locale
		 * * `'right'` renders to the right of a `vertical` ProgressBar/Slider regardless of locale
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
		direction: ({orientation, rtl, side}) => {
			side = getSide(orientation, side);

			let dir = 'right';
			if (orientation === 'vertical') {
				if (
					// forced to the left
					side === 'left' ||
					// LTR before
					(!rtl && side === 'before') ||
					// RTL after
					(rtl && side === 'after')
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
		delete rest.rtl;
		delete rest.side;

		return (
			<Tooltip {...rest}>
				{children}
			</Tooltip>
		);
	}
});

const ProgressBarTooltip = I18nContextDecorator(
	{rtlProp: 'rtl'},
	ProgressBarTooltipBase
);
ProgressBarTooltip.defaultSlot = 'tooltip';

export default ProgressBarTooltip;
export {
	ProgressBarTooltip,
	ProgressBarTooltipBase
};
