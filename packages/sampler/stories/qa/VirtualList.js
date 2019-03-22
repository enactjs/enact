import SwitchItem from '@enact/moonstone/SwitchItem';
import VirtualList, {VirtualListBase} from '@enact/moonstone/VirtualList';
import {VirtualListBase as UiVirtualListBase} from '@enact/ui/VirtualList';
import ri from '@enact/ui/resolution';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {boolean, number} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('VirtualList', VirtualList, VirtualListBase, UiVirtualListBase);

const
	itemStyle = {
		borderBottom: ri.unit(3, 'rem') + ' solid #202328',
		boxSizing: 'border-box'
	},
	items = [],
	defaultDataSize = 1000,
	// eslint-disable-next-line enact/prop-types, enact/display-name
	renderItem = (onToggle, size) => ({index, ...rest}) => {
		const style = {height: size + 'px', ...itemStyle};
		return (
			<SwitchItem
				index={index}
				selected={items[index].selected}
				style={style}
				onToggle={({selected}) => {
					onToggle({selected, index});
				}}
				{...rest}
			>
				{items[index].item}
			</SwitchItem>
		);
	};

const updateDataSize = (dataSize) => {
	const
		itemNumberDigits = dataSize > 0 ? ((dataSize - 1) + '').length : 0,
		headingZeros = Array(itemNumberDigits).join('0');

	items.length = 0;

	for (let i = 0; i < dataSize; i++) {
		items.push({item :'Item ' + (headingZeros + i).slice(-itemNumberDigits), selected: false});
	}

	return dataSize;
};

updateDataSize(defaultDataSize);

const handleToggle = ({index, selected}) => {
	items[index].selected = selected;
};

storiesOf('VirtualList', module)
	.add(
		'with more items',
		() => {
			const itemSize = ri.scale(number('itemSize', Config, 72));
			return (
				<VirtualList
					dataSize={updateDataSize(number('dataSize', Config, defaultDataSize))}
					focusableScrollbar={boolean('focusableScrollbar', Config, false)}
					itemRenderer={renderItem(handleToggle, itemSize)}
					itemSize={itemSize}
					onScrollStart={action('onScrollStart')}
					onScrollStop={action('onScrollStop')}
					spacing={ri.scale(number('spacing', Config, 0))}
				/>
			);
		},
		{propTables: [Config]}
	);
