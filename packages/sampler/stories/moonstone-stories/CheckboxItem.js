import CheckboxItem from '@enact/moonstone/CheckboxItem';
import Item, {ItemBase} from '@enact/moonstone/Item';
import React from 'react';
import Toggleable from '@enact/ui/Toggleable';
import ToggleItem from '@enact/moonstone/ToggleItem';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

import {mergeComponentMetadata} from '../../src/utils/propTables';

const Component = Toggleable({prop: 'selected'}, CheckboxItem);
Component.displayName = 'Toggleable(CheckboxItem)';

const Config = mergeComponentMetadata('CheckboxItem', ItemBase, Item, ToggleItem, CheckboxItem);

storiesOf('CheckboxItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of CheckboxItem',
		() => (
			<Component
				disabled={boolean('disabled', false)}
				iconPosition={select('iconPosition', ['before', 'after'], 'before')}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				{text('children', 'Hello CheckboxItem')}
			</Component>
		),
		{propTables: [Config]}
	);
