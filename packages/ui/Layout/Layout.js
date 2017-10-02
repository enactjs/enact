/**
 * Exports the {@link ui/Layout.Layout}, {@link ui/Layout.LayoutBase}, and  {@link ui/Layout.Cell}
 * components. The default export is {@link ui/Layout.Layout}. Layout also has two shorthand
 * components exported: `Row` and `Column`. These two assign preset `orientation` properties to
 * simplify usage and readability. They are identical to `<Layout orientation="horizontal">` and
 * `<Layout orientation="vertical">` respectively.
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
import {withContextFromProps} from '@enact/core/util';
import React from 'react';
import {compose, withProps} from 'recompose';
import PropTypes from 'prop-types';

import ri from '../resolution';

import css from './Layout.less';

/*
 * contextTypes, which are available to the `kind` and `withContextFromProps`, allow Layout to
 * inform child Cells about itself that Cell can act upon.
 */
const contextTypes = {
	align: PropTypes.string,
	orientation: PropTypes.string
};

// Setup a list of shorthand translations
const shorthandAliases = {
	end: 'flex-end',
	start: 'flex-start'
};

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
		 * Aligns this `Cell` vertically in the case of a horizontal layout or
		 * horizontally in the case of a vertical layout. `"start"`, `"center"` and
		 * `"end"` are the most commonly used, although all values of `align-self` are supported.
		 * `"start"` refers to the top in a horizontal layout, and left in a vertical LTR layout
		 * `"end"` refers to the bottom in a horizontal layout, and right in a vertical LTR layout
		 * `"start"` and `"end"` reverse places when in a vertical layout in a RTL locale.
		 *
		 * @type {String}
		 * @public
		 */
		align: PropTypes.string,

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
		 * contents. This is used when you want the size of this Cell's content to influence the
		 * dimensions of this cell. `shrink` will not allow the contents of the Layout to be pushed
		 * beyond its boundaries (overflowing). See the [size]{@link ui/Layout.Cell#size} property
		 * for more details.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		shrink: PropTypes.bool,

		/**
		 * Sets the requested size, possibly overflowing if the contents are too large for the space.
		 * When used in conjunction with [shrink]{@link ui/Layout.Cell#shrink}, the size will be set
		 * as close to the requested size as is possible, given the dimensions of the contents of
		 * this cell. E.g. If your content is `40px` tall and you set `size` to "30px", the Cell will
		 * render `30px` tall. If [shrink]{@link ui/Layout.Cell#shrink} was used also, the rendered
		 * Cell would be `40px` tall.
		 * This accepts any valid CSS measurement and overrules the
		 * [shrink]{@link ui/Layout.Cell#shrink} property.
		 *
		 * @type {String|Number}
		 * @public
		 */
		size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
	},

	defaultProps: {
		component: 'div',
		shrink: false
	},

	contextTypes,

	styles: {
		css,
		className: 'cell'
	},

	computed: {
		className: ({shrink, size, styler}) => styler.append({shrink, grow: (!shrink && !size)}),
		style: ({align, shrink, size, style = {}}, {orientation}) => {
			if (typeof size === 'number') size = ri.unit(ri.scale(size), 'rem');
			style.alignSelf = shorthandAliases[align] || align;
			style.flexBasis = size;
			if (!shrink) style[orientation === 'vertical' ? 'maxHeight' : 'maxWidth'] = size; // shrink and size uses just basis, size without shrink forcibly sets the size, allowing overflow.
			return style;
		}
	},

	render: ({component: Component, ...rest}) => {
		delete rest.align;
		delete rest.shrink;
		delete rest.size;

		return <Component {...rest} />;
	}
});

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
		 * Allows this Layout to have following siblings drawn on the same line as itself, instead
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
		orientation: PropTypes.oneOf(['horizontal', 'vertical']),

		/**
		 * Determine how a Layout handles its cells if there are more than fit in the available
		 * space. This works like a normal Boolean prop, but also accepts strings for customization
		 * beyond the basic on/off support. In addition to `true` and `false`, the following strings
		 * are supported: 'wrap', 'nowrap', 'reverse'. 'reverse' preforms standard line wrapping but
		 * additional lines are placed above/before the preceding line instead of below/after.
		 *
		 * @type {Boolean|String}
		 * @public
		 */
		wrap: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['reverse', 'nowrap', 'wrap'])])
	},

	defaultProps: {
		component: 'div',
		inline: false,
		orientation: 'horizontal',
		wrap: false
	},

	styles: {
		css,
		className: 'layout'
	},

	computed: {
		className: ({inline, orientation, wrap, styler}) => {
			let wrapClass = 'nowrap';
			if (wrap && wrap !== 'nowrap') {
				wrapClass = (wrap === 'reverse' ? 'wrapReverse' : 'wrap');
			}
			return styler.append(
				orientation,
				wrapClass,
				{inline}
			);
		},
		style: ({align, style = {}}) => {
			style.alignItems = shorthandAliases[align] || align;
			return  style;
		}
	},

	render: ({component: Component, ...rest}) => {
		delete rest.align;
		delete rest.inline;
		delete rest.orientation;
		delete rest.wrap;

		return <Component {...rest} />;
	}
});

// Convert a few incoming props of Layout into context keys so children Cells can adjust their behavior accordingly.
const Layout = withContextFromProps(contextTypes, LayoutBase);

const addOrientation = (orientation) => compose(
	withProps({
		orientation
	})
);

const Column = addOrientation('vertical')(Layout);
const Row = addOrientation('horizontal')(Layout);

export default Layout;
export {Layout, LayoutBase, CellBase as Cell, CellBase, Column, Row};
