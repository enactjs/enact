import ri from '@enact/ui/resolution';
import Item from '@enact/moonstone/Item';
import {VirtualVariableList} from '@enact/moonstone/VirtualList';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, number} from '@kadira/storybook-addon-knobs';

// Inline style
const
	itemTimelinePadding = ri.scale(50) + 'px ' + ri.scale(10) + 'px ' + ri.scale(10) + 'px',
	itemChannelInfoBGPadding = '0 ' + ri.scale(5) + 'px ' + ri.scale(5) + 'px 0',
	itemChannelInfoPadding = ri.scale(10) + 'px 0 ' + ri.scale(10) + 'px ' + ri.scale(20) + 'px',
	style = {
		list: {
			overflow: 'hidden',
			width: '100%',
			height: ri.scale(576) + 'px'
		},
		itemWrapper: {
			background: 'black',
			position: 'absolute',
			willChange: 'transform'
		},
		// Today
		itemToday: {
			background: 'black',
			width: '100%',
			height: ri.scale(96) + 'px',
			position: 'absolute',
			padding: itemTimelinePadding,
			boxSizing: 'border-box',
			bottom: '0',
			overflow: 'hidden',
			fontSize: ri.scale(27) + 'px',
			color: 'white',
			WebkitUserSelect: 'none',
			userSelect: 'none'
		},
		// Timeline
		itemTimeline: {
			background: 'black',
			width: ri.scale(200) + 'px',
			height: ri.scale(96) + 'px',
			position: 'absolute',
			padding: itemTimelinePadding,
			borderLeft: ri.scale(2) + 'px solid #333',
			boxSizing: 'border-box',
			bottom: '0',
			overflow: 'hidden',
			fontSize: ri.scale(27) + 'px',
			color: 'white',
			WebkitUserSelect: 'none',
			userSelect: 'none'
		},
		// ChannelInfo
		itemChannelInfoBG: {
			background: '#2C2E35',
			backgroundClip: 'content-box',
			padding: itemChannelInfoBGPadding,
			boxSizing: 'border-box',
			overflow: 'hidden',
			height: '100%'
		},
		itemChannelInfo: {
			width: ri.scale(400) + 'px',
			height: '100%',
			padding: itemChannelInfoPadding,
			boxSizing: 'border-box',
			color: '#CACACA',
			fontSize: ri.scale(27) + 'px',
			lineHeight: ri.scale(58) + 'px',
			WebkitUserSelect: 'none',
			userSelect: 'none'
		},
		// Programs
		itemProgramBG: {
			background: '#141416',
			backgroundClip: 'content-box',
			padding: itemChannelInfoBGPadding,
			boxSizing: 'border-box',
			overflow: 'hidden',
			height: '100%'
		},
		itemProgram: {
			height: ri.scale(78) + 'px',
			boxSizing: 'border-box',
			fontSize: ri.scale(33) + 'px',
			lineHeight: ri.scale(78) + 'px',
			WebkitUserSelect: 'none',
			userSelect: 'none'
		}
	};

// CSS
let sheet = document.createElement('style');
sheet.innerHTML = '.list > div:first-child {padding-top: 13px;}';
document.body.appendChild(sheet);

// Raw Data
const
	epgData = [],
	// ChannelInfo
	channelInfo = [
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
	timeline = [
		'06:00 AM', '06:30 AM',
		'07:00 AM', '07:30 AM',
		'08:00 AM', '08:30 AM',
		'09:00 AM', '09:30 AM',
		'10:00 AM', '10:30 AM',
		'11:00 AM', '11:30 AM',
		'12:00 PM', '12:30 PM',
		'01:00 PM', '01:30 PM',
		'02:00 PM', '02:30 PM',
		'03:00 PM', '03:30 PM'
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
		return ri.scale((parseInt(Math.random() * 20) + 1) * 100);
	};

// Data
for (let i = 0; i < 200; i++) { /* 200 channelInfo */
	epgData[i] = [];
	for (let j = 0; j < 40; j++) { /* The maximum number of programs per one channel is 40 */
		// Today
		if (i === 0 && j === 0) {
			epgData[i][j] = {
				width: ri.scale(405),
				programName: 'Today'
			};
		// ChannelInfo
		} else if (j === 0) {
			epgData[i][j] = {
				width: ri.scale(405),
				programName: channelInfo[i % 20]
			};
		// Timeline
		} else if (i === 0) {
			epgData[i][j] = {
				width: ri.scale(200),
				programName: timeline[(j - 1) % 20]
			};
		// Programs
		} else {
			epgData[i][j] = {
				width: getRandomWidth(),
				programName: ('00' + i).slice(-3) + '/' + ('00' + j).slice(-3) + ' - ' + programName[(i + j) % 20]
			};
		}
	}
}

// Story
const
	getVariableDataSize = ({data, fixedIndex}) => {
		return data[fixedIndex].length;
	},
	getVariableItemSize = ({data, index}) => {
		return data[index.fixed][index.variable].width;
	},
	renderItem = ({data, index, key}) => {
		// Today & Timeline
		if (index.fixed == 0) {
			return (
				<div key={key} style={style.itemWrapper}>
					<div style={index.variable === 0 ? style.itemToday : style.itemTimeline}>
						{data[index.fixed][index.variable].programName}
					</div>
				</div>
			);
		// ChannelInfo
		} else if (index.variable === 0) {
			return (
				<div key={key} style={style.itemWrapper}>
					<div style={style.itemChannelInfoBG}>
						<div style={style.itemChannelInfo}>
							{data[index.fixed][index.variable].programName}
						</div>
					</div>
				</div>
			);
		// Programs
		} else  {
			return (
				<div key={key} style={style.itemWrapper}>
					<div style={style.itemProgramBG}>
						<Item style={style.itemProgram}>
							{data[index.fixed][index.variable].programName}
						</Item>
					</div>
				</div>
			);
		}
	};

storiesOf('VirtualList.VirtualVariableList')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of VirtualVariableList',
		() => (
			<VirtualVariableList
				data={epgData}
				dataSize={{
					fixed: number('dataSize.fixed', epgData.length),
					variable: getVariableDataSize
				}}
				itemSize={{
					fixed: ri.scale(number('itemSize.fixed', 83)),
					variable: getVariableItemSize
				}}
				lockHeaders
				variableDimension={'width'}
				variableMaxScrollSize={ri.scale(number('variableMaxScrollSize', 4000))} /* 400 ( width per 1 hour )* 10 hr */
				className={'list'}
				style={style.list}
				component={renderItem}
			/>
		)
	);
