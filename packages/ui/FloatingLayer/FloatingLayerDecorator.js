/*
 * A higher-order component that adds a FloatingLayer adjacent to wrapped component.
 */

import {call, forEventProp, oneOf} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import Registry from '@enact/core/internal/Registry';
import React from 'react';

const forAction = forEventProp('action');

const FloatingLayerContext = React.createContext();

/**
 * Default config for {@link ui/FloatingLayer.FloatingLayerDecorator}.
 *
 * @memberof ui/FloatingLayer.FloatingLayerDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Element Id of the floatLayer
	 *
	 * @type {String}
	 * @default 'floatLayer'
	 * @public
	 * @memberof ui/FloatingLayer.FloatingLayerDecorator.defaultConfig
	 */
	floatLayerId: 'floatLayer',

	/**
	 * Class name to be applied to wrapped component.

	 * It can be used when you want to only apply
	 * certain styles to the wrapped component and not to the float layer.
	 *
	 * @type {String}
	 * @default ''
	 * @public
	 * @memberof ui/FloatingLayer.FloatingLayerDecorator.defaultConfig
	 */
	wrappedClassName: ''
};

/**
 * A higher-order component that adds a FloatingLayer adjacent to wrapped component.
 *
 * @class FloatingLayerDecorator
 * @memberof ui/FloatingLayer
 * @hoc
 * @public
 */
const FloatingLayerDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {floatLayerId, wrappedClassName} = config;

	return class extends React.Component {
		static displayName = 'FloatingLayerDecorator'

		constructor (props) {
			super(props);
			this.registry = Registry.create(this.handleNotify);
			this.floatingLayer = null;
		}

		componentDidMount () {
			this.notifyMount();
		}

		getFloatingLayer = () => {
			// FIXME: if a component that resides in the floating layer is rendered at the same time
			// as the floating layer, this.floatingLayer may not have been initialized yet since
			// componentDidMount runs inside-out. As a fallback, we search by id but this could
			// introduce issues (e.g. for duplicate layer ids).
			return (
				this.floatingLayer ||
				(typeof document !== 'undefined' && document.getElementById(floatLayerId)) ||
				null
			);
		}

		handleNotify = oneOf(
			[forAction('register'), call('notifyMount')],
			[forAction('closeAll'), call('handleCloseAll')]
		).bind(this)

		handleCloseAll () {
			this.registry.notify({action: 'close'});
		}

		notifyMount () {
			this.registry.notify({
				action: 'mount',
				floatingLayer: this.getFloatingLayer()
			});
		}

		setFloatingLayer = (node) => {
			this.floatingLayer = node;
		}

		render () {
			const {className, ...rest} = this.props;
			return (
				<FloatingLayerContext.Provider value={this.registry.register}>
					<div className={className}>
						<Wrapped key="floatWrapped" {...rest} className={wrappedClassName} />
						<div id={floatLayerId} key="floatLayer" ref={this.setFloatingLayer} />
					</div>
				</FloatingLayerContext.Provider>
			);
		}
	};
});

export default FloatingLayerDecorator;
export {
	FloatingLayerContext,
	FloatingLayerDecorator
};
