import Holdable from '../internal/Holdable';
import kind from '@enact/core/kind';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import PropTypes from 'prop-types';
import React from 'react';
import Toggleable from '@enact/ui/Toggleable';

import $L from '../internal/$L';
import IconButton from '../IconButton';
import {withSkinnableProps} from '../Skinnable';

import css from './Scrollbar.less';

const HoldableIconButton = Holdable({endHold: 'onLeave'}, IconButton);

const classNameMap = {
	up: css.scrollbarUpButton,
	down: css.scrollbarBottomButton,
	left: css.scrollbarLeftButton,
	right: css.scrollbarRightButton
};

const selectLabel = function (direction) {
	switch (direction) {
		case 'up':
			return $L('scroll up');
		case 'down':
			return $L('scroll down');
		case 'left':
			return $L('scroll left');
		case 'right':
			return $L('scroll right');
	}
};

/**
 * {@link moonstone/Scroller.ScrollButtonBase} is the base implementation for
 * {@link moonstone/Scroller.ScrollButton}.
 *
 * @class ScrollButtonBase
 * @memberof moonstone/Scroller
 * @ui
 * @private
 */
const ScrollButtonBase = kind({
	name: 'ScrollButton',

	propTypes: /** @lends moonstone/Scroller.ScrollButtonBase.prototype */ {
		/**
		 * Name of icon
		 *
		 * @type {String}
		 * @public
		 */
		children: PropTypes.string.isRequired,

		/**
		 * Scroll direction for this button (down, left, right, or up)
		 *
		 * @type {String}
		 * @public
		 */
		direction: PropTypes.oneOf(['down', 'left', 'right', 'up']).isRequired,

		/**
		 * When `true`, the `aria-label` is set.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		active: PropTypes.bool,

		/**
		 * When `true`, the component is shown as disabled and does not generate `onClick`
		 * [events]{@glossary event}.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: PropTypes.bool
	},

	styles: {
		css,
		className: 'scrollButton'
	},

	computed: {
		'aria-label': ({active, direction}) => active ? selectLabel(direction) : null,
		className: ({direction, styler}) => styler.append(classNameMap[direction])
	},

	render: ({children, disabled, ...rest}) => {
		delete rest.active;
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


/**
 * {@link moonstone/Scroller.ScrollButton} is an {@link moonstone/IconButton.IconButton} used within
 * a {@link moonstone/Scroller.Scrollbar}.
 *
 * @class ScrollButton
 * @memberof moonstone/Scroller
 * @ui
 * @private
 */
const ScrollButton = withSkinnableProps(
	onlyUpdateForKeys(['children', 'disabled', 'skin'])(
		Toggleable(
			{activate: 'onFocus', deactivate: 'onBlur', toggle: null},
			ScrollButtonBase
		)
	)
);

export default ScrollButton;
export {
	ScrollButton,
	ScrollButtonBase
};
