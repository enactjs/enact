import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, select} from '@enact/storybook-utils/addons/knobs';
import Button from '@enact/ui/Button';
import Item from '@enact/ui/Item';
import Group from '@enact/ui/Group';
import {SlotItem as UISlotItem} from '@enact/ui/SlotItem';
import React from 'react';
import {storiesOf} from '@storybook/react';

const SlotItem = ({children, ...rest}) => (
	<UISlotItem {...rest} component={Item}>{children}</UISlotItem>
);

// Set up some defaults for info and knobs
const prop = {
	children: {
		'Button': Button,
		'SlotItem': SlotItem
	}
};

const getComponent = (name) => prop.children[name];

Group.displayName = 'Group';

storiesOf('UI', module)
	.add(
		'Group',
		() => (
			<Group
				childComponent={getComponent(select('childComponent', Object.keys(prop.children), Group, 'Button'))}
				itemProps={{
					inline: boolean('ItemProps-Inline', Group)
				}}
				select={select('select', ['single', 'radio', 'multiple'], Group, 'radio')}
				selectedProp="selected"
				defaultSelected={0}
				onSelect={action('onSelect')}
			>
				{['Item 1', 'Item 2', 'Item 3']}
			</Group>
		),
		{
			info: {
				text: 'Basic usage of Group'
			}
		}
	);
