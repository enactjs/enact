import Item, {ItemBase} from '@enact/moonstone/Item';
import LabeledItem from '@enact/moonstone/LabeledItem';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {boolean, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('LabeledItem', ItemBase, Item, LabeledItem);

storiesOf('Moonstone', module)
	.add(
		'LabeledItem',
		withInfo({
			propTables: [Config],
			text: 'Basic usage of LabeledItem'
		})(() => (
			<LabeledItem
				label={text('label', 'Label')}
				disabled={boolean('disabled', false)}
			>
				{text('children', 'Hello LabeledItem')}
			</LabeledItem>
		))
	);
