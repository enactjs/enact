import LabeledItem from '@enact/moonstone/LabeledItem';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {boolean, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

LabeledItem.displayName = 'LabeledItem';

storiesOf('Moonstone', module)
	.add(
		'LabeledItem',
		withInfo({
			propTablesExclude: [LabeledItem],
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
