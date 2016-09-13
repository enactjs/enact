import kind from 'enact-core/kind';
import {Spottable} from 'enact-spotlight';
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
		value: PropTypes.string
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
		className: ({disabled, styler}) => styler.append({disabled})
	},

	render: ({inputRef, ...rest}) => {
		delete rest.useEnterKey;

		return (
			<input {...rest} ref={inputRef} />
		);
	}
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
