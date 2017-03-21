import Divider from '@enact/moonstone/Divider';
import Item from '@enact/moonstone/Item';
import React from 'react';
import ri from '@enact/ui/resolution';
import {SpotlightContainerDecorator} from '@enact/spotlight';
import Scroller from '@enact/moonstone/Scroller';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, text, select} from '@kadira/storybook-addon-knobs';

const Container = SpotlightContainerDecorator('div');

const
	prop = {
		tallText: {'नरेंद्र मोदी': 'नरेंद्र मोदी', 'ฟิ้  ไั  ஒ  து': 'ฟิ้  ไั  ஒ  து', 'ÃÑÕÂÊÎÔÛÄËÏÖÜŸ': 'ÃÑÕÂÊÎÔÛÄËÏÖÜŸ'}
	},
	style = {
		scroller: {
			height: ri.scale(550) + 'px',
			width: '100%'
		},
		content: {
			height: ri.scale(1000) + 'px',
			width: ri.scale(2000) + 'px'
		}
	};

storiesOf('Divider')
	.addDecorator(withKnobs)
	.addWithInfo(
		'with long text',
		() => (
			<Divider>
				{text('children', 'This long text is for the marquee test in divider component. This long text is for the marquee test in divider component. This long text is for the marquee test in divider component.')}
			</Divider>
		)
	)

	.addWithInfo(
		'with tall characters',
		() => (
			<Divider>
				{select('children', prop.tallText, 'नरेंद्र मोदी')}
			</Divider>
		)
	)

	.addWithInfo(
		'with an element below',
		() => (
			<div>
				<div>
					Adjust the spacing prop to see how the Divider is positioned with respect to the element below.
				</div>
				<Divider
					spacing={select('spacing', ['normal', 'small', 'medium', 'large', 'none'])}
				>
					{text('children', 'Hello World')}
				</Divider>
				<Item>
					Some content below
				</Item>
			</div>
		)
	)

	.addWithInfo(
		'Multiple',
		() => (
			<div>
				<Divider>
					First Divider
				</Divider>
				<Item>
					Item 11
				</Item>
				<Item>
					Item 12
				</Item>
				<Item>
					Item 13
				</Item>
				<Divider>
					Second Divider
				</Divider>
				<Item>
					Item 21
				</Item>
				<Item>
					Item 22
				</Item>
				<Item>
					Item 23
				</Item>
				<Divider>
					Third Divider
				</Divider>
				<Item>
					Item 31
				</Item>
				<Item>
					Item 32
				</Item>
				<Item>
					Item 33
				</Item>
				<Divider>
					Fourth Divider
				</Divider>
				<Item>
					Item 41
				</Item>
				<Item>
					Item 42
				</Item>
			</div>
		)
	)

	.addWithInfo(
		'Multiple Scroller',
		() => (
			<Scroller
				horizontal={'auto'}
				vertical={'auto'}
				hideScrollbars={false}
				style={style.scroller}
			>
				<Container style={style.content} spotlightRestrict="self-first">
					<Divider>
						First Divider
					</Divider>
					<Item>
						Item 11
					</Item>
					<Item>
						Item 12
					</Item>
					<Item>
						Item 13
					</Item>
					<Divider>
						Second Divider
					</Divider>
					<Item>
						Item 21
					</Item>
					<Item>
						Item 22
					</Item>
					<Item>
						Item 23
					</Item>
					<Divider>
						Third Divider
					</Divider>
					<Item>
						Item 31
					</Item>
					<Item>
						Item 32
					</Item>
					<Item>
						Item 33
					</Item>
					<Divider>
						Fourth Divider
					</Divider>
					<Item>
						Item 41
					</Item>
					<Item>
						Item 42
					</Item>
				</Container>
			</Scroller>
		)
	);
