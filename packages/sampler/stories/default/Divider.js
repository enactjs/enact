import Divider, {DividerBase} from '@enact/moonstone/Divider';
import Item from '@enact/moonstone/Item';
import React from 'react';
import {storiesOf} from '@storybook/react';

import {select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('Divider', DividerBase, Divider);
Divider.displayName = 'Divider';

// Set up some defaults for info and knobs
const prop = {
	casing: ['', 'preserve', 'sentence', 'word', 'upper'],
	marqueeOn: ['', 'hover', 'render'],
	spacing: ['', 'small', 'medium', 'large', 'none']
};

storiesOf('Moonstone', module)
	.add(
		'Divider',
		() => ([
			<Divider
				key="divider"
				casing={select('casing', prop.casing, Config)}
				marqueeOn={select('marqueeOn', prop.marqueeOn, Config)}
				spacing={select('spacing', prop.spacing, Config)}
			>
				{text('children', Config, 'divider text')}
			</Divider>,
			<Item key="item">Following text</Item>
		]),
		{
			info: {
				text: 'Basic usage of Divider'
			}
		}
	);
