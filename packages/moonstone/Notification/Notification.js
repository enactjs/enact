/**
 * Moonstone-styled Notification components.
 *
 * @module moonstone/Notification
 * @exports Notification
 * @exports NotificationBase
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Slottable from '@enact/ui/Slottable';

import Popup from '../Popup';

import componentCss from './Notification.less';

/**
 * A Moonstone styled notification component. It provides a notification modal which can be opened
 * and closed, overlaying an app. Apps will want to use {@link moonstone/Notification.Notification}.
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
		 * Buttons for the Notification.
		 *
		 * These typically close or take action in the Notification. Buttons must have their
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
		 * The contents for the body of the Notification.
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
		 * Indicates that the notification will not trigger `onClose` on the *ESC* key press.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAutoDismiss: PropTypes.bool,

		/**
		 * Called when a closing action is invoked by the user.
		 *
		 * These actions include pressing *ESC* key or clicking on the close button. It is the
		 * responsibility of the callback to set the `open` state to `false`.
		 *
		 * @type {Function}
		 * @public
		 */
		onClose: PropTypes.func,

		/**
		 * Controls the visibility of the Notification.
		 *
		 * By default, the Notification and its contents are not rendered until `open`.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		open: PropTypes.bool,

		/**
		 * Determines the technique used to cover the screen when the notification is present.
		 *
		 * * Values: `'transparent'`, `'translucent'`, or `'none'`.
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
 * A Moonstone styled modal component with a message, and an area for additional controls.
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
