import Divider, {DividerBase} from '@enact/moonstone/Divider';
import BodyText from '@enact/moonstone/BodyText';
import React from 'react';
import {storiesOf} from '@storybook/react';

import {select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

Divider.displayName = 'Divider';
const Config = mergeComponentMetadata('Divider', DividerBase, Divider);

// Set up some defaults for info and knobs
const prop = {
	casing: ['', 'preserve', 'sentence', 'word', 'upper'],
	marqueeOn: ['', 'hover', 'render'],
	spacing: ['', 'small', 'medium', 'large', 'none']
};

storiesOf('Moonstone', module)
	.add(
		'Divider',
		() => (<React.Fragment>
			<Divider
				key="divider"
				casing={select('casing', prop.casing, Config)}
				marqueeOn={select('marqueeOn', prop.marqueeOn, Config)}
				spacing={select('spacing', prop.spacing, Config)}
			>
				{text('children', Config, 'divider text')}
			</Divider>
			<BodyText style={{marginTop: 0}}>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed aliquam dapibus imperdiet. Morbi diam ex, vulputate eget luctus eu, gravida at ligula. Sed tristique eros sit amet iaculis varius. Phasellus rutrum augue id nulla consectetur, a vulputate velit dictum. Vestibulum ultrices tellus ac cursus condimentum. Aliquam sit amet consectetur nulla, viverra bibendum metus.
			</BodyText>
		</React.Fragment>),
		{
			info: {
				text: 'Basic usage of Divider'
			}
		}
	);
