import kind from '@enact/core/kind';
import {Spottable} from '@enact/spotlight';
import React from 'react';

import css from './Panels.less';

// Since we expose `onSelect` to handle breadcrumb selection, we need that handler to be set on a
// component that proxies mouse events for key events so we create a spottable div that will
// get the right classes as well as handle events correctly.
const SpottableDiv = Spottable('div');

/**
 * The width of a breadcrumb which may be used to allocate space for it in a panels layout.
 *
 * @type {Number}
 * @default 96;
 * @private
 * @memberof moonstone/Panels
 */
export const breadcrumbWidth = 96;

/**
 * Vertical, transparent bar generally laid out horizontally used to navigate to a prior Panel.
 *
 * @class Breadcrumb
 * @memberof moonstone/Panels
 */
const BreadcrumbBase = kind({
	name: 'Breadcrumb',

	propTypes: /** @lends moonstone/Panels.Breadcrumb.prototype */ {
		/**
		 * Index of the panel for which this is the breadcrumb
		 *
		 * @type {Number}
		 */
		index: React.PropTypes.number.isRequired,

		/**
		 * Called when the breadcrumb is clicked
		 *
		 * @type {Function}
		 */
		onSelect: React.PropTypes.func
	},

	styles: {
		css,
		className: 'breadcrumb'
	},

	handlers: {
		onSelect: (ev, {index, onSelect, onClick}) => {
			if (onClick) onClick(ev);
			if (onSelect) onSelect({index});
		}
	},

	render: ({children, index, onSelect, ...rest}) => (
		<SpottableDiv {...rest} data-index={index} onClick={onSelect}>
			<div className={css.breadcrumbHeader}>
				{children}
			</div>
		</SpottableDiv>
	)
});

export default BreadcrumbBase;
export {BreadcrumbBase as Breadcrumb, BreadcrumbBase};
