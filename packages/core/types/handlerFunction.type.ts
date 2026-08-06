import {CallbackObject} from './callbackObject.type';

export type HandlerFunction = (event: Event, props: CallbackObject, context?: CallbackObject) => any;