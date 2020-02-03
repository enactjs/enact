import Heading from '@enact/moonstone/Heading';
import LabeledItem from '@enact/moonstone/LabeledItem';
import Scroller from '@enact/moonstone/Scroller';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {boolean, select, text} from '@enact/storybook-utils/addons/knobs';

LabeledItem.displayName = 'LabeledItem';

const inputData = {
	longLabel : 'label starts - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ac tellus in velit ornare commodo. Nam dignissim fringilla nulla, sit amet hendrerit sapien laoreet quis. Praesent quis tellus non diam viverra feugiat. In quis mattis purus, quis tristique mi. Mauris vitae tellus tempus, convallis ligula id, laoreet eros. Nullam eu tempus odio, non mollis tellus. Phasellus vitae iaculis nisl. = label ends',
	longChildren : 'children starts - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ac tellus in velit ornare commodo. Nam dignissim fringilla nulla, sit amet hendrerit sapien laoreet quis. Praesent quis tellus non diam viverra feugiat. In quis mattis purus, quis tristique mi. Mauris vitae tellus tempus, convallis ligula id, laoreet eros. Nullam eu tempus odio, non mollis tellus. Phasellus vitae iaculis nisl. - children ends',
	shortLabel : 'Label',
	shortChildren : 'Hello LabeledItem',
	mediumChildren : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ac tellus in velit ornare commodo. Nam dignissim fringilla nulla, sit amet hendrerit sapien laoreet quis. Praesent quis tellus non diam viverra feugiat. The End.'
};

storiesOf('LabeledItem', module)
	.add(
		'with different text length',
		() => (
			<Scroller style={{height: '100%'}}>
				<div>
					<Heading showLine style={{paddingTop: '30px'}} >Long children and Short label</Heading>
					<LabeledItem
						disabled={boolean('disabled', LabeledItem)}
						label={text('label', LabeledItem, inputData.shortLabel)}
					>
						{text('children2', LabeledItem, inputData.longChildren)}
					</LabeledItem>

					<Heading showLine style={{paddingTop: '30px'}}>Short children and Long label</Heading>
					<LabeledItem
						disabled={boolean('disabled', LabeledItem)}
						label={text('label2', LabeledItem, inputData.longLabel)}
					>
						{text('children', LabeledItem, inputData.shortChildren)}
					</LabeledItem>

					<Heading showLine style={{paddingTop: '30px'}}>Long children and Long label</Heading>
					<LabeledItem
						disabled={boolean('disabled', LabeledItem)}
						label={text('label2', LabeledItem, inputData.longLabel)}
					>
						{text('children2', LabeledItem, inputData.longChildren)}
					</LabeledItem>
				</div>
			</Scroller>
		)
	)

	.add(
		'with spotlightDisabled',
		() => (
			<div>
				<LabeledItem
					spotlightDisabled={boolean('spotlightDisabled', LabeledItem, true)}
					marqueeOn={select('marqueeOn', ['render', 'hover'], LabeledItem, 'render')}
					label={text('label', LabeledItem, inputData.shortLabel)}
				>
					{text('children', LabeledItem, inputData.mediumChildren)}
				</LabeledItem>
			</div>
		)
	);
