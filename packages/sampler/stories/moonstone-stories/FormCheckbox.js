import CheckboxItem from '@enact/moonstone/CheckboxItem';
import Selectable from '@enact/ui/Selectable';
import Group from '@enact/ui/Group';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean} from '@kadira/storybook-addon-knobs';

const SelectableGroup = Selectable(Group);

SelectableGroup.displayName = 'SelectableGroup';
SelectableGroup.propTypes = Object.assign({}, Group.propTypes, Selectable.propTypes);
SelectableGroup.defaultProps = Object.assign({}, Group.defaultProps, Selectable.defaultProps);

storiesOf('FormCheckbox')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of FormCheckbox',
		() => (
			<SelectableGroup
				childComponent={CheckboxItem}
				itemProps={{
					inline: boolean('ItemProps-Inline', false),
				}}
				selectedProp="checked"
				defaultSelected={0}
				onSelect={action('onSelect')}
			>
				{['Checkbox Item 1', 'Checkbox Item 2', 'Checkbox Item 3']}
			</SelectableGroup>
		)
	);
