import all from 'ramda/src/all';
import curry from 'ramda/src/curry';
import reduce from 'ramda/src/reduce';

import {is} from '../keymap';

/**
 * Allows generating event handlers by chaining functions to filter or short-circuit the handling
 * flow. Any handler that returns true will stop the chain.
 *
 * @example
 *  const submit = (e) => {
 *		console.log('Submitting the data!');
 *  };
 *	const submitOnEnter = handle(handle.forKey('enter'), handle.stop, submit);
 *	return (<input onKeyPress={submitOnEnter}>);
 *
 * @method	handle
 * @param	{...Function}	handlers List of handlers to process the event
 * @returns	{Function}		A function that accepts an event which is dispatched to each of the
 *							provided handlers.
 */
const handle = (...handlers) => (...args) => {
	const result = reduce((acc, handler) => {
		if (acc) {
			// if a prior handler returned true, do not call any more handlers
			return true;
		} else if (typeof handler === 'function') {
			// if the current handler is a function, call it
			return handler(...args);
		}

		// otherwise, the handler is invalid so continue. This lets us blindly pass potential handlers
		// from props without adding boilerplate checks everywhere.
		return false;
	}, false, handlers);

	return result;
};

/**
 * Like `handle()`, accepts a list of handlers to process the event but returns a function that
 * accepts an additional list of args that will be included as additional arguments to the handlers.
 * That function returns the event handler that accepts the event and passes it, along with the
 * extra args, to the handlers.
 *
 * @example
 *	import {withArgs, forKey, stop} from '@enact/core/handle';
 *	kind({
 *		computed: {
 *			onSubmit: withArgs(forKey('enter'), stop, (e, props) => {
 *				// block submission for blank data unless the prop allows it
 *				if (e.target.value === '' && !props.allowBlank) return true;
 *				console.log('Submitting the data!');
 *			})
 *		},
 *		render: ({onSubmit}) => (
 *			<input onKeyPress={submitOnEnter} />
 *		)
 *	});
 *
 * @method	withArgs
 * @param	{...Function}	handlers List of handlers to process the event
 * @returns	{Function}		A function that accepts a list of args which returns a function that
 *							accepts an event which is dispatched to each of the provided handlers.
 */
const withArgs = handle.withArgs = (...handlers) => {
	const handler = handle(...handlers);
	return (...args) => (e) => handler(e, ...args);
};

/**
 * Calls a named function on the event and returns false
 *
 * @example
 *	// calls event.customMethod() before calling submit()
 *	handle(handle.callOnEvent('customMethod'), submit)
 *
 * @method	callOnEvent
 * @param	{String}	methodName	Name of the method to call on the event.
 * @returns {Function}				Event handler
 */
const callOnEvent = handle.callOnEvent = (methodName) => (e) => {
	if (e[methodName]) {
		e[methodName]();
	} else if (e.nativeEvent && e.nativeEvent[methodName]) {
		// In some cases (notably stopImmediatePropagation), React doesn't include a desired method
		// on its proxy so we check the native event as well.
		e.nativeEvent[methodName]();
	}
	return false;
};

/**
 * Stops handling if the value of `prop` on the event does not equal `value`
 *
 * @example
 *  // submit() called only if event.x === 0
 *	handle(handle.forEventProp('x', 0), submit)
 *
 * @method	forEventProp
 * @param	{String}	prop	Name of property on event
 * @param	{*}			value	Value of property
 * @returns {Function}			Event handler
 */
const forEventProp = handle.forEventProp = curry((prop, value) => {
	return (e) => e[prop] !== value;
});

/**
 * Forwards the event to a function at `name` on `props`. The return value of the forwarded function
 * is ignored.
 *
 * **Note:** Can only be used with `withArgs` which allows extra args to be passed to the handlers.
 * If you have a reference to the function instead of the name, it can be passed directly to
 * `handle()` as a handler.
 *
 * @example
 *	const props = {onSubmit: (e) => doSomething()};
 *	const handleClick = withArgs(forward('onSubmit'))(props);
 *
 * @method	forward
 * @param	{String}	name	Name of method on the `props`
 * @returns	{Function}			Event handler
 */
const forward = handle.foward = name => (e, props) => {
	const fn = props && props[name];
	if (typeof fn == 'function') {
		fn(e);
	}

	return false;
};

/**
 * Calls event.preventDefault() and returns false.
 *
 * @method	preventDefault
 * @returns {Function}	Event handler
 */
const preventDefault = handle.preventDefault = callOnEvent('preventDefault');

/**
 * Calls event.stopPropagation() and returns false
 *
 * @method	stop
 * @returns {Function}	Event handler
 */
const stop = handle.stop = callOnEvent('stopPropagation');

/**
 * Calls event.stopImmediatePropagation() and returns false
 *
 * @method	stopImmediate
 * @returns {Function}	Event handler
 */
const stopImmediate = handle.stopImmediate = callOnEvent('stopImmediatePropagation');

/**
 * Only allows event handling to continue if `event.keyCode === value`.
 *
 * @method	forKeyCode
 * @param	{Number}	value	`keyCode` to test
 * @returns	{Function}			Event handler
 */
const forKeyCode = handle.forKeyCode = forEventProp('keyCode');

/**
 * Only allows event handling to continue if the event's keyCode is mapped to `name` within
 * {@link core/keymap}.
 *
 * @method	forKey
 * @param	{String}	name	Name from {@link core/keymap}
 * @returns	{Function}			Event handler
 */
const forKey = handle.forKey = curry((name, ev) => {
	return !is(name, ev.keyCode);
});

/**
 * Stops handling if the value of `prop` on the event does not equal `value`
 *
 * @example
 *  // submit() called only if event.x === 0
 *	handle(handle.forEventProp('x', 0), submit)
 *
 * @method	forEventProp
 * @param	{String}	prop	Name of property on event
 * @param	{*}			value	Value of property
 * @returns {Function}			Event handler
 */
const forProp = handle.forProp = curry((prop, value) => {
	return (e, props) => props[prop] !== value;
});

export default handle;
export {
	callOnEvent,
	forward,
	forEventProp,
	forKey,
	forKeyCode,
	forProp,
	handle,
	preventDefault,
	stop,
	stopImmediate,
	withArgs
};
