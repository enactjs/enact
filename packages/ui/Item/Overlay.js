/**
 * Provides unstyled Overlay components and behaviors to be customized by a theme or application.
 *
 * @module ui/Overlay
 * @exports Overlay
 * @exports OverlayBase
 * @exports OverlayDecorator
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import ComponentCSS from './Overlay.less';

/**
 * {@link ui/Item.Overlay} is an unstyled component to overlay content, typically icons over an item
 * {@link ui/Item.ItemOverlay}.
 *
 * @class Overlay
 * @memberof ui/Item
 * @ui
 * @public
 */
const OverlayBase = kind({
	name: 'ui:Overlay',

	propTypes: /** @lends ui/Item.Overlay.prototype */ {
		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `overlay` - The root component class
		 * * `hidden` - Applied when `hidden` prop is true
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

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
		css: ComponentCSS,
		className: 'overlay'
	},

	computed: {
		className: ({hidden, styler}) => styler.append({hidden})
	},

	render: ({css, ...rest}) => {
		if (!rest.children) return null;

		delete rest.hidden;
		return (
			<div
				css={css}
				{...rest}
			/>
		);
	}
});

const Overlay = OverlayBase;
const OverlayDecorator = (Wrapped) => Wrapped;

export default Overlay;
export {
	Overlay,
	OverlayBase,
	OverlayDecorator
};
