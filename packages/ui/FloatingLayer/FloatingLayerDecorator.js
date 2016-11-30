/* //TODO: JSDOC revisit
 * Exports the {@link ui/FloatingLayer.FloatingLayerDecorator} Higher-order Component (HOC).
 *
 * @module ui/FloatingLayer/FloatingLayerDecorator
 */

import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import React from 'react';

/**
 * Default config for {@link ui/FloatingLayer/FloatingLayerDecorator.FloatingLayerDecorator}.
 *
 * @memberof ui/FloatingLayer/FloatingLayerDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Element Id of the floatLayer
	 *
	 * @type {String}
	 * @default 'floatLayer'
	 * @public
	 * memberof ui/FloatingLayer/FloatingLayerDecorator.defaultConfig
	 */
	floatLayerId: 'floatLayer'
};

/**
 * Higher-order Component that adds a FloatingLayer adjacent to wrapped component.
 *
 * @class FloatingLayerDecorator
 * @memberof ui/FloatingLayer/FloatingLayerDecorator
 * @hoc
 * @public
 */
const FloatingLayerDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {floatLayerId} = config;

	return kind({
		name: 'FloatingLayerDecorator',

		render: ({className, ...rest}) => (
			<div className={className}>
				<Wrapped {...rest} />
				<div id={floatLayerId} />
			</div>
		)
	});
});

export default FloatingLayerDecorator;
