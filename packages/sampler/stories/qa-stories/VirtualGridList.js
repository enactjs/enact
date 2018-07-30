import {VirtualGridList} from '@enact/moonstone/VirtualList';
import GridListImageItem from '@enact/moonstone/VirtualList/GridListImageItem';
import {VirtualListCore} from '@enact/moonstone/VirtualList/VirtualListBase';
import ri from '@enact/ui/resolution';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {boolean, number} from '@kadira/storybook-addon-knobs';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('VirtualGridList', VirtualListCore, VirtualGridList);

const
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
	.addWithInfo(
		'Horizontal VirtualGridList',
		() => (
			<VirtualGridList
				component={renderItem}
				data={items}
				dataSize={number('dataSize', items.length)}
				direction="horizontal"
				focusableScrollbar={nullify(boolean('focusableScrollbar', false))}
				itemSize={{
					minWidth: ri.scale(number('minWidth', 180)),
					minHeight: ri.scale(number('minHeight', 270))
				}}
				onScrollStart={action('onScrollStart')}
				onScrollStop={action('onScrollStop')}
				spacing={ri.scale(number('spacing', 18))}
				style={{
					height: ri.unit(552, 'rem')
				}}
			/>
		),
		{propTables: [Config]}
	);
