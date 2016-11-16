import Button from '@enact/moonstone/Button';
import CheckboxItem from '@enact/moonstone/CheckboxItem';
import RadioItem from '@enact/moonstone/RadioItem';
import SwitchItem from '@enact/moonstone/SwitchItem';
import Selectable from '@enact/ui/Selectable';
import ToggleButton from '@enact/moonstone/ToggleButton';
import Group from '@enact/ui/Group';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select} from '@kadira/storybook-addon-knobs';

const SelectableGroup = Selectable(Group);

SelectableGroup.displayName = 'Group';
SelectableGroup.propTypes = Object.assign({}, Group.propTypes, Selectable.propTypes);
SelectableGroup.defaultProps = Object.assign({}, Group.defaultProps, Selectable.defaultProps);

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
			<SelectableGroup
				childComponent={getComponent(select('childComponent', Object.keys(prop.children), 'CheckboxItem'))}
				itemProps={{
					inline: boolean('ItemProps-Inline', false)
				}}
				select={select('select', ['single', 'radio', 'multiple'], 'radio')}
				selectedProp="selected"
				defaultSelected={0}
				onSelect={action('onSelect')}
			>
				{['Item 1', 'Item 2', 'Item 3']}
			</SelectableGroup>
		)
	);
