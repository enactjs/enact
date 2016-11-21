/* //TODO: JSDOC revisit
 * Exports the {@link ui/Portal.PortalDecorator} Higher-order Component (HOC).
 *
 * @module ui/Portal/PortalDecorator
 */

import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import React from 'react';

/**
 * Default config for {@link ui/Portal.PortalDecorator}.
 *
 * @memberof ui/Portal/PortalDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Element Id of the portal
	 *
	 * @type {String}
	 * @default 'portal'
	 * @public
	 */
	portalId: 'portal'
};

/**
 * Higher-order Component that adds a Portal adjacent to wrapped component.
 *
 * @class PortalDecorator
 * @memberof ui/PortalDecorator
 * @ui
 * @public
 */
const PortalDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {portalId} = config;

	return kind({
		name: 'PortalDecorator',

		render: ({className, ...rest}) => (
			<div className={className}>
				<Wrapped {...rest} />
				<div id={portalId} />
			</div>
		)
	});
});

export default PortalDecorator;
