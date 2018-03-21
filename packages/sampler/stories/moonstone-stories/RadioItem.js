import RadioItem from '@enact/moonstone/RadioItem';
import ToggleItem from '@enact/moonstone/ToggleItem';
import Item, {ItemBase} from '@enact/moonstone/Item';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('RadioItem', ItemBase, Item, ToggleItem, RadioItem);

storiesOf('Moonstone', module)
	.add(
		'RadioItem',
		withInfo({
			propTables: [Config],
			text: 'Basic usage of RadioItem'
		})(() => (
			<RadioItem
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				{text('children', 'Hello RadioItem')}
			</RadioItem>
		))
	);
