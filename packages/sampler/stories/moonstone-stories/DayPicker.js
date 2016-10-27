import DayPicker from '@enact/moonstone/DayPicker';
import React from 'react';
import Selectable from '@enact/ui/Selectable';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

const SelectableDayPicker = Selectable(DayPicker);
SelectableDayPicker.displayName = 'DayPicker';

storiesOf('DayPicker')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of DayPicker',
		() => (
			<SelectableDayPicker
				title={text('title', 'Expandable Day Picker')}
				noneText={text('none', 'none')}
				disabled={boolean('disabled', false)}
				onSelect={action('onSelect')}
			/>
		)
	);
