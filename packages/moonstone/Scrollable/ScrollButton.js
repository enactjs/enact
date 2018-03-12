import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';
import Toggleable from '@enact/ui/Toggleable';

import $L from '../internal/$L';
import IconButton from '../IconButton';

import css from './Scrollbar.less';

const classNameMap = {
	down: css.scrollbarBottomButton,
	left: css.scrollbarLeftButton,
	right: css.scrollbarRightButton,
	up: css.scrollbarUpButton
};

/**
 * A Moonstone-styled base component for [ScrollButton]{@link moonstone/Scrollable.ScrollButton}.
 *
 * @class ScrollButtonBase
 * @memberof moonstone/Scrollable
 * @ui
 * @private
 */
const ScrollButtonBase = kind({
	name: 'ScrollButtonBase',

	propTypes: /** @lends moonstone/Scrollable.ScrollButton.prototype */ {
		/**
		 * Name of icon
		 *
		 * @type {String}
		 * @public
		 */
		children: PropTypes.string.isRequired,

		/**
		 * Scroll direction for this button.
		 *
		 * Valid values are:
		 * * `'down'`,
		 * * `'left'`,
		 * * `'right'`, and
		 * * `'up'`.
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
		'aria-label': ({disabled, direction}) => {
			if (disabled) {
				return null;
			}

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
		},
		className: ({direction, styler}) => styler.append(classNameMap[direction])
	},

	render: ({children, disabled, ...rest}) => {
		delete rest.active;
		delete rest.direction;

		return (
			<IconButton
				{...rest}
				backgroundOpacity="transparent"
				disabled={disabled}
				small
			>
				{children}
			</IconButton>
		);
	}
});


/**
 * An [IconButton]{@link moonstone/IconButton.IconButton} used within
 * a [Scrollbar]{@link moonstone/Scrollable.Scrollbar}.
 *
 * @class ScrollButton
 * @memberof moonstone/Scrollable
 * @mixins ui/Toggleable
 * @extends moonstone/Scrollable.ScrollButtonBase
 * @ui
 * @private
 */
const ScrollButton = Toggleable(
	{activate: 'onFocus', deactivate: 'onBlur', prop: 'hover', toggle: null},
	ScrollButtonBase
);

export default ScrollButton;
export {
	ScrollButton,
	ScrollButtonBase
};
