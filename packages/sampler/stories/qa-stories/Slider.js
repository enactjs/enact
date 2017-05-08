import VirtualList from '@enact/moonstone/VirtualList';
import ri from '@enact/ui/resolution';
import Item from '@enact/moonstone/Item';

import Slider from '@enact/moonstone/Slider';
import React from 'react';
import PropTypes from 'prop-types';

import {storiesOf} from '@kadira/storybook';
import {withKnobs, number} from '@kadira/storybook-addon-knobs';

const
	style = {
		item: {
			borderBottom: ri.scale(2) + 'px solid #202328',
			boxSizing: 'border-box'
		},
		list: {
			height: ri.scale(552) + 'px'
		}
	};

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
			10, 5, 20, 60, 15, 92, 67, 70, 44, 55
		];
	}

	componentDidMount () {
		this.fillItems(this.state.value);
	}

	fillItems = (value) => {
		let selected = [];
		this.items.map((item) => {
			if (item <= value) {
				selected.push('Item count ' + item);
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

	renderItem = (size) => ({data, index, ...rest}) => {
		const itemStyle = {height: size + 'px', ...style.item};

		return (
			<Item {...rest} style={itemStyle}>
				{data[index]}
			</Item>
		);
	}

	render () {
		return (
			<div>
				<Slider
					backgroundProgress={0}
					detachedKnob={false}
					disabled={false}
					max={100}
					min={0}
					onChange={this.handleChange}
					step={1}
					tooltip={false}
					vertical={false}
					value={this.state.value}
				/>
				<VirtualList
					component={this.renderItem(this.props.itemSize)}
					data={this.state.selectedItems}
					dataSize={this.state.selectedItems.length}
					itemSize={this.props.itemSize}
					spacing={ri.scale(0)}
					style={style.list}
				/>
			</div>
		);
	}
}

storiesOf('Slider')
	.addDecorator(withKnobs)
	.addWithInfo(
		'Add and Remove ',
		() => {
			const itemSize = ri.scale(number('itemSize', 72));
			return (
				<SliderList itemSize={itemSize} />
			);
		}
	);

