import Divider from '@enact/moonstone/Divider';
import Item from '@enact/moonstone/Item';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs} from '@kadira/storybook-addon-knobs';

storiesOf('DividerWithMultipleItems')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
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
	);
