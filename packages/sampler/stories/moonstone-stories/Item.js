import Icon from '@enact/moonstone/Icon';
import {Item, ItemOverlay} from '@enact/moonstone/Item';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

Item.propTypes = Object.assign({}, Item.propTypes);
Item.defaultProps = Object.assign({}, Item.defaultProps);
Item.displayName = 'Item';

storiesOf('Item')
	.addDecorator(withKnobs)
	.addWithInfo(
		'Basic',
		'Basic usage of Item',
		() => (
			<Item
				disabled={boolean('disabled', false)}
			>
				{text('children', 'Hello Item')}
			</Item>
		));
