/**
 * Exports the {@link ui/Layout.Layout} and {@link ui/Layout.LayoutBase}
 * components.  The default export is {@link ui/Layout.Layout}.
 *
 * @module ui/Layout
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import css from './Layout.less';

/**
 * {@link ui/Layout.LayoutBase} is a stateless component that allows for applying
 * layouts to its child items via configurable properties and events. In general, you want to
 * use the stateful version, {@link ui/Layout.Layout}.
 *
 * @class LayoutBase
 * @memberof ui/Layout
 * @public
 */
const CellBase = kind({
	name: 'Cell',

	propTypes: /** @lends ui/Layout.LayoutBase.prototype */ {
		children: PropTypes.node,
		fixed: PropTypes.bool,
		flexible: PropTypes.bool
	},

	defaultProps: {
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

	render: ({children, ...rest}) => {
		delete rest.fixed;
		delete rest.flexible;

		return <div {...rest}>{children}</div>;
	}
});

/**
 * Exports the {@link ui/Layout.Layout} and {@link ui/Layout.LayoutBase}
 * components.  The default export is {@link ui/Layout.Layout}.
 *
 * @module ui/Layout
 */


/**
 * {@link ui/Layout.LayoutBase} is a stateless component that allows for applying
 * layouts to its child items via configurable properties and events. In general, you want to
 * use the stateful version, {@link ui/Layout.Layout}.
 *
 * @class LayoutBase
 * @memberof ui/Layout
 * @public
 */
const LayoutBase = kind({
	name: 'LayoutBase',

	propTypes: /** @lends ui/Layout.LayoutBase.prototype */ {
		children: PropTypes.node,
		inline: PropTypes.bool,
		orientation: PropTypes.oneOf(['horizontal', 'vertical'])
	},

	defaultProps: {
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
		)
	},

	render: ({children, ...rest}) => {
		delete rest.inline;
		delete rest.orientation;

		return <div {...rest}>{children}</div>;
	}
});

export default LayoutBase;
export {LayoutBase as Layout, LayoutBase, CellBase as Cell};
