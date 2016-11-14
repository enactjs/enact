/**
 * Exports the {@link module:@enact/ui/Portal.PortalDecorator} Higher-order Component (HOC).
 *
 * @module @enact/ui/Portal/PortalDecorator
 */

import hoc from '@enact/core/hoc';
import React from 'react';

const defaultConfig = {
	/**
	 * Element Id of the portal
	 * @type {String}
	 */
	portalId: 'portal'
};

/**
 * Higher-order Component that adds a Portal adjacent to wrapped component.
 * @type {Function}
 */
const PortalDecorator = hoc(defaultConfig, (config, Wrapped) => {
	return ({className, ...rest}) => (
		<div className={className}>
			<Wrapped {...rest} />
			<div id={config.portalId} />
		</div>
	);
});

export default PortalDecorator;
