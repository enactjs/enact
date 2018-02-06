// This is a sub-component to ui/Item, so it does not have a @module declaration
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import componentCss from './Overlay.less';

/**
 * An unstyled component to overlay content, typically icons on an [Item]{@link ui/Item.ItemOverlay}.
 *
 * @class Overlay
 * @memberof ui/Item
 * @ui
 * @public
 */
const Overlay = kind({
	name: 'ui:Overlay',

	propTypes: /** @lends ui/Item.Overlay.prototype */ {
		/**
		 * The contents of this overlay component. Without `children`, this component will output no
		 * DOM, so it doesn't interfere with layouts in case of this being blank.
		 *
		 * @type {[type]}
		 */
		children: PropTypes.node,

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
		css: componentCss,
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

export default Overlay;
export {
	Overlay
};
