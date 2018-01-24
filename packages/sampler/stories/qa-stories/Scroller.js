import Button from '@enact/moonstone/Button';
import ExpandableList from '@enact/moonstone/ExpandableList';
import Scroller from '@enact/moonstone/Scroller';
import Item from '@enact/moonstone/Item';
import ri from '@enact/ui/resolution';
import Group from '@enact/ui/Group';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {boolean, select} from '@kadira/storybook-addon-knobs';

import nullify from '../../src/utils/nullify.js';

const itemData = [];
for (let i = 0; i < 100; i++) {
	itemData.push(`Item ${i}`);
}

const
	prop = {
		direction: ['both', 'horizontal', 'vertical'],
		horizontalScrollbar: ['auto', 'hidden', 'visible']
	};

storiesOf('Scroller')
	.addWithInfo(
		'List of things',
		() => (
			<Scroller
				focusableScrollbar={nullify(boolean('focusableScrollbar', false))}
				style={{height: ri.unit(600, 'rem')}}
			>
				<Group childComponent={Item}>
					{itemData}
				</Group>
			</Scroller>
		)
	)
	.addWithInfo(
		'With ExpandableList',
		() => (
			<Scroller
				focusableScrollbar={nullify(boolean('focusableScrollbar', false))}
				style={{height: ri.unit(600, 'rem')}}
			>
				<ExpandableList
					closeOnSelect
					title="Expandable List in Scroller"
				>
					{itemData}
				</ExpandableList>
			</Scroller>
		)
	)
	.addWithInfo(
		'Horizontal scroll',
		() => (
			<Scroller
				direction={select('direction', prop.direction, 'horizontal')}
				focusableScrollbar={nullify(boolean('focusableScrollbar', false))}
				horizontalScrollbar={select('horizontalScrollbar', prop.horizontalScrollbar, 'auto')}
				onScrollStart={action('onScrollStart')}
				onScrollStop={action('onScrollStop')}
				style={{
					width: '100%'
				}}
			>
				<div
					style={{
						width: ri.unit(4200, 'rem'),
						padding: '1px'
					}}
				>
					{[...Array(20)].map((x, i) => (
						<Button key={i + 1}>
							Button {i + 1}
						</Button>
					))}
				</div>
			</Scroller>
		)
	);
