import ri from '@enact/ui/resolution';
import Item from '@enact/moonstone/Item';
import VirtualFlexList from '@enact/moonstone/VirtualFlexList';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {number} from '@kadira/storybook-addon-knobs';

const
	channelLength = 200,
	timelineLength = 18;

// Data
const
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
	getTimeWidth = () => ri.scale(210),
	getRandomWidth = () => {
		return (parseInt(Math.random() * 10) + 1) * getTimeWidth();
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
		return (
			<Item
				key={key}
				style={{
					position: 'absolute',
					padding: 0,
					border: ri.unit(3, 'rem') + ' solid black',
					boxSizing: 'border-box',
					overflow: 'hidden'
				}}
			>
				{data[index.row][index.col].programName}
			</Item>
		);
	};

storiesOf('VirtualFlexList')
	.addWithInfo(
		' ',
		'Basic usage of VirtualFlexList',
		() => {
			const
				timeWidth = getTimeWidth(),
				channelWidth = ri.scale(420),
				itemHeight = ri.scale(81),
				clientWidth = timeWidth * 5,
				clientHeight = itemHeight * 6,
				maxFlexScrollSize = timeWidth * 18; // for 9 hr

			return (
				<div
					style={{
						background: 'black',
						position: 'absolute',
						width: (channelWidth + clientWidth) + 'px',
						height: (itemHeight + clientHeight) + 'px',
						padding: ri.unit(33, 'rem') + ' 0'
					}}
				>
					<VirtualFlexList
						items={{
							background: '#141416',
							colCount: getItemLength,
							component: renderItem,
							data: programData,
							height: ri.scale(number('items.height', 81)),
							rowCount: number('items.rowCount', programData.length),
							width: getItemWidth
						}}
						maxFlexScrollSize={maxFlexScrollSize}
						onPositionChange={action('onPositionChange')}
						x={ri.scale(number('x', 0))}
						y={ri.scale(number('y', 0))}
					/>
				</div>
			);
		}
	);
