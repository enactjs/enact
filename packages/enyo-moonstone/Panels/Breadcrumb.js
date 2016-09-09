import kind from 'enyo-core/kind';
import {Spottable} from 'enyo-spotlight';
import React from 'react';

import css from './Panels.less';

/**
 * The width of a breadcrumb which may be used to allocate space for it in a panels layout.
 *
 * @type {Number}
 * @default 96;
 * @public
 */
export const breadcrumbWidth = 96;

/**
 * Stateless, functional base component for Breadcrumb
 *
 * @class BreadcrumbBase
 */
const BreadcrumbBase = kind({
	name: 'Breadcrumb',

	propTypes: {
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

	computed: {
		onSelect: ({index, onSelect: handler, onClick}) => (ev) => {
			if (onClick) onClick(ev);
			if (handler) handler({index});
		}
	},

	render: ({children, index, onSelect, ...rest}) => (
		<div {...rest} data-index={index} onClick={onSelect}>
			<div className={css.breadcrumbHeader}>
				{children}
			</div>
		</div>
	)
});

/**
 * Vertical, transparent bar generally laid out horizontally used to navigate to a prior Panel.
 *
 * @class Breadcrumb
 */
const Breadcrumb = Spottable(BreadcrumbBase);

export default Breadcrumb;
export {Breadcrumb, BreadcrumbBase};
