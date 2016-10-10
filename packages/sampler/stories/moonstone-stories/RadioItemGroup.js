import RadioItem from '@enact/moonstone/RadioItem';
import Selectable from '@enact/ui/Selectable';
import Group from '@enact/ui/Group';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean} from '@kadira/storybook-addon-knobs';

const SelectableGroup = Selectable(Group);

SelectableGroup.displayName = 'SelectableGroup';
SelectableGroup.propTypes = Object.assign({}, Group.propTypes, Selectable.propTypes);
SelectableGroup.defaultProps = Object.assign({}, Group.defaultProps, Selectable.defaultProps);

storiesOf('RadioItemGroup')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of RadioItem',
		() => (
			<SelectableGroup
				childComponent={RadioItem}
				itemProps={{inline: boolean('ItemProps-Inline', false)}}
				selectedProp="checked"
				defaultSelected={0}
				onSelect={action('onSelect')}
			>
				{['Radio Item 1', 'Radio Item 2', 'Radio Item 3']}
			</SelectableGroup>
		)
	);
