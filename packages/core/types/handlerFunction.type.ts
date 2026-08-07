import {CallbackObject} from './callback.type';

export type HandlerFunction = (event: Event, props: CallbackObject, context?: CallbackObject) => any;
