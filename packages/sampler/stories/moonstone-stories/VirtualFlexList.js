import ri from '@enact/ui/resolution';
import VirtualFlexList from '@enact/moonstone/VirtualFlexList';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, number} from '@kadira/storybook-addon-knobs';

const
	channelWidth = ri.scale(420),
	channelLength = 200,
	timeWidth = ri.scale(210),
	timelineLength = 18,
	itemHeight = ri.scale(81),
	clientWidth = timeWidth * 5,
	clientHeight = itemHeight * 6,
	maxVariableScrollSize = timeWidth * 18; // for 9 hr

// Inline style
const
	style = {
		epg: {
			background: 'black',
			position: 'absolute',
			width: (channelWidth + clientWidth) + 'px',
			height: (itemHeight + clientHeight) + 'px',
			padding: ri.scale(33) + 'px 0',
			color: 'white'
		},
		// Programs
		itemProgramWrapper: {
			background: '#141416',
			position: 'absolute',
			padding: 0,
			border: ri.scale(3) + 'px solid black',
			boxSizing: 'border-box',
			overflow: 'hidden'
		},
		itemProgram: {
			height: '100%',
			fontSize: ri.scale(33) + 'px',
			lineHeight: ri.scale(78) + 'px',
			WebkitUserSelect: 'none',
			userSelect: 'none'
		}
	};

// Data
const
	// Programs
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
	getRandomWidth = () => {
		return (parseInt(Math.random() * 10) + 1) * timeWidth;
	},
	programData = (function () {
		const data = [];

		for (let i = 0; i < channelLength; i++) {
			data[i] = [];
			for (let j = 0; j < timelineLength; j++) {
				data[i][j] = {
					programName: ('00' + i).slice(-3) + '/' + ('00' + j).slice(-3) + ' - ' + programName[(i + j) % 20],
					width: getRandomWidth()
				};
			}
		}

		return data;
	})();

// Story
const
	// eslint-disable-next-line enact/prop-types
	getItemLength = ({data, index}) => {
		return data[index.row].length;
	},
	// eslint-disable-next-line enact/prop-types
	getItemWidth = ({data, index}) => {
		return data[index.row][index.col].width;
	},
	// eslint-disable-next-line enact/prop-types
	renderItem = ({data, index, key}) => {
		// Programs
		return (
			<div key={key} style={style.itemProgramWrapper}>
				<div style={style.itemProgram}>
					{data[index.row][index.col].programName}
				</div>
			</div>
		);
	};

storiesOf('VirtualFlexList')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of VirtualFlexList',
		() => (
			<div style={style.epg}>
				<VirtualFlexList
					items={{
						colCount: getItemLength,
						component: renderItem,
						data: programData,
						height: number('items_height', itemHeight),
						rowCount: number('items_row_count', programData.length),
						width: getItemWidth
					}}
					maxVariableScrollSize={number('maxVariableScrollSize', maxVariableScrollSize)}
					variableAxis="row"
					x={number('x', 0)}
					y={number('y', 0)}
				/>
			</div>
		)
	);
