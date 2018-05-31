import RadioItem from '@enact/moonstone/RadioItem';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

storiesOf('Moonstone', module)
	.add(
		'RadioItem',
		withInfo({
			propTablesExclude: [RadioItem],
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
