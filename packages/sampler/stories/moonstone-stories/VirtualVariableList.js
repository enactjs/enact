import ri from '@enact/ui/resolution';
import {VirtualVariableList, VirtualVariableListCore} from '@enact/moonstone/VirtualVariableList';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, number} from '@kadira/storybook-addon-knobs';

VirtualVariableList.propTypes = Object.assign({}, VirtualVariableListCore.propTypes);
VirtualVariableList.defaultProps = Object.assign({}, VirtualVariableListCore.defaultProps);

const
	channelLength = 200,
	timeWidth = 200,
	timelineLength = 18,
	itemHeight = 80,
	clientWidth = timeWidth * 5,
	clientHeight = itemHeight * 6,
	maxVariableScrollSize = ri.scale(3600); // 400 ( width per 1 hour ) * 9 hr

// Inline style
const
	style = {
		epg: {
			position: 'absolute',
			width: ri.scale(clientWidth) + 'px',
			height: ri.scale(clientHeight) + 'px',
			padding: ri.scale(32) + 'px 0',
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
		return ri.scale((parseInt(Math.random() * 20) + 1) * 100);
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

storiesOf('VirtualVariableList')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of VirtualVariableList',
		() => (
			<div style={style.epg}>
				<VirtualVariableList
					data={programData}
					dataSize={{
						row: number('dataSize_row', programData.length),
						col: getItemLength
					}}
					itemSize={{
						row: number('itemSize_row', ri.scale(itemHeight)),
						col: getItemWidth
					}}
					maxVariableScrollSize={maxVariableScrollSize}
					posX={number('posX', 0)}
					posY={number('posY', 0)}
					variableAxis="row"
					component={renderItem}
				>
					<div style={style.itemToday}>Today</div>
				</VirtualVariableList>
			</div>
		)
	);
