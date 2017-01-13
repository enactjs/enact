/**
 * Exports the {@link moonstone/Dialog.Dialog} and {@link moonstone/Dialog.DialogBase} components.
 * The default export is {@link moonstone/Dialog.Dialog}.
 *
 * @module moonstone/Dialog
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';
import Slottable from '@enact/ui/Slottable';
import {MarqueeController, MarqueeDecorator} from '../Marquee';
import Popup from '../Popup';
import Uppercase from '@enact/i18n/Uppercase';
import css from './Dialog.less';

const MarqueeH1 = Uppercase(MarqueeDecorator('h1'));

/**
 * {@link moonstone/Dialog.DialogBase} is a modal component with a title, a subtitle, a
 * message, and an area for additional controls.
 *
 * @class DialogBase
 * @memberof moonstone/Dialog
 * @ui
 * @public
 */
const DialogBase = kind({
	name: 'Dialog',

	propTypes: /** @lends moonstone/Dialog.DialogBase.prototype */ {
		/**
		 * Buttons, typically to close or take action in the dialog.
		 *
		 * @type {Node}
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
		 * When `true`, the dialog will not animate on/off screen.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAnimation: PropTypes.bool,

		/**
		 * A function to be run when a closing action is invoked by the user. These actions include
		 * pressing `ESC` key or clicking on the close button. It is the responsibility of the
		 * callback to set the `open` property to `false`.
		 *
		 * @type {Function}
		 * @public
		 */
		onClose: PropTypes.func,

		/**
		 * A function to be run after transition for hiding is finished.
		 *
		 * @type {Function}
		 * @public
		 */
		onHide: PropTypes.func,

		/**
		 * When `true`, the control is in the expanded state with the contents visible
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		open: PropTypes.bool,

		/**
		 * When `true`, the case of the text will be as it is in the title
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		preserveCase: PropTypes.bool,

		/**
		 * Types of scrim. It can be either `'transparent'`, `'translucent'`, or `'none'`.
		 *
		 * @type {String}
		 * @default 'translucent'
		 * @public
		 */
		scrimType: React.PropTypes.oneOf(['transparent', 'translucent', 'none']),

		/**
		 * When `true`, the close button is shown; when `false`, it is hidden.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		showCloseButton: PropTypes.bool,

		/**
		 * When `true`, a divider line separates the title from the dialog body
		 *
		 * @type {Boolean}
		 * @public
		 */
		showDivider: PropTypes.bool,

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
		titleBelow: PropTypes.string
	},

	defaultProps: {
		noAnimation: false,
		open: false,
		preserveCase: false,
		showCloseButton: false
	},

	styles: {
		css,
		className: 'dialog'
	},

	computed: {
		className: ({showDivider, styler}) => styler.append({showDivider})
	},

	render: ({buttons, children, preserveCase, title, titleBelow, ...rest}) => {
		delete rest.showDivider;

		return (
			<Popup {...rest}>
				<div className={css.titleWrapper}>
					<MarqueeH1 preserveCase={preserveCase} marqueeOn='render' marqueeOnRenderDelay={5000} className={css.title}>
						{title}
					</MarqueeH1>
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
 * @memberof moonstone/Dialog
 * @mixes ui/Slottable.Slottable
 * @ui
 * @public
 */
const Dialog = Slottable({slots: ['title', 'titleBelow', 'buttons']}, MarqueeController({startOnMouseEnter:true}, DialogBase));

export default Dialog;
export {Dialog, DialogBase};
