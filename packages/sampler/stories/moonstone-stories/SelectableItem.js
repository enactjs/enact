import Item, {ItemBase} from '@enact/moonstone/Item';
import React from 'react';
import SelectableItem from '@enact/moonstone/SelectableItem';
import Toggleable from '@enact/ui/Toggleable';
import ToggleItem from '@enact/moonstone/ToggleItem';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

const Component = Toggleable({prop: 'selected'}, SelectableItem);
Component.displayName = 'Toggleable(SelectableItem)';

const Config = {
	propTypes: Object.assign({}, ItemBase.propTypes, Item.propTypes, ToggleItem.propTypes, SelectableItem.propTypes),
	defaultProps: Object.assign({}, ItemBase.defaultProps, Item.defaultProps, ToggleItem.defaultProps, SelectableItem.defaultProps),
	displayName: 'SelectableItem'
};

storiesOf('SelectableItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of SelectableItem',
		() => (
			<Component
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				{text('children', 'Hello SelectableItem')}
			</Component>
		),
		{propTables: [Config]}
	);
