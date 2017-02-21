/**
 * Exports the {@link ui/Resizable.Resizable} Higher-order Component (HOC).
 *
 * @module ui/Resizable
 */

import {forward, handle} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import invariant from 'invariant';
import React from 'react';

/**
 * Default config for {@link ui/Resizable.Resizable}
 *
 * @memberof ui/Resizable.Resizable
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Configures the event name that will indicate a resize of a container may be necessary
	 *
	 * @type {String}
	 * @default null
	 * @memberof ui/Resizable.Resizable.defaultConfig
	 */
	filter: null,

	/**
	 * Configures a function that can filter the event to limit when the container is notified. This
	 * function will receive the event payload as its only argument and should return `true` to
	 * prevent the resize notification.
	 *
	 * @type {Function}
	 * @default null
	 * @memberof ui/Resizable.Resizable.defaultConfig
	 */
	resize: null
};

/**
 * The context propTypes required by `Resizable`. This should be set as the `childContextTypes` of a
 * container that needs to be notified of a resize.
 *
 * @type {Object}
 * @memberof ui/Resizable
 * @public
 */
const contextTypes = {
	invalidateBounds: React.PropTypes.func
};

/**
 * {@link ui/Resizable.Resizable} is a Higher-order Component that can be used to notify a container
 * that the Wrapped component has been resized. It may be useful in cases where a component may need
 * to update itself as a result of its children changing in size, such a Scroller.
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
	const forwardResize = forward(resize);

	invariant(resize, `resize is required by Resizable but was omitted when applied to ${Wrapped.displayName}`);

	// Temporary 'adapter' function until handle() is updated to use `true` return values continue
	let filterHandler = null;
	if (filter) {
		filterHandler = function (ev) {
			return !filter(ev);
		};
	}

	return class extends React.Component {
		static displayName = 'Resizable'

		static contextTypes = contextTypes

		/*
		 * Notifies a container that a resize is necessary
		 *
		 * @returns {undefined}
		 * @private
		 */
		invalidateBounds = () => this.context.invalidateBounds()

		/*
		 * Handles the event that indicates a resize is necessary
		 *
		 * @param   {Object}    ev  Event payload
		 *
		 * @returns {undefined}
		 * @private
		 */
		handleResize = handle(
			(ev) => {
				forwardResize(ev, this.props);

				// stop if there isn't a container to notify
				return !this.context.invalidateBounds;
			},
			// optionally filter the event before notifying the container
			filterHandler,
			this.invalidateBounds
		)

		render () {
			const props = Object.assign({}, this.props);
			props[resize] = this.handleResize;

			return <Wrapped {...props} />;
		}
	};
});

export default Resizable;
export {
	contextTypes,
	Resizable
};
