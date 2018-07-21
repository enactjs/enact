import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import IconButton from '../IconButton';

import css from './Scrollbar.less';

const classNameMap = {
	down: css.scrollbarBottomButton,
	left: css.scrollbarLeftButton,
	right: css.scrollbarRightButton,
	up: css.scrollbarUpButton
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
		 * When `true`, the `aria-label` is set.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		active: PropTypes.bool,

		/**
		 * When `true`, the component is shown as disabled and does not generate `onClick`.
		 * [events]{@link /docs/developer-guide/glossary/#event}.
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
		'aria-label': ({active, 'aria-label': ariaLabel}) => (active ? null : ariaLabel),
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

export default ScrollButton;
export {
	ScrollButton
};
