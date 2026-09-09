import {ComponentType, Context, ReactElement} from 'react';

import {CallbackObject, HandlerFunction} from '../types';

export type StylesBlock = {
	css: CallbackObject<string>;
	className: string;
	publicClassNames: boolean | string | string[];
}

/*
 * `kind()` always returns either a function component or a class (a `ComponentType`, i.e. a
 * component constructor)
 */
export type KindComponent = ComponentType & {
	computed?: CallbackObject;
	defaultProps?: CallbackObject;
	inline?: ComputedPropFunction;
};

export interface ComputedPropFunction {
	(props: CallbackObject, context: Context<any>): any;
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
	render: RenderFunction;
}

export interface FunctionalKindConfig extends Omit<KindConfig, 'functional' | 'render'> {
	useRender: RenderFunction;
}
