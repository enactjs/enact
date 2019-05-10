/**
 * Provides ui layout support using `Cell`, `Row`, and `Column` that uses flexbox to lay out elements.
 *
 * @example
 * <Layout>
 * 	<Cell shrink>
 * 		<Button size="small">First</Button>
 * 	</Cell>
 * 	<Cell>
 * 		<Item>An Item with some long text in it</Item>
 * 	</Cell>
 * 	<Cell shrink>
 * 		<Button size="small">Last</Button>
 * 	</Cell>
 * </Layout>
 *
 * @module ui/Layout
 * @exports Cell
 * @exports CellBase
 * @exports CellDecorator
 * @exports Column
 * @exports Layout
 * @exports LayoutBase
 * @exports LayoutDecorator
 * @exports Row
 */

import kind from '@enact/core/kind';
import EnactPropTypes from '@enact/core/internal/prop-types';
import PropTypes from 'prop-types';
import React from 'react';

import ForwardRef from '../ForwardRef';

import {Cell, CellBase, CellDecorator, toFlexAlign} from './Cell';

import css from './Layout.module.less';

/**
 * A container for `Cell`s.
 *
 * A stateless component that acts as a containing area for [Cells]{@link ui/Layout.Cell} to be
 * positioned in a row or a column (horizontally or vertically, respectively. It supports an
 * [orientation]{@link ui/Layout.Layout#orientation} property for laying-out its contents
 * (`Cells`) in an organized, readable way.
 *
 * Example:
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
 * @class LayoutBase
 * @ui
 * @memberof ui/Layout
 * @public
 */
const LayoutBase = kind({
	name: 'LayoutBase',

	propTypes: /** @lends ui/Layout.LayoutBase.prototype */ {
		/**
		 * The alignment of children.
		 *
		 * Aligns the children [Cells]{@link ui/Layout.Cell} vertically in the case of a horizontal
		 * layout or horizontally in the case of a vertical layout. `"start"`, `"center"` and
		 * `"end"` are the most commonly used, although all values of `align-items` are supported.
		 * `"start"` refers to the top in a horizontal layout, and left in a vertical LTR layout
		 * `"end"` refers to the bottom in a horizontal layout, and right in a vertical LTR layout
		 * `"start"` and `"end"` reverse places when in a vertical layout in a RTL locale.
		 * This includes support for `align-parts` which is shorthand for combining `align-items`
		 * and `justify-content` into a single property, separated by a space, in that order.
		 * This allows you to specify both the horizontal and vertical alignment in one property,
		 * separated by a space.
		 *
		 * @type {String}
		 * @public
		 */
		align: PropTypes.string,

		/**
		 * Only [Cell]{@link ui/Layout.Cell} components are supported as children.
		 *
		 * @type {Any}
		 * @public
		 */
		children: PropTypes.any,

		/**
		 * The type of component to use to render as the `Layout`. May be a DOM node name (e.g 'div',
		 * 'span', etc.) or a custom component.
		 *
		 * @type {String|Component}
		 * @default 'div'
		 * @public
		 */
		component:  EnactPropTypes.renderable,

		/**
		 * Called with a reference to [component]{@link ui/Layout.Layout#component}
		 *
		 * @type {Function}
		 * @private
		 */
		componentRef: PropTypes.func,

		/**
		 * Allows this `Layout` to have following siblings drawn on the same line as itself
		 * instead of carving out the entire horizontal space for itself.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		inline: PropTypes.bool,

		/**
		 * The orientation of the `Layout`, i.e. how the children [Cells]{@link ui/Layout.Cell} are
		 * positioned on the screen. Must be either `'horizontal'` or `'vertical'`.
		 *
		 * @type {String}
		 * @default 'horizontal'
		 * @public
		 */
		orientation: PropTypes.oneOf(['horizontal', 'vertical']),

		/**
		 * Sets the Layout's `flex-wrap` values.
		 *
		 * Determines how a Layout handles its cells if there are more than fit in the available
		 * space. This works like a normal `Boolean` prop, but also accepts strings for customization
		 * beyond the basic on/off support. In addition to `true` and `false`, the following strings
		 * are supported: 'wrap', 'nowrap', 'reverse'. 'reverse' performs standard line wrapping but
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
			return styler.append(
				orientation,
				{
					inline,
					nowrap: wrap === false || wrap === 'nowrap',
					wrap: wrap === true || wrap === 'wrap',
					wrapReverse: wrap === 'wrapReverse'
				}
			);
		},
		style: ({align, style}) => {
			if (!align) return style;

			// This is effectively a polyfill for the upcoming `place-items` prop which is shorthand
			// for align-items and justify-items together
			const alignParts = align.split(' ');

			return {
				...style,
				alignItems: toFlexAlign(alignParts[0]),
				justifyContent: toFlexAlign(alignParts[1])
			};
		}
	},

	render: ({component: Component, componentRef, ...rest}) => {
		delete rest.align;
		delete rest.inline;
		delete rest.orientation;
		delete rest.wrap;

		return <Component ref={componentRef} {...rest} />;
	}
});

/**
 * Applies Layout behaviors.
 *
 * @hoc
 * @memberof ui/Layout
 * @mixes ui/ForwardRef.ForwardRef
 * @public
 */
const LayoutDecorator = ForwardRef({prop: 'componentRef'});

/**
 * A container for `Cell`s.
 *
 * A stateless component that acts as a containing area for [Cells]{@link ui/Layout.Cell} to be
 * positioned in a row or a column (horizontally or vertically, respectively. It supports an
 * [orientation]{@link ui/Layout.Layout#orientation} property for laying-out its contents
 * (`Cells`) in an organized, readable way.
 *
 * Example:
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
 * @extends ui/Layout.LayoutBase
 * @mixes ui/ForwardRef.ForwardRef
 * @ui
 * @public
 */
const Layout = LayoutDecorator(LayoutBase);

/**
 * A {@link ui/Layout.Layout} that positions its [Cells]{@link ui/Layout.Cell} vertically.
 *
 * @class Column
 * @memberof ui/Layout
 * @extends ui/Layout.Layout
 * @mixes ui/ForwardRef.ForwardRef
 * @ui
 * @public
 */
const Column = LayoutDecorator((props) => (
	LayoutBase.inline({
		...props,
		orientation: 'vertical'
	})
));

/**
 * A {@link ui/Layout.Layout} that positions its [Cells]{@link ui/Layout.Cell} horizontally.
 *
 * @class Row
 * @memberof ui/Layout
 * @extends ui/Layout.Layout
 * @mixes ui/ForwardRef.ForwardRef
 * @ui
 * @public
 */
const Row = LayoutDecorator((props) => (
	LayoutBase.inline({
		...props,

		orientation: 'horizontal'
	})
));

export default LayoutBase;
export {
	Cell,
	CellBase,
	CellDecorator,
	Column,
	Layout,
	LayoutBase,
	LayoutDecorator,
	Row
};
