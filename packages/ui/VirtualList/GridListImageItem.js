/*
 * Exports the {@link ui/VirtualList.GridListImageItem} and
 * {@link ui/VirtualList.GridListImageItemBase} components. The default export is
 * {@link ui/VirtualList.GridListImageItem}.
 *
 * Not a jsdoc module def on purpose. Exported elsewhere.
 */
import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import {Image} from '../Image';

import componentCss from './GridListImageItem.less';

const defaultPlaceholder =
	'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC' +
	'9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHN0cm9rZT0iIzU1NSIgZmlsbD0iI2FhYSIg' +
	'ZmlsbC1vcGFjaXR5PSIwLjIiIHN0cm9rZS1vcGFjaXR5PSIwLjgiIHN0cm9rZS13aWR0aD0iNiIgLz48L3N2Zz' +
	'4NCg==';

 /**
 * {@link ui/VirtualList.GridListImageItemBaseFactory} is Factory wrapper around {@link ui/VirtualList.GridListImageItemBase}
 * that allows overriding certain classes at design time. The following are properties of the `css`
 * member of the argument to the factory.
 *
 * @class GridListImageItemBaseFactory
 * @memberof ui/VirtualList
 * @factory
 * @ui
 * @public
 */
const GridListImageItemBaseFactory = factory({css: componentCss}, ({css}) => {
	/**
	 * {@link ui/VirtualList.GridListImageItem} represents a stateless GridListImageItem.
	 *
	 * @class GridListImageItem
	 * @memberof ui/VirtualList
	 * @ui
	 * @public
	 */
	return kind({
		name: 'GridListImageItem',

		propTypes: /** @lends ui/VirtualList.GridListImageItemBase.prototype */ {
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
			 * Placeholder image used while [source]{@link ui/VirtualList.GridListImageItemBase#source}
			 * is loaded.
			 *
			 * @type {String}
			 * @default 'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC' +
			 * '9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHN0cm9rZT0iIzU1NSIgZmlsbD0iI2FhYSIg' +
			 * 'ZmlsbC1vcGFjaXR5PSIwLjIiIHN0cm9rZS1vcGFjaXR5PSIwLjgiIHN0cm9rZS13aWR0aD0iNiIgLz48L3N2Zz' +
			 * '4NCg==';
			 * @public
			 */
			placeholder: PropTypes.string
		},

		defaultProps: {
			placeholder: defaultPlaceholder
		},

		styles: {
			css,
			className: 'gridListImageItem'
		},

		computed: {
			className: ({caption, styler}) => styler.append(
				caption ? 'useCaption' : null
			)
		},

		render: ({caption, placeholder, source, ...rest}) => {
			return (
				<div {...rest}>
					<Image className={css.image} placeholder={placeholder} src={source} />
					{caption ? (<div className={css.caption}>{caption}</div>) : null}
				</div>
			);
		}
	});
});

/**
 * {@link ui/VirtualList.GridListImageItem} is a GridListImageItem with ui styling applied.
 *
 * Usage:
 * ```
 * <GridListImageItem source="http://placehold.it/300x300/9037ab/ffffff&text=Image0" caption="image0" />
 * ```
 *
 * @class GridListImageItem
 * @memberof ui/VirtualList
 * @see ui/VirtualList.GridListImageItemBase
 * @ui
 * @public
 */
const GridListImageItemBase = GridListImageItemBaseFactory();

export default GridListImageItemBase;
export {
	GridListImageItemBase as GridListImageItem,
	GridListImageItemBase,
	GridListImageItemBaseFactory as GridListImageItemFactory,
	GridListImageItemBaseFactory
};
