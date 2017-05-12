import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import {shape} from '@enact/ui/ViewManager';

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
 */
const PanelsBase = kind({
	name: 'Panels',

	propTypes: /** @lends moonstone/Panels.Panels.prototype */ {
		/**
		 * Set of functions that control how the panels are transitioned into and out of the
		 * viewport
		 *
		 * @type {Arranger}
		 */
		arranger: shape,

		/**
		 * Panels to be rendered
		 *
		 * @type {Panel}
		 */
		children: PropTypes.node,

		generateId: PropTypes.func,

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
		 */
		index: PropTypes.number,

		/**
		 * When `false`, panel transitions are disabled
		 *
		 * @type {Boolean}
		 * @default false
		 */
		noAnimation: PropTypes.bool,

		/**
		 * When `true`, application close button does not show on the top right corner
		 *
		 * @type {Boolean}
		 * @default false
		 */
		noCloseButton: PropTypes.bool,

		/**
		 * A function to run when app close button is clicked
		 * @type {Function}
		 */
		onApplicationClose: PropTypes.func,

		/**
		 * Callback to handle cancel/back key events
		 *
		 * @type {Function}
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
		applicationCloseButton: ({id, noCloseButton, onApplicationClose}) => {
			if (!noCloseButton) {
				const closeId = id ? `${id}_close` : null;

				return (
					<ApplicationCloseButton id={closeId} onApplicationClose={onApplicationClose} />
				);
			}
		},
		viewProps: ({id, noCloseButton, viewProps}) => {
			if (noCloseButton || !id) {
				return viewProps;
			} else {
				const updatedViewProps = Object.assign({}, viewProps);
				const owns = viewProps['aria-owns'];

				updatedViewProps['aria-owns'] = `${owns || ''} ${id}_close`;
				return updatedViewProps;
			}
		}
	},

	render: ({noAnimation, arranger, children, generateId, index, applicationCloseButton, viewProps, ...rest}) => {
		delete rest.noCloseButton;
		delete rest.onApplicationClose;
		delete rest.onBack;

		return (
			<div {...rest}>
				{applicationCloseButton}
				<Viewport
					arranger={arranger}
					generateId={generateId}
					index={index}
					noAnimation={noAnimation}
					viewProps={viewProps}
				>
					{children}
				</Viewport>
			</div>
		);
	}
});

const Panels = CancelDecorator(
	{cancel: 'onBack'},
	IdProvider(
		PanelsBase
	)
);

export default Panels;
export {Panels, PanelsBase};
