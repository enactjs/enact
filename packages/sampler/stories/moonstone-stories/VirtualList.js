import Item from '@enact/moonstone/Item';
import {VirtualList as UiVirtualList, VirtualListBase as UiVirtualListBase} from '@enact/ui/VirtualList';
import VirtualList, {VirtualListBase} from '@enact/moonstone/VirtualList';
import ri from '@enact/ui/resolution';
import React, {Component} from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, number} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('VirtualList', VirtualList, VirtualListBase, UiVirtualListBase);

window.items = [];

const
	// eslint-disable-next-line enact/prop-types, enact/display-name
	renderItem = ({data, index, ...rest}) => {
		const itemStyle = {
			height: ri.scale(number('itemSize', 72)) + 'px',
			borderBottom: ri.unit(3, 'rem') + ' solid #202328',
			boxSizing: 'border-box'
		};

		return (
			<Item {...rest} style={itemStyle}>
				{window.items[index]}
			</Item>
		);
	};

for (let i = 0; i < 1000; i++) {
	window.items.push('Item ' + ('00' + i).slice(-3));
}

class App extends Component {
	constructor () {
		super();

		this.cnt = 0;

		setInterval(() => {
			window.items[2] = '' + this.cnt++;
			this.forceUpdate();
		}, 1000);
	}
	render () {
		const itemSize = ri.scale(number('itemSize', 72));

		return (
			<UiVirtualList
				component={renderItem}
				data={window.items}
				dataSize={number('dataSize', window.items.length)}
				itemSize={itemSize}
				onScrollStart={action('onScrollStart')}
				onScrollStop={action('onScrollStop')}
				spacing={ri.scale(number('spacing', 0))}
				style={{
					height: ri.unit(552, 'rem')
				}}
			/>
		);
	}
}
storiesOf('UI', module)
	.add(
		'VirtualList',
		withInfo({
			propTables: [Config],
			text: 'Basic usage of VirtualList'
		})(() => {
			return <App />;
		})
	);

storiesOf('Moonstone', module)
	.add(
		'VirtualList',
		withInfo({
			propTables: [Config],
			text: 'Basic usage of VirtualList'
		})(() => {
			return <App />;
		})
	);
