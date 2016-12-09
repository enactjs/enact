import ri from '@enact/ui/resolution';
import Icon from '@enact/moonstone/Icon';
import {VirtualVariableList} from '@enact/moonstone/VirtualVariableList';
import clamp from 'ramda/src/clamp';
import React, {Component} from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, number} from '@kadira/storybook-addon-knobs';

const
	channelWidth = 405,
	timeWidth = 200,
	itemHeight = 83,
	clientWidth = channelWidth + timeWidth * 5,
	clientHeight = itemHeight * 6,
	channelCnt = 200;

// Inline style
const
	style = {
		epg: {
			background: 'black',
			position: 'absolute',
			width: ri.scale(clientWidth) + 'px',
			height: ri.scale(clientHeight) + 'px',
			padding: ri.scale(32) + 'px 0'
		},
		list: {
			overflow: 'hidden',
			transform: 'translateZ(0)',
			color: 'white'
		},
		itemWrapper: {
			position: 'absolute',
			border: ri.scale(3) + 'px solid black',
			boxSizing: 'border-box',
			overflow: 'hidden',
			willChange: 'transform'
		},
		// Today
		itemToday: {
			background: 'black',
			height: '100%',
			paddingTop: ri.scale(40) + 'px',
			boxSizing: 'border-box',
			fontSize: ri.scale(27) + 'px',
			color: 'white',
			WebkitUserSelect: 'none',
			userSelect: 'none'
		},
		// Timeline
		itemTimeline: {
			background: 'black',
			height: '100%',
			padding: ri.scale(40) + 'px ' + ri.scale(10) + 'px ' + ri.scale(10) + 'px',
			borderLeft: ri.scale(2) + 'px solid #333',
			boxSizing: 'border-box',
			fontSize: ri.scale(27) + 'px',
			color: 'white',
			WebkitUserSelect: 'none',
			userSelect: 'none'
		},
		// ChannelInfo
		itemChannelInfo: {
			width: ri.scale(400) + 'px',
			height: '100%',
			boxSizing: 'border-box',
			color: '#CACACA',
			fontSize: ri.scale(27) + 'px',
			lineHeight: ri.scale(58) + 'px',
			WebkitUserSelect: 'none',
			userSelect: 'none'
		},
		// Programs
		itemProgram: {
			height: '100%',
			fontSize: ri.scale(33) + 'px',
			lineHeight: ri.scale(78) + 'px',
			WebkitUserSelect: 'none',
			userSelect: 'none'
		}
	};

// CSS
let sheet = document.createElement('style');
sheet.innerHTML = '.channelInfo:not(:focus) {background: #2C2E35;}' +
	'.program:not(:focus) {background: #141416;}';
document.body.appendChild(sheet);

// Raw Data
const
	programData = [],
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
	variableMaxScrollSize = ri.scale(4005) /* 405 ( width for ChannelInfo ) + 400 ( width per 1 hour ) * 9 hr */,
	scrollBounds = {maxLeft: variableMaxScrollSize - clientWidth, maxTop: 200 * itemHeight - clientHeight},
	getRandomWidth = () => {
		return ri.scale((parseInt(Math.random() * 20) + 1) * 100);
	};

// Data
for (let i = 0; i < channelCnt; i++) { /* 200 channelInfo */
	programData[i] = [];
	for (let j = 0; j < 19; j++) { /* 1 item for ChannelInfo + 18 items for the maximum number of programs per one channel */
		programData[i][j] = {
			width: getRandomWidth(),
			programName: ('00' + i).slice(-3) + '/' + ('00' + j).slice(-3) + ' - ' + programName[(i + j) % 20]
		};
	}
}

// Story
const
	getVariableDataSize = ({data, index}) => {
		return data[index.row].length;
	},
	getVariableItemSize = ({data, index}) => {
		return data[index.row][index.col].width;
	},
	renderRowHeaderItem = ({data, index, key}) => {
		if (index.row === 0) {
			// Today
			return (
				<div key={key} style={style.itemWrapper}>
					<div style={style.itemToday}>Today</div>
				</div>
			);
		} else {
			// ChannelInfo
			return (
				<div key={key} className={'channelInfo'} style={style.itemWrapper}>
					<div style={style.itemChannelInfo}>
						{data[index.row % 20]}
					</div>
				</div>
			);
		}
	},
	renderColHeaderItem = ({data, index, key}) => {
		// Timeline
		return (
			<div key={key} style={style.itemWrapper}>
				<div style={style.itemTimeline}>
					{data[(index.col - 1) % 20]}
				</div>
			</div>
		);
	},
	renderItem = ({data, index, key}) => {
		return (
			<div key={key} className={'program'} style={style.itemWrapper}>
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
					data={{
						item: programData,
						rowHeader: channelInfo,
						colHeader: timeline
					}}
					dataSize={{
						row: programData.length,
						col: getVariableDataSize,
						rowHeader: () => channelCnt,
						colHeader: () => timeline.length
					}}
					hideScrollbars
					itemSize={{
						row: ri.scale(itemHeight),
						col: getVariableItemSize,
						rowHeader: () => ri.scale(channelWidth),
						colHeader: () => (timeWidth)
					}}
					lockHeaders="both"
					maxVariableScrollSize={variableMaxScrollSize}
					// posX={posX}
					// posY={posY}
					variableAxis="row"
					style={style.list}
					component={{
						item: renderItem,
						rowHeader: renderRowHeaderItem,
						colHeader: renderColHeaderItem
					}}
				/>
				<Icon
					small
					// eslint-disable-next-line react/jsx-no-bind
					// onClick={() => this.scrollTo('up')}
					className={style.itemProgram}
					style={{position: 'absolute', left: '50%', top: '0', transform: 'translate3d(-50%, 0, 0)', WebkitUserSelect: 'none', userSelect: 'none'}}
				>arrowsmallup</Icon>
				<Icon
					small
					// eslint-disable-next-line react/jsx-no-bind
					// onClick={() => this.scrollTo('down')}
					style={{position: 'absolute', left: '50%', bottom: '0', transform: 'translate3d(-50%, 0, 0)', WebkitUserSelect: 'none', userSelect: 'none'}}
				>arrowsmalldown</Icon>
				<Icon
					small
					// eslint-disable-next-line react/jsx-no-bind
					// onClick={() => this.scrollTo('left')}
					style={{position: 'absolute', left: '0', top: '0', transform: 'translateZ(0)', WebkitUserSelect: 'none', userSelect: 'none'}}
				>arrowsmallleft</Icon>
				<Icon
					small
					// eslint-disable-next-line react/jsx-no-bind
					// onClick={() => this.scrollTo('right')}
					style={{position: 'absolute', right: '0', top: '0', transform: 'translateZ(0)', WebkitUserSelect: 'none', userSelect: 'none'}}
				>arrowsmallright</Icon>
			</div>
		)
	);
