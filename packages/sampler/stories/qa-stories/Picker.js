import Picker, {PickerBase} from '@enact/moonstone/Picker';
import Pickable from '@enact/ui/Pickable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, text, boolean, select} from '@kadira/storybook-addon-knobs';

const StatefulPicker = Pickable(Picker);
StatefulPicker.propTypes = Object.assign({}, PickerBase.propTypes, StatefulPicker.propTypes);
StatefulPicker.defaultProps = Object.assign({}, PickerBase.defaultProps, StatefulPicker.defaultProps);
StatefulPicker.displayName = 'Picker';

// Set up some defaults for info and knobs
const prop = {
	orientation: {'horizontal': 'horizontal', 'vertical': 'vertical'},
	width: {'null': null, 'small': 'small', 'medium': 'medium', 'large': 'large'}
};

const airports = [
	'San Francisco Airport Terminal Gate 1',
	'Boston Airport Terminal Gate 2',
	'Tokyo Airport Terminal Gate 3',
	'נמל התעופה בן גוריון טרמינל הבינלאומי'
];

const oneAirport = ['San Francisco Airport Terminal Gate 1'];

storiesOf('Picker')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of Picker',
		() => (
			<div>
				<StatefulPicker
					onChange={action('onChange')}
					width={select('width', prop.width, 'large')}
					orientation={select('orientation', prop.orientation)}
					wrap={oneAirport.length > 1}
					joined={boolean('joined')}
					noAnimation={boolean('noAnimation')}
					disabled={boolean('disabled')}
					incrementIcon={text('incrementIcon')}
					decrementIcon={text('decrementIcon')}
				>
					{oneAirport}
				</StatefulPicker>
				<StatefulPicker
					onChange={action('onChange')}
					width={select('width', prop.width, 'large')}
					orientation={select('orientation', prop.orientation)}
					wrap={airports.length > 1}
					joined={boolean('joined')}
					noAnimation={boolean('noAnimation')}
					disabled={boolean('disabled')}
					incrementIcon={text('incrementIcon')}
					decrementIcon={text('decrementIcon')}
				>
					{airports}
				</StatefulPicker>
			</div>
		)
	);
