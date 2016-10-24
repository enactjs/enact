import ri from '@enact/ui/resolution';
import {VirtualGridList} from '@enact/moonstone/VirtualList';
import GridListImageItem from '@enact/moonstone/VirtualList/GridListImageItem';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, number} from '@kadira/storybook-addon-knobs';

import defaultImage from '../../images/placeholder.png';

VirtualGridList.displayName = 'VirtualGridList';

const
	style = {
		item : {
			position: 'absolute',
			width: '100%',
			height: '100%',
			padding: '0 0 96px 0',
			margin: '0',
			border: '6px solid transparent',
			boxSizing: 'border-box',

			color: '#fff'
		},
		listHeight : {
			height: '550px'
		}
	},
	data = [];

for (let i = 0; i < 1000; i++) {
	let count = ('00' + i).slice(-3);
	data.push({text: 'Item ' + count, subText: 'SubItem ' + count});
}

const renderItem = ({index, key}) => <GridListImageItem
	caption={data[index].text}
	key={key}
	source={defaultImage}
	subCaption={data[index].subText}
	style={style.item}
/>;

storiesOf('VirtualGridList')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of VirtualGridList',
		() => (
			<VirtualGridList
				data={data}
				dataSize={number('dataSize', data.length)}
				itemSize={{minWidth: ri.scale(number('minWidth', 180)), minHeight: ri.scale(number('minHeight', 270))}}
				spacing={ri.scale(number('spacing', 20))}
				style={style.listHeight}
				component={renderItem}
			/>
		)
	);
