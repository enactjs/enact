/**
 * Exports the {@link module:@enact/moonstone/Item~Item} component.
 *
 * @module @enact/moonstone/Item
 */

import React, {PropTypes} from 'react';
import kind from '@enact/core/kind';
import {Spottable} from '@enact/spotlight';

import {MarqueeText} from '../Marquee';

import css from './Item.less';

/**
 * {@link module:@enact/moonstone/Item~Item} is a focusable Moonstone-styled control that can display
 * simple text or a set of controls.
 *
 * @class Item
 * @ui
 * @public
 */

const ItemBase = kind({
	name: 'Item',

	propTypes: {
		/**
		 * The node to be displayed as the main content of the item.
		 *
		 * @type {React.node}
		 * @public
		 */
		children: PropTypes.node.isRequired,

		/**
		 * The type of component to use to render the item. May be a DOM node name (e.g 'div',
		 * 'span', etc.) or a custom component.
		 *
		 * @type {String|Function}
		 * @default module:@enact/moonstone/Marquee~MarqueeText
		 * @public
		 */
		component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

		/**
		 * Applies a disabled visual state to the item.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool
	},

	defaultProps: {
		component: MarqueeText,
		disabled: false
	},

	styles: {
		css,
		className: 'item'
	},

	render: ({component: Component, ...rest}) => {
		return (
			<Component {...rest} />
		);
	}
});

const Item = Spottable(ItemBase);

export default Item;
export {Item, ItemBase};
