import ExpandableList from '@enact/moonstone/ExpandableList';
import Item from '@enact/moonstone/Item';
import Scroller from '@enact/moonstone/Scroller';
import React from 'react';
import {storiesOf} from '@storybook/react';
import SelectableItem from '@enact/moonstone/SelectableItem';

const data = [
	'a',
	'ABCDEFGHIJKLMNOPQRSTUVW',
	'c'
];

class NoUpdate extends React.Component {
	shouldComponentUpdate () {
		return false;
	}

	render () {
		return (
			<div>{this.props.children}</div>
		);
	}
}

storiesOf('Remeasurable', module)
	.add(
		'should recalculate long marquee when scrollbar is rendered',
		() => (
			<Scroller style={{height: '400px', width: '500px'}}>
				<NoUpdate>
					<Item>ABCDEFGHIJKLMNOPQRST</Item>
					<SelectableItem>
						SELECTABLE ITEM ABCDEFG
					</SelectableItem>
					<ExpandableList title={'ABCDEFGHIJKLMNOPQRS'}>
						{data}
					</ExpandableList>
					<Item>dummy</Item>
					<Item>dummy</Item>
				</NoUpdate>
			</Scroller>
		)
	)
	.add(
		'should recalculate when selectable item is selected',
		() => (
			<Scroller style={{height: '400px', width: '500px'}}>
				<SelectableItem>
					SELECTABLE ITEM ABCDEFG
				</SelectableItem>
			</Scroller>
		)
	);
