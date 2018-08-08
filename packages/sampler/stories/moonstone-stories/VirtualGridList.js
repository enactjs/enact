import {VirtualGridList as UiVirtualGridList} from '@enact/ui/VirtualList';
import {VirtualGridList} from '@enact/moonstone/VirtualList';
import {GridListImageItem as UiGridListImageItem} from '@enact/ui/GridListImageItem';
import {GridListImageItem} from '@enact/moonstone/GridListImageItem';
import ri from '@enact/ui/resolution';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {boolean, number, select} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

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


const Config = mergeComponentMetadata('VirtualGridList', UiVirtualGridList, VirtualGridList);
UiVirtualGridList.displayName = 'VirtualGridList';

storiesOf('UI', module)
	.add(
		'VirtualList.VirtualGridList',
		withInfo({
			text: 'Basic usage of VirtualGridList'
		})(() => (
			<UiVirtualGridList
				dataSize={updateDataSize(number('dataSize', Config, defaultDataSize))}
				direction={select('direction', prop.direction, Config, 'vertical')}
				itemRenderer={uiRenderItem}
				itemSize={{
					minWidth: ri.scale(number('minWidth', Config, 180)),
					minHeight: ri.scale(number('minHeight', Config, 270))
				}}
				onScrollStart={action('onScrollStart')}
				onScrollStop={action('onScrollStop')}
				spacing={ri.scale(number('spacing', Config, 20))}
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
			text: 'Basic usage of VirtualGridList'
		})(() => (
			<VirtualGridList
				dataSize={updateDataSize(number('dataSize', Config, defaultDataSize))}
				direction={select('direction', prop.direction, Config, 'vertical')}
				focusableScrollbar={boolean('focusableScrollbar', Config)}
				itemRenderer={renderItem}
				itemSize={{
					minWidth: ri.scale(number('minWidth', Config, 180)),
					minHeight: ri.scale(number('minHeight', Config, 270))
				}}
				onScrollStart={action('onScrollStart')}
				onScrollStop={action('onScrollStop')}
				spacing={ri.scale(number('spacing', Config, 20))}
				style={{
					height: ri.unit(549, 'rem')
				}}
				wrap={wrapOption[select('wrap', ['false', 'true', "'noAnimation'"], Config)]}
			/>
		))
	);
