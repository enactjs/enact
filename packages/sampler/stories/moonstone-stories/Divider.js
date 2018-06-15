import Divider, {DividerBase} from '@enact/moonstone/Divider';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import {mergeComponentMetadata, smartSelect} from '../../src/utils';

const Config = mergeComponentMetadata('Divider', DividerBase, Divider);

// Set up some defaults for info and knobs
const prop = {
	casing: ['', 'preserve', 'sentence', 'word', 'upper'],
	marqueeOn: ['', 'hover', 'render'],
	spacing: ['', 'normal', 'small', 'medium', 'large', 'none']
};

storiesOf('Moonstone', module)
	.add(
		'Divider',
		withInfo('Basic usage of divider')(() => (
			<Divider
				casing={smartSelect('casing', prop.casing, Config)}
				marqueeOn={smartSelect('marqueeOn', prop.marqueeOn, Config)}
				spacing={smartSelect('spacing', prop.spacing, Config)}
			>
				{text('children', 'divider text')}
			</Divider>
		))
	);
