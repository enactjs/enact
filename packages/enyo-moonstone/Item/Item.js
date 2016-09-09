import React, {PropTypes} from 'react';
import kind from 'enyo-core/kind';
import {Spottable} from 'enyo-spotlight';
import Pressable from 'enyo-ui/Pressable';

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
