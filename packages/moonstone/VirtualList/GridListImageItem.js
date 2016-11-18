/*
 * Exports the {@link moonstone/VirtualList/GridListImageItem.GridListImageItem} and
 * {@link moonstone/VirtualList/GridListImageItem.GridListImageItemBase} components. The default export is
 * {@link moonstone/VirtualList/GridListImageItem.GridListImageItem}.
 *
 * Not a jsdoc module def on purpose. Exported elsewhere.
 */

import {Image} from '@enact/moonstone/Image';
import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';
import {Spottable} from '@enact/spotlight';

import Icon from '../Icon';
import {ItemBase} from '../Item';

import css from './GridListImageItem.less';

/**
 * {@link moonstone/VirtualList/GridListImageItem.GridListImageItemBase} is a stateless
 * GridListImageItem with Moonstone styling applied.
 *
 * @class GridListImageItemBase
 * @memberof moonstone/VirtualList
 * @ui
 * @public
 */
const GridListImageItemBase = kind({
	name: 'GridListImageItem',

	propTypes: /** @lends moonstone/VirtualList.GridListImageItemBase.prototype */ {
		/**
		 * The primary caption to be displayed with the image.
		 *
		 * @type {String}
		 * @public
		 */
		caption: PropTypes.string,

		/**
		 * When `true`, applies a selected visual effect to the image, but only if `selectionOverlayShowing`
		 * is also `true`.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		selected: PropTypes.bool,

		/**
		 * When `true`, a selection overlay with a centered icon is shown. When `selected` is true,
		 * a check mark is shown.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		selectionOverlayShowing: PropTypes.bool,

		/**
		 * The absolute URL path to the image.
		 *
		 * @type {String}
		 * @public
		 */
		source: PropTypes.string,

		/**
		 * The second caption line to be displayed with the image.
		 *
		 * @type {String}
		 * @public
		 */
		subCaption: PropTypes.string
	},

	defaultProps: {
		selected: false,
		selectionOverlayShowing: false
	},

	styles: {
		css,
		className: 'gridListImageItem'
	},

	computed: {
		className: ({selected, styler}) => styler.append({selected})
	},

	render: ({caption, source, subCaption, selectionOverlayShowing, ...rest}) => {
		delete rest.selected;

		return (
			<div {...rest}>
				<div className={css.image}>
					<Image src={source} />
					{
						selectionOverlayShowing ? (
							<div className={css.overlayContainer}>
								<div className={css.overlayComponent}>
									<Icon className={css.icon}>check</Icon>
								</div>
							</div>
						) : null
					}
				</div>
				{caption ? (<ItemBase className={css.caption}>{caption}</ItemBase>) : null}
				{subCaption ? (<ItemBase className={css.subCaption}>{subCaption}</ItemBase>) : null}
			</div>
		);
	}
});

/**
 * {@link moonstone/VirtualList/GridListImageItem.GridListImageItem} is a GridListImageItem with
 * Moonstone styling, Spottable applied.
 *
 * Usage:
 * ```
 * <GridListImageItem source="http://placehold.it/300x300/9037ab/ffffff&text=Image0" caption="image0" subCaption="sub-image0" />
 * ```
 *
 * @class GridListImageItem
 * @memberof moonstone/VirtualList
 * @mixes spotlight.Spottable
 * @see moonstone/VirtualList.GridListImageItemBase
 * @ui
 * @public
 */
const GridListImageItem = Spottable(GridListImageItemBase);

export default GridListImageItem;
export {GridListImageItem, GridListImageItemBase};
