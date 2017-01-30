import Holdable from '@enact/ui/Holdable';
import kind from '@enact/core/kind';
import React from 'react';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

import Icon from '../../Icon';
import IconButton from '../../IconButton';

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
		joined: React.PropTypes.bool,
		onSpotlightDisappear: React.PropTypes.func
	},

	computed: {
		ButtonType: ({joined}) => joined ? Icon : TransparentIconButton
	},

	render: ({ButtonType, disabled, icon, joined, onSpotlightDisappear, ...rest}) => {
		const spotlightProps = {onSpotlightDisappear};

		if (joined) {
			delete spotlightProps.onSpotlightDisappear;
		}

		return (
			<span {...rest} disabled={disabled}>
				<ButtonType disabled={disabled} {...spotlightProps}>{icon}</ButtonType>
			</span>
		);
	}
});

const PickerButton = Holdable(
	{resume: true, endHold: 'onLeave'},
	onlyUpdateForKeys(['disabled', 'icon', 'joined', 'onMouseUp'])(
		PickerButtonBase
	)
);

export default PickerButton;
export {
	PickerButton,
	PickerButtonBase
};
