import LabeledItem from '@enact/moonstone/LabeledItem';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';

import {boolean, text} from '../../src/enact-knobs';
LabeledItem.displayName = 'LabeledItem';

storiesOf('Moonstone', module)
	.add(
		'LabeledItem',
		withInfo({
			text: 'Basic usage of LabeledItem'
		})(() => (
			<LabeledItem
				label={text('label', LabeledItem, 'Label')}
				disabled={boolean('disabled', LabeledItem)}
			>
				{text('children', LabeledItem, 'Hello LabeledItem')}
			</LabeledItem>
		))
	);
