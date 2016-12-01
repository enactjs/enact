/**
 * Exports the {@link moonstone/Notification.Notification} and {@link moonstone/Notification.NotificationBase}
 * component. The default export is {@link moonstone/Notification.Notification}.
 *
 * @module moonstone/Notification
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';
import Slottable from '@enact/ui/Slottable';

import Popup from '../Popup';

import css from './Notification.less';

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
		 * Buttons, typically to close or take action in the Notification.
		 *
		 * @type {Node}
		 * @public
		 */
		buttons: PropTypes.oneOfType([
			PropTypes.arrayOf(PropTypes.element),
			PropTypes.element
		]).isRequired,

		/**
		 * The element(s) to be displayed in the body of the Notification.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.oneOfType([
			PropTypes.arrayOf(PropTypes.element),
			PropTypes.element
		]),

		/**
		 * When `true`, popups will not animate on/off screen.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAnimation: PropTypes.bool,

		/**
		 * Is this control in the expanded state (true), opened, with the contents visible?
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		open: PropTypes.bool,

		/**
		 * Types of scrim. It can be either `transparent` or `translucent`.
		 *
		 * @type {String}
		 * @default `translucent`
		 * @public
		 */
		scrimType: React.PropTypes.oneOf(['transparent', 'translucent'])
	},

	defaultProps: {
		noAnimation: true,
		open: false,
		scrimType: 'transparent'
	},

	styles: {
		css,
		className: 'notification'
	},

	computed: {
		className: ({className, buttons, styler}) => {
			if (buttons.length > 3) {
				return styler.append({wide: true});
			} else {
				return className;
			}
		},
		buttons: ({buttons}) => React.Children.map(buttons, (button) => {
			return React.cloneElement(button, {small: true});
		})
	},

	render: ({buttons, children, ...rest}) => {
		return (
			<Popup {...rest}>
				<div className={css.body}>
					{children}
				</div>
				<div className={css.buttons}>
					{buttons}
				</div>
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
