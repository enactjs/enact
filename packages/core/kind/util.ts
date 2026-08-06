import {Context} from 'react';

import {CallbackObject} from '../types';

import {HandlerFunction, StylesBlock} from './types';

export const bindInlineHandlers = (props: CallbackObject, handlers: CallbackObject<HandlerFunction>, handlerKeys: string[], context: Context<any>) => {
	if (!handlerKeys?.length) {
		return props;
	}

	const snapshot = {...props};

	return handlerKeys.reduce((_props, key) => {
		_props[key] = (ev: any) => handlers[key](ev, snapshot, context);
		return _props;
	}, props);
};

export const addInternalProp = function (props: CallbackObject, name: string, value: CallbackObject) {
	Object.defineProperty(props, name, {
		value,
		enumerable: false,
		writable: true
	});

	return props;
};
