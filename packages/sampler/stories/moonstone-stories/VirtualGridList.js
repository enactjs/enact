import ri from '@enact/ui/resolution';
import {VirtualGridList} from '@enact/moonstone/VirtualList';
import GridListImageItem from '@enact/moonstone/VirtualList/GridListImageItem';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, number} from '@kadira/storybook-addon-knobs';

import defaultImage from '../../images/default-music.png';

VirtualGridList.displayName = 'VirtualGridList';

const
	STYLE = {
		renderItem : {
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
	key={key}
	caption={data[index].text}
	source={defaultImage}
	style={STYLE.renderItem}
	subCaption={data[index].subText}
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
				style={STYLE.listHeight}
				component={renderItem}
			/>
		)
	);
