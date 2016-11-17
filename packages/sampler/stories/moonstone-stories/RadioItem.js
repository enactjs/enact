import RadioItem from '@enact/moonstone/RadioItem';
import ToggleItem from '@enact/moonstone/ToggleItem';
import Item, {ItemBase} from '@enact/moonstone/Item';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

RadioItem.displayName = 'RadioItem';
RadioItem.propTypes = Object.assign({}, ItemBase.propTypes, Item.propTypes, ToggleItem.propTypes, RadioItem.propTypes);
RadioItem.defaultProps = Object.assign({}, ItemBase.defaultProps, Item.defaultProps, ToggleItem.defaultProps, RadioItem.defaultProps);

delete RadioItem.propTypes.selected;
delete RadioItem.defaultProps.selected;

storiesOf('RadioItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of RadioItem',
		() => (
			<RadioItem
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				{text('children', 'Hello RadioItem')}
			</RadioItem>
		)
	);
