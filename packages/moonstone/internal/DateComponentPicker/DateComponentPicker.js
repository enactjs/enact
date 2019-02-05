import Changeable from '@enact/ui/Changeable';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Spottable from '@enact/spotlight/Spottable';

import PickerCore, {PickerItem} from '../Picker';

import DateComponentPickerChrome from './DateComponentPickerChrome';

const Picker = Spottable(PickerCore);

/**
 * {@link moonstone/internal/DataComponentPicker.DateComponentPickerBase} allows the selection of one
 * part of the date or time using a {@link moonstone/Picker.Picker}.
 *
 * @class DateComponentPickerBase
 * @memberof moonstone/internal/DateComponentPicker
 * @ui
 * @private
 */
const DateComponentPickerBase = kind({
	name: 'DateComponentPicker',

	propTypes: /** @lends moonstone/internal/DateComponentPicker.DateComponentPickerBase.prototype */ {
		/**
		 * Display values representing the `value` to select
		 *
		 * @type {String[]}
		 * @required
		 * @public
		 */
		children: PropTypes.arrayOf(PropTypes.string).isRequired,

		/**
		 * The value of the date component
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		value: PropTypes.number.isRequired,

		/**
		 * Sets the hint string read when focusing the picker.
		 *
		 * @type {String}
		 * @public
		 */
		accessibilityHint: PropTypes.string,

		/**
		 * Overrides the `aria-valuetext` for the picker. By default, `aria-valuetext` is set
		 * to the current selected child and accessibilityHint text.
		 *
		 * @type {String}
		 * @memberof moonstone/internal/DateComponentPicker.DateComponentPickerBase.prototype
		 * @public
		 */
		'aria-valuetext': PropTypes.string,

		/**
		 * The label to display below the picker
		 *
		 * @type {String}
		 */
		label: PropTypes.string,

		/**
		 * By default, the picker will animate transitions between items if it has a defined
		 * `width`. Specifying `noAnimation` will prevent any transition animation for the
		 * component.
		 *
		 * @type {Boolean}
		 * @public
		 */
		noAnimation: PropTypes.bool,

		/**
		 * When `true`, the picker buttons operate in the reverse direction.
		 *
		 * @type {Boolean}
		 * @public
		 */
		reverse: PropTypes.bool,

		/*
		 * When `true`, allow the picker to continue from the opposite end of the list of options.
		 *
		 * @type {Boolean}
		 * @public
		 */
		wrap: PropTypes.bool
	},

	computed: {
		children: ({children}) => React.Children.map(children, (child) => (
			<PickerItem marqueeDisabled>{child}</PickerItem>
		)),
		max: ({children}) => React.Children.count(children) - 1,
		voiceLabel: ({children}) => {
			return JSON.stringify(children);
		}
	},

	render: ({'aria-valuetext': ariaValuetext, accessibilityHint, children, className, label, max, noAnimation, reverse, value, voiceLabel, wrap, ...rest}) => (
		<DateComponentPickerChrome className={className} label={label}>
			<Picker
				{...rest}
				accessibilityHint={(accessibilityHint == null) ? label : accessibilityHint}
				aria-valuetext={(accessibilityHint == null) ? ariaValuetext : null}
				data-webos-voice-labels-ext={voiceLabel}
				index={value}
				joined
				max={max}
				min={0}
				noAnimation={noAnimation}
				orientation="vertical"
				reverse={reverse}
				step={1}
				value={value}
				wrap={wrap}
			>
				{children}
			</Picker>
		</DateComponentPickerChrome>
	)
});

/**
 * {@link moonstone/internal/DateComponentPickerBase.DateComponentPicker} allows the selection of one part of
 * the date (date, month, or year). It is a stateful component but allows updates by providing a new
 * `value` via props.
 *
 * @class DateComponentPicker
 * @memberof moonstone/internal/DateComponentPicker
 * @mixes ui/Changeable.Changeable
 * @ui
 * @private
 */
const DateComponentPicker = Changeable(
	DateComponentPickerBase
);

export default DateComponentPicker;
export {
	DateComponentPicker,
	DateComponentPickerBase
};
