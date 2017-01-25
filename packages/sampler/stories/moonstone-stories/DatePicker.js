import Changeable from '@enact/ui/Changeable';
import {DatePicker, DatePickerBase} from '@enact/moonstone/DatePicker';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

const Picker = Changeable(DatePicker);
Picker.propTypes = Object.assign({}, DatePicker.propTypes, DatePickerBase.propTypes, {
	onChange: React.PropTypes.func,
	onOpen: React.PropTypes.func,
	onClose: React.PropTypes.func,
	open: React.PropTypes.bool,
	value: React.PropTypes.instanceOf(Date)
});
Picker.defaultProps = Object.assign({}, DatePicker.defaultProps, DatePickerBase.defaultProps);
Picker.displayName = 'DatePicker';

'year defaultOpen day maxDays maxMonths month onChangeDate onChangeMonth onChangeYear order'
	.split(' ')
	.forEach(prop => {
		delete Picker.propTypes[prop];
		delete Picker.defaultProps[prop];
	});

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
				onOpen={action('onOpen')}
				onClose={action('onClose')}
			/>
		)
	);
