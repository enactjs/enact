import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, select, text} from '@enact/storybook-utils/addons/knobs';
import Icon from '@enact/moonstone/Icon';
import Item, {ItemBase} from '@enact/moonstone/Item';
import {listIcons} from './icons';
import {mergeComponentMetadata, nullify} from '@enact/storybook-utils';
import React from 'react';
import SelectableItem from '@enact/moonstone/SelectableItem';
import {storiesOf} from '@storybook/react';
import ToggleItem from '@enact/moonstone/ToggleItem';
import UiToggleItem, {ToggleItemBase as UiToggleItemBase} from '@enact/ui/ToggleItem';

SelectableItem.displayName = 'SelectableItem';
const Config = mergeComponentMetadata('SelectableItem', ItemBase, Item, UiToggleItemBase, UiToggleItem, ToggleItem, SelectableItem);

storiesOf('Moonstone', module)
	.add(
		'SelectableItem',
		() => {
			const iconPosition = select('iconPosition', ['before', 'after'], Config);
			const icon = select('itemIcon', ['', ...listIcons], Config);
			const itemIcon = nullify(icon ? <Icon>{icon}</Icon> : null);
			const itemIconPosition = select('itemIconPosition', [null, 'before', 'beforeChildren', 'afterChildren', 'after'], Config);
			return (
				<SelectableItem
					disabled={boolean('disabled', Config)}
					iconPosition={iconPosition}
					inline={boolean('inline', Config)}
					itemIcon={itemIcon}
					itemIconPosition={itemIconPosition}
					onToggle={action('onToggle')}
				>
					{text('children', Config, 'Hello SelectableItem')}
				</SelectableItem>
			);
		},
		{
			info: {
				text: 'Basic usage of SelectableItem'
			}
		}
	);
