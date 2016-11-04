/**
 * Exports the {@link module:@enact/ui/Portal~PortalDecorator} Higher-order Component (HOC).
 *
 * @module @enact/ui/Portal/PortalDecorator
 */

import hoc from '@enact/core/hoc';
import React from 'react';

/**
 * Higher-order Component that adds a Portal adjacent to wrapped component.
 * @type {Function}
 */
const PortalDecorator = hoc((config, Wrapped) => {
	return ({className, ...rest}) => (
		<div className={className}>
			<Wrapped {...rest} />
			<div id='portal' />
		</div>
	);
});

export default PortalDecorator;
