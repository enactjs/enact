import kind from '@enact/core/kind';
import ForwardRef from '@enact/ui/ForwardRef';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import IconButton from '../IconButton';

import css from './Scrollbar.module.less';

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
const ScrollButtonBase = kind({
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
		 * Sets the `aria-label`.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		active: PropTypes.bool,

		/**
		* Sets the hint string read when focusing the scroll bar button.
		*
		* @type {String}
		* @memberof moonstone/Scrollable.ScrollButton.prototype
		* @public
		*/
		'aria-label': PropTypes.string,

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

	handlers: {
		forwardRef: (node, {forwardRef}) => {
			// Allowing findDOMNode in the absence of a means to retrieve a node ref through IconButton
			// eslint-disable-next-line react/no-find-dom-node
			const current = ReactDOM.findDOMNode(node);

			// Safely handle old ref functions and new ref objects
			switch (typeof forwardRef) {
				case 'object':
					forwardRef.current = current;
					break;
				case 'function':
					forwardRef(current);
					break;
			}
		}
	},

	computed: {
		'aria-label': ({active, 'aria-label': ariaLabel}) => (active ? null : ariaLabel)
	},

	render: ({children, disabled, forwardRef, ...rest}) => {
		delete rest.active;

		return (
			<IconButton
				{...rest}
				backgroundOpacity="transparent"
				disabled={disabled}
				ref={forwardRef}
				small
			>
				{children}
			</IconButton>
		);
	}
});

const ScrollButton = ForwardRef(ScrollButtonBase);

export default ScrollButton;
export {
	ScrollButton
};
