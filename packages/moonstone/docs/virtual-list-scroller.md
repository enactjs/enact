---
title: Using VirtualList, VirtualGridList and Scroller
---

This document describes VirtualList, VirtualGridList, and Scroller.

## VirtualList/VirtualGridList

### Basic usage of VirtualList and VirtualGridList

*   At least four props below are required to show a list properly.

    *   `data`: Data for the list.

    *   `dataSize`: Size of the data. A list does not check the size of `data` prop. dataSize prop is the only value to count items in a list.
    *   `itemSize`: Size of an item for the list. This is a required prop, and you will get an error when you build an app in dev mode without it.
    *   `component`: The render function for an item of the list.
    *   Example

        ```
        <VirtualList
        	data={data}
        	dataSize={data.length}
        	itemSize={ri.scale(72)}
        	component={this.renderItem}
        />

        <VirtualGridList
        	data={data}
        	dataSize={data.length}
        	itemSize={{minWidth: ri.scale(90), minHeight: ri.scale(135)}}
        	component={this.renderItem}
        />
        ```

*   If you want to provide spacing or other numeric properties, you have to specify them surrounded by braces, not by quotes.

    ```
    <VirtualList
    	data={data}
    	dataSize={data.length} //<-- numeric property
    	itemSize={ri.scale(72)} //<-- numeric property
    	component={this.renderItem}
        spacing={ri.scale(10)} //<-- numeric property
    />
    ```

### Common rules of Items for VirtualList/VirtualGridList

*   A renderer for an item should be specified in `component` prop in VirtualList.
*   VirtualList passes `data`, `index`, `key` to the `component` function.
*   Be sure you are passing `key={key}` to the item component for reusing DOM.
*   Items should have `position: absolute;` and `display: block` style for showing properly.
*   Make sure you are not using an inline function for `component`.
*   If you are using an item component which has `@enact/spotlight.Spottable` hoc, Spotlight will enable items and you can navigate them with 5-way key.
*   Example:

    ```
    //.less
    .listItem {
        ...
        position: absolute;
        ...
    }

    //.js
    renderItem = ({data, index, key}) => {
    	return (
    		<div key={key} className={css.listItem]>
    			{data[index].name}
    		</div>
    	);
    }
    ...
    render = () => {
        return (
            <VirtualList
    			data={data}
    			dataSize={data.length}
    			itemSize={this.itemSize}
    			component={this.renderItem}
    		/>
        );
    }
    ```

*   If you create a custom item, make sure you are passing props from parents (render function) to the child.

    ```
    //MyListItem.js
    const MyListItem = kind({
    	.....
    	render = ({...rest}) => { //<-- should pass props
    		return (
    			<div {...rest}>
    				...
    			</div>
    		);
    	}
    });

    //app.js
    renderItem = ({data, index, key}) => {
    	return (
    		<MyListItem data={data} index={index} key={key} />
    	);
    }
    ```

### Items for VirtualGridList

*   `GridListImageItem` can be used as items of VirtualGridList. It has Moonstone styling applied and has a placeholder image as a background.

*   `caption` and `subCaption` are supported.

*   For showing Moonstone's selection overlay, set `selectionOverlayShowing` to `true`. (default is `false`)

*   `selected` prop shows item's status of selection.

*   `source` prop should be set to URL path. (e.g. `source="http://XXXX/image.png"` , `source="../assets/image.png"`)
*   Example:

    ```
    renderItem = ({data, index, key}) => {
        const {text, subText, source} = data[index];
        return (
            <GridListImageItem
                caption={text}
                key={key}
                source={source}
                subCaption={subText}
                className={css.item}
            />
        );
    };
    ```

## Scroller

### Basic usage of Scroller

*   Make sure you specify width and height of Scroller.
*   For now, `'auto'`, `'hidden'` values for `horizontal` and `vertical` are only valid in Scroller.
*   Example:

    ```
    //.less
    .scroller {
    	height: 550px;
    	width: 480px;
    }

    //.js
    <Scroller
        horizontal="auto"
        vertical="auto"
        className={css.scroller}
    >
        <div className={css.content}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br />
        </div>
    </Scroller>
    ```

## Using `scrollTo()` method in VirtualList/VirtualGridList and Scroller

*   Prop `cbScrollTo` is a callback function.
    *   `VirtualList`, `VirtualGridList`, and `Scroller` provide `cbScrollTo` prop which can be set to a callback function that will receive the `scrollTo()` method.
    *   The callback function is called just once when a list or a scroller is created to prevent repeated calls when a list or a scroller is updated.
    *   Do not change `cbScrollTo` prop after a list or a scroller is mounted. It does not have any effect.
*   The binding of a callback function
    *   Please make sure the context of a callback function is properly bound. In general, your app component instance would be the right one.
    *   We recommend to use ECMAScript 2015 (a.k.a ECMAScript 6 or ES6) arrow functions to handle binding.
        *   [https://googlechrome.github.io/samples/arrows-es6/](https://googlechrome.github.io/samples/arrows-es6/)
        *   [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
*   Example:

    ```
    class SampleApp extends React.Component {
    	constructor (props) {
    		super(props);

    		this.y = 0;
    	}
    	...
    	getScrollTo = (scrollTo) => { // callback function to get scrollTo method; arrow function (ES6) is recommended to make sure `this` binding.
    		this.scrollTo = scrollTo;
    	}
    	...
    	doSomething = () => {
    		...
    		this.scrollTo({position: {y: this.y + offset}, animate: true}); // call the function of SampleApp, not a list.
    	}
    	...
    	render = () => {
    	    return (
    			<VirtualList
    				cbScrollTo={this.getScrollTo} // pass callback function
    				data={data}
    				dataSize={data.length}
    				itemSize={this.itemSize}
    				component={this.renderItem}
    			/>
    	    );
    	}
    }
    ```

*   Example:

    ```
    this.scrollTo({position: {y: 100}, animate: false}); // scroll y position to 100px without animation
    this.scrollTo({position: {x: 100, y: 200}); // scroll to (100px, 200px) position; animation is enabled if omitted
    this.scrollTo({align: 'bottom'}); // scroll to the bottom
    this.scrollTo({align: 'lefttop'}); // scroll to the left top position; identical to {position: {x: 0, y:0}}
    this.scrollTo({index: 20}); // VirtualList/VirtualGridList only; scroll to the 21th item; index is counting from 0
    this.scrollTo({node: childNode}); // Scroller only; scroll to the child node.
    ```

## Event Callbacks for VirtualList/VirtualGridList and Scroller

*   You can specify callback functions for scroll events.
*   When you scroll on a list or a scroller, `onScrollStart`, `onScroll`, and `onScrollStop` events fire.
*   Each event sends an object with `scrollLeft` and `scrollTop` properties in it.
*   It is recommended not to call `setState()` in `onScroll` event callback.
*   Example:

    ```
    //app.js
    ...
    handlerOnScrollStart = () => {
    	this.setState({message: 'startScroll'});
    }
    handlerOnScroll = (e) => {
    	this.y = e.scrollTop;
    }
    handlerOnScrollStop = (e) => {
    	this.y = e.scrollTop;
    	this.setState({message: 'scrollStopped'});
    }
    ...
    render = () => {
    	return (
    		<VirtualList
    			...
    			onScrollStart={this.handlerOnScrollStart}
    			onScroll={this.handlerOnScroll}
    			onScrollStop={this.handlerOnScrollStop}
    		/>
    	);
    }
    ```
