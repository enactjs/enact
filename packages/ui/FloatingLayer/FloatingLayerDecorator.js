/*
 * Exports the {@link ui/FloatingLayer.FloatingLayerDecorator} Higher-order Component (HOC).
 */

import hoc from '@enact/core/hoc';
import PropTypes from 'prop-types';
import React from 'react';

const contextTypes = {
	renderIntoFloatingLayer: PropTypes.func,
	unmountAllFromFloatingLayer: PropTypes.func,
	unmountFromFloatingLayer: PropTypes.func
};

/**
 * Default config for {@link ui/FloatingLayer.FloatingLayerDecorator}.
 *
 * @memberof ui/FloatingLayer.FloatingLayerDecorator
 * @hocconfig
 */
const defaultConfig = {
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

		constructor () {
			super();

			this.state = {
				layers: []
			};
		}

		getChildContext () {
			return {
				renderIntoFloatingLayer: this.renderIntoFloatingLayer,
				unmountAllFromFloatingLayer: this.unmountAllFromFloatingLayer,
				unmountFromFloatingLayer: this.unmountFromFloatingLayer
			};
		}

		unmountAllFromFloatingLayer = () => {
			this.setState(() => {
				return {
					layers: []
				};
			});
		}

		renderIntoFloatingLayer = (instance, element) => {
			this.setState(state => {
				const index = state.layers.findIndex(layer => layer.instance === instance);

				if (index === -1) {
					return {
						layers: [...state.layers, {instance, element}]
					};
				}

				return null;
			});
		}

		unmountFromFloatingLayer = (instance) => {
			this.setState(state => {
				const index = state.layers.findIndex(layer => layer.instance === instance);

				if (index !== -1) {
					const layers = [...state.layers];
					layers.splice(index, 1);

					return {
						layers
					};
				}

				return null;
			});
		}

		handleScroll = (ev) => {
			const {currentTarget} = ev;

			currentTarget.scrollTop = 0;
			currentTarget.scrollLeft = 0;
		}

		render () {
			const {className, ...rest} = this.props;
			return (
				<div className={className}>
					<Wrapped {...rest} className={wrappedClassName} />
					<div
						className="enact-fit enact-clip enact-untouchable"
						onScroll={this.handleScroll}
						style={{zIndex: 100}}
					>
						{this.state.layers.map(layer => layer.element)}
					</div>
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
