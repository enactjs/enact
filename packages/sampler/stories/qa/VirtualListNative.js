import React from 'react';
import Item from '@enact/moonstone/Item';
import {VirtualListNative} from '@enact/moonstone/VirtualList';
import {Column, Cell} from '@enact/ui/Layout';

import {storiesOf} from '@storybook/react';

storiesOf('VirtualListNative', module)
	.add(
		'with extra items',
		() => (
			<Column>
				<Cell
					component={VirtualListNative}
					focusableScrollbar
					// eslint-disable-next-line react/jsx-no-bind
					itemRenderer={({index, ...rest}) => {
						const text = `Item ${('00' + index).slice(-3)}`;
						return (<Item {...rest}>{text}</Item>);
					}}
					dataSize={10}
					direction="vertical"
					horizontalScrollbar="hidden"
					verticalScrollbar="visible"
					itemSize={60}
					spacing={20}
				/>
				<Cell shrink component={Item}>extra item1</Cell>
				<Cell shrink component={Item}>extra item2</Cell>
				<Cell shrink component={Item}>extra item3</Cell>
			</Column>
		)
	);
