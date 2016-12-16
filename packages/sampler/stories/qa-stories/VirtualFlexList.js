import ri from '@enact/ui/resolution';
import VirtualFlexList from '@enact/moonstone/VirtualFlexList';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, number} from '@kadira/storybook-addon-knobs';

const
	channelWidth = ri.scale(420),
	channelLength = 200,
	timeWidth = ri.scale(210),
	timeHeight = ri.scale(99),
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
		// Today
		itemToday: {
			background: 'black',
			width: channelWidth + 'px',
			padding: ri.scale(57) + 'px  0 ' + ri.scale(6) + 'px',
			fontSize: ri.scale(27) + 'px',
			WebkitUserSelect: 'none',
			userSelect: 'none'
		},
		// Timeline
		itemTimeline: {
			background: 'black',
			position: 'absolute',
			width: timeWidth + 'px',
			height: timeHeight + 'px',
			padding: ri.scale(57) + 'px ' + ri.scale(9) + 'px ' + ri.scale(9) + 'px',
			borderLeft: ri.scale(3) + 'px solid #333',
			boxSizing: 'border-box',
			fontSize: ri.scale(27) + 'px',
			WebkitUserSelect: 'none',
			userSelect: 'none'
		},
		// ChannelInfo
		itemChannelInfoWrapper: {
			background: '#2C2E35',
			position: 'absolute',
			padding: 0,
			border: ri.scale(3) + 'px solid black',
			boxSizing: 'border-box',
			overflow: 'hidden'
		},
		itemChannelInfo: {
			width: (channelWidth - ri.scale(6)) + 'px',
			height: (itemHeight - ri.scale(6)) + 'px',
			color: '#CACACA',
			fontSize: ri.scale(27) + 'px',
			lineHeight: ri.scale(58) + 'px',
			WebkitUserSelect: 'none',
			userSelect: 'none'
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
	// ChannelInfo
	channelInfoData = [
		'A&E',
		'Adult Swim',
		'AMC',
		'Audience',
		'AXS TV',
		'BBC America',
		'BET',
		'Centric',
		'Chiller',
		'Cloo',
		'CMT',
		'Comedy Central',
		'Comedy.tv',
		'Discovery Channel',
		'Es.tv',
		'FIDO',
		'FX',
		'FXX',
		'GSN',
		'History'
	],
	// Timeline
	timelineData = [
		'06:00 AM', '06:30 AM',
		'07:00 AM', '07:30 AM',
		'08:00 AM', '08:30 AM',
		'09:00 AM', '09:30 AM',
		'10:00 AM', '10:30 AM',
		'11:00 AM', '11:30 AM',
		'12:00 PM', '12:30 PM',
		'01:00 PM', '01:30 PM',
		'02:00 PM', '02:30 PM'
	],
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
			for (let j = 0; j < timelineData.length; j++) {
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
	renderRowHeaderItem = ({data, index, key}) => {
		// ChannelInfo
		return (
			<div key={key} style={style.itemChannelInfoWrapper}>
				<div style={style.itemChannelInfo}>
					{data[index % 20]}
				</div>
			</div>
		);
	},
	// eslint-disable-next-line enact/prop-types
	renderColHeaderItem = ({data, index, key}) => {
		// Timeline
		return (
			<div key={key} style={style.itemTimeline}>
				{data[index % 20]}
			</div>
		);
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
					corner={{
						component: (<div style={style.itemToday}>Today</div>)
					}}
					headers={{
						col: {
							component: renderColHeaderItem,
							count:  number('headers_col_count', timelineData.length),
							data: timelineData,
							height: number('headers_col_height', timeHeight),
							width: number('headers_col_width', timeWidth)
						},
						row: {
							component: renderRowHeaderItem,
							count:  number('headers_row_count', channelLength),
							data: channelInfoData,
							height: number('headers_row_height', itemHeight),
							width: number('headers_row_width', channelWidth)
						}
					}}
					items={{
						col: {
							count: getItemLength
						},
						component: renderItem,
						data: programData,
						height: number('items_height', itemHeight),
						row: {
							count: number('items_row_count', programData.length)
						},
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
