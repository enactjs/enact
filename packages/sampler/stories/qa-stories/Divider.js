import Divider from '@enact/moonstone/Divider';
import Item from '@enact/moonstone/Item';
import ri from '@enact/ui/resolution';
import Scroller from '@enact/moonstone/Scroller';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {text, select} from '@kadira/storybook-addon-knobs';

const
	prop = {
		tallText: {'नरेंद्र मोदी': 'नरेंद्र मोदी', 'ฟิ้  ไั  ஒ  து': 'ฟิ้  ไั  ஒ  து', 'ÃÑÕÂÊÎÔÛÄËÏÖÜŸ': 'ÃÑÕÂÊÎÔÛÄËÏÖÜŸ'}
	};

storiesOf('Divider')
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
