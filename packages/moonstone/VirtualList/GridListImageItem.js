/*
 * Exports the {@link moonstone/VirtualList.GridListImageItem} and
 * {@link moonstone/VirtualList.GridListImageItemBase} components. The default export is
 * {@link moonstone/VirtualList.GridListImageItem}.
 *
 * Not a jsdoc module def on purpose. Exported elsewhere.
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Spottable from '@enact/spotlight/Spottable';

import Icon from '../Icon';
import {Image} from '../Image';
import {MarqueeController, MarqueeText} from '../Marquee';

import css from './GridListImageItem.less';

const defaultPlaceholder =
	'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC' +
	'9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHN0cm9rZT0iIzU1NSIgZmlsbD0iI2FhYSIg' +
	'ZmlsbC1vcGFjaXR5PSIwLjIiIHN0cm9rZS1vcGFjaXR5PSIwLjgiIHN0cm9rZS13aWR0aD0iNiIgLz48L3N2Zz' +
	'4NCg==';

/**
 * {@link moonstone/VirtualList.GridListImageItemBase} is a stateless
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
		 * Placeholder image used while [source]{@link moonstone/VirtualList.GridListImageItemBase#source}
		 * is loaded.
		 *
		 * @type {String}
		 * @default 'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC' +
		 * '9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHN0cm9rZT0iIzU1NSIgZmlsbD0iI2FhYSIg' +
		 * 'ZmlsbC1vcGFjaXR5PSIwLjIiIHN0cm9rZS1vcGFjaXR5PSIwLjgiIHN0cm9rZS13aWR0aD0iNiIgLz48L3N2Zz' +
		 * '4NCg==';
		 * @public
		 */
		placeholder: PropTypes.string,

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
		 * The selection overlay component to render.
		 *
		 * @type {Function}
		 */
		selectionOverlay: PropTypes.func,

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
		placeholder: defaultPlaceholder,
		selected: false,
		selectionOverlayShowing: false
	},

	styles: {
		css,
		className: 'gridListImageItem'
	},

	computed: {
		className: ({caption, selected, styler, subCaption}) => styler.append(
			{selected},
			caption ? 'useCaption' : null,
			subCaption ? 'useSubCaption' : null
		)
	},

	render: ({caption, placeholder, source, subCaption, selectionOverlay: SelectionOverlay, selectionOverlayShowing, ...rest}) => {
		if (selectionOverlayShowing) {
			rest['role'] = 'checkbox';
			rest['aria-checked'] = rest.selected;
		}

		delete rest.selected;

		return (
			<div {...rest}>
				<Image className={css.image} placeholder={placeholder} src={source} />
				{
					selectionOverlayShowing ? (
						<div className={css.overlayContainer}>
							{
								<SelectionOverlay /> ||
								<div className={css.overlayComponent}>
									<Icon className={css.icon}>check</Icon>
								</div>
							}
						</div>
					) : null
				}
				{caption ? (<MarqueeText className={css.caption} marqueeOn="hover">{caption}</MarqueeText>) : null}
				{subCaption ? (<MarqueeText className={css.subCaption} marqueeOn="hover">{subCaption}</MarqueeText>) : null}
			</div>
		);
	}
});

/**
 * {@link moonstone/VirtualList.GridListImageItem} is a GridListImageItem with
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
const GridListImageItem = MarqueeController(
	{marqueeOnFocus: true},
	Spottable(
		GridListImageItemBase
	)
);

export default GridListImageItem;
export {GridListImageItem, GridListImageItemBase};
