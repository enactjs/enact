import Changeable from '@enact/ui/Changeable';
import {TimePicker, TimePickerController} from '@enact/moonstone/TimePicker';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

const Picker = Changeable(TimePicker);
Picker.propTypes = TimePickerController.propTypes;
Picker.defaultProps = TimePickerController.defaultProps;
Picker.displayName = 'TimePicker';

storiesOf('TimePicker')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'The basic TimePicker',
		() => (
			<Picker
				title={text('title', 'Time')}
				noLabels={boolean('noLabels', false)}
				noneText={text('noneText', 'Nothing Selected')}
				onChange={action('onChange')}
			/>
		)
	);
