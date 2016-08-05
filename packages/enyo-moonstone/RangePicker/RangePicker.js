import kind from 'enyo-core/kind';
import Pressable from 'enyo-ui/Pressable';
import React from 'react';

import {PickerCore, SpottablePickerHoC} from '../Picker';

const {displayValue, ...propTypes} = PickerCore.propTypes;

const RangePickerBase = kind({
	name: 'RangePicker',

	propTypes: {
		...propTypes,
		value: displayValue
	},

	defaultProps: PickerCore.defaultProps,

	render: (props) => (
		<PickerCore {...props} displayValue={props.value} />
	)
});

const RangePicker = SpottablePickerHoC(Pressable(RangePickerBase));

export default RangePicker;
export {RangePicker, RangePickerBase};
