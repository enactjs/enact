import hoc from '@enact/core/hoc';
import React from 'react';

const PortalDecorator = hoc((config, Wrapped) => {
	return (props) => (
		<div {...props}>
			<Wrapped />
			<div id='portal' />
		</div>
	);
});

export default PortalDecorator;
