import kind from '@enact/core/kind';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import ForwardRef from '@enact/ui/ForwardRef';
import PropTypes from 'prop-types';
import React from 'react';

import ApplicationCloseButton from './ApplicationCloseButton';

import css from './Panels.module.less';

const ControlsBase = kind({
	name: 'Controls',

	propTypes: {
		/**
		 * Sets the hint string read when focusing the application close button.
		 *
		 * @type {String}
		 * @default 'Exit app'
		 * @public
		 */
		closeButtonAriaLabel: PropTypes.string,

		/**
		 * The background opacity of the application close button.
		 *
		 * * Values: `'translucent'`, `'lightTranslucent'`, `'transparent'`
		 *
		 * @type {String}
		 * @default 'transparent'
		 * @public
		 */
		closeButtonBackgroundOpacity: PropTypes.oneOf(['translucent', 'lightTranslucent', 'transparent']),

		forwardRef: PropTypes.func,

		/**
		 * Unique identifier for the Panels instance.
		 *
		 * When defined, `Panels` will manage the presentation state of `Panel` instances in order
		 * to restore it when returning to the `Panel`. See
		 * [noSharedState]{@link moonstone/Panels.Panels.noSharedState} for more details on shared
		 * state.
		 *
		 * @type {String}
		 * @public
		 */
		id: PropTypes.string,

		/**
		 * Indicates the close button will not be rendered on the top right corner.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noCloseButton: PropTypes.bool,

		/**
		 * Called when the app close button is clicked.
		 *
		 * @type {Function}
		 * @public
		 */
		onApplicationClose: PropTypes.func
	},

	styles: {
		css,
		className: 'controls'
	},

	computed: {
		closeButton: ({closeButtonAriaLabel, closeButtonBackgroundOpacity, id, noCloseButton, onApplicationClose}) => {
			if (noCloseButton) return null;

			const closeId = id ? `${id}-close` : null;

			return (
				<ApplicationCloseButton
					aria-label={closeButtonAriaLabel}
					backgroundOpacity={closeButtonBackgroundOpacity}
					className={css.close}
					id={closeId}
					onApplicationClose={onApplicationClose}
				/>
			);
		}
	},

	render: ({children, closeButton, forwardRef, ...rest}) => {
		if (!children && !closeButton) return null;

		delete rest.closeButtonAriaLabel;
		delete rest.closeButtonBackgroundOpacity;
		delete rest.noCloseButton;
		delete rest.onApplicationClose;

		return (
			<div {...rest} ref={forwardRef}>
				{children}
				{closeButton}
			</div>
		);
	}
});

const Controls = ForwardRef(SpotlightContainerDecorator(ControlsBase));

export default Controls;
export {
	Controls,
	ControlsBase
};
