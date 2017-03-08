import React from 'react';
import ri from '@enact/ui/resolution';
import Button from '@enact/moonstone/Button';
import ExpandableList from '@enact/moonstone/ExpandableList';
import Selectable from '@enact/ui/Selectable';
import Scroller from '@enact/moonstone/Scroller';

import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select} from '@kadira/storybook-addon-knobs';

const StatefullExpandableList = Selectable(ExpandableList);

const itemData = [];
for (let i = 0; i < 100; i++) {
	itemData.push(`Item ${i}`);
}

const
	prop = {
		horizontal: {'auto': 'auto', 'hidden': 'hidden', 'scroll': 'scroll'},
		vertical: {'auto': 'auto', 'hidden': 'hidden', 'scroll': 'scroll'}
	},
	style = {
		horizontalScroller: {
			width: '100%'
		},
		horizontalContent: {
			width: ri.scale(6000) + 'px'
		}
	};

storiesOf('Scroller')
	.addDecorator(withKnobs)
	.addWithInfo(
		'With ExpandableList',
		() => (
			<Scroller
				style={{height: '600px'}}
			>
				<StatefullExpandableList
					closeOnSelect
					title="Expandable List in Scroller"
				>
					{itemData}
				</StatefullExpandableList>
			</Scroller>
		)
	)
	.addWithInfo(
		'Horizontal scroll',
		() => (
			<Scroller
				hideScrollbars={boolean('hideScrollbars', false)}
				horizontal={select('horizontal', prop.horizontal, 'auto')}
				vertical={select('vertical', prop.vertical, 'auto')}
				onScrollStart={action('onScrollStart')}
				onScrollStop={action('onScrollStop')}
				style={style.horizontalScroller}
			>
				<div style={style.horizontalContent}>
					<Button>Button</Button>
					<Button>Button</Button>
					<Button>Button</Button>
					<Button>Button</Button>
					<Button>Button</Button>
					<Button>Button</Button>
					<Button>Button</Button>
					<Button>Button</Button>
					<Button>Button</Button>
					<Button>Button</Button>
					<Button>Button</Button>
					<Button>Button</Button>
					<Button>Button</Button>
					<Button>Button</Button>
					<Button>Button</Button>
					<Button>Button</Button>
					<Button>Button</Button>
					<Button>Button</Button>
					<Button>Button</Button>
					<Button>Button</Button>
					<Button>Button</Button>
					<Button>Button</Button>
					<Button>Button</Button>
					<Button>Button</Button>
					<Button>Button</Button>
					<Button>Button</Button>
					<Button>Button</Button>
					<Button>Button</Button>
					<Button>Button</Button>
				</div>
			</Scroller>
		)
	);
