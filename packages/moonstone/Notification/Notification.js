/**
 * Exports the {@link moonstone/Notification.Notification} and {@link moonstone/Notification.NotificationBase}
 * components. The default export is {@link moonstone/Notification.Notification}.
 *
 * @module moonstone/Notification
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Slottable from '@enact/ui/Slottable';

import Popup from '../Popup';

import componentCss from './Notification.less';

/**
 * {@link moonstone/Notification.NotificationBase} is a toast-like minimal popup that comes up
 * from the bottom of the screen. It requires a button to be provided and present to close it.
 *
 * @class NotificationBase
 * @memberof moonstone/Notification
 * @ui
 * @public
 */
const NotificationBase = kind({
	name: 'Notification',

	propTypes: /** @lends moonstone/Notification.NotificationBase.prototype */ {
		/**
		 * Buttons, typically to close or take action in the Notification. Buttons must have their
		 * `small` property set and will be coerced to `small` if not specified.
		 *
		 * @type {Element|Element[]}
		 * @public
		 */
		buttons: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.arrayOf(PropTypes.element)
		]),

		/**
		 * The contents to be displayed in the body of the Notification.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `notification` - The root class name
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * When `true`, the popup will not close when the user presses `ESC` key.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAutoDismiss: PropTypes.bool,

		/**
		 * A function to be run when a closing action is invoked by the user. These actions include
		 * pressing `ESC` key or clicking on the close button. It is the responsibility of the
		 * callback to set the `open` state to false.
		 *
		 * @type {Function}
		 * @public
		 */
		onClose: PropTypes.func,

		/**
		 * Is this control in the expanded state (true), opened, with the contents visible?
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		open: PropTypes.bool,

		/**
		 * Types of scrim. It can be either `'transparent'`, `'translucent'`, or `'none'`.
		 *
		 * @type {String}
		 * @default 'transparent'
		 * @public
		 */
		scrimType: PropTypes.oneOf(['transparent', 'translucent', 'none'])
	},

	defaultProps: {
		open: false,
		scrimType: 'transparent'
	},

	styles: {
		css: componentCss,
		className: 'notification',
		publicClassNames: ['notification']
	},

	computed: {
		className: ({className, buttons, styler}) => {
			if (buttons && buttons.length > 3) {
				return styler.append({wide: true});
			} else {
				return className;
			}
		},
		buttons: ({buttons}) => React.Children.map(buttons, (button) => {
			if (button && button.props && !button.props.small) {
				return React.cloneElement(button, {small: true});
			} else {
				return button;
			}
		})
	},

	render: ({buttons, children, css, ...rest}) => {
		return (
			<Popup noAnimation {...rest}>
				<div className={css.body}>
					{children}
				</div>
				{buttons ? <div className={css.buttons}>
					{buttons}
				</div> : null}
			</Popup>
		);
	}
});


/**
 * {@link moonstone/Notification.Notification} is modal component with a message, and an area
 * for additional controls.
 *
 * @class Notification
 * @memberof moonstone/Notification
 * @mixes ui/Slottable.Slottable
 * @ui
 * @public
 */
const Notification = Slottable({slots: ['buttons']}, NotificationBase);

export default Notification;
export {Notification, NotificationBase};
