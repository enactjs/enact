import {boolean, text} from '@enact/storybook-utils/addons/knobs';
import Item, {ItemBase} from '@enact/moonstone/Item';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import React from 'react';
import {storiesOf} from '@storybook/react';
import UiItem, {ItemBase as UiItemBase} from '@enact/ui/Item';

const Config = mergeComponentMetadata('Item', UiItemBase, UiItem, ItemBase, Item);
Item.displayName = 'Item';

storiesOf('Moonstone', module)
	.add(
		'Item',
		() => (
			<Item
				disabled={boolean('disabled', Config)}
				inline={boolean('inline', Config)}
			>
				{text('children', Config, 'Hello Item')}
			</Item>
		),
		{
			info: {
				text: 'Basic usage of Item'
			}
		}
	);
