import Item from '@enact/moonstone/Item';
import kind from '@enact/core/kind';
import ri from '@enact/ui/resolution';
import VirtualList, {VirtualListItemable} from '@enact/moonstone/VirtualList';
import {VirtualListCore} from '@enact/moonstone/VirtualList/VirtualListBase';
import React, {PropTypes} from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, number} from '@kadira/storybook-addon-knobs';

VirtualList.propTypes = Object.assign({}, VirtualListCore.propTypes);
VirtualList.defaultProps = Object.assign({}, VirtualListCore.defaultProps);

const
	items = [],
	itemSize = ri.scale(72),
	style = {
		item: {height: itemSize + 'px'},
		list: {height: ri.scale(550) + 'px'}
	};

const VirtualListItemBase = kind({
	name: 'VirtualListItemBase',
	propTypes: {
		data: PropTypes.any,
		index: PropTypes.number
	},
	render: ({data, index, ...rest}) => {
		return (<Item {...rest} style={style.item}>{data[index]}</Item>);
	}
});

const VirtualListItem = VirtualListItemable({border: true}, VirtualListItemBase);

for (let i = 0; i < 1000; i++) {
	items.push('Item ' + ('00' + i).slice(-3));
}

storiesOf('VirtualList')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of VirtualList',
		() => {
			return (
				<VirtualList
					component={VirtualListItem}
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
