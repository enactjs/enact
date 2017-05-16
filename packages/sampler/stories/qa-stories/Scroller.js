import React from 'react';
import ri from '@enact/ui/resolution';
import Button from '@enact/moonstone/Button';
import ExpandableList from '@enact/moonstone/ExpandableList';
import Scroller from '@enact/moonstone/Scroller';

import {storiesOf, action} from '@kadira/storybook';
import {boolean, select} from '@kadira/storybook-addon-knobs';

const itemData = [];
for (let i = 0; i < 100; i++) {
	itemData.push(`Item ${i}`);
}

const
	prop = {
		horizontal: ['auto', 'hidden', 'scroll']
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

storiesOf('Scroller')
	.addWithInfo(
		'With ExpandableList',
		() => (
			<Scroller
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
	.addWithInfo(
		'Horizontal scroll',
		() => (
			<Scroller
				hideScrollbars={boolean('hideScrollbars', false)}
				horizontal={select('horizontal', prop.horizontal, 'auto')}
				onScrollStart={action('onScrollStart')}
				onScrollStop={action('onScrollStop')}
				style={style.horizontalScroller}
			>
				<div style={style.horizontalContent}>
					{[...Array(20)].map((x, i) => (
						<Button key={i + 1}>
							Button {i + 1}
						</Button>
					)
				)}
				</div>
			</Scroller>
		)
	);
