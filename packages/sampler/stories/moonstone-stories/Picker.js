import Picker, {PickerBase} from '@enact/moonstone/Picker';
import Changeable from '@enact/ui/Changeable';
import {decrementIcons, incrementIcons} from './icons';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select} from '@kadira/storybook-addon-knobs';
import nullify from '../../src/utils/nullify.js';

const StatefulPicker = Changeable(Picker);
StatefulPicker.propTypes = Object.assign({}, PickerBase.propTypes, StatefulPicker.propTypes);
StatefulPicker.defaultProps = Object.assign({}, StatefulPicker.defaultProps, PickerBase.defaultProps, StatefulPicker.defaultProps);
StatefulPicker.displayName = 'Picker';

// Set up some defaults for info and knobs
const prop = {
	orientation: ['horizontal', 'vertical'],
	width: [null, 'small', 'medium', 'large']
};

const airports = [
	'San Francisco Airport Terminal Gate 1',
	'Boston Airport Terminal Gate 2',
	'Tokyo Airport Terminal Gate 3',
	'נמל התעופה בן גוריון טרמינל הבינלאומי'
];

storiesOf('Picker')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of Picker',
		() => (
			<StatefulPicker
				onChange={action('onChange')}
				width={nullify(select('width', prop.width, prop.width[3]))}
				orientation={select('orientation', prop.orientation, prop.orientation[0])}
				wrap={boolean('wrap', false)}
				joined={boolean('joined', false)}
				noAnimation={boolean('noAnimation', false)}
				disabled={boolean('disabled', false)}
				incrementIcon={select('incrementIcon', ['', ...incrementIcons])}
				decrementIcon={select('decrementIcon', ['', ...decrementIcons])}
			>
				{airports}
			</StatefulPicker>
		)
	);
