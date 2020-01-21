import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, number, select} from '@enact/storybook-utils/addons/knobs';
import {GridListImageItem} from '@enact/moonstone/GridListImageItem';
import {GridListImageItem as UiGridListImageItem} from '@enact/ui/GridListImageItem';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import ri from '@enact/ui/resolution';
import React from 'react';
import {ScrollableBase as UiScrollableBase} from '@enact/ui/Scrollable';
import {storiesOf} from '@storybook/react';
import {VirtualGridList, VirtualListBase} from '@enact/moonstone/VirtualList';
import {VirtualGridList as UiVirtualGridList, VirtualListBase as UiVirtualListBase} from '@enact/ui/VirtualList';

const
	wrapOption = {
		false: false,
		true: true,
		'&quot;noAnimation&quot;': 'noAnimation'
	},
	prop = {
		direction: {horizontal: 'horizontal', vertical: 'vertical'},
		scrollbarOption: ['auto', 'hidden', 'visible']
	},
	items = [],
	defaultDataSize = 1000,
	longContent = 'Lorem ipsum dolor sit amet',
	shouldAddLongContent = ({index, modIndex}) => (
		index % modIndex === 0 ? ` ${longContent}` : ''
	),
	// eslint-disable-next-line enact/prop-types
	uiRenderItem = ({index, ...rest}) => {
		const {text, subText, source} = items[index];

		return (
			<UiGridListImageItem
				{...rest}
				caption={text}
				source={source}
				subCaption={subText}
			/>
		);
	},
	// eslint-disable-next-line enact/prop-types
	renderItem = ({index, ...rest}) => {
		const {text, subText, source} = items[index];

		return (
			<GridListImageItem
				{...rest}
				caption={text}
				source={source}
				subCaption={subText}
			/>
		);
	};

const updateDataSize = (dataSize) => {
	const
		itemNumberDigits = dataSize > 0 ? ((dataSize - 1) + '').length : 0,
		headingZeros = Array(itemNumberDigits).join('0');

	items.length = 0;

	for (let i = 0; i < dataSize; i++) {
		const
			count = (headingZeros + i).slice(-itemNumberDigits),
			text = `Item ${count}${shouldAddLongContent({index: i, modIndex: 2})}`,
			subText = `SubItem ${count}${shouldAddLongContent({index: i, modIndex: 3})}`,
			color = Math.floor((Math.random() * (0x1000000 - 0x101010)) + 0x101010).toString(16),
			source = `http://placehold.it/300x300/${color}/ffffff&text=Image ${i}`;

		items.push({text, subText, source});
	}

	return dataSize;
};

updateDataSize(defaultDataSize);

const UiVirtualGridListConfig = mergeComponentMetadata('VirtualGridList', UiVirtualListBase, UiScrollableBase);
const VirtualGridListConfig = mergeComponentMetadata('VirtualGridList', UiVirtualListBase, UiScrollableBase, VirtualListBase);

storiesOf('UI', module)
	.add(
		'VirtualList.VirtualGridList',
		() => (
			<UiVirtualGridList
				dataSize={updateDataSize(number('dataSize', UiVirtualGridListConfig, defaultDataSize))}
				direction={select('direction', prop.direction, UiVirtualGridListConfig)}
				horizontalScrollbar={select('horizontalScrollbar', prop.scrollbarOption, UiVirtualGridListConfig)}
				itemRenderer={uiRenderItem}
				itemSize={{
					minWidth: ri.scale(number('minWidth', UiVirtualGridListConfig, 180)),
					minHeight: ri.scale(number('minHeight', UiVirtualGridListConfig, 270))
				}}
				noScrollByWheel={boolean('noScrollByWheel', UiVirtualGridListConfig)}
				onScrollStart={action('onScrollStart')}
				onScrollStop={action('onScrollStop')}
				spacing={ri.scale(number('spacing', UiVirtualGridListConfig, 20))}
				verticalScrollbar={select('verticalScrollbar', prop.scrollbarOption, UiVirtualGridListConfig)}
			/>
		),
		{
			info: {
				text: 'Basic usage of VirtualGridList'
			}
		}
	);

storiesOf('Moonstone', module)
	.add(
		'VirtualList.VirtualGridList',
		() => (
			<VirtualGridList
				dataSize={updateDataSize(number('dataSize', VirtualGridListConfig, defaultDataSize))}
				direction={select('direction', prop.direction, VirtualGridListConfig)}
				focusableScrollbar={boolean('focusableScrollbar', VirtualGridListConfig)}
				horizontalScrollbar={select('horizontalScrollbar', prop.scrollbarOption, VirtualGridListConfig)}
				itemRenderer={renderItem}
				itemSize={{
					minWidth: ri.scale(number('minWidth', VirtualGridListConfig, 180)),
					minHeight: ri.scale(number('minHeight', VirtualGridListConfig, 270))
				}}
				noScrollByWheel={boolean('noScrollByWheel', VirtualGridListConfig)}
				onScrollStart={action('onScrollStart')}
				onScrollStop={action('onScrollStop')}
				spacing={ri.scale(number('spacing', VirtualGridListConfig, 20))}
				spotlightDisabled={boolean('spotlightDisabled', VirtualGridListConfig, false)}
				verticalScrollbar={select('verticalScrollbar', prop.scrollbarOption, VirtualGridListConfig)}
				wrap={wrapOption[select('wrap', ['false', 'true', '"noAnimation"'], VirtualGridListConfig)]}
			/>
		),
		{
			info: {
				text: 'Basic usage of VirtualGridList'
			}
		}
	);
