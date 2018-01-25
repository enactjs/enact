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

import componentCSS from './Item.less';

/**
 * An unstyled component to overlay content, typically icons on an [Item]{@link ui/Item.ItemOverlay}.
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
		css: componentCSS,
		className: 'overlay',
		publicClassNames: true
	},

	computed: {
		className: ({hidden, styler}) => styler.append({hidden})
	},

	render: (props) => {
		if (!props.children) return null;

		delete props.hidden;
		return (
			<div
				{...props}
			/>
		);
	}
});

export default OverlayBase;
export {
	OverlayBase as Overlay
};
