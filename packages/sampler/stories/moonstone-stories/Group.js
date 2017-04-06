import Button from '@enact/moonstone/Button';
import CheckboxItem from '@enact/moonstone/CheckboxItem';
import RadioItem from '@enact/moonstone/RadioItem';
import SwitchItem from '@enact/moonstone/SwitchItem';

import ToggleButton from '@enact/moonstone/ToggleButton';
import Group from '@enact/ui/Group';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select} from '@kadira/storybook-addon-knobs';

// Set up some defaults for info and knobs
const prop = {
	children: {
		'Button': Button,
		'CheckboxItem': CheckboxItem,
		'RadioItem': RadioItem,
		'SwitchItem': SwitchItem,
		'ToggleButton': ToggleButton
	}
};

const getComponent = (name) => prop.children[name];

storiesOf('Group')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of Group',
		() => (
			<Group
				childComponent={getComponent(select('childComponent', Object.keys(prop.children), 'CheckboxItem'))}
				defaultSelected={0}
				itemProps={{
					disabled: boolean('itemProps-disabled', false),
					inline: boolean('ItemProps-Inline', false)
				}}
				onSelect={action('onSelect')}
				select={select('select', ['single', 'radio', 'multiple'], 'radio')}
				selectedProp="selected"
			>
				{['Item 1', 'Item 2', 'Item 3']}
			</Group>
		)
	);
