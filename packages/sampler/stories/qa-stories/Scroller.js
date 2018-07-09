import Button from '@enact/moonstone/Button';
import ExpandableList from '@enact/moonstone/ExpandableList';
import Scroller from '@enact/moonstone/Scroller';
import Item from '@enact/moonstone/Item';
import ri from '@enact/ui/resolution';
import Group from '@enact/ui/Group';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {boolean, select} from '../../src/enact-knobs';

Scroller.displayName = 'Scroller';

const itemData = [];
for (let i = 0; i < 100; i++) {
	itemData.push(`Item ${i}`);
}

const
	prop = {
		direction: ['both', 'horizontal', 'vertical'],
		horizontalScrollbar: ['auto', 'hidden', 'visible']
	};

storiesOf('Scroller', module)
	.add(
		'List of things',
		() => (
			<Scroller
				focusableScrollbar={boolean('focusableScrollbar', Scroller, false)}
				style={{height: ri.unit(600, 'rem')}}
			>
				<Group childComponent={Item}>
					{itemData}
				</Group>
			</Scroller>
		)
	)
	.add(
		'With ExpandableList',
		() => (
			<Scroller
				focusableScrollbar={boolean('focusableScrollbar', Scroller, false)}
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
	.add(
		'Horizontal scroll',
		() => (
			<Scroller
				direction={select('direction', prop.direction, Scroller, 'horizontal')}
				focusableScrollbar={boolean('focusableScrollbar', Scroller, false)}
				horizontalScrollbar={select('horizontalScrollbar', prop.horizontalScrollbar, Scroller, 'auto')}
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
