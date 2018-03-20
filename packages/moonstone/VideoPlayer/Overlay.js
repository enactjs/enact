import kind from '@enact/core/kind';
import Touchable from '@enact/ui/Touchable';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';
import PropTypes from 'prop-types';

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
		bottomControlsVisible: PropTypes.bool,
		children: PropTypes.node
	},

	styles: {
		css,
		className: 'overlay'
	},

	computed: {
		className: ({bottomControlsVisible, styler}) => styler.append({['high-contrast-scrim']: bottomControlsVisible})
	},

	render: (props) => {
		delete props.bottomControlsVisible;
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
