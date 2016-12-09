/**
 * Exports the {@link moonstone/Panels.Panels} and {@link moonstone/Panels.PanelBase}
 * components. The default export is {@link moonstone/Panels.PanelsBase}.
 *
 * @module @enact/moonstone/Panels
 */

import kind from '@enact/core/kind';
import React from 'react';
import {shape} from '@enact/ui/ViewManager';

import ApplicationCloseButton from './ApplicationCloseButton';
import FocusManager from './FocusManager';
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
		 * When `true`, panels will not be wrapped with a focus manager component
		 *
		 * @type {Boolean}
		 * @default false
		 */
		noFocusManager: React.PropTypes.bool,

		/**
		 * A function to run when app close button is clicked
		 * @type {Function}
		 */
		onApplicationClose: React.PropTypes.func
	},

	defaultProps: {
		noCloseButton: false,
		noFocusManager: false
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
		},
		wrapperComponent: (noFocusManager) => {
			return noFocusManager ? FocusManager : 'div';
		}
	},

	render: ({noAnimation, arranger, children, index, applicationCloseButton, noFocusManager, wrapperComponent: Component, ...rest}) => {
		delete rest.noCloseButton;
		delete rest.onApplicationClose;

		if (!noFocusManager) {
			rest.index = index;
		}

		return (
			<Component {...rest}>
				{applicationCloseButton}
				<Viewport noAnimation={noAnimation} arranger={arranger} index={index}>
					{children}
				</Viewport>
			</Component>
		);
	}
});

export default PanelsBase;
export {PanelsBase as Panels, PanelsBase};
