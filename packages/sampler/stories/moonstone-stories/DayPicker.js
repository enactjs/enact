import DayPicker from '@enact/moonstone/DayPicker';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

storiesOf('DayPicker')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of DayPicker',
		() => (
			<DayPicker
				title={text('title', 'Day Picker')}
				noneText={text('none', 'none')}
				disabled={boolean('disabled', false)}
				onSelect={action('onSelect')}
				onOpen={action('onOpen')}
				onClose={action('onClose')}
			/>
		),
		{propTables: [DayPicker]}
	);
