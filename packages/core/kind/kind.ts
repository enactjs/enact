import invariant from 'invariant';
import {createContext, use, Component as ReactComponent, Context, ReactElement} from 'react';

import {CallbackObject} from '../types';
import useHandlers from '../useHandlers';
import Handlers from '../useHandlers/Handlers';
import {checkPropTypes, applyDefaultProps} from '../util';

import computed from './computed';
import styles from './styles';
import {ApplyDefaults, KindComponent, KindConfig} from './types';
import {bindInlineHandlers} from './util';

const NoContext: Context<any> = createContext(null);

const kind = <
	P extends CallbackObject = CallbackObject,
	C = {},
	D extends Partial<P> = {}
>(
	config: KindConfig<P, C, D>
): KindComponent<P, D> => {
	const {
		computed: cfgComputed,
		contextType = NoContext,
		defaultProps,
		functional,
		handlers,
		name,
		render,
		styles: cfgStyles
	} = config;

	invariant(typeof render === 'function', 'kind() requires a `render` function');

	const renderStyles = cfgStyles ? styles(cfgStyles) : false;
	const renderComputed = cfgComputed ? computed(cfgComputed) : false;

	const renderKind = (props: CallbackObject, context: Context<any>): ReactElement | null => {
		if (renderStyles && typeof renderStyles === 'function') props = renderStyles(props, context);
		if (renderComputed && typeof renderComputed === 'function') props = renderComputed(props, context);

		return render(props as unknown as ApplyDefaults<P, D> & C, context);
	};

	const defaultPropKeys = defaultProps ? Object.keys(defaultProps) : null;
	const handlerKeys = handlers ? Object.keys(handlers) : null;

	let Component: KindComponent;

	// In 4.x, this branch will become the only supported version and the class branch will be
	// removed.
	if (functional) {
		Component = function (props: CallbackObject) {
			const ctx: Context<any> = use(contextType);
			const componentHandlers = handlers || {};

			const boundHandlers = useHandlers(componentHandlers, props, ctx);

			const merged = {
				...props,
				...boundHandlers
			};

			if (defaultProps && Array.isArray(defaultPropKeys)) {
				applyDefaultProps(merged, defaultProps, defaultPropKeys);
			}

			checkPropTypes(Component, merged);

			return renderKind(merged, ctx);
		};
	} else {
		Component = class extends ReactComponent {
			static contextType = contextType;
			context = contextType;
			handlers;

			constructor (props: CallbackObject) {
				super(props);
				checkPropTypes(this, props);

				this.handlers = new Handlers(handlers);
			}

			componentDidUpdate (prevProps: CallbackObject) {
				checkPropTypes(this, this.props, prevProps);
			}

			render () {
				this.handlers.setContext(this.props, this.context);

				const merged = {
					...this.props,
					...this.handlers.handlers
				};

				return renderKind(merged, this.context);
			}
		};
	}

	if (name) Component.displayName = name;;
	if (defaultProps) Component.defaultProps = defaultProps;

	// Decorate the Component with the computed property object in DEV for easier testability
	if (__DEV__ && cfgComputed) Component.computed = cfgComputed;

	Component.inline = (props: CallbackObject, context: Context<any>) => {
		const inlineDefaultProps = defaultProps || {};
		const inlineDefaultPropKeys = defaultPropKeys || [];
		const inlineHandlers = handlers || {};
		const inlineHandlerKeys = handlerKeys || [];

		const updated = applyDefaultProps({...props}, inlineDefaultProps, inlineDefaultPropKeys);

		return renderKind(bindInlineHandlers(updated, inlineHandlers, inlineHandlerKeys, context), context);
	};

	return Component as KindComponent<P, D>;
};

export default kind;
export { kind };