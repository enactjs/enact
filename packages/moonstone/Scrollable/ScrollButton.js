import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import IconButton from '../IconButton';

import componentCss from './ScrollButton.less';

const classNameMap = {
	down: componentCss.scrollbarBottomButton,
	left: componentCss.scrollbarLeftButton,
	right: componentCss.scrollbarRightButton,
	up: componentCss.scrollbarUpButton
};

/**
 * An [IconButton]{@link moonstone/IconButton.IconButton} used within
 * a [Scrollbar]{@link moonstone/Scrollable.Scrollbar}.
 *
 * @class ScrollButton
 * @memberof moonstone/Scrollable
 * @extends moonstone/IconButton.IconButton
 * @ui
 * @private
 */
const ScrollButton = kind({
	name: 'ScrollButton',

	propTypes: /** @lends moonstone/Scrollable.ScrollButton.prototype */ {
		/**
		 * Name of icon.
		 *
		 * @type {String}
		 * @required
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
		 * @required
		 * @public
		 */
		direction: PropTypes.oneOf(['down', 'left', 'right', 'up']).isRequired,

		/**
		* Sets the hint string read when focusing the scroll bar button.
		*
		* @type {String}
		* @memberof moonstone/Scrollable.ScrollButton.prototype
		* @public
		*/
		'aria-label': PropTypes.string,

		/**
		 * Sets the `aria-label`.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		active: PropTypes.bool,

		/**
		 * Override [IconButton]{@link moonstone/IconButton and
		 * [Button]{@link moonstone/Button's `'bg'` and `'client'` css classes
		 *
		 * @type {Object}
		 * @private
		 */
		css: PropTypes.object,

		/**
		 * Disables the button.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: PropTypes.bool
	},

	styles: {
		css: componentCss,
		className: 'scrollButton'
	},

	computed: {
		'aria-label': ({active, 'aria-label': ariaLabel}) => (active ? null : ariaLabel),
		className: ({direction, styler}) => styler.append(classNameMap[direction])
	},

	render: ({css, children, disabled, ...rest}) => {
		delete rest.active;
		delete rest.direction;

		return (
			<IconButton
				{...rest}
				backgroundOpacity="transparent"
				css={css}
				disabled={disabled}
				small
			>
				{children}
			</IconButton>
		);
	}
});

export default ScrollButton;
export {
	ScrollButton
};
