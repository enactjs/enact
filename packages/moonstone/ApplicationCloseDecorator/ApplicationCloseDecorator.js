/*
 * Exports the {@link moonstone/ApplicationCloseDecorator.ApplicationCloseDecorator} Higher-order Component (HOC).
 */

import hoc from '@enact/core/hoc';
import PropTypes from 'prop-types';
import React from 'react';

import ApplicationCloseButton from './ApplicationCloseButton';

/**
 * `contextTypes` is an object that exports the default context validation rules. These must be applied
 * to any child components that wish to receive the ApplicationCloseDecorator context.
 *
 * ```
 * import {contextTypes} from '@enact/moonstone/ApplicationCloseDecorator';
 * ...
 * myComponent.contextTypes = contextTypes;
 * ```
 *
 * @memberof moonstone/ApplicationCloseDecorator
 * @public
 */
const contextTypes = {
	hasCloseButton: PropTypes.bool
};

/**
 * Higher-order Component that adds a ApplicationCloseDecorator adjacent to wrapped component.
 *
 * @class ApplicationCloseDecorator
 * @memberof moonstone/ApplicationCloseDecorator
 * @hoc
 * @public
 */
const ApplicationCloseDecorator = hoc((config, Wrapped) => {
	return class extends React.Component {

		displayName: 'ApplicationCloseDecorator'

		static childContextTypes = contextTypes

		static propTypes = /** @lends moonstone/ApplicationCloseDecorator.ApplicationCloseDecorator.prototype */ {
			/**
			 * A function to run when app close button is clicked
			 *
			 * @type {Function}
			 * @public
			 */
			onApplicationClose: PropTypes.func
		}

		getChildContext () {
			return {
				hasCloseButton: true
			};
		}

		render () {
			const {onApplicationClose, ...rest} = this.props;
			return (
				<div>
					<Wrapped {...rest} />
					<ApplicationCloseButton onApplicationClose={onApplicationClose} />
				</div>
			);
		}
	};
});

export default ApplicationCloseDecorator;
export {ApplicationCloseDecorator, contextTypes};
