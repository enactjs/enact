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
		onSpotlightDisappear: React.PropTypes.func,
		spotlightDisabled: React.PropTypes.bool
	},

	computed: {
		ButtonType: ({joined}) => joined ? Icon : TransparentIconButton
	},

	render: ({ButtonType, disabled, icon, joined, onSpotlightDisappear, spotlightDisabled, ...rest}) => {
		const spotlightProps = {onSpotlightDisappear, spotlightDisabled};

		if (joined) {
			delete spotlightProps.onSpotlightDisappear;
			delete spotlightProps.spotlightDisabled;
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
	onlyUpdateForKeys(['disabled', 'icon', 'joined', 'onMouseUp', 'spotlightDisabled'])(
		PickerButtonBase
	)
);

export default PickerButton;
export {
	PickerButton,
	PickerButtonBase
};
