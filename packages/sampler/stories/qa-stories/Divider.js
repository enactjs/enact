import Divider from '@enact/moonstone/Divider';
import Item from '@enact/moonstone/Item';
import React from 'react';
import ri from '@enact/ui/resolution';
import Scroller from '@enact/moonstone/Scroller';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, text, select} from '@kadira/storybook-addon-knobs';

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
				<div style={style.content}>
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
			</Scroller>
		)
	);
