/**
 * Exports the {@link moonstone/ListItemDecorator.ListItemDecorator} Higher-order Component (HOC).
 *
 * @module moonstone/ListItemDecorator
 */

import classNames from 'classnames';
import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import React from 'react';
import {Spottable} from '@enact/spotlight';

import css from './ListItemDecorator.less';

/**
 * {@link moonstone/ListItemDecorator.SpottableDiv} is the Higher-order Component for a VirtualList item wrapper.
 *
 * @class SpottableDiv
 * @memberof moonstone/ListItemDecorator
 * @ui
 * @private
 */
const SpottableDiv = Spottable(kind({
	name: 'SpottableDiv',

	render: ({...props}) => {
		return (<div {...props} />);
	}
}));

const dataIndexProp = 'data-index';

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
	border: false,

	/**
	 * Determines whether an element is spottable.
	 *
	 * @type {Boolean}
	 * @default false
	 * @memberof ui/ListItemDecorator.ListItemDecorator.defaultConfig
	 */
	spottable: false
};

/**
 * {@link moonstone/ListItemDecorator.ListItemDecorator} is the Higher-order Component for a VirtualList item wrapper.
 *
 * @class ListItemDecorator
 * @memberof moonstone/ListItemDecorator
 * @ui
 * @public
 */
const ListItemDecorator = hoc(defaultConfig, ({border, spottable}, Wrapped) => {
	const component = spottable ? SpottableDiv : 'div';

	return kind({
		name: 'VirtualListItem',

		styles: {
			css,
			className: 'listItemDecorator'
		},

		computed: {
			props: ({className, [dataIndexProp]: dataIndex, style, ...rest}) => ({
				itemWrapperProps: {
					className: classNames(className, border ? css.border : null),
					[dataIndexProp]: dataIndex,
					style
				},
				itemProps: {...rest, [dataIndexProp]: dataIndex}
			})
		},

		render: ({props}) => {
			return (
				<component {...props.itemWrapperProps} >
					<Wrapped {...props.itemProps} />
				</component>
			);
		}
	});
});

export default ListItemDecorator;
export {ListItemDecorator};
