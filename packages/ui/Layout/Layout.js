/**
 * Exports the {@link ui/Layout.Layout}, {@link ui/Layout.LayoutBase}, and  {@link ui/Layout.Cell}
 * components. The default export is {@link ui/Layout.Layout}.
 *
 * @example
 * <Layout>
 * 	<Cell shrink>
 * 		<Button small>First</Button>
 * 	</Cell>
 * 	<Cell>
 * 		<Item>An Item with some long text in it</Item>
 * 	</Cell>
 * 	<Cell shrink>
 * 		<Button small>Last</Button>
 * 	</Cell>
 * </Layout>
 *
 * @module ui/Layout
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import css from './Layout.less';

/**
 * A stateless component that provides a space for your content in a
 * [Layout]{@link ui/Layout.Layout}.
 *
 * @class Cell
 * @memberof ui/Layout
 * @public
 */
const CellBase = kind({
	name: 'Cell',

	propTypes: /** @lends ui/Layout.Cell.prototype */ {
		/**
		 * Any valid Node that should be positioned in this Cell.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * The type of component to use to render as the Cell. May be a DOM node name (e.g 'div',
		 * 'span', etc.) or a custom component.
		 *
		 * @type {String|Node}
		 * @default 'div'
		 * @public
		 */
		component:  PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

		/**
		 * A `shrink`able cell will contract to its minimum size, according to the dimensions of its
		 * contents. This has no effect when used with the [size]{@link ui/Layout.Cell#size}
		 * property. There's no reason to use both of them on the same Cell.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		shrink: PropTypes.bool,

		/**
		 * Sets the initial requested size, if available, given the available space and other
		 * attributes. This accepts any valid CSS measurement and overrules the
		 * [shrink]{@link ui/Layout.Cell#shrink} property.
		 *
		 * @type {String}
		 * @public
		 */
		size: PropTypes.string
	},

	defaultProps: {
		component: 'div',
		shrink: false
	},

	styles: {
		css,
		className: 'cell'
	},

	computed: {
		className: ({shrink, size, styler}) => styler.append({shrink, grow: (!shrink && !size)}),
		style: ({size, style = {}}) => {
			style.flexBasis = size;
			return  style;
		}
	},

	render: ({component: Component, ...rest}) => {
		delete rest.shrink;

		return <Component {...rest} />;
	}
});

// Setup a list of shorthand translations
const shorthandAliases = {
	end: 'flex-end',
	start: 'flex-start'
};

/**
 * A stateless component that acts as a containing area for [Cells]{@link ui/Layout.Cell} to be
 * positioned in a row or a column (horizontally or vertically, respectively. It supports an
 * [orientation]{@link ui/Layout.Layout#orientation} property for laying-out its contents
 * (Cells) in an organized, readable way.
 *
 * Additional Example:
 * ```
 * import Input from '@enact/moonstone/Input';
 * import css from './LayoutExample.less';
 * ...
 * <fieldset>
 * 	<Layout align="center">
 * 		<Cell component="label" size="40%" className={css.label} shrink>First Name</Cell>
 * 		<Cell component={Input} placeholder="First" className={css.input} />
 * 	</Layout>
 * 	<Layout align="center">
 * 		<Cell component="label" size="40%" className={css.label} shrink>Last Name</Cell>
 * 		<Cell component={Input} placeholder="Last" className={css.input} />
 * 	</Layout>
 * </fieldset>
 * ```
 *
 * @class Layout
 * @memberof ui/Layout
 * @public
 */
const LayoutBase = kind({
	name: 'LayoutBase',

	propTypes: /** @lends ui/Layout.Layout.prototype */ {
		/**
		 * Aligns the children [Cells]{@link ui/Layout.Cell} vertically in the case of a horizontal
		 * layout or horizontally in the case of a vertical layout. `"start"`, `"center"` and
		 * `"end"` are the most commonly used, although all values of `align-items` are supported.
		 * `"start"` refers to the top in a horizontal layout, and left in a vertical LTR layout
		 * `"end"` refers to the bottom in a horizontal layout, and right in a vertical LTR layout
		 * `"start"` and `"end"` reverse places when in a vertical layout in a RTL locale.
		 *
		 * @type {String}
		 * @public
		 */
		align: PropTypes.string,

		/**
		 * Only [Cell]{@link ui/Layout.Cell} components are supported as children.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * The type of component to use to render as the Layout. May be a DOM node name (e.g 'div',
		 * 'span', etc.) or a custom component.
		 *
		 * @type {String|Node}
		 * @default 'div'
		 * @public
		 */
		component:  PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

		/**
		 * Allows this Layout to have following sibblings drawn on the same line as itself, instead
		 * of carving out the entire horizontal space for itself.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		inline: PropTypes.bool,

		/**
		 * The orientation of the Layout, i.e. how the children [Cells]{@link ui/Layout.Cell} are
		 * positioned on the screen. Must be either `'horizontal'` or `'vertical'`.
		 *
		 * @type {String}
		 * @default 'horizontal'
		 * @public
		 */
		orientation: PropTypes.oneOf(['horizontal', 'vertical'])
	},

	defaultProps: {
		component: 'div',
		inline: false,
		orientation: 'horizontal'
	},

	styles: {
		css,
		className: 'layout'
	},

	computed: {
		className: ({inline, orientation, styler}) => styler.append(
			orientation,
			{inline}
		),
		style: ({align, style = {}}) => {
			style.alignItems = shorthandAliases[align] || align;
			return  style;
		}
	},

	render: ({component: Component, ...rest}) => {
		delete rest.align;
		delete rest.inline;
		delete rest.orientation;

		return <Component {...rest} />;
	}
});

export default LayoutBase;
export {LayoutBase as Layout, LayoutBase, CellBase as Cell};
