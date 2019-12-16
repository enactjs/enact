/**
 * Provides components and methods to add support for handling cancel actions.
 *
 * @module ui/Cancelable
 * @exports addCancelHandler
 * @exports Cancelable
 * @exports removeCancelHandle
 */

import hoc from '@enact/core/hoc';
import PropTypes from 'prop-types';
import React from 'react';

import {configureCancel, defaultConfig, useCancel, addCancelHandler, removeCancelHandler} from './useCancel';

/**
 * A higher-order component that adds support to a component to handle cancel actions.
 *
 * The cancel event may be handled either by a design-time config function or a run-time prop
 * function. If the component handles the event and wants to prevent upstream components from also
 * handling the event, the callback should invoke `stopPropagation()` on the event object.
 *
 * Note: This HoC passes a number of props to the wrapped component that should be passed to the
 * main DOM node.
 *
 * Usage of config function:
 * ```
 * import Cancelable from '@enact/ui/Cancelable';
 *
 * const MyComponent = ({myProp, ...rest}) => (
 *    <div {...rest}>{myProp}</div>
 *  );
 * ...
 * const CancelableComponent = Cancelable(
 *   {cancel: function (ev, props) {
 *     // Can inspect either the `onCancel` event, `ev`, and/or the `props` to determine how
 *     // to handle the event (e.g. invoking an event handler from `props`).
 *
 *     // Stop upstream instances of Cancelable from handling the event
 *     ev.stopPropagaion();
 *   }},
 *   MyComponent
 * );
 * ```
 *
 * Usage of prop function:
 * ```
 * import Cancelable from '@enact/ui/Cancelable';
 *
 * const CancelableComponent = Cancelable(
 *   // When a cancel action is received and a handler function exists for the prop
 *   // `onCancel`, it will be invoked and passed the `onCancel` event object.
 *   {cancel: 'onCancel'},
 *   MyComponent
 * );
 * ```
 *
 * @class Cancelable
 * @memberof ui/Cancelable
 * @hoc
 * @public
 */
const Cancelable = hoc(defaultConfig, (config, Wrapped) => {
	const hook = configureCancel(config);

	// eslint-disable-next-line no-shadow
	function Cancelable (props) {
		const {onKeyUp} = hook(props);

		const updated = {...props};
		delete updated.onCancel;
		delete updated[config.onCancel];

		if (config.Component) {
			return (
				<config.Component {...updated} onKeyUp={onKeyUp} />
			);
		}

		updated.onKeyUp = onKeyUp;

		return (
			<Wrapped {...updated} />
		);
	}

	Cancelable.propTypes = /** @lends ui/Cancelable.Cancelable.prototype */ {
		/**
		 * Called when a cancel action is received.
		 *
		 * This callback is invoked for every cancel action before the config or prop handler is
		 * invoked.
		 *
		 * @type {Function}
		 * @public
		 */
		onCancel: PropTypes.func
	};

	return Cancelable;
});

export default Cancelable;
export {
	addCancelHandler,
	Cancelable,
	configureCancel,
	removeCancelHandler,
	useCancel
};
