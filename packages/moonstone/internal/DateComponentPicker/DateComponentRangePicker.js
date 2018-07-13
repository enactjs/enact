import Changeable from '@enact/ui/Changeable';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import RangePicker from '../../RangePicker';

import DateComponentPickerChrome from './DateComponentPickerChrome';


/**
 * {@link moonstone/internal/DataComponentPicker.DateComponentRangePicker} allows the selection of
 * one part of the date or time using a {@link moonstone/RangePicker.RangePicker}.
 *
 * @class DateComponentRangePickerBase
 * @memberof moonstone/internal/DateComponentPicker
 * @ui
 * @private
 */
const DateComponentRangePickerBase = kind({
	name: 'DateComponentRangePicker',

	propTypes:  /** @lends moonstone/internal/DateComponentPicker.DateComponentRangePickerBase.prototype */ {
		/**
		 * The maximum value for the date component
		 *
		 * @type {Number}
		 * @required
		 */
		max: PropTypes.number.isRequired,

		/**
		 * The minimum value for the date component
		 *
		 * @type {Number}
		 * @required
		 */
		min: PropTypes.number.isRequired,

		/**
		 * The value of the date component
		 *
		 * @type {Number}
		 * @required
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

		/*
		 * When `true`, allow the picker to continue from the opposite end of the list of options.
		 *
		 * @type {Boolean}
		 * @public
		 */
		wrap: PropTypes.bool
	},

	computed: {
		voiceLabel: ({min, max}) => {
			return JSON.stringify([min, max]);
		}
	},

	render: ({accessibilityHint, className, label, max, min, noAnimation, value, wrap, voiceLabel, ...rest}) => (
		<DateComponentPickerChrome className={className} label={label}>
			<RangePicker
				{...rest}
				accessibilityHint={(accessibilityHint == null) ? label : accessibilityHint}
				data-webos-voice-labels-ext={voiceLabel}
				joined
				max={max}
				min={min}
				noAnimation={noAnimation}
				orientation="vertical"
				value={value}
				wrap={wrap}
			/>
		</DateComponentPickerChrome>
	)
});

/**
 * {@link moonstone/internal/DateComponentPicker.DateComponentRangePicker} allows the selection of one
 * part of the date (date, month, or year). It is a stateful component but allows updates by
 * providing a new `value` via props.
 *
 * @class DateComponentRangePicker
 * @memberof moonstone/internal/DateComponentPicker
 * @mixes ui/Changeable.Changeable
 * @ui
 * @private
 */
const DateComponentRangePicker = Changeable(
	DateComponentRangePickerBase
);

export default DateComponentRangePicker;
export {
	DateComponentRangePicker,
	DateComponentRangePickerBase
};
