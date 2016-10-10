import Button from '@enact/moonstone/Button';
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

storiesOf('ButtonGroup')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of RadioItem',
		() => (
			<SelectableGroup
				childComponent={Button}
				itemProps={{}}
				selectedProp="selected"
				defaultSelected={0}
				onSelect={action('onSelect')}
			>
				{['Toggle Item 1', 'Toggle Item 2', 'Toggle Item 3']}
			</SelectableGroup>
		)
	);
