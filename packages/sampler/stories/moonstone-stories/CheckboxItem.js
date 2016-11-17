import CheckboxItem from '@enact/moonstone/CheckboxItem';
import ToggleItem from '@enact/moonstone/ToggleItem';
import Item, {ItemBase} from '@enact/moonstone/Item';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

CheckboxItem.displayName = 'CheckboxItem';
CheckboxItem.propTypes = Object.assign({}, ItemBase.propTypes, Item.propTypes, ToggleItem.propTypes, CheckboxItem.propTypes);
CheckboxItem.defaultProps = Object.assign({}, ItemBase.defaultProps, Item.defaultProps, ToggleItem.defaultProps, CheckboxItem.defaultProps);

delete CheckboxItem.propTypes.selected;
delete CheckboxItem.defaultProps.selected;

storiesOf('CheckboxItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of CheckboxItem',
		() => (
			<CheckboxItem
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				{text('children', 'Hello CheckboxItem')}
			</CheckboxItem>
		));
