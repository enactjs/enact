import Changeable from '@enact/ui/Changeable';
import {DatePicker, DatePickerController} from '@enact/moonstone/DatePicker';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

const Picker = Changeable(DatePicker);
Picker.propTypes = DatePickerController.propTypes;
Picker.defaultProps = DatePickerController.defaultProps;
Picker.displayName = 'DatePicker';

storiesOf('DatePicker')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'The basic DatePicker',
		() => (
			<Picker
				title={text('title', 'Date')}
				noLabels={boolean('noLabels', false)}
				noneText={text('noneText', 'Nothing Selected')}
				onChange={action('onChange')}
			/>
		)
	);
