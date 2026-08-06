import {CallbackObject} from '../types';
import {Context} from 'react';

export interface CurriedForward {
	(name: string, ev?: CallbackObject, props?: CallbackObject): HandlerFunction;
}

export interface CurriedForProp {
	(prop: string, value: any, ev?: Event, props?: CallbackObject): HandlerFunction;
}

export interface EventHandler extends HandlerFunction {
	named: (name: string) => HandlerFunction;
	bindAs: (obj: CallbackObject, name?: string) => HandlerFunction;
}

export type HandlerFunction = (event: Event, props: CallbackObject, context: Context<any>) => any;
export type EventAdapter = (event: Event, props: CallbackObject, context: Context<any>) => any;


