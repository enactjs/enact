import Changeable from '@enact/ui/Changeable';
import DatePicker from '@enact/moonstone/DatePicker';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, date, text} from '@kadira/storybook-addon-knobs';

const Picker = Changeable(DatePicker);

storiesOf('DatePicker')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'The basic DatePicker',
		() => (
			<Picker
				title={text('title', 'Date')}
				noneText={text('noneText', 'Nothing Selected')}
				onChange={action('onChange')}
			/>
		)
	);
