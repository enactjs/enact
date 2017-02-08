import Holdable from '@enact/ui/Holdable';
import kind from '@enact/core/kind';
import React from 'react';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

import Icon from '../../Icon';
import IconButton from '../../IconButton';

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

	render: ({disabled, icon, joined, ...rest}) => {
		if (joined) {
			delete rest.onSpotlightDisappear;
			delete rest.spotlightDisabled;

			return (
				<span {...rest} disabled={disabled}>
					<Icon disabled={disabled}>{icon}</Icon>
				</span>
			);
		} else {
			return (
				<IconButton {...rest} backgroundOpacity="transparent" disabled={disabled}>
					{icon}
				</IconButton>
			);
		}
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
