/*
 * Exports the {@link ui/FloatingLayer.FloatingLayerDecorator} Higher-order Component (HOC).
 */

import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import React from 'react';

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

	return kind({
		name: 'FloatingLayerDecorator',

		render: ({className, ...rest}) => (
			<div className={className}>
				<Wrapped {...rest} className={wrappedClassName} />
				<div id={floatLayerId} />
			</div>
		)
	});
});

export default FloatingLayerDecorator;
