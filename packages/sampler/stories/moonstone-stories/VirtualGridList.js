import {VirtualGridList} from '@enact/moonstone/VirtualList';
import GridListImageItem from '@enact/moonstone/VirtualList/GridListImageItem';
import {VirtualListCore} from '@enact/moonstone/VirtualList/VirtualListBase';
import ri from '@enact/ui/resolution';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, number, select} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('VirtualGridList', VirtualListCore, VirtualGridList);

const
	prop = {
		direction: {'horizontal': 'horizontal', 'vertical': 'vertical'}
	},
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

storiesOf('Moonstone', module)
	.add(
		'VirtualList.VirtualGridList',
		withInfo({
			propTables: [Config],
			text: 'Basic usage of VirtualGridList'
		})(() => (
			<VirtualGridList
				component={renderItem}
				data={items}
				dataSize={number('dataSize', items.length)}
				direction={select('direction', prop.direction, 'vertical')}
				focusableScrollbar={nullify(boolean('focusableScrollbar', false))}
				itemSize={{
					minWidth: ri.scale(number('minWidth', 180)),
					minHeight: ri.scale(number('minHeight', 270))
				}}
				onScrollStart={action('onScrollStart')}
				onScrollStop={action('onScrollStop')}
				spacing={ri.scale(number('spacing', 20))}
				style={{
					height: ri.unit(549, 'rem')
				}}
			/>
		))
	);
