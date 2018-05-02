import Item from '@enact/moonstone/Item';
import {VirtualList as UiVirtualList, VirtualListBase as UiVirtualListBase} from '@enact/ui/VirtualList';
import VirtualList, {VirtualListBase} from '@enact/moonstone/VirtualList';
import ri from '@enact/ui/resolution';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, number, select} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('VirtualList', VirtualList, VirtualListBase, UiVirtualListBase);

const
	wrapOption = {
		'false': false,
		'true': true,
		"'noAnimation'": 'noAnimation'
	},
	dataSize = 1000,
	getItem = (index) => ('Item ' + ('00' + index).slice(-3)),
	// eslint-disable-next-line enact/prop-types, enact/display-name
	renderItem = (size) => ({index, ...rest}) => {
		const itemStyle = {
			height: size + 'px',
			borderBottom: ri.unit(3, 'rem') + ' solid #202328',
			boxSizing: 'border-box'
		};

		return (
			<Item {...rest} style={itemStyle}>
				{getItem(index)}
			</Item>
		);
	};

storiesOf('UI', module)
	.add(
		'VirtualList',
		withInfo({
			propTables: [Config],
			text: 'Basic usage of VirtualList'
		})(() => {
			const itemSize = ri.scale(number('itemSize', 72));
			return (
				<UiVirtualList
					dataSize={number('dataSize', dataSize)}
					itemRenderer={renderItem(itemSize)}
					itemSize={itemSize}
					onScrollStart={action('onScrollStart')}
					onScrollStop={action('onScrollStop')}
					spacing={ri.scale(number('spacing', 0))}
					style={{
						height: ri.unit(552, 'rem')
					}}
				/>
			);
		})
	);

storiesOf('Moonstone', module)
	.add(
		'VirtualList',
		withInfo({
			propTables: [Config],
			text: 'Basic usage of VirtualList'
		})(() => {
			const itemSize = ri.scale(number('itemSize', 72));
			return (
				<VirtualList
					dataSize={number('dataSize', dataSize)}
					focusableScrollbar={nullify(boolean('focusableScrollbar', false))}
					itemRenderer={renderItem(itemSize)}
					itemSize={itemSize}
					onScrollStart={action('onScrollStart')}
					onScrollStop={action('onScrollStop')}
					spacing={ri.scale(number('spacing', 0))}
					style={{
						height: ri.unit(552, 'rem')
					}}
					wrap={wrapOption[select('wrap', ['false', 'true', "'noAnimation'"])]}
				/>
			);
		})
	);
