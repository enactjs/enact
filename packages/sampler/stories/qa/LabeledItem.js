import Heading from '@enact/moonstone/Heading';
import LabeledItem from '@enact/moonstone/LabeledItem';
import React from 'react';
import Scroller from '@enact/moonstone/Scroller';
import {storiesOf} from '@storybook/react';

import {boolean, select, text} from '../../src/enact-knobs';
LabeledItem.displayName = 'LabeledItem';

const inputData = {
	longLabel : 'label starts - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ac tellus in velit ornare commodo. Nam dignissim fringilla nulla, sit amet hendrerit sapien laoreet quis. Praesent quis tellus non diam viverra feugiat. In quis mattis purus, quis tristique mi. Mauris vitae tellus tempus, convallis ligula id, laoreet eros. Nullam eu tempus odio, non mollis tellus. Phasellus vitae iaculis nisl. = label ends',
	longChildren : 'children starts - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ac tellus in velit ornare commodo. Nam dignissim fringilla nulla, sit amet hendrerit sapien laoreet quis. Praesent quis tellus non diam viverra feugiat. In quis mattis purus, quis tristique mi. Mauris vitae tellus tempus, convallis ligula id, laoreet eros. Nullam eu tempus odio, non mollis tellus. Phasellus vitae iaculis nisl. - children ends',
	shortLabel : 'Label',
	shortChildren : 'Hello LabeledItem'
};

storiesOf('LabeledItem', module)
	.add(
		'with different text lenght',
		() => (
			<Scroller style={{height: '100%'}}>
				<div>
					<Heading showLine style={{paddingTop: '10px'}} />
					<Heading showLine>Long children and Short label</Heading>
					<LabeledItem
						disabled={boolean('disabled', LabeledItem)}
						label={text('label', LabeledItem, inputData.shortLabel)}
					>
						{text('children', LabeledItem, inputData.longChildren)}
					</LabeledItem>

					<Heading showLine style={{paddingTop: '10px'}} />
					<Heading showLine>Short children and Long label</Heading>
					<LabeledItem
						disabled={boolean('disabled', LabeledItem)}
						label={text('label2', LabeledItem, inputData.longLabel)}
					>
						{text('children2', LabeledItem, inputData.shortChildren)}
					</LabeledItem>

					<Heading showLine style={{paddingTop: '10px'}} />
					<Heading showLine>Long children and Long label</Heading>
					<LabeledItem
						disabled={boolean('disabled', LabeledItem)}
						label={text('label2', LabeledItem, inputData.longLabel)}
					>
						{text('children', LabeledItem, inputData.longChildren)}
					</LabeledItem>
				</div>
			</Scroller>
		)
	);
