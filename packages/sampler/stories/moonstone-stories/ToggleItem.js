import Item, {ItemBase} from '@enact/moonstone/Item';
import React from 'react';
import Toggleable from '@enact/ui/Toggleable';
import ToggleItem from '@enact/moonstone/ToggleItem';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

import {icons} from '@enact/moonstone/Icon';
const iconNames = Object.keys(icons);

const Component = Toggleable({prop: 'selected'}, ToggleItem);
Component.propTypes = Object.assign({}, ItemBase.propTypes, Item.propTypes, ToggleItem.propTypes);
Component.defaultProps = Object.assign({}, ItemBase.defaultProps, Item.defaultProps, ToggleItem.defaultProps);
Component.displayName = 'ToggleItem';

storiesOf('ToggleItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'The basic ToggleItem',
		() => {
			return (
				<Component
					icon={select('icon', iconNames, 'lock')}
					iconPosition={select('iconPosition', ['before', 'after'], 'before')}
					disabled={boolean('disabled', false)}
					inline={boolean('inline', false)}
					onToggle={action('onToggle')}
				>
					{text('children', 'Toggle Item')}
				</Component>
			);
		}
	);
