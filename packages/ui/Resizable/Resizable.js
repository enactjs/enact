/**
 * A higher-order component that handles component resize event.
 *
 * @module ui/Resizable
 * @exports Resizable
 */

import hoc from '@enact/core/hoc';
import invariant from 'invariant';

import ResizeContext from './ResizeContext';
import useResize from './useResize';

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
 * changing in size, such as a {@link ui/Scroller|Scroller}.
 *
 * Containers must provide an `invalidateBounds` method via React's context in order for `Resizable`
 * instances to notify it of resize.
 *
 * The wrapped component must respond to the configured
 * {@link ui/Resizable.Resizable.defaultConfig.resize|resize} event.
 *
 * @class Resizable
 * @memberof ui/Resizable
 * @hoc
 * @public
 */
const Resizable = hoc(defaultConfig, (config, Wrapped) => {
	const {resize} = config;

	invariant(resize, `resize is required by Resizable but was omitted when applied to ${Wrapped.displayName}`);

	// eslint-disable-next-line no-shadow
	return function Resizable (props) {
		const handlers = useResize(props, config);
		const resizableProps = Object.assign({}, props, handlers);

		return <Wrapped {...resizableProps} />;
	};
});

export default Resizable;
export {
	Resizable,
	ResizeContext
};
