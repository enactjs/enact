import SwitchItem from '@enact/moonstone/SwitchItem';
import VirtualList, {VirtualListBase} from '@enact/moonstone/VirtualList';
import ri from '@enact/ui/resolution';
import React from 'react';
import PropTypes from 'prop-types';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, number} from '@storybook/addon-knobs';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('VirtualList', VirtualListBase, VirtualList);

const
	style = {
		item: {
			borderBottom: ri.unit(3, 'rem') + ' solid #202328',
			boxSizing: 'border-box'
		},
		list: {
			height: ri.unit(552, 'rem')
		}
	},
	items = [],
	// eslint-disable-next-line enact/prop-types, enact/display-name
	renderItem = (size) => ({data, index, ...rest}) => {
		const itemStyle = {height: size + 'px', ...style.item};
		return (
			<StatefulSwitchItem  index={index} style={itemStyle} {...rest}>
				{data[index].item}
			</StatefulSwitchItem>
		);
	};

for (let i = 0; i < 1000; i++) {
	items.push({item :'Item ' + ('00' + i).slice(-3), selected: false});
}

class StatefulSwitchItem extends React.Component {
	static propTypes = {
		index: PropTypes.number
	}

	constructor (props) {
		super(props);
		this.state = {
			selected: items[props.index].selected
		};
	}

	componentWillReceiveProps (nextProps) {
		if (this.props.index !== nextProps.index) {
			this.setState({selected: items[nextProps.index].selected});
		}
	}

	onToggle = () => {
		items[this.props.index].selected = !items[this.props.index].selected;
		this.setState({selected: !this.state.selected});
	}

	render () {
		const props = Object.assign({}, this.props);
		delete props.index;

		return (
			<SwitchItem {...props} onToggle={this.onToggle} selected={this.state.selected}>
				{this.props.children}
			</SwitchItem>
		);
	}
}

storiesOf('VirtualList', module)
	.add(
		'with more items',
		() => {
			const itemSize = ri.scale(number('itemSize', 72));
			return (
				<VirtualList
					component={renderItem(itemSize)}
					data={items}
					dataSize={number('dataSize', items.length)}
					focusableScrollbar={nullify(boolean('focusableScrollbar', false))}
					itemSize={itemSize}
					onScrollStart={action('onScrollStart')}
					onScrollStop={action('onScrollStop')}
					spacing={ri.scale(number('spacing', 0))}
					style={style.list}
				/>
			);
		},
		{propTables: [Config]}
	);
