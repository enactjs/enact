import kind from '@enact/core/kind';
import Touchable from '../Touchable';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';
import PropTypes from 'prop-types';

import css from './MediaPlayer.module.less';

/**
 * Overlay {@link ui/MediaPlayer}. This covers the Media piece of the
 * {@link ui/MediaPlayer} to prevent unnecessary MediaPlayer repaints due to mouse-moves.
 * It also acts as a container for overlaid elements, like the {@link ui/Spinner}.
 *
 * @class Overlay
 * @memberof ui/MediaPlayer
 * @ui
 * @private
 */
const OverlayBase = kind({
	name: 'Overlay',

	propTypes: /** @lends ui/MediaPlayer.Overlay.prototype */ {
		bottomControlsVisible: PropTypes.bool,
		children: PropTypes.node
	},

	styles: {
		css,
		className: 'overlay'
	},

	render: (props) => {
		return <div {...props} />;
	}
});

const Overlay = onlyUpdateForKeys(['bottomControlsVisible', 'children'])(
	Touchable(
		OverlayBase
	)
);

export default Overlay;
export {
	Overlay,
	OverlayBase
};
