import VirtualList from '@enact/moonstone/VirtualList';
import ri from '@enact/ui/resolution';
import Item from '@enact/moonstone/Item';
import Slider from '@enact/moonstone/Slider';
import React from 'react';
import PropTypes from 'prop-types';
import {storiesOf} from '@storybook/react';

import {number} from '../../src/enact-knobs';

Slider.displayName = 'Slider';

class SliderList extends React.Component {
	static propTypes = {
		itemSize: PropTypes.number
	}

	constructor (props) {
		super(props);
		this.state = {
			selectedItems: [],
			value: 50
		};
		this.items = [
			{item: 'Apple', count: 10},
			{item: 'Orange', count: 5},
			{item: 'Banana', count: 20},
			{item: 'Mango', count: 60},
			{item: 'Apricot', count: 15},
			{item: 'Peach', count: 92},
			{item: 'Pineapple', count: 67},
			{item: 'Strawberry', count: 70},
			{item: 'Grapes', count: 44},
			{item: 'Watermelon', count: 55}
		];
	}

	componentDidMount () {
		this.fillItems(this.state.value);
	}

	fillItems = (value) => {
		let selected = this.items.filter((item) => {
			if (item.count <= value) {
				return true;
			}
		});

		this.setState({
			selectedItems: selected,
			value: value
		});
	}

	handleChange = (e) => {
		this.fillItems(e.value);
	}

	renderItem = (size) => ({index, ...rest}) => {
		const itemStyle = {
			height: size + 'px',
			borderBottom: ri.unit(3, 'rem') + ' solid #202328',
			boxSizing: 'border-box'
		};

		return (
			<Item {...rest} style={itemStyle}>
				{this.items[index].item + ': ' + this.items[index].count}
			</Item>
		);
	}

	render () {
		return (
			<div>
				<Slider
					backgroundProgress={0}
					disabled={false}
					max={100}
					min={0}
					onChange={this.handleChange}
					step={1}
					tooltip={false}
					value={this.state.value}
				/>
				<VirtualList
					dataSize={this.state.selectedItems.length}
					itemRenderer={this.renderItem(this.props.itemSize)}
					itemSize={this.props.itemSize}
					style={{
						height: ri.unit(552, 'rem')
					}}
				/>
			</div>
		);
	}
}

storiesOf('Slider', module)
	.add(
		'Add and Remove ',
		() => {
			const itemSize = ri.scale(number('itemSize', Slider, 72));
			return (
				<SliderList itemSize={itemSize} />
			);
		}
	);
