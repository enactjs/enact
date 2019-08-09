import {VirtualGridList, VirtualListBase} from '@enact/moonstone/VirtualList';
import {VirtualListBase as UiVirtualListBase} from '@enact/ui/VirtualList/VirtualListBase';
import GridListImageItem from '@enact/moonstone/GridListImageItem';
import ri from '@enact/ui/resolution';
import {ScrollableBase as UiScrollableBase} from '@enact/ui/Scrollable';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {boolean, number, select} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('VirtualList', UiVirtualListBase, UiScrollableBase, VirtualListBase);

const
	defaultDataSize = 1000,
	wrapOption = {
		false: false,
		true: true,
		'&quot;noAnimation&quot;': 'noAnimation'
	},
	items = [],
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

storiesOf('VirtualGridList', module)
	.add(
		'Horizontal VirtualGridList',
		() => (
			<VirtualGridList
				dataSize={updateDataSize(number('dataSize', Config, defaultDataSize))}
				direction="horizontal"
				focusableScrollbar={boolean('focusableScrollbar', Config)}
				horizontalScrollbar={select('horizontalScrollbar', ['auto', 'hidden', 'visible'], Config)}
				itemRenderer={renderItem}
				itemSize={{
					minWidth: ri.scale(number('minWidth', Config, 180)),
					minHeight: ri.scale(number('minHeight', Config, 270))
				}}
				noScrollByWheel={boolean('noScrollByWheel', Config)}
				onKeyDown={action('onKeyDown')}
				onScrollStart={action('onScrollStart')}
				onScrollStop={action('onScrollStop')}
				spacing={ri.scale(number('spacing', Config, 18))}
				spotlightDisabled={boolean('spotlightDisabled', Config, false)}
				wrap={wrapOption[select('wrap', ['false', 'true', '"noAnimation"'], Config)]}
			/>
		),
		{propTables: [Config]}
	);
