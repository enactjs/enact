import Button from '@enact/moonstone/Button';
import ExpandableList from '@enact/moonstone/ExpandableList';
import Scroller from '@enact/moonstone/Scroller';
import Item from '@enact/moonstone/Item';
import Divider from '@enact/moonstone/Divider';
import BodyText from '@enact/moonstone/BodyText';
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
				data-spotlight-container-disabled={boolean('data-spotlight-container-disabled', Scroller, false)}
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
				direction={select('direction', prop.direction, Scroller, 'vertical')}
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
	)
	.add(
		'With Many ExpandableList',
		() => (
			<Scroller
				focusableScrollbar={boolean('focusableScrollbar', Scroller, false)}
				style={{
					width: '100%'
				}}
			>
				<Divider>Nothing selected</Divider>
				<ExpandableList
					noneText="Nothing Selected"
					title="Default"
					closeOnSelect
				>
					{['Option 1', 'Option 2', 'Option 3',
						'Option 4', 'Option 5', 'Option 6',
						'Option 7', 'Option 8', 'Option 9',
						'Option 10', 'Option 11', 'Option 12',
						'Option 13', 'Option 14', 'Option 15',
						'Option 16', 'Option 17', 'Option 18',
						'Option 19', 'Option 20'
					]}
				</ExpandableList>
				<br />
				<Divider>Default selected</Divider>
				<ExpandableList
					noneText="Nothing Selected"
					title="Default"
					selected={1}
				>
					{['Option 1', 'Option 2', 'Option 3']}
				</ExpandableList>
				<br />
				<Divider>Default selected</Divider>
				<ExpandableList
					noneText="Nothing Selected"
					title="Default"
					selected={1}
				>
					{['Option 1', 'Option 2', 'Option 3']}
				</ExpandableList>
				<br />
				<Divider>Default selected</Divider>
				<ExpandableList
					noneText="Nothing Selected"
					title="Default"
					selected={1}
				>
					{['Option 1', 'Option 2', 'Option 3']}
				</ExpandableList>
				<br />
				<Divider>Multitple selected</Divider>
				<ExpandableList
					noneText="Nothing Selected"
					title="multiple"
					select="multiple"
					selected={[1, 2]}
				>
					{['Option 1', 'Option 2', 'Option 3']}
				</ExpandableList>
				<br />
				<Divider>Long contents selected</Divider>
				<ExpandableList
					noneText="Nothing Selected"
					title="multiple"
					select="multiple"
					selected={[18, 19]}
				>
					{['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6', 'Option 7', 'Option 8', 'Option 9', 'Option 10', 'Option 11', 'Option 12', 'Option 13', 'Option 14', 'Option 15', 'Option 16', 'Option 17', 'Option 18', 'Option 19', 'Option 20']}
				</ExpandableList>
			</Scroller>
	  )
	 );
