import React, {PropTypes} from 'react';
import kind from 'enact-core/kind';
import {Spottable} from 'enact-spotlight';
import Pressable from 'enact-ui/Pressable';

import css from './Item.less';

const ItemBase = kind({
	name: 'Item',

	propTypes : {
		children: PropTypes.node.isRequired,
		disabled: PropTypes.bool,
		tag: PropTypes.string
	},

	defaultProps: {
		disabled: false,
		tag: 'div'
	},

	styles: {
		css,
		className: 'item'
	},

	render: ({tag: Tag, ...rest}) => {
		delete rest.index;
		delete rest.pressed;

		return (
			<Tag {...rest} />
		);
	}
});

const Item = Spottable(Pressable(ItemBase));

export default Item;
export {Item, ItemBase};
