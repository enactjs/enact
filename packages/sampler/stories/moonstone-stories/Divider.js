import Divider, {DividerBase} from '@enact/moonstone/Divider';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';

import {select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('Divider', DividerBase, Divider);
Divider.displayName = 'Divider';

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
			text: 'Basic usage of Divider'
		})(() => (
			<Divider
				casing={select('casing', prop.casing, Config)}
				spacing={select('spacing', prop.spacing, Config)}
			>
				{text('children', Config, 'divider text')}
			</Divider>
		))
	);
