import {VirtualGridList} from '@enact/moonstone/VirtualList';
import ri from '@enact/ui/resolution';
import {VirtualListCore} from '@enact/moonstone/VirtualList/VirtualListBase';
import GridListImageItem from '@enact/moonstone/VirtualList/GridListImageItem';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, number, select} from '@kadira/storybook-addon-knobs';

import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('VirtualGridList', VirtualListCore, VirtualGridList);

const
	prop = {
		direction: {'horizontal': 'horizontal', 'vertical': 'vertical'}
	},
	listStyle = {height: ri.scale(550) + 'px'},
	items = [],
	// eslint-disable-next-line enact/prop-types
	renderItem = ({data, index, ...rest}) => {
		const {text, subText, source} = data[index];

		return (
			<GridListImageItem
				{...rest}
				caption={text}
				source={source}
				subCaption={subText}
			/>
		);
	};

for (let i = 0; i < 1000; i++) {
	const
		count = ('00' + i).slice(-3),
		text = `Item ${count}`,
		subText = `SubItem ${count}`,
		color = Math.floor((Math.random() * (0x1000000 - 0x101010)) + 0x101010).toString(16),
		source = `http://placehold.it/300x300/${color}/ffffff&text=Image ${i}`;

	items.push({text, subText, source});
}

storiesOf('VirtualList.VirtualGridList')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of VirtualGridList',
		() => (
			<VirtualGridList
				component={renderItem}
				data={items}
				dataSize={number('dataSize', items.length)}
				direction={select('direction', prop.direction, 'vertical')}
				itemSize={{minWidth: ri.scale(number('minWidth', 180)), minHeight: ri.scale(number('minHeight', 270))}}
				onScrollStart={action('onScrollStart')}
				onScrollStop={action('onScrollStop')}
				spacing={ri.scale(number('spacing', 20))}
				style={listStyle}
			/>
		),
		{propTables: [Config]}
	);
