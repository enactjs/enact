/*
 * Exports the {@link ui/FloatingLayer.FloatingLayerDecorator} Higher-order Component (HOC).
 */

import hoc from '@enact/core/hoc';
import PropTypes from 'prop-types';
import React from 'react';

const contextTypes = {
	getFloatingLayer: PropTypes.func,
	getRootFloatingLayer: PropTypes.func
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

		getChildContext () {
			return {
				getFloatingLayer: this.getFloatingLayer,
				getRootFloatingLayer: this.getRootFloatingLayer
			};
		}

		getFloatingLayer = () => {
			return this.floatingLayer || document.getElementById(floatLayerId) || null;
		}

		getRootFloatingLayer = () => {
			if (this.context.getRootFloatingLayer) {
				return this.context.getRootFloatingLayer();
			}

			return this.getFloatingLayer();
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
