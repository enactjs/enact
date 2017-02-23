import {$L} from '@enact/i18n';
import kind from '@enact/core/kind';
import Holdable from '@enact/ui/Holdable';
import IconButton from '@enact/moonstone/IconButton';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';

import css from './Scrollbar.less';

const HoldableIconButton = Holdable(IconButton);

const classNameMap = {
	up: css.scrollbarUpButton,
	down: css.scrollbarBottomButton,
	left: css.scrollbarLeftButton,
	right: css.scrollbarRightButton
};

const ScrollButtonBase = kind({
	name: 'ScrollButtonBase',

	propTypes: {
		direction: React.PropTypes.string,
		disabled: React.PropTypes.bool,
		onScroll: React.PropTypes.func
	},

	computed: {
		className: ({direction}) => classNameMap[direction],
		'aria-label': ({direction}) => $L('scroll ' + direction)
	},

	render: ({disabled, onScroll, ...rest}) => {
		delete rest.direction;

		return (
			<HoldableIconButton
				{...rest}
				backgroundOpacity="transparent"
				disabled={disabled}
				onClick={onScroll}
				onHoldPulse={onScroll}
				small
			/>
		);
	}
});

const ScrollButton = onlyUpdateForKeys(['disabled'])(
	ScrollButtonBase
);

export default ScrollButton;
export {
	ScrollButton,
	ScrollButtonBase
};
