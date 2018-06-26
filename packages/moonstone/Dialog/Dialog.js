/**
 * Exports the {@link moonstone/Dialog.Dialog} and {@link moonstone/Dialog.DialogBase} components.
 * The default export is {@link moonstone/Dialog.Dialog}.
 *
 * @module moonstone/Dialog
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Slottable from '@enact/ui/Slottable';
import Uppercase from '@enact/i18n/Uppercase';

import {MarqueeDecorator} from '../Marquee';
import Popup from '../Popup';

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
		 * @type {Element|Element[]}
		 * @public
		 */
		buttons: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.arrayOf(PropTypes.element)
		]),

		/**
		 * Configures the mode of uppercasing of the `title` that should be performed.
		 *
		 * @see i18n/Uppercase#casing
		 * @type {String}
		 * @default 'upper'
		 * @public
		 */
		casing: PropTypes.oneOf(['upper', 'preserve', 'word', 'sentence']),

		/**
		 * The contents to be displayed in the body of the Dialog.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * When `true`, the dialog will not animate on/off screen.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAnimation: PropTypes.bool,

		/**
		 * When `true`, a divider line will not separate the title from the dialog body.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noDivider: PropTypes.bool,

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
		 * When `true`, the control is in the expanded state with the contents visible.
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
		 * @default 'translucent'
		 * @public
		 */
		scrimType: PropTypes.oneOf(['transparent', 'translucent', 'none']),

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
		 * Text displayed below the title.
		 *
		 * @type {String}
		 * @public
		 */
		titleBelow: PropTypes.string
	},

	defaultProps: {
		noAnimation: false,
		noDivider: false,
		open: false,
		showCloseButton: false
	},

	styles: {
		css,
		className: 'dialog'
	},

	computed: {
		className: ({noDivider, styler}) => styler.append({showDivider: !noDivider})
	},

	render: ({buttons, casing, children, title, titleBelow, ...rest}) => {
		delete rest.noDivider;

		return (
			<Popup {...rest}>
				<div className={css.titleWrapper}>
					<div className={css.titleBlock}>
						<MarqueeH1 casing={casing} marqueeOn="render" marqueeOnRenderDelay={5000} className={css.title}>
							{title}
						</MarqueeH1>
						<h2 className={css.titleBelow}>
							{titleBelow}
						</h2>
					</div>
					<div className={css.buttons}>
						{buttons}
					</div>
				</div>
				<div className={css.body}>
					{children}
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
const Dialog = Slottable(
	{slots: ['title', 'titleBelow', 'buttons']},
	DialogBase
);

export default Dialog;
export {Dialog, DialogBase};
