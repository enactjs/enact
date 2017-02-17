import {$L} from '@enact/i18n';
import kind from '@enact/core/kind';
import Holdable from '@enact/ui/Holdable';
import IconButton from '@enact/moonstone/IconButton';
import Pressable from '@enact/ui/Pressable';
import React from 'react';

const HoldableIconButton = Holdable(IconButton);

const ScrollButtonBase = kind({
	name: 'ScrollButtonBase',

	propTypes: {
		direction: React.PropTypes.string,
		disabled: React.PropTypes.bool,
		onScroll: React.PropTypes.func,
		pressed: React.PropTypes.bool
	},

	computed: {
		'aria-live': ({pressed}) => pressed ? 'assertive' : 'off',
		'aria-label': ({direction, pressed}) => $L(pressed ? direction.toUpperCase() : 'scroll ' + direction)
	},

	render: ({onScroll, ...rest}) => {
		delete rest.direction;
		delete rest.pressed;

		return (
			<HoldableIconButton
				{...rest}
				onClick={onScroll}
				onHoldPulse={onScroll}
				backgroundOpacity="transparent"
				small
			/>
		);
	}
});

const ScrollButton = Pressable(
	ScrollButtonBase
);

export default ScrollButton;
export {
	ScrollButton,
	ScrollButtonBase
};
