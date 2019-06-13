import Heading, {HeadingBase} from '@enact/moonstone/Heading';
import UiHeading from '@enact/ui/Heading';
import BodyText from '@enact/moonstone/BodyText';
import React from 'react';
import {storiesOf} from '@storybook/react';

import {boolean, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

Heading.displayName = 'Heading';
const Config = mergeComponentMetadata('Heading', UiHeading, HeadingBase, Heading);

// Set up some defaults for info and knobs
const prop = {
	casing: ['', 'preserve', 'sentence', 'word', 'upper'],
	marqueeOn: ['', 'hover', 'render'],
	size: ['', 'large', 'medium', 'small'],
	spacing: ['', 'auto', 'large', 'medium', 'small', 'none']
};

storiesOf('Moonstone', module)
	.add(
		'Heading',
		() => (<React.Fragment>
			<Heading
				casing={select('casing', prop.casing, Config)}
				marqueeOn={select('marqueeOn', prop.marqueeOn, Config)}
				showLine={boolean('showLine', Config)}
				size={select('size', prop.size, Config)}
				spacing={select('spacing', prop.spacing, Config)}
			>
				{text('children', Config, 'Heading text')}
			</Heading>
			<BodyText style={{marginTop: 0}}>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed aliquam dapibus imperdiet. Morbi diam ex, vulputate eget luctus eu, gravida at ligula. Sed tristique eros sit amet iaculis varius. Phasellus rutrum augue id nulla consectetur, a vulputate velit dictum. Vestibulum ultrices tellus ac cursus condimentum. Aliquam sit amet consectetur nulla, viverra bibendum metus.
			</BodyText>
		</React.Fragment>),
		{
			info: {
				text: 'A component for initiating a section of content.'
			}
		}
	);
