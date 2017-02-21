import {$L} from '@enact/i18n';
import {forProp, forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import Holdable from '@enact/ui/Holdable';
import IconButton from '@enact/moonstone/IconButton';
import Toggleable from '@enact/ui/Toggleable';
import React from 'react';

const HoldableIconButton = Holdable(IconButton);

const ScrollButtonBase = kind({
	name: 'ScrollButtonBase',

	propTypes: {
		active: React.PropTypes.bool,
		direction: React.PropTypes.string,
		disabled: React.PropTypes.bool,
		onScroll: React.PropTypes.func
	},

	handlers: {
		onMouseUp: handle(
			forward('onMouseUp'),
			forProp('active'),
			(ev) => ev.currentTarget.removeAttribute('aria-label')
		)
	},

	computed: {
		'aria-live': ({active}) => active ? 'assertive' : 'off',
		'aria-label': ({direction, active}) => $L(active ? direction.toUpperCase() : 'scroll ' + direction)
	},

	render: ({onScroll, ...rest}) => {
		delete rest.direction;
		delete rest.active;

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

const ScrollButton = Toggleable(
	{activate: 'onMouseDown', deactivate: 'onBlur', toggle: null},
	ScrollButtonBase
);

export default ScrollButton;
export {
	ScrollButton,
	ScrollButtonBase
};
