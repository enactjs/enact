import React, {PropTypes} from 'react';
import kind from '@enact/core/kind';
import {Spottable} from '@enact/spotlight';

import css from './Item.less';

const ItemBase = kind({
	name: 'Item',

	propTypes : {
		/**
		 * Children of Item. Will be rendered inside component.
		 *
		 * @type {React.node}
		 * @public
		 */
		children: PropTypes.node.isRequired,

		/**
		 * Component to render the item as. (e.g 'div', 'span', etc.)
		 *
		 * @type {String}
		 * @default 'div'
		 * @public
		 */
		component: PropTypes.string,

		/**
		 * Disabled - When set to true this will disable the component from
		 * accepting events like spotlight and click events. It will also gray out
		 * the component.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool
	},

	defaultProps: {
		component: 'div',
		disabled: false
	},

	styles: {
		css,
		className: 'item'
	},

	render: ({component: Component, ...rest}) => {
		delete rest.index;
		delete rest.pressed;

		return (
			<Component {...rest} />
		);
	}
});

const Item = Spottable(ItemBase);

export default Item;
export {Item, ItemBase};
