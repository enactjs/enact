import CheckboxItem from '@enact/moonstone/CheckboxItem';
import Item, {ItemBase} from '@enact/moonstone/Item';
import React from 'react';
import Toggleable from '@enact/ui/Toggleable';
import ToggleItem from '@enact/moonstone/ToggleItem';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

const Component = Toggleable({prop: 'selected'}, CheckboxItem);
Component.propTypes = Object.assign({}, ItemBase.propTypes, Item.propTypes, ToggleItem.propTypes, CheckboxItem.propTypes);
Component.defaultProps = Object.assign({}, ItemBase.defaultProps, Item.defaultProps, ToggleItem.defaultProps, CheckboxItem.defaultProps);
Component.displayName = 'CheckboxItem';

storiesOf('CheckboxItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of CheckboxItem',
		() => (
			<Component
				disabled={boolean('disabled', false)}
				iconPosition={select('iconPosition', ['before', 'after'], 'before')}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				{text('children', 'Hello CheckboxItem')}
			</Component>
		));
