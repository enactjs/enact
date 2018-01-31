import Item, {ItemBase} from '@enact/moonstone/Item';
import React from 'react';
import {SwitchItem} from '@enact/moonstone/SwitchItem';
import ToggleItem from '@enact/moonstone/ToggleItem';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('SwitchItem', ItemBase, Item, ToggleItem, SwitchItem);

storiesOf('Moonstone', module)
	.add(
		'SwitchItem',
		withInfo({
			propTables: [Config],
			text: 'Basic usage of SwitchItem'
		})(() => (
			<SwitchItem
				disabled={boolean('disabled', false)}
				inline={nullify(boolean('inline', false))}
				onToggle={action('onToggle')}
			>
				{text('children', 'Hello SwitchItem')}
			</SwitchItem>
		))
	);
