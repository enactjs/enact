import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {Job} from '@enact/core/util';
import React from 'react';
import PropTypes from 'prop-types';
import {is} from '@enact/core/keymap';
import {platform} from '@enact/core/platform';

const STATE = {
	inactive: 0,	// Marquee is not necessary (render or focus not happened)
	active: 1,		// Marquee in progress, awaiting complete
	ready: 2		// Marquee completed or not needed, but state is active
};

/**
 * Context propTypes for MarqueeController
 *
 * @memberof ui/Marquee.MarqueeController
 * @private
 */
const contextTypes = {
	/**
	 * Called by Marquee instances when marqueeing is canceled (e.g. when blurring a Marquee
	 * set to `marqueeOn='focus'`)
	 *
	 * @type {Function}
	 * @memberof ui/Marquee.MarqueeController.contextTypes
	 */
	cancel: PropTypes.func,

	/**
	 * Called by Marquee instances when marqueeing has completed
	 *
	 * @type {Function}
	 * @memberof ui/Marquee.MarqueeController.contextTypes
	 */
	complete: PropTypes.func,

	/**
	 * Called by Marquee instances when hovered
	 *
	 * @type {Function}
	 * @memberof ui/Marquee.MarqueeController.contextTypes
	 */
	enter: PropTypes.func,

	/**
	 * Called by Marquee instances when unhovered
	 *
	 * @type {Function}
	 * @memberof ui/Marquee.MarqueeController.contextTypes
	 */
	leave: PropTypes.func,

	/**
	 * Called to register a Marquee instance to be synchronized
	 *
	 * @type {Function}
	 * @memberof ui/Marquee.MarqueeController.contextTypes
	 */
	register: PropTypes.func,

	/**
	 * Called by Marquee instances when marqueeing is started (e.g. when focusing a Marquee
	 * set to `marqueeOn='focus'`). If the Marquee instance should not or does not need to marquee,
	 * the function can return `true` to mark itself complete.
	 *
	 * @type {Function}
	 * @memberof ui/Marquee.MarqueeController.contextTypes
	 */
	start: PropTypes.func,

	/**
	 * Called to unregister a synchronized Marquee instance
	 *
	 * @type {Function}
	 * @memberof ui/Marquee.MarqueeController.contextTypes
	 */
	unregister: PropTypes.func
};


/**
 * Default configuration parameters for {@link ui/Marquee.MarqueeController}
 *
 * @type {Object}
 * @memberof ui/Marquee.MarqueeController
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * When `true`, any `onFocus` events that bubble to the controller will start the contained
	 * Marquee instances. This is useful when a component contains Marquee instances that need to be
	 * started with sibling components are focused.
	 *
	 * @type {Boolean}
	 * @default false
	 * @memberof ui/Marquee.MarqueeController.defaultConfig
	 */
	marqueeOnFocus: false
};

/**
 * {@link ui/Marquee.MarqueeController} is a Higher-order Component which will synchronize
 * contained Marquee's.
 *
 * @memberof ui/Marquee
 * @hoc
 * @public
 */
const MarqueeController = hoc(defaultConfig, (config, Wrapped) => {
	const {marqueeOnFocus} = config;
	const forwardBlur = forward('onBlur');
	const forwardFocus = forward('onFocus');

	return class extends React.Component {
		static displayName = 'MarqueeController'

		static childContextTypes = contextTypes;

		constructor (props) {
			super(props);

			this.controlled = [];
			this.isFocused = false;
		}

		getChildContext () {
			return {
				cancel: this.handleCancel,
				complete: this.handleComplete,
				enter: this.handleEnter,
				leave: this.handleLeave,
				register: this.handleRegister,
				start: this.handleStart,
				unregister: this.handleUnregister
			};
		}

		componentDidMount () {
			if (platform.webos) {
				document.addEventListener('keydown', this.checkPointerHide);
			}
		}

		componentWillUnmount () {
			this.cancelJob.stop();
			if (platform.webos) {
				document.removeEventListener('keydown', this.checkPointerHide);
			}
		}

		checkPointerHide = ({keyCode}) => {
			if (is('pointerHide', keyCode)) {
				this.isHovered = false;
			}
		}

		cancelJob = new Job(() => this.doCancel(), 30)

		/*
		 * Registers `component` with a set of handlers for `start` and `stop`.
		 *
		 * @param	{Object}	component	A component, typically a React component instance, on
		 *									which handlers will be dispatched.
		 * @param	{Object}	handlers	An object containing `start` and `stop` functions
		 *
		 * @returns {undefined}
		 */
		handleRegister = (component, handlers) => {
			const needsStart = !this.allInactive() || this.isFocused;

			this.controlled.push({
				...handlers,
				state: STATE.inactive,
				component
			});

			if (needsStart) {
				this.dispatch('start');
			}
		}

		/*
		 * Unregisters `component` for synchronization
		 *
		 * @param	{Object}	component	A previously registered component
		 *
		 * @returns	{undefined}
		 */
		handleUnregister = (component) => {
			let wasRunning = false;
			for (let i = 0; i < this.controlled.length; i++) {
				if (this.controlled[i].component === component) {
					wasRunning = this.controlled[i].state === STATE.active;
					this.controlled.splice(i, 1);
					break;
				}
			}
			if (wasRunning && !this.anyRunning()) {
				this.dispatch('start');
			}
		}

		/*
		 * Handler for the `start` context function
		 *
		 * @param	{Object}	component	A previously registered component
		 *
		 * @returns	{undefined}
		 */
		handleStart = (component) => {
			this.cancelJob.stop();
			if (!this.anyRunning()) {
				this.markAll(STATE.ready);
				this.dispatch('start', component);
			}
		}

		/*
		 * Handler for the `cancel` context function
		 *
		 * @param	{Object}	component	A previously registered component
		 *
		 * @returns	{undefined}
		 */
		handleCancel = () => {
			if (this.anyRunning()) {
				this.cancelJob.start();
			}
		}

		doCancel = () => {
			if (this.isHovered || this.isFocused) {
				return;
			}
			this.markAll(STATE.inactive);
			this.dispatch('stop');
		}

		/*
		 * Handler for the `complete` context function
		 *
		 * @param	{Object}	component	A previously registered component
		 *
		 * @returns	{undefined}
		 */
		handleComplete = (component) => {
			const complete = this.markReady(component);
			if (complete) {
				this.cancelJob.stop();
				this.markAll(STATE.ready);
				this.dispatch('start');
			}
		}

		handleEnter = () => {
			this.isHovered = true;
			if (!this.anyRunning()) {
				this.dispatch('start');
			}
			this.cancelJob.stop();
		}

		handleLeave = () => {
			this.isHovered = false;
			this.cancelJob.start();
		}

		/*
		 * Handler for the focus event
		 */
		handleFocus = (ev) => {
			this.isFocused = true;
			if (!this.anyRunning()) {
				this.dispatch('start');
			}
			this.cancelJob.stop();
			forwardFocus(ev, this.props);
		}

		/*
		 * Handler for the blur event
		 */
		handleBlur = (ev) => {
			this.isFocused = false;
			if (this.anyRunning()) {
				this.cancelJob.start();
			}
			forwardBlur(ev, this.props);
		}

		/*
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
					const complete = handler.call(controlledComponent);

					// Returning `true` from a start request means that the marqueeing is
					// unnecessary and is therefore not awaiting a finish
					if (action === 'start' && complete) {
						controlled.state = STATE.ready;
					} else if (action === 'start') {
						controlled.state = STATE.active;
					}
				} else if ((action === 'start') && (component === controlledComponent)) {
					controlled.state = STATE.active;
				}
			});
		}

		/*
		 * Marks all components with the passed-in state
		 *
		 * @param	{Enum}	state	The state to set
		 *
		 * @returns	{undefined}
		 */
		markAll (state) {
			this.controlled.forEach(c => {
				c.state = state;
			});
		}

		/*
		 * Marks `component` as ready for next marquee action
		 *
		 * @param	{Object}	component	A previously registered component
		 *
		 * @returns	{Boolean}				`true` if no components are STATE.active
		 */
		markReady (component) {
			let complete = true;
			this.controlled.forEach(c => {
				if (c.component === component) {
					c.state = STATE.ready;
				}

				complete = complete && (c.state !== STATE.active);
			});

			return complete;
		}

		/*
		 * Checks that all components are inactive
		 *
		 * @returns {Boolean} `true` if any components should be running
		 */
		allInactive () {
			const activeOrReady = this.controlled.reduce((res, component) => {
				return res || !(component.state === STATE.inactive);
			}, false);
			return !activeOrReady;
		}

		/*
		 * Checks for any components currently marqueeing
		 *
		 * @returns {Boolean} `true` if any component is marqueeing
		 */
		anyRunning () {
			return this.controlled.reduce((res, component) => {
				return res || (component.state === STATE.active);
			}, false);
		}

		render () {
			let props = this.props;

			if (marqueeOnFocus) {
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
