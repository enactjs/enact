import Item, {ItemBase} from '@enact/moonstone/Item';
import UiItem, {ItemBase as UiItemBase} from '@enact/ui/Item';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';

import {boolean, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('Item', UiItemBase, UiItem, ItemBase, Item);
Item.displayName = 'Item';

storiesOf('Moonstone', module)
	.add(
		'Item',
		withInfo({
			text: 'Basic usage of Item'
		})(() => (
			<Item
				disabled={boolean('disabled', Config)}
				inline={boolean('inline', Config)}
			>
				{text('children', Config, 'Hello Item')}
			</Item>
		))
	);
