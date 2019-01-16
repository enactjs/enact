/**
 * A higher-order component that manages activation of components.
 *
 * @module ui/RadioDecorator
 * @exports RadioDecorator
 * @exports RadioControllerDecorator
 */

import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import React from 'react';

import {contextTypes, RadioControllerDecorator} from './RadioControllerDecorator';

/**
 * Default config for `RadioDecorator`.
 *
 * @memberof ui/RadioDecorator.RadioDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * The event indicating the wrapped component is activated
	 *
	 * @type {String}
	 * @default null
	 * @memberof ui/RadioDecorator.RadioDecorator.defaultConfig
	 */
	activate: null,

	/**
	 * The event indicating the wrapped component is deactivated
	 *
	 * @type {String}
	 * @default null
	 * @memberof ui/RadioDecorator.RadioDecorator.defaultConfig
	 */
	deactivate: null,

	/**
	 * The name of a boolean prop that activates the wrapped component when it is true.
	 *
	 * @type {String}
	 * @default 'active'
	 * @memberof ui/RadioDecorator.RadioDecorator.defaultConfig
	 */
	prop: 'active'
};

/**
 * A higher-order component (HOC) that allows another component to have a mutually exclusive
 * relationship with other descendants of the same {@link ui/RadioDecorator.RadioControllerDecorator}.
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
	const {activate, deactivate, prop} = config;
	const forwardActivate = forward(activate);
	const forwardDeactivate = forward(deactivate);

	return class extends React.Component {
		static displayName = 'RadioDecorator'

		static contextTypes = contextTypes

		constructor (props) {
			super(props);

			// indicates we have a controller in context with which to sync activations
			this.sync = false;
		}

		componentDidMount () {
			if (this.context.registerRadioItem) {
				this.sync = true;
				this.context.registerRadioItem(this);

				this.notifyController(this.props);
			}
		}

		UNSAFE_componentWillReceiveProps (nextProps) {
			this.notifyController(nextProps);
		}

		componentWillUnmount () {
			if (this.sync) {
				this.sync = false;
				this.context.deregisterRadioItem(this);
			}
		}

		notifyController (props) {
			if (this.sync && prop && props[prop]) {
				this.context.activateRadioItem(this);
			}
		}

		/*
		 * Invoked by a `RadioControllerDecorator` when the wrapped component should be deactivated
		 *
		 * @returns {undefined}
		 */
		deactivate = () => {
			if (this.props[prop]) {
				forwardDeactivate(null, this.props);
			}
		}

		handleActivate = () => {
			if (this.sync) {
				this.context.activateRadioItem(this);
			}

			forwardActivate(null, this.props);
		}

		handleDeactivate = () => {
			if (this.sync) {
				this.context.deactivateRadioItem(this);
			}

			forwardDeactivate(null, this.props);
		}

		render () {
			let props = this.props;

			if (activate || deactivate) {
				props = Object.assign({}, this.props);
				if (activate) props[activate] = this.handleActivate;
				if (deactivate) props[deactivate] = this.handleDeactivate;
			}

			return <Wrapped {...props} />;
		}
	};
});

export default RadioDecorator;
export {
	RadioControllerDecorator,
	RadioDecorator
};
