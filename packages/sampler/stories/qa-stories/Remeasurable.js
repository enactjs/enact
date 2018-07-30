import ExpandableList from '@enact/moonstone/ExpandableList';
import Item from '@enact/moonstone/Item';
import Scroller from '@enact/moonstone/Scroller';
import ri from '@enact/ui/resolution';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
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

storiesOf('Remeasurable')
	.addWithInfo(
		'should recalculate long marquee when scrollbar is rendered',
		() => (
			<Scroller style={{height: ri.unit(399, 'rem'), width: ri.unit(501, 'rem')}}>
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
	.addWithInfo(
		'should recalculate when selectable item is selected',
		() => (
			<Scroller style={{height: ri.unit(399, 'rem'), width: ri.unit(501, 'rem')}}>
				<SelectableItem>
					SELECTABLE ITEM ABCDEFG
				</SelectableItem>
			</Scroller>
		)
	);
