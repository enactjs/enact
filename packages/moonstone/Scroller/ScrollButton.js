import {$L} from '@enact/i18n';
import kind from '@enact/core/kind';
import Holdable from '@enact/ui/Holdable';
import IconButton from '@enact/moonstone/IconButton';
import React from 'react';

const HoldableIconButton = Holdable(IconButton);

const ScrollButtonBase = kind({
	name: 'ScrollButtonBase',

	propTypes: {
		direction: React.PropTypes.string,
		onScroll: React.PropTypes.func
	},

	computed: {
		'aria-label': ({direction}) => $L('scroll ' + direction)
	},

	render: ({onScroll, ...rest}) => {
		delete rest.direction;

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

export default ScrollButtonBase;
export {
	ScrollButtonBase as ScrollButton,
	ScrollButtonBase
};
