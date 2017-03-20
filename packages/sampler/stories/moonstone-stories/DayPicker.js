import DayPicker from '@enact/moonstone/DayPicker';
import React from 'react';
import Changeable from '@enact/ui/Changeable';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

const ChangeableDayPicker = Changeable({change: 'onSelect', prop: 'selected'}, DayPicker);
ChangeableDayPicker.propTypes = Object.assign({}, DayPicker.propTypes);
ChangeableDayPicker.defaultProps = Object.assign({}, DayPicker.defaultProps, ChangeableDayPicker.defaultProps);
ChangeableDayPicker.displayName = 'DayPicker';

storiesOf('DayPicker')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of DayPicker',
		() => (
			<ChangeableDayPicker
				title={text('title', 'Day Picker')}
				noneText={text('none', 'none')}
				disabled={boolean('disabled', false)}
				onSelect={action('onSelect')}
				onOpen={action('onOpen')}
				onClose={action('onClose')}
			/>
		)
	);
