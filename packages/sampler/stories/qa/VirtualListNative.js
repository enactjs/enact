import React from 'react';
import Item from '@enact/moonstone/Item';
import {VirtualListNative, VirtualListBase} from '@enact/moonstone/VirtualList';
import {Column, Cell} from '@enact/ui/Layout';
import ri from '@enact/ui/resolution';
import {ScrollableBaseNative as UiScrollableBaseNative} from '@enact/ui/Scrollable/ScrollableNative';
import {VirtualListBaseNative as UiVirtualListBaseNative} from '@enact/ui/VirtualList/VirtualListBase';

import {action} from '@storybook/addon-actions';
import {storiesOf} from '@storybook/react';

import {boolean, number, select} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('VirtualListNative', UiVirtualListBaseNative, UiScrollableBaseNative, VirtualListBase);

const
	defaultDataSize = 10,
	prop = {
		scrollbarOption: ['auto', 'hidden', 'visible']
	},
	wrapOption = {
		false: false,
		true: true,
		'&quot;noAnimation&quot;': 'noAnimation'
	};

storiesOf('VirtualListNative', module)
	.add(
		'with extra items',
		() => (
			<Column>
				<Cell
					component={VirtualListNative}
					dataSize={number('dataSize', Config, defaultDataSize)}
					direction="vertical"
					focusableScrollbar={boolean('focusableScrollbar', Config)}
					horizontalScrollbar={select('horizontalScrollbar', prop.scrollbarOption, Config)}
					// eslint-disable-next-line react/jsx-no-bind
					itemRenderer={({index, ...rest}) => {
						const text = 'Item ' + index;
						return (<Item {...rest}>{text}</Item>);
					}}
					itemSize={ri.scale(number('itemSize', Config, 60))}
					noScrollByWheel={boolean('noScrollByWheel', Config)}
					onKeyDown={action('onKeyDown')}
					onScrollStart={action('onScrollStart')}
					onScrollStop={action('onScrollStop')}
					spacing={ri.scale(number('spacing', Config, 20))}
					spotlightDisabled={boolean('spotlightDisabled(for all items)', Config, false)
					}
					verticalScrollbar={select('verticalScrollbar', prop.scrollbarOption, Config)}
					wrap={wrapOption[select('wrap', ['false', 'true', '"noAnimation"'], Config)]}
				/>
				<Cell shrink component={Item}>extra item1</Cell>
				<Cell shrink component={Item}>extra item2</Cell>
				<Cell shrink component={Item}>extra item3</Cell>
			</Column>
		)
	);
