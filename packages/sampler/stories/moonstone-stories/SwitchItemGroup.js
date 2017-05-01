import SwitchItem from '@enact/moonstone/SwitchItem';
import Selectable from '@enact/ui/Selectable';
import Group from '@enact/ui/Group';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select} from '@kadira/storybook-addon-knobs';
import {icons} from '@enact/moonstone/Icon';
const iconNames = Object.keys(icons);

const SelectableGroup = Selectable(Group);

SelectableGroup.displayName = 'SelectableGroup';
SelectableGroup.propTypes = Object.assign({}, Group.propTypes, Selectable.propTypes);
SelectableGroup.defaultProps = Object.assign({}, Group.defaultProps, Selectable.defaultProps);

storiesOf('SwitchItemGroup')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of SwitchItemGroup',
		() => (
			<SelectableGroup
				childComponent={SwitchItem}
				itemProps={{
					inline: boolean('ItemProps-Inline', false),
				}}
				selectedProp="checked"
				defaultSelected={0}
				onSelect={action('onSelect')}
			>
				{['Switch Item 1', 'Switch Item 2', 'Switch Item 3']}
			</SelectableGroup>
		)
	);
