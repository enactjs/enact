import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import $L from '../internal/$L';
import IconButton from '../IconButton';

import css from './ApplicationCloseButton.less';

/**
 * An {@link moonstone/ApplicationCloseDecorator.ApplicationCloseButton} with `closex` icon. It is
 * positioned at the top right corner.
 * `onApplicationClose` callback function should be specified to close your app. The recommended
 * action to take with the event is `window.close()`, but you may also want to also do operations
 * like save user work or close database connections.
 *
 * @class ApplicationCloseButton
 * @memberof moonstone/ApplicationCloseDecorator
 * @private
 */
const ApplicationCloseButton = kind({
	name: 'ApplicationCloseButton',

	propTypes: /** @lends moonstone/ApplicationCloseDecorator.ApplicationCloseButton.prototype */ {
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
			>
				closex
			</IconButton>
		);
	}
});

export default ApplicationCloseButton;
