import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import componentCss from './Overlay.less';

/**
 * {@link ui/Overlay.OverlayBaseFactory} is Factory wrapper around {@link ui/Overlay.OverlayBase}
 * that allows overriding certain classes at design time. The following are properties of the `css`
 * member of the argument to the factory.
 *
 * @class OverlayBaseFactory
 * @memberof ui/Overlay
 * @factory
 * @ui
 * @public
 */
const OverlayBaseFactory = factory({css: componentCss}, ({css}) => {
	/**
	 * {@link ui/Item.Overlay} is the component inserted into each side of an
	 * {@link ui/Item.ItemOverlay}.
	 *
	 * @class Overlay
	 * @memberof ui/Item
	 * @ui
	 * @public
	 */
	return kind({
		name: 'Overlay',

		propTypes: /** @lends ui/Item.Overlay.prototype */ {
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
});

const OverlayBase = OverlayBaseFactory();

export default OverlayBase;
export {
	OverlayBase as Overlay,
	OverlayBase,
	OverlayBaseFactory as OverlayFactory,
	OverlayBaseFactory
};
