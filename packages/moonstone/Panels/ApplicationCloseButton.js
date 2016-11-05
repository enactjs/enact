import kind from '@enact/core/kind';
import React from 'react';

import IconButton from '../IconButton';

import css from './ApplicationCloseButton.less';

/**
 * An {@link moonstone/IconButton.IconButton} with `closex` icon. It is used in
 * {@link moonstone/Panels.Panels} positioned at the top right corner.
 * `onApplicationClose` callback function should be specified to close your app. The recommended
 * action to take with the event is `window.close()`, but you may also want to also do operations
 * like save user work or close database connections.
 *
 * @class ApplicationCloseButton
 * @private
 */
const ApplicationCloseButton = kind({
	propTypes: /** @lends ApplicationCloseButton.prototype */ {
		/**
		 * A function to run when app close button is clicked
		 *
		 * @type {Function}
		 */
		onApplicationClose: React.PropTypes.func
	},

	styles: {
		css,
		className: 'applicationCloseButton'
	},

	render: ({onApplicationClose, ...rest}) => {
		return (
			<IconButton
				{...rest}
				small
				backgroundOpacity="transparent"
				onClick={onApplicationClose}
			>
				closex
			</IconButton>
		);
	}
});

export default ApplicationCloseButton;
