import classNames from 'classnames';
import React from 'react';

import css from './VirtualList.module.less';

const usePositionItems = (props, instances, context) => {
	const {virtualListBase} = instances;
	const {firstIndex, updateFromTo} = virtualListBase;
	const {getGridPosition, getXY, numOfItems} = context;

	// Functions

	function composeStyle (width, height, primaryPosition, secondaryPosition) {
		const
			{x, y} = getXY(primaryPosition, secondaryPosition),
			composedStyle = {
				position: 'absolute',
				/* FIXME: RTL / this calculation only works for Chrome */
				transform: `translate3d(${props.rtl ? -x : x}px, ${y}px, 0)`
			};

		if (virtualListBase.current.isItemSized) {
			composedStyle.width = width;
			composedStyle.height = height;
		}

		return composedStyle;
	}

	function applyStyleToNewNode (index, ...restParams) {
		const
			{itemRenderer, getComponentProps} = props,
			key = index % numOfItems,
			itemElement = itemRenderer({
				...props.childProps,
				key,
				index
			}),
			componentProps = getComponentProps && getComponentProps(index) || {};

		virtualListBase.current.cc[key] = React.cloneElement(itemElement, {
			...componentProps,
			className: classNames(css.listItem, itemElement.props.className),
			style: {...itemElement.props.style, ...(composeStyle(...restParams))}
		});
	}

	function applyStyleToHideNode (index) {
		const key = index % numOfItems;
		virtualListBase.current.cc[key] = <div key={key} style={{display: 'none'}} />;
	}

	function positionItems () {
		const
			{dataSize, itemSizes} = props,
			{cc, isPrimaryDirectionVertical, dimensionToExtent, secondary, itemPositions, primary} = virtualListBase.current;
		let hideTo = 0,
			// TODO : check whether the belows variables(newUpdateFrom, newUpdateTo) are needed or not.
			newUpdateFrom = cc.length ? updateFromTo.from : firstIndex,
			newUpdateTo = cc.length ? updateFromTo.to : firstIndex + numOfItems;

		if (newUpdateFrom >= newUpdateTo) {
			return;
		} else if (newUpdateTo > dataSize) {
			hideTo = newUpdateTo;
			newUpdateTo = dataSize;
		}

		let
			width, height,
			{primaryPosition, secondaryPosition} = getGridPosition(newUpdateFrom);

		width = (isPrimaryDirectionVertical ? secondary.itemSize : primary.itemSize) + 'px';
		height = (isPrimaryDirectionVertical ? primary.itemSize : secondary.itemSize) + 'px';

		// positioning items
		for (let i = newUpdateFrom, j = newUpdateFrom % dimensionToExtent; i < newUpdateTo; i++) {
			applyStyleToNewNode(i, width, height, primaryPosition, secondaryPosition);

			if (++j === dimensionToExtent) {
				secondaryPosition = 0;

				if (props.itemSizes) {
					if (itemPositions[i + 1] || itemPositions[i + 1] === 0) {
						primaryPosition = itemPositions[i + 1].position;
					} else if (itemSizes[i]) {
						primaryPosition += itemSizes[i] + props.spacing;
					} else {
						primaryPosition += primary.gridSize;
					}
				} else {
					primaryPosition += primary.gridSize;
				}

				j = 0;
			} else {
				secondaryPosition += secondary.gridSize;
			}
		}

		for (let i = newUpdateTo; i < hideTo; i++) {
			applyStyleToHideNode(i);
		}
	}

	// Return

	return {
		positionItems
	};
};

export default usePositionItems;
export {
	usePositionItems
};
