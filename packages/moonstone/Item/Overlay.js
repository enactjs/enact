import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Pure from '@enact/ui/internal/Pure';

import css from './Overlay.less';

/**
 * {@link moonstone/Item.Overlay} is the component inserted into each side of an
 * {@link moonstone/Item.ItemOverlay}.
 *
 * @class Overlay
 * @memberof moonstone/Item
 * @ui
 * @public
 */
const OverlayBase = kind({
	name: 'Overlay',

	propTypes: /** @lends moonstone/Item.Overlay.prototype */ {
		/**
		 * When `true`, the component is no longer visually reprenested on screen.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		hidden: PropTypes.bool
	},

	defaultProps: {
		hidden: false
	},

	styles: {
		css,
		className: 'overlay'
	},

	computed: {
		className: ({hidden, styler}) => styler.append({hidden})
	},

	render: (props) => {
		if (!props.children) return null;

		delete props.hidden;
		return (
			<div {...props} />
		);
	}
});

const Overlay = Pure(
	OverlayBase
);

export default Overlay;
export {
	Overlay,
	OverlayBase
};
