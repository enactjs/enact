import Button from '@enact/moonstone/Button';
import ExpandableList from '@enact/moonstone/ExpandableList';
import Scroller from '@enact/moonstone/Scroller';
import UiScroller from '@enact/ui/Scroller';
import Item from '@enact/moonstone/Item';
import Divider from '@enact/moonstone/Divider';
import ri from '@enact/ui/resolution';
import Group from '@enact/ui/Group';
import Spotlight from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import React from 'react';
import PropTypes from 'prop-types';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {boolean, select, number} from '../../src/enact-knobs';

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

class ScrollerTopMostVisibleItemInTheScroller extends React.Component {
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
				style={{height: ri.scale(200)}}
				onScrollStop={this.handleScrollStop}
			>
				<Item>Item</Item>
				<Item>Focus me, press right, then select on down arrow</Item>
				<Item>Focus should return here</Item>
				<Item>Item</Item>
				<Item>Item</Item>
			</Scroller>
		);
	}
}

class ScrollerWithTwoExpandableList extends React.Component {
	render () {
		return (
			<div>
				<Scroller
					style={{height: ri.scale(200)}}
					direction="vertical"
				>
					<ExpandableList title="first" selected={0}>
						{['a', 'b', 'c', 'd', 'b', 'c', 'd', 'b', 'c', 'd', 'b', 'c', 'd', 'b', 'c', 'd']}
					</ExpandableList>
				</Scroller>
				<Scroller
					style={{height: ri.scale(200)}}
					direction="vertical"
				>
					<ExpandableList title="second">
						{['a', 'b', 'c', 'd']}
					</ExpandableList>
				</Scroller>
			</div>
		);
	}
}

const Container = SpotlightContainerDecorator('div');

class ScrollerWithLargeContainer extends React.Component {
	componentDidMount () {
		setTimeout(() => {
			Spotlight.focus('scroller');
		}, 50);
	}

	render () {
		return (
			<Scroller focusableScrollbar spotlightId="scroller" style={{height: 200}}>
				<Container>
					<Item>Hello</Item>
					<Item>Hello</Item>
					<Item>Hello</Item>
					<Item>Hello</Item>
					<Item>Hello</Item>
					<Item>Hello</Item>
					<Item>Hello</Item>
					<Item>Hello</Item>
					<Item>Hello</Item>
				</Container>
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
		'Top Most Visible Item in the Scroller',
		() => (
			<ScrollerTopMostVisibleItemInTheScroller />
		)
	)
	.add(
		'With Two Expandable List',
		() => (
			<ScrollerWithTwoExpandableList />
		)
	)
	.add(
		'With Two ui:Scroller',
		() => (
			<div style={{display: 'flex', height: ri.unit(399, 'rem')}}>
				<UiScroller>
					<Group childComponent={Item}>
						{itemData}
					</Group>
				</UiScroller>
				<UiScroller>
					<Group childComponent={Item}>
						{itemData}
					</Group>
				</UiScroller>
			</div>
		)
	)
	.add(
		'With Large Container',
		() => (
			<ScrollerWithLargeContainer />
		)
	)
	.add(
		'Test scrolling to boundary with small overflow',
		() => {
			const size = number('Spacer size', {min: 0, max: 300}, 100);
			return (
				<Scroller style={{height: 200}}>
					<Item>1</Item>
					<div style={{height: size}}>{size}px Spacer</div>
					<Item style={{marginBottom: '18px'}}>3</Item>
				</Scroller>
			);
		}
	);
