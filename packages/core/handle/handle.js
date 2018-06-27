/**
 * `core/handle` provides a set of utilities to support handling events for `kind()`s and
 * `React.Component`s. The default export, `handle()`, generates an event handler function from a
 * set of input functions. The input functions either process or filter the event. If an input
 * function returns `true`, `handle()` will continue processing the event by calling the next input
 * function in the chain. If it returns `false` (or any falsy value like `null` or `undefined`),
 * the event handling chain stops at that input function.
 *
 * Example:
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
 * Handlers can either be bound directly using the native `bind()` method or using the `bindAs()`
 * utility method that is appended to the handler.
 *
 * Example:
 * ```
 * import {forKey, forward, handle, preventDefault} from '@enact/core/handle';
 * import React from 'react';
 *
 * class MyComponent extends React.Component {
 *   // bind handle() to the instance
 *   constructor () {
 *     super();
 *
 *     // logEnter will be bound to `this` and set as this.handleKeyDown
 *     //
 *     // Equivalent to the following with the advantage of set the function name to be displayed in
 *     // development tool call stacks
 *     //
 *     //   this.handleKeyDown = logEnter.bind(this)
 *     logEnter.bindAs(this, 'handleKeyDown');
 *   }
 *
 *   render () {
 *     return (
 *       <div onKeyDown={this.handleKeyDown} />
 *     );
 *   }
 * }
 * ```
 *
 * @module core/handle
 * @exports adaptEvent
 * @exports call
 * @exports callOnEvent
 * @exports forward
 * @exports forwardWithPrevent
 * @exports forEventProp
 * @exports forKey
 * @exports forKeyCode
 * @exports forProp
 * @exports handle
 * @exports log
 * @exports oneOf
 * @exports preventDefault
 * @exports returnsTrue
 * @exports stop
 * @exports stopImmediate
 */

import cond from 'ramda/src/cond';
import curry from 'ramda/src/curry';

import {is} from '../keymap';

// Accepts an array of handlers, sanitizes them, and returns a handler function
// compose(allPass, map(makeSafeHandler));
const makeHandler = (handlers) => {
	// allowing shadowing here to provide a meaningful function name in dev tools
	// eslint-disable-next-line no-shadow
	return function handle (...args) {
		for (let i = 0; i < handlers.length; i++) {
			const fn = handlers[i];
			if (typeof fn !== 'function' || fn.apply(this, args)) {
				continue;
			}

			return false;
		}

		return true;
	};
};

// Loose check to determine if obj is component-ish if it has both props and context members
const hasPropsAndContext = (obj) => {
	return obj && obj.hasOwnProperty && obj.hasOwnProperty('props') && obj.hasOwnProperty('context');
};

const named = (fn, name) => {
	if (__DEV__) {
		try {
			Object.defineProperty(fn, 'name', {
				value: name,
				writeable: false,
				enumerable: false
			});
		} catch (err) {
			// unable to set name of function
		}
	}

	return fn;
};

const bindAs = (fn, obj, name) => {
	const namedFunction = name ? named(fn, name) : fn;
	const bound = namedFunction.bind(obj);

	if (name) {
		obj[name] = bound;
	}

	return bound;
};

const decorateHandleFunction = (fn) => {
	fn.named = (name) => named(fn, name);
	fn.bindAs = (obj, name) => bindAs(fn, obj, name);

	return fn;
};

/**
 * Allows generating event handlers by chaining input functions to filter or short-circuit the
 * handling flow. Any input function that returns a falsy value will stop the chain.
 *
 * The returned handler function has a `finally()` member that accepts a function and returns a new
 * handler function. The accepted function is called once the original handler completes regardless
 * of the returned value.
 *
 * @method   handle
 * @memberof core/handle
 * @param    {...Function}  handlers List of handlers to process the event.
 * @returns  {Function}	    A function that accepts an event which is dispatched to each of the
 *                          provided handlers.
 */
const handle = function (...handlers) {
	const h = makeHandler(handlers);

	// In order to support binding either handle (handle.bind(this)) or a handler
	// (a = handle(), a.bind(this)), we cache `this` here and use it as the fallback for props and
	// context if fn() doesn't have its own `this`.
	const _outer = this;

	const fn = function prepareHandleArgs (ev, props, context) {
		let caller = null;

		// if handle() was bound to a class, use its props and context. otherwise, we accept
		// incoming props/context as would be provided by computed/handlers from kind()
		if (hasPropsAndContext(this)) {
			caller = this;
			props = this.props;
			context = this.context;
		} else if (hasPropsAndContext(_outer)) {
			caller = _outer;
			props = _outer.props;
			context = _outer.context;
		}

		return h.call(caller, ev, props, context);
	};

	fn.finally = function (cleanup) {
		return decorateHandleFunction(function handleWithFinally (ev, props, context) {
			let result = false;

			if (hasPropsAndContext(this)) {
				props = this.props;
				context = this.context;
			}

			try {
				result = fn.call(this, ev, props, context);
			} finally {
				cleanup.call(this, ev, props, context);
			}

			return result;
		});
	};

	return decorateHandleFunction(fn);
};

/**
 * Calls the first handler whose condition passes. Each branch must be passed as an array with the
 * first element being the condition function and the second being the handler function. The same
 * arguments are passed to both the condition function and the handler function. The value returned
 * from the handler is returned.
 *
 * Example:
 * ```
 * const handler = oneOf(
 * 	[forKey('enter'), handleEnter],
 * 	[forKey('left'), handleLeft],
 * 	[forKey('right'), handleRight]
 * );
 * ```
 *
 * @method   oneOf
 * @memberof core/handle
 * @param    {...Function[]}  handlers List of conditions and handlers to process the event
 * @returns  {Function}	    A function that accepts an event which is dispatched to each of the
 *                          conditions and, if it passes, onto the provided handler.
 */
const oneOf = handle.oneOf = function (...handlers) {
	return handle.call(this, cond(handlers));
};

/**
 * A function that always returns `true`. Optionally accepts a `handler` function which is called
 * before returning `true`.
 *
 * Example:
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
 * @param    {Function}  handler  Handler function called before returning `true`.
 * @returns  {Function}	   A function that returns true
 */
const returnsTrue = handle.returnsTrue = function (handler) {
	if (handler) {
		return named(function (...args) {
			handler.apply(this, args);

			return true;
		}, 'returnsTrue');
	}

	return true;
};

/**
 * Calls a named function on the event and returns `true`.
 *
 * Example:
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
 * @param    {String}     methodName  Name of the method to call on the event
 * @param    {Object}     ev          Event payload
 * @returns  {Boolean}                Always returns `true`
 * @private
 */
const callOnEvent = handle.callOnEvent = curry((methodName, ev) => {
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
 * Example:
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
 * @param    {Object}      ev     Event payload
 * @returns  {Boolean}            Returns `true` if `prop` on `event` strictly equals `value`
 */
const forEventProp = handle.forEventProp = curry((prop, value, ev) => {
	return ev[prop] === value;
});

/**
 * Forwards the event to a function at `name` on `props`. If the specified prop is `undefined` or
 * is not a function, it is ignored. The return value of the forwarded function is ignored and
 * `true` is always returned instead.
 *
 * Example:
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
 * @param    {Object}    ev     Event payload
 * @param    {Object}    props  Props object
 * @returns  {Boolean}          Always returns `true`
 */
const forward = handle.forward = curry(named((name, ev, props) => {
	const fn = props && props[name];
	if (typeof fn === 'function') {
		fn(ev);
	}

	return true;
}, 'forward'));

/**
 * Calls `event.preventDefault()` and returns `true`.
 *
 * Example:
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
 * @param    {Object}        ev  Event payload
 * @returns  {Boolean}           Always returns `true`
 */
const preventDefault = handle.preventDefault = callOnEvent('preventDefault');

/**
 * Forwards the event to a function at `name` on `props` with capability to prevent default
 * behavior. If the specified prop is `undefined` or is not a function, it is ignored. Returns
 * `false` when `event.preventDefault()` has been called in a handler.
 *
 * Example:
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
 * @memberof core/handle
 * @param    {String}    name   Name of method on the `props`
 * @param    {Object}    ev     Event payload
 * @param    {Object}    props  Props object
 * @returns  {Boolean}          Returns `true` if default action is prevented
 * @private
 */
const forwardWithPrevent = handle.forwardWithPrevent = curry(named((name, ev, props) => {
	let prevented = false;
	const wrappedEvent = Object.assign({}, ev, {
		preventDefault: () => {
			prevented = true;
			preventDefault(ev);
		}
	});
	forward(name, wrappedEvent, props);

	return !prevented;
}, 'forwardWithPrevent'));

/**
 * Calls `event.stopPropagation()` and returns `true`
 *
 * Example:
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
 * @param    {Object}   ev  Event payload
 * @returns  {Boolean}      Always returns `true`
 */
const stop = handle.stop = named(callOnEvent('stopPropagation'), 'stop');

/**
 * Calls `event.stopImmediatePropagation()` and returns `true`
 *
 * Example:
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
 * @param    {Object}       ev  Event payload
 * @returns  {Boolean}          Always returns `true`
 */
const stopImmediate = handle.stopImmediate = callOnEvent('stopImmediatePropagation');

/**
 * Allows event handling to continue if `event.keyCode === value`.
 *
 * Example:
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
 * @param    {Object}    ev     Event payload
 * @returns  {Boolean}          Returns `true` if `event.keyCode` strictly equals `value`
 */
const forKeyCode = handle.forKeyCode = forEventProp('keyCode');

/**
 * Allows handling to continue if the event's keyCode is mapped to `name` within
 * {@link core/keymap}.
 *
 * Example:
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
 * @param    {Object}    ev     Event payload
 * @returns  {Boolean}          Returns `true` if `event.keyCode` is mapped to `name`
 * @see      core/keymap
 */
const forKey = handle.forKey = curry((name, ev) => {
	return is(name, ev.keyCode);
});

/**
 * Allows handling to continue if the value of `prop` on the props strictly equals `value`.
 *
 * Example:
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
 * @param    {Object}    ev     Event payload
 * @param    {Object}    props  Props object
 * @returns  {Boolean}          `true` if the value of `props[prop]` strictly equals `value`
 */
const forProp = handle.forProp = curry((prop, value, ev, props) => {
	return props[prop] === value;
});

/**
 * Logs the event, props, and context optionally preceded by a custom message. Will only log in
 * development mode.
 *
 * Example:
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
 * @param    {Object}     ev       Event payload
 * @param    {...*}       [args]   Any args passed are logged
 * @returns  {Boolean}             Always returns `true`
 */
const log = handle.log = curry((message, ev, ...args) => {
	if (__DEV__) {
		// eslint-disable-next-line no-console
		console.log(message, ev, ...args);
	}

	return true;
});

/**
 * Invokes a method by name on the component to which {@link core/handle.handle} is bound.
 *
 * If the methods exists on the object, it is called with the event, props, and context and its
 * return value is returned.
 *
 * If the method does not exist or handle isn't bound to an instance, it returns `false`.
 *
 * Example:
 * ```
 * import {call, handle, forProp} from '@enact/core/handle';
 *
 * const incrementIfEnabled = handle(
 *   forProp('disabled', false),
 *   call('increment')
 * );
 *
 * class Counter extends React.Component {
 *   constructor () {
 *     super();
 *
 *     this.handleIncrement = incrementIfEnabled.bind(this);
 *   }
 *
 *   render () {
 *     // ...
 *   }
 * }
 * ```
 *
 * @method   call
 * @memberof core/handle
 * @param    {String}     method  Name of method
 * @returns  {Boolean}            Returns the value returned by `method`, or `false` if the method
 *                                does not exist
 */
const call = function (method) {
	return named(function (...args) {
		if (this && this[method]) {
			return this[method](...args);
		}

		return false;
	}, 'call');
};

/**
 * Adapts an event with `adapter` before calling `handler`.
 *
 * The `adapter` function receives the same arguments as any handler. The value returned from
 * `adapter` is passed as the first argument to `handler` with the remaining arguments kept the
 * same. This is often useful to generate a custom event payload before forwarding on to a callback.
 *
 * Example:
 * ```
 * import {adaptEvent, forward} from '@enact/core/handle';
 *
 * // calls the onChange callback with an event payload containing a type and value member
 * const incrementAndChange = adaptEvent(
 * 	(ev, props) => ({
 * 	  type: 'onChange',
 * 	  value: props.value + 1
 * 	}),
 * 	forward('onChange')
 * )
 * ```
 *
 * @method   adaptEvent
 * @memberof core/handle
 * @param    {Function}  adapter  Function to adapt the event payload
 * @param    {Function}  handler  Handler to call with the new event payload
 * @param    {...*}      [args]   Additional args passed to both `adapter` and `handler`
 * @returns  {Object}             New event payload
 */
const adaptEvent = handle.adaptEvent = curry(function (adapter, handler) {
	return named(function (ev, ...args) {
		return handler.call(this, adapter.call(this, ev, ...args), ...args);
	}, 'adaptEvent');
});

export default handle;
export {
	adaptEvent,
	call,
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
