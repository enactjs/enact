/**
 * Unstyled grid list image item components and behaviors to be customized by a theme or application.
 *
 * @module ui/GridListImageItem
 * @exports GridListImageItem
 */

import kind from '@enact/core/kind';
import EnactPropTypes from '@enact/core/internal/prop-types';
import {Column, Cell} from '@enact/ui/Layout';
import PropTypes from 'prop-types';
import React from 'react';

import Icon from '../Icon';
import Image from '../Image';

import componentCss from './GridListImageItem.module.less';

/**
 * A basic grid list image item without any behavior.
 *
 * @class GridListImageItem
 * @memberof ui/GridListImageItem
 * @ui
 * @public
 */
const GridListImageItem = kind({
	name: 'ui:GridListImageItem',

	propTypes: /** @lends ui/GridListImageItem.GridListImageItem.prototype */ {
		/**
		 * The primary caption to be displayed with the image.
		 *
		 * @type {String}
		 * @public
		 */
		caption: PropTypes.string,

		/**
		 * The component used to render the captions
		 *
		 * @type {String|Component}
		 * @public
		 */
		captionComponent: EnactPropTypes.renderable,

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
		 * The component used to render the default check icon when selected.
		 * If there is custom selectionOverlay component, this icon will not be shown.
		 *
		 * @type {Component}
		 * @default ui/Icon.Icon
		 * @public
		 */
		iconComponent: EnactPropTypes.component,

		/**
		 * The component used to render the image component
		 *
		 * @type {Component}
		 * @default ui/Image.Image
		 * @public
		 */
		imageComponent: EnactPropTypes.component,

		/**
		 * Placeholder image used while [source]{@link ui/GridListImageItem.GridListImageItem#source}
		 * is loaded.
		 *
		 * @type {String}
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
		 * The custom selection overlay component to render.
		 *
		 * A component can be a stateless functional component, `kind()` or React component.
		 * The following is an example with custom selection overlay kind.
		 *
		 * Example:
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
		selectionOverlay: PropTypes.func,

		/**
		 * Shows a selection overlay with a centered icon. When `selected` is true, a check mark is shown.
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
		captionComponent: 'div',
		iconComponent: Icon,
		imageComponent: Image,
		selected: false,
		selectionOverlayShowing: false
	},

	styles: {
		css: componentCss,
		className: 'gridListImageItem',
		publicClassNames: true
	},

	computed: {
		className: ({caption, selected, styler, subCaption}) => styler.append(
			{selected, caption, subCaption}
		),
		selectionOverlay: ({css, iconComponent: IconComponent, selectionOverlay: SelectionOverlay, selectionOverlayShowing}) => {
			if (selectionOverlayShowing) {
				return (
					<div className={css.overlayContainer}>
						{
							SelectionOverlay ?
								<SelectionOverlay /> :
								<div className={css.overlayComponent}>
									<IconComponent className={css.icon}>check</IconComponent>
								</div>
						}
					</div>
				);
			}
		}
	},

	render: ({caption, captionComponent: Caption, css, imageComponent: ImageComponent, placeholder, source, subCaption, selectionOverlay, ...rest}) => {
		delete rest.iconComponent;
		delete rest.selected;
		delete rest.selectionOverlayShowing;

		return (
			<Column {...rest} inline>
				<Cell className={css.image} component={ImageComponent} placeholder={placeholder} src={source}>
					{selectionOverlay}
				</Cell>
				{caption ? (<Cell className={css.caption} component={Caption} shrink>{caption}</Cell>) : null}
				{subCaption ? (<Cell className={css.subCaption} component={Caption} shrink>{subCaption}</Cell>) : null}
			</Column>
		);
	}
});

export default GridListImageItem;
export {GridListImageItem};
