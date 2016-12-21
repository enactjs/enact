import kind from '@enact/core/kind';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';

import css from './VideoPlayer.less';

const OverlayBase = kind({
	name: 'Overlay',

	propTypes: {
		children: React.PropTypes.node
	},

	styles: {
		css,
		className: 'overlay'
	},

	render: (props) => (
		<div {...props} />
	)
});

const Overlay = onlyUpdateForKeys(['children'])(OverlayBase);

export default Overlay;
export {
	Overlay,
	OverlayBase
};
