import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import IconButton from '../IconButton';

import css from './Scrollbar.less';

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
		 * Disables the button.
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
		'aria-label': ({active, 'aria-label': ariaLabel}) => (active ? null : ariaLabel)
	},

	render: ({children, disabled, ...rest}) => {
		delete rest.active;

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
