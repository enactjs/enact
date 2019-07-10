import Button from '@enact/moonstone/Button';
import Heading from '@enact/moonstone/Heading';
import ExpandableList from '@enact/moonstone/ExpandableList';
import Group from '@enact/ui/Group';
import Item from '@enact/moonstone/Item';
import PropTypes from 'prop-types';
import React from 'react';
import ri from '@enact/ui/resolution';
import Scroller from '@enact/moonstone/Scroller';
import Spotlight from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import UiScroller from '@enact/ui/Scroller';

import {action} from '@storybook/addon-actions';
import {storiesOf} from '@storybook/react';

import {boolean, number, select} from '../../src/enact-knobs';

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
			border: 'solid yellow',
			position: 'relative',
			width: '90%'
		};
		return (
			<div style={{...style, height}}>
				<Button onClick={this.props.toggleMore} size="small" style={{position: 'absolute', bottom: 0}}>{text}</Button>
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
				<ScrollerResizableItem more={this.state.more} toggleMore={this.handleClick} />
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
					<ExpandableList selected={0} title="first">
						{['a', 'b', 'c', 'd', 'b', 'c', 'd', 'b', 'c', 'd', 'b', 'c', 'd', 'b', 'c', 'd']}
					</ExpandableList>
				</Scroller>
				<Scroller
					direction="vertical"
					style={{height: ri.scale(200)}}
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
				spotlightDisabled={boolean('spotlightDisabled', Scroller, false)}
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
				<Heading showLine>Nothing selected</Heading>
				<ExpandableList
					closeOnSelect
					noneText="Nothing Selected"
					title="Default"
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
				<Heading showLine>Default selected</Heading>
				<ExpandableList
					noneText="Nothing Selected"
					selected={1}
					title="Default"
				>
					{['Option 1', 'Option 2', 'Option 3']}
				</ExpandableList>
				<br />
				<Heading showLine>Default selected</Heading>
				<ExpandableList
					noneText="Nothing Selected"
					selected={1}
					title="Default"
				>
					{['Option 1', 'Option 2', 'Option 3']}
				</ExpandableList>
				<br />
				<Heading showLine>Default selected</Heading>
				<ExpandableList
					noneText="Nothing Selected"
					selected={1}
					title="Default"
				>
					{['Option 1', 'Option 2', 'Option 3']}
				</ExpandableList>
				<br />
				<Heading showLine>Multitple selected</Heading>
				<ExpandableList
					noneText="Nothing Selected"
					select="multiple"
					selected={[1, 2]}
					title="multiple"
				>
					{['Option 1', 'Option 2', 'Option 3']}
				</ExpandableList>
				<br />
				<Heading showLine>Long contents selected</Heading>
				<ExpandableList
					noneText="Nothing Selected"
					select="multiple"
					selected={[18, 19]}
					title="multiple"
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
		'With Focus outside Container',
		() => (
			<div>
				<Button small>focus to me</Button>
				<Scroller focusableScrollbar style={{height: ri.unit(420, 'rem'), width: ri.unit(300, 'rem'), display:'inline-block'}}>
					<Item>button1</Item>
					<Item>button2</Item>
					<Item>button3</Item>
					<Item>button4</Item>
					<Item>button5</Item>
					<Item>button6</Item>
					<Item>button7</Item>
					<Item>button8</Item>
					<Item>button9</Item>
					<div>Test Test Test Test Test Test </div>
				</Scroller>
			</div>
		)
	)
	.add(
		'Test scrolling to boundary with small overflow',
		() => {
			const size = number('Spacer size', Scroller, {max: 300, min: 0, range: true}, 100);
			return (
				<Scroller style={{height: ri.scaleToRem(200)}}>
					<Item>1</Item>
					<div style={{height: ri.scaleToRem(size), paddingLeft: ri.scaleToRem(40)}}>{size}px Spacer</div>
					<Item style={{marginBottom: ri.scaleToRem(18)}}>3</Item>
				</Scroller>
			);
		}
	)
	.add(
		'Test scrolling to boundary with long overflow',
		() => {
			const size = number('Spacer size', Scroller, {max: 300, min: 0, range: true}, 200);
			return (
				<Scroller
					style={{height: ri.scaleToRem(200)}}
					focusableScrollbar={boolean('focusableScrollbar', Scroller, true)}
				>
					<div style={{height: ri.scaleToRem(size), paddingLeft: ri.scaleToRem(40)}}>{size}px Spacer</div>
					<Item>1</Item>
					<div style={{height: ri.scaleToRem(size), paddingLeft: ri.scaleToRem(40)}}>{size}px Spacer</div>
					<Item>3</Item>
					<div style={{height: ri.scaleToRem(size), paddingLeft: ri.scaleToRem(40)}}>{size}px Spacer</div>
				</Scroller>
			);
		}
	).add(
		'With Spotlight Target Calculation',
		() => (
			<div>
				<Button>hello</Button>
				<Scroller
					focusableScrollbar
					style={{height: 400}}
				>
					<Group childComponent={Item}>
						{itemData}
					</Group>
				</Scroller>
			</div>
		)
	)
	.add(
		'With Long Item',
		() => (
			<Scroller focusableScrollbar>
				<Item>Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Text</Item>
				<ExpandableList title="Title">
					{itemData}
				</ExpandableList>
			</Scroller>
		)
	)
	.add(
		'With One Long Height Item',
		() => (
			<Scroller focusableScrollbar>
				<div style={{height: '1220px'}}>
					<Item style={{height: '1200px'}}>Long Height Item</Item>
				</div>
			</Scroller>
		)
	)
	.add(
		'With Nested Scroller',
		() => {
			let noScrollByWheel = boolean('noScrollByWheel', Scroller, false);
			return (
				<Scroller
					direction="vertical"
					verticalScrollbar="visible"
				>
					<Scroller
						direction="horizontal"
						horizontalScrollbar="visible"
						noScrollByWheel={noScrollByWheel}
						style={{
							height: 'auto',
							width: '90%'
						}}
					>
						<div
							style={{
								backgroundColor: '#444',
								width: ri.unit(2400, 'rem')
							}}
						>
							<Item>The first nested scroller.</Item>
							<br />
							<br />
							<Item>This is the upper horizontal scroller. If noScrollByWheel is not specified, this scroller will be scrolled by wheel and the outer scroller will not be scrolled.</Item>
							<br />
							<br />
							<Item>If noScrollByWheel is specified, this scroller will NOT be scrolled by wheel but the outer scroller will be scrolled.</Item>
							<br />
							<br />
							<Item>To set or unset noScrollByWheel prop, click KNOBS below.</Item>
						</div>
					</Scroller>
					<Scroller
						direction="horizontal"
						horizontalScrollbar="visible"
						noScrollByWheel={noScrollByWheel}
						style={{
							height: 'auto',
							width: '90%'
						}}
					>
						<div
							style={{
								backgroundColor: '#444',
								width: ri.unit(2400, 'rem')
							}}
						>
							<Item>The second nested scroller.</Item>
							<br />
							<br />
							<Item>This is the lower horizontal scroller. If noScrollByWheel is not specified, this scroller will be scrolled by wheel and the outer scroller will not be scrolled.</Item>
							<br />
							<br />
							<Item>If noScrollByWheel is specified, this scroller will NOT be scrolled by wheel but the outer scroller will be scrolled.</Item>
							<br />
							<br />
							<Item>To set or unset noScrollByWheel prop, click KNOBS below.</Item>
						</div>
					</Scroller>
				</Scroller>
			);
		}
	);
