import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import ComponentOverride from '../ComponentOverride';

/**
 * An unstyled, knob component to be used with a [Slider]{@link ui/Slider.Slider}
 *
 * @class Knob
 * @memberof ui/Slider
 * @ui
 * @public
 */
const Knob = kind({
	name: 'Knob',

	propTypes: {
		/**
		 * The orientation of the slider, either `"horizontal"` or `"vertical"`.
		 *
		 * @type {Boolean}
		 * @default "horizontal"
		 * @public
		 */
		orientation: PropTypes.oneOf(['horizontal', 'vertical']),

		/**
		 * A number between 0 and 1 representing the proportion of the `value` in terms of `min`
		 * and `max` props of the slider
		 *
		 * @type {Boolean}
		 * @default "horizontal"
		 * @public
		 */
		proportion: PropTypes.number,

		/**
		 * Adds a tooltip to the knob using the provided component.
		 *
		 * The following props are forwarded to the tooltip:
		 *
		 * * `orientation` - The value of the `orientation` prop from the slider
		 * * `proportion` - The value of the `proportion` prop from the knob
		 * * `children` - The `value` prop from the slider
		 *
		 * This prop accepts either a Component (e.g. `MyTooltip`} which will be instantiated with
		 * the above props or a component instance (e.g. `<MyTooltip customProp="value" />`) which
		 * will have its props merged with the above props.
		 *
		 * See {@link ui/ComponentOverride} for more information.
		 *
		 * @type {Component|Element}
		 * @public
		 */
		tooltipComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

		/**
		 * The value of the slider.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		value: PropTypes.number
	},

	computed: {
		style: ({proportion, style}) => ({
			...style,
			'--ui-slider-knob-proportion': proportion
		})
	},

	render: ({orientation, proportion, tooltipComponent, value, ...rest}) => {
		delete rest.orientation;

		return (
			<div {...rest}>
				<ComponentOverride
					component={tooltipComponent}
					orientation={orientation}
					proportion={proportion}
				>
					{value}
				</ComponentOverride>
			</div>
		);
	}
});

export default Knob;
export {
	Knob
};
