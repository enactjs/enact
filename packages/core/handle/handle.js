import R from 'ramda';

/**
 * Allows generating event handlers by chaining functions to filter or short-circuit the handling
 * flow. Any handler that returns true will stop the chain.
 *
 * @example
 *  const submit = (e) => {
 *		console.log('Submitting the data!');
 *  };
 *	const submitOnEnter = handle(handle.forKeyCode(13), handle.stop, submit)(props);
 *	return (<input onKeyPress={submitOnEnter}>);
 *
 * @return {Function} - A function that accepts an event which is dispatched to each of the provided
 *                      handlers.
 */
const handle = R.unapply(handlers => (...args) => R.reduce((acc, handler) => {
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
}, false, handlers));

// like handle(), accepts a list of handlers to process the event.
// returns a function that accepts a list of args that will be included as additional arguments to
// the handlers. that function returns another function which is the event handler that accepts the
// event and passes it, along with the extra args, to the handlers.
const withArgs = handle.withArgs = (...handlers) => {
	const handler = handle(...handlers);
	return (...args) => (e) => handler(e, ...args);
};

/**
 * Calls a named function on the event and returns false
 *
 * @example
 *	// calls event.stop() before calling submit()
 *	handle(handle.callOnEvent('stop'), submit)
 */
const callOnEvent = handle.callOnEvent = R.curry((fn, e) => {
	e[fn]();
	return false;
});

/**
 * Stops handling if the value of `prop` on the event equals `value`
 *
 * @example
 *  // submit() called only if event[x] is non-zero
 *	handle(handle.forProp('x', 0), submit)
 */
const forProp = handle.forProp = R.curry((prop, value) => (e) => e[prop] !== value);

/**
 * Forwards the event to a function at `name` on `props`
 *
 * @example
 *  const props = {onSubmit: (e) => doSomething()};
 *	const handleClick = handle(handle.forward('onSubmit'))(props);
 */
const forward = handle.foward = name => (e, props) => {
	const fn = props[name];
	if (typeof fn == 'function') {
		fn(e);
	}
};

/**
 * Calls event.preventDefault() and returns false
 */
const preventDefault = handle.preventDefault = callOnEvent('preventDefault');

/**
 * Calls event.stopPropagation() and returns false
 */
const stop = handle.stop = callOnEvent('stopPropagation');

/**
 * Returns false if event.keyCode == value
 */
const forKeyCode = handle.forKeyCode = forProp('keyCode');

/**
 * Returns false if event.which == value
 */
const forWhich = handle.forWhich = forProp('which');

export default handle;
export {
	callOnEvent,
	forward,
	forProp,
	forKeyCode,
	forWhich,
	handle,
	preventDefault,
	stop,
	withArgs
};
