import CheckboxItem from '@enact/moonstone/CheckboxItem';
import ToggleItem from '@enact/moonstone/ToggleItem';
import UiToggleItem, {ToggleItemBase as UiToggleItemBase} from '@enact/ui/ToggleItem';
import Item, {ItemBase} from '@enact/moonstone/Item';
import Icon from '@enact/moonstone/Icon';
import {listIcons} from './icons';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {boolean, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

CheckboxItem.displayName = 'CheckboxItem';
const Config = mergeComponentMetadata('CheckboxItem', ItemBase, Item, UiToggleItemBase, UiToggleItem, ToggleItem, CheckboxItem);

storiesOf('Moonstone', module)
	.add(
		'CheckboxItem',
		withInfo({
			text: 'Basic usage of CheckboxItem'
		})(() => {
			const iconPosition = select('iconPosition', ['before', 'after'], Config);
			const icon = select('itemIcon', ['', ...listIcons], Config);
			const itemIcon = (icon ? <Icon small>{icon}</Icon> : null);
			const itemIconPosition = select('itemIconPosition', [null, 'before', 'beforeChildren', 'afterChildren', 'after'], Config);
			return (
				<CheckboxItem
					// disabled and inline have problems when set to `null` from the internal nullify...
					disabled={boolean('disabled', Config, false)}
					iconPosition={iconPosition}
					inline={boolean('inline', Config)}
					itemIcon={itemIcon}
					itemIconPosition={itemIconPosition}
					onToggle={action('onToggle')}
				>
					{text('children', Config, 'Hello CheckboxItem')}
				</CheckboxItem>
			);
		})
	);
