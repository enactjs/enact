import Heading from '@enact/moonstone/Heading';
import Item from '@enact/moonstone/Item';
import ri from '@enact/ui/resolution';
import Scroller from '@enact/moonstone/Scroller';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {select, text} from '@enact/storybook-utils/addons/knobs';

Heading.displayName = 'Heading';

const
	prop = {
		tallText: {'नरेंद्र मोदी': 'नरेंद्र मोदी', 'ฟิ้  ไั  ஒ  து': 'ฟิ้  ไั  ஒ  து', 'ÃÑÕÂÊÎÔÛÄËÏÖÜŸ': 'ÃÑÕÂÊÎÔÛÄËÏÖÜŸ'},
		marqueeOn: ['', 'hover', 'render']
	};

storiesOf('Heading', module)
	.add(
		'with long text',
		() => (
			<Heading
				marqueeOn={select('marqueeOn', prop.marqueeOn, Heading)}
			>
				{text('children', Heading, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ac tellus in velit ornare commodo. Nam dignissim fringilla nulla, sit amet hendrerit sapien laoreet quis. Praesent quis tellus non diam viverra feugiat. In quis mattis purus, quis tristique mi.')}
			</Heading>
		)
	)

	.add(
		'with tall characters',
		() => (
			<Heading>
				{select('children', prop.tallText, Heading, 'नरेंद्र मोदी')}
			</Heading>
		)
	)
	.add(
		'Multiple Scroller',
		() => (
			<Scroller
				horizontal="auto"
				style={{
					height: ri.unit(552, 'rem'),
					width: '100%'
				}}
				vertical="auto"
			>
				<div
					style={{
						height: ri.unit(1002, 'rem'),
						width: ri.unit(2001, 'rem')
					}}
				>
					<Heading>First Heading</Heading>
					<Item>Item 11</Item>
					<Item>Item 12</Item>
					<Item>Item 13</Item>
					<Heading>Second Heading</Heading>
					<Item>Item 21</Item>
					<Item>Item 22</Item>
					<Item>Item 23</Item>
					<Heading>Third Heading</Heading>
					<Item>Item 31</Item>
					<Item>Item 32</Item>
					<Item>Item 33</Item>
					<Heading>Fourth Heading</Heading>
					<Item>Item 41</Item>
					<Item>Item 42</Item>
				</div>
			</Scroller>
		)
	);
