/* //TODO: JSDOC revisit
 * Exports the {@link ui/FloatLayer.FloatLayerDecorator} Higher-order Component (HOC).
 *
 * @module ui/FloatLayer/FloatLayerDecorator
 */

import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import React from 'react';

/**
 * Default config for {@link ui/FloatLayer.FloatLayerDecorator}.
 *
 * @memberof ui/FloatLayer/FloatLayerDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Element Id of the floatLayer
	 *
	 * @type {String}
	 * @default 'floatLayer'
	 * @public
	 */
	floatLayerId: 'floatLayer'
};

/**
 * Higher-order Component that adds a FloatLayer adjacent to wrapped component.
 *
 * @class FloatLayerDecorator
 * @memberof ui/FloatLayerDecorator
 * @ui
 * @public
 */
const FloatLayerDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {floatLayerId} = config;

	return kind({
		name: 'FloatLayerDecorator',

		render: ({className, ...rest}) => (
			<div className={className}>
				<Wrapped {...rest} />
				<div id={floatLayerId} />
			</div>
		)
	});
});

export default FloatLayerDecorator;
