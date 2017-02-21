import allPass from 'ramda/src/allPass';
import always from 'ramda/src/always';
import compose from 'ramda/src/compose';
import curry from 'ramda/src/curry';
import identity from 'ramda/src/identity';
import ifElse from 'ramda/src/ifElse';
import isType from 'ramda/src/is';
import map from 'ramda/src/map';
import T from 'ramda/src/T';

import {is} from '../keymap';

// Ensures that everything passed to `allPass` is a function so that if null values are passed they
// do not impede the event flow
const makeSafeHandler = ifElse(isType(Function), identity, always(T));

// Accepts an array of handlers, sanitizes them, and returns a handler function
const makeHandler = compose(allPass, map(makeSafeHandler));

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
const handle = function (...handlers) {
	const h = makeHandler(handlers);
	h.displayName = 'handle';

	return (ev, props, context) => {
		// if handle() was bound to a class, use its props and context. otherwise, we accept
		// incoming props/context as would be provided by computed/handlers from kind()
		if (this) {
			props = this.props;
			context = this.context;
		}

		return h(ev, props, context);
	};
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
	return true;
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
	return (e) => e[prop] === value;
});

/**
 * Forwards the event to a function at `name` on `props`. The return value of the forwarded function
 * is ignored.
 *
 * @example
 *	const props = {onSubmit: (e) => doSomething()};
 *	const handleClick = handle(forward('onSubmit'))(ev, props);
 *
 * @method	forward
 * @param	{String}	name	Name of method on the `props`
 * @returns	{Function}			Event handler
 */
const forward = handle.forward = name => (e, props) => {
	const fn = props && props[name];
	if (typeof fn === 'function') {
		fn(e);
	}

	return true;
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
	return is(name, ev.keyCode);
});

/**
 * Allows handling to continue if the value of `prop` on the props strictly equals `value`.
 *
 * @example
 *  // submit() called only if props.checked === true
 *	handle(handle.forProp('checked', true), submit)
 *
 * @method	forProp
 * @param	{String}	prop	Name of property on props object
 * @param	{*}			value	Value of property
 * @returns {Function}			Event handler
 */
const forProp = handle.forProp = curry((prop, value) => {
	return (e, props) => props[prop] === value;
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
	stopImmediate
};
