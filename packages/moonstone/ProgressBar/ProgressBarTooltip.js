import kind from '@enact/core/kind';
import {memoize} from '@enact/core/util';
import ilib from '@enact/i18n';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import NumFmt from 'ilib/lib/NumFmt';
import React from 'react';
import PropTypes from 'prop-types';
import warning from 'warning';

import Tooltip from '../TooltipDecorator/Tooltip';

import css from './ProgressBarTooltip.module.less';

const validatePosition = (base) => (props, key, componentName, location, propFullName, ...rest) => {
	const {position} = props;
	let result = base(props, key, componentName, location, propFullName, ...rest);

	if (!result && position) {
		const orientation = props.orientation || 'horizontal';
		const hasVerticalValue = ['before', 'after', 'left', 'right'].includes(position);
		if (
			(orientation === 'vertical' && !hasVerticalValue) ||
			(orientation === 'horizontal' && hasVerticalValue)
		) {
			result = new Error(
				`'${key}' value '${position}' is not a valid value for the orientation '${orientation}'`
			);
		}
	}

	return result;
};

const memoizedPercentFormatter = memoize((/* locale */) => new NumFmt({
	type: 'percentage',
	useNative: false
}));

const getDefaultPosition = (orientation) => orientation === 'horizontal' ? 'above' : 'before';

const getSide = (orientation, side, position) => {
	warning(
		!side,
		'side is deprecated'
	);

	if (position || !side) {
		position = position || getDefaultPosition(orientation);

		if (orientation === 'horizontal') {
			switch (position) {
				case 'above':
				case 'below':
					return ['auto', position];
				case 'after':
				case 'before':
				case 'left':
				case 'right':
					// invalid values for horizontal so use defaults
					return ['auto', 'above'];
				default:
					// "(above|below) (left|right)"
					return position.split(' ').reverse();
			}
		} else {
			switch (position) {
				case 'after':
				case 'before':
				case 'left':
				case 'right':
					return [position, 'above'];
				default:
					// invalid values for horizontal so use defaults
					return ['before', 'auto'];
			}
		}
	} else {
		const valid = orientation === 'vertical' || (
			orientation === 'horizontal' && (side === 'before' || side === 'after')
		);

		warning(
			valid,
			'The value of `side` must be either "after" or "before" when `orientation` is "horizontal"'
		);

		if (orientation === 'horizontal') {
			// Testing for 'after' so if side === left or right, we default to "above"
			return [side === 'after' ? 'below' : 'above', 'auto'];
		}

		return [side, 'auto'];
	}
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
		 * Position of the tooltip with respect to the progress bar.
		 *
		 * * For `orientation="horizontal"` progress bars, the default value is `'above'`.
		 * * For `orientation="vertical"` progress bars, the default value is `'above'`.
		 *
		 * Valid values when `orientation="horizontal"`
		 *
		 * | *Value* | *Tooltip Direction* |
		 * |---|---|
		 * | `'above'` | Above component, flowing to the nearest end |
		 * | `'above left'` | Above component, flowing to the left |
		 * | `'above before'` | Above component, flowing to the start of text |
		 * | `'above right'` | Above component, flowing to the right |
		 * | `'above after'` | Above component, flowing to the end of text |=
		 * | `'below'` | Below component, flowing to the nearest end |
		 * | `'below left'` | Below component, flowing to the left |
		 * | `'below before'` | Below component, flowing to the start of text |
		 * | `'below right'` | Below component, flowing to the right |
		 * | `'below after'` | Below component, flowing to the end of text |
		 *
		 * Valid values when `orientation="vertical"`
		 *
		 * | *Value* | *Tooltip Direction* |
		 * |---|---|
		 * | `'left'` | Left of the component, contents middle aligned |
		 * | `'before'` | Start of text side of the component, contents middle aligned |
		 * | `'right'` | right of the component, contents middle aligned |
		 * | `'after'` | End of text side of the component, contents middle aligned |
		 *
		 * @type {('above'|'above before'|'above left'|'above after'|'above right'|'below'|'below left'|'below before'|'below right'|'below after'|'left'|'before'|'right'|'after')}
		 * @public
		 */
		position: validatePosition(PropTypes.oneOf([
			// horizontal
			'above',
			'above before',
			'above left',
			'above after',
			'above right',
			'below',
			'below left',
			'below before',
			'below right',
			'below after',

			// vertical
			'left',
			'before',
			'right',
			'after'
		])),

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
		 * @deprecated Deprecated since 3.1 until 4.0 in favor of `position`
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
		className: ({orientation, position, proportion, side, styler}) => {
			const [h, v] = getSide(orientation, side, position);

			return styler.append(
				orientation,
				{
					above: v === 'above',
					below: v === 'below',
					before: h === 'before',
					after: h === 'after',
					left: h === 'left' || (h === 'auto' && proportion <= 0.5),
					right: h === 'right' || (h === 'auto' && proportion > 0.5)
				}
			);
		},
		arrowAnchor: ({orientation, position, proportion, rtl}) => {
			if (orientation === 'vertical') return 'middle';

			const [h] = getSide(orientation, false, position);
			switch (h) {
				case 'auto':
					return proportion > 0.5 ? 'left' : 'right';
				case 'before':
					return rtl ? 'right' : 'left';
				case 'after':
					return rtl ? 'left' : 'right';
				case 'left':
				case 'right':
					return h;
			}
		},
		direction: ({orientation, position, rtl, side}) => {
			const [h, v] = getSide(orientation, side, position);

			let dir = 'right';
			if (orientation === 'vertical') {
				if (
					// forced to the left
					h === 'left' ||
					// LTR before
					(!rtl && h === 'before') ||
					// RTL after
					(rtl && h === 'after')
				) {
					dir = 'left';
				}
			} else {
				dir = v !== 'below' ? 'above' : 'below';
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
		delete rest.position;
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
