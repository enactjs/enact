import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import $L from '../internal/$L';
import IconButton from '../IconButton';

import css from './ApplicationCloseButton.less';

/**
 * An {@link moonstone/ApplicationCloseButton.ApplicationCloseButton} with `closex` icon. It is used in
 * {@link moonstone/Panels.Panels} positioned at the top right corner.
 * `onApplicationClose` callback function should be specified to close your app. The recommended
 * action to take with the event is `window.close()`, but you may also want to also do operations
 * like save user work or close database connections.
 *
 * @class ApplicationCloseButton
 * @memberof moonstone/Panels
 * @private
 */
const ApplicationCloseButton = kind({
	name: 'ApplicationCloseButton',

	propTypes: /** @lends moonstone/Panels.ApplicationCloseButton.prototype */ {
		/**
		 * The background-color opacity of this button; valid values are `'opaque'`, `'translucent'`,
		 * `'lightTranslucent'` and `'transparent'`.
		 *
		 * @type {String}
		 * @default 'transparent'
		 * @public
		 */
		backgroundOpacity: PropTypes.oneOf(['opaque', 'translucent', 'lightTranslucent', 'transparent']),

		/**
		 * A function to run when app close button is clicked
		 *
		 * @type {Function}
		 */
		onApplicationClose: PropTypes.func
	},

	defaultProps: {
		backgroundOpacity: 'transparent'
	},

	styles: {
		css,
		className: 'applicationCloseButton'
	},

	render: ({backgroundOpacity, onApplicationClose, ...rest}) => {
		return (
			<IconButton
				{...rest}
				aria-label={$L('Exit app')}
				backgroundOpacity={backgroundOpacity}
				onTap={onApplicationClose}
				small
			>
				closex
			</IconButton>
		);
	}
});

export default ApplicationCloseButton;
