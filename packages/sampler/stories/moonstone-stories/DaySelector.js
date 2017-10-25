import DaySelector from '@enact/moonstone/DaySelector';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {boolean} from '@kadira/storybook-addon-knobs';

storiesOf('DaySelector')
	.addWithInfo(
		' ',
		'Basic usage of DaySelector',
		() => (
			<DaySelector
				shortDayText={boolean('shortDayText', true)}
				disabled={boolean('disabled', false)}
				onSelect={action('onSelect')}
			/>
		),
		{propTables: [DaySelector]}
	);
