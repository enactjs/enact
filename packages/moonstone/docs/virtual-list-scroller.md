---
title: Using VirtualList, VirtualGridList and Scroller
---

This document describes VirtualList, VirtualGridList, and Scroller.

## VirtualList/VirtualGridList

### Basic usage of VirtualList and VirtualGridList

*   At least three props below are required to show a list properly.

    *   `dataSize`: Size of the data.
    *   `itemSize`: Size of an item for the list. This is a required prop, and you will get an error when you build an app in dev mode without it.
    *   `itemRenderer`: The render function for an item of the list.
    *   Example

        ```
        <VirtualList
            dataSize={this.items.length}
            itemRenderer={this.renderItem}
            itemSize={ri.scale(72)}
        />

        <VirtualGridList
            dataSize={this.items.length}
            itemRenderer={this.renderItem}
            itemSize={{minWidth: ri.scale(90), minHeight: ri.scale(135)}}
        />
        ```

*   If you want to provide spacing or other numeric properties, you have to specify them surrounded by braces, not by quotes.

    ```
    <VirtualList
        dataSize={this.items.length} //<-- numeric property
        itemRenderer={this.renderItem}
        itemSize={ri.scale(72)} //<-- numeric property
        spacing={ri.scale(10)} //<-- numeric property
    />
    ```

### Common rules of Items for VirtualList/VirtualGridList

*   A renderer for an item should be specified in `itemRenderer` prop in VirtualList.
*   VirtualList passes `index`, `data-index`, and `key` to the `itemRenderer` function.
*   Be sure you are passing `{...rest}` to the item component for reusing DOM.
*   VirtualList will automatically give proper className for items.
*   Be sure to compose `className` prop when you make customized item component.
*   Make sure you are not using an inline function for `itemRenderer`.
*   If you want to scroll the list via 5-way navigation on the certain component in an item, you should pass `data-index` prop.
*   Example:

    ```
    //.js
    items = []
    ...
    renderItem = ({index, ...rest}) => {
        return (
            <div {...rest}>
                {this.items[index].name}
            </div>
        );
    }
    ...
    render = () => {
        return (
            <VirtualList
                dataSize={this.items.length}
                itemRenderer={this.renderItem}
                itemSize={this.itemSize}
            />
        );
    }
    ```

*   If you create a custom item, make sure you are passing props from parents (render function) to the child.

    ```
    //MyListItem.js
    const MyListItem = kind({
        .....
        render = (props) => { //<-- should pass props
            return (
                <div {...props}>
                    ...
                </div>
            );
        }
    });

    //app.js
    renderItem = ({index, ...rest}) => {
        return (
            <MyListItem index={index} {...rest} />
        );
    }
    ```

### Items for VirtualGridList

*   `GridListImageItem` components can be used as items of `VirtualGridList`. They have Moonstone styling applied and have a placeholder image as a background.

*   `caption` and `subCaption` are supported.

*   For showing Moonstone's selection overlay, set `selectionOverlayShowing` to `true`. (default is `false`)

*   `selected` prop shows item's status of selection.

*   `source` prop should be set to URL path. (e.g. `source="http://XXXX/image.png"` , `source="../assets/image.png"`)
*   Example:

    ```
    renderItem = ({index, ...rest}) => {
        const {text, subText, source} = this.items[index];
        return (
            <GridListImageItem
                {...rest}
                caption={text}
                className={css.item}
                source={source}
                subCaption={subText}
            />
        );
    };
    ```

## Scroller

### Basic usage of Scroller

*   Make sure you specify width and height of Scroller.
*   You can specify the scrollable direction with `direction` props. Valid values are `both`, `horizontal`, and `vertical`.
*   Example:

    ```
    //.less
    .scroller {
        height: 550px;
        width: 480px;
    }

    //.js
    <Scroller
        className={css.scroller}
        direction="both"
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
                    dataSize={this.items.length}
                    itemRenderer={this.renderItem}
                    itemSize={this.itemSize}
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
    this.scrollTo({index: 20}); // VirtualList/VirtualGridList only; scroll to the 21st item; index is counting from 0
    this.scrollTo({index: 20, focus: true}); // VirtualList/VirtualGridList only; scroll to the 21st item and focus on the item
    this.scrollTo({node: childNode}); // Scroller only; scroll to the child node.
    this.scrollTo({node: childNode, focus: true}); // Scroller only; scroll to the child node and focus on the node.
    ```

## Event Callbacks for VirtualList/VirtualGridList and Scroller

*   You can specify callback functions for scroll events.
*   When you scroll on a list or a scroller, `onScrollStart`, `onScroll`, and `onScrollStop` events fire.
*   Each event sends an object with `scrollLeft`, `scrollTop`, and `moreInfo` properties in it.
*   For VirtualList/VirtualGridList, `moreInfo` has `firstVisibleIndex` and `lastVisibleIndex`.
*   It is recommended not to call `setState()` in `onScroll` event callback.
*   Example:

    ```
    //app.js
    ...
    handlerOnScrollStart = () => {
        this.setState({message: 'startScroll'});
    }
    handlerOnScroll = ({scrollTop}) => {
        this.y = scrollTop;
    }
    handlerOnScrollStop = ({scrollTop}) => {
        this.y = scrollTop;
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
