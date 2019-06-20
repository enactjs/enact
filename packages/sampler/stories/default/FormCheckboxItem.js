import FormCheckboxItem from '@enact/moonstone/FormCheckboxItem';
import ToggleItem from '@enact/moonstone/ToggleItem';
import UiToggleItem, {ToggleItemBase as UiToggleItemBase} from '@enact/ui/ToggleItem';
import Item, {ItemBase} from '@enact/moonstone/Item';
import Icon from '@enact/moonstone/Icon';
import {listIcons} from './icons';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {boolean, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata, nullify} from '../../src/utils';

FormCheckboxItem.displayName = 'FormCheckboxItem';
const Config = mergeComponentMetadata('FormCheckboxItem', ItemBase, Item, UiToggleItemBase, UiToggleItem, ToggleItem, FormCheckboxItem);

storiesOf('Moonstone', module)
	.add(
		'FormCheckboxItem',
		() => {
			const iconPosition = select('iconPosition', ['before', 'after'], Config);
			const icon = select('itemIcon', ['', ...listIcons], Config);
			const itemIcon = nullify(icon ? <Icon small>{icon}</Icon> : null);
			const itemIconPosition = select('itemIconPosition', [null, 'before', 'beforeChildren', 'afterChildren', 'after'], Config);
			return (
				<FormCheckboxItem
					disabled={boolean('disabled', Config)}
					iconPosition={iconPosition}
					inline={boolean('inline', Config)}
					itemIcon={itemIcon}
					itemIconPosition={itemIconPosition}
					onToggle={action('onToggle')}
				>
					{text('children', Config, 'A Checkbox for a form')}
				</FormCheckboxItem>
			);
		},
		{
			info: {
				text: 'Basic usage of FormCheckboxItem'
			}
		}
	);
