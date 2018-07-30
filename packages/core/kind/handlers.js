import React from 'react';

/**
 * Accepts an object of event handlers and a Component and returns a React Component that creates
 * bound handlers for each event and passes them to Component to reduce re-renders caused by
 * changed event handler references.
 *
 * ```
 * const cfg = {
 *   onChange: (ev, {onChange}) => onChange({value: ev.value})
 * }
 * handlers(cfg, Component)
 * ```
 *
 * @method  handlers
 * @param   {Object}    cfg        Configuration object mapping event names to event handlers
 * @param   {Function}  Component  A component
 * @returns {Function}             A component wrapping `Component` with bound event handlers
 * @private
 */
const handlers = (cfg, Component) => {
	return class extends React.Component {
		static displayName = `Handlers(${Component.displayName || Component.name || 'Component'})`

		constructor () {
			super();
			this.handlers = {};

			// cache bound function for each handler
			Object.keys(cfg).forEach(name => this.prepareHandler(name, cfg[name]));
		}

		/**
		 * Caches an event handler on the local `handlers` member
		 *
		 * @param   {String}    name     Event name
		 * @param   {Function}  handler  Event handler
		 *
		 * @returns {undefined}
		 */
		prepareHandler = (name, handler) => {
			this.handlers[name] = (ev) => {
				handler(ev, this.props, this.context);
			};
		}

		render () {
			return (
				<Component {...this.props} {...this.handlers} />
			);
		}
	};
};

export default handlers;
export {handlers};
