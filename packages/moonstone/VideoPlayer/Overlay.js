import kind from '@enact/core/kind';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';

import css from './VideoPlayer.less';

/**
 * Overlay {@link moonstone/VideoPlayer}. This covers the Video piece of the
 * {@link moonstone/VideoPlayer} to prevent unnecessary VideoPlayer repaints due to mouse-moves.
 * It also acts as a container for overlaid elements, like the {@link moonstone/Spinner}.
 *
 * @class Overlay
 * @memberof moonstone/VideoPlayer
 * @ui
 * @private
 */
const OverlayBase = kind({
	name: 'Overlay',

	propTypes: /** @lends moonstone/VideoPlayer.Overlay.prototype */ {
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
