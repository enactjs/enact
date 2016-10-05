import Item, {ItemBase} from '@enact/moonstone/Item';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {boolean} from '@kadira/storybook-addon-knobs';

Item.propTypes = Object.assign({}, ItemBase.propTypes, Item.propTypes);
Item.defaultProps = Object.assign({}, ItemBase.defaultProps, Item.defaultProps);
Item.displayName = 'Item';

storiesOf('Item')
	.addWithInfo(
		' ',
		'Basic usage of Item',
		() => (
			<Item
				disabled={boolean('disabled')}
			>
				Hello Item
			</Item>
		));
