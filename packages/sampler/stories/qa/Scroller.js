import Button from '@enact/moonstone/Button';
import ExpandableList from '@enact/moonstone/ExpandableList';
import Scroller from '@enact/moonstone/Scroller';
import Item from '@enact/moonstone/Item';
import Divider from '@enact/moonstone/Divider';
import ri from '@enact/ui/resolution';
import Group from '@enact/ui/Group';
import React from 'react';
import PropTypes from 'prop-types';
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

class ScrollerResizableItem extends React.Component {
	static propTypes = {
		more: PropTypes.bool,
		toggleMore: PropTypes.func
	}
	render () {
		const height = ri.unit(this.props.more ? 1500 : 400, 'rem');
		const text = this.props.more ? 'less' : 'more';
		const style = {
			position: 'relative',
			width: '90%',
			border: 'solid yellow'
		};
		return (
			<div style={{...style, height}}>
				<Button onClick={this.props.toggleMore} small style={{position: 'absolute', bottom: 0}}>{text}</Button>
			</div>
		);
	}
}

class ScrollerWithResizable extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			more: false
		};
	}

	handleClick = () => {
		this.setState(prevState => ({more: !prevState.more}));
	}

	render () {
		return (
			<Scroller verticalScrollbar="visible">
				<Item>Item</Item>
				<Item>Item</Item>
				<ScrollerResizableItem toggleMore={this.handleClick} more={this.state.more} />
			</Scroller>
		);
	}
}

class ScrollerLastFocusedItem extends React.Component {
	componentDidMount () {
		this.blurEvent = document.createEvent('Event');
		this.blurEvent.initEvent('blur', true, true);
		this.focusEvent = document.createEvent('Event');
		this.focusEvent.initEvent('focus', true, true);
	}

	handleScrollStop = () => {
		window.dispatchEvent(this.blurEvent);
		window.dispatchEvent(this.focusEvent);
	}

	render () {
		return (
			<Scroller
				focusableScrollbar
				verticalScrollbar="visible"
				style={{height: 200}}
				onScrollStop={this.handleScrollStop}
			>
				<Item>Item</Item>
				<Item>Item</Item>
				<Item>Focus me and press right</Item>
				<Item>Item</Item>
				<Item>Item</Item>
			</Scroller>
		);
	}
}

storiesOf('Scroller', module)
	.add(
		'List of things',
		() => (
			<Scroller
				data-spotlight-container-disabled={boolean('data-spotlight-container-disabled', Scroller, false)}
				focusableScrollbar={boolean('focusableScrollbar', Scroller, false)}
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
			<Scroller focusableScrollbar={boolean('focusableScrollbar', Scroller, false)}>
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
			<Scroller focusableScrollbar={boolean('focusableScrollbar', Scroller, false)}>
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
	)
	.add(
		'With Resizable',
		() => (
			<ScrollerWithResizable />
		)
	)
	.add(
		'Last Focused Item',
		() => (
			<ScrollerLastFocusedItem />
		)
	);
