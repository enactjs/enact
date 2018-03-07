import kind from '@enact/core/kind';

import {contextTypes} from '@enact/i18n/I18nDecorator';
import React from 'react';
import PropTypes from 'prop-types';

import Tooltip from './Tooltip';

import css from './ProgressBarTooltip.less';

/**
 * {@link moonstone/TooltipDecorator.ProgressBarTooltip} is a stateless Tooltip specifically for
 * Progress Bar and Slider.
 *
 * @class ProgressBarTooltip
 * @memberof moonstone/TooltipDecorator
 * @ui
 * @public
 */
const ProgressBarTooltipBase = kind({
	name: 'ProgressBarTooltip',

	propTypes: /** @lends moonstone/TooltipDecorator.ProgressBarTooltip.prototype */{
		/**
		 * Setting to `true` overrides the natural LTR->RTL tooltip side-flipping for locale changes
		 * for `vertical` progress bars/sliders. This may be useful if you have a static layout that does not
		 * automatically reverse when in an RTL language.
		 *
		 * @type {Boolean}
		 * @public
		 */
		forceSide: PropTypes.bool,

		/**
		* When not `vertical`, determines which side of the knob the tooltip appears on.
		* When `false`, the tooltip will be on the left side, when `true`, the tooltip will
		* be on the right.
		*
		* @type {String}
		* @default 'rising'
		* @private
		*/
		knobAfterMidpoint: PropTypes.bool,

		/**
		 * The proportion of progress across the bar. Should be a number between 0 and 1.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		proportion: PropTypes.number,

		/**
		 * Specify where the tooltip should appear in relation to the progress bar/slider bar. Options are
		 * `'before'` and `'after'`. `before` renders above a `horizontal` progress bar/slider and to the
		 * left of a `vertical` progress bar/slider. `after` renders below a `horizontal` progress bar/slider
		 * and to the right of a `vertical` progress bar/slider.
		 * In the `vertical` case, the rendering position is automatically reversed when rendering in an RTL locale.
		 * This can be overridden by using the [tooltipForceSide]{@link moonstone/Slider.Slider#tooltipForceSide} prop.
		 *
		 * @type {String}
		 * @default 'before'
		 * @public
		 */
		side: PropTypes.oneOf(['before', 'after']),

		/**
		 * If `true` the progress bar/slider will be oriented vertically.
		 *
		 * @type {Boolean}
		 * @public
		 */
		vertical: PropTypes.bool
	},

	defaultProps: {
		knobAfterMidpoint: false,
		forceSide: false,
		proportion: 0,
		side: 'before',
		vertical: false
	},

	styles: {
		css,
		className: 'tooltip'
	},

	contextTypes,

	computed: {
		className: ({forceSide, side, vertical, styler}) => styler.append({ignoreLocale: forceSide, vertical, horizontal: !vertical}, side),
		arrowAnchor: ({knobAfterMidpoint, vertical}) => {
			if (vertical) return 'middle';
			return knobAfterMidpoint ? 'left' : 'right';
		},
		direction: ({forceSide, side, vertical}, context) => {
			let dir = 'right';
			if (vertical) {
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
		delete rest.knobAfterMidpoint;
		delete rest.forceSide;
		delete rest.proportion;
		delete rest.side;
		delete rest.vertical;
		return (
			<Tooltip {...rest}>
				{children}
			</Tooltip>
		);
	}
});

export default ProgressBarTooltipBase;
export {ProgressBarTooltipBase, ProgressBarTooltipBase as ProgressBarTooltip};
