import kind from '@enact/core/kind';
import {Spottable} from '@enact/spotlight';
import {anyPrimitive} from '@enact/ui/validators/PropTypeValidators';
import React, {PropTypes} from 'react';

import css from './Input.less';

const PlainInputBase = kind({
	name: 'PlainInputBase',

	propTypes: {
		className: PropTypes.string,
		disabled: PropTypes.bool,
		onChange: PropTypes.func,
		placeholder: PropTypes.string,
		type: PropTypes.string,
		value: anyPrimitive
	},

	defaultProps: {
		disabled: false,
		placeholder: '',
		type: 'text',
		value: ''
	},

	styles: {
		css,
		className: 'input'
	},

	computed: {
		className: ({disabled, styler}) => styler.append({disabled}),

		// standardize the synthetic React onChange event with our onChange event
		onChange: ({onChange}) => {
			if (onChange) {
				return (ev) => {
					onChange({value: ev.target.value});
				};
			}
		}
	},

	render: ({inputRef, ...rest}) => (
		<input {...rest} ref={inputRef} />
	)
});

const PlainInput = Spottable(kind({
	name: 'PlainInput',

	render: (props) => {
		delete props.spotlightDisabled;

		return (
			<PlainInputBase {...props} />
		);
	}
}));

export default PlainInput;
export {PlainInput, PlainInputBase};
