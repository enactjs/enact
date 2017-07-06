/**
 * Exports the {@link ui/Layout.Layout}, {@link ui/Layout.LayoutBase}, and  {@link ui/Layout.Cell}
 * components. The default export is {@link ui/Layout.Layout}.
 *
 * @example
 * <Layout>
 * 	<Cell>
 * 		<Button small>First</Button>
 * 	</Cell>
 * 	<Cell flexible>
 * 		<Item>An Item with some long text in it</Item>
 * 	</Cell>
 * 	<Cell>
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
		 * Determines how this cell should be arranged in the layout. A fixed cell will not expand
		 * or shrink beyond its initial size, determined either by the
		 * [size]{@link ui/Layout.Cell#size} property or its contents' dimensions.
		 * A Cell cannot be both `flexible` and `fixed`.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		fixed: PropTypes.bool,

		/**
		 * Determines how this cell should be arranged in the layout. A flexible cell will expand to
		 * fill all available space. If multiple flexible cells are present, they will divide the
		 * available space evenly between themselves.
		 * A Cell cannot be both `flexible` and `fixed`.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		flexible: PropTypes.bool,

		/**
		 * Sets the initial requested size, if avaailable, given the space and other attributes.
		 * This accepts any valid CSS measurement.
		 *
		 * @type {String}
		 * @public
		 */
		size: PropTypes.string
	},

	defaultProps: {
		component: 'div',
		fixed: false,
		flexible: false
	},

	styles: {
		css,
		className: 'cell'
	},

	computed: {
		className: ({fixed, flexible, styler}) => styler.append({fixed, flexible}),
		style: ({size, style = {}}) => {
			style.flexBasis = size;
			return  style;
		}
	},

	render: ({component: Component, ...rest}) => {
		delete rest.fixed;
		delete rest.flexible;

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
 * 		<Cell component="label" size="40%" className={css.label}>First Name</Cell>
 * 		<Cell component={Input} placeholder="First" className={css.input} flexible />
 * 	</Layout>
 * 	<Layout align="center">
 * 		<Cell component="label" size="40%" className={css.label}>Last Name</Cell>
 * 		<Cell component={Input} placeholder="Last" className={css.input} flexible />
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
