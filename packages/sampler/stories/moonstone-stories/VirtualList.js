import Item from '@enact/moonstone/Item';
import kind from '@enact/core/kind';
import ri from '@enact/ui/resolution';
import VirtualList, {ListItemDecorator} from '@enact/moonstone/VirtualList';
import {VirtualListCore} from '@enact/moonstone/VirtualList/VirtualListBase';
import React, {PropTypes} from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, number} from '@kadira/storybook-addon-knobs';

VirtualList.propTypes = Object.assign({}, VirtualListCore.propTypes);
VirtualList.defaultProps = Object.assign({}, VirtualListCore.defaultProps);

const
	listStyle = {height: ri.scale(550) + 'px'},
	items = [],
	VirtualListItemBase = kind({
		name: 'VirtualListItemBase',
		propTypes: {
			data: PropTypes.any,
			index: PropTypes.number
		},
		render: ({data, index, ...rest}) => {
			return (<Item {...rest}>{data[index]}</Item>);
		}
	}),
	VirtualListItem = ListItemDecorator({border: true}, VirtualListItemBase),
	// eslint-disable-next-line enact/prop-types, enact/display-name
	renderItem = (size) => (props) => {
		const itemStyle = {height: size + 'px'};
		return (
			<VirtualListItem {...props} style={itemStyle} />
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
					style={listStyle}
				/>
			);
		}
	);
