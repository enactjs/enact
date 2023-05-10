/**
 * Unstyled grid list image item components and behaviors to be customized by a theme or application.
 *
 * @module ui/GridListImageItem
 * @exports GridListImageItem
 * @deprecated Will be removed in 5.0.0. Use {@link ui/ImageItem} instead.
 */

import deprecate from '@enact/core/internal/deprecate';
import EnactPropTypes from '@enact/core/internal/prop-types';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import {Fragment} from 'react';

import {Column, Cell} from '../Layout';
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
		 * corresponding internal elements and states of this component.
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
		 * Placeholder image used while {@link ui/GridListImageItem.GridListImageItem.source|source}
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
		subCaption: PropTypes.string,

		/**
		 * The components that will be shown below the image.
		 *
		 * @type {Array|Element}
		 * @private
		 */
		subComponents: PropTypes.oneOfType([PropTypes.array, PropTypes.element])
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
		},
		subComponents: ({caption, captionComponent: Caption, css, subCaption, subComponents}) => {
			return subComponents ? subComponents : <Fragment>
				{caption ? (<Cell className={css.caption} component={Caption} shrink>{caption}</Cell>) : null}
				{subCaption ? (<Cell className={css.subCaption} component={Caption} shrink>{subCaption}</Cell>) : null}
			</Fragment>;
		}
	},

	render: deprecate(({css, imageComponent: ImageComponent, placeholder, source, selectionOverlay, subComponents, ...rest}) => {
		delete rest.caption;
		delete rest.captionComponent;
		delete rest.iconComponent;
		delete rest.selected;
		delete rest.selectionOverlayShowing;
		delete rest.subCaption;

		return (
			<Column {...rest} inline>
				<Cell className={css.image} component={ImageComponent} placeholder={placeholder} src={source}>
					{selectionOverlay}
				</Cell>
				{subComponents}
			</Column>
		);
	}, {
		name: 'ui/GridListImageItem',
		replacedBy: 'ui/ImageItem',
		until: '5.0.0'
	})
});

export default GridListImageItem;
export {GridListImageItem};
