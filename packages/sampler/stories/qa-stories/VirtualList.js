import SwitchItem from '@enact/moonstone/SwitchItem';
import VirtualList from '@enact/moonstone/VirtualList';
import {VirtualListCore} from '@enact/moonstone/VirtualList/VirtualListBase';
import ri from '@enact/ui/resolution';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {number} from '@kadira/storybook-addon-knobs';

import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('VirtualList', VirtualListCore, VirtualList);

const
	style = {
		item: {
			borderBottom: ri.unit(3, 'rem') + ' solid #202328',
			boxSizing: 'border-box'
		},
		list: {
			height: ri.unit(552, 'rem')
		}
	};

class StatefulVirtualList extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			itemList: []
		};

	}

	componentWillMount () {
		this.initializeItems();
	}

	initializeItems = () => {
		const initailItems = [];
		for (let i = 0; i < 100; i++) {
			initailItems.push({item :'Item ' + ('00' + i).slice(-3), selected:false});
		}

		this.setState({
			itemList: initailItems
		});
	}

	handleClick = (index) => {
		const changedItems = [...this.state.itemList],
			sel = changedItems[index].selected;
		changedItems[index] = {
			...this.state.itemList[index],
			selected: !sel
		};

		this.setState({
			itemList: changedItems
		});
	}

	renderItem = (size) => ({data, index, ...rest}) => {
		const itemStyle = {height: size + 'px', ...style.item};
		return (
			<SwitchItem {...rest} style={itemStyle} selected={data[index].selected} onClick={() => this.handleClick(index)}>
				{data[index].item}
			</SwitchItem>
		);
	};

	render () {
		const itemSize = ri.scale(number('itemSize', 60));
		return (
			<VirtualList
				{...this.props}
				component={this.renderItem(itemSize)}
				data={this.state.itemList}
				dataSize={number('dataSize', this.state.itemList.length)}
				itemSize={itemSize}
				onScrollStart={action('onScrollStart')}
				onScrollStop={action('onScrollStop')}
				spacing={ri.scale(number('spacing', 0))}
				style={style.list}
			/>
		);
	}
}

storiesOf('VirtualList')
	.addWithInfo(
		'with more items',
		() => {
			return (
				<StatefulVirtualList />
			);
		},
		{propTables: [Config]}
	);
