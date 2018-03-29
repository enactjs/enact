import {VirtualGridList as UiVirtualGridList, VirtualListBase as UiVirtualListBase} from '@enact/ui/VirtualList';
import {VirtualGridList, VirtualListBase} from '@enact/moonstone/VirtualList';
import {GridListImageItem as UiGridListImageItem} from '@enact/ui/GridListImageItem';
import {GridListImageItem} from '@enact/moonstone/GridListImageItem';
import ri from '@enact/ui/resolution';
import React, {Component} from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, number, select} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('VirtualGridList', VirtualGridList, VirtualListBase, UiVirtualListBase);

const
	prop = {
		direction: {'horizontal': 'horizontal', 'vertical': 'vertical'}
	},
	items = [],
	// eslint-disable-next-line enact/prop-types
	uiRenderItem = ({data, index, ...rest}) => {
		const {text, subText, source} = data[index];

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
	renderItem = ({data, index, ...rest}) => {
		const {text, subText, source} = data[index];

		// console.log('The item index rendered', index);

		return (
			<GridListImageItem
				{...rest}
				caption={text}
				source={source}
				subCaption={subText}
			/>
		);
	};

for (let i = 0; i < 1000; i++) {
	const
		count = ('00' + i).slice(-3),
		text = `Item ${count}`,
		subText = `SubItem ${count}`,
		color = Math.floor((Math.random() * (0x1000000 - 0x101010)) + 0x101010).toString(16),
		source = `http://placehold.it/300x300/${color}/ffffff&text=Image ${i}`;

	items.push({text, subText, source});
}

storiesOf('UI', module)
	.add(
		'VirtualList.VirtualGridList',
		withInfo({
			propTables: [Config],
			text: 'Basic usage of VirtualGridList'
		})(() => (
			<UiVirtualGridList
				data={items}
				dataSize={number('dataSize', items.length)}
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

class ControlledVirtualGridList extends Component {
	constructor () {
		super();

		this.state = {
			scrollTop: 0
		};
	}

	componentWillReceiveProps (nextProps) {
		console.log('componentWillReceiveProps controlled', nextProps.controlled);

		if (nextProps.controlled === true) {
			this.interval = setInterval(() => {
				this.state.scrollTop = this.state.scrollTop + 100;
				this.forceUpdate();
			}, 1000);
		} else {
			clearInterval(this.interval);
		}
	}

	interval = null

	render () {
		const {controlled} = this.props;

		return (
			<VirtualGridList
				data={items}
				dataSize={number('dataSize', items.length)}
				direction={select('direction', prop.direction, 'vertical')}
				focusableScrollbar={nullify(boolean('focusableScrollbar', false))}
				itemRenderer={renderItem}
				itemSize={{
					minWidth: ri.scale(number('minWidth', 180)),
					minHeight: ri.scale(number('minHeight', 270))
				}}

				onKeyDown={() => console.log('onKeyDown')} // eslint-disable-line react/jsx-no-bind
				onFocus={() => console.log('onFocus')} // eslint-disable-line react/jsx-no-bind
				onFlick={() => console.log('onFlick')} // eslint-disable-line react/jsx-no-bind
				onDragStart={() => console.log('onDragStart')} // eslint-disable-line react/jsx-no-bind
				onDrag={() => console.log('onDrag')} // eslint-disable-line react/jsx-no-bind
				onDragEnd={() => console.log('onDragEnd')} // eslint-disable-line react/jsx-no-bind
				onMouseDown={() => console.log('onMouseDown')} // eslint-disable-line react/jsx-no-bind
				onMouseMove={() => console.log('onMouseMove')} // eslint-disable-line react/jsx-no-bind
				onMouseUp={() => console.log('onMouseUp')} // eslint-disable-line react/jsx-no-bind
				onWheel={() => console.log('onWheel')} // eslint-disable-line react/jsx-no-bind

				onScrollbarButtonClick={() => console.log('onScrollbarButtonClick')} // eslint-disable-line react/jsx-no-bind

				onScrollStart={action('onScrollStart')}
				onScrollStop={action('onScrollStop')}
				spacing={ri.scale(number('spacing', 20))}
				scrollTop={controlled ? this.state.scrollTop : null}
				style={{
					height: ri.unit(549, 'rem')
				}}
			/>
		);
	}
}

storiesOf('Moonstone', module)
	.add(
		'VirtualList.VirtualGridList',
		withInfo({
			propTables: [Config],
			text: 'Basic usage of VirtualGridList'
		})(() => (
			<ControlledVirtualGridList
				controlled={nullify(boolean('controlled', false))}
			/>
		))
	);
