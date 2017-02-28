import {$L} from '@enact/i18n';
import kind from '@enact/core/kind';
import Holdable from '@enact/ui/Holdable';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';

import IconButton from '../IconButton';

import css from './Scrollbar.less';

const HoldableIconButton = Holdable({endHold: 'onLeave'}, IconButton);

const classNameMap = {
	up: css.scrollbarUpButton,
	down: css.scrollbarBottomButton,
	left: css.scrollbarLeftButton,
	right: css.scrollbarRightButton
};

const ScrollButtonBase = kind({
	name: 'ScrollButtonBase',

	propTypes: {
		children: React.PropTypes.node,
		direction: React.PropTypes.string,
		disabled: React.PropTypes.bool
	},

	computed: {
		className: ({direction}) => classNameMap[direction],
		'aria-label': ({direction}) => $L('scroll ' + direction)
	},

	render: ({children, disabled, ...rest}) => {
		delete rest.direction;

		return (
			<HoldableIconButton
				{...rest}
				backgroundOpacity="transparent"
				disabled={disabled}
				small
			>
				{children}
			</HoldableIconButton>
		);
	}
});

const ScrollButton = onlyUpdateForKeys(['children', 'disabled'])(
	ScrollButtonBase
);

export default ScrollButton;
export {
	ScrollButton,
	ScrollButtonBase
};
