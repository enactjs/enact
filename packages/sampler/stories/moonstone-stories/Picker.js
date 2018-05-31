import Picker from '@enact/moonstone/Picker';
import {decrementIcons, incrementIcons} from './icons';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, select, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';

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

Picker.displayName = 'Picker';

storiesOf('Moonstone', module)
	.add(
		'Picker',
		withInfo({
			propTablesExclude: [Picker],
			text: 'Basic usage of Picker'
		})(() => (
			<Picker
				aria-label={nullify(text('aria-label', ''))}
				decrementAriaLabel={nullify(text('decrementAriaLabel', ''))}
				decrementIcon={nullify(select('decrementIcon', ['', ...decrementIcons]))}
				disabled={boolean('disabled', false)}
				incrementAriaLabel={nullify(text('incrementAriaLabel', ''))}
				incrementIcon={nullify(select('incrementIcon', ['', ...incrementIcons]))}
				joined={nullify(boolean('joined', false))}
				noAnimation={nullify(boolean('noAnimation', false))}
				onChange={action('onChange')}
				orientation={select('orientation', prop.orientation, prop.orientation[0])}
				width={nullify(select('width', prop.width, prop.width[3]))}
				wrap={nullify(boolean('wrap', false))}
			>
				{airports}
			</Picker>
		))
	);
