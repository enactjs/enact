import ToggleItem from '@enact/moonstone/ToggleItem';
import SelectableItem from '@enact/moonstone/SelectableItem';
import Item, {ItemBase} from '@enact/moonstone/Item';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('SelectableItem', ItemBase, Item, ToggleItem, SelectableItem);

storiesOf('Moonstone', module)
	.add(
		'SelectableItem',
		withInfo({
			propTables: [Config],
			text: 'Basic usage of SelectableItem'
		})(() => (
			<SelectableItem
				disabled={boolean('disabled', false)}
				inline={nullify(boolean('inline', false))}
				onToggle={action('onToggle')}
			>
				{text('children', 'Hello SelectableItem')}
			</SelectableItem>
		))
	);
