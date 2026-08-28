import {CallbackObject} from './callback.type';

/**
 * The signature for event handling functions
 *
 * @callback HandlerFunction
 * @param {Event|null} event - May be `null` for handlers invoked without an originating DOM event (e.g.
 *  {@link core/handle.forwardCustom} called with no `event` argument).
 * @param {Object<string, any>} props
 * @param {Object<string, any>} [context] - An arbitrary bag of values (not a React `Context`
 *  object); omitted when the handler isn't bound to a component instance or `kind()` context.
 */
export type HandlerFunction<C = unknown> = (event: Event | null, props: CallbackObject, context?: C) => any;
