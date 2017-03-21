import CheckboxItem from '@enact/moonstone/CheckboxItem';
import Item, {ItemBase} from '@enact/moonstone/Item';
import React from 'react';
import Toggleable from '@enact/ui/Toggleable';
import ToggleItem from '@enact/moonstone/ToggleItem';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

const Component = Toggleable({prop: 'selected'}, CheckboxItem);
Component.displayName = 'Toggleable(CheckboxItem)';

const Config = {
	propTypes: Object.assign({}, ItemBase.propTypes, Item.propTypes, ToggleItem.propTypes, CheckboxItem.propTypes),
	defaultProps: Object.assign({}, ItemBase.defaultProps, Item.defaultProps, ToggleItem.defaultProps, CheckboxItem.defaultProps),
	displayName: 'CheckboxItem'
};

storiesOf('CheckboxItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of CheckboxItem',
		() => (
			<Component
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				{text('children', 'Hello CheckboxItem')}
			</Component>
		),
		{propTables: [Config]}
	);
