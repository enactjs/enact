import {Item as UiItem} from '@enact/ui/Item';
import Item from '@enact/moonstone/Item';
import {VirtualList as UiVirtualList} from '@enact/ui/VirtualList';
import VirtualList from '@enact/moonstone/VirtualList';
import ri from '@enact/ui/resolution';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {boolean, number, select} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const
	wrapOption = {
		'false': false,
		'true': true,
		'&quot;noAnimation&quot;': 'noAnimation'
	},
	items = [],
	defaultDataSize = 1000,
	// eslint-disable-next-line enact/prop-types, enact/display-name
	uiRenderItem = (size) => ({index, ...rest}) => {
		const itemStyle = {
			borderBottom: ri.unit(3, 'rem') + ' solid #202328',
			boxSizing: 'border-box',
			height: size + 'px'
		};

		return (
			<UiItem {...rest} style={itemStyle}>
				{items[index]}
			</UiItem>
		);
	},
	// eslint-disable-next-line enact/prop-types, enact/display-name
	renderItem = (size) => ({index, ...rest}) => {
		const itemStyle = {
			borderBottom: ri.unit(3, 'rem') + ' solid #202328',
			boxSizing: 'border-box',
			height: size + 'px'
		};

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

const Config = mergeComponentMetadata('VirtualList', UiVirtualList, VirtualList);
UiVirtualList.displayName = 'VirtualList';

storiesOf('UI', module)
	.add(
		'VirtualList',
		() => {
			const itemSize = ri.scale(number('itemSize', Config, 72));
			return (
				<UiVirtualList
					dataSize={updateDataSize(number('dataSize', Config, defaultDataSize))}
					itemRenderer={uiRenderItem(itemSize)}
					itemSize={itemSize}
					onScrollStart={action('onScrollStart')}
					onScrollStop={action('onScrollStop')}
					spacing={ri.scale(number('spacing', Config, 0))}
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
			const itemSize = ri.scale(number('itemSize', Config, 72));
			return (
				<VirtualList
					dataSize={updateDataSize(number('dataSize', Config, defaultDataSize))}
					focusableScrollbar={boolean('focusableScrollbar', Config)}
					itemRenderer={renderItem(itemSize)}
					itemSize={itemSize}
					onScrollStart={action('onScrollStart')}
					onScrollStop={action('onScrollStop')}
					spacing={ri.scale(number('spacing', Config, 0))}
					wrap={wrapOption[select('wrap', ['false', 'true', '"noAnimation"'], Config)]}
				/>
			);
		},
		{
			info: {
				text: 'Basic usage of VirtualList'
			}
		}
	);
