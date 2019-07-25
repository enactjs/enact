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
		 * Additional controls displayed before the close button.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Sets the hint string read when focusing the application close button.
		 *
		 * @type {String}
		 * @public
		 */
		closeButtonAriaLabel: PropTypes.string,

		/**
		 * The background opacity of the application close button.
		 *
		 * * Values: `'translucent'`, `'lightTranslucent'`, `'transparent'`
		 *
		 * @type {String}
		 * @public
		 */
		closeButtonBackgroundOpacity: PropTypes.oneOf(['translucent', 'lightTranslucent', 'transparent']),

		/**
		 * Called with a reference to the root DOM node of this component.
		 *
		 * @type {Function}
		 * @public
		 */
		forwardRef: PropTypes.func,

		/**
		 * Indicates the close button will not be rendered on the top right corner.
		 *
		 * @type {Boolean}
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

	render: ({children, closeButtonAriaLabel, closeButtonBackgroundOpacity, forwardRef, noCloseButton, onApplicationClose, ...rest}) => {
		if (!children && noCloseButton) return null;

		return (
			<div {...rest} ref={forwardRef}>
				{children}
				{noCloseButton ? null : (
					<ApplicationCloseButton
						aria-label={closeButtonAriaLabel}
						backgroundOpacity={closeButtonBackgroundOpacity}
						className={css.close}
						onApplicationClose={onApplicationClose}
					/>
				)}
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
