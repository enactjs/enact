import React, {PropTypes} from 'react';
import kind from '@enact/core/kind';
import {Spottable} from '@enact/spotlight';

import css from './Item.less';

const ItemBase = kind({
	name: 'Item',

	propTypes : {
		children: PropTypes.node.isRequired,
		component: PropTypes.string,
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
