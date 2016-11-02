import Changeable from '@enact/ui/Changeable';
import {TimePicker, TimePickerBase} from '@enact/moonstone/TimePicker';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, text} from '@kadira/storybook-addon-knobs';

const Picker = Changeable(TimePicker);
Picker.propTypes = Object.assign({}, TimePickerBase.propTypes, TimePicker.propTypes);
Picker.defaultProps = Object.assign({}, TimePickerBase.propTypes, TimePicker.defaultProps);
Picker.displayName = 'TimePicker';

storiesOf('TimePicker')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'The basic TimePicker',
		() => (
			<Picker
				title={text('title', 'Time')}
				noneText={text('noneText', 'Nothing Selected')}
				onChange={action('onChange')}
			/>
		)
	);
