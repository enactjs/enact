import $L from '@enact/i18n/$L';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

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
		 * A function to run when app close button is clicked
		 *
		 * @type {Function}
		 */
		onApplicationClose: PropTypes.func
	},

	styles: {
		css,
		className: 'applicationCloseButton'
	},

	render: ({onApplicationClose, ...rest}) => {
		return (
			<IconButton
				{...rest}
				aria-label={$L('Exit app')}
				small
				backgroundOpacity="transparent"
				onClick={onApplicationClose}
				id="app_close_button"
			>
				closex
			</IconButton>
		);
	}
});

export default ApplicationCloseButton;
