/**
 * Exports the {@link moonstone/ListItemDecorator.ListItemDecorator} Higher-order Component (HOC).
 *
 * @module moonstone/ListItemDecorator
 */

import {dataIndexAttribute} from '../Scroller/Scrollable';
import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import React from 'react';

import css from './ListItemDecorator.less';

/**
 * Default config for {@link moonstone/ListItemDecorator.ListItemDecorator}
 *
 * @memberof moonstone/ListItemDecorator.ListItemDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Determines whether an element has the common list item bottom border.
	 *
	 * @type {Boolean}
	 * @default false
	 * @memberof ui/ListItemDecorator.ListItemDecorator.defaultConfig
	 */
	border: false
};

/**
 * {@link moonstone/ListItemDecorator.ListItemDecorator} is the Higher-order Component for a VirtualList item wrapper.
 *
 * @class ListItemDecorator
 * @memberof moonstone/ListItemDecorator
 * @ui
 * @public
 */
const ListItemDecorator = hoc(defaultConfig, ({border}, Wrapped) => {
	return kind({
		name: 'VirtualListItem',

		styles: {
			css,
			className: 'listItemDecorator'
		},

		computed: {
			className: ({styler}) => styler.append({border})
		},

		render: ({className, [dataIndexAttribute]: dataIndex, style, ...rest}) => {
			return (
				<div className={className} data-index={dataIndex} style={style}>
					<Wrapped {...rest} data-index={dataIndex} />
				</div>
			);
		}
	});
});

export default ListItemDecorator;
export {ListItemDecorator};
