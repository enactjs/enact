/*
 * Exports the {@link ui/FloatingLayer.FloatingLayerDecorator} Higher-order Component (HOC).
 */

import hoc from '@enact/core/hoc';
import PropTypes from 'prop-types';
import React from 'react';

const contextTypes = {
	closeAllFloatingLayers: PropTypes.func,
	getFloatingLayer: PropTypes.func,
	getRootFloatingLayer: PropTypes.func,
	registerFloatingLayer: PropTypes.func,
	unregisterFloatingLayer: PropTypes.func
};

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
	 * Classname applied to wrapped component. It can be used when you want to only apply
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
 * Higher-order Component that adds a FloatingLayer adjacent to wrapped component.
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

		static contextTypes = contextTypes

		static childContextTypes = contextTypes

		constructor (props) {
			super(props);
			this.floatingLayer = null;
			this.layers = [];
		}

		getChildContext () {
			return {
				closeAllFloatingLayers: this.handleCloseAll,
				getFloatingLayer: this.getFloatingLayer,
				getRootFloatingLayer: this.getRootFloatingLayer,
				registerFloatingLayer: this.handleRegister,
				unregisterFloatingLayer: this.handleUnregister
			};
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

		getRootFloatingLayer = () => {
			if (this.context.getRootFloatingLayer) {
				return this.context.getRootFloatingLayer();
			}

			return this.getFloatingLayer();
		}

		handleCloseAll = () => {
			this.layers.forEach(({component, close}) => {
				if (component) {
					close.call(component);
				}
			});
		}

		handleRegister = (component, handlers) => {
			this.layers.push({
				component,
				...handlers
			});
		}

		handleUnregister = (component) => {
			for (let i = 0; i < this.layers.length; i++) {
				if (this.layers[i].component === component) {
					this.layers.splice(i, 1);
					break;
				}
			}
		}

		setFloatingLayer = (node) => {
			this.floatingLayer = node;
		}

		render () {
			const {className, ...rest} = this.props;
			return (
				<div className={className}>
					<Wrapped {...rest} className={wrappedClassName} />
					<div id={floatLayerId} ref={this.setFloatingLayer} />
				</div>
			);
		}
	};
});

export default FloatingLayerDecorator;
export {
	contextTypes,
	FloatingLayerDecorator
};
