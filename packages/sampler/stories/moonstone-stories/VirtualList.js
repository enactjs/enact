import ri from '@enact/ui/resolution';
import Item from '@enact/moonstone/Item';
import VirtualList from '@enact/moonstone/VirtualList';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, number} from '@kadira/storybook-addon-knobs';

VirtualList.displayName = 'VirtualList';

const
	style = {
		item : {
			position: 'absolute',
			width: '100%',
			height: '72px',
			borderBottom: '2px solid #202328',
			boxSizing: 'border-box',

			color: 'white',
			fontSize: '40px',
			lineHeight: '70px',
			textAlign: 'center'
		},
		listHeight : {
			height: '550px'
		}
	},
	data = [];

for (let i = 0; i < 1000; i++) {
	data.push('Item ' + ('00' + i).slice(-3));
}

const renderItem = ({index, key}) =>
	<Item key={key} style={style.item}>
		{data[index]}
	</Item>;

storiesOf('VirtualList')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of VirtualList',
		() => (
			<VirtualList
				data={data}
				dataSize={number('dataSize', data.length)}
				itemSize={ri.scale(number('itemSize', 72))}
				style={style.listHeight}
				component={renderItem}
			/>
		)
	);
