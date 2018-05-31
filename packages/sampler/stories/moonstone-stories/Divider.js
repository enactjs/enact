import Divider, {DividerBase} from '@enact/moonstone/Divider';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import {mergeComponentMetadata, smartSelect} from '../../src/utils';

Divider.displayName = 'Divider';
const Config = mergeComponentMetadata('Divider', DividerBase, Divider);

// Set up some defaults for info and knobs
const prop = {
	casing: ['', 'preserve', 'sentence', 'word', 'upper'],
	spacing: ['', 'normal', 'small', 'medium', 'large', 'none']
};

storiesOf('Moonstone', module)
	.add(
		'Divider',
		withInfo({
			propTablesExclude: [Divider],
			text: 'Basic usage of divider'
		})(() => (
			<Divider
				casing={smartSelect('casing', prop.casing, Config)}
				spacing={smartSelect('spacing', prop.spacing, Config)}
			>
				{text('children', 'divider text')}
			</Divider>
		))
	);
