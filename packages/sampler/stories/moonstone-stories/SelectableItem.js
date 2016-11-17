import SelectableItem from '@enact/moonstone/SelectableItem';
import ToggleItem from '@enact/moonstone/ToggleItem';
import Item, {ItemBase} from '@enact/moonstone/Item';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

SelectableItem.displayName = 'SelectableItem';
SelectableItem.propTypes = Object.assign({}, ItemBase.propTypes, Item.propTypes, ToggleItem.propTypes, SelectableItem.propTypes);
SelectableItem.defaultProps = Object.assign({}, ItemBase.defaultProps, Item.defaultProps, ToggleItem.defaultProps, SelectableItem.defaultProps);

delete SelectableItem.propTypes.selected;
delete SelectableItem.defaultProps.selected;

storiesOf('SelectableItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of SelectableItem',
		() => (
			<SelectableItem
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				{text('children', 'Hello SelectableItem')}
			</SelectableItem>
		)
	);
