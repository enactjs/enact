/**
 * Exports the {@link moonstone/GridListImageItem.GridListImageItem} and
 * {@link moonstone/GridListImageItem.GridListImageItemBase} components. The default export is
 * {@link moonstone/GridListImageItem.GridListImageItem}.
 *
 * @module moonstone/GridListImageItem
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Spottable from '@enact/spotlight/Spottable';

import Icon from '../Icon';
import {ImageBase as Image} from '../Image';
import {Marquee, MarqueeController} from '../Marquee';
import Skinnable from '../Skinnable';

import css from './GridListImageItem.less';

const defaultPlaceholder =
	'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC' +
	'9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHN0cm9rZT0iIzU1NSIgZmlsbD0iI2FhYSIg' +
	'ZmlsbC1vcGFjaXR5PSIwLjIiIHN0cm9rZS1vcGFjaXR5PSIwLjgiIHN0cm9rZS13aWR0aD0iNiIgLz48L3N2Zz' +
	'4NCg==';

/**
 * {@link moonstone/GridListImageItem.GridListImageItemBase} is a stateless GridListImageItem with
 * Moonstone styling applied.
 *
 * @class GridListImageItemBase
 * @memberof moonstone/GridListImageItem
 * @ui
 * @public
 */
const GridListImageItemBase = kind({
	name: 'GridListImageItem',

	propTypes: /** @lends moonstone/GridListImageItem.GridListImageItemBase.prototype */ {
		/**
		 * The absolute URL path to the image.
		 *
		 * @type {String}
		 * @required
		 * @public
		 */
		source: PropTypes.string.isRequired,

		/**
		 * The primary caption to be displayed with the image.
		 *
		 * @type {String}
		 * @public
		 */
		caption: PropTypes.string,

		/**
		 * Placeholder image used while [source]{@link moonstone/GridListImageItem.GridListImageItemBase#source}
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
		 * The custom selection overlay component to render. A component can be a stateless functional
		 * component, `kind()` or React component. The following is an example with custom selection
		 * overlay kind.
		 *
		 * Example Usage:
		 * ```
		 * const SelectionOverlay = kind({
		 * 	render: () => <div>custom overlay</div>
		 * });
		 *
		 * <GridListImageItemBase selectionOverlay={SelectionOverlay} />
		 * ```
		 *
		 * @type {Function}
		 * @public
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
		),
		selectionOverlay: ({selectionOverlay: SelectionOverlay, selectionOverlayShowing}) => {
			if (selectionOverlayShowing) {
				return (
					<div className={css.overlayContainer}>
						{
							SelectionOverlay ?
								<SelectionOverlay /> :
								<div className={css.overlayComponent}>
									<Icon className={css.icon}>check</Icon>
								</div>
						}
					</div>
				);
			}
		}
	},

	render: ({caption, placeholder, source, subCaption, selectionOverlay, ...rest}) => {
		if (selectionOverlay) {
			rest['role'] = 'checkbox';
			rest['aria-checked'] = rest.selected;
		}

		delete rest.selected;
		delete rest.selectionOverlayShowing;

		return (
			<div {...rest}>
				<Image className={css.image} placeholder={placeholder} src={source}>
					{selectionOverlay}
				</Image>
				{caption ? (<Marquee alignment="center" className={css.caption} marqueeOn="hover">{caption}</Marquee>) : null}
				{subCaption ? (<Marquee alignment="center" className={css.subCaption} marqueeOn="hover">{subCaption}</Marquee>) : null}
			</div>
		);
	}
});

/**
 * {@link moonstone/GridListImageItem.GridListImageItem} is a GridListImageItem with
 * Moonstone styling, Marquee and Spottable applied.
 *
 * Usage:
 * ```
 * <GridListImageItem source="http://placehold.it/300x300/9037ab/ffffff&text=Image0" caption="image0" subCaption="sub-image0" />
 * ```
 *
 * @class GridListImageItem
 * @memberof moonstone/GridListImageItem
 * @mixes moonstone/Marquee.MarqueeController
 * @mixes moonstone/Skinnable.Skinnable
 * @mixes spotlight/Spottable.Spottable
 * @ui
 * @public
 */
const GridListImageItem = MarqueeController(
	{marqueeOnFocus: true},
	Spottable(
		Skinnable(
			GridListImageItemBase,
		)
	)
);

export default GridListImageItem;
export {GridListImageItem, GridListImageItemBase};
