import SwitchItem from '@enact/moonstone/SwitchItem';
import ToggleItem from '@enact/moonstone/ToggleItem';
import UiToggleItem, {ToggleItemBase as UiToggleItemBase} from '@enact/ui/ToggleItem';
import Item, {ItemBase} from '@enact/moonstone/Item';
import Icon from '@enact/moonstone/Icon';
import {listIcons} from './icons';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {boolean, text, select} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

SwitchItem.displayName = 'SwitchItem';
const Config = mergeComponentMetadata('SwitchItem', ItemBase, Item, UiToggleItemBase, UiToggleItem, ToggleItem, SwitchItem);

storiesOf('Moonstone', module)
	.add(
		'SwitchItem',
		withInfo({
			text: 'Basic usage of SwitchItem'
		})(() => {
			const icon = select('itemIcon', ['', ...listIcons], Config);
			const itemIcon = (icon ? <Icon small>{icon}</Icon> : void 0);
			const itemIconPosition = select('itemIconPosition', ['', 'before', 'beforeChildren', 'afterChildren', 'after'], Config);
			return (
				<SwitchItem
					disabled={boolean('disabled', Config)}
					inline={boolean('inline', Config)}
					itemIcon={itemIcon}
					itemIconPosition={itemIconPosition}
					onToggle={action('onToggle')}
				>
					{text('children', Config, 'Hello SwitchItem')}
				</SwitchItem>
			);
		})
	);
