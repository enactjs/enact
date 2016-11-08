import ri from '@enact/ui/resolution';
import Item from '@enact/moonstone/Item';
import {VirtualVariableGridList} from '@enact/moonstone/VirtualList';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs} from '@kadira/storybook-addon-knobs';

const
	style = {
		list: {
			overflow: 'hidden',
			width: '100%',
			height: ri.scale(576) + 'px'
		},
		itemWrapper: {
			background: '#141416',
			backgroundClip: 'content-box',
			position: 'absolute',
			padding: '5px',
			boxSizing: 'border-box',
			overflow: 'hidden',
			willChange: 'transform'
		},
		item: {
			height: '100%',
			fontSize: ri.scale(33) + 'px',
			lineHeight: ri.scale(78) + 'px',
			WebkitUserSelect: 'none',
			userSelect: 'none'
		}
	},
	programs = [],
	programName = [
		'On Demand',
		'To Be Announced',
		'Newsedge',
		'TMZ',
		'Dish Nation',
		'Access Hollywood',
		'The Wendy Williams Show',
		'Harry',
		'Extra',
		'Dish Nation',
		'TMZ',
		'FOX 2 News Morning',
		'Secrets of the Dead',
		'SciTech Now',
		'Under the Radar Michigan',
		'Tavis Smiley',
		'Charlie Rose',
		'Nature',
		'NOVA',
		'Secrets of the Dead'
	],
	variableMaxScrollSize = ri.scale(57600) /* 400 ( width per 1 hour )* 24 hr * 6 day */,
	getRandomWidth = () => {
		return ri.scale((parseInt(Math.random() * 20) + 1) * 100);
	};


for (let i = 0; i < 2000; i++) {
	programs[i] = [];
	for (let j = 0; j < 200; j++) {
		programs[i][j] = {
			width: getRandomWidth(),
			programName: ('00' + i).slice(-3) + '/' + ('00' + j).slice(-3) + ' - ' + programName[(i + j) % 20]
		};
	}
}

const
	getVariableDataSize = ({data, fixedIndex}) => {
		return data[fixedIndex].length;
	},
	getVariableItemSize = ({data, index}) => {
		return data[index.fixed][index.variable].width;
	},
	renderItem = ({data, index, key}) => {
		return (
			<div key={key} style={style.itemWrapper}>
				<Item style={style.item}>
					{data[index.fixed][index.variable].programName}
				</Item>
			</div>
		);
	};

storiesOf('VirtualVariableGridList')
	.addDecorator(withKnobs)
	.addWithInfo(
		'with variable width item',
		'Basic usage of VirtualVariableGridList',
		() => (
			<VirtualVariableGridList
				data={programs}
				dataSize={{
					fixed: programs.length,
					variable: getVariableDataSize
				}}
				itemSize={{
					fixed: ri.scale(83),
					variable: getVariableItemSize
				}}
				variableDimension={'width'}
				variableMaxScrollSize={variableMaxScrollSize}
				style={style.list}
				component={renderItem}
			/>
		)
	).addWithInfo(
		'with variable height item',
		() => (
			<VirtualVariableGridList
				data={programs}
				dataSize={{
					fixed: programs.length,
					variable: getVariableDataSize
				}}
				itemSize={{
					fixed: ri.scale(400),
					variable: getVariableItemSize
				}}
				variableDimension={'height'}
				variableMaxScrollSize={variableMaxScrollSize}
				style={style.list}
				component={renderItem}
			/>
		)
	);
