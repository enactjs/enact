import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import css from './DateComponentPicker.module.less';

/**
 * {@link moonstone/internal/DataComponentPicker.DateComponentPickerChrome} provides the surrounding
 * markup and styling for a {@link moonstone/internal/DateComponentPicker.DateComponentPicker} or
 * {@link moonstone/internal/DateComponentPicker.DateComponentRangePicker}.
 *
 * @class DateComponentPickerChrome
 * @memberof moonstone/internal/DateComponentPicker
 * @ui
 * @private
 */
const DateComponentPickerChromeBase = kind({
	name: 'DateComponentPickerChrome',

	propTypes:  /** @lends moonstone/internal/DateComponentPicker.DateComponentPickerChrome.prototype */ {
		/**
		 * The {@link moonstone/Picker.Picker} component
		 *
		 * @type {Element}
		 */
		children: PropTypes.element,

		/**
		 * The label to display below the picker
		 *
		 * @type {String}
		 */
		label: PropTypes.string
	},

	styles: {
		css,
		className: 'dateComponentPicker'
	},

	render: ({children, label, ...rest}) => (
		<div {...rest}>
			{React.Children.only(children)}
			{label ? <div className={css.label}>{label}</div> : null}
		</div>
	)
});

export default DateComponentPickerChromeBase;
export {
	DateComponentPickerChromeBase as DateComponentPickerChrome,
	DateComponentPickerChromeBase
};
