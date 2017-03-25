import Item, {ItemBase} from '@enact/moonstone/Item';
import React from 'react';
import {SwitchItem} from '@enact/moonstone/SwitchItem';
import Toggleable from '@enact/ui/Toggleable';
import ToggleItem from '@enact/moonstone/ToggleItem';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

import {mergeComponentMetadata} from '../../src/utils/propTables';

const Component = Toggleable({prop: 'selected'}, SwitchItem);
Component.displayName = 'Toggleable(SwitchItem)';

const Config = mergeComponentMetadata('SwitchItem', ItemBase, Item, ToggleItem, SwitchItem);

storiesOf('SwitchItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of SwitchItem',
		() => (
			<Component
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				{text('children', 'Hello SwitchItem')}
			</Component>
		),
		{propTables: [Config]}
	);
