import Item, {ItemBase} from '@enact/moonstone/Item';
import LabeledItem from '@enact/moonstone/LabeledItem';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('LabeledItem', ItemBase, Item, LabeledItem);

storiesOf('LabeledItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of LabeledItem',
		() => (
			<LabeledItem
				label="Label"
				disabled={boolean('disabled', false)}
			>
				{text('children', 'Hello LabeledItem')}
			</LabeledItem>
		),
		{propTables: [Config]}
	);
