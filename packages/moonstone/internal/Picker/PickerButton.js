import Holdable from '@enact/ui/Holdable';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

import Icon from '../../Icon';
import IconButton from '../../IconButton';
import {withSkinnableProps} from '../../Skinnable';

import css from './Picker.less';

const PickerButtonBase = kind({
	name: 'PickerButton',

	propTypes: {
		disabled: PropTypes.bool,
		hidden: PropTypes.bool,
		icon: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object
		]),
		joined: PropTypes.bool,
		onSpotlightDisappear: PropTypes.func,
		skin: PropTypes.string,
		spotlightDisabled: PropTypes.bool
	},

	styles: {
		css
	},

	computed: {
		className: ({hidden, styler}) => styler.append({
			hidden
		})
	},

	render: ({disabled, icon, joined, ...rest}) => {
		if (joined) {
			delete rest.hidden;
			delete rest.onSpotlightDisappear;
			delete rest.skin;
			delete rest.spotlightDisabled;

			return (
				<span {...rest} disabled={disabled}>
					<Icon className={css.icon} disabled={disabled} small>{icon}</Icon>
				</span>
			);
		} else {
			return (
				<IconButton {...rest} backgroundOpacity="transparent" disabled={disabled} small>
					{icon}
				</IconButton>
			);
		}
	}
});

const PickerButton = Holdable(
	{resume: true, endHold: 'onLeave'},
	withSkinnableProps(
		onlyUpdateForKeys(['aria-label', 'disabled', 'icon', 'joined', 'onMouseUp', 'skin', 'spotlightDisabled'])(
			PickerButtonBase
		)
	)
);

export default PickerButton;
export {
	PickerButton,
	PickerButtonBase
};
