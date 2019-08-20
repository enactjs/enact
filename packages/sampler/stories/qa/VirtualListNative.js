import React from 'react';
import Item from '@enact/moonstone/Item';
import {VirtualListNative, VirtualListBase} from '@enact/moonstone/VirtualList';
import {Column, Cell} from '@enact/ui/Layout';
import ri from '@enact/ui/resolution';
import {ScrollableBaseNative as UiScrollableBaseNative} from '@enact/ui/Scrollable/ScrollableNative';
import {VirtualListBaseNative as UiVirtualListBaseNative} from '@enact/ui/VirtualList/VirtualListBase';

import {storiesOf} from '@storybook/react';

import {boolean, number, select} from '../../src/enact-knobs';
import {action, mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('VirtualListNative', UiVirtualListBaseNative, UiScrollableBaseNative, VirtualListBase);

const
	items = [],
	prop = {
		scrollbarOption: ['auto', 'hidden', 'visible']
	},
	wrapOption = {
		false: false,
		true: true,
		'&quot;noAnimation&quot;': 'noAnimation'
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

storiesOf('VirtualListNative', module)
	.add(
		'with extra items',
		() => (
			<Column>
				<Cell
					component={VirtualListNative}
					dataSize={updateDataSize(number('dataSize', Config, 10))}
					direction="vertical"
					focusableScrollbar={boolean('focusableScrollbar', Config)}
					horizontalScrollbar={select('horizontalScrollbar', prop.scrollbarOption, Config)}
					// eslint-disable-next-line react/jsx-no-bind
					itemRenderer={({index, ...rest}) => {
						return (<Item {...rest}>{items[index]}</Item>);
					}}
					itemSize={ri.scale(number('itemSize', Config, 60))}
					noScrollByWheel={boolean('noScrollByWheel', Config)}
					onKeyDown={action('onKeyDown')}
					onScrollStart={action('onScrollStart')}
					onScrollStop={action('onScrollStop')}
					spacing={ri.scale(number('spacing', Config, 20))}
					spotlightDisabled={boolean('spotlightDisabled(for all items)', Config, false)}
					verticalScrollbar={select('verticalScrollbar', prop.scrollbarOption, Config)}
					wrap={wrapOption[select('wrap', ['false', 'true', '"noAnimation"'], Config)]}
				/>
				<Cell shrink component={Item}>extra item1</Cell>
				<Cell shrink component={Item}>extra item2</Cell>
				<Cell shrink component={Item}>extra item3</Cell>
			</Column>
		)
	);
