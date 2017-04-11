import Item, {ItemBase} from '@enact/moonstone/Item';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('Item', ItemBase, Item);

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
		),
		{propTables: [Config]}
	);
