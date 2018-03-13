/**
 * `core/handle` provides a set of utilities to support handling events for `kind()`s and
 * `React.Component`s. The default export, `handle()`, generates an event handler function from a
 * set of input functions. The input functions either process or filter the event. If an input
 * function returns `true`, `handle()` will continue processing the event by calling the next input
 * function in the chain. If it returns `false` (or any falsey value like `null` or `undefined`),
 * the event handling chain stops at that input function.
 *
 * ```
 * import {forKey, forward, handle, preventDefault} from '@enact/core/handle';
 *
 * // logEnter will contain a function that accepts an event, a props object, and a context object
 * const logEnter = handle(
 *   forward('onKeyDown'),  // forwards the event to the function passed in the onKeyDown prop
 *   forKey('enter'),       // if the event.keyCode maps to the enter key, allows event processing to continue
 *   preventDefault,        // calls event.preventDefault() to prevent the `keypress` event
 *   (ev, props) => {       // custom event handler -- in this case, logging some text
 *     // since it doesn't return `true`, no further input functions would be called after this one
 *     console.log('The Enter key was pressed down');
 *   }
 * ).finally(() => {
 * 	 console.log('This will log at the end no matter what happens within the handler above')
 * });
 * ```
 *
 * `handle()` can also be bound to a component instance which allows it to access the instance
 * `props` and `context`. This allows you to write consistent event handlers for components created
 * either with `kind()` or ES6 classes without worrying about from where the props are sourced.
 *
 * ```
 * import {forKey, forward, handle, preventDefault} from '@enact/core/handle';
 * import React from 'react';
 *
 * class MyComponent extends React.Component {
 *   // bind handle() to the instance
 *   handle = handle.bind(this)
 *
 *   // then create handlers using the bound function
 *   logEnter = this.handle(
 *     forward('onKeyDown'),  // forwards the event to the function passed in the onKeyDown prop
 *     forKey('enter'),       // if the event.keyCode maps to the enter key, allows event processing to continue
 *     preventDefault,        // calls event.preventDefault() to prevent the `keypress` event
 *     (ev, props) => {       // custom event handler -- in this case, logging some text
 *       // In the bound version, `props` will contain a reference to this.props
 *       // since it doesn't return `true`, no further input functions would be called after this one
 *       console.log('The Enter key was pressed down');
 *     }
 *   )
 *
 *   render () {
 *     // ...
 *   }
 * }
 * ```
 *
 * @module core/handle
 */

import curry from '../internal/fp/curry';
import curry2 from '../internal/fp/curry2';
import curry3 from '../internal/fp/curry3';

import {is} from '../keymap';

// Accepts an array of handlers, sanitizes them, and returns a handler function
// compose(allPass, map(makeSafeHandler));
const makeHandler = (handlers) => (...args) => {
	for (let i = 0; i < handlers.length; i++) {
		const fn = handlers[i];
		if (typeof fn !== 'function' || fn(...args)) {
			continue;
		}

		return false;
	}

	return true;
};

/**
 * Allows generating event handlers by chaining input functions to filter or short-circuit the
 * handling flow. Any input function that returns a falsey value will stop the chain.
 *
 * The returned handler function has a `finally()` member that accepts a function and returns a new
 * handler function. The accepted function is called once the original handler completes regardless
 * of the returned value.
 *
 * @method   handle
 * @memberof core/handle
 * @param    {...Function}  handlers List of handlers to process the event
 * @returns  {Function}	    A function that accepts an event which is dispatched to each of the
 *                          provided handlers.
 */
const handle = function (...handlers) {
	const h = makeHandler(handlers);
	h.displayName = 'handle';

	const fn = (ev, props, context) => {
		// if handle() was bound to a class, use its props and context. otherwise, we accept
		// incoming props/context as would be provided by computed/handlers from kind()
		if (this) {
			props = this.props;
			context = this.context;
		}

		return h(ev, props, context);
	};

	fn.finally = (cleanup) => (...args) => {
		let result = false;

		try {
			result = fn(...args);
		} finally {
			cleanup(...args);
		}

		return result;
	};

	return fn;
};

/**
 * Calls the first handler whose condition passes. Each branch must be passed as an array with the
 * first element being the condition function and the second being the handler function. The same
 * arguments are passed to both the condition function and the handler function. The value returned
 * from the handler is returned.
 *
 * ```
 * const handler = oneOf(
 * 	[forKey('enter'), handleEnter],
 * 	[forKey('left'), handleLeft],
 * 	[forKey('right'), handleRight]
 * );
 *
 * @method   oneOf
 * @memberof core/handle
 * @param    {...Function}  handlers List of handlers to process the event
 * @returns  {Function}	    A function that accepts an event which is dispatched to each of the
 *                          conditions and, if it passes, onto the provided handler.
 */
const oneOf = handle.oneOf = function (...handlers) {
	return handle.call(this, function (...args) {
		for (let i = 0; i < handlers.length; i++) {
			if (handlers[i][0](...args)) {
				return handlers[i][1](...args);
			}
		}

		return false;
	});
};

/**
 * A function that always returns `true`. Optionally accepts a `handler` function which is called
 * before returning `true`.
 *
 * ```
 * // Used to coerce an existing function into a handler change
 * const coercedHandler = handle(
 *   returnsTrue(doesSomething),
 *   willAlwaysBeCalled
 * );
 *
 * // Used to emulate if/else blocks with `oneOf`
 * const ifElseHandler = oneOf(
 * 	[forKey('enter'), handleEnter],
 * 	[returnsTrue, handleOtherwise]
 * );
 * ```
 *
 * @method   returnsTrue
 * @memberof core/handle
 * @param    {[Function]}  handler  Handler function called before returning `true`
 * @returns  {Function}	   A function that returns true
 */
const returnsTrue = handle.returnsTrue = function (handler) {
	if (handler) {
		return function (...args) {
			handler(...args);

			return true;
		};
	}

	return true;
};

/**
 * Calls a named function on the event and returns `true`
 *
 * ```
 * import {callOnEvent, handle} from '@enact/core/handle';
 *
 * const callsCustomMethod = handle(
 *	callOnEvent('customMethod'),
 *	(ev) => console.log('ev.customMethod() was called')
 * );
 * ```
 *
 * @method   callOnEvent
 * @memberof core/handle
 * @param    {String}     methodName  Name of the method to call on the event.
 * @param    {Object}     ev          Event
 * @returns  {Boolean}                Always returns `true`
 * @private
 */
const callOnEvent = handle.callOnEvent = curry2((methodName, ev) => {
	if (ev[methodName]) {
		ev[methodName]();
	} else if (ev.nativeEvent && ev.nativeEvent[methodName]) {
		// In some cases (notably stopImmediatePropagation), React doesn't include a desired method
		// on its proxy so we check the native event as well.
		ev.nativeEvent[methodName]();
	}
	return true;
});

/**
 * Allows handling to continue if the value of `prop` on the event strictly equals `value`
 *
 * ```
 * import {forEventProp, handle} from '@enact/core/handle';
 *
 * const logWhenXEqualsZero = handle(
 *   forEventProp('x', 0),
 *   (ev) => console.log('ev.x was equal to zero')
 * );
 * ```
 *
 * @method   forEventProp
 * @memberof core/handle
 * @param    {String}	   prop   Name of property on event
 * @param    {*}           value  Value of property
 * @param    {Object}      ev     Event
 * @returns  {Boolean}            Returns `true` if `prop` on `event` strictly equals `value`
 */
const forEventProp = handle.forEventProp = curry3((prop, value, ev) => {
	return ev[prop] === value;
});

/**
 * Forwards the event to a function at `name` on `props`. If the specified prop is `undefined` or
 * is not a function, it is ignored. The return value of the forwarded function is ignored and
 * `true` is always returned instead.
 *
 * ```
 * import {forward, handle} from '@enact/core/handle';
 *
 * const forwardAndLog = handle(
 *   forward('onClick'),
 *   (ev) => console.log('event forwarded to onClick from props')
 * );
 * ```
 *
 * @method   forward
 * @memberof core/handle
 * @param    {String}    name   Name of method on the `props`
 * @param    {Object}    ev     Event
 * @param    {Object}    props  Props object
 * @returns  {Boolean}          Always returns `true`
 */
const forward = handle.forward = curry3((name, ev, props) => {
	const fn = props && props[name];
	if (typeof fn === 'function') {
		fn(ev);
	}

	return true;
});

/**
 * Calls `event.preventDefault()` and returns `true`.
 *
 * ```
 * import {handle, preventDefault} from '@enact/core/handle';
 *
 * const preventAndLog = handle(
 *   preventDefault,
 *   (ev) => console.log('preventDefault called')
 * );
 * ```
 *
 * @method   preventDefault
 * @memberof core/handle
 * @param    {Object}        ev  Event
 * @returns  {Boolean}           Always returns `true`
 */
const preventDefault = handle.preventDefault = callOnEvent('preventDefault');

/**
 * Forwards the event to a function at `name` on `props` with capability to prevent default
 * behavior. If the specified prop is `undefined` or is not a function, it is ignored. Returns
 * `false` when `event.preventDefault()` has been called in a handler.
 *
 * ```
 * import {forwardWithPrevent, handle} from '@enact/core/handle';
 *
 * const forwardPreventDefault = handle(
 *   forwardWithPrevent('onClick'),
 *   (ev) => console.log('default action')
 * );
 * ```
 *
 * @method   forwardWithPrevent
 * @private
 * @memberof core/handle
 * @param    {String}    name   Name of method on the `props`
 * @param    {Object}    ev     Event
 * @param    {Object}    props  Props object
 * @returns  {Boolean}          Returns `true` if default action is prevented
 */
const forwardWithPrevent = handle.forwardWithPrevent = curry3((name, ev, props) => {
	let prevented = false;
	const wrappedEvent = Object.assign({}, ev, {
		preventDefault: () => {
			prevented = true;
			preventDefault(ev);
		}
	});
	forward(name, wrappedEvent, props);

	return !prevented;
});

/**
 * Calls `event.stopPropagation()` and returns `true`
 *
 * ```
 * import {handle, stop} from '@enact/core/handle';
 *
 * const stopAndLog = handle(
 *   stop,
 *   (ev) => console.log('stopPropagation called')
 * );
 * ```
 *
 * @method   stop
 * @memberof core/handle
 * @param    {Object}   ev  Event
 * @returns  {Boolean}      Always returns `true`
 */
const stop = handle.stop = callOnEvent('stopPropagation');

/**
 * Calls `event.stopImmediatePropagation()` and returns `true`
 *
 * ```
 * import {handle, stopImmediate} from '@enact/core/handle';
 *
 * const stopImmediateAndLog = handle(
 *   stopImmediate,
 *   (ev) => console.log('stopImmediatePropagation called')
 * );
 * ```
 *
 * @method   stopImmediate
 * @memberof core/handle
 * @param    {Object}       ev  Event
 * @returns  {Boolean}          Always returns `true`
 */
const stopImmediate = handle.stopImmediate = callOnEvent('stopImmediatePropagation');

/**
 * Allows event handling to continue if `event.keyCode === value`.
 *
 * ```
 * import {forKeyCode, handle} from '@enact/core/handle';
 *
 * const logForEscapeKey = handle(
 *   forKeyCode(27),
 *   (ev) => console.log('Escape key pressed down')
 * );
 * ```
 *
 * @method   forKeyCode
 * @memberof core/handle
 * @param    {Number}    value  `keyCode` to test
 * @param    {Object}    ev     Event
 * @returns  {Boolean}          Returns `true` if `event.keyCode` strictly equals `value`
 */
const forKeyCode = handle.forKeyCode = forEventProp('keyCode');

/**
 * Allows handling to continue if the event's keyCode is mapped to `name` within
 * {@link core/keymap}.
 *
 * ```
 * import {forKey, handle} from '@enact/core/handle';
 *
 * const logForEnterKey = handle(
 *   forKey('enter'),
 *   (ev) => console.log('Enter key pressed down')
 * );
 * ```
 *
 * @method   forKey
 * @memberof core/handle
 * @param    {String}    name   Name from {@link core/keymap}
 * @param    {Object}    ev     Event
 * @returns  {Boolean}          Returns `true` if `event.keyCode` is mapped to `name`
 * @see      core/keymap
 */
const forKey = handle.forKey = curry2((name, ev) => {
	return is(name, ev.keyCode);
});

/**
 * Allows handling to continue if the value of `prop` on the props strictly equals `value`.
 *
 * ```
 * import {forProp, handle} from '@enact/core/handle';
 *
 * const logWhenChecked = handle(
 *   forProp('checked', true),
 *   (ev) => console.log('checked prop is true')
 * );
 * ```
 *
 * @method   forProp
 * @memberof core/handle
 * @param    {String}    prop   Name of property on props object
 * @param    {*}         value  Value of property
 * @param    {Object}    ev     Event
 * @param    {Object}    props  Props object
 * @returns  {Boolean}          Event handler
 */
const forProp = handle.forProp = curry((prop, value, ev, props) => {
	return props[prop] === value;
});


/**
 * Logs the event, props, and context optionally preceded by a custom message. Will only log in
 * development mode.
 *
 * ```
 * import {forProp, handle, log} from '@enact/core/handle';
 *
 * const logWhenChecked = handle(
 *   forProp('checked', true),
 *   log('checked props is true')
 * );
 * ```
 *
 * @method   log
 * @memberof core/handle
 * @param    {String}     message  Custom message
 * @param    {Object}     ev       Event
 * @param    {...*}       [args]   Any args passed are logged
 * @returns  {Boolean}             Always returns `true`
 */
const log = handle.log = curry2((message, ev, ...args) => {
	if (__DEV__) {
		// eslint-disable-next-line no-console
		console.log(message, ev, ...args);
	}

	return true;
});

export default handle;
export {
	callOnEvent,
	forward,
	forwardWithPrevent,
	forEventProp,
	forKey,
	forKeyCode,
	forProp,
	handle,
	log,
	oneOf,
	preventDefault,
	returnsTrue,
	stop,
	stopImmediate
};
