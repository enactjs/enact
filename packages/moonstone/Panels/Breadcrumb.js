import kind from '@enact/core/kind';
import Spottable from '@enact/spotlight/Spottable';
import React from 'react';
import PropTypes from 'prop-types';

import $L from '../internal/$L';
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
 * Vertical, transparent bar used to navigate to a prior Panel.
 * [`ActivityPanels`]{@link moonstone/Panels.ActivityPanels} has one breadcrumb, and
 * [`AlwaysViewingPanels`]{@link moonstone/Panels.AlwaysViewingPanels} can have multiple stacked
 * horizontally.
 *
 * @class Breadcrumb
 * @memberof moonstone/Panels
 * @ui
 * @public
 */
const BreadcrumbBase = kind({
	name: 'Breadcrumb',

	propTypes: /** @lends moonstone/Panels.Breadcrumb.prototype */ {
		/**
		 * Index of the associated panel.
		 *
		 * @type {Number}
		 * @required
		 */
		index: PropTypes.number.isRequired,

		/**
		 * Called when the breadcrumb is clicked
		 *
		 * @type {Function}
		 */
		onClick: PropTypes.func,

		/**
		 * Called when the breadcrumb is clicked
		 *
		 * @type {Function}
		 */
		onSelect: PropTypes.func
	},

	styles: {
		css,
		className: 'breadcrumb'
	},

	handlers: {
		onSelect: (ev, {index, onSelect, onClick}) => {
			// clear Spotlight focus
			ev.target.blur();

			if (onClick) onClick(ev);
			if (onSelect) onSelect({index});
		}
	},

	render: ({children, index, onSelect, ...rest}) => (
		<SpottableDiv
			{...rest}
			aria-label={$L('GO TO PREVIOUS')}
			data-index={index}
			onClick={onSelect}
		>
			<div className={css.breadcrumbHeader}>
				{children}
			</div>
		</SpottableDiv>
	)
});

export default BreadcrumbBase;
export {BreadcrumbBase as Breadcrumb, BreadcrumbBase};
