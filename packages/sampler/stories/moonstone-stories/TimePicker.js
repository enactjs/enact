import Changeable from '@enact/ui/Changeable';
import {TimePicker, TimePickerBase} from '@enact/moonstone/TimePicker';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

const Picker = Changeable(TimePicker);
Picker.propTypes = Object.assign({}, TimePicker.propTypes, TimePickerBase.propTypes, {
	onChange: React.PropTypes.func,
	onOpen: React.PropTypes.func,
	onClose: React.PropTypes.func,
	open: React.PropTypes.bool,
	value: React.PropTypes.instanceOf(Date)
});
Picker.defaultProps = Object.assign({}, TimePicker.defaultProps, TimePickerBase.defaultProps);
Picker.displayName = 'TimePicker';

'onChangeHour defaultOpen onChangeMeridiem hour onChangeMinute minute meridiem meridiems order'
	.split(' ')
	.forEach(prop => {
		delete Picker.propTypes[prop];
		delete Picker.defaultProps[prop];
	});

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
				onOpen={action('onOpen')}
				onClose={action('onClose')}
			/>
		)
	);
