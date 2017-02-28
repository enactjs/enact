import ri from '@enact/ui/resolution';
import Item from '@enact/moonstone/Item';
import VirtualList from '@enact/moonstone/VirtualList';
import {VirtualListCore} from '@enact/moonstone/VirtualList/VirtualListBase';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, number} from '@kadira/storybook-addon-knobs';

VirtualList.propTypes = Object.assign({}, VirtualListCore.propTypes);
VirtualList.defaultProps = Object.assign({}, VirtualListCore.defaultProps);

const
	style = {
		item: {
			position: 'absolute',
			width: '100%',
			borderBottom: ri.scale(2) + 'px solid #202328',
			boxSizing: 'border-box'
		},
		list: {
			height: ri.scale(550) + 'px'
		}
	},
	items = [],
	// eslint-disable-next-line enact/prop-types, enact/display-name
	renderItem = (size) => ({data, index, key}) => {
		const itemStyle = {height: size + 'px', ...style.item};
		return (
			<Item key={key} style={itemStyle}>
				{data[index]}
			</Item>
		);
	};

for (let i = 0; i < 1000; i++) {
	items.push('Item ' + ('00' + i).slice(-3));
}

storiesOf('VirtualList')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of VirtualList',
		() => {
			const itemSize = ri.scale(number('itemSize', 72));
			return (
				<VirtualList
					component={renderItem(itemSize)}
					data={items}
					dataSize={number('dataSize', items.length)}
					itemSize={itemSize}
					onScrollStart={action('onScrollStart')}
					onScrollStop={action('onScrollStop')}
					spacing={ri.scale(number('spacing', 0))}
					style={style.list}
				/>
			);
		}
	);
