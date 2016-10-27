import ExpandableDayPicker from '@enact/moonstone/ExpandableDayPicker';
import React from 'react';
import Selectable from '@enact/ui/Selectable';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

const DayPicker = Selectable(ExpandableDayPicker);
DayPicker.displayName = 'ExpandableDayPicker';

storiesOf('ExpandableDayPicker')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of ExpandableDayPicker',
		() => (
			<DayPicker
				title={text('title', 'Expandable Day Picker')}
				noneText={text('none', 'none')}
				disabled={boolean('disabled', false)}
				onSelect={action('onSelect')}
			/>
		)
	);
