import Item, {ItemBase} from '@enact/moonstone/Item';
import RadioItem from '@enact/moonstone/RadioItem';
import React from 'react';
import Toggleable from '@enact/ui/Toggleable';
import ToggleItem from '@enact/moonstone/ToggleItem';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

const Component = Toggleable({prop: 'selected'}, RadioItem);
Component.displayName = 'Toggleable(RadioItem)';

const Config = {
	propTypes: Object.assign({}, ItemBase.propTypes, Item.propTypes, ToggleItem.propTypes, RadioItem.propTypes),
	defaultProps: Object.assign({}, ItemBase.defaultProps, Item.defaultProps, ToggleItem.defaultProps, RadioItem.defaultProps),
	displayName: 'RadioItem'
};

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
