import LabeledItem from '@enact/moonstone/LabeledItem';
import React from 'react';
import {storiesOf} from '@storybook/react';

import {boolean, select, text} from '../../src/enact-knobs';
LabeledItem.displayName = 'LabeledItem';

storiesOf('Moonstone', module)
	.add(
		'LabeledItem',
		() => (
			<LabeledItem
				label={text('label', LabeledItem, 'Label')}
				disabled={boolean('disabled', LabeledItem)}
				marqueeOn={select('marqueeOn', ['focus', 'hover', 'render'], LabeledItem, 'focus')}
			>
				{text('children', LabeledItem, 'Hello LabeledItem')}
			</LabeledItem>
		),
		{
			info: {
				text: 'Basic usage of LabeledItem'
			}
		}
	);
