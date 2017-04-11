import ToggleItem from '@enact/moonstone/ToggleItem';
import SelectableItem from '@enact/moonstone/SelectableItem';
import Item, {ItemBase} from '@enact/moonstone/Item';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('SelectableItem', ItemBase, Item, ToggleItem, SelectableItem);

storiesOf('SelectableItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of SelectableItem',
		() => (
			<SelectableItem
				disabled={boolean('disabled', false)}
				inline={nullify(boolean('inline', false))}
				onToggle={action('onToggle')}
			>
				{text('children', 'Hello SelectableItem')}
			</SelectableItem>
		),
		{propTables: [Config]}
	);
