/**
 * Provides Moonstone styled grid list image item components and behaviors.
 *
 * @example
 * <GridListImageItem
 *   caption="image0"
 *   source="http://placehold.it/100x100/9037ab/ffffff&text=Image0"
 *   subCaption="sub-image0"
 * />
 *
 * @module moonstone/GridListImageItem
 * @exports GridListImageItem
 * @exports GridListImageItemBase
 * @exports GridListImageItemDecorator
 */

import compose from 'ramda/src/compose';
import {GridListImageItem as UiGridListImageItem} from '@enact/ui/GridListImageItem';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';
import Spottable from '@enact/spotlight/Spottable';

import Icon from '../Icon';
import {ImageBase as Image} from '../Image';
import {Marquee, MarqueeController} from '../Marquee';
import Skinnable from '../Skinnable';

import componentCss from './GridListImageItem.less';

const
	defaultPlaceholder =
	'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC' +
	'9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHN0cm9rZT0iIzU1NSIgZmlsbD0iI2FhYSIg' +
	'ZmlsbC1vcGFjaXR5PSIwLjIiIHN0cm9rZS1vcGFjaXR5PSIwLjgiIHN0cm9rZS13aWR0aD0iNiIgLz48L3N2Zz' +
	'4NCg==',
	captionComponent = (props) => (
		<Marquee alignment="center" marqueeOn="hover" {...props} />
	);

/**
 * A Moonstone styled base component for [GridListImageItem]{@link moonstone/GridListImageItem.GridListImageItem}.
 *
 * @class GridListImageItemBase
 * @extends ui/GridListImageItem.GridListImageItem
 * @memberof moonstone/GridListImageItem
 * @ui
 * @public
 */
const GridListImageItemBase = kind({
	name: 'GridListImageItem',

	propTypes: /** @lends moonstone/GridListImageItem.GridListImageItemBase.prototype */ {
		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `icon` - The icon component class for default selection overlay
		 * * `image` - The image component class
		 * * `selected` - Applied when `selected` prop is `true`
		 * * `caption` - The caption component class
		 * * `subCaption` - The subCaption component class
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * The voice control intent.
		 *
		 * @type {String}
		 * @default 'Select'
		 * @memberof moonstone/GridListImageItem.GridListImageItemBase.prototype
		 * @public
		 */
		'data-webos-voice-intent': PropTypes.string,

		/**
		 * Placeholder image used while [source]{@link ui/GridListImageItem.GridListImageItem#source}
		 * is loaded.
		 *
		 * @type {String}
		 * @default 'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC' +
		 * '9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHN0cm9rZT0iIzU1NSIgZmlsbD0iI2FhYSIg' +
		 * 'ZmlsbC1vcGFjaXR5PSIwLjIiIHN0cm9rZS1vcGFjaXR5PSIwLjgiIHN0cm9rZS13aWR0aD0iNiIgLz48L3N2Zz' +
		 * '4NCg=='
		 * @public
		 */
		placeholder: PropTypes.string,

		/**
		 * Applies a selected visual effect to the image, but only if `selectionOverlayShowing`
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
		 * Usage:
		 * ```
		 * const SelectionOverlay = kind({
		 * 	render: () => <div>custom overlay</div>
		 * });
		 *
		 * <GridListImageItem selectionOverlay={SelectionOverlay} />
		 * ```
		 *
		 * @type {Function}
		 * @public
		 */
		selectionOverlay: PropTypes.func
	},

	defaultProps: {
		'data-webos-voice-intent': 'Select',
		placeholder: defaultPlaceholder,
		selected: false
	},

	styles: {
		css: componentCss,
		publicClassNames: ['gridListImageItem', 'icon', 'image', 'selected', 'caption', 'subCaption']
	},

	render: ({css, selectionOverlay, ...rest}) => {
		if (selectionOverlay) {
			rest['role'] = 'checkbox';
			rest['aria-checked'] = rest.selected;
		}

		return (
			<UiGridListImageItem
				{...rest}
				captionComponent={captionComponent}
				css={css}
				iconComponent={Icon}
				imageComponent={Image}
				selectionOverlay={selectionOverlay}
			/>
		);
	}
});

/**
 * Moonstone-specific GridListImageItem behaviors to apply to
 * [GridListImageItem]{@link moonstone/GridListImageItem.GridListImageItem}.
 *
 * @hoc
 * @memberof moonstone/GridListImageItem
 * @mixes moonstone/Marquee.MarqueeController
 * @mixes spotlight/Spottable.Spottable
 * @mixes moonstone/Skinnable.Skinnable
 * @public
 */
const GridListImageItemDecorator = compose(
	MarqueeController({marqueeOnFocus: true}),
	Spottable,
	Skinnable
);

/**
 * A moonstone-styled grid list image item, Marquee and Spottable applied.
 *
 * Usage:
 * ```
 * <GridListImageItem
 * 	caption="image0"
 * 	source="http://placehold.it/300x300/9037ab/ffffff&text=Image0"
 * 	subCaption="sub-image0"
 * />
 * ```
 *
 * @class GridListImageItem
 * @memberof moonstone/GridListImageItem
 * @extends moonstone/GridListImageItem.GridListImageItemBase
 * @mixes moonstone/GridListImageItem.GridListImageItemDecorator
 * @see moonstone/GridListImageItem.GridListImageItemBase
 * @ui
 * @public
 */
const GridListImageItem = GridListImageItemDecorator(GridListImageItemBase);

export default GridListImageItem;
export {
	GridListImageItem,
	GridListImageItemBase,
	GridListImageItemDecorator
};
