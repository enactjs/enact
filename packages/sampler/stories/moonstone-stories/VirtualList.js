import ri from '@enact/ui/resolution';
import Item from '@enact/moonstone/Item';
import VirtualList from '@enact/moonstone/VirtualList';
import {VirtualListCore} from '@enact/moonstone/VirtualList/VirtualListBase';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, number} from '@kadira/storybook-addon-knobs';

VirtualList.propTypes = Object.assign({}, VirtualListCore.propTypes);
VirtualList.defaultProps = Object.assign({}, VirtualListCore.defaultProps);

const
	style = {
		verticalItem: {
			position: 'absolute',
			width: '100%',
			height: ri.scale(72) + 'px',
			borderBottom: ri.scale(2) + 'px solid #202328',
			boxSizing: 'border-box',

			color: 'white',
			fontSize: ri.scale(40) + 'px',
			lineHeight: ri.scale(70) + 'px',
			textAlign: 'left'
		},
		listHeight: {
			height: ri.scale(550) + 'px'
		}
	},
	items = [],
	// eslint-disable-next-line enact/prop-types, enact/display-name
	renderItem = (direction) => ({data, index, key}) => (
		<Item key={key} style={style[direction + 'Item']}>
			{data[index]}
		</Item>
	);

for (let i = 0; i < 1000; i++) {
	items.push('Item ' + ('00' + i).slice(-3));
}

storiesOf('VirtualList')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of VirtualList',
		() => (
			<VirtualList
				onScrollStart={action('onScrollStart')}
				onScrollStop={action('onScrollStop')}
				data={items}
				dataSize={number('dataSize', items.length)}
				direction='vertical'
				hideScrollbars={boolean('hideScrollbars', false)}
				itemSize={ri.scale(number('itemSize', 72))}
				spacing={ri.scale(number('spacing', 0))}
				style={style.listHeight}
				component={renderItem('vertical')}
			/>
		)
	);
