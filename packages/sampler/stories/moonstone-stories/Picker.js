import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, text, boolean, select} from '@kadira/storybook-addon-knobs';

import Pickable from 'enact-ui/Pickable';
import Picker, {PickerBase} from 'enact-moonstone/Picker';

const StatefulPicker = Pickable(Picker);

StatefulPicker.displayName = 'Picker';
StatefulPicker.propTypes = Object.assign({}, PickerBase.propTypes, StatefulPicker.propTypes);
StatefulPicker.defaultProps = Object.assign({}, PickerBase.defaultProps, StatefulPicker.defaultProps);

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

storiesOf('Picker')
	.addDecorator(withKnobs)
	.addWithInfo(
		'',
		'Basic usage of Picker',
		() => (
			<StatefulPicker
				onChange={action('onChange')}
				width={select('width', prop.width, 'large')}
				orientation={select('orientation', prop.orientation)}
				wrap={boolean('wrap')}
				joined={boolean('joined')}
				noAnimation={boolean('noAnimation')}
				disabled={boolean('disabled')}
				incrementIcon={text('incrementIcon')}
				decrementIcon={text('decrementIcon')}
			>
				{airports}
			</StatefulPicker>
		)
	);
