/**
 * Exports the {@link ui/RadioDecorator.RadioDecorator} and
 * {@link ui/RadioDecorator.RadioContainerDecorator} Higher-order Components (HOCs).
 *
 * @module ui/RadioDecorator
 */

import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import React from 'react';

import {contextTypes, RadioContainerDecorator} from './RadioContainerDecorator';

/**
 * Default config for {@link ui/RadioDecorator.RadioDecorator}.
 *
 * @memberof ui/RadioDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * The event indicating the wrapped component is activated
	 *
	 * @type {String}
	 */
	activate: 'onOpen',

	/**
	 * The event indicating the wrapped component is deactivated
	 *
	 * @type {String}
	 */
	deactivate: 'onClose'
};

/**
 * {@link ui/RadioDecorator.RadioDecorator} is a Higher-order Component that allows another
 * component to have a mutually exclusive relationship with other descendants of the same
 * {@link ui/RadioDecorator.RadioContainerDecorator}.
 *
 * When the `activate` event for the wrapped component is called, the component is activated and the
 * previously activated component, if any, is deactivated by invoking the `deactivate` event.
 *
 * @class RadioDecorator
 * @memberof ui/RadioDecorator
 * @hoc
 * @public
 */
const RadioDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {activate, deactivate} = config;
	const forwardActivate = forward(activate);
	const forwardDeactivate = forward(deactivate);

	return class extends React.Component {
		static displayName = 'RadioDecorator'

		static contextTypes = contextTypes

		componentDidMount () {
			if (this.context.registerRadioItem) {
				this.context.registerRadioItem(this);
			}
		}

		componentWillUnount () {
			if (this.context.unregisterRadioItem) {
				this.context.unregisterRadioItem(this);
			}
		}

		/**
		 * Invoked by a RadioContainerDecorator when the wrapped component should be deactivated
		 *
		 * @returns {undefined}
		 */
		deactivate = () => {
			forwardDeactivate(null, this.props);
		}

		handleActivate = () => {
			if (this.context.activateRadioItem) {
				this.context.activateRadioItem(this);
			}

			forwardActivate(null, this.props);
		}

		handleDeactivate = () => {
			if (this.context.deactivateRadioItem) {
				this.context.deactivateRadioItem(this);
			}

			forwardDeactivate(null, this.props);
		}

		render () {
			const props = {
				...this.props,
				[activate]: this.handleActivate,
				[deactivate]: this.handleDeactivate
			};

			return <Wrapped  {...props} />;
		}
	};
});

export default RadioDecorator;
export {
	RadioContainerDecorator,
	RadioDecorator
};

