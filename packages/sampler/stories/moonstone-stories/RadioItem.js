import RadioItem from '@enact/moonstone/RadioItem';
import ToggleItem from '@enact/moonstone/ToggleItem';
import UiToggleItem, {ToggleItemBase as UiToggleItemBase} from '@enact/ui/ToggleItem';
import Item, {ItemBase} from '@enact/moonstone/Item';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {boolean, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('RadioItem', ItemBase, Item, UiToggleItemBase, UiToggleItem, ToggleItem, RadioItem);

storiesOf('Moonstone', module)
	.add(
		'RadioItem',
		withInfo({
			text: 'Basic usage of RadioItem'
		})(() => (
			<RadioItem
				disabled={boolean('disabled', Config)}
				inline={boolean('inline', Config)}
				onToggle={action('onToggle')}
			>
				{text('children', Config, 'Hello RadioItem')}
			</RadioItem>
		))
	);
