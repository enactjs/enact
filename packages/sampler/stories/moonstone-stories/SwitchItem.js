import Item, {ItemBase} from '@enact/moonstone/Item';
import React from 'react';
import {SwitchItem} from '@enact/moonstone/SwitchItem';
import Toggleable from '@enact/ui/Toggleable';
import ToggleItem from '@enact/moonstone/ToggleItem';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

const Component = Toggleable({prop: 'selected'}, SwitchItem);
Component.propTypes = Object.assign({}, ItemBase.propTypes, Item.propTypes, ToggleItem.propTypes, SwitchItem.propTypes);
Component.defaultProps = Object.assign({}, ItemBase.defaultProps, Item.defaultProps, ToggleItem.defaultProps, SwitchItem.defaultProps);
Component.displayName = 'SwitchItem';

storiesOf('SwitchItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of SwitchItem',
		() => (
			<Component
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				{text('children', 'Hello SwitchItem')}
			</Component>
		)
	);
