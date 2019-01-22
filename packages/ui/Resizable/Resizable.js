/**
 * A higher-order component that handles component resize event.
 *
 * @module ui/Resizable
 * @exports Resizable
 */

import {call, forward, handle} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import invariant from 'invariant';
import React from 'react';

/**
 * Used internally for things to notify children that they need to resize because of a parent
 * update.
 *
 * @type Object
 * @private
 */
const ResizeContext = React.createContext();

/**
 * Default config for `Resizable`.
 *
 * @memberof ui/Resizable.Resizable
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Configures the event name that will indicate a resize of a container may be necessary.
	 *
	 * @type {String}
	 * @default null
	 * @memberof ui/Resizable.Resizable.defaultConfig
	 */
	filter: null,

	/**
	 * Configures a function that can filter the event to limit when the container is notified.
	 *
	 * This function will receive the event payload as its only argument and should return `true` to
	 * prevent the resize notification.
	 *
	 * @type {Function}
	 * @default null
	 * @memberof ui/Resizable.Resizable.defaultConfig
	 */
	resize: null
};

/**
 * A higher-order component that notifies a container that the wrapped component has been resized.
 *
 * It may be useful in cases where a component may need to update itself as a result of its children
 * changing in size, such as a [Scroller]{@link ui/Scroller}.
 *
 * Containers must provide an `invalidateBounds` method via React's context in order for `Resizable`
 * instances to notify it of resize.
 *
 * @class Resizable
 * @memberof ui/Resizable
 * @hoc
 * @public
 */
const Resizable = hoc(defaultConfig, (config, Wrapped) => {
	const {filter, resize} = config;

	invariant(resize, `resize is required by Resizable but was omitted when applied to ${Wrapped.displayName}`);

	return class extends React.Component {
		static displayName = 'Resizable'

		static contextType = ResizeContext

		componentDidMount () {
			if (this.context) {
				// Registry requires a callback but (for now at least) Resizable doesn't respond to
				// upstream events so we're initializing a no-op function to "handle" callbacks
				this.resize = this.context(() => {});
			}
		}

		componentWillUnmount () {
			if (this.resize) {
				this.resize.unregister();
			}
		}

		/*
		 * Notifies a container that a resize is necessary
		 *
		 * @returns {undefined}
		 * @private
		 */
		invalidateBounds () {
			if (this.resize) {
				this.resize.notify({action: 'invalidateBounds'});
			}
		}

		/*
		 * Handles the event that indicates a resize is necessary
		 *
		 * @param   {Object}    ev  Event payload
		 *
		 * @returns {undefined}
		 * @private
		 */
		handleResize = handle(
			forward(resize),
			// optionally filter the event before notifying the container
			filter,
			call('invalidateBounds')
		).bind(this)

		render () {
			const props = Object.assign({}, this.props);
			props[resize] = this.handleResize;

			return <Wrapped {...props} />;
		}
	};
});

export default Resizable;
export {
	Resizable,
	ResizeContext
};
