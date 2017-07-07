import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import {shape} from '@enact/ui/ViewManager';
import Toggleable from '@enact/ui/Toggleable';

import Skinnable from '../Skinnable';

import ApplicationCloseButton from './ApplicationCloseButton';
import CancelDecorator from './CancelDecorator';
import IdProvider from './IdProvider';
import Viewport from './Viewport';

import css from './Panels.less';

/**
 * Basic Panels component without breadcrumbs or default arranger
 *
 * @class Panels
 * @memberof moonstone/Panels
 * @ui
 * @public
 */
const PanelsBase = kind({
	name: 'Panels',

	propTypes: /** @lends moonstone/Panels.Panels.prototype */ {
		/**
		 * Function that generates unique identifiers for Panel instances
		 *
		 * @type {Function}
		 * @required
		 * @private
		 */
		generateId: PropTypes.func.isRequired,

		/**
		 * Set of functions that control how the panels are transitioned into and out of the
		 * viewport
		 *
		 * @type {Arranger}
		 * @public
		 */
		arranger: shape,

		/**
		 * An object containing properties to be passed to each child. `aria-owns` will be added or
		 * updated to this object to add the close button to the accessibility tree of each panel.
		 *
		 * @type {Object}
		 * @public
		 */
		childProps: PropTypes.object,

		/**
		 * Panels to be rendered
		 *
		 * @type {Panel}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Unique identifier for the Panels instance
		 *
		 * @type {String}
		 * @public
		 */
		id: PropTypes.string,

		/**
		 * Index of the active panel
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		index: PropTypes.number,

		/**
		 * When `false`, panel transitions are disabled
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAnimation: PropTypes.bool,

		/**
		 * When `true`, application close button does not show on the top right corner
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noCloseButton: PropTypes.bool,

		/**
		 * A function to run when app close button is clicked
		 *
		 * @type {Function}
		 * @public
		 */
		onApplicationClose: PropTypes.func,

		/**
		 * Callback to handle cancel/back key events
		 *
		 * @type {Function}
		 * @public
		 */
		onBack: PropTypes.func
	},

	defaultProps: {
		index: 0,
		noAnimation: false,
		noCloseButton: false
	},

	styles: {
		css,
		className: 'panels enact-fit'
	},

	computed: {
		className: ({noCloseButton, styler}) => styler.append({
			hasCloseButton: !noCloseButton
		}),
		applicationCloseButton: ({id, index, noCloseButton, onApplicationClose, transitioning}) => {
			if (!noCloseButton && !transitioning) {
				const closeId = id ? `${id}_close` : null;
				return (
					<ApplicationCloseButton id={closeId} onApplicationClose={onApplicationClose} data-index={index} />
				);
			}
		},
		childProps: ({childProps, id, noCloseButton}) => {
			if (noCloseButton || !id) {
				return childProps;
			}

			const updatedChildProps = Object.assign({}, childProps);
			const closeId = `${id}_close`;
			const owns = updatedChildProps['aria-owns'];

			if (owns) {
				updatedChildProps['aria-owns'] = `${owns} ${closeId}`;
			} else {
				updatedChildProps['aria-owns'] = closeId;
			}

			return updatedChildProps;
		}
	},

	render: ({noAnimation, arranger, childProps, children, generateId, index, applicationCloseButton, onTransition, onWillTransition, ...rest}) => {
		delete rest.noCloseButton;
		delete rest.onApplicationClose;
		delete rest.onBack;
		delete rest.transitioning;

		return (
			<div {...rest}>
				{applicationCloseButton}
				<Viewport
					arranger={arranger}
					childProps={childProps}
					generateId={generateId}
					index={index}
					noAnimation={noAnimation}
					onTransition={onTransition}
					onWillTransition={onWillTransition}
				>
					{children}
				</Viewport>
			</div>
		);
	}
});

const Panels = CancelDecorator(
	{cancel: 'onBack'},
	Toggleable(
		{activate: 'onWillTransition', deactivate: 'onTransition', prop: 'transitioning', toggle: null},
		IdProvider(
			Skinnable(
				PanelsBase
			)
		)
	)
);

export default Panels;
export {Panels, PanelsBase};
