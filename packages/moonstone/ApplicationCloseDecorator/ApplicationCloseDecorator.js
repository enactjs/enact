/*
 * Exports the {@link ui/ApplicationCloseDecorator.ApplicationCloseDecorator} Higher-order Component (HOC).
 */

import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import ApplicationCloseButton from './ApplicationCloseButton';

/**
 * Higher-order Component that adds a ApplicationCloseDecorator adjacent to wrapped component.
 *
 * @class ApplicationCloseDecorator
 * @memberof ui/ApplicationCloseDecorator
 * @hoc
 * @public
 */
const ApplicationCloseDecorator = hoc((config, Wrapped) => {

	return kind({
		name: 'ApplicationCloseDecorator',

		propTypes: {
			/**
			 * A function to run when app close button is clicked
			 *
			 * @type {Function}
			 * @public
			 */
			onApplicationClose: PropTypes.func
		},

		render: ({onApplicationClose, ...rest}) => {
			return (
				<div>
					<Wrapped {...rest} />
					<ApplicationCloseButton onApplicationClose={onApplicationClose} />
				</div>
			);
		}
	});
});

export default ApplicationCloseDecorator;
