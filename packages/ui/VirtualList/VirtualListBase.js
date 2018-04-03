import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Scrollable from '../Scrollable';
import ScrollableNative from '../Scrollable/ScrollableNative';

import ScrollableChildProvider from './ScrollableChildProvider';

import css from './VirtualList.less';

const
	nop = () => {},
	JS = 'JS',
	Native = 'Native';

/**
 * The shape for the grid list item size
 * in a list for [VirtualGridList]{@link ui/VirtualList.VirtualGridList}.
 *
 * @typedef {Object} gridListItemSizeShape
 * @memberof ui/VirtualList
 * @property {Number} minWidth - The minimum width of the grid list item.
 * @property {Number} minHeight - The minimum height of the grid list item.
 * @public
 */
const gridListItemSizeShape = PropTypes.shape({
	minWidth: PropTypes.number.isRequired,
	minHeight: PropTypes.number.isRequired
});

const VirtualListBaseFactory = (type) => {
	return class VirtualRepeater extends Component {
		constructor (props) {
			super(props);

			this.state = {firstIndex: 0, numOfItems: 0};

			this.props.setProvider(this);
		}

		prevFirstIndex = 0
		cc = []

		contentRef = null
		containerRef = null

		getItemNode = (index) => {
			const ref = this.itemContainerRef;

			return ref ? ref.children[index % this.state.numOfItems] : null;
		}

		composeStyle (width, height, primaryPosition, secondaryPosition) {
			const
				{x, y} = this.props.isPrimaryDirectionVertical ? {x: secondaryPosition, y: primaryPosition} : {x: primaryPosition, y: secondaryPosition},
				style = {
					position: 'absolute',
					/* FIXME: RTL / this calculation only works for Chrome */
					transform: `translate3d(${this.props.rtl ? -x : x}px, ${y}px, 0)`
				};

			if (this.props.isItemSized) {
				style.width = width;
				style.height = height;
			}

			return style;
		}

		applyStyleToNewNode = (index, ...rest) => {
			const
				{itemRenderer, getComponentProps, data} = this.props,
				key = index % this.state.numOfItems,
				itemElement = itemRenderer({
					data,
					index,
					key
				}),
				componentProps = getComponentProps && getComponentProps(index) || {};

			this.cc[key] = React.cloneElement(itemElement, {
				...componentProps,
				className: classNames(css.listItem, itemElement.props.className),
				['data-preventscrollonfocus']: true, // Added this attribute to prevent scroll on focus by browser
				style: {...itemElement.props.style, ...(this.composeStyle(...rest))}
			});
		}

		applyStyleToHideNode = (index) => {
			const key = index % this.state.numOfItems;
			this.cc[key] = <div key={key} style={{display: 'none'}} />;
		}

		positionItems () {
			const
				{dataSize, isPrimaryDirectionVertical} = this.props,
				{firstIndex, numOfItems} = this.state,
				{dimensionToExtent, primary, secondary} = this.props,
				{cc} = this,
				diff = firstIndex - this.prevFirstIndex,
				updateFrom = (cc.length === 0 || 0 >= diff || diff >= numOfItems) ? firstIndex : this.prevFirstIndex + numOfItems;
			let
				hideTo = 0,
				updateTo = (cc.length === 0 || -numOfItems >= diff || diff > 0) ? firstIndex + numOfItems : this.prevFirstIndex;

			if (updateFrom >= updateTo) {
				return;
			} else if (updateTo > dataSize) {
				hideTo = updateTo;
				updateTo = dataSize;
			}

			let
				{primaryPosition, secondaryPosition} = this.props.getGridPosition(updateFrom),
				width, height;

			width = (isPrimaryDirectionVertical ? secondary.itemSize : primary.itemSize) + 'px';
			height = (isPrimaryDirectionVertical ? primary.itemSize : secondary.itemSize) + 'px';

			// positioning items
			for (let i = updateFrom, j = updateFrom % dimensionToExtent; i < updateTo; i++) {
				this.applyStyleToNewNode(i, width, height, primaryPosition, secondaryPosition);

				if (++j === dimensionToExtent) {
					secondaryPosition = 0;
					primaryPosition += primary.gridSize;
					j = 0;
				} else {
					secondaryPosition += secondary.gridSize;
				}
			}

			for (let i = updateTo; i < hideTo; i++) {
				this.applyStyleToHideNode(i);
			}

			this.prevFirstIndex = firstIndex;
		}

		// render

		initContainerRef = (ref) => {
			if (ref) {
				this.containerRef = ref;
			}
		}

		initContentRef = (ref) => {
			if (ref) {
				this.contentRef = ref;
			}
		}

		initUiItemContainerRef = (ref) => {
			if (ref) {
				this.itemContainerRef = ref;
			}
		}

		mergeClasses = (className) => {
			let containerClass = null;

			if (type === Native) {
				containerClass = (this.props.isPrimaryDirectionVertical) ? css.vertical : css.horizontal;
			}

			return classNames(css.virtualList, containerClass, className);
		}

		render () {
			const
				{className, itemsRenderer, primary, style, ...rest} = this.props,
				{cc, initUiItemContainerRef} = this,
				containerClasses = this.mergeClasses(className);

			delete rest.cbScrollTo;
			delete rest.clientSize;
			delete rest.data;
			delete rest.dataSize;
			delete rest.direction;
			delete rest.getComponentProps;
			delete rest.itemRenderer;
			delete rest.itemSize;
			delete rest.overhang;
			delete rest.pageScroll;
			delete rest.rtl;
			delete rest.spacing;
			delete rest.updateStatesAndBounds;

			delete rest.dimensionToExtent;
			delete rest.getGridPosition;
			delete rest.isItemSized;
			delete rest.isPrimaryDirectionVertical;
			delete rest.primary;
			delete rest.ref;
			delete rest.secondary;
			delete rest.setProvider;

			if (primary) {
				this.positionItems();
			}

			return (
				<div className={containerClasses} ref={this.initContainerRef} style={style}>
					<div {...rest} ref={this.initContentRef}>
						{itemsRenderer({cc, initUiItemContainerRef, primary})}
					</div>
				</div>
			);
		}
	};
};

/**
 * A basic base component for
 * [VirtualList]{@link ui/VirtualList.VirtualList} and [VirtualGridList]{@link ui/VirtualList.VirtualGridList}.
 *
 * @class VirtualListBase
 * @memberof ui/VirtualList
 * @ui
 * @private
 */
const VirtualListBase = VirtualListBaseFactory(JS);
VirtualListBase.displayName = 'ui:VirtualListBase';

/**
 * A basic base component for
 * [VirtualListNative]{@link ui/VirtualList.VirtualListNative} and [VirtualGridListNative]{@link ui/VirtualList.VirtualGridListNative}.
 *
 * @class VirtualListBaseNative
 * @memberof ui/VirtualList
 * @ui
 * @private
 */
const VirtualListBaseNative = VirtualListBaseFactory(Native);
VirtualListBaseNative.displayName = 'ui:VirtualListBaseNative';

const ScrollableVirtualList = (props) => (
	<ScrollableChildProvider
		{...props}
		render={({scrollableChildAdapter, ...vlbProps}) => ( // eslint-disable-line react/jsx-no-bind
			<Scrollable
				{...props}
				scrollableChildAdapter={scrollableChildAdapter}
				childRenderer={({initUiChildRef, ...virtualListProps}) => ( // eslint-disable-line react/jsx-no-bind
					<VirtualListBase
						{...virtualListProps}
						{...vlbProps}
						itemsRenderer={({cc, initUiItemContainerRef}) => ( // eslint-disable-line react/jsx-no-bind
							cc.length ? <div ref={initUiItemContainerRef}>{cc}</div> : null
						)}
						ref={initUiChildRef}
					/>
				)}
			/>
		)}
	/>
);

const ScrollableVirtualListNative = (props) => (
	<ScrollableChildProvider
		{...props}
		render={({scrollableChildAdapter, ...vlbProps}) => ( // eslint-disable-line react/jsx-no-bind
			<ScrollableNative
				{...props}
				scrollableChildAdapter={scrollableChildAdapter}
				childRenderer={(virtualListProps) => ( // eslint-disable-line react/jsx-no-bind
					<VirtualListBaseNative
						{...virtualListProps}
						{...vlbProps}
						itemsRenderer={({cc, initUiItemContainerRef}) => ( // eslint-disable-line react/jsx-no-bind
							cc.length ? <div ref={initUiItemContainerRef}>{cc}</div> : null
						)}
					/>
				)}
			/>
		)}
	/>
);

export default VirtualListBase;
export {
	gridListItemSizeShape,
	ScrollableVirtualList,
	ScrollableVirtualListNative,
	VirtualListBase,
	VirtualListBaseNative
};
