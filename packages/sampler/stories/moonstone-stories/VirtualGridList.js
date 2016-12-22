import ri from '@enact/ui/resolution';
import {VirtualGridList} from '@enact/moonstone/VirtualList';
import {VirtualListCore} from '@enact/moonstone/VirtualList/VirtualListBase';
import GridListImageItem from '@enact/moonstone/VirtualList/GridListImageItem';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, number, select} from '@kadira/storybook-addon-knobs';

VirtualGridList.propTypes = Object.assign({}, VirtualListCore.propTypes);
VirtualGridList.defaultProps = Object.assign({}, VirtualListCore.defaultProps);

const
	// Set up some defaults for info and knobs
	prop = {
		direction: {'horizontal': 'horizontal', 'vertical': 'vertical'}
	},
	style = {
		item: {
			position: 'absolute',
			width: '100%',
			height: '100%',
			padding: '0 0 ' + ri.scale(96) + 'px 0',
			margin: '0',
			border: ri.scale(6) + 'px solid transparent',
			boxSizing: 'border-box',

			color: '#fff'
		},
		list: {
			height: ri.scale(550) + 'px'
		}
	},
	items = [],
	// eslint-disable-next-line enact/prop-types
	renderItem = ({data, index}) => {
		const {text, subText, source} = data[index];

		return (
			<GridListImageItem
				caption={text}
				source={source}
				subCaption={subText}
				style={style.item}
			/>
		);
	};

for (let i = 0; i < 1000; i++) {
	let
		count = ('00' + i).slice(-3),
		text = `Item ${count}`,
		subText = `SubItem ${count}`,
		color = Math.floor((Math.random() * (0x1000000 - 0x101010)) + 0x101010).toString(16),
		source = `http://placehold.it/300x300/${color}/ffffff&text=Image ${i}`;
	items.push({text, subText, source});
}

storiesOf('VirtualList.VirtualGridList')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of VirtualGridList',
		() => (
			<VirtualGridList
				data={items}
				dataSize={number('dataSize', items.length)}
				direction={select('direction', prop.direction, 'vertical')}
				itemSize={{minWidth: ri.scale(number('minWidth', 180)), minHeight: ri.scale(number('minHeight', 270))}}
				spacing={ri.scale(number('spacing', 20))}
				onScrollStart={action('onScrollStart')}
				onScrollStop={action('onScrollStop')}
				style={style.list}
				component={renderItem}
			/>
		)
	);
