import kind from 'enact-core/kind';
import Pickable from 'enact-ui/Pickable';
import React from 'react';
import pure from 'recompose/pure';

import Expandable from '../Expandable';
import IconButton from '../IconButton';
import Picker from '../Picker';

const ExpandablePickerBase = kind({
	name: 'ExpandablePicker',

	propTypes: {
		...Picker.propTypes,
		onChange: React.PropTypes.func
	},

	defaultProps: Picker.defaultProps,

	computed: {
		onChange: ({onChange, value}) => {
			if (onChange) {
				return () => {
					onChange({value});
				};
			}
		}
	},

	render: ({children, onChange, onPick, style, value, ...rest}) => (
		<div style={style} disabled={rest.disabled}>
			<Picker {...rest} onChange={onPick} value={value}>
				{children}
			</Picker>
			<IconButton onClick={onChange}>check</IconButton>
		</div>
	)
});

const ExpandablePicker = pure(
	Expandable(
		{close: 'onChange'},
		Pickable(
			// override `pick` so we can separate handling onChange for the Picker and onChange for the
			// ExpandablePicker
			{mutable: true, pick: 'onPick'},
			ExpandablePickerBase
		)
	)
);

export default ExpandablePicker;
export {ExpandablePicker, ExpandablePickerBase};
