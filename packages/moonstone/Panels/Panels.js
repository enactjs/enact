/**
 * Exports the {@link module:@enact/moonstone/Panels~Panels} and {@link module:@enact/moonstone/Panels~PanelBase}
 * components. The default export is {@link module:@enact/moonstone/Panels~PanelsBase}.
 *
 * @module @enact/moonstone/Panels
 */

import kind from '@enact/core/kind';
import {shape} from '@enact/ui/ViewManager';
import React from 'react';

import ApplicationCloseButton from './ApplicationCloseButton';
import Viewport from './Viewport';

import css from './Panels.less';

/**
 * Basic Panels component without breadcrumbs or default arranger
 *
 * @class Panels
 */
const PanelsBase = kind({
	name: 'Panels',

	propTypes: {
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
		 * Disable panel transitions
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
		onApplicationClose: React.PropTypes.func
	},

	defaultProps: {
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
		applicationCloseButton: ({noCloseButton, onApplicationClose}) => {
			if (!noCloseButton) {
				return (
					<ApplicationCloseButton onApplicationClose={onApplicationClose} />
				);
			}
		}
	},

	render: ({noAnimation, arranger, children, index, applicationCloseButton, ...rest}) => {
		delete rest.noCloseButton;
		delete rest.onApplicationClose;
		return (
			<div {...rest}>
				{applicationCloseButton}
				<Viewport noAnimation={noAnimation} arranger={arranger} index={index}>
					{children}
				</Viewport>
			</div>
		);
	}
});

export default PanelsBase;
export {PanelsBase as Panels, PanelsBase};
