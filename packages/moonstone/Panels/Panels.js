import kind from '@enact/core/kind';
import React from 'react';
import {shape} from '@enact/ui/ViewManager';
import Toggleable from '@enact/ui/Toggleable';

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
		children: React.PropTypes.node,

		/**
		 * Index of the active panel
		 *
		 * @type {Number}
		 * @default 0
		 */
		index: React.PropTypes.number,

		/**
		 * When `false`, panel transitions are disabled
		 *
		 * @type {Boolean}
		 * @default false
		 */
		noAnimation: React.PropTypes.bool,

		/**
		 * When `true`, application close button does not show on the top right corner
		 *
		 * @type {Boolean}
		 * @default false
		 */
		noCloseButton: React.PropTypes.bool,

		/**
		 * A function to run when app close button is clicked
		 * @type {Function}
		 */
		onApplicationClose: React.PropTypes.func,

		/**
		 * Callback to handle cancel/back key events
		 *
		 * @type {Function}
		 */
		onBack: React.PropTypes.func
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
		applicationCloseButton: ({index, noCloseButton, onApplicationClose, transitioning}) => {
			if (!noCloseButton && !transitioning) {
				return (
					<ApplicationCloseButton onApplicationClose={onApplicationClose} data-index={index} />
				);
			}
		}
	},

	render: ({noAnimation, arranger, children, index, applicationCloseButton, onTransition, onWillTransition, ...rest}) => {
		delete rest.noCloseButton;
		delete rest.onApplicationClose;
		delete rest.onBack;
		delete rest.transitioning;

		return (
			<div {...rest}>
				{applicationCloseButton}
				<Viewport noAnimation={noAnimation} arranger={arranger} index={index} onTransition={onTransition} onWillTransition={onWillTransition}>
					{children}
				</Viewport>
			</div>
		);
	}
});

const Panels = CancelDecorator({cancel: 'onBack'},
	Toggleable(
		{activate: 'onWillTransition', deactivate: 'onTransition', prop: 'transitioning', toggle: null},
		PanelsBase
	)
);

export default Panels;
export {Panels, PanelsBase};
