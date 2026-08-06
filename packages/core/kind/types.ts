import {ComponentClass, ComponentType, Context, FunctionComponent, ReactElement} from 'react';

import {CallbackObject} from '../types';

export type StylesBlock = {
	css: CallbackObject<string>;
	className: string;
	publicClassNames: boolean | string | string[];
}

export type KindComponent = ComponentType<any> & {
	computed?: CallbackObject;
	defaultProps?: CallbackObject;
	inline?: ComputedPropFunction;
};

export interface ComputedPropFunction {
	(props: CallbackObject, context: Context<any>): any;
}

export interface HandlerFunction {
	(event: any, props: CallbackObject, context: Context<any>): unknown;
}

export interface RenderFunction {
	(props: CallbackObject, context: Context<any>): ReactElement | null;
}

export interface KindConfig {
	name?: string;
	functional?: boolean;
	propTypes?: CallbackObject<Function>;
	defaultProps?: CallbackObject;
	contextType?: Context<any>;
	styles?: StylesBlock;
	handlers?: CallbackObject<HandlerFunction>;
	computed?: CallbackObject;
	render?: RenderFunction;
	useRender?: RenderFunction;
}