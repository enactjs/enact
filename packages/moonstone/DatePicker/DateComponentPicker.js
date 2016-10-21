import Changeable from '@enact/ui/Changeable';
import kind from '@enact/core/kind';
import React from 'react';

import RangePicker from '../RangePicker';

import css from './DatePicker.less';

const DateComponentPickerBase = kind({
	name: 'DateComponentPickerBase',

	propTypes: {
		max: React.PropTypes.number.isRequired,
		min: React.PropTypes.number.isRequired,
		value: React.PropTypes.number.isRequired,
		label: React.PropTypes.string
	},

	render: ({label, max, min, value, ...rest}) => (
		<div className={css.wrap}>
			<RangePicker
				{...rest}
				className={css.field}
				joined
				max={max}
				min={min}
				orientation="vertical"
				value={value}
				width="small"
				wrap
			/>
			{label ? <div className={css.label}>{label}</div> : null}
		</div>
	)
});

const DateComponentPicker = Changeable(
	{mutable: true},
	DateComponentPickerBase
);

export default DateComponentPicker;
export {
	DateComponentPicker,
	DateComponentPickerBase
};
