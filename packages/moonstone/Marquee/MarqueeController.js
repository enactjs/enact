import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import React from 'react';

const contextTypes = {
	/**
	 * Called by Marquee instances when marqueeing is canceled (e.g. when blurring a Marquee
	 * set to `marqueeOn='focus'`)
	 *
	 * @type {Function}
	 */
	cancel: React.PropTypes.func,

	/**
	 * Called by Marquee instances when marqueeing has completed
	 *
	 * @type {Function}
	 */
	complete: React.PropTypes.func,

	/**
	 * Called to register a Marquee instance to be synchronized
	 *
	 * @type {Function}
	 */
	register: React.PropTypes.func,

	/**
	 * Called by Marquee instances when marqueeing is started (e.g. when focusing a Marquee
	 * set to `marqueeOn='focus'`)
	 *
	 * @type {Function}
	 */
	start: React.PropTypes.func,

	/**
	 * Called to unregister a synchronized Marquee instance
	 *
	 * @type {Function}
	 */
	unregister: React.PropTypes.func
};


/**
 * Default configuration parameters for {@link moonstone/Marquee.MarqueeController}
 *
 * @type {Object}
 * @memberof moonstone/Marquee
 */
const defaultConfig = {
	/**
	 * When `true`, any `onFocus` events that bubble to the controller will start the contained
	 * Marquee instances. This is useful when a component contains Marquee instances that need to be
	 * started with sibling components are focused.
	 *
	 * @type {Boolean}
	 * @default false
	 */
	startOnFocus: false
};

/**
 * {@link moonstone/Marquee.MarqueeController} is a Higher-order Component which will synchronize
 * contained Marquee's.
 *
 * @class MarqueeController
 * @memberof moonstone/Marquee
 * @hoc
 * @public
 */
const MarqueeController = hoc(defaultConfig, (config, Wrapped) => {
	const {startOnFocus} = config;
	const forwardBlur = forward('onBlur');
	const forwardFocus = forward('onFocus');

	return class extends React.Component {
		static displayName = 'MarqueeController'

		static childContextTypes = contextTypes;

		constructor (props) {
			super(props);

			this.controlled = [];
		}

		getChildContext () {
			return {
				cancel: this.handleCancel,
				complete: this.handleComplete,
				register: this.handleRegister,
				start: this.handleStart,
				unregister: this.handleUnregister
			};
		}

		/**
		 * Registers `component` with a set of handlers for `start` and `stop`
		 *
		 * @param	{Object}	component	A component, typically a React component instance, on
		 *									which handlers will be dispatched.
		 * @param	{Object}	handlers	An object containing `start` and `stop` functions
		 *
		 * @returns {undefined}
		 */
		handleRegister = (component, handlers) => {
			this.controlled.push({
				...handlers,
				complete: false,
				component
			});
		}

		/**
		 * Unregisters `component` for synchronization
		 *
		 * @param	{Object}	component	A previously registered component
		 *
		 * @returns	{undefined}
		 */
		handleUnregister = (component) => {
			for (let i = 0; i < this.controlled.length; i++) {
				if (this.controlled[i].component === component) {
					this.controlled.splice(i, 1);
					break;
				}
			}
		}

		/**
		 * Handler for the `start` context function
		 *
		 * @param	{Object}	component	A previously registered component
		 *
		 * @returns	{undefined}
		 */
		handleStart = (component) => {
			this.markIncomplete();
			this.dispatch('start', component);
		}

		/**
		 * Handler for the `cancel` context function
		 *
		 * @param	{Object}	component	A previously registered component
		 *
		 * @returns	{undefined}
		 */
		handleCancel = (component) => {
			this.markIncomplete();
			this.dispatch('stop', component);
		}

		/**
		 * Handler for the `complete` context function
		 *
		 * @param	{Object}	component	A previously registered component
		 *
		 * @returns	{undefined}
		 */
		handleComplete = (component) => {
			const complete = this.markComplete(component);
			if (complete) {
				this.markIncomplete();
				this.dispatch('start');
			}
		}

		/*
		 * Handler for the focus event
		 */
		handleFocus = (ev) => {
			this.dispatch('start');
			forwardFocus(ev, this.props);
		}

		/*
		 * Handler for the blur event
		 */
		handleBlur = (ev) => {
			this.dispatch('stop');
			forwardBlur(ev, this.props);
		}

		/**
		 * Invokes the `action` handler for each synchronized component except the invoking
		 * `component`.
		 *
		 * @param	{String}	action		`'start'` or `'stop'`
		 * @param	{Object}	component	A previously registered component
		 *
		 * @returns	{undefined}
		 */
		dispatch (action, component) {
			this.controlled.forEach((controlled) => {
				const {component: controlledComponent, [action]: handler} = controlled;
				if (component !== controlledComponent && typeof handler === 'function') {
					handler.call(controlledComponent);
				}
			});
		}

		/**
		 * Marks all components incomplete
		 *
		 * @returns	{undefined}
		 */
		markIncomplete () {
			this.controlled.forEach(c => {
				c.complete = false;
			});
		}

		/**
		 * Marks `component` complete
		 *
		 * @param	{Object}	component	A previously registered component
		 *
		 * @returns	{Boolean}				`true` if all components are complete
		 */
		markComplete (component) {
			let complete = true;
			this.controlled.forEach(c => {
				if (c.component === component) {
					c.complete = true;
				}

				complete = complete && c.complete;
			});

			return complete;
		}

		render () {
			let props = this.props;

			if (startOnFocus) {
				props = {
					...this.props,
					onBlur: this.handleBlur,
					onFocus: this.handleFocus
				};
			}

			return (
				<Wrapped {...props} />
			);
		}
	};

});

export default MarqueeController;
export {
	contextTypes,
	MarqueeController
};
