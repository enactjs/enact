import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import ri from '../resolution';

import css from './Layout.less';

const toFlexAlign = (align) => (
	align === 'end' && 'flex-end' ||
	align === 'start' && 'flex-start' ||
	align
);

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
		 * The alignment of `Cell`.
		 *
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
		 * Any valid [Node]{@link /docs/developer-guide/glossary/#node} that should be positioned in this `Cell`.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * The type of component to use to render as the `Cell`. May be a DOM node name (e.g 'div',
		 * 'span', etc.) or a custom component.
		 *
		 * @type {Component}
		 * @default 'div'
		 * @public
		 */
		component:  PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

		/**
		 * Sizes `Cell` to its contents.
		 *
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
		 * Sets the desired size of the Cell using any valid CSS measurement value.
		 *
		 * When used in conjunction with [shrink]{@link ui/Layout.Cell#shrink}, the size will be
		 * the maximum size, shrinking as necessary, to fit the content.
		 *
		 * E.g.
		 * * `size="400px"` -> cell will be 400px, regardless of the dimensions of your content
		 * * `size="400px" shrink` -> cell will be 400px if your content is greater than 400px,
		 *   and will match your contents size if it's smaller
		 *
		 * This accepts any valid CSS measurement value string. If a numeric value is used, it will
		 * be treated as a pixel value and converted to a
		 * [relative unit]{@link ui/resolution.unit} based on the rules of
		 * [resolution independence]{@link ui/resolution}.
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

	styles: {
		css,
		className: 'cell'
	},

	computed: {
		className: ({shrink, size, styler}) => styler.append({shrink, grow: (!shrink && !size)}),
		style: ({align, shrink, size, style}) => {
			if (typeof size === 'number') size = ri.unit(ri.scale(size), 'rem');

			let cellSize = size;
			if (!size) {
				if (shrink) {
					cellSize = '100%';
				} else {
					cellSize = 'none';
				}
			}

			return {
				...style,
				alignSelf: toFlexAlign(align),
				flexBasis: (shrink ? null : size),
				// Setting 100% below in the presence of `shrink`` and absense of `size` prevents overflow
				'--cell-size': cellSize
			};
		}
	},

	render: ({component: Component, ...rest}) => {
		delete rest.align;
		delete rest.shrink;
		delete rest.size;

		return <Component {...rest} />;
	}
});

export default CellBase;
export {
	CellBase as Cell,
	CellBase,
	toFlexAlign
};
