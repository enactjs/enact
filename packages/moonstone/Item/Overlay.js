import kind from '@enact/core/kind';
import React from 'react';

import css from './Overlay.less';

/**
 * {@link moonstone/ItemOverlay.Overlay} is the component inserted into an
 * {@link module:@enact/moonstone/ItemOverlay~ItemOverlay} on both sides.
 *
 * @class ItemBase
 * @memberof moonstone/Item
 * @ui
 * @public
 */
const OverlayBase = kind({
	name: 'Overlay',

	propTypes: /** @lends moonstone/Item.ItemBase.prototype */ {
		/**
		 * When `true`, the component is no longer visually reprenested on screen.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		hidden: React.PropTypes.bool
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

export default OverlayBase;
export {
	OverlayBase as Overlay,
	OverlayBase
};
