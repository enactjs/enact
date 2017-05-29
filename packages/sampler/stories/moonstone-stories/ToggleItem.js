import icons from './icons';
import ToggleItem from '@enact/moonstone/ToggleItem';
import Item, {ItemBase} from '@enact/moonstone/Item';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {boolean, select, text} from '@kadira/storybook-addon-knobs';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('ToggleItem', ItemBase, Item, ToggleItem);

storiesOf('ToggleItem')
	.addWithInfo(
		' ',
		'The basic ToggleItem',
		() => (
			<ToggleItem
				icon={select('icon', icons, 'lock')}
				iconPosition={select('iconPosition', ['before', 'after'], 'before')}
				disabled={boolean('disabled', false)}
				inline={nullify(boolean('inline', false))}
				onToggle={action('onToggle')}
			>
				{text('children', 'Toggle Item')}
			</ToggleItem>
		),
		{propTables: [Config]}
	);
