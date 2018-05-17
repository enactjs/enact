import {VirtualGridList as UiVirtualGridList, VirtualListBase as UiVirtualListBase} from '@enact/ui/VirtualList';
import {VirtualGridList, VirtualListBase} from '@enact/moonstone/VirtualList';
import {GridListImageItem as UiGridListImageItem} from '@enact/ui/GridListImageItem';
import {GridListImageItem} from '@enact/moonstone/GridListImageItem';
import ri from '@enact/ui/resolution';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, number, select} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('VirtualGridList', VirtualGridList, VirtualListBase, UiVirtualListBase);

const
	wrapOption = {
		'false': false,
		'true': true,
		"'noAnimation'": 'noAnimation'
	},
	prop = {
		direction: {'horizontal': 'horizontal', 'vertical': 'vertical'}
	},
	items = [],
	defaultDataSize = 1000,
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
			text = `Item ${count}`,
			subText = `SubItem ${count}`,
			color = Math.floor((Math.random() * (0x1000000 - 0x101010)) + 0x101010).toString(16),
			source = `http://placehold.it/300x300/${color}/ffffff&text=Image ${i}`;

		items.push({text, subText, source});
	}

	return dataSize;
};

updateDataSize(defaultDataSize);

storiesOf('UI', module)
	.add(
		'VirtualList.VirtualGridList',
		withInfo({
			propTables: [Config],
			text: 'Basic usage of VirtualGridList'
		})(() => (
			<UiVirtualGridList
				dataSize={updateDataSize(number('dataSize', defaultDataSize))}
				direction={select('direction', prop.direction, 'vertical')}
				itemRenderer={uiRenderItem}
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

storiesOf('Moonstone', module)
	.add(
		'VirtualList.VirtualGridList',
		withInfo({
			propTables: [Config],
			text: 'Basic usage of VirtualGridList'
		})(() => (
			<VirtualGridList
				dataSize={updateDataSize(number('dataSize', defaultDataSize))}
				direction={select('direction', prop.direction, 'vertical')}
				focusableScrollbar={nullify(boolean('focusableScrollbar', false))}
				itemRenderer={renderItem}
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
				wrap={wrapOption[select('wrap', ['false', 'true', "'noAnimation'"])]}
			/>
		))
	);
