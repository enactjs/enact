import Item from '@enact/moonstone/Item';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

Item.propTypes = Object.assign({}, Item.propTypes);
Item.defaultProps = Object.assign({}, Item.defaultProps);
Item.displayName = 'Item';

storiesOf('Item')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of Item',
		() => (
			<Item
				disabled={boolean('disabled', false)}
			>
				{text('children', 'Hello Item')}
			</Item>
		));
