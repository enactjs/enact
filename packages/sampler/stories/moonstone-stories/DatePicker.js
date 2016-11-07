import Changeable from '@enact/ui/Changeable';
import {DatePicker, DatePickerBase} from '@enact/moonstone/DatePicker';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

const Picker = Changeable(DatePicker);
Picker.propTypes = Object.assign({}, DatePickerBase.propTypes, DatePicker.propTypes);
Picker.defaultProps = Object.assign({}, DatePickerBase.defaultProps, DatePicker.defaultProps);
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
