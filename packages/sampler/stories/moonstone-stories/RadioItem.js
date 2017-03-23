import Item, {ItemBase} from '@enact/moonstone/Item';
import RadioItem from '@enact/moonstone/RadioItem';
import React from 'react';
import Toggleable from '@enact/ui/Toggleable';
import ToggleItem from '@enact/moonstone/ToggleItem';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

import {mergeComponentMetadata} from '../../src/utils/propTables';

const Component = Toggleable({prop: 'selected'}, RadioItem);
Component.displayName = 'Toggleable(RadioItem)';

const Config = mergeComponentMetadata('RadioItem', ItemBase, Item, ToggleItem, RadioItem);

storiesOf('RadioItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of RadioItem',
		() => (
			<Component
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				{text('children', 'Hello RadioItem')}
			</Component>
		),
		{propTables: [Config]}
	);
