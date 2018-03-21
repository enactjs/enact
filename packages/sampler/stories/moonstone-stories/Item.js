import Item, {ItemBase} from '@enact/moonstone/Item';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {boolean, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('Item', ItemBase, Item);

storiesOf('Moonstone', module)
	.add(
		'Item',
		withInfo({
			propTables: [Config],
			text: 'Basic usage of Item'
		})(() => (
			<Item
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
			>
				{text('children', 'Hello Item')}
			</Item>
		))
	);
