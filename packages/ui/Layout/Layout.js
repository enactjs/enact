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
		component:  PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
		fixed: PropTypes.bool,
		flexible: PropTypes.bool,
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

/**
 * Exports the {@link ui/Layout.Layout} and {@link ui/Layout.LayoutBase}
 * components.  The default export is {@link ui/Layout.Layout}.
 *
 * @module ui/Layout
 */

const shorthandAliases = {
	end: 'flex-end',
	start: 'flex-start'
};

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
		align: PropTypes.string,
		children: PropTypes.node,
		component:  PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
		inline: PropTypes.bool,
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
