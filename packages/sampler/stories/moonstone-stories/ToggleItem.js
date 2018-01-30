import icons from './icons';
import ToggleItem from '@enact/moonstone/ToggleItem';
import ToggleItemIcon from '@enact/moonstone/ToggleItem/ToggleItemIcon';
import Item, {ItemBase} from '@enact/moonstone/Item';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, select, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('ToggleItem', ItemBase, Item, ToggleItem);

storiesOf('Moonstone', module)
	.add(
		'ToggleItem',
		withInfo({
			propTables: [Config],
			text: 'The basic ToggleItem'
		})(() => (
			<ToggleItem
				toggleIcon={ItemIcon}
				iconPosition={select('iconPosition', ['before', 'after'], 'before')}
				disabled={boolean('disabled', false)}
				inline={nullify(boolean('inline', false))}
				onToggle={action('onToggle')}
			>
				{text('children', 'Toggle Item')}
			</ToggleItem>
		))
	);
