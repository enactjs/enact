import ri from '@enact/ui/resolution';
import Item from '@enact/moonstone/Item';
import {VirtualEPGGridList} from '@enact/moonstone/VirtualList';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, number} from '@kadira/storybook-addon-knobs';

const
	style = {
		list: {
			overflow: "hidden",
			width: "100%",
			height: "576px"
		},
		item: {
			position: "absolute",
			padding: "0 5px 5px 0","boxSizing": "border-box",
			overflow: "hidden",
			willChange: "transform"
		},
		item___div: {
			background: "#141416",
			height: "100%",
			fontSize: "33px",
			lineHeight: "78px",
			color: "white",
			textAlign: "left",
			whiteSpace: "nowrap",
			WebkitUserSelect: "none",
			userSelect: "none"
		}
	},
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
	variableScrollBoundsSize = 57600 /* 400 ( width per 1 hour )* 24 hr * 6 day */,
	getRandomWidth = () => {
		return parseInt(Math.random() * 20) * 100 + 100;
	};

let data = [];

for (let i = 0; i < 2000; i++) {
	data[i] = [];
	for(let j = 0; j < 200; j++) {
		data[i][j] = {
			width: getRandomWidth(),
			programName: ('00' + i).slice(-3) + '/' + ('00' + j).slice(-3) + ' - ' + programName[(i + j) % 20]
		};
	}
}

const
	getVariableDataSize = ({data, fixedIndex}) => {
		return data[fixedIndex].length;
	},
	getVariableItemSize = ({data, fixedIndex, variableIndex}) => {
		return data[fixedIndex][variableIndex].width;
	},
	renderItem = ({data, fixedIndex, variableIndex, key}) => {
		return (
			<div
				key={key}
				style={style.item}
			>
				<div style={style.item___div}>
					{data[fixedIndex][variableIndex].programName}
				</div>
			</div>
		);
	};

storiesOf('VirtualEPGGridList')
	.addDecorator(withKnobs)
	.addWithInfo(
		'with horizontal variable width items',
		'Basic usage of VirtualEPGList',
		() => (
			<VirtualEPGGridList
				data={data}
				fixedDataSize={data.length}
				fixedItemSize={83}
				getVariableDataSize={getVariableDataSize}
				getVariableItemSize={getVariableItemSize}
				variableScrollBoundsSize={variableScrollBoundsSize}
				style={style.list}
				component={renderItem}
			/>
		)
	);
