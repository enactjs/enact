/**
 * Exports the {@link moonstone/Slider.Slider} component.
 *
 * @module moonstone/Slider
 */

import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import ComponentOverride from '../ComponentOverride';
import Touchable from '../Touchable';

import Knob from './Knob';
import PositionDecorator from './PositionDecorator';

import componentCss from './Slider.less';

import {calcPercent} from './utils';

const SliderBase = kind({
	name: 'Slider',

	propTypes: {
		/**
		 * Background progress, as a proportion between `0` and `1`.
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
		 * @type {Object}
		 * @private
		 */
		css: PropTypes.object,

		/**
		 * When `true`, the component is shown as disabled and does not generate events
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: PropTypes.bool,

		knobComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),

		/**
		 * The amount to increment or decrement the position of the knob via 5-way controls.
		 * When `detachedKnob` is false, the knob must first be activated by selecting it. When
		 * `detachedKnob` is true, the knob will respond to direction key presses without
		 * activation.
		 *
		 * If not specified, `step` is used for the default value.
		 *
		 * @type {Number}
		 * @public
		 */
		knobStep: PropTypes.number,

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
		 * When `true`, the slider bar doesn't show a fill and doesn't highlight when spotted
		 *
		 * @type {Boolean}
		 * @public
		 */
		noFill: PropTypes.bool,

		/**
		 * The handler to run when the value is changed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @param {Number} event.value Value of the slider
		 * @public
		 */
		onChange: PropTypes.func,

		/**
		 * If `true` the slider will be oriented vertically.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		orientation: PropTypes.string,

		/**
		 * When `true`, a pressed visual effect is applied
		 *
		 * @type {Boolean}
		 * @public
		 */
		pressed: PropTypes.bool,

		/**
		 * The amount to increment or decrement the value.
		 *
		 * @type {Number}
		 * @default 1
		 * @public
		 */
		step: PropTypes.number,

		/**
		 * Enables the built-in tooltip, whose behavior can be modified by the other tooltip
		 * properties.
		 *
		 * @type {Component|Element}
		 * @public
		 */
		tooltipComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),

		/**
		 * The value of the slider.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		value: PropTypes.number
	},

	defaultProps: {
		disabled: false,
		knobComponent: Knob,
		min: 0,
		max: 100,
		orientation: 'horizontal',
		value: 0
	},

	styles: {
		css: componentCss,
		className: 'slider',
		publicClassNames: true
	},

	computed: {
		className: ({disabled, noFill, orientation, pressed, styler}) => {
			return styler.append(
				orientation,
				{
					disabled,
					noFill,
					pressed
				}
			);
		},
		percent: ({max, min, value}) => calcPercent(min, max, value),
		style: ({backgroundProgress, max, min, style, value}) => {
			return {
				...style,
				'--ui-slider-proportion-end': calcPercent(min, max, value),
				'--ui-slider-proportion-end-background': backgroundProgress
			};
		}
	},

	render: ({css, disabled, knobComponent, orientation, percent, tooltipComponent, value, ...rest}) => {
		delete rest.backgroundProgress;
		delete rest.knobStep;
		delete rest.max;
		delete rest.min;
		delete rest.noFill;
		delete rest.pressed;
		delete rest.step;

		return (
			<div {...rest} disabled={disabled}>
				<div className={css.bars}>
					<div className={css.load} />
					<div className={css.fill} />
					<ComponentOverride
						className={css.knob}
						component={knobComponent}
						disabled={disabled}
						orientation={orientation}
						proportion={percent}
						tooltipComponent={tooltipComponent}
						value={value}
					/>
				</div>
			</div>
		);
	}
});

const SliderDecorator = compose(
	PositionDecorator,
	Touchable({activeProp: 'pressed'})
);

const Slider = SliderDecorator(SliderBase);

export default Slider;
export {
	Knob,
	Slider,
	SliderBase,
	SliderDecorator
};
