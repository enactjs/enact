import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import withState from 'recompose/withState';
import {shape} from '@enact/ui/ViewManager';

import ApplicationCloseButton from './ApplicationCloseButton';
import CancelDecorator from './CancelDecorator';
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
		onBack: PropTypes.func,

		/**
		 * Function to set transitioning prop value.
		 *
		 * @type {Function}
		 */
		setTransition: PropTypes.func,

		/**
		 * Boolean that reflects if Panels are currently in transition
		 *
		 * @type {Boolean}
		 */
		transitioning: PropTypes.bool
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
		className: ({noCloseButton, transitioning, styler}) => styler.append({
			hasCloseButton: !noCloseButton,
			transitioning
		}),
		applicationCloseButton: ({noCloseButton, onApplicationClose}) => {
			if (!noCloseButton) {
				return (
					<ApplicationCloseButton onApplicationClose={onApplicationClose} />
				);
			}
		},
		onLeave: ({setTransition}) => () => setTransition(false),
		onWillTransition: ({setTransition}) => () => setTransition(true)
	},

	render: ({noAnimation, arranger, children, index, applicationCloseButton, onWillTransition, onLeave, ...rest}) => {
		delete rest.noCloseButton;
		delete rest.onApplicationClose;
		delete rest.onBack;
		delete rest.transitioning;
		delete rest.setTransition;

		return (
			<div {...rest}>
				{applicationCloseButton}
				<Viewport
					noAnimation={noAnimation}
					arranger={arranger}
					index={index}
					onWillTransition={onWillTransition}
					onLeave={onLeave}
				>
					{children}
				</Viewport>
			</div>
		);
	}
});

const ScrimPanels = withState('transitioning', 'setTransition', false)(PanelsBase);

const Panels = CancelDecorator({cancel: 'onBack'}, ScrimPanels);

export default Panels;
export {Panels, ScrimPanels as PanelsBase};
