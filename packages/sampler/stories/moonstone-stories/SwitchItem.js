import Item, {ItemBase} from '@enact/moonstone/Item';
import React from 'react';
import {SwitchItem} from '@enact/moonstone/SwitchItem';
import ToggleItem from '@enact/moonstone/ToggleItem';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('SwitchItem', ItemBase, Item, ToggleItem, SwitchItem);

storiesOf('SwitchItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of SwitchItem',
		() => (
			<SwitchItem
				disabled={boolean('disabled', false)}
				inline={nullify(boolean('inline', false))}
				onToggle={action('onToggle')}
			>
				{text('children', 'Hello SwitchItem')}
			</SwitchItem>
		),
		{propTables: [Config]}
	);
