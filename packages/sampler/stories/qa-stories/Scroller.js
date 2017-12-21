import Button from '@enact/moonstone/Button';
import ExpandableList from '@enact/moonstone/ExpandableList';
import Scroller from '@enact/moonstone/Scroller';
import Item from '@enact/moonstone/Item';
import ri from '@enact/ui/resolution';
import Group from '@enact/ui/Group';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, select} from '@storybook/addon-knobs';

import nullify from '../../src/utils/nullify.js';

const itemData = [];
for (let i = 0; i < 100; i++) {
	itemData.push(`Item ${i}`);
}

const
	prop = {
		direction: ['both', 'horizontal', 'vertical'],
		horizontalScrollbar: ['auto', 'hidden', 'visible']
	},
	style = {
		horizontalScroller: {
			width: '100%'
		},
		horizontalContent: {
			width: ri.scale(4200) + 'px',
			padding: '1px'
		}
	};

storiesOf('Scroller', module)
	.add(
		'List of things',
		() => (
			<Scroller
				focusableScrollbar={nullify(boolean('focusableScrollbar', false))}
				style={{height: '600px'}}
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
				focusableScrollbar={nullify(boolean('focusableScrollbar', false))}
				style={{height: '600px'}}
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
				direction={select('direction', prop.direction, 'horizontal')}
				focusableScrollbar={nullify(boolean('focusableScrollbar', false))}
				horizontalScrollbar={select('horizontalScrollbar', prop.horizontalScrollbar, 'auto')}
				onScrollStart={action('onScrollStart')}
				onScrollStop={action('onScrollStop')}
				style={style.horizontalScroller}
			>
				<div style={style.horizontalContent}>
					{[...Array(20)].map((x, i) => (
						<Button key={i + 1}>
							Button {i + 1}
						</Button>
					))}
				</div>
			</Scroller>
		)
	);
