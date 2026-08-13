import {Context} from 'react';

import {CallbackObject} from './callback.type';

/**
 * The signature for event handling functions
 *
 * @callback HandlerFunction
 * @param {any} event
 * @param {Object<string, any>} props
 * @param {Object<string, any>} context
 */
export type HandlerFunction<C = unknown> = (event: Event, props: CallbackObject, context: Context<C>) => any;
