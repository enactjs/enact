/**
 * Exports the {@link moonstone/Dialog.Dialog} and {@link moonstone/Dialog.DialogBase} component.
 * The default export is {@link moonstone/Dialog.Dialog}.
 *
 * @module moonstone/Dialog
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';
import Slottable from '@enact/ui/Slottable';

import Popup from '../Popup';

import css from './Dialog.less';

/**
 * {@link moonstone/Dialog.DialogBase} is a modal component with a title, a subtitle, a
 * message, and an area for additional controls.
 *
 * @class DialogBase
 * @memberOf moonstone/Dialog
 * @ui
 * @public
 */
const DialogBase = kind({
	name: 'Dialog',

	propTypes: /** @lends moonstone/Dialog.DialogBase.prototype */ {
		/**
		 * Buttons, typically to close or take action in the dialog.
		 *
		 * @type {React.node}
		 * @public
		 */
		buttons: PropTypes.oneOfType([
			PropTypes.arrayOf(PropTypes.element),
			PropTypes.element
		]),

		/**
		 * The element(s) to be displayed in the body of the Dialog.
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
		 * A function to run when close button is clicked.
		 *
		 * @type {Function}
		 * @public
		 */
		onCloseButtonClicked: PropTypes.func,

		/**
		 * A function to run after transition for hiding is finished.
		 *
		 * @type {Function}
		 * @public
		 */
		onHide: PropTypes.func,

		/**
		 * Is this control in the expanded state (true), opened, with the contents visible?
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		open: PropTypes.bool,

		/**
		 * When `true`, the close button is shown; when `false`, it is hidden.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		showCloseButton: PropTypes.bool,
		/**
		 * Title of the header
		 *
		 * @type {String}
		 * @public
		 */
		title: PropTypes.string,

		/**
		 * Text displayed below the title
		 *
		 * @type {String}
		 * @public
		 */
		titleBelow: PropTypes.string,

		/**
		 * Should the dialog use a divider line to separate the titles from the dialog body?
		 *
		 * @type {Boolean}
		 * @public
		 */
		useDivider: PropTypes.bool
	},

	defaultProps: {
		anchor: {bottom: 0},
		noAnimation: false,
		open: false,
		showCloseButton: false
	},

	styles: {
		css,
		className: 'dialog'
	},

	computed: {
		className: ({useDivider, styler}) => styler.append({useDivider})
	},

	render: ({buttons, children, title, titleBelow, ...rest}) => {
		delete rest.useDivider;

		return (
			<Popup {...rest}>
				<div className={css.titleWrapper}>
					<h1 className={css.title}>
						{title}
					</h1>
					<h2 className={css.titleBelow}>
						{titleBelow}
					</h2>
				</div>
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
 * {@link moonstone/Dialog.Dialog} is modal component with a title, a subtitle, a
 * message, and an area for additional controls.
 *
 * @class Dialog
 * @memberOf moonstone/Dialog
 * @mixes ui/Slottable.Slottable
 * @ui
 * @public
 */
const Dialog = Slottable({slots: ['title', 'titleBelow', 'buttons']}, DialogBase);

export default Dialog;
export {Dialog, DialogBase};
