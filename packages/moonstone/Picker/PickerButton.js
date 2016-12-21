import kind from '@enact/core/kind';
import React from 'react';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

import Icon from '../Icon';
import IconButton from '../IconButton';

// Components
const TransparentIconButton = (props) => <IconButton {...props} backgroundOpacity="transparent" />;

const PickerButtonBase = kind({
	name: 'PickerButton',

	propTypes: {
		disabled: React.PropTypes.bool,
		icon: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.object
		]),
		joined: React.PropTypes.bool
	},

	computed: {
		ButtonType: ({joined}) => joined ? Icon : TransparentIconButton
	},

	render: ({ButtonType, disabled, icon, ...rest}) => {
		delete rest.joined;

		return (
			<span {...rest} disabled={disabled}>
				<ButtonType disabled={disabled}>{icon}</ButtonType>
			</span>
		);
	}
});

const OnlyUpdate = onlyUpdateForKeys(['disabled', 'icon', 'joined', 'onClick', 'onMouseUp']);
const PickerButton = OnlyUpdate(PickerButtonBase);

export default PickerButton;
export {
	PickerButton,
	PickerButtonBase
};
