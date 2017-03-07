import kind from '@enact/core/kind';

import {contextTypes} from '@enact/i18n/I18nDecorator';
import React, {PropTypes} from 'react';

import Tooltip from '../TooltipDecorator/Tooltip';

import css from './SliderTooltip.less';

const proportion = (value, min = 0, max = 100) => ((value - min) / (max - min));

/**
 * {@link moonstone/Slider.SliderTooltip} is a stateless Tooltip specifically for Slider.
 *
 * @class SliderTooltipBase
 * @memberof moonstone/Slider
 * @ui
 * @public
 */
const SliderTooltipBase = kind({
	name: 'SliderTooltip',

	propTypes: /** @lends moonstone/Slider.SliderTooltip.prototype */{
		/**
		 * Setting to `true` overrides the natural LTR->RTL tooltip side-flipping for locale
		 * changes. This may be useful if you have a static layout that does not automaticaally
		 * reverse when in an RTL language.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		forceSide: PropTypes.bool,

		/**
		 * The maximum value of the slider.
		 *
		 * @type {Number}
		 * @default 100
		 * @public
		 */
		max: PropTypes.number,

		/**
		 * The minimum value of the slider.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		min: PropTypes.number,

		/**
		 * Specify where the tooltip should appear in relation to the Slider bar. Options are
		 * `'before'` and `'after'`. `before` renders above a `horizontal` slider and to the
		 * left of a `vertical` Slider. `after` renders below a `horizontal` slider and to the
		 * right of a `vertical` Slider. In the `vertical` case, the rendering position is
		 * automatically reversed when rendering in an RTL locale. This can be overridden by
		 * using the [tooltipForceSide]{@link moonstone/Slider.Slider#tooltipForceSide} prop.
		 *
		 * @type {String}
		 * @default 'before'
		 * @public
		 */
		side: PropTypes.oneOf(['before', 'after']),

		/**
		 * The value of the slider.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		value: PropTypes.number,

		/**
		 * If `true` the slider will be oriented vertically.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		vertical: PropTypes.bool
	},

	defaultProps: {
		max: 100,
		min: 0,
		forceSide: false,
		side: 'before',
		value: 0,
		vertical: false
	},

	styles: {
		css,
		className: 'tooltip'
	},

	contextTypes,

	computed: {
		className: ({forceSide, side, vertical, styler}) => styler.append({ignoreLocale: forceSide, vertical, horizontal: !vertical}, side),
		arrowAnchor: ({min, max, value, vertical}) => {
			if (vertical) return 'middle';
			return proportion(value, min, max) <= 0.5 ? 'right' : 'left';
		},
		direction: ({forceSide, side, vertical}, context) => {
			let dir = 'right';
			if (vertical) {
				if (
					// LTR before (Both force and nonforce cases)
					(!context.rtl && side === 'before') ||
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
		delete rest.max;
		delete rest.min;
		delete rest.forceSide;
		delete rest.side;
		delete rest.vertical;
		return (
			<Tooltip {...rest}>
				{children}
			</Tooltip>
		);
	}
});

export default SliderTooltipBase;
export {SliderTooltipBase, SliderTooltipBase as SliderTooltip, proportion};
