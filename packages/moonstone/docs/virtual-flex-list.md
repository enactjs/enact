---
title: Using VirtualFlexList
---

This document describes VirtualFlexList.

## VirtualFlexList

### Basic usage of VirtualFlexList

*   At least two props below are required to show a list properly.
    *   `items`: `items` including the following properties.
        *   The number of items
            *   `colCount` is the number of items horizontally.
            *   `rowCount` is the number of items vertically.
        *   The item size
            *   `width` is the item width.
            *   `height` is the item height.
        *   `component` is the render function for an item.
        *   `data` is any data which will be passed to the render function of item (`component` prop).
        *   `background` is a value of `background` CSS property. e.g. background: 'black', background: 'url("assets/img.jpg") cover no-repeat', or etc. The `background` prop is only optional in `items` prop.
    *   `maxFlexScrollSize`: The predefined max scroll size for variable width or height.
*   For VirtualFlexList with variable width,
    *   The type of `colCount` and `width` should be a function returning the count and the size of each item.
    *   The type of `rowCount` and `height` should be a number.

    For VirtualFlexList with variable height,
    *   The type of `rowCount` and `height` should be a function returning the count and the size of each item.
    *   The type of `colCount` and `width` should be a number.
*   Either `width` or `height` of the item can be variable.
*   Example for VirtualFlexList with variable width:
    ```
    const renderItem = ({data, index, key}) => {
    		// Programs
    		return (
    			<Item key={key} style={style.itemProgramWrapper}>
    				<div style={style.itemProgram}>
    					{data[index.row][index.col].programName}
    				</div>
    			</Item>
    		);
    	};

    <VirtualFlexList
    	items={{
    		background: '#141416',
    		colCount: getItemLength, // function
    		component: renderItem,
    		data: programData,
    		height: {54}, // number
    		rowCount: {200}, // number
    		width: getItemWidth // function
    	}}
    	maxFlexScrollSize={2000}
    />
    ```

### Optional props of VirtualFlexList

*   `corner` and `headers` props
    *   `corner` : The component for corner in a list. It has `component` and `background` properties.
        *   `component` is the render function for a corner.
        *   `background` is a value of `background` CSS property. e.g. background: 'black', background: 'url("assets/img.jpg") cover no-repeat', or etc.
    *   `headers` : Row and column headers in a list including the following properties.
        *   `col` for a column header
        *   `row` for a row header
        *   Those properties have the following properties like `items` prop.
            *   The number of items
                *   `count` is the property for the number of items vertically.
            *   The item size
                *   `width` is the item width.
                *   `height` is the item height.
            *   `component` is the render function for an item.
            *   `data` is any data which will be passed to the render function of item (`component` prop).
            *   `background` is a value of `background` CSS property. e.g. background: 'black', background: 'url("assets/img.jpg") cover no-repeat', or etc.
    *   Example:
        ```
        const
        	// eslint-disable-next-line enact/prop-types
        	renderRowHeaderItem = ({data, index, key}) => {
        		// ChannelInfo
        		return (
        			<Item key={key} style={style.itemChannelInfoWrapper}>
        				<div style={style.itemChannelInfo}>
        					{index + ' - ' + data[index % 20]}
        				</div>
        			</Item>
        		);
        	},
        	// eslint-disable-next-line enact/prop-types
        	renderColHeaderItem = ({data, index, key}) => {
        		const child = (!data[index].hour && !data[index].min) ?
        				(<div>{'12/' + ('0' + data[index].day).slice(-2) + ', ' + ('0' + data[index].hour).slice(-2) + ' : ' + ('0' + data[index].min).slice(-2)}</div>) :
        				(<div>{('0' + data[index].hour).slice(-2) + ' : ' + ('0' + data[index].min).slice(-2)}</div>);
        		// Timeline
        		return (
        			<div key={key} style={style.itemTimeline}>
        				{child}
        			</div>
        		);
        	},
        	// eslint-disable-next-line enact/prop-types
        	renderItem = ({data, index, key}) => {
        		// Programs
        		return (
        			<Item key={key} style={style.itemProgramWrapper}>
        				<div style={style.itemProgram}>
        					{data[index.row][index.col].programName}
        				</div>
        			</Item>
        		);
        	};

        <VirtualFlexList
        	corner={{
        		background: 'black',
        		component: (<StatefulPicker width="small" value={this.state.day} wrap onChange={this.onChange}>{days}</StatefulPicker>)
        	}}
        	headers={{
        		col: {
        			background: 'black',
        			component: renderColHeaderItem,
        			count:  timelineData.length,
        			data: timelineData,
        			height: timeHeight,
        			width: timeWidth
        		},
        		row: {
        			background: '#2C2E35',
        			component: renderRowHeaderItem,
        			count:  channelLength,
        			data: channelInfoData,
        			height: itemHeight,
        			width: channelWidth
        		}
        	}}
        	items={{
        		background: '#141416',
        		colCount: getItemLength,
        		component: renderItem,
        		data: programData,
        		height: itemHeight,
        		rowCount: programData.length,
        		width: getItemWidth
        	}}
        	maxFlexScrollSize={maxVariableScrollSize}
        />
        ```

*   `x` and `y` props
    *   You could pass `x` and `y` props as the position of VirtualFlexList to move it.
    *   Example:
        ```
        //app.js
        ...
        	constructor (props) {
        		super(props);
        		this.state = {
        			x: 0,
        			y: 0
        		};
        	}

        	render () {
        		const {x, y} = this.state;
        		return (
        			<VirtualFlexList
        				items={{
        					background: '#141416',
        					colCount: getItemLength,
        					component: renderItem,
        					data: programData,
        					height: itemHeight,
        					rowCount: programData.length,
        					width: getItemWidth
        				}}
        				maxFlexScrollSize={maxVariableScrollSize}
        				x={x}
        				y={y}
        			/>
        		);
        	}
        ```

### Common rules of Items for VirtualFlexList
*   VirtualFlexList provides the same common rules of items.
*   Please check "[Common rules of Items for VirtualList/VirtualGridList](./virtual-list-scroller.md#common-rules-of-items-for-virtuallistvirtualgridlist)" in the guide of [Using VirtualList, VirtualGridList and Scroller](./virtual-list-scroller.md).

## Event Callbacks for VirtualFlexList

*   `onPositionChange` callback function prop
    *   You can specify a callback function for position event.
    *   When moving VirtualFlexList, `onPositionChange` event is fired with the object including `x`, `y` properties which are the position of VirtualFlexList.
    *   Example:

    ```
    constructor (props) {
    	super(props);
    	this.state = {
    		x: 0,
    		y: 0
    	};
    }

    onPositionChange = ({x, y}) => {
    	...
    }

    render () {
    	const {x, y} = this.state;
    	return (
    		<VirtualFlexList
    			items={{
    				background: '#141416',
    				colCount: getItemLength,
    				component: renderItem,
    				data: programData,
    				height: itemHeight,
    				rowCount: programData.length,
    				width: getItemWidth
    			}}
    			maxFlexScrollSize={maxVariableScrollSize}
    			onPositionChange={this.onPositionChange}
    			x={x}
    			y={y}
    		/>
    	);
    }
    ```
