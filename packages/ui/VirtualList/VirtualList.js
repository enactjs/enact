/**
 * Unstyled virtual list components and behaviors to be customized by a theme or application.
 *
 * @module ui/VirtualList
 * @exports gridListImageSizeShape
 * @exports VirtualGridList
 * @exports VirtualList
 * @exports VirtualListBase
 */

import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import Scrollable from '../Scrollable';
import {gridListItemSizeShape, itemSizesShape, VirtualListBase} from './VirtualListBase';

/**
 * An unstyled scrollable virtual list component with touch support.
 *
 * @class VirtualList
 * @memberof ui/VirtualList
 * @extends ui/VirtualList.VirtualListBase
 * @ui
 * @public
 */
const VirtualList = kind({
	name: 'ui:VirtualList',

	propTypes: /** @lends ui/VirtualList.VirtualList.prototype */ {
		/**
		 * Size of an item for the `VirtualList`.
		 *
		 * Valid value is a number. If the direction for the list is vertical,
		 * `itemSize` means the height of an item. For horizontal, it means the width of an item.
		 *
		 * Example:
		 * ```
		 * <VirtualList itemSize={ri.scale(72)} />
		 * ```
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		itemSize: PropTypes.number.isRequired,

		direction: PropTypes.oneOf(['horizontal', 'vertical']),
		role: PropTypes.string
	},

	defaultProps: {
		direction: 'vertical',
		role: 'list'
	},

	render: ({role, ...rest}) => {
		return (
			<Scrollable
				{...rest}
				childRenderer={(props) => ( // eslint-disable-line react/jsx-no-bind
					<VirtualListBase
						{...props}
						itemsRenderer={({cc, itemContainerRef}) => ( // eslint-disable-line react/jsx-no-bind
							cc.length ? <div ref={itemContainerRef} role={role}>{cc}</div> : null
						)}
					/>
				)}
			/>
		);
	}
});

/**
 * An unstyled scrollable virtual grid list component with touch support.
 *
 * @class VirtualGridList
 * @memberof ui/VirtualList
 * @extends ui/VirtualList.VirtualListBase
 * @ui
 * @public
 */
const VirtualGridList = kind({
	name: 'ui:VirtualGridList',

	propTypes: /** @lends ui/VirtualList.VirtualGridList.prototype */ {
		/**
		 * Size of an item for the `VirtualGridList`.
		 *
		 * * Valid value is an object that has `minWidth` and `minHeight` as properties.
		 *
		 * Example:
		 * ```
		 * <VirtualGridList
		 * 	itemSize={{
		 * 		minWidth: ri.scale(180),
		 * 		minHeight: ri.scale(270)
		 * 	}}
		 * />
		 * ```
		 *
		 * @type {ui/VirtualList.gridListItemSizeShape}
		 * @required
		 * @public
		 */
		itemSize: gridListItemSizeShape.isRequired,

		direction: PropTypes.oneOf(['horizontal', 'vertical']),
		role: PropTypes.string
	},

	defaultProps: {
		direction: 'vertical',
		role: 'list'
	},

	render: ({role, ...rest}) => {
		return (
			<Scrollable
				{...rest}
				childRenderer={(props) => ( // eslint-disable-line react/jsx-no-bind
					<VirtualListBase
						{...props}
						itemsRenderer={({cc, itemContainerRef}) => ( // eslint-disable-line react/jsx-no-bind
							cc.length ? <div ref={itemContainerRef} role={role}>{cc}</div> : null
						)}
					/>
				)}
			/>
		);
	}
});

export default VirtualList;
export {
	gridListItemSizeShape,
	itemSizesShape,
	VirtualGridList,
	VirtualList,
	VirtualListBase
};
