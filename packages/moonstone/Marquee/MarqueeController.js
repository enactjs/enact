import hoc from '@enact/core/hoc';
import React from 'react';

/**
 * Context propTypes for MarqueeController
 *
 * @memberof moonstone/Marquee.Marquee
 * @private
 */
const contextTypes = {
	/**
	 * Called by Marquee instances when marqueeing is canceled (e.g. when blurring a Marquee
	 * set to `marqueeOn='focus'`)
	 *
	 * @type {Function}
	 * @memberof moonstone/Marquee.Marquee.contextTypes
	 */
	cancel: React.PropTypes.func,

	/**
	 * Called by Marquee instances when marqueeing has completed
	 *
	 * @type {Function}
	 * @memberof moonstone/Marquee.Marquee.contextTypes
	 */
	complete: React.PropTypes.func,

	/**
	 * Called to register a Marquee instance to be synchronized
	 *
	 * @type {Function}
	 * @memberof moonstone/Marquee.Marquee.contextTypes
	 */
	register: React.PropTypes.func,

	/**
	 * Called by Marquee instances when marqueeing is started (e.g. when focusing a Marquee
	 * set to `marqueeOn='focus'`)
	 *
	 * @type {Function}
	 * @memberof moonstone/Marquee.Marquee.contextTypes
	 */
	start: React.PropTypes.func,

	/**
	 * Called to unregister a synchronized Marquee instance
	 *
	 * @type {Function}
	 * @memberof moonstone/Marquee.Marquee.contextTypes
	 */
	unregister: React.PropTypes.func
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
const MarqueeController = hoc((config, Wrapped) => {

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
			return (
				<Wrapped {...this.props} />
			);
		}
	};

});

export default MarqueeController;
export {
	contextTypes,
	MarqueeController
};
