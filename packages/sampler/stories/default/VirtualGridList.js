import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, number, select} from '@enact/storybook-utils/addons/knobs';
import {ImageItem as UiImageItem} from '@enact/ui/ImageItem';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import ri from '@enact/ui/resolution';
import React from 'react';
import {VirtualGridList, VirtualListBasic} from '@enact/ui/VirtualList';

const
	prop = {
		direction: {horizontal: 'horizontal', vertical: 'vertical'},
		scrollbarOption: ['auto', 'hidden', 'visible'],
		scrollModeOption: ['native', 'translate']
	},
	items = [],
	defaultDataSize = 1000,
	longContent = 'Lorem ipsum dolor sit amet',
	shouldAddLongContent = ({index, modIndex}) => (
		index % modIndex === 0 ? ` ${longContent}` : ''
	),
	// eslint-disable-next-line enact/prop-types
	uiRenderItem = ({index, ...rest}) => {
		const {text, source} = items[index];

		return (
			<UiImageItem
				{...rest}
				src={source}
				style={{width: '100%'}}
			>
				{text}
			</UiImageItem>
		);
	};

const updateDataSize = (dataSize) => {
	const
		itemNumberDigits = dataSize > 0 ? (dataSize - 1 + '').length : 0,
		headingZeros = Array(itemNumberDigits).join('0');

	items.length = 0;

	for (let i = 0; i < dataSize; i++) {
		const
			count = (headingZeros + i).slice(-itemNumberDigits),
			text = `Item ${count}${shouldAddLongContent({index: i, modIndex: 2})}`,
			color = Math.floor(Math.random() * (0x1000000 - 0x101010) + 0x101010).toString(16),
			source = `http://placehold.it/300x300/${color}/ffffff&text=Image ${i}`;

		items.push({text, source});
	}

	return dataSize;
};

updateDataSize(defaultDataSize);

const VirtualGridListConfig = mergeComponentMetadata('VirtualGridList', VirtualListBasic, VirtualGridList);

export default {
	title: 'UI'
};

export const VirtualListVirtualGridList = () => (
	<VirtualGridList
		dataSize={updateDataSize(number('dataSize', VirtualGridListConfig, defaultDataSize))}
		direction={select('direction', prop.direction, VirtualGridListConfig)}
		horizontalScrollbar={select('horizontalScrollbar', prop.scrollbarOption, VirtualGridListConfig)}
		itemRenderer={uiRenderItem}
		itemSize={{
			minWidth: ri.scale(number('minWidth', VirtualGridListConfig, 180)),
			minHeight: ri.scale(number('minHeight', VirtualGridListConfig, 270))
		}}
		key={select('scrollMode', prop.scrollModeOption, VirtualGridListConfig)}
		noScrollByWheel={boolean('noScrollByWheel', VirtualGridListConfig)}
		onScrollStart={action('onScrollStart')}
		onScrollStop={action('onScrollStop')}
		scrollMode={select('scrollMode', prop.scrollModeOption, VirtualGridListConfig)}
		spacing={ri.scale(number('spacing', VirtualGridListConfig, 20))}
		verticalScrollbar={select('verticalScrollbar', prop.scrollbarOption, VirtualGridListConfig)}
	/>
);

VirtualListVirtualGridList.story = {
	name: 'VirtualList.VirtualGridList',
	parameters: {
		info: {
			text: 'Basic usage of VirtualGridList'
		}
	}
};
