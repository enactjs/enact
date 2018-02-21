import deprecate from '@enact/core/internal/deprecate';
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
 * @deprecated since 1.14.0. Will be removed in 2.0.0
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

const deprecatedOverlayBase = deprecate(Overlay, {name: 'moonstone/Item.OverlayBase', since: '1.14.0', until: '2.0.0'});
const deprecatedOverlay = deprecate(Overlay, {name: 'moonstone/Item.Overlay', since: '1.14.0', until: '2.0.0'});

export default deprecatedOverlay;
export {
	deprecatedOverlay as Overlay,
	Overlay as privateOverlay,
	deprecatedOverlayBase as OverlayBase,
	OverlayBase as privateOverlayBase
};
