import {icons} from '@enact/moonstone/Icon';
import Item, {ItemBase} from '@enact/moonstone/Item';
import React from 'react';
import Toggleable from '@enact/ui/Toggleable';
import ToggleItem from '@enact/moonstone/ToggleItem';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

import {mergeComponentMetadata} from '../../src/utils/propTables';

const iconNames = Object.keys(icons);

const Component = Toggleable({prop: 'selected'}, ToggleItem);
Component.displayName = 'Toggleable(ToggleItem)';

const Config = mergeComponentMetadata('ToggleItem', ItemBase, Item, ToggleItem);

storiesOf('ToggleItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'The basic ToggleItem',
		() => (
			<Component
				icon={select('icon', iconNames, 'lock')}
				iconPosition={select('iconPosition', ['before', 'after'], 'before')}
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				{text('children', 'Toggle Item')}
			</Component>
		),
		{propTables: [Config]}
	);
