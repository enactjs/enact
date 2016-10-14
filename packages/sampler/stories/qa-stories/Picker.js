import Picker, {PickerBase} from '@enact/moonstone/Picker';
import Changeable from '@enact/ui/Changeable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, text, boolean, select} from '@kadira/storybook-addon-knobs';

const StatefulPicker = Changeable(Picker);
StatefulPicker.propTypes = Object.assign({}, PickerBase.propTypes, StatefulPicker.propTypes);
StatefulPicker.defaultProps = Object.assign({}, PickerBase.defaultProps, StatefulPicker.defaultProps);
StatefulPicker.displayName = 'Picker';

// Set up some defaults for info and knobs
const prop = {
	orientation: {'horizontal': 'horizontal', 'vertical': 'vertical'},
	width: {'null': null, 'small': 'small', 'medium': 'medium', 'large': 'large'}
};

const oneAirport = ['San Francisco Airport Terminal Gate 1'];

storiesOf('Picker with One item')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of Picker',
		() => (
			<StatefulPicker
				onChange={action('onChange')}
				width={select('width', prop.width, 'large')}
				orientation={select('orientation', prop.orientation)}
				wrap={boolean('wrap', true)}
				joined={boolean('joined')}
				noAnimation={boolean('noAnimation')}
				disabled={boolean('disabled')}
				incrementIcon={text('incrementIcon')}
				decrementIcon={text('decrementIcon')}
			>
				{oneAirport}
			</StatefulPicker>
		)
	);
