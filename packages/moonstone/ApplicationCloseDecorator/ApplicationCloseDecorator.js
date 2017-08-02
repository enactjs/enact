/**
 * Exports the {@link moonstone/ApplicationCloseDecorator.ApplicationCloseDecorator} Higher-order
 * Component (HOC).
 *
 * @module moonstone/ApplicationCloseDecorator
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
 * @private
 */
const contextTypes = {
	hasCloseButton: PropTypes.bool,
	closeButtonId: PropTypes.string
};

/**
 * Higher-order Component that adds a ApplicationCloseDecorator adjacent to wrapped component.
 *
 * Example:
 * ```
 * const AppWithCloseButton = ApplicationCloseDecorator(App);
 *
 * const handleClose = () => window.close();
 *
 * render(
 *   <AppWithCloseButton onApplicationClose={handleClose} />
 * )
 * ```
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
			 * Unique identifier for ApplicationCloseButton instance.
			 *
			 * @type {String}
			 * @public
			 * @default 'closeButton'
			 */
			closeButtonId: PropTypes.string,

			/**
			 * A function to run when app close button is clicked
			 *
			 * @type {Function}
			 * @public
			 */
			onApplicationClose: PropTypes.func
		}

		static defaultProps = {
			closeButtonId: 'closeButton'
		}

		getChildContext () {
			return {
				closeButtonId: this.props.closeButtonId,
				hasCloseButton: true
			};
		}

		render () {
			const {closeButtonId, onApplicationClose, ...rest} = this.props;
			return (
				<div>
					<Wrapped {...rest} />
					<ApplicationCloseButton id={closeButtonId} onApplicationClose={onApplicationClose} />
				</div>
			);
		}
	};
});

export default ApplicationCloseDecorator;
export {ApplicationCloseDecorator, contextTypes};
