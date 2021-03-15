/**
 * A higher-order component that handles component resize event.
 *
 * @module ui/Resizable
 * @exports Resizable
 */

import {call, forward, handle} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import invariant from 'invariant';
import {createContext, Component} from 'react';

/**
 * Used internally for things to notify children that they need to resize because of a parent
 * update.
 *
 * @type Object
 * @private
 */
const ResizeContext = createContext();

/**
 * Default config for `Resizable`.
 *
 * @memberof ui/Resizable.Resizable
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * A handler to process the `resize` event.
	 *
	 * It should return a truthy value if the event should trigger a resize.
	 *
	 * @type {Function}
	 * @default null
	 * @see {@link core/handle}
	 * @memberof ui/Resizable.Resizable.defaultConfig
	 */
	filter: null,

	/**
	 * The name of the event on the wrapped component to listen to for size changes.
	 *
	 * This event name will be passed to the wrapped component and will also be forwarded (if
	 * needed) to the parent component.
	 *
	 * @type {String}
	 * @required
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
 * The wrapped component must respond to the configured
 * [resize]{@link ui/Resizable.Resizable.defaultConfig.resize} event.
 *
 * @class Resizable
 * @memberof ui/Resizable
 * @hoc
 * @public
 */
const Resizable = hoc(defaultConfig, (config, Wrapped) => {
	const {filter, resize} = config;

	invariant(resize, `resize is required by Resizable but was omitted when applied to ${Wrapped.displayName}`);

	return class extends Component {
		static displayName = 'Resizable';

		static contextType = ResizeContext;

		componentDidMount () {
			if (this.context && typeof this.context === 'function') {
				// Registry requires a callback but (for now at least) Resizable doesn't respond to
				// upstream events so we're initializing a no-op function to "handle" callbacks
				this.resizeRegistry = this.context(() => {});
			}
		}

		componentWillUnmount () {
			if (this.resizeRegistry) {
				this.resizeRegistry.unregister();
			}
		}

		/*
		 * Notifies a container that a resize is necessary
		 *
		 * @returns {undefined}
		 * @private
		 */
		invalidateBounds () {
			if (this.resizeRegistry) {
				this.resizeRegistry.notify({action: 'invalidateBounds'});
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
		).bind(this);

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
