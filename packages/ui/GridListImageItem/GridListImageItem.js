/**
 * Provides unstyled grid list image item components and behaviors to be customized by a theme or application.
 *
 * @module ui/GridListImageItem
 * @exports GridListIamgeItem
 */

import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import Icon from '../Icon';
import Image from '../Image';

import componentCss from './GridListImageItem.less';

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
		 * The component used to render the captions
		 *
		 * @type {Component}
		 * @public
		 */
		captionComponent: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.string
		]),

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
		 * @type {Function}
		 * @default ui/Icon.Icon
		 * @public
		 */
		iconComponent: PropTypes.func,

		/**
		 * The component used to render the image component
		 *
		 * @type {Function}
		 * @default ui/Image.Image
		 * @public
		 */
		imageComponent: PropTypes.func,

		/**
		 * Placeholder image used while [source]{@link ui/GridListImageItem.GridListImageItem#source}
		 * is loaded.
		 *
		 * @type {String}
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
		 * <GridListImageItem selectionOverlay={SelectionOverlay} />
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
			{selected},
			caption ? 'useCaption' : null,
			subCaption ? 'useSubCaption' : null
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
			<div {...rest}>
				<ImageComponent className={css.image} placeholder={placeholder} src={source}>
					{selectionOverlay}
				</ImageComponent>
				{caption ? (<Caption className={css.caption}>{caption}</Caption>) : null}
				{subCaption ? (<Caption className={css.subCaption}>{subCaption}</Caption>) : null}
			</div>
		);
	}
});

export default GridListImageItem;
export {GridListImageItem};
