/**
 * Exports the {@link moonstone/VirtualListItemable.VirtualListItemable} Higher-order Component (HOC).
 *
 * @module moonstone/VirtualListItemable
 */

import classNames from 'classnames';
import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import React from 'react';
import {Spottable} from '@enact/spotlight';

import css from './VirtualListItemable.less';

/**
 * {@link moonstone/VirtualListItemable.SpottableDiv} is the Higher-order Component for a VirtualList item wrapper.
 *
 * @class SpottableDiv
 * @memberof moonstone/VirtualListItemable
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
 * Default config for {@link moonstone/VirtualListItemable.VirtualListItemable}
 *
 * @memberof moonstone/VirtualListItemable.VirtualListItemable
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Determines whether an element has the common list item bottom border.
	 *
	 * @type {Boolean}
	 * @default false
	 * @memberof ui/VirtualListItemable.VirtualListItemable.defaultConfig
	 */
	border: false,

	/**
	 * Determines whether an element is spottable.
	 *
	 * @type {Boolean}
	 * @default false
	 * @memberof ui/VirtualListItemable.VirtualListItemable.defaultConfig
	 */
	spottable: false
};

/**
 * {@link moonstone/VirtualListItemable.VirtualListItemable} is the Higher-order Component for a VirtualList item wrapper.
 *
 * @class VirtualListItemable
 * @memberof moonstone/VirtualListItemable
 * @ui
 * @public
 */
const VirtualListItemable = hoc(defaultConfig, ({border, spottable}, Wrapped) => {
	const component = spottable ? SpottableDiv : 'div';

	return kind({
		name: 'VirtualListItem',

		styles: {
			css,
			className: 'VirtualListItemable'
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

export default VirtualListItemable;
export {VirtualListItemable};
