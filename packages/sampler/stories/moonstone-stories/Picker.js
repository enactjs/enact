import Picker, {PickerBase} from '@enact/moonstone/Picker';
import {decrementIcons, incrementIcons} from './icons';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select} from '@kadira/storybook-addon-knobs';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('Picker', PickerBase, Picker);

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
			<Picker
				onChange={action('onChange')}
				width={nullify(select('width', prop.width, prop.width[3]))}
				orientation={select('orientation', prop.orientation, prop.orientation[0])}
				wrap={nullify(boolean('wrap', false))}
				joined={nullify(boolean('joined', false))}
				noAnimation={nullify(boolean('noAnimation', false))}
				disabled={boolean('disabled', false)}
				incrementIcon={nullify(select('incrementIcon', ['', ...incrementIcons]))}
				decrementIcon={nullify(select('decrementIcon', ['', ...decrementIcons]))}
			>
				{airports}
			</Picker>
		),
		{propTables: [Config]}
	);
