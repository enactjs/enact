import Picker from '@enact/moonstone/Picker';
import {decrementIcons, incrementIcons} from './icons';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {boolean, select, text} from '../../src/enact-knobs';

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

// const Config = mergeComponentMetadata('FormCheckboxItem', FormCheckboxItem);
Picker.displayName = 'Picker';

storiesOf('Moonstone', module)
	.add(
		'Picker',
		withInfo({
			propTablesExclude: [Picker],
			text: 'Basic usage of Picker'
		})(() => (
			<Picker
				aria-label={text('aria-label', Picker, '')}
				decrementAriaLabel={text('decrementAriaLabel', Picker, '')}
				decrementIcon={select('decrementIcon', ['', ...decrementIcons], Picker)}
				disabled={boolean('disabled', Picker, false)}
				incrementAriaLabel={text('incrementAriaLabel', Picker, '')}
				incrementIcon={select('incrementIcon', ['', ...incrementIcons], Picker)}
				joined={boolean('joined', Picker, false)}
				noAnimation={boolean('noAnimation', Picker, false)}
				onChange={action('onChange')}
				orientation={select('orientation', prop.orientation, Picker, prop.orientation[0])}
				width={select('width', prop.width, Picker, prop.width[3])}
				wrap={boolean('wrap', Picker, false)}
			>
				{airports}
			</Picker>
		))
	);
