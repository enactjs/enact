import kind from '@enact/core/kind';
import React from 'react';

import css from './DateComponentPicker.less';

/**
* {@link module:@enact/moonstone/DatePicker~DateComponentPickerBase} allows the selection of one
* part of the date (date, month, or year).
*
* @class DateComponentPickerBase
* @ui
* @private
*/
const DateComponentPickerChromeBase = kind({
	name: 'DateComponentPickerChrome',

	propTypes: {

		/**
		 * The {@link module:@enact/moonstone/Picker} component
		 *
		 * @type {Element}
		 */
		children: React.PropTypes.element,

		/**
		 * The label to display below the picker
		 *
		 * @type {String}
		 */
		label: React.PropTypes.string
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
