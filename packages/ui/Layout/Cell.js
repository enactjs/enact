import EnactPropTypes from '@enact/core/internal/prop-types';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';

import ForwardRef from '../ForwardRef';
import ri from '../resolution';

import css from './Layout.module.less';

const toFlexAlign = (align) => (
	align === 'end' && 'flex-end' ||
	align === 'start' && 'flex-start' ||
	align
);

/**
 * A stateless component that provides a space for your content in a
 * {@link ui/Layout.Layout|Layout}, without {@link ui/Layout.CellDecorator|CellDecorator} applied.
 *
 * @class CellBase
 * @memberof ui/Layout
 * @ui
 * @public
 */
const CellBase = kind({
	name: 'Cell',

	propTypes: /** @lends ui/Layout.CellBase.prototype */ {
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
		 * Any valid {@link /docs/developer-guide/glossary/#node|Node} that should be positioned in this `Cell`.
		 *
		 * @type {Any}
		 * @public
		 */
		children: PropTypes.any,

		/**
		 * The type of component to use to render as the `Cell`. May be a DOM node name (e.g 'div',
		 * 'span', etc.) or a custom component.
		 *
		 * @type {String|Component}
		 * @default 'div'
		 * @public
		 */
		component:  EnactPropTypes.renderable,

		/**
		 * Customizes `Cell` together with `component` prop.
		 *
		 * When using {@link ui/Layout.Cell}, the `componentCss` prop is passed to the rendered component
		 * as `css`.
		 *
		 * @type {Object}
		 * @public
		 */
		componentCss: PropTypes.object,

		/**
		 * Called with a reference to the root component.
		 *
		 * When using {@link ui/Layout.Cell}, the `ref` prop is forwarded to the rendered component
		 * as `componentRef`.
		 *
		 * @type {Object|Function}
		 * @public
		 */
		componentRef: EnactPropTypes.ref,

		/**
		 * Sizes `Cell` to its container.
		 *
		 * A `grow`able cell will expand to its maximum size, according to the remaining space of the
		 * container. This is used when you want to grow the size of this Cell so that it fills the
		 * container. See the {@link ui/Layout.CellBase.size|size} property for more details.
		 *
		 * When combined with {@link ui/Layout.CellBase.shrink|shrink}, `shrink` prop takes precedence over
		 * `grow` prop and `grow` prop is simply ignored.
		 *
		 * @type {Boolean}
		 * @public
		 */
		grow: PropTypes.bool,

		/**
		 * Sizes `Cell` to its contents.
		 *
		 * A `shrink`able cell will contract to its minimum size, according to the dimensions of its
		 * contents. This is used when you want the size of this Cell's content to influence the
		 * dimensions of this cell. `shrink` will not allow the contents of the Layout to be pushed
		 * beyond its boundaries (overflowing). See the {@link ui/Layout.CellBase.size|size} property
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
		 * When used in conjunction with {@link ui/Layout.CellBase.shrink|shrink}, the size will be
		 * the maximum size, shrinking as necessary, to fit the content.
		 *
		 * When used in conjunction with {@link ui/Layout.CellBase.grow|grow}, the size will be the
		 * minimum size, growing as necessary, to fit the container.
		 *
		 * E.g.
		 * * `size="400px"` -> cell will be 400px, regardless of the dimensions of your content
		 * * `size="400px" shrink` -> cell will be 400px if your content is greater than 400px,
		 *   and will match your contents size if it's smaller
		 * * `size="400px" grow` -> cell will be 400px if the container has no remaining space.
		 *   Cell can grow larger than `size` to fill the container if there is remaining space
		 *   in the container.
		 *
		 * This accepts any valid CSS measurement value string. If a numeric value is used, it will
		 * be treated as a pixel value and converted to a
		 * {@link ui/resolution.unit|relative unit} based on the rules of
		 * {@link ui/resolution|resolution independence}.
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
		className: ({grow, shrink, size, styler}) => styler.append({shrink, grow: !shrink && (grow || !size), size}),
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
				// Setting 100% below in the presence of `shrink`` and absence of `size` prevents overflow
				'--cell-size': cellSize
			};
		}
	},

	render: ({component: Component, componentCss, componentRef, ...rest}) => {
		delete rest.align;
		delete rest.grow;
		delete rest.shrink;
		delete rest.size;

		const {key, ...restProps} = {...rest};

		return <Component css={componentCss} ref={componentRef} key={key} {...restProps} />;
	}
});

/**
 * Applies Cell behaviors.
 *
 * @hoc
 * @memberof ui/Layout
 * @mixes ui/ForwardRef.ForwardRef
 * @public
 */
const CellDecorator = ForwardRef({prop: 'componentRef'});

/**
 * A stateless component that provides a space for your content in a
 * {@link ui/Layout.Layout|Layout}.
 *
 * @class Cell
 * @memberof ui/Layout
 * @extends ui/Layout.CellBase
 * @mixes ui/Layout.CellDecorator
 * @omit componentRef
 * @ui
 * @public
 */
const Cell = CellDecorator(CellBase);

export default Cell;
export {
	Cell,
	CellBase,
	CellDecorator,
	toFlexAlign
};
