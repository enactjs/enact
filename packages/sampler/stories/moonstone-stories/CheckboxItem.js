import CheckboxItem from '@enact/moonstone/CheckboxItem';
import ToggleItem from '@enact/moonstone/ToggleItem';
import UiToggleItem, {ToggleItemBase as UiToggleItemBase} from '@enact/ui/ToggleItem';
import Item, {ItemBase} from '@enact/moonstone/Item';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import {mergeComponentMetadata, smartSelect} from '../../src/utils';

const Config = mergeComponentMetadata('CheckboxItem', ItemBase, Item, UiToggleItemBase, UiToggleItem, ToggleItem, CheckboxItem);

storiesOf('Moonstone', module)
	.add(
		'CheckboxItem',
		withInfo({
			propTables: [Config],
			text: 'Basic usage of CheckboxItem'
		})(() => (
			<CheckboxItem
				disabled={boolean('disabled', false)}
				iconPosition={smartSelect('iconPosition', ['before', 'after'], Config)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				{text('children', 'Hello CheckboxItem')}
			</CheckboxItem>
		))
	);
