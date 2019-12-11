import Item from '@enact/moonstone/Item';
import {Item as UiItem} from '@enact/ui/Item';
import React from 'react';
import ri from '@enact/ui/resolution';
import {ScrollableBase as UiScrollableBase} from '@enact/ui/Scrollable';
import {storiesOf} from '@storybook/react';
import VirtualList, {VirtualListBase} from '@enact/moonstone/VirtualList';
import {VirtualList as UiVirtualList, VirtualListBase as UiVirtualListBase} from '@enact/ui/VirtualList';

import {boolean, number, select} from '../../src/enact-knobs';
import {action, mergeComponentMetadata} from '../../src/utils';

const
	wrapOption = {
		false: false,
		true: true,
		'&quot;noAnimation&quot;': 'noAnimation'
	},
	prop = {
		direction: ['horizontal', 'vertical'],
		scrollbarOption: ['auto', 'hidden', 'visible']
	},
	items = [],
	defaultDataSize = 1000,
	// eslint-disable-next-line enact/prop-types, enact/display-name
	uiRenderItem = (direction, size) => ({index, ...rest}) => {
		const
			sizePx = size + 'px',
			itemStyle = {
				borderBottom: ri.unit(3, 'rem') + ' solid #202328',
				boxSizing: 'border-box'
			};

		if (direction !== 'horizontal') {
			itemStyle.height = sizePx;
		} else {
			itemStyle.width = sizePx;
			itemStyle.writingMode = 'vertical-lr';
		}

		return (
			<UiItem {...rest} style={itemStyle}>
				{items[index]}
			</UiItem>
		);
	},
	// eslint-disable-next-line enact/prop-types, enact/display-name
	renderItem = (direction, size) => ({index, ...rest}) => {
		const
			sizePx = size + 'px',
			itemStyle = {
				borderBottom: ri.unit(3, 'rem') + ' solid #202328',
				boxSizing: 'border-box',
			};

		if (direction !== 'horizontal') {
			itemStyle.height = sizePx;
		} else {
			itemStyle.width = sizePx;
			itemStyle.writingMode = 'vertical-lr';
		}

		return (
			<Item {...rest} style={itemStyle}>
				{items[index]}
			</Item>
		);
	};

const updateDataSize = (dataSize) => {
	const
		itemNumberDigits = dataSize > 0 ? ((dataSize - 1) + '').length : 0,
		headingZeros = Array(itemNumberDigits).join('0');

	items.length = 0;

	for (let i = 0; i < dataSize; i++) {
		items.push('Item ' + (headingZeros + i).slice(-itemNumberDigits));
	}

	return dataSize;
};

updateDataSize(defaultDataSize);

const UiVirtualListConfig = mergeComponentMetadata('VirtualList', UiVirtualListBase, UiScrollableBase);
const VirtualListConfig = mergeComponentMetadata('VirtualList', UiVirtualListBase, UiScrollableBase, VirtualListBase);

storiesOf('UI', module)
	.add(
		'VirtualList',
		() => {
			return (
				<UiVirtualList
					dataSize={updateDataSize(number('dataSize', UiVirtualListConfig, defaultDataSize))}
					direction={select('direction', prop.direction, UiVirtualListConfig)}
					horizontalScrollbar={select('horizontalScrollbar', prop.scrollbarOption, UiVirtualListConfig)}
					itemRenderer={uiRenderItem(select('direction', prop.direction, VirtualListConfig), ri.scale(number('itemSize', UiVirtualListConfig, 72)))}
					itemSize={ri.scale(number('itemSize', UiVirtualListConfig, 72))}
					noScrollByWheel={boolean('noScrollByWheel', UiVirtualListConfig)}
					onScrollStart={action('onScrollStart')}
					onScrollStop={action('onScrollStop')}
					spacing={ri.scale(number('spacing', UiVirtualListConfig))}
					verticalScrollbar={select('verticalScrollbar', prop.scrollbarOption, UiVirtualListConfig)}
				/>
			);
		},
		{
			info: {
				text: 'Basic usage of VirtualList'
			}
		}
	);


storiesOf('Moonstone', module)
	.add(
		'VirtualList',
		() => {
			return (
				<VirtualList
					dataSize={updateDataSize(number('dataSize', VirtualListConfig, defaultDataSize))}
					direction={select('direction', prop.direction, VirtualListConfig)}
					focusableScrollbar={boolean('focusableScrollbar', VirtualListConfig)}
					horizontalScrollbar={select('horizontalScrollbar', prop.scrollbarOption, VirtualListConfig)}
					itemRenderer={renderItem(select('direction', prop.direction, VirtualListConfig), ri.scale(number('itemSize', VirtualListConfig, 72)))}
					itemSize={ri.scale(number('itemSize', VirtualListConfig, 72))}
					noScrollByWheel={boolean('noScrollByWheel', VirtualListConfig)}
					onScrollStart={action('onScrollStart')}
					onScrollStop={action('onScrollStop')}
					spacing={ri.scale(number('spacing', VirtualListConfig))}
					spotlightDisabled={boolean('spotlightDisabled', VirtualListConfig, false)}
					verticalScrollbar={select('verticalScrollbar', prop.scrollbarOption, VirtualListConfig)}
					wrap={wrapOption[select('wrap', ['false', 'true', '"noAnimation"'], VirtualListConfig)]}
				/>
			);
		},
		{
			info: {
				text: 'Basic usage of VirtualList'
			}
		}
	);
