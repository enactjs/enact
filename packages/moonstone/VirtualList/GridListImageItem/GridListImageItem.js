/**
 * Provides Moostone-themed grid list image item components and behaviors.
 *
 * @module moonstone/VirtualList
 * @exports GridListIamgeItem
 */

import compose from 'ramda/src/compose';
import {GridListImageItem as UiGridListImageItem} from '@enact/ui/VirtualList';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Spottable from '@enact/spotlight/Spottable';

import Icon from '../../Icon';
import Image from '../../Image';
import {MarqueeController, MarqueeText} from '../../Marquee';
import Skinnable from '../../Skinnable';

import componentCss from './GridListImageItem.less';

const
	defaultPlaceholder =
	'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC' +
	'9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHN0cm9rZT0iIzU1NSIgZmlsbD0iI2FhYSIg' +
	'ZmlsbC1vcGFjaXR5PSIwLjIiIHN0cm9rZS1vcGFjaXR5PSIwLjgiIHN0cm9rZS13aWR0aD0iNiIgLz48L3N2Zz' +
	'4NCg==',
	captionComponent = (props) => (
		<MarqueeText alignment="center" marqueeOn="hover" {...props} />
	);

/**
 * A Moonstone-themed grid list image item without any behavior.
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
		 * <GridListImageItem selectionOverlay={SelectionOverlay} />
		 * ```
		 *
		 * @type {Function}
		 */
		selectionOverlay: PropTypes.func
	},

	styles: {
		css: componentCss,
		publicClassNames: ['icon', 'image', 'selected', 'caption', 'subCaption']
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
				placeholder={defaultPlaceholder}
			/>
		);
	}
});

/**
 * Moonstone-specific GridListImageItem behaviors to apply to
 * [GridListImageItem]{@link moonstone/VirtualList.GridListImageItemBase}.
 *
 * @hoc
 * @memberof moonstone/VirtualList
 * @mixes moonstone/Marquee.MarqueeController
 * @mixes spotlight/Spottable.Spottable
 * @mixes ui/Skinnable.Skinnable
 * @public
 */
const GridListImageItemDecorator = compose(
	MarqueeController({marqueeOnFocus: true}),
	Spottable,
	Skinnable
);

/**
 * [GridListImageItem]{@link moonstone/VirtualList.GridListImageItem} is a GridListImageItem with
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
const GridListImageItem = GridListImageItemDecorator(GridListImageItemBase);

export default GridListImageItem;
export {
	GridListImageItem,
	GridListImageItemBase,
	GridListImageItemDecorator
};
